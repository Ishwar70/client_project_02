import nodemailer from "nodemailer";

let transporter;

export const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  return transporter;
};

export const verifyMailer = async () => {
  try {
    await getTransporter().verify();
    console.log("✅ Mail server ready");
  } catch (err) {
    console.error("❌ Mail server error:", err.message);
  }
};