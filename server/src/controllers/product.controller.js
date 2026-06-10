import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiUtils.js";
import { ApiResponse } from "../utils/apiUtils.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import {
  uploadFileOnCloudinary,
  deleteFileFromCloudinary,
} from "../services/cloudinary.service.js";
import slugify from "slugify";

/**
 * GET /api/products
 * Query params: search, category, sort, page, limit, featured, bestseller, trending
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    sort = "latest",
    page = 1,
    limit = 12,
    featured,
    bestseller,
    trending,
  } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  if (featured === "true") filter.featured = true;
  if (bestseller === "true") filter.bestseller = true;
  if (trending === "true") filter.trending = true;

  let sortOption = {};
  if (sort === "latest") sortOption = { createdAt: -1 };
  else if (sort === "price_asc") sortOption = { price: 1 };
  else if (sort === "price_desc") sortOption = { price: -1 };
  else if (sort === "popular") sortOption = { bestseller: -1, createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      "Products fetched successfully"
    )
  );
});

/**
 * GET /api/products/:slug
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

/**
 * POST /api/products   (admin)
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discount, category, tags, featured, bestseller, trending } =
    req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "Name, description, price and category are required");
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(400, "Invalid category");
  }

  // Upload images to Cloudinary
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadFileOnCloudinary(file.path, "image");
      if (uploaded && uploaded.success) {
        images.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
      }
    }
  }

  const tagsArray = typeof tags === "string"
    ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : Array.isArray(tags) ? tags.map((t) => t.trim().toLowerCase()) : [];

  const product = await Product.create({
    name,
    description,
    price: parseFloat(price),
    discount: parseFloat(discount) || 0,
    category,
    tags: tagsArray,
    images,
    featured: featured === "true" || featured === true,
    bestseller: bestseller === "true" || bestseller === true,
    trending: trending === "true" || trending === true,
  });

  const populated = await product.populate("category", "name slug");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Product created successfully"));
});

/**
 * PUT /api/products/:id   (admin)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount, category, tags, featured, bestseller, trending, removeImages } =
    req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) throw new ApiError(400, "Invalid category");
  }

  // Remove images if requested
  if (removeImages) {
    const toRemove = typeof removeImages === "string" ? JSON.parse(removeImages) : removeImages;
    for (const publicId of toRemove) {
      await deleteFileFromCloudinary(publicId);
      product.images = product.images.filter((img) => img.publicId !== publicId);
    }
  }

  // Upload new images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadFileOnCloudinary(file.path, "image");
      if (uploaded && uploaded.success) {
        product.images.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
      }
    }
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = parseFloat(price);
  if (discount !== undefined) product.discount = parseFloat(discount);
  if (category) product.category = category;
  if (tags !== undefined) {
    product.tags = typeof tags === "string"
      ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : Array.isArray(tags) ? tags.map((t) => t.trim().toLowerCase()) : [];
  }
  if (featured !== undefined) product.featured = featured === "true" || featured === true;
  if (bestseller !== undefined) product.bestseller = bestseller === "true" || bestseller === true;
  if (trending !== undefined) product.trending = trending === "true" || trending === true;

  await product.save();
  const updated = await product.populate("category", "name slug");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Product updated successfully"));
});

/**
 * DELETE /api/products/:id   (admin)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Delete images from Cloudinary
  for (const image of product.images) {
    if (image.publicId) {
      await deleteFileFromCloudinary(image.publicId);
    }
  }

  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

export { getAllProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };
