import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiUtils.js";
import { ApiResponse } from "../utils/apiUtils.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import {
  uploadFileOnCloudinary,
  deleteFileFromCloudinary,
} from "../services/cloudinary.service.js";

/**
 * GET /api/categories
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

/**
 * POST /api/categories   (admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    throw new ApiError(409, "Category already exists");
  }

  let image = { url: "", publicId: "" };
  if (req.file) {
    const uploaded = await uploadFileOnCloudinary(req.file.path, "image");
    if (uploaded && uploaded.success) {
      image = { url: uploaded.secure_url, publicId: uploaded.public_id };
    }
  }

  const category = await Category.create({ name: name.trim(), image });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

/**
 * PUT /api/categories/:id   (admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (name && name.trim() !== category.name) {
    const existing = await Category.findOne({ name: name.trim() });
    if (existing && existing._id.toString() !== id) {
      throw new ApiError(409, "Category name already taken");
    }
    category.name = name.trim();
  }

  if (req.file) {
    // Delete old image if exists
    if (category.image && category.image.publicId) {
      await deleteFileFromCloudinary(category.image.publicId);
    }
    const uploaded = await uploadFileOnCloudinary(req.file.path, "image");
    if (uploaded && uploaded.success) {
      category.image = { url: uploaded.secure_url, publicId: uploaded.public_id };
    }
  }

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

/**
 * DELETE /api/categories/:id   (admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if any products use this category
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete category. ${productCount} product(s) are using it.`
    );
  }

  // Delete image from Cloudinary
  if (category.image && category.image.publicId) {
    await deleteFileFromCloudinary(category.image.publicId);
  }

  await Category.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

export { getAllCategories, createCategory, updateCategory, deleteCategory };
