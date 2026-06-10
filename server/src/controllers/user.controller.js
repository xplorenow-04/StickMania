import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiUtils.js";
import { ApiResponse } from "../utils/apiUtils.js";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.isCorrectPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const accessToken = user.generateAccessToken();

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        "Login successful"
      )
    );
});

/**
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * GET /api/auth/me
 */
const authMe = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Authenticated"
    )
  );
});

export { login, logout, authMe };
