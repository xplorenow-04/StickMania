/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6d28d9",
          900: "#4c1d95",
        },
        dark: {
          950: "#050508",
          900: "#08080f",
          850: "#0d0d18",
          800: "#111120",
          750: "#151528",
          700: "#1a1a30",
          600: "#1f1f38",
          500: "#252540",
        },
        surface: {
          900: "#0a0a1a",
          800: "#0f0f22",
          700: "#151530",
          600: "#1c1c3a",
          500: "#222245",
        },
        accent: {
          DEFAULT: "#7c3aed",
          light: "#a855f7",
          lighter: "#c084fc",
          dark: "#6d28d9",
          glow: "rgba(124,58,237,0.2)",
        },
        pink: {
          glow: "rgba(236,72,153,0.2)",
        },
        text: {
          primary: "#f8f9ff",
          secondary: "#c4c6e7",
          muted: "#6b7280",
          dim: "#4a4e6a",
        },
        success: "#22d3a0",
        warning: "#fbbf24",
        danger: "#f87171",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.15) 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(21,21,48,0.9) 0%, rgba(15,15,34,0.95) 100%)",
        "hero-gradient": "radial-gradient(ellipse at top, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.15) 0%, transparent 60%)",
        "glow-gradient": "radial-gradient(circle at center, rgba(124,58,237,0.3) 0%, transparent 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease both",
        "fade-up": "fadeUp 0.5s ease both",
        "fade-down": "fadeDown 0.4s ease both",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "slide-left": "slideLeft 0.4s ease both",
        "slide-right": "slideRight 0.4s ease both",
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "shimmer": "shimmer 1.8s linear infinite",
        "spin-slow": "spin 4s linear infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(-8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(124,58,237,0.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
      },
      boxShadow: {
        "brand": "0 0 30px rgba(124,58,237,0.3), 0 4px 20px rgba(0,0,0,0.4)",
        "brand-sm": "0 0 15px rgba(124,58,237,0.2), 0 2px 10px rgba(0,0,0,0.3)",
        "card": "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
        "card-hover": "0 16px 48px rgba(0,0,0,0.5), 0 4px 16px rgba(124,58,237,0.15)",
        "glass": "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-hover": "0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "inner-glow": "inset 0 0 20px rgba(124,58,237,0.1)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};