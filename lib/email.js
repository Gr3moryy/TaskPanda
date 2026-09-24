import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP not configured, using Ethereal test account");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested a password reset for your TaskPanda account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 15 minutes.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Reset Your Password

You requested a password reset for your TaskPanda account.

Click here: ${resetUrl}

This link expires in 15 minutes.

If you didn't request this, please ignore this email.
  `;

  const transporter = getTransporter();
  
  if (!transporter) {
    // Log to console for development
    console.log("=== PASSWORD RESET EMAIL (dev mode) ===");
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("=====================================");
    return { success: true, dev: true };
  }

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM || "TaskPanda <no-reply@taskpanda.com>",
    to: email,
    subject: "Reset Your TaskPanda Password",
    text,
    html,
  });
}