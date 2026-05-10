import multer from "multer";
import path from "node:path";
import { HttpError } from "./http-errors.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "application/pdf"
]);

export const incidentEvidenceUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new HttpError(400, "Unsupported file type for incident evidence"));
      return;
    }

    cb(null, true);
  }
});

export function buildEvidenceUrl(originalName: string) {
  const extension = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, extension).replace(/[^a-z0-9-_]/gi, "-").toLowerCase();

  return `/uploads/${Date.now()}-${baseName}${extension}`;
}