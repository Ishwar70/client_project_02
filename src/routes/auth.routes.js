import express from "express";
import {
  register,
  verifyOtp,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { otpLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Register + Send OTP
router.post("/register", otpLimiter, register);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login
router.post("/login", login);

// Forgot Password (send reset OTP)
router.post("/forgot-password", otpLimiter, forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);


/* ================= PROTECTED ROUTES ================= */

// Get current logged-in user
router.get("/me", protect, getMe);

// Logout (client-side mainly)
router.post("/logout", protect, logout);

export default router;