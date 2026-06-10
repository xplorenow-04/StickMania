import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthProvider.jsx";
import { userApi } from "../../api/user.api.js";
import { FaInstagram } from "react-icons/fa";
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar({ variant = "solid" }) {
  const { user, isLoggedIn, isAdmin, logout } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (variant !== "hero") return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const isHero = variant === "hero";

  const handleLogout = async () => {
    const res = await userApi.logoutUser();
    if (res.success) {
      logout();
      toast.success("Logged out successfully");
      navigate("/");
    } else {
      toast.error(res.message || "Failed to logout");
    }
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: ShoppingBag },
  ];

  const navClass = isHero
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200"
          : "bg-transparent border-b border-transparent"
      }`
    : "sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-lg bg-white/90";

  const linkClass = ({ isActive }) => {
    if (isHero && !scrolled) {
      return `text-sm font-medium tracking-wide transition-all duration-150 hover:text-white ${
        isActive ? "text-white border-b-2 border-white pb-1" : "text-white/80"
      }`;
    }
    return `text-sm font-medium tracking-wide transition-all duration-150 hover:text-brand-600 ${
      isActive ? "text-brand-600 border-b-2 border-brand-600 pb-1" : "text-gray-500"
    }`;
  };

  const logoFirst = isHero && !scrolled ? "text-white" : "text-brand-600";
  const logoSec = isHero && !scrolled ? "text-white/90" : "text-gray-900";
  const igColor = isHero && !scrolled ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-pink-500";
  const mobileBtnColor = isHero && !scrolled ? "text-white/80 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100";

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-wider transition-colors duration-300">
                <span className={logoFirst}>STICK</span>
                <span className={`${logoSec} group-hover:text-brand-600 transition-colors`}>OMANIA</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
            <a
              href="https://www.instagram.com/_stickomania?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className={`${igColor} transition-all duration-150`}
              aria-label="Instagram"
            >
              <FaInstagram size={22} />
            </a>
          </div>

          {/* User / Admin CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isHero && !scrolled
                        ? "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                        : "bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100"
                    }`}
                  >
                    <LayoutDashboard size={14} />
                    Admin Panel
                  </Link>
                )}
                <div className={`flex items-center gap-3 pl-2 ${isHero && !scrolled ? "border-l border-white/20" : "border-l border-gray-200"}`}>
                  <span className={`text-xs ${isHero && !scrolled ? "text-white/80" : "text-gray-500"}`}>
                    Hi, <span className={`font-semibold ${isHero && !scrolled ? "text-white" : "text-gray-900"}`}>{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-150 ${
                      isHero && !scrolled
                        ? "bg-white/15 text-white/90 border border-white/30 hover:bg-white/25"
                        : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    }`}
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isHero && !scrolled
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://www.instagram.com/_stickomania?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className={`${igColor} transition-all duration-150`}
              aria-label="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-all duration-150 ${mobileBtnColor}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-4 space-y-1 sm:px-3 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-brand-50 text-brand-700 border-l-4 border-brand-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
          <a
            href="https://www.instagram.com/_stickomania?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-pink-500 transition-all duration-150"
          >
            <FaInstagram size={18} />
            Instagram
          </a>

          <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col gap-3 px-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-sm font-semibold hover:bg-brand-100 transition-all duration-150"
                  >
                    <LayoutDashboard size={16} />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">
                    Logged in as: <span className="font-semibold text-gray-900">{user?.name}</span>
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all duration-150"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-all duration-150"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
