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

const resetValidation = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .trim()
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/).withMessage("Password must contain at least one special character"),
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

  await Promise.all(resetValidation.map((v) => v.run(req)));
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

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

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Password reset failed" });
  }
}