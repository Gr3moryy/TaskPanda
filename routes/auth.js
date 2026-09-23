const express = require("express");
const jwt = require("jsonwebtoken");
const {
  body,
  validationResult,
} = require("express-validator");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User.js");
const { sendPasswordResetEmail } = require("../services/email.js");

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "taskpanda_secret_key_2026", {
    expiresIn: "30d",
  });
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many password reset requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerValidation = [
  body("email")
    .trim()
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character"),
  body("role")
    .isIn(["client", "provider", "admin"]).withMessage("Invalid role"),
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Full name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Full name can only contain letters, spaces, hyphens, and apostrophes"),
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),
];

const resetPasswordValidation = [
  body("token")
    .trim()
    .notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .trim()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  next();
};

router.post("/register", authLimiter, registerValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password, role, fullName, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Registration failed" });
    }

    const user = await User.create({
      email,
      password,
      role,
      fullName: fullName || undefined,
      username: username || undefined,
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", authLimiter, loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/forgot-password", forgotPasswordLimiter, [
  body("email")
    .trim()
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
], handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent" });
    }

    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (emailError) {
      user.clearPasswordResetToken();
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: "Failed to send reset email. Please try again later" });
    }

    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent" });
  } catch (error) {
    res.status(500).json({ message: "Password reset request failed" });
  }
});

router.post("/verify-reset-token", authLimiter, [
  body("token")
    .trim()
    .notEmpty().withMessage("Reset token is required"),
], handleValidationErrors, async (req, res) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or has expired" });
    }

    res.status(200).json({ message: "Token is valid", email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Token verification failed" });
  }
});

router.post("/reset-password", authLimiter, resetPasswordValidation, handleValidationErrors, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or has expired" });
    }

    const { isMatch, isExpired } = user.validatePasswordResetToken(token);
    if (!isMatch || isExpired) {
      return res.status(400).json({ message: "Reset token is invalid or has expired" });
    }

    user.password = newPassword;
    user.clearPasswordResetToken();
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed" });
  }
});

module.exports = router;