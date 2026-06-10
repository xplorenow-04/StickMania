import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";
import { adminPermission } from "../middlewares/adminPermission.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllCategories);

// Admin routes
router.post("/", userAuth, adminPermission, upload.single("image"), createCategory);
router.post("/ping", (req, res) => {
  return res.json({ message: "pong" })
});
router.put("/:id", userAuth, adminPermission, upload.single("image"), updateCategory);
router.delete("/:id", userAuth, adminPermission, deleteCategory);

export default router;
