import { connectDB } from "../../lib/db.js";
import User from "../../lib/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "taskpanda_secret_key_2026";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  try {
    const { email, password, role, fullName, province, city, barangay, barangayCode, address, username, professions } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists. Please try logging in." });
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
    return res.status(500).json({ message: "Registration failed. Server error - please try again later." });
  }
}