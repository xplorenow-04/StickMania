import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userApi } from "../../api/user.api.js";
import { authContext } from "../../context/AuthProvider.jsx";
import { userAuthStore } from "../../store/userStore.js";
import { Lock, Mail, Sparkles, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: contextLogin } = useContext(authContext);
  const setUserInStore = userAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);

    try {
      const res = await userApi.loginUser({ email: email.trim(), password: password.trim() });
      if (res.success && res.data) {
        contextLogin(res.data);
        setUserInStore(res.data);
        toast.success(res.message || "Logged in successfully!");
        
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-brand-50/50 to-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle decoration */}
      <div className="absolute -top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-100/40 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute -bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-100/30 blur-[85px] pointer-events-none -z-10" />

      {/* Brand logo at top */}
      <Link to="/" className="mb-8 group">
        <span className="text-3xl font-black tracking-wider text-brand-600">
          STICK<span className="text-gray-900 group-hover:text-brand-600 transition-all duration-150">OMANIA</span>
        </span>
      </Link>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-modal overflow-hidden">
        {/* Content */}
        <div className="px-8 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-100 text-brand-600 border border-brand-200 mb-4">
            <Sparkles size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Admin Panel Login
          </h1>
          <p className="text-xs text-gray-500 mt-1.5">
            Log in to manage stickers, categories, and inventory.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mx-8" />

        {/* Form */}
        <form onSubmit={handleLogin} className="px-8 pt-8 pb-10 space-y-4">
          
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-all duration-150 pointer-events-none" />
              <input
                type="email"
                placeholder="admin@stickomania.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-all duration-150 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-brand py-3.5 mt-2 flex items-center justify-center gap-2 text-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>

      <Link to="/" className="text-xs text-gray-400 hover:text-gray-700 mt-6 transition-all duration-150">
        ← Back to Shop
      </Link>
    </div>
  );
}
