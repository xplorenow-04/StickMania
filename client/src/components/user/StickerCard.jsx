import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star } from "lucide-react";

const WHATSAPP_NO = import.meta.env.WHATSAPP_NO // Hardcoded config matching backend configuration

export default function StickerCard({ product }) {
  const { name, slug, price, discount, images, category, featured, bestseller, trending } = product;

  // Calculate final discounted price
  const finalPrice = discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price.toFixed(2);
  const mainImage = images && images.length > 0 ? images[0].url : "https://via.placeholder.com/300?text=StickMania";

  // Construct WhatsApp order text
  const currentUrl = window.location.origin + `/shop/${slug}`;
  const whatsappText = encodeURIComponent(
    `Hi StickMania! I'd like to order the sticker "${name}".\n\nLink: ${currentUrl}\nPrice: ₹${finalPrice}`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NO}?text=${whatsappText}`;

  return (
    <div className="group relative flex flex-col rounded-2xl glass glass-hover overflow-hidden transition-all duration-300">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="badge bg-pink-500 text-white shadow-lg shadow-pink-500/20">
            {discount}% OFF
          </span>
        )}
        {bestseller && (
          <span className="badge bg-purple-600 text-white shadow-lg shadow-purple-600/20">
            Bestseller
          </span>
        )}
        {trending && (
          <span className="badge bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            Trending
          </span>
        )}
        {featured && (
          <span className="badge bg-amber-500 text-white shadow-lg shadow-amber-500/20">
            Featured
          </span>
        )}
      </div>

      {/* Image container */}
      <Link to={`/shop/${slug}`} className="relative block aspect-square w-full overflow-hidden bg-dark-900/50">
        <img
          src={mainImage}
          alt={name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
            View Details
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <span className="text-xs font-medium text-purple-400/80 uppercase tracking-wider mb-1">
          {category?.name || "Sticker"}
        </span>

        {/* Title */}
        <Link to={`/shop/${slug}`} className="hover:text-purple-400 transition-colors">
          <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2 mb-4">
          <span className="text-lg font-black text-white">₹{finalPrice}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-500 line-through">₹{price.toFixed(2)}</span>
          )}
        </div>

        {/* Action button */}
        <div className="mt-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 shadow-md hover:shadow-emerald-500/10"
          >
            <MessageSquare size={14} className="fill-current" />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
