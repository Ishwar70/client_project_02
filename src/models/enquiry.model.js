const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  place: String,
  date: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);