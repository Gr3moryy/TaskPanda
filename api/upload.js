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
    
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
    }

    const boundary = contentType.split("boundary=")[1];
    if (!boundary) {
      return res.status(400).json({ error: "Missing boundary" });
    }

    const parts = buffer.toString("binary").split(`--${boundary}`);
    const files = {};

    for (const part of parts) {
      if (part.includes("name=\"avatar\"")) {
        const dataStart = part.indexOf("\r\n\r\n") + 4;
        const dataEnd = part.lastIndexOf("\r\n");
        if (dataStart > 3 && dataEnd > dataStart) {
          const fileData = part.slice(dataStart, dataEnd);
          files.avatar = Buffer.from(fileData, "binary");
        }
      }
    }

    if (!files.avatar) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadToCloudinary(files.avatar, { folder: "taskpanda/avatars" });

    return res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ error: "Upload failed" });
  }
}