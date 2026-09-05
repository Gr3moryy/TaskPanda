const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

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
