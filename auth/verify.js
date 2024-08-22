const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../database/dbConnection"); // Adjust if necessary
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khasomsin@gmail.com", // Replace with your actual email
    pass: "vxtf ondu fdla rfwa", // Replace with your actual email password
  },
});

// Rate limiter middleware
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    message: "error",
    status: 429,
    data: {
      message: "Too many OTP requests, please try again later.",
    },
  },
});

// Verify OTP
router.post("/verify", otpLimiter, (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "error",
      status: 400,
      data: {
        message: "Email and OTP are required",
      },
    });
  }

  const query =
    "SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expires > NOW()";
  db.query(query, [email, otp], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "error",
        status: 500,
        data: {
          message: "Database error",
        },
      });
    }
    if (results.length === 0) {
      return res.status(400).json({
        message: "error",
        status: 400,
        data: {
          message: "Invalid OTP or OTP has expired",
        },
      });
    }

    const updateQuery =
      "UPDATE users SET otp = NULL, otp_expires = NULL, is_verified = TRUE WHERE email = ?";
    db.query(updateQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "error",
          status: 500,
          data: {
            message: "Database error",
          },
        });
      }
      res.status(200).json({
        message: "success",
        status: 200,
        data: {
          message: "OTP verified successfully. Your email is now verified.",
        },
      });
    });
  });
});

// Resend OTP
router.post("/resend-otp", otpLimiter, (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "error",
      status: 400,
      data: {
        message: "Email is required",
      },
    });
  }

  const checkUserQuery = "SELECT otp_expires FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "error",
        status: 500,
        data: {
          message: "Database error",
        },
      });
    }
    if (results.length === 0) {
      return res.status(400).json({
        message: "error",
        status: 400,
        data: {
          message: "User does not exist",
        },
      });
    }

    const currentOtpExpires = results[0].otp_expires;
    if (currentOtpExpires && new Date(currentOtpExpires) > new Date()) {
      return res.status(400).json({
        message: "error",
        status: 400,
        data: {
          message:
            "OTP has not expired yet. Please wait until the current OTP expires.",
        },
      });
    }

    const otp = crypto.randomInt(1000, 9999);
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    const updateQuery =
      "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?";
    db.query(updateQuery, [otp, otpExpires, email], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "error",
          status: 500,
          data: {
            message: "Database error",
          },
        });
      }

      const mailOptions = {
        from: "khasomsin@gmail.com", // Replace with your actual email
        to: email,
        subject: "New OTP for Email Verification",
        text: `Your new OTP code is ${otp}. It is valid for 10 minutes.`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).json({
            message: "error",
            status: 500,
            data: {
              message: "Error sending OTP email",
            },
          });
        }
        res.status(200).json({
          message: "success",
          status: 200,
          data: {
            message: "OTP code sent successfully, Please check your email",
            expires_at: otpExpires.toISOString(),
            otp_code: otp,
          },
        });
      });
    });
  });
});

module.exports = router;
