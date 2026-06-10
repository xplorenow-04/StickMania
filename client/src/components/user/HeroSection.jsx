import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 flex flex-col items-center justify-center text-center">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-pink-600/10 blur-[85px] pointer-events-none -z-10" />

      {/* Intro badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6"
      >
        <Sparkles size={14} className="text-purple-400 animate-spin" style={{ animationDuration: "3s" }} />
        Exclusive Sticker Store
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white px-4"
      >
        Express Yourself with Our <br />
        <span className="gradient-text">Premium Sticker Collections</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl text-base sm:text-lg text-gray-400 mt-6 px-4 leading-relaxed"
      >
        Durable, high-quality, weather-resistant vinyl stickers designed for laptops, phone cases, notebooks, and anything you want to customize.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mt-10 px-4"
      >
        <Link to="/shop" className="btn-brand flex items-center justify-center gap-2">
          Browse Shop
          <ArrowRight size={18} />
        </Link>
        <a href="#categories" className="btn-ghost flex items-center justify-center">
          Explore Categories
        </a>
      </motion.div>
    </section>
  );
}
