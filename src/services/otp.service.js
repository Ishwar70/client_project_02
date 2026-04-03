import User from "../models/user.model.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { getTransporter } from "../config/mailer.js";

export const sendOtp = async (email, type = "verify") => {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  const updateData =
    type === "verify"
      ? {
          otpHash,
          otpExpires: expiry,
          otpAttempts: 0,
        }
      : {
          resetOtpHash: otpHash,
          resetOtpExpires: expiry,
        };

  const user = await User.findOneAndUpdate({ email }, updateData, {
    new: true,
  });

  if (!user) throw new Error("User not found");

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject:
      type === "verify"
        ? "Verify your account"
        : "Reset your password",
    html: `
      <div style="font-family: Arial; text-align:center;">
        <h2>🔐 OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires in 5 minutes</p>
      </div>
    `,
  });

  // console.log(`OTP: ${otp}`); // ❌ remove in production
};