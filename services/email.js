const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "test@example.com",
      pass: process.env.SMTP_PASS || "testpassword",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || "TaskPanda <no-reply@taskpanda.com>",
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your TaskPanda account.</p>
        <p>Click the link below to reset your password. This link expires in 15 minutes:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
        <p>If you did not request this reset, please ignore this email. Your password will not be changed.</p>
        <p style="color: #888; font-size: 12px;">This reset code is single-use and expires after 15 minutes.</p>
      </div>
    `,
    text: `
      You requested a password reset for your TaskPanda account.
      
      Click the link below to reset your password. This link expires in 15 minutes:
      ${resetUrl}
      
      If you did not request this reset, please ignore this email. Your password will not be changed.
      
      This reset code is single-use and expires after 15 minutes.
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
