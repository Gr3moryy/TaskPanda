const path = require("path");
const express = require("express");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    res.status(500).json({ error: err.message });
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

app.post("/login", (req, res) => {
  res.redirect("/");
});

app.post("/register", (req, res) => {
  res.redirect("/login");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TaskPanda server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
