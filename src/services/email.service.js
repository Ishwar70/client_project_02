const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

const sendEmail = async (to, subject, data, isClient = false) => {
  try {
    const templatePath = path.join(__dirname, '../views/emailTemplate.ejs');

    const html = await ejs.renderFile(templatePath, {
      data,
      isClient
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error(`❌ Email error for ${to}:`, error.message);
  }
};

module.exports = sendEmail;