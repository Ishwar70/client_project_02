const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const enquiryRoutes = require('./routes/enquiry.routes');

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', enquiryRoutes);

module.exports = app;
