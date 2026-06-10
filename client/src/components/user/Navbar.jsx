import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthProvider.jsx";
import { userApi } from "../../api/user.api.js";
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <nav className="sticky top-0 z-50 glass backdrop-blur-md border-b border-white/[0.06] bg-dark-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-wider gradient-text font-display">
                STICK<span className="text-white group-hover:text-brand-500 transition-colors">MANIA</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors duration-200 hover:text-purple-400 ${
                    isActive ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "text-gray-300"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* User / Admin CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600/35 transition"
                  >
                    <LayoutDashboard size={14} />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                  <span className="text-xs text-gray-400">
                    Hi, <span className="font-semibold text-white">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold hover:opacity-95 transition"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass backdrop-blur-lg border-b border-white/[0.06] px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-purple-600/20 text-purple-400 border-l-4 border-purple-500"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3 px-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-sm font-semibold hover:bg-purple-600/35 transition"
                  >
                    <LayoutDashboard size={16} />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">
                    Logged in as: <span className="font-semibold text-white">{user?.name}</span>
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:opacity-95 transition"
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
