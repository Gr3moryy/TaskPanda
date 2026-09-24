import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { sendPasswordResetEmail } from "../../lib/email.js";

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many password reset requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
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

  await new Promise((resolve) => forgotPasswordLimiter(req, res, resolve));
  if (res.headersSent) return;

  await Promise.all(forgotValidation.map((v) => v.run(req)));
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

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

    return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Password reset request failed" });
  }
}