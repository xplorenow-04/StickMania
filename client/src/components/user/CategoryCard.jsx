import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CategoryCard({ category }) {
  const { name, slug, image } = category;
  const mainImage = image?.url || image || "https://via.placeholder.com/300?text=Category";

  return (
    <Link
      to={`/category/${slug}`}
      className="group relative flex flex-col justify-end h-60 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
    >
      {/* Background Image */}
      <img
        src={mainImage}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent transition-opacity duration-300" />

      {/* Content */}
      <div className="relative p-5 z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-brand-300 transition-all duration-150">
            {name}
          </h3>
          <span className="text-xs text-gray-300 group-hover:text-gray-200 transition-all duration-150 mt-0.5 block">
            Explore Collection
          </span>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-150 group-hover:bg-brand-600 group-hover:text-white">
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}
