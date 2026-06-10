import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-black tracking-wider text-brand-600">
              STICKOMANIA
            </span>
            <p className="text-xs text-gray-500 mt-1 text-center md:text-left">
              High-quality premium stickers for developers, designers, and creators.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex gap-6 text-sm text-gray-500 items-center">
            <Link to="/" className="hover:text-brand-600 transition-all duration-150">
              Home
            </Link>
            <Link to="/shop" className="hover:text-brand-600 transition-all duration-150">
              Shop
            </Link>
            <Link to="/login" className="hover:text-brand-600 transition-all duration-150">
              Admin Area
            </Link>
            <a
              href="https://www.instagram.com/_stickomania?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-all duration-150"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} StickMania. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for sticker lovers.
          </div>
        </div>
      </div>
    </footer>
  );
}
