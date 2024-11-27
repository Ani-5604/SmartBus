// Import required modules
require('dotenv').config();  // Load environment variables
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const cityRouter = require("./src/controllers/city.controller");
const busRouter = require("./src/controllers/bus.controller");
const userRouter = require("./src/controllers/user.controller");
const orderRouter = require("./src/controllers/order.controller");
const paymentController = require('./src/controllers/payment.controller');
const connect = require("./src/configs/db");

const app = express();
const port = process.env.PORT || 8070;  // Use environment PORT if available, else fallback to 8070

// Middleware
app.use(cors({
  origin: "http://localhost:3000",  // Allow frontend on localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
}));
app.use(express.json());  // Use built-in express middleware to parse JSON requests

// Routes
app.use("/user", userRouter);
app.use("/city", cityRouter);
app.use("/bus", busRouter);
app.use("/order", orderRouter);
app.use("/api/payment", paymentController);  // Razorpay payment route

// Temporary "database" for user emails (this should be replaced with a real DB)
const users = [
  { email: "user@example.com", name: "John Doe" },
  // Add more users as needed
];

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);  // Generates a 6-digit OTP
};

// Create a transporter for Nodemailer to send emails using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILERUSER,  // Use email from environment variable
    pass: process.env.NODEMAILERPASSWORD  // Use password from environment variable
  }
});

// POST endpoint for sending OTP
app.post('/user/submit-otp', (req, res) => {
  const { email } = req.body;

  // Check if the user exists in our "database"
  const user = users.find(u => u.email === email);

  if (!user) {
    // If the user doesn't exist, return an error (404)
    return res.status(404).json({ code: 404, message: 'User not found. Please sign up first.' });
  }

  // If the user exists, generate an OTP and send it via email
  const otp = generateOTP();

  // Send OTP via email
  const mailOptions = {
    from: process.env.NODEMAILERUSER,  // Sender's email from environment variable
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ code: 500, message: 'Server error. Please try again later.' });
    }

    console.log('OTP sent: ' + info.response);

    // If email sent successfully, respond with a success code (200)
    res.status(200).json({ code: 200, message: 'OTP has been sent to your email.' });
  });
});

// Handle any other routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server and connect to DB
app.listen(port, async () => {
  try {
    await connect();
    console.log(`Server is listening on http://localhost:${port}`);
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
});

// Generic error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.stack);
  res.status(500).json({
    status: 'Failed',
    message: 'Internal Server Error',
  });
});
