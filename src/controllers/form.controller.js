import Form from "../models/form.model.js";
import { getTransporter } from "../config/mailer.js";
import ejs from "ejs";
import path from "path";

// 🚀 MAIN CONTROLLER
export const submitForm = async (req, res) => {
  try {
    const data = {
      ...req.body,
      passengers: req.body.passengers || "1",
    };

    const newForm = await Form.create(data);

    // ✅ Fast response
    res.status(201).json({
      success: true,
      message: "Form submitted successfully ✅",
      data: newForm,
    });
    sendEmails(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// 📧 EMAIL FUNCTION
const sendEmails = async (data) => {
  try {
    const transporter = getTransporter();

    const userTemplatePath = path.resolve("src/views/userEmail.ejs");
    const adminTemplatePath = path.resolve("src/views/adminEmail.ejs");

    const userHtml = await ejs.renderFile(userTemplatePath, { data });
    const adminHtml = await ejs.renderFile(adminTemplatePath, { data });

    await Promise.all([
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: "Thank You for Contacting Us",
        html: userHtml,
      }),

      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "🚨 New User Inquiry",
        html: adminHtml,
      }),
    ]);

  } catch (error) {
    console.error("Email Error:", error);
  }
};