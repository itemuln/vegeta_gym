import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import { seedDatabase } from "../server/seed";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

let initialized = false;

async function initialize() {
  if (initialized) return;
  initialized = true;

  try {
    await seedDatabase();
  } catch (e) {
    console.error("Seed error:", e);
  }

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initialize();
  app(req as any, res as any);
}
