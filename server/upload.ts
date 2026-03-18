import { Request, Response } from "express";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "client", "public", "uploads");

export async function handleVideoUpload(req: Request & { file?: any }, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `video-${timestamp}-${req.file.originalname}`;
    const filepath = join(UPLOAD_DIR, filename);

    writeFileSync(filepath, req.file.buffer);

    const url = `/uploads/${filename}`;

    res.json({ 
      success: true, 
      url: url,
      filename: filename,
      size: req.file.size 
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Error al subir archivo" });
  }
}
