import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config({ path: "./.env" });

const app = express();
const httpServer = createServer(app);

// 1. CORS (registered first so preflight and errors get CORS headers)
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://stick-mania-3s48.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// 2. Body parsers (must be before sanitization so req.body is defined)
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Security middleware

// Custom NoSQL Injection Sanitization (Express 5 compatible)
const cleanMongoKeys = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        cleanMongoKeys(obj[key]);
      }
    }
  }
};

app.use((req, res, next) => {
  if (req.body) cleanMongoKeys(req.body);
  if (req.query) cleanMongoKeys(req.query);
  if (req.params) cleanMongoKeys(req.params);
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
// app.use("/api/", limiter);


// Routes
import authRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);

// Health check
app.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true, message: "StickMania API is live 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { httpServer };
