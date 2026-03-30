import bcrypt from "bcrypt";

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const hashOtp = (otp) => bcrypt.hash(otp, 10);
export const compareOtp = (otp, hash) => bcrypt.compare(otp, hash);