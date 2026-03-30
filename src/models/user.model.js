import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: { type: String, required: true },

    isVerified: { type: Boolean, default: false },

    otpHash: String,
    otpExpires: Date,
    otpAttempts: { type: Number, default: 0 },

    resetOtpHash: String,
    resetOtpExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);