import React, { useState, useEffect } from "react";
import { X, Upload, Loader } from "lucide-react";
import { categoryApi } from "../../api/category.api.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import toast from "react-hot-toast";

export default function CategoryModal({ isOpen, onClose, categoryToEdit }) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addCategory, updateCategory } = useCategoryStore();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setImagePreview(categoryToEdit.image?.url || "");
    } else {
      setName("");
      setImageFile(null);
      setImagePreview("");
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (categoryToEdit) {
        // Edit mode
        const res = await categoryApi.update(categoryToEdit._id, formData);
        if (res.success && res.data) {
          updateCategory(res.data);
          toast.success("Category updated successfully");
          onClose();
        } else {
          toast.error(res.message || "Failed to update category");
        }
      } else {
        // Create mode
        if (!imageFile) {
          setSubmitting(false);
          return toast.error("Please upload an image for the category");
        }
        const res = await categoryApi.create(formData);
        if (res.success && res.data) {
          addCategory(res.data);
          toast.success("Category created successfully");
          onClose();
        } else {
          toast.error(res.message || "Failed to create category");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl glass border border-white/10 bg-dark-900 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white font-display">
            {categoryToEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anime, Cyberpunk"
              className="input-field"
              required
            />
          </div>

          {/* Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Category Image
            </label>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-4 bg-dark-950/40 hover:border-purple-500/50 transition cursor-pointer relative overflow-hidden group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {imagePreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Upload size={20} className="text-white animate-bounce" />
                    <span className="text-xs font-semibold text-white ml-2">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Upload size={28} className="text-gray-500 mb-2 group-hover:text-purple-400 transition" />
                  <span className="text-xs text-gray-400">Click to upload category cover</span>
                  <span className="text-[10px] text-gray-600 mt-1">PNG, JPG up to 5MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 transition"
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
              ) : categoryToEdit ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
