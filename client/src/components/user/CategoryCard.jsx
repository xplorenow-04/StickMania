import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CategoryCard({ category }) {
  const { name, slug, image } = category;
  const mainImage = image?.url || image || "https://via.placeholder.com/300?text=Category";

  return (
    <Link
      to={`/category/${slug}`}
      className="group relative flex flex-col justify-end h-60 rounded-2xl overflow-hidden glass border border-white/[0.06] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/5 hover:border-purple-500/20"
    >
      {/* Background Image */}
      <img
        src={mainImage}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent transition-opacity duration-300" />

      {/* Content */}
      <div className="relative p-5 z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors">
            {name}
          </h3>
          <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors mt-0.5 block">
            Explore Collection
          </span>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}
