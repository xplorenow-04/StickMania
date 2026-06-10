import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "rgba(15, 15, 34, 0.95)",
              color: "#f8f9ff",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              borderRadius: "0.75rem",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              fontSize: "0.875rem",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#22d3a0",
                secondary: "#0a0a1a",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#0a0a1a",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);