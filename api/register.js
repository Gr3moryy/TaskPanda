import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import jwt from "jsonwebtoken";
import { registerRateLimit, handleValidationErrors, securityHeaders } from "../../lib/security.js";
import { body } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "taskpanda_secret_key_2026";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

const registerValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 12 }).withMessage("Password must be at least 12 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character")
    .not().matches(/(.)\1{2,}/).withMessage("Password must not contain repeating characters"),
  body("role").isIn(["client", "provider", "admin"]).withMessage("Invalid role"),
  body("fullName").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Full name must be between 2 and 50 characters"),
  body("username").optional().trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
  body("professions").optional().isArray().withMessage("Professions must be an array"),
  body("province").optional().trim().isLength({ max: 100 }),
  body("city").optional().trim().isLength({ max: 100 }),
  body("barangay").optional().trim().isLength({ max: 100 }),
  body("address").optional().trim().isLength({ max: 200 }),
];

export default async function handler(req, res) {
  securityHeaders(req, res, () => {});
  
  const origin = req.headers.origin;
  const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"].filter(Boolean);
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();

  await new Promise((resolve) => registerRateLimit(req, res, resolve));
  if (res.headersSent) return;

  await Promise.all(registerValidation.map((v) => v.run(req)));
  const errors = (await import("express-validator")).validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

  try {
    const { email, password, role, fullName, province, city, barangay, barangayCode, address, username, professions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists. Please try logging in." });
    }

    const userData = { email, password, role, fullName: fullName || undefined };
    if (username) userData.username = username;
    if (professions) userData.professions = professions;
    if (province) userData.province = province;
    if (city) userData.city = city;
    if (barangay) userData.barangay = barangay;
    if (barangayCode) userData.barangayCode = barangayCode;
    if (address) userData.address = address;

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);
    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName, username: user.username, isVerified: user.isVerified, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ error: "Registration failed. Server error - please try again later." });
  }
}