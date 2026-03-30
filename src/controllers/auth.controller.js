import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { compareOtp } from "../utils/otp.js";
import { sendOtp } from "../services/otp.service.js";
import { generateToken } from "../utils/jwt.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user && user.isVerified)
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await hashPassword(password);

    if (!user) {
      await User.create({ name, email, password: hashed });
    } else {
      user.password = hashed;
      await user.save();
    }

    await sendOtp(email, "verify");
    res.json({ msg: "OTP sent for verification" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otpHash)
      return res.status(400).json({ msg: "No OTP found" });

    if (user.otpExpires < new Date())
      return res.status(400).json({ msg: "OTP expired" });

    const isMatch = await compareOtp(otp, user.otpHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid OTP" });

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT after verification
    const token = generateToken(user._id);

    res.json({ 
      msg: "Account verified ✅", 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.isVerified) return res.status(400).json({ msg: "Verify account first" });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    // Generate JWT
    const token = generateToken(user._id);

    res.json({ 
      msg: "Login successful 🎉", 
      token,
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email not registered" });

    await sendOtp(email, "reset");
    res.json({ msg: "Reset OTP sent" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.resetOtpHash)
      return res.status(400).json({ msg: "Invalid request" });

    if (user.resetOtpExpires < new Date())
      return res.status(400).json({ msg: "OTP expired" });

    const isMatch = await compareOtp(otp, user.resetOtpHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid OTP" });

    user.password = await hashPassword(newPassword);
    user.resetOtpHash = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ msg: "Password reset successful 🔐" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};