import Enquiry from "../models/enquiry.model.js";
import { getTransporter } from "../config/mailer.js";
import ejs from "ejs";
import path from "path";

export const submitEnquiry = async (req, res) => {
  try {
    const { 
      name, email, phone, departCity, location, 
      passengers, date, days, message, agreed 
    } = req.body;

    const newEnquiry = await Enquiry.create({
      name,
      email,
      phone,
      departCity,
      location,
      passengers: passengers || 1, 
      date,
      days,
      message,
      agreed
    });

    // ✅ Fast response to frontend
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully ✅",
      data: newEnquiry,
    });

    // 📧 Trigger emails in the background
    // Pass the saved document (newEnquiry) so it has the DB timestamps/formatting
    sendEnquiryEmails(newEnquiry);

  } catch (error) {
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }

    console.error("Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Something went wrong with your submission." 
    });
  }
};


const sendEnquiryEmails = async (enquiryData) => {
  try {
    const transporter = getTransporter();

    const templateData = {
      ...enquiryData._doc,
      formattedDate: new Date(enquiryData.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      submittedAt: new Date(enquiryData.createdAt).toLocaleString()
    };

    const userTemplatePath = path.resolve("src/views/userEnquiryEmail.ejs");
    const adminTemplatePath = path.resolve("src/views/adminEnquiryEmail.ejs");

    
    const [userHtml, adminHtml] = await Promise.all([
      ejs.renderFile(userTemplatePath, { data: templateData }),
      ejs.renderFile(adminTemplatePath, { data: templateData })
    ]);

    await Promise.all([

      transporter.sendMail({
        from: `"Travel Concierge" <${process.env.EMAIL_USER}>`,
        to: enquiryData.email,
        subject: `Your trip to ${enquiryData.location} ✈️`,
        html: userHtml,
      }),

      transporter.sendMail({
        from: `"Booking System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 New Enquiry: ${enquiryData.name} - ${enquiryData.location}`,
        html: adminHtml,
      }),
    ]);

    console.log("Enquiry emails sent successfully.");
  } catch (error) {
    console.error("Email Error:", error);
  }
};