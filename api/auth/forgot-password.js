import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import { passwordResetRateLimit, handleValidationErrors, securityHeaders } from "../../lib/security.js";
import { sendPasswordResetEmail } from "../../lib/email.js";
import { body } from "express-validator";

const forgotValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
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

  await new Promise((resolve) => passwordResetRateLimit(req, res, resolve));
  if (res.headersSent) return;

  await Promise.all(forgotValidation.map((v) => v.run(req)));
  const errors = (await import("express-validator")).validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

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

    return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ error: "Password reset request failed" });
  }
}