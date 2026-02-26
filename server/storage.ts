import { eq, sql, and, count, sum, desc } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
const db = drizzle(pool, { schema });

export interface IStorage {
  getUser(id: string): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;

  getBranches(): Promise<any[]>;
  getBranch(id: string): Promise<schema.Branch | undefined>;
  createBranch(branch: schema.InsertBranch): Promise<schema.Branch>;

  getMembers(): Promise<any[]>;
  getMember(id: string): Promise<schema.Member | undefined>;
  createMember(member: schema.InsertMember): Promise<schema.Member>;

  getTrainers(): Promise<any[]>;
  getTrainer(id: string): Promise<schema.Trainer | undefined>;
  createTrainer(trainer: schema.InsertTrainer): Promise<schema.Trainer>;

  getCourses(): Promise<schema.Course[]>;
  createCourse(course: schema.InsertCourse): Promise<schema.Course>;

  getPayments(): Promise<any[]>;
  createPayment(payment: schema.InsertPayment): Promise<schema.Payment>;

  getDashboardStats(): Promise<any>;
  getAnalytics(): Promise<any>;
  getInvestorStats(): Promise<any>;

  getPublicBranches(): Promise<any[]>;
  getPublicTrainers(): Promise<any[]>;
  getPublicCourses(): Promise<any[]>;
  getPublicStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(user: schema.InsertUser) {
    const [created] = await db.insert(schema.users).values(user).returning();
    return created;
  }

