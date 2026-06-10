import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function Tagline() {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const segments = [
      { text: "peel it", type: "phrase" },
      { text: ".", type: "dot" },
      { text: " ", type: "space" },
      { text: "stick it", type: "phrase" },
      { text: ".", type: "dot" },
      { text: " ", type: "space" },
      { text: "love it", type: "phrase" },
      { text: ".", type: "dot" },
    ];
    let currentSeg = 0;
    let charIdx = 0;
    let timeout;
    const pauseAfter = new Set([1, 4]);

    const type = () => {
      if (currentSeg >= segments.length) return;
      setCharCount((prev) => prev + 1);
      charIdx++;
      if (charIdx < segments[currentSeg].text.length) {
        timeout = setTimeout(type, 60);
      } else {
        currentSeg++;
        charIdx = 0;
        if (currentSeg < segments.length) {
          timeout = setTimeout(
            type,
            pauseAfter.has(currentSeg - 1) ? 350 : 60
          );
        }
      }
    };

    const delay = setTimeout(type, 600);
    return () => {
      clearTimeout(timeout);
      clearTimeout(delay);
    };
  }, []);

  const segments = [
    { text: "peel it", type: "phrase" },
    { text: ".", type: "dot" },
    { text: " ", type: "space" },
    { text: "stick it", type: "phrase" },
    { text: ".", type: "dot" },
    { text: " ", type: "space" },
    { text: "love it", type: "phrase" },
    { text: ".", type: "dot" },
  ];

  let remaining = charCount;

  return (
    <p
      className="
        /* mobile */ text-[clamp(0.95rem,3.5vw,1.15rem)]
        /* desktop */ md:text-[clamp(1rem,2vw,1.35rem)]
        mb-7 md:mb-4
        text-center md:text-left
        w-full px-1
      "
      style={{
        fontFamily: "inherit",
        fontWeight: 400,
        letterSpacing: "0.08em",
        marginTop: "10px",
        wordBreak: "keep-all",
      }}
    >
      {segments.map((seg, i) => {
        if (remaining <= 0) return null;
        const show = Math.min(remaining, seg.text.length);
        remaining -= seg.text.length;
        if (show <= 0) return null;
        const visible = seg.text.slice(0, show);
        if (seg.type === "phrase") {
          return (
            <span
              key={i}
              style={{
                fontWeight: 600,
                color: "#FFD166",
                borderBottom: "2px solid rgba(255, 209, 102, 0.5)",
                paddingBottom: "2px",
                whiteSpace: "nowrap",
                display: "inline",
              }}
            >
              {visible}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: "rgba(255,255,255,0.85)" }}>
            {visible}
          </span>
        );
      })}
    </p>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-svh flex items-center overflow-x-hidden overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <img
          src="/appImages/temp1.png"
          alt="Premium sticker collection on display — vibrant designs for laptops, phones, and gear"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark scrim overlay — unchanged */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/30" />
      </div>

      {/* ── Content wrapper ── */}
      {/*
        Mobile:  full height, centered vertically, all content centered
        Desktop: left-aligned, same as before
      */}
      <div
        className="
          relative z-10 w-full
          flex flex-col
          items-center justify-center
          md:items-start md:justify-center
          text-center md:text-left
          px-5 sm:px-10 lg:px-16
          pt-[72px] md:pt-20
          pb-12 md:pb-0
          min-h-svh md:min-h-0
          max-w-3xl
        "
      >
        {/* Intro badge — desktop only (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/25 bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-white/80" />
          Exclusive Sticker Store
        </motion.div>

        {/* Main Title — desktop only (unchanged) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:block text-white font-black leading-tight text-[clamp(2.5rem,5vw,4rem)]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Express Yourself with Our <br />
          <span className="text-white">Premium Sticker Collections</span>
        </motion.h1>

        {/* Tagline — visible on all screens */}
        <Tagline />

        {/* Description — desktop only (unchanged) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block text-white/85 text-lg lg:text-xl leading-relaxed max-w-[560px]"
        >
          Durable, high-quality, weather-resistant vinyl stickers designed for
          laptops, phone cases, notebooks, and anything you want to customize.
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="
            flex gap-3 md:gap-4 mt-8 md:mt-10
            w-full
            /* mobile: column, centered, capped width */
            flex-col items-center
            /* desktop: row, left-aligned */
            md:flex-row md:items-center md:justify-start
          "
        >
          <Link
            to="/shop"
            className="
              inline-flex items-center justify-center
              bg-[#FFD166] text-[#1A1A1A] md:text-gray-900
              font-bold md:font-semibold rounded-lg
              transition-all duration-150
              text-[0.95rem] md:text-sm
              /* mobile: full-width up to 320px, taller tap target */
              w-full max-w-[320px] px-7 py-[14px] min-h-[50px]
              /* desktop: auto width, normal padding */
              md:w-auto md:max-w-none md:px-7 md:py-3 md:min-h-[44px]
              shadow-[0_4px_20px_rgba(255,209,102,0.40)] md:shadow-none
              hover:bg-gray-100 border-0
            "
          >
            Browse Shop
          </Link>

          <a
            href="#categories"
            className="
              inline-flex items-center justify-center
              bg-white/15 text-white font-semibold md:font-medium rounded-lg
              transition-all duration-150
              text-[0.95rem] md:text-sm
              /* mobile: full-width up to 320px, taller tap target */
              w-full max-w-[320px] px-7 py-[14px] min-h-[50px]
              border border-white/60
              /* desktop: auto width, normal padding, softer border */
              md:w-auto md:max-w-none md:px-7 md:py-3 md:min-h-[44px]
              md:border-white/40
              hover:bg-white/10 backdrop-blur-sm
            "
          >
            Explore Categories
          </a>
        </motion.div>
      </div>
    </section>
  );
}