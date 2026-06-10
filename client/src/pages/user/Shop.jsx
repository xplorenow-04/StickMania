import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar.jsx";
import Footer from "../../components/user/Footer.jsx";
import SearchBar from "../../components/user/SearchBar.jsx";
import StickerCard from "../../components/user/StickerCard.jsx";
import SkeletonCard from "../../components/user/SkeletonCard.jsx";
import { productApi } from "../../api/product.api.js";
import { categoryApi } from "../../api/category.api.js";
import { useCategoryStore } from "../../store/categoryStore.js";
import { SlidersHorizontal, ArrowUpDown, RefreshCw, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import toast from "react-hot-toast";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [trending, setTrending] = useState(false);
  const [page, setPage] = useState(1);

  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length === 0) {
        const res = await categoryApi.getAll();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      }
    };
    fetchCategories();
  }, [categories.length, setCategories]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = {
        page,
        sort,
        limit: 12,
      };

      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (featured) params.featured = "true";
      if (bestseller) params.bestseller = "true";
      if (trending) params.trending = "true";

      try {
        const res = await productApi.getAll(params);
        if (res.success && res.data) {
          setProducts(res.data.products || []);
          setPagination(res.data.pagination || null);
        } else {
          toast.error(res.message || "Failed to load products");
        }
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, sort, featured, bestseller, trending, page]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setSort("latest");
    setFeatured(false);
    setBestseller(false);
    setTrending(false);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 section-container py-10">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight" style={{ letterSpacing: "-0.02em" }}>Sticker Shop</h1>
          <p className="text-sm text-gray-500 mt-1">Explore and filter our complete catalog of vinyl stickers.</p>
        </div>

        {/* Filters and Search Bar Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch lg:items-center justify-between">
          <SearchBar
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            onClear={() => { setSearch(""); setPage(1); }}
            placeholder="Search by name or tags..."
          />

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <SlidersHorizontal size={14} className="text-brand-500" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="bg-white text-xs font-semibold text-gray-700 outline-none border-none cursor-pointer pr-4"
              >
                <option value="" className="bg-white text-gray-700">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug} className="bg-white text-gray-700">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <ArrowUpDown size={14} className="text-brand-500" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="bg-white text-xs font-semibold text-gray-700 outline-none border-none cursor-pointer pr-4"
              >
                <option value="latest" className="bg-white text-gray-700">Latest Arrivals</option>
                <option value="price_asc" className="bg-white text-gray-700">Price: Low to High</option>
                <option value="price_desc" className="bg-white text-gray-700">Price: High to Low</option>
                <option value="popular" className="bg-white text-gray-700">Most Popular</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-gray-700 transition-all duration-150 shadow-sm"
              title="Reset Filters"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          </div>
        </div>

        {/* Checkbox badges */}
        <div className="flex flex-wrap gap-4 items-center mb-8 px-2 py-3 rounded-lg bg-gray-50 border border-gray-200">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 pr-2 border-r border-gray-200">Filter By:</span>
          
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => { setFeatured(e.target.checked); setPage(1); }}
              className="w-3.5 h-3.5 rounded bg-white border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Featured
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => { setBestseller(e.target.checked); setPage(1); }}
              className="w-3.5 h-3.5 rounded bg-white border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Bestseller
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={trending}
              onChange={(e) => { setTrending(e.target.checked); setPage(1); }}
              className="w-3.5 h-3.5 rounded bg-white border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Trending
          </label>
        </div>

        {/* Stickers Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <SearchX size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No stickers matched your filters.</p>
            <button
              onClick={resetFilters}
              className="btn-brand mt-4 text-xs font-bold px-5 py-2 rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <StickerCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-semibold text-gray-500">
                  Page <span className="text-gray-900">{pagination.page}</span> of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