  async getBranches() {
    const branchList = await db.select().from(schema.branches);
    const result = [];
    for (const b of branchList) {
      const [mc] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.branchId, b.id));
      const [tc] = await db.select({ count: count() }).from(schema.trainers).where(eq(schema.trainers.branchId, b.id));
      const [rev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments).where(eq(schema.payments.branchId, b.id));
      result.push({
        ...b,
        memberCount: mc?.count || 0,
        trainerCount: tc?.count || 0,
        revenue: parseFloat(rev?.total as string || "0"),
      });
    }
    return result;
  }

  async getBranch(id: string) {
    const [branch] = await db.select().from(schema.branches).where(eq(schema.branches.id, id));
    return branch;
  }

  async createBranch(branch: schema.InsertBranch) {
    const [created] = await db.insert(schema.branches).values(branch).returning();
    return created;
  }

  async getMembers() {
    const memberList = await db.select().from(schema.members).orderBy(desc(schema.members.createdAt));
    const branchList = await db.select().from(schema.branches);
    const branchMap = new Map(branchList.map(b => [b.id, b.name]));
    return memberList.map(m => ({
      ...m,
      branchName: branchMap.get(m.branchId) || "-",
    }));
  }

  async getMember(id: string) {
    const [member] = await db.select().from(schema.members).where(eq(schema.members.id, id));
    return member;
  }

  async createMember(member: schema.InsertMember) {
    const [created] = await db.insert(schema.members).values(member).returning();
    return created;
  }

  async getTrainers() {
    const trainerList = await db.select().from(schema.trainers).orderBy(desc(schema.trainers.createdAt));
    const branchList = await db.select().from(schema.branches);
    const branchMap = new Map(branchList.map(b => [b.id, b.name]));
    const result = [];
    for (const t of trainerList) {
      const [mc] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.trainerId, t.id));
      result.push({
        ...t,
        branchName: branchMap.get(t.branchId) || "-",
        memberCount: mc?.count || 0,
      });
    }
    return result;
  }

  async getTrainer(id: string) {
    const [trainer] = await db.select().from(schema.trainers).where(eq(schema.trainers.id, id));
    return trainer;
  }

  async createTrainer(trainer: schema.InsertTrainer) {
    const [created] = await db.insert(schema.trainers).values(trainer).returning();
    return created;
  }

  async getPayments() {
    const paymentList = await db.select().from(schema.payments).orderBy(desc(schema.payments.createdAt));
    const memberList = await db.select().from(schema.members);
    const branchList = await db.select().from(schema.branches);
    const memberMap = new Map(memberList.map(m => [m.id, `${m.lastName} ${m.firstName}`]));
    const branchMap = new Map(branchList.map(b => [b.id, b.name]));
    return paymentList.map(p => ({
      ...p,
      memberName: memberMap.get(p.memberId) || "-",
      branchName: branchMap.get(p.branchId) || "-",
    }));
  }

  async createPayment(payment: schema.InsertPayment) {
    const [created] = await db.insert(schema.payments).values(payment).returning();
    return created;
  }

  async getDashboardStats() {
    const [totalMembers] = await db.select({ count: count() }).from(schema.members);
    const [activeMembers] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.membershipStatus, "active"));
    const [totalTrainers] = await db.select({ count: count() }).from(schema.trainers);
    const [totalBranches] = await db.select({ count: count() }).from(schema.branches);

    const membersByType = await db
      .select({ type: schema.members.membershipType, count: count() })
      .from(schema.members)
      .groupBy(schema.members.membershipType);

    const typeLabels: Record<string, string> = { basic: "Энгийн", premium: "Премиум", athlete: "Тамирчин" };
    const membershipBreakdown = membersByType.map(m => ({
      type: typeLabels[m.type] || m.type,
      count: m.count,
    }));

    const branchList = await db.select().from(schema.branches);
    const branchStats = [];
    for (const b of branchList) {
      const [mc] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.branchId, b.id));
      const [tc] = await db.select({ count: count() }).from(schema.trainers).where(eq(schema.trainers.branchId, b.id));
      branchStats.push({ name: b.name, members: mc?.count || 0, trainers: tc?.count || 0 });
    }

    const monthlyRevenue = [];
    const months = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
    for (let i = 0; i < 12; i++) {
      const m = (i + 1).toString();
      const [rev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments).where(and(eq(schema.payments.month, m), eq(schema.payments.year, 2026)));
      monthlyRevenue.push({ month: months[i], revenue: parseFloat(rev?.total as string || "0") });
    }

    const recentMembers = await db.select().from(schema.members).orderBy(desc(schema.members.createdAt)).limit(5);
    const branchMap = new Map(branchList.map(b => [b.id, b.name]));
    const recentWithBranch = recentMembers.map(m => ({
      ...m,
      branchName: branchMap.get(m.branchId) || "-",
    }));

    return {
      totalMembers: totalMembers.count,
      activeMembers: activeMembers.count,
      totalTrainers: totalTrainers.count,
      totalBranches: totalBranches.count,
      membershipBreakdown,
      branchStats,
      monthlyRevenue,
      recentMembers: recentWithBranch,
    };
  }

  async getAnalytics() {
    const [totalMembers] = await db.select({ count: count() }).from(schema.members);
    const [activeMembers] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.membershipStatus, "active"));
    const [totalRev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments);
    const totalRevenue = parseFloat(totalRev?.total as string || "0");
    const avgRevenuePerMember = totalMembers.count > 0 ? totalRevenue / totalMembers.count : 0;

    const [monthlyAtt] = await db.select({ count: count() }).from(schema.attendance);

    const months = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
    const monthlyTrend = [];
    for (let i = 0; i < 12; i++) {
      const m = (i + 1).toString();
      const [rev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments).where(and(eq(schema.payments.month, m), eq(schema.payments.year, 2026)));
      monthlyTrend.push({ month: months[i], revenue: parseFloat(rev?.total as string || "0") });
    }

    const branchList = await db.select().from(schema.branches);
    const branchRevenue = [];
    for (const b of branchList) {
      const [rev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments).where(eq(schema.payments.branchId, b.id));
      branchRevenue.push({ name: b.name, revenue: parseFloat(rev?.total as string || "0") });
    }

    const statusLabels: Record<string, string> = { active: "Идэвхтэй", suspended: "Түр зогсоосон", expired: "Хугацаа дууссан" };
    const statusGroups = await db
      .select({ status: schema.members.membershipStatus, count: count() })
      .from(schema.members)
      .groupBy(schema.members.membershipStatus);
    const statusBreakdown = statusGroups.map(s => ({
      status: statusLabels[s.status] || s.status,
      count: s.count,
    }));

    return {
      totalRevenue,
      activeMembers: activeMembers.count,
      totalMembers: totalMembers.count,
      monthlyAttendance: monthlyAtt?.count || 0,
      avgRevenuePerMember,
      monthlyTrend,
      branchRevenue,
      statusBreakdown,
    };
  }

  async getCourses() {
    return await db.select().from(schema.courses).orderBy(schema.courses.sortOrder);
  }

  async createCourse(course: schema.InsertCourse) {
    const [created] = await db.insert(schema.courses).values(course).returning();
    return created;
  }

  async getPublicBranches() {
    const branchList = await db.select().from(schema.branches).where(eq(schema.branches.isActive, true));
    const result = [];
    for (const b of branchList) {
      const [mc] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.branchId, b.id));
      const [tc] = await db.select({ count: count() }).from(schema.trainers).where(eq(schema.trainers.branchId, b.id));
      result.push({
        id: b.id,
        name: b.name,
        address: b.address,
        phone: b.phone,
        city: b.city,
        hours: b.hours,
        features: b.features || [],
        memberCount: mc?.count || 0,
        trainerCount: tc?.count || 0,
      });
    }
    return result;
  }

  async getPublicTrainers() {
    const trainerList = await db.select().from(schema.trainers).where(eq(schema.trainers.isActive, true));
    const branchList = await db.select().from(schema.branches);
    const branchMap = new Map(branchList.map(b => [b.id, b.name]));
    return trainerList.map(t => ({
      id: t.id,
      firstName: t.firstName,
      lastName: t.lastName,
      specialty: t.specialty,
      certification: t.certification,
      bio: t.bio || "",
      branchName: branchMap.get(t.branchId) || "",
    }));
  }

  async getPublicCourses() {
    return await db.select().from(schema.courses).where(eq(schema.courses.isActive, true)).orderBy(schema.courses.sortOrder);
  }

  async getPublicStats() {
    const [activeMembers] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.membershipStatus, "active"));
    const [totalTrainers] = await db.select({ count: count() }).from(schema.trainers).where(eq(schema.trainers.isActive, true));
    const [totalBranches] = await db.select({ count: count() }).from(schema.branches).where(eq(schema.branches.isActive, true));
    const [totalCourses] = await db.select({ count: count() }).from(schema.courses).where(eq(schema.courses.isActive, true));

    return {
      activeMembers: activeMembers?.count || 0,
      totalTrainers: totalTrainers?.count || 0,
      totalBranches: totalBranches?.count || 0,
      weeklyCourses: (totalCourses?.count || 0) * 5,
    };
  }

  async getInvestorStats() {
    const [totalRev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments);
    const totalRevenue = parseFloat(totalRev?.total as string || "0");

    const branchList = await db.select().from(schema.branches);
    const totalOperatingCost = branchList.reduce((s, b) => s + parseFloat(b.operatingCost as string), 0);
    const trainerList = await db.select().from(schema.trainers);
    const totalSalaries = trainerList.reduce((s, t) => s + parseFloat(t.salary as string), 0);

    const monthlyOpCost = totalOperatingCost + totalSalaries;
    const annualRevenue = totalRevenue;
    const annualCost = monthlyOpCost * 12;
    const annualProfit = annualRevenue - annualCost;
    const initialInvestment = 500000000;

    const [activeMembers] = await db.select({ count: count() }).from(schema.members).where(eq(schema.members.membershipStatus, "active"));
    const [avgFee] = await db.select({ avg: sql<number>`COALESCE(AVG(${schema.members.monthlyFee}::numeric), 0)` }).from(schema.members).where(eq(schema.members.membershipStatus, "active"));
    const monthlyRevenue = (activeMembers?.count || 0) * (avgFee?.avg || 150000);

    const months = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
    const monthlyPnL = [];
    for (let i = 0; i < 12; i++) {
      const m = (i + 1).toString();
      const [rev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments).where(and(eq(schema.payments.month, m), eq(schema.payments.year, 2026)));
      monthlyPnL.push({
        month: months[i],
        revenue: parseFloat(rev?.total as string || "0"),
        cost: monthlyOpCost,
      });
    }

    const branchProfitability = [];
    for (const b of branchList) {
      const [rev] = await db.select({ total: sum(schema.payments.amount) }).from(schema.payments).where(eq(schema.payments.branchId, b.id));
      const branchTrainers = trainerList.filter(t => t.branchId === b.id);
      const branchSalaries = branchTrainers.reduce((s, t) => s + parseFloat(t.salary as string), 0);
      const branchCost = parseFloat(b.operatingCost as string) + branchSalaries;
      const branchRev = parseFloat(rev?.total as string || "0");
      branchProfitability.push({ name: b.name, profit: branchRev - branchCost * 12 });
    }

    return {
      annualRevenue,
      operatingCost: monthlyOpCost,
      annualProfit,
      initialInvestment,
      monthlyRevenue,
      monthlyPnL,
      branchProfitability,
    };
  }
}

export const storage = new DatabaseStorage();
