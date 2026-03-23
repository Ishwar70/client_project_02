const sendEmail = require('../services/email.service');

exports.submitForm = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Send response immediately (NO timeout now)
    res.status(200).json({
      success: true,
      message: "Form submitted successfully"
    });

    // ✅ Run emails in background (non-blocking)
    Promise.all([
      sendEmail(process.env.AGENT_EMAIL, 'New Enquiry', data),
      sendEmail(data.email, 'We received your enquiry', data, true)
    ]).catch(err => console.error("Email Error:", err));

  } catch (err) {
    console.error("❌ Controller Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};