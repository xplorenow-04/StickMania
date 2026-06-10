import { Router } from "express";
import { login, logout, authMe } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", userAuth, authMe);

export default router;