import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import fs from "fs";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "500mb" }));
  app.use(express.urlencoded({ limit: "500mb", extended: true }));

  registerOAuthRoutes(app);

  app.post("/api/upload-video", (req, res) => {
    try {
      const { filename, data } = req.body;
      
      if (!filename || !data) {
        console.error("Missing filename or data:", { filename: !!filename, data: !!data });
        return res.status(400).json({ error: "Missing filename or data" });
      }

      // Use the client/public directory as base
      const UPLOAD_DIR = path.join(process.cwd(), "client", "public", "uploads");

      // Ensure directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        console.log("Created upload directory:", UPLOAD_DIR);
      }

      const timestamp = Date.now();
      const uniqueFilename = `video-${timestamp}-${Math.random().toString(36).substring(7)}.mp4`;
      const filepath = path.join(UPLOAD_DIR, uniqueFilename);

      // Decode base64 and write file
      const buffer = Buffer.from(data, "base64");
      fs.writeFileSync(filepath, buffer);

      const url = `/uploads/${uniqueFilename}`;

      console.log("Video uploaded successfully:", { url, size: buffer.length });

      res.json({ 
        success: true, 
        url: url,
        filename: uniqueFilename,
        size: buffer.length 
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: `Error al subir archivo: ${error instanceof Error ? error.message : String(error)}` });
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
