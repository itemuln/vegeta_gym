import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["super_admin", "branch_manager", "trainer", "viewer"]);
export const membershipTypeEnum = pgEnum("membership_type", ["basic", "premium", "athlete"]);
export const membershipStatusEnum = pgEnum("membership_status", ["active", "suspended", "expired"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: roleEnum("role").notNull().default("viewer"),
  branchId: varchar("branch_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull().default("Улаанбаатар"),
  country: text("country").notNull().default("Монгол"),
  operatingCost: decimal("operating_cost", { precision: 12, scale: 2 }).notNull().default("5000000"),
  hours: text("hours").notNull().default("Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00"),
  features: text("features").array().default(sql`ARRAY[]::text[]`),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  membershipType: membershipTypeEnum("membership_type").notNull().default("basic"),
  membershipStatus: membershipStatusEnum("membership_status").notNull().default("active"),
  monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }).notNull().default("150000"),
  branchId: varchar("branch_id").notNull(),
  trainerId: varchar("trainer_id"),
  joinDate: date("join_date").notNull().default(sql`CURRENT_DATE`),
  weight: decimal("weight", { precision: 5, scale: 1 }),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainers = pgTable("trainers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  certification: text("certification").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").default(""),
  branchId: varchar("branch_id").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull().default("1500000"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Dumbbell"),
  difficulty: text("difficulty").notNull().default("Бүх түвшин"),
  duration: text("duration").notNull().default("60 мин"),
  schedule: text("schedule").notNull().default(""),
  color: text("color").notNull().default("hsl(0 72% 51%)"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull().default(sql`CURRENT_DATE`),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  branchId: varchar("branch_id").notNull(),
  status: text("status").notNull().default("paid"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  branchId: varchar("branch_id").notNull(),
  checkInTime: timestamp("check_in_time").notNull().defaultNow(),
  checkOutTime: timestamp("check_out_time"),
});

export const performanceRecords = pgTable("performance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  recordDate: date("record_date").notNull().default(sql`CURRENT_DATE`),
  weight: decimal("weight", { precision: 5, scale: 1 }),
  benchPress: decimal("bench_press", { precision: 5, scale: 1 }),
  squat: decimal("squat", { precision: 5, scale: 1 }),
  deadlift: decimal("deadlift", { precision: 5, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  branchId: true,
});

export const insertBranchSchema = createInsertSchema(branches).pick({
  name: true,
  address: true,
  phone: true,
  city: true,
  country: true,
  operatingCost: true,
  hours: true,
  features: true,
});

export const insertMemberSchema = createInsertSchema(members).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  membershipType: true,
  membershipStatus: true,
  monthlyFee: true,
  branchId: true,
  trainerId: true,
  weight: true,
});

export const insertTrainerSchema = createInsertSchema(trainers).pick({
  firstName: true,
  lastName: true,
  phone: true,
  email: true,
  certification: true,
  specialty: true,
  bio: true,
  branchId: true,
  salary: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  icon: true,
  difficulty: true,
  duration: true,
  schedule: true,
  color: true,
  sortOrder: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  memberId: true,
  amount: true,
  month: true,
  year: true,
  branchId: true,
  status: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).pick({
  memberId: true,
  branchId: true,
});

export const insertPerformanceSchema = createInsertSchema(performanceRecords).pick({
  memberId: true,
  weight: true,
  benchPress: true,
  squat: true,
  deadlift: true,
  notes: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type InsertTrainer = z.infer<typeof insertTrainerSchema>;
export type Trainer = typeof trainers.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
export type PerformanceRecord = typeof performanceRecords.$inferSelect;
