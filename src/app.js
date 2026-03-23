const express = require('express');
const path = require('path');
const cors = require('cors');

const enquiryRoutes = require('./routes/enquiry.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', enquiryRoutes);

module.exports = app;