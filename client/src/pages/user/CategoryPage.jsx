import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/user/Navbar.jsx";
import Footer from "../../components/user/Footer.jsx";
import StickerCard from "../../components/user/StickerCard.jsx";
import SkeletonCard from "../../components/user/SkeletonCard.jsx";
import { productApi } from "../../api/product.api.js";
import { categoryApi } from "../../api/category.api.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import { ArrowLeft, Compass } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Find category name from store or fetch
        let currentCat = categories.find((c) => c.slug === slug);
        if (!currentCat) {
          const catRes = await categoryApi.getAll();
          if (catRes.success && catRes.data) {
            setCategories(catRes.data);
            currentCat = catRes.data.find((c) => c.slug === slug);
          }
        }

        if (currentCat) {
          setCategoryName(currentCat.name);
        } else {
          // Fallback to formatting slug
          setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " "));
        }

        // Fetch products by category slug
        const res = await productApi.getAll({ category: slug });
        if (res.success && res.data) {
          setProducts(res.data.products || []);
        } else {
          toast.error(res.message || "Failed to load products");
        }
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug, categories, setCategories]);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />

      <main className="flex-grow section-container py-10">
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        {/* Header Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass size={14} className="text-purple-400" />
            Category Collection
          </div>
          <h1 className="text-3xl font-black text-white font-display">
            {categoryName} Stickers
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse all stickers inside the "{categoryName}" collection.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 glass border border-white/5 rounded-3xl">
            <p className="text-gray-400 text-sm mb-4">No stickers in this category yet.</p>
            <Link to="/shop" className="btn-ghost text-xs font-semibold">
              Browse Other Stickers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <StickerCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
