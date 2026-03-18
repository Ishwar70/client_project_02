const express = require('express');
const router = express.Router();
const { getForm, submitForm } = require('../controllers/enquiry.controller');

router.get('/', getForm);
router.post('/submit', submitForm);

module.exports = router;