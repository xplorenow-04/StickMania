import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";
import { adminPermission } from "../middlewares/adminPermission.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin routes
router.post("/", userAuth, adminPermission, upload.array("images", 5), createProduct);
router.put("/:id", userAuth, adminPermission, upload.array("images", 5), updateProduct);
router.delete("/:id", userAuth, adminPermission, deleteProduct);

export default router;
