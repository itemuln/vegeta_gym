import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createHash } from "crypto";
import { insertMemberSchema, insertTrainerSchema, insertBranchSchema, insertPaymentSchema, insertCourseSchema, loginSchema } from "@shared/schema";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(userId: string): string {
  const payload = `${userId}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Хэрэглэгчийн нэр, нууц үг шаардлагатай" });
      }
      const user = await storage.getUserByUsername(parsed.data.username);
      if (!user) {
        return res.status(401).json({ error: "Хэрэглэгч олдсонгүй" });
      }
      if (user.password !== hashPassword(parsed.data.password)) {
        return res.status(401).json({ error: "Нууц үг буруу" });
      }
      const token = generateToken(user.id);
      res.json({
        token,
        user: { id: user.id, username: user.username, fullName: user.fullName, role: user.role, branchId: user.branchId },
      });
    } catch (e) {
      res.status(500).json({ error: "Серверийн алдаа" });
    }
  });

  app.get("/api/members", async (_req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const parsed = insertMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Буруу мэдээлэл", details: parsed.error });
      }
      const member = await storage.createMember(parsed.data);
      res.json(member);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/trainers", async (_req, res) => {
    try {
      const trainers = await storage.getTrainers();
      res.json(trainers);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.post("/api/trainers", async (req, res) => {
    try {
      const parsed = insertTrainerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Буруу мэдээлэл", details: parsed.error });
      }
      const trainer = await storage.createTrainer(parsed.data);
      res.json(trainer);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/branches", async (_req, res) => {
    try {
      const branches = await storage.getBranches();
      res.json(branches);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const parsed = insertBranchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Буруу мэдээлэл", details: parsed.error });
      }
      const branch = await storage.createBranch(parsed.data);
      res.json(branch);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/payments", async (_req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const parsed = insertPaymentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Буруу мэдээлэл", details: parsed.error });
      }
      const payment = await storage.createPayment(parsed.data);
      res.json(payment);
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (e) {
      console.error("Dashboard error:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (e) {
      console.error("Analytics error:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/public/branches", async (_req, res) => {
    try {
      const branches = await storage.getPublicBranches();
      res.json(branches);
    } catch (e) {
      console.error("Error fetching public branches:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/public/trainers", async (_req, res) => {
    try {
      const trainers = await storage.getPublicTrainers();
      res.json(trainers);
    } catch (e) {
      console.error("Error fetching public trainers:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/public/courses", async (_req, res) => {
    try {
      const courses = await storage.getPublicCourses();
      res.json(courses);
    } catch (e) {
      console.error("Error fetching public courses:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/public/stats", async (_req, res) => {
    try {
      const stats = await storage.getPublicStats();
      res.json(stats);
    } catch (e) {
      console.error("Error fetching public stats:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Шаардлагатай талбаруудыг бөглөнө үү" });
      }
      console.log("Contact form submission:", { name, email, phone, message });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Алдаа" });
    }
  });

  app.get("/api/investor", async (_req, res) => {
    try {
      const investor = await storage.getInvestorStats();
      res.json(investor);
    } catch (e) {
      console.error("Investor error:", e);
      res.status(500).json({ error: "Алдаа" });
    }
  });

  return httpServer;
}
