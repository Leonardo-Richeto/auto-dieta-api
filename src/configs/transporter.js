const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: process.env.TP_HOST,
  port: process.env.TP_PORT,
  secure: true,
  auth: {
    user: process.env.TP_AUTH_USER,
    pass: process.env.TP_AUTH_PASS,
  },
});

module.exports = transporter;
