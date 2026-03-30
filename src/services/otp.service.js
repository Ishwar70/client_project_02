import User from "../models/user.model.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { getTransporter } from "../config/mailer.js";

export const sendOtp = async (email, type = "verify") => {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  const data =
    type === "verify"
      ? {
          otpHash,
          otpExpires: new Date(Date.now() + 5 * 60 * 1000),
          otpAttempts: 0,
        }
      : {
          resetOtpHash: otpHash,
          resetOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
        };

  await User.updateOne({ email }, data);

  const transporter = getTransporter();

  await transporter.sendMail({
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  });
};