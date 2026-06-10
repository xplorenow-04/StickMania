import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar.jsx";
import Footer from "../../components/user/Footer.jsx";
import ProductModal from "../../components/user/ProductModal.jsx";
import CategoryModal from "../../components/user/CategoryModal.jsx";
import { productApi } from "../../api/product.api.js";
import { categoryApi } from "../../api/category.api.js";
import { useProductStore } from "../../store/productStore.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import { Plus, Edit3, Trash2, Tag, Layers, ShoppingBag, Loader, Percent } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  
  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { products, setProducts } = useProductStore();
  const { categories, setCategories, removeCategory } = useCategoryStore();

  // Load Categories & Products
  const loadData = async () => {
    setLoadingProducts(true);
    setLoadingCategories(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAll({ limit: 100 }), // fetch large list for admin view
        categoryApi.getAll()
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.products || []);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoadingProducts(false);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [setProducts, setCategories]);

  // Handle Product Saved / Updated
  const handleProductSaved = () => {
    loadData(); // Re-fetch all to ensure populated data is fresh
  };

  // Delete product action
  const handleDeleteProduct = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the sticker "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      background: "#151522",
      color: "#ffffff"
    });

    if (result.isConfirmed) {
      const res = await productApi.delete(id);
      if (res.success) {
        setProducts(products.filter((p) => p._id !== id));
        toast.success("Product deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete product");
      }
    }
  };

  // Delete category action
  const handleDeleteCategory = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete category "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      background: "#151522",
      color: "#ffffff"
    });

    if (result.isConfirmed) {
      const res = await categoryApi.delete(id);
      if (res.success) {
        removeCategory(id);
        toast.success("Category deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete category");
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />

      <main className="flex-grow section-container py-10">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white font-display">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Manage stickers inventory and categories catalog.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCategoryToEdit(null);
                setIsCategoryModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition"
            >
              <Plus size={14} /> Add Category
            </button>
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
              className="btn-brand flex items-center gap-1.5 text-xs font-bold px-5 py-2.5"
            >
              <Plus size={14} /> Add Sticker
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{products.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Stickers</span>
            </div>
          </div>

          <div className="glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{categories.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Categories</span>
            </div>
          </div>

          <div className="glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center">
              <Percent size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">
                {products.filter((p) => p.discount > 0).length}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">On Sale</span>
            </div>
          </div>

          <div className="glass border border-white/5 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600/15 text-amber-400 flex items-center justify-center">
              <Tag size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">
                {products.filter((p) => p.featured).length}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Featured</span>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-white/5 gap-6 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === "products"
                ? "text-purple-400 border-purple-500"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Stickers ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === "categories"
                ? "text-purple-400 border-purple-500"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === "products" ? (
          <div>
            {loadingProducts ? (
              <div className="flex justify-center items-center py-20">
                <Loader size={32} className="animate-spin text-purple-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 glass border border-white/5 rounded-2xl text-gray-500 text-sm">
                No products found in inventory.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/5 bg-dark-900/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Sticker</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Status Badges</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                    {products.map((p) => {
                      const image = p.images?.[0]?.url || "https://via.placeholder.com/50?text=SM";
                      return (
                        <tr key={p._id} className="hover:bg-white/1 transition duration-150">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={image} alt={p.name} className="w-10 h-10 object-contain bg-dark-950/40 rounded-lg p-1" />
                            <span className="font-semibold text-white">{p.name}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-purple-400">{p.category?.name || "Uncategorized"}</td>
                          <td className="px-6 py-4 font-bold text-white">₹{p.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {p.discount > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 text-xs font-bold border border-pink-500/20">
                                {p.discount}% OFF
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 flex flex-wrap gap-1.5">
                            {p.featured && <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-bold">Featured</span>}
                            {p.bestseller && <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 text-[10px] font-bold">Bestseller</span>}
                            {p.trending && <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 text-[10px] font-bold">Trending</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setProductToEdit(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white transition"
                                title="Edit Product"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            {loadingCategories ? (
              <div className="flex justify-center items-center py-20">
                <Loader size={32} className="animate-spin text-purple-500" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 glass border border-white/5 rounded-2xl text-gray-500 text-sm">
                No categories found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((c) => {
                  const image = c.image?.url || "https://via.placeholder.com/100?text=Category";
                  return (
                    <div key={c._id} className="glass border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-purple-500/25 transition">
                      <div className="flex items-center gap-3">
                        <img src={image} alt={c.name} className="w-12 h-12 object-cover rounded-xl bg-dark-950/30" />
                        <div>
                          <h4 className="font-bold text-white">{c.name}</h4>
                          <span className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
                            {c.slug}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setCategoryToEdit(c);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-600 hover:text-white transition"
                          title="Edit Category"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c._id, c.name)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Edit / Add Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        onProductSaved={handleProductSaved}
      />

      {/* Category Edit / Add Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />

      <Footer />
    </div>
  );
}
