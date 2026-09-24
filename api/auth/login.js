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

const loginValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  return null;
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  await new Promise((resolve) => authLimiter(req, res, resolve));
  if (res.headersSent) return;

  await Promise.all(loginValidation.map((v) => v.run(req)));
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

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
    return res.status(500).json({ message: "Login failed" });
  }
}