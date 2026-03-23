// const Enquiry = require('../models/enquiry.model');
const sendEmail = require('../services/email.service');

// exports.getForm = (req, res) => {
//   res.render('form');
// };

exports.submitForm = async (req, res) => {
  try {
    const data = req.body;

    // await Enquiry.create(data);
    await sendEmail(process.env.AGENT_EMAIL, 'New Enquiry', data);
    await sendEmail(data.email, 'We received your enquiry', data, true);
    res.render('success');
  } catch (err) {
    console.error(err);
    res.send('Error occurred');
  }
};