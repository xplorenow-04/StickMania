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

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { products, setProducts } = useProductStore();
  const { categories, setCategories, removeCategory } = useCategoryStore();

  const loadData = async () => {
    setLoadingProducts(true);
    setLoadingCategories(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getAll({ limit: 100 }),
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

  const handleProductSaved = () => {
    loadData();
  };

  const handleDeleteProduct = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the sticker "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#DC2626",
      confirmButtonText: "Yes, delete it!",
      background: "#FFFFFF",
      color: "#0A0A0A"
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

  const handleDeleteCategory = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete category "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#DC2626",
      confirmButtonText: "Yes, delete it!",
      background: "#FFFFFF",
      color: "#0A0A0A"
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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Navbar />

      <main className="flex-grow section-container py-10">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight" style={{ letterSpacing: "-0.02em" }}>Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage stickers inventory and categories catalog.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCategoryToEdit(null);
                setIsCategoryModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all duration-150 shadow-sm"
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
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 tabular-nums">{products.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Stickers</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 tabular-nums">{categories.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Categories</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <Percent size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 tabular-nums">
                {products.filter((p) => p.discount > 0).length}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">On Sale</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Tag size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900 tabular-nums">
                {products.filter((p) => p.featured).length}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Featured</span>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-gray-200 gap-6 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-150 ${
              activeTab === "products"
                ? "text-brand-600 border-brand-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Stickers ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-150 ${
              activeTab === "categories"
                ? "text-brand-600 border-brand-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
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
                <Loader size={32} className="animate-spin text-brand-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500 text-sm">
                No products found in inventory.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Sticker</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Status Badges</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {products.map((p) => {
                      const image = p.images?.[0]?.url || "https://via.placeholder.com/50?text=SM";
                      return (
                        <tr key={p._id} className="bg-white hover:bg-gray-50 transition-all duration-150">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img src={image} alt={p.name} className="w-10 h-10 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100" />
                            <span className="font-semibold text-gray-900">{p.name}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-brand-600">{p.category?.name || "Uncategorized"}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">₹{p.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {p.discount > 0 ? (
                              <span className="badge badge-red">
                                {p.discount}% OFF
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 flex flex-wrap gap-1.5">
                            {p.featured && <span className="badge badge-amber text-[10px]">Featured</span>}
                            {p.bestseller && <span className="badge badge-pink text-[10px]">Bestseller</span>}
                            {p.trending && <span className="badge badge-blue text-[10px]">Trending</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setProductToEdit(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all duration-150"
                                title="Edit Product"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-150"
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
                <Loader size={32} className="animate-spin text-brand-600" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500 text-sm">
                No categories found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((c) => {
                  const image = c.image?.url || "https://via.placeholder.com/100?text=Category";
                  return (
                    <div key={c._id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-gray-300 hover:shadow-md transition-all duration-150">
                      <div className="flex items-center gap-3">
                        <img src={image} alt={c.name} className="w-12 h-12 object-cover rounded-lg bg-gray-50" />
                        <div>
                          <h4 className="font-bold text-gray-900">{c.name}</h4>
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
                          className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all duration-150"
                          title="Edit Category"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c._id, c.name)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-150"
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
