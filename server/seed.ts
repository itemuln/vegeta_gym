import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { createHash } from "crypto";
import { users, branches, members, trainers, payments, attendance } from "@shared/schema";
import { count } from "drizzle-orm";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function seedDatabase() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const [existing] = await db.select({ count: count() }).from(users);
  if (existing.count > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database...");

  const [admin] = await db.insert(users).values({
    username: "admin",
    password: hashPassword("admin123"),
    fullName: "Ерөнхий Админ",
    role: "super_admin",
  }).returning();

  const branchData = [
    { name: "Төв салбар", address: "Сүхбаатар дүүрэг, Бага тойруу 15", phone: "+976 7711-2233", city: "Улаанбаатар", country: "Монгол", operatingCost: "5000000" },
    { name: "Баянгол салбар", address: "Баянгол дүүрэг, Энхтайвны өргөн чөлөө 23", phone: "+976 7711-4455", city: "Улаанбаатар", country: "Монгол", operatingCost: "4000000" },
    { name: "Хан-Уул салбар", address: "Хан-Уул дүүрэг, Чингисийн өргөн чөлөө 40", phone: "+976 7711-6677", city: "Улаанбаатар", country: "Монгол", operatingCost: "3500000" },
  ];

  const createdBranches = await db.insert(branches).values(branchData).returning();

  await db.insert(users).values([
    { username: "manager1", password: hashPassword("pass123"), fullName: "Болд Батбаяр", role: "branch_manager" as const, branchId: createdBranches[0].id },
    { username: "manager2", password: hashPassword("pass123"), fullName: "Сарнай Ганболд", role: "branch_manager" as const, branchId: createdBranches[1].id },
  ]);

  const trainerData = [
    { firstName: "Бат-Эрдэнэ", lastName: "Отгонбаяр", phone: "99112233", email: "baterdene@vegete.mn", certification: "NASM-CPT, CrossFit L3", specialty: "CrossFit, Хүч чадал", branchId: createdBranches[0].id, salary: "2000000" },
    { firstName: "Сарантуяа", lastName: "Батбаяр", phone: "99223344", email: "sarantuya@vegete.mn", certification: "ACE-CPT, RYT-500", specialty: "Йог, Уян хатан", branchId: createdBranches[0].id, salary: "1800000" },
    { firstName: "Ганбат", lastName: "Дорж", phone: "99334455", email: "ganbat@vegete.mn", certification: "NASM-CPT, Boxing A", specialty: "Бокс, Кикбоксинг", branchId: createdBranches[1].id, salary: "1900000" },
    { firstName: "Оюунчимэг", lastName: "Нямдорж", phone: "99445566", email: "oyunaa@vegete.mn", certification: "ACE-CPT, Spinning", specialty: "Кардио, Спиннинг", branchId: createdBranches[1].id, salary: "1700000" },
    { firstName: "Тэмүүлэн", lastName: "Жаргалсайхан", phone: "99556677", email: "temuulen@vegete.mn", certification: "NASM-CPT, CSCS", specialty: "Хүч чадал, Бодибилдинг", branchId: createdBranches[2].id, salary: "1800000" },
    { firstName: "Энхжин", lastName: "Мөнхбат", phone: "99667788", email: "enkhjin@vegete.mn", certification: "ACE-CPT, Pilates", specialty: "Пилатес, Уян хатан", branchId: createdBranches[2].id, salary: "1600000" },
  ];

  const createdTrainers = await db.insert(trainers).values(trainerData).returning();

  const memberData = [
    { firstName: "Мөнхбат", lastName: "Дэлгэрмаа", phone: "88001122", email: "munkh@mail.mn", membershipType: "premium" as const, branchId: createdBranches[0].id, trainerId: createdTrainers[0].id, monthlyFee: "250000" },
    { firstName: "Цэцэгмаа", lastName: "Батцэцэг", phone: "88112233", membershipType: "basic" as const, branchId: createdBranches[0].id, trainerId: createdTrainers[1].id, monthlyFee: "150000" },
    { firstName: "Баатар", lastName: "Энхбаяр", phone: "88223344", membershipType: "athlete" as const, branchId: createdBranches[0].id, trainerId: createdTrainers[0].id, monthlyFee: "400000" },
    { firstName: "Дэлгэр", lastName: "Алтансүх", phone: "88334455", email: "delger@mail.mn", membershipType: "premium" as const, branchId: createdBranches[0].id, monthlyFee: "250000" },
    { firstName: "Сүхбат", lastName: "Ганзориг", phone: "88445566", membershipType: "basic" as const, branchId: createdBranches[0].id, monthlyFee: "150000" },
    { firstName: "Нарантуяа", lastName: "Мягмар", phone: "88556677", membershipType: "premium" as const, branchId: createdBranches[1].id, trainerId: createdTrainers[2].id, monthlyFee: "250000" },
    { firstName: "Болдбаатар", lastName: "Эрдэнэбат", phone: "88667788", membershipType: "basic" as const, branchId: createdBranches[1].id, trainerId: createdTrainers[3].id, monthlyFee: "150000" },
    { firstName: "Анужин", lastName: "Батжаргал", phone: "88778899", email: "anujin@mail.mn", membershipType: "athlete" as const, branchId: createdBranches[1].id, trainerId: createdTrainers[2].id, monthlyFee: "400000" },
    { firstName: "Ганцэцэг", lastName: "Дашдорж", phone: "88889900", membershipType: "basic" as const, branchId: createdBranches[1].id, monthlyFee: "150000" },
    { firstName: "Хүслэн", lastName: "Бямбадорж", phone: "88990011", membershipType: "premium" as const, branchId: createdBranches[1].id, monthlyFee: "250000" },
    { firstName: "Номин", lastName: "Мөнхсайхан", phone: "88001133", email: "nomin@mail.mn", membershipType: "basic" as const, branchId: createdBranches[2].id, trainerId: createdTrainers[4].id, monthlyFee: "150000" },
    { firstName: "Тэмүүжин", lastName: "Батсүх", phone: "88112244", membershipType: "athlete" as const, branchId: createdBranches[2].id, trainerId: createdTrainers[4].id, monthlyFee: "400000" },
    { firstName: "Сайнбилэг", lastName: "Алтангэрэл", phone: "88223355", membershipType: "premium" as const, branchId: createdBranches[2].id, trainerId: createdTrainers[5].id, monthlyFee: "250000" },
    { firstName: "Одгэрэл", lastName: "Чулуунбаатар", phone: "88334466", membershipType: "basic" as const, branchId: createdBranches[2].id, monthlyFee: "150000" },
    { firstName: "Мандах", lastName: "Гантулга", phone: "88445577", membershipType: "basic" as const, branchId: createdBranches[2].id, monthlyFee: "150000", membershipStatus: "suspended" as const },
    { firstName: "Цэрэндулам", lastName: "Наранбат", phone: "88556688", membershipType: "premium" as const, branchId: createdBranches[0].id, monthlyFee: "250000", membershipStatus: "expired" as const },
    { firstName: "Баярсайхан", lastName: "Цэнд-Аюуш", phone: "88667799", membershipType: "basic" as const, branchId: createdBranches[1].id, monthlyFee: "150000", membershipStatus: "suspended" as const },
    { firstName: "Алтанцэцэг", lastName: "Батбаяр", phone: "88778800", membershipType: "athlete" as const, branchId: createdBranches[0].id, monthlyFee: "400000" },
  ];

  const createdMembers = await db.insert(members).values(memberData).returning();

  const paymentData: any[] = [];
  for (let month = 1; month <= 2; month++) {
    for (const m of createdMembers) {
      if (m.membershipStatus === "active") {
        paymentData.push({
          memberId: m.id,
          amount: m.monthlyFee,
          month: month.toString(),
          year: 2026,
          branchId: m.branchId,
          status: "paid",
        });
      }
    }
  }

  if (paymentData.length > 0) {
    await db.insert(payments).values(paymentData);
  }

  const attendanceData = [];
  for (const m of createdMembers.slice(0, 10)) {
    for (let d = 1; d <= 5; d++) {
      attendanceData.push({
        memberId: m.id,
        branchId: m.branchId,
      });
    }
  }

  if (attendanceData.length > 0) {
    await db.insert(attendance).values(attendanceData);
  }

  console.log("Database seeded successfully!");
  console.log(`Created: ${createdBranches.length} branches, ${createdTrainers.length} trainers, ${createdMembers.length} members, ${paymentData.length} payments`);
}
