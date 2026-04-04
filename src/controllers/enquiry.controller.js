import Enquiry from "../models/enquiry.model.js";
import { getTransporter } from "../config/mailer.js";
import ejs from "ejs";
import path from "path";

// 🚀 MAIN CONTROLLER
export const submitEnquiry = async (req, res) => {
  try {
    // Spread the body and ensure all fields are present
    const data = {
      ...req.body,
      // You can add default values here if needed, similar to your 'passengers' example
      submittedAt: new Date().toLocaleString(),
    };

    const newEnquiry = await Enquiry.create(data);

    // ✅ Fast response to the frontend to stop the loading spinner
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully ✅",
      data: newEnquiry,
    });

    // 📧 Trigger emails in the background
    sendEnquiryEmails(data);

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Something went wrong with your submission." 
    });
  }
};

// 📧 EMAIL FUNCTION
const sendEnquiryEmails = async (data) => {
  try {
    const transporter = getTransporter();

    // Resolve paths to your EJS templates
    const userTemplatePath = path.resolve("src/views/userEnquiryEmail.ejs");
    const adminTemplatePath = path.resolve("src/views/adminEnquiryEmail.ejs");

    // Render templates with the form data
    const userHtml = await ejs.renderFile(userTemplatePath, { data });
    const adminHtml = await ejs.renderFile(adminTemplatePath, { data });

    await Promise.all([
      // 1. Send confirmation to the User
      transporter.sendMail({
        from: `"Luxury Concierge" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: "We've Received Your Enquiry",
        html: userHtml,
      }),
      transporter.sendMail({
        from: `"System Alert" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 New Enquiry from ${data.name}`,
        html: adminHtml,
      }),
    ]);

    console.log("Enquiry emails sent successfully.");
  } catch (error) {
    console.error("Email Error:", error);
  }
};