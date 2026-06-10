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
          duration={3500}
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#0A0A0A",
              border: "1px solid #E5E7EB",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              fontSize: "0.875rem",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#16A34A",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC2626",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
