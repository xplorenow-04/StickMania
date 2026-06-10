import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const WHATSAPP_NO = import.meta.env.WHATSAPP_NO || "8806720312"

export default function StickerCard({ product }) {
  const { name, slug, price, discount, images, category, featured, bestseller, trending } = product;

  const finalPrice = discount > 0 ? (price - (price * discount) / 100).toFixed(2) : price.toFixed(2);
  const mainImage = images && images.length > 0 ? images[0].url : "https://via.placeholder.com/300?text=StickMania";

  const currentUrl = window.location.origin + `/shop/${slug}`;
  const whatsappText = encodeURIComponent(
    `Hi StickMania! I'd like to order the sticker "${name}".\n\nLink: ${currentUrl}\nPrice: ₹${finalPrice}`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NO}?text=${whatsappText}`;

  return (
    <div className="group relative flex flex-col rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden transition-all duration-150 hover:shadow-md hover:border-gray-300">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="badge badge-red shadow-sm">
            {discount}% OFF
          </span>
        )}
        {bestseller && (
          <span className="badge badge-pink shadow-sm">
            Bestseller
          </span>
        )}
        {trending && (
          <span className="badge badge-blue shadow-sm">
            Trending
          </span>
        )}
        {featured && (
          <span className="badge badge-amber shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Image container */}
      <Link to={`/shop/${slug}`} className="relative block aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={mainImage}
          alt={name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-gray-700 shadow-sm border border-gray-200">
            View Details
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <span className="text-xs font-medium text-brand-600/70 uppercase tracking-wider mb-1">
          {category?.name || "Sticker"}
        </span>

        {/* Title */}
        <Link to={`/shop/${slug}`} className="hover:text-brand-600 transition-all duration-150">
          <h3 className="text-base font-bold text-gray-900 tracking-tight line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2 mb-4">
          <span className="text-lg font-black text-gray-900">₹{finalPrice}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">₹{price.toFixed(2)}</span>
          )}
        </div>

        {/* Action button */}
        <div className="mt-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-150 shadow-sm"
          >
            <MessageSquare size={14} />
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
