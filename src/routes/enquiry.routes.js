const express = require('express');
const router = express.Router();
const { submitForm } = require('../controllers/enquiry.controller');

router.post('/submit', submitForm);

module.exports = router;