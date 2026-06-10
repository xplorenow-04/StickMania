import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar.jsx";
import Footer from "../../components/user/Footer.jsx";
import HeroSection from "../../components/user/HeroSection.jsx";
import CategoryCard from "../../components/user/CategoryCard.jsx";
import StickerCard from "../../components/user/StickerCard.jsx";
import SkeletonCard from "../../components/user/SkeletonCard.jsx";
import { categoryApi } from "../../api/category.api.js";
import { productApi } from "../../api/product.api.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import { useProductStore } from "../../store/productStore.js";
import { Sparkles, Compass, Flame } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const { categories, setCategories } = useCategoryStore();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch Categories
        const catRes = await categoryApi.getAll();
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        } else {
          toast.error("Failed to load categories");
        }
        setLoadingCats(false);

        // Fetch Trending & Featured Products in parallel
        const [trendingRes, featuredRes] = await Promise.all([
          productApi.getAll({ trending: "true", limit: 4 }),
          productApi.getAll({ featured: "true", limit: 4 })
        ]);

        if (trendingRes.success && trendingRes.data) {
          setTrendingProducts(trendingRes.data.products || []);
        }
        if (featuredRes.success && featuredRes.data) {
          setFeaturedProducts(featuredRes.data.products || []);
        }
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error loading home page data:", error);
        setLoadingCats(false);
        setLoadingProducts(false);
      }
    };

    fetchHomeData();
  }, [setCategories]);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories Grid Section */}
      <section id="categories" className="py-16 section-container">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass size={14} className="text-purple-400" />
            Categories
          </div>
          <h2 className="text-3xl font-black text-white font-display">
            Browse by Theme
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md">
            Find the perfect look for your gear. Explore our collections.
          </p>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-60 rounded-2xl skeleton" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No categories available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Stickers Section */}
      <section className="py-16 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
                <Flame size={14} className="text-blue-400" />
                Trending
              </div>
              <h2 className="text-3xl font-black text-white font-display">
                Top Trending Stickers
              </h2>
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No trending stickers at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <StickerCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-16 section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-amber-400" />
              Featured
            </div>
            <h2 className="text-3xl font-black text-white font-display">
              Featured Picks
            </h2>
          </div>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No featured stickers available.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <StickerCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}