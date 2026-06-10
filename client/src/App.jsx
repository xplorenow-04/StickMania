import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { authContext } from "./context/AuthProvider.jsx";
import { userApi } from "./api/user.api.js";
import ProtectedRoute from "./components/guards/ProtectedRoute.jsx";
import ProtectedRouteAuth from "./components/guards/ProtectedRouteAuth.jsx";
import Home from "./pages/user/Home.jsx";
const Shop = lazy(() => import("./pages/user/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/user/ProductDetail.jsx"));
const CategoryPage = lazy(() => import("./pages/user/CategoryPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/user/AdminDashboard.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-brand-700 border-t-brand-400 rounded-full animate-spin" />
      <p className="text-text-muted text-sm">Loading...</p>
    </div>
  </div>
);

function App() {
  const { login } = useContext(authContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await userApi.authMe();
      if (result.success && result.data) {
        login(result.data);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!authChecked) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRouteAuth>
              <Login />
            </ProtectedRouteAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;