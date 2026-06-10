import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/user/Navbar.jsx";
import Footer from "../../components/user/Footer.jsx";
import StickerCard from "../../components/user/StickerCard.jsx";
import SkeletonCard from "../../components/user/SkeletonCard.jsx";
import { productApi } from "../../api/product.api.js";
import { MessageSquare, ArrowLeft, Tag, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const WHATSAPP_NO = import.meta.env.WHATSAPP_NO || "8806720312"

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await productApi.getBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.data.images && res.data.images.length > 0) {
            setActiveImage(res.data.images[0].url);
          }

          setLoadingRelated(true);
          const catId = res.data.category?._id || res.data.category;
          if (catId) {
            const relRes = await productApi.getAll({
              category: res.data.category?.slug,
              limit: 4,
            });
            if (relRes.success && relRes.data) {
              const filtered = (relRes.data.products || []).filter((p) => p._id !== res.data._id);
              setRelatedProducts(filtered.slice(0, 4));
            }
          }
          setLoadingRelated(false);
        } else {
          toast.error(res.message || "Failed to load product details");
        }
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow section-container py-12 flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full md:w-1/2 aspect-square rounded-2xl skeleton" />
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-4 w-1/4 skeleton" />
            <div className="h-10 w-3/4 skeleton" />
            <div className="h-6 w-1/3 skeleton" />
            <div className="h-24 w-full skeleton" />
            <div className="h-12 w-1/2 rounded-xl skeleton" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The sticker you are looking for does not exist or has been removed.</p>
          <Link to="/shop" className="btn-brand text-xs font-bold px-6 py-2.5">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { name, price, discount, images, description, category, tags, featured, bestseller, trending } = product;
  const finalPrice = discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price.toFixed(2);

  const currentUrl = window.location.href;
  const whatsappText = encodeURIComponent(
    `Hi StickMania! I'd like to order the sticker "${name}".\n\nLink: ${currentUrl}\nPrice: ₹${finalPrice}`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NO}?text=${whatsappText}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 section-container py-10">
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-8 transition-all duration-150">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Images Gallery */}
          <div className="space-y-4">
            {/* Active image box */}
            <div className="w-full aspect-square rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center p-6 overflow-hidden">
              <img
                src={activeImage || "https://via.placeholder.com/600?text=StickMania"}
                alt={name}
                className="w-full h-full object-contain max-h-[450px] transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnail selectors */}
            {images && images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img.url)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border bg-white p-1.5 transition-all duration-150 shadow-sm ${
                      activeImage === img.url ? "border-brand-500 ring-2 ring-brand-500/20" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${index}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="space-y-6">

            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-widest bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg">
                {category?.name || "Sticker"}
              </span>

              {bestseller && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-700 uppercase tracking-wider bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md">
                  <Sparkles size={10} /> Bestseller
                </span>
              )}
              {trending && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                  Trending
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight" style={{ letterSpacing: "-0.02em" }}>
              {name}
            </h1>

            {/* Price section */}
            <div className="py-4 border-y border-gray-200 flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">₹{finalPrice}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">₹{price.toFixed(2)}</span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={12} /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call To Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand flex items-center justify-center gap-2 text-sm font-bold flex-grow sm:flex-grow-0"
              >
                <MessageSquare size={18} />
                Order via WhatsApp
              </a>
            </div>

            {/* Quality badge list */}
            <div className="pt-6 grid grid-cols-3 gap-4 text-center border-t border-gray-200">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="block text-xs font-bold text-brand-600">Vinyl</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Premium material</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="block text-xs font-bold text-brand-600">Weatherproof</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Sun & water safe</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="block text-xs font-bold text-brand-600">Scratchproof</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Matte/Gloss finish</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-24 border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8" style={{ letterSpacing: "-0.02em" }}>Related Stickers</h2>

          {loadingRelated ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : relatedProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No other stickers in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <StickerCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
