import express from "express";
import {
  register,
  login,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logout,
  getMe, 
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, getMe);

export default router;