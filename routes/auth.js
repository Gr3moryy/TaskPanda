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
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "taskpanda_secret_key_2026", {
    expiresIn: "30d",
  });
};

const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] MongoDB injection attempt blocked: ${key} in ${req.path}`);
  },
});

const xssProtection = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      return xss(obj, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
      });
    }
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === "object") {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
};

const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({ error: "Too many requests, please try again later" });
  },
});

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many authentication attempts, please try again in 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.warn(`[SECURITY] Auth rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({ error: "Too many authentication attempts, please try again in 15 minutes" });
  },
});

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many registration attempts, please try again in 1 hour" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Registration rate limit exceeded: ${req.ip}`);
    res.status(429).json({ error: "Too many registration attempts, please try again in 1 hour" });
  },
});

const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many password reset requests, please try again in 1 hour" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Password reset rate limit exceeded: ${req.ip}`);
    res.status(429).json({ error: "Too many password reset requests, please try again in 1 hour" });
  },
});

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn(`[SECURITY] Validation failed: ${req.ip} on ${req.path}`, errors.array());
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  next();
};

const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};

router.use(mongoSanitizeMiddleware);
router.use(xssProtection);
router.use(securityHeaders);
router.use(corsMiddleware);
router.use(strictRateLimit);

const registerValidation = [
  body("email")
    .trim()
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 12 }).withMessage("Password must be at least 12 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character")
    .not().matches(/(.)\1{2,}/).withMessage("Password must not contain repeating characters"),
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
    .isLength({ min: 12 }).withMessage("Password must be at least 12 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character")
    .not().matches(/(.)\1{2,}/).withMessage("Password must not contain repeating characters"),
];

router.post("/register", registerRateLimit, registerValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password, role, fullName, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists. Please try logging in." });
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
    console.error("Register error:", error.message);
    console.error("Register error stack:", error.stack);
    res.status(500).json({ error: "Registration failed. Server error - please try again later." });
  }
});

router.post("/login", authRateLimit, loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +loginAttempts +lockUntil");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ error: `Account locked. Try again in ${minutesLeft} minutes.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }
      await user.save();
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

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
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/forgot-password", passwordResetRateLimit, [
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
      return res.status(500).json({ error: "Failed to send reset email. Please try again later" });
    }

    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent" });
  } catch (error) {
    res.status(500).json({ error: "Password reset request failed" });
  }
});

router.post("/verify-reset-token", authRateLimit, [
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
      return res.status(400).json({ error: "Reset token is invalid or has expired" });
    }

    res.status(200).json({ message: "Token is valid", email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Token verification failed" });
  }
});

router.post("/reset-password", authRateLimit, resetPasswordValidation, handleValidationErrors, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ error: "Reset token is invalid or has expired" });
    }

    const { isMatch, isExpired } = user.validatePasswordResetToken(token);
    if (!isMatch || isExpired) {
      return res.status(400).json({ error: "Reset token is invalid or has expired" });
    }

    user.password = newPassword;
    user.clearPasswordResetToken();
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
});

module.exports = router;