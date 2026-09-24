require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const connectDB = require("./db.js");
const authRoutes = require("./routes/auth.js");
const User = require("./models/User.js");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoSanitize = (req, res, next) => {
  const sanitize = (obj, depth = 0) => {
    if (depth > 10) return undefined;
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map((item) => sanitize(item, depth + 1));
    const result = {};
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      result[key] = sanitize(obj[key], depth + 1);
    }
    return result;
  };
  req.body = sanitize(req.body);
  next();
};
app.use(mongoSanitize);

const xssClean = (req, res, next) => {
  const escapeHtml = (str) => {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  };
  const sanitize = (obj, depth = 0) => {
    if (depth > 10) return undefined;
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map((item) => sanitize(item, depth + 1));
    const result = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (typeof value === "string") {
        result[key] = escapeHtml(value);
      } else {
        result[key] = sanitize(value, depth + 1);
      }
    }
    return result;
  };
  if (req.body && typeof req.body === "object") {
    req.body = sanitize(req.body);
  }
  next();
};
app.use(xssClean);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(file.mimetype);
    cb(ok ? null : new Error("Only image files are allowed"), ok);
  },
});

app.use("/api/auth", authRoutes);

app.post("/register", async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists. Please try logging in." });
    }
    const user = await User.create({ email, password, role, fullName: fullName || undefined });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "taskpanda_secret_key_2026", { expiresIn: "30d" });
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName, username: user.username, isVerified: user.isVerified },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    console.error("Register error stack:", error.stack);
    res.status(500).json({ message: "Registration failed. Server error - please try again later." });
  }
});

app.use(express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/verify", upload.fields([
  { name: "idFront", maxCount: 1 },
  { name: "idBack", maxCount: 1 },
]), (req, res) => {
  try {
    if (!req.files || !req.files.idFront || !req.files.idBack) {
      return res.status(400).json({ error: "Both ID front and ID back images are required" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/worker-register", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`TaskPanda server running at http://localhost:${PORT}`);
    });
  });
}

module.exports = app;