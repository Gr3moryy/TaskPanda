import { connectDB } from "../../lib/db.js";
import { uploadToCloudinary } from "../../lib/cloudinary.js";

export const config = {
  api: {
    bodyParser: false,
  },
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
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Simple multipart parsing for two files
    // In production, use a proper multipart parser like formidable
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    // For simplicity, we'll use a basic approach
    // In production, use formidable or busboy
    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return res.status(400).json({ error: "Missing boundary" });
    }

    const parts = buffer.toString("binary").split(`--${boundary}`);
    const files = {};

    for (const part of parts) {
      if (part.includes("name=\"idFront\"")) {
        const dataStart = part.indexOf("\r\n\r\n") + 4;
        const dataEnd = part.lastIndexOf("\r\n");
        if (dataStart > 3 && dataEnd > dataStart) {
          const fileData = part.slice(dataStart, dataEnd);
          files.idFront = Buffer.from(fileData, "binary");
        }
      }
      if (part.includes("name=\"idBack\"")) {
        const dataStart = part.indexOf("\r\n\r\n") + 4;
        const dataEnd = part.lastIndexOf("\r\n");
        if (dataStart > 3 && dataEnd > dataStart) {
          const fileData = part.slice(dataStart, dataEnd);
          files.idBack = Buffer.from(fileData, "binary");
        }
      }
    }

    if (!files.idFront || !files.idBack) {
      return res.status(400).json({ error: "Both ID front and ID back images are required" });
    }

    const [frontResult, backResult] = await Promise.all([
      uploadToCloudinary(files.idFront, { folder: "taskpanda/verification" }),
      uploadToCloudinary(files.idBack, { folder: "taskpanda/verification" }),
    ]);

    return res.json({
      success: true,
      idFront: { url: frontResult.secure_url, publicId: frontResult.public_id },
      idBack: { url: backResult.secure_url, publicId: backResult.public_id },
    });
  } catch (error) {
    console.error("Verification upload error:", error.message);
    return res.status(500).json({ error: "Verification failed" });
  }
}