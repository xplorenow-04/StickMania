import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Loader, Plus } from "lucide-react";
import { productApi } from "../../api/product.api.js";
import { useProductStore } from "../../store/productStore.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import { categoryApi } from "../../api/category.api.js";
import toast from "react-hot-toast";

export default function ProductModal({ isOpen, onClose, productToEdit, onProductSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [trending, setTrending] = useState(false);

  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    const fetchCats = async () => {
      if (categories.length === 0) {
        const res = await categoryApi.getAll();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      }
    };
    if (isOpen) {
      fetchCats();
    }
  }, [isOpen, categories.length, setCategories]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price || "");
      setDiscount(productToEdit.discount || 0);
      setSelectedCategory(productToEdit.category?._id || productToEdit.category || "");
      setTagsInput(productToEdit.tags?.join(", ") || "");
      setFeatured(!!productToEdit.featured);
      setBestseller(!!productToEdit.bestseller);
      setTrending(!!productToEdit.trending);
      setExistingImages(productToEdit.images || []);
      setRemovedImageIds([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setDiscount(0);
      setSelectedCategory("");
      setTagsInput("");
      setFeatured(false);
      setBestseller(false);
      setTrending(false);
      setExistingImages([]);
      setRemovedImageIds([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length - removedImageIds.length > 5) {
      return toast.error("Maximum 5 images allowed per product");
    }

    const newFiles = [...newImageFiles, ...files];
    setNewImageFiles(newFiles);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...previews]);
  };

  const removeNewImage = (index) => {
    const files = [...newImageFiles];
    files.splice(index, 1);
    setNewImageFiles(files);

    const previews = [...newImagePreviews];
    URL.revokeObjectURL(previews[index]);
    previews.splice(index, 1);
    setNewImagePreviews(previews);
  };

  const markExistingImageRemoved = (publicId) => {
    setRemovedImageIds([...removedImageIds, publicId]);
  };

  const restoreExistingImage = (publicId) => {
    setRemovedImageIds(removedImageIds.filter((id) => id !== publicId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!price || parseFloat(price) <= 0) return toast.error("Valid price is required");
    if (!selectedCategory) return toast.error("Please select a category");

    const activeExistingCount = existingImages.length - removedImageIds.length;
    if (activeExistingCount + newImageFiles.length === 0) {
      return toast.error("Please upload at least one image");
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("discount", discount || 0);
    formData.append("category", selectedCategory);
    formData.append("tags", tagsInput);
    formData.append("featured", featured);
    formData.append("bestseller", bestseller);
    formData.append("trending", trending);

    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (productToEdit) {
        if (removedImageIds.length > 0) {
          formData.append("removeImages", JSON.stringify(removedImageIds));
        }

        const res = await productApi.update(productToEdit._id, formData);
        if (res.success && res.data) {
          toast.success("Product updated successfully");
          if (onProductSaved) onProductSaved(res.data);
          onClose();
        } else {
          toast.error(res.message || "Failed to update product");
        }
      } else {
        const res = await productApi.create(formData);
        if (res.success && res.data) {
          toast.success("Product created successfully");
          if (onProductSaved) onProductSaved(res.data);
          onClose();
        } else {
          toast.error(res.message || "Failed to create product");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl bg-white border border-gray-200 overflow-hidden shadow-modal my-8 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {productToEdit ? "Edit Sticker" : "Add New Sticker"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-all duration-150">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sticker Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Neon Hacker Cat"
                className="input-field"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field bg-white cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the sticker..."
              className="input-field h-24 resize-none"
              required
            />
          </div>

          {/* Pricing & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Base Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 99"
                className="input-field"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. 15"
                className="input-field"
              />
            </div>

            <div className="space-y-1.5 col-span-1 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="anime, cyberpunk, cute"
                className="input-field"
              />
            </div>
          </div>

          {/* Badges Checklist */}
          <div className="flex flex-wrap gap-6 py-2 px-4 rounded-lg bg-gray-50 border border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-white border-gray-300"
              />
              Featured Product
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={bestseller}
                onChange={(e) => setBestseller(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-white border-gray-300"
              />
              Bestseller
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-white border-gray-300"
              />
              Trending Product
            </label>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Product Images (Max 5)
            </label>

            {existingImages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-gray-400 font-bold">Existing Images:</span>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => {
                    const isRemoved = removedImageIds.includes(img.publicId);
                    return (
                      <div
                        key={img.publicId}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 transition-all duration-150 ${
                          isRemoved ? "opacity-30 border-red-400" : ""
                        }`}
                      >
                        <img src={img.url} alt="Existing" className="w-full h-full object-contain p-1" />
                        {isRemoved ? (
                          <button
                            type="button"
                            onClick={() => restoreExistingImage(img.publicId)}
                            className="absolute inset-0 bg-black/60 text-[10px] text-white font-semibold flex items-center justify-center hover:text-brand-300"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markExistingImageRemoved(img.publicId)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-all duration-150"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {newImagePreviews.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={url} alt="New Preview" className="w-full h-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-all duration-150"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {existingImages.length - removedImageIds.length + newImageFiles.length < 5 && (
                <div className="relative w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-brand-400 transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImagesChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Plus size={20} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500 mt-1 font-semibold">Upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs font-semibold px-4 py-2.5"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-brand text-xs font-bold flex items-center justify-center gap-1.5 px-6 py-2.5"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Saving...
                </>
              ) : productToEdit ? (
                "Update Sticker"
              ) : (
                "Create Sticker"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
