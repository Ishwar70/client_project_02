import express from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);


/* ================= PROTECTED ROUTES ================= */

// Get current logged-in user
router.get("/me", protect, getMe);

// Logout
router.post("/logout", protect, logout);

export default router;