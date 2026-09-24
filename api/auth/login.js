import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import jwt from "jsonwebtoken";
import { authRateLimit, handleValidationErrors, securityHeaders } from "../../lib/security.js";
import { body } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "taskpanda_secret_key_2026";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

const loginValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
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

  await new Promise((resolve) => authRateLimit(req, res, resolve));
  if (res.headersSent) return;

  await Promise.all(loginValidation.map((v) => v.run(req)));
  const errors = (await import("express-validator")).validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

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
    return res.json({
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
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Login failed" });
  }
}