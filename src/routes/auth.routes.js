import express from "express";
import {
  register,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getMe, 
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route to get user details using the token
router.get("/me", protect, getMe);

export default router;