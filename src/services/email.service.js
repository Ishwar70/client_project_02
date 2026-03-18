const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, data, isClient = false) => {
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
};

module.exports = sendEmail;