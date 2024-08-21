const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../database/dbConnection");
const router = express.Router();
const saltRounds = 10;

// Direct email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khasomsin@gmail.com", // Replace with your actual email
    pass: "vxtf ondu fdla rfwa", // Replace with your actual email password
  },
});

// User Registration
router.post("/register", async (req, res) => {
  const { fullname, password, email } = req.body;

  console.log("Received registration request with data:", req.body);

  if (!fullname || !password || !email) {
    console.error("Missing required fields:", { fullname, password, email });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkUserQuery =
      "SELECT * FROM users WHERE fullname = ? OR email = ?";
    const [results] = await db
      .promise()
      .query(checkUserQuery, [fullname, email]);

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const otp = crypto.randomInt(1000, 9999);
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes from now
    const passwordToken = crypto.randomBytes(32).toString("hex");

    const query =
      "INSERT INTO users (fullname, password, email, otp, otp_expires, password_token) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(query, [
        fullname,
        hashedPassword,
        email,
        otp,
        otpExpires,
        passwordToken,
      ]);

    const mailOptions = {
      from: "your-email@gmail.com", // Replace with your actual email
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ message: "Error sending OTP email" });
      }
      res.status(201).json({
        message:
          "User registered successfully. Please check your email for the OTP.",
      });
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
