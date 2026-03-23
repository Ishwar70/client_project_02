const express = require('express');
const cors = require('cors');
const path = require('path');

const enquiryRoutes = require('./routes/enquiry.routes');

const app = express();

// https://client-project-01-six.vercel.app

// ✅ CORS (change for production)
app.use(cors({
  origin: ['https://client-project-01-six.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine (for email templates)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', enquiryRoutes);

module.exports = app;