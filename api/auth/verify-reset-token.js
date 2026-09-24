import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyValidation = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
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

  await Promise.all(verifyValidation.map((v) => v.run(req)));
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

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

    return res.status(200).json({ message: "Token is valid", email: user.email });
  } catch (error) {
    console.error("Verify token error:", error.message);
    return res.status(500).json({ message: "Token verification failed" });
  }
}