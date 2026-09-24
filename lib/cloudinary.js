import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function uploadToCloudinary(buffer, options = {}) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary not configured");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "taskpanda",
        resource_type: "image",
        transformation: options.transformation || [
          { width: 800, height: 800, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    bufferToStream(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return;
  return await cloudinary.uploader.destroy(publicId);
}