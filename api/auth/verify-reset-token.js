import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import { authRateLimit, handleValidationErrors, securityHeaders } from "../../lib/security.js";
import crypto from "crypto";
import { body } from "express-validator";

const verifyValidation = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
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

  await Promise.all(verifyValidation.map((v) => v.run(req)));
  const errors = (await import("express-validator")).validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

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

    return res.status(200).json({ message: "Token is valid", email: user.email });
  } catch (error) {
    console.error("Verify token error:", error.message);
    return res.status(500).json({ error: "Token verification failed" });
  }
}