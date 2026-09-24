import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const JWT_SECRET = process.env.JWT_SECRET || "taskpanda_secret_key_2026";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character"),
  body("role").isIn(["client", "provider", "admin"]).withMessage("Invalid role"),
  body("fullName").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Full name must be between 2 and 50 characters"),
];

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  return null;
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  // Apply rate limiting
  await new Promise((resolve) => authLimiter(req, res, resolve));
  if (res.headersSent) return;

  // Apply validation
  await Promise.all(registerValidation.map((v) => v.run(req)));
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const { email, password, role, fullName, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists. Please try logging in." });
    }

    const user = await User.create({
      email,
      password,
      role,
      fullName: fullName || undefined,
      username: username || undefined,
    });

    const token = generateToken(user._id, user.role);
    return res.status(201).json({
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
    return res.status(500).json({ message: "Registration failed. Server error - please try again later." });
  }
}