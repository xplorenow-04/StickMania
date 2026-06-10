import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar.jsx";
import Footer from "../../components/user/Footer.jsx";
import HeroSection from "../../components/user/HeroSection.jsx";
import CategoryCard from "../../components/user/CategoryCard.jsx";
import StickerCard from "../../components/user/StickerCard.jsx";
import { categoryApi } from "../../api/category.api.js";
import { productApi } from "../../api/product.api.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import { Sparkles, Compass, Flame } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [loadingCats, setLoadingCats] = useState(true);
  
  const { categories, setCategories } = useCategoryStore();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const catRes = await categoryApi.getAll();
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        } else {
          toast.error("Failed to load categories");
        }
        setLoadingCats(false);

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
      } catch (error) {
        console.error("Error loading home page data:", error);
        setLoadingCats(false);
      }
    };

    fetchHomeData();
  }, [setCategories]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar variant="hero" />

      {/* Hero Section */}
      <HeroSection />

      {/* Product Showcase — Second Image */}
      <section className="py-24 sm:py-32 section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            See Our Stickers in Action
          </h2>
          <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto">
            Premium vinyl prints that bring personality to everything you own.
          </p>
        </div>
        <div
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_32px_80px_rgba(0,0,0,0.16)]"
          style={{ transform: "perspective(1200px) rotateX(4deg)" }}
        >
          <img
            src="/appImages/temp 2.png"
            alt="StickMania sticker collection — vibrant designs for every style"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Categories Grid Section */}
      <section id="categories" className="py-16 section-container">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass size={14} className="text-brand-500" />
            Categories
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Browse by Theme
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Find the perfect look for your gear. Explore our collections.
          </p>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-60 rounded-xl skeleton" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
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
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="section-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold uppercase tracking-wider mb-3">
                <Flame size={14} className="text-brand-500" />
                Trending
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Top Trending Stickers
              </h2>
            </div>
          </div>

          {trendingProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-amber-500" />
              Featured
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Featured Picks
            </h2>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
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
