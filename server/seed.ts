import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { createHash } from "crypto";
import { users, branches, members, trainers, payments, attendance, courses } from "@shared/schema";
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
    {
      name: "Төв салбар",
      address: "Сүхбаатар дүүрэг, Бага тойруу 15",
      phone: "+976 7711-2233",
      city: "Улаанбаатар",
      country: "Монгол",
      operatingCost: "5000000",
      hours: "Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00",
      features: ["CrossFit зал", "Саун & усан сан", "Хувийн шүүгээ", "Зогсоол"],
    },
    {
      name: "Баянгол салбар",
      address: "Баянгол дүүрэг, Энхтайвны өргөн чөлөө 23",
      phone: "+976 7711-4455",
      city: "Улаанбаатар",
      country: "Монгол",
      operatingCost: "4000000",
      hours: "Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00",
      features: ["Бокс зал", "Кардио зон", "Хувийн шүүгээ", "Кафе"],
    },
    {
      name: "Хан-Уул салбар",
      address: "Хан-Уул дүүрэг, Чингисийн өргөн чөлөө 40",
      phone: "+976 7711-6677",
      city: "Улаанбаатар",
      country: "Монгол",
      operatingCost: "3500000",
      hours: "Даваа - Баасан: 06:00 - 22:00\nБямба - Ням: 08:00 - 20:00",
      features: ["Йог студи", "Функциональ зон", "Хувийн шүүгээ", "Зогсоол"],
    },
  ];

  const createdBranches = await db.insert(branches).values(branchData).returning();

  await db.insert(users).values([
    { username: "manager1", password: hashPassword("pass123"), fullName: "Болд Батбаяр", role: "branch_manager" as const, branchId: createdBranches[0].id },
    { username: "manager2", password: hashPassword("pass123"), fullName: "Сарнай Ганболд", role: "branch_manager" as const, branchId: createdBranches[1].id },
  ]);

  const trainerData = [
    {
      firstName: "Бат-Эрдэнэ", lastName: "Отгонбаяр", phone: "99112233", email: "baterdene@vegete.mn",
      certification: "NASM-CPT, CrossFit L3", specialty: "CrossFit, Хүч чадал",
      bio: "10 гаруй жилийн туршлагатай мэргэжлийн дасгалжуулагч. CrossFit Games тэмцээнд олон удаа оролцсон. Тамирчдыг олон улсын тэмцээнд бэлтгэж байсан туршлагатай.",
      branchId: createdBranches[0].id, salary: "2000000",
    },
    {
      firstName: "Сарантуяа", lastName: "Батбаяр", phone: "99223344", email: "sarantuya@vegete.mn",
      certification: "ACE-CPT, RYT-500", specialty: "Йог, Уян хатан",
      bio: "Энэтхэг, Бали-д сургалтанд хамрагдсан йогийн мэргэшсэн багш. 8 жилийн туршлагатай. Виньяса, хатха, инь йогийн хэв маягуудаар мэргэшсэн.",
      branchId: createdBranches[0].id, salary: "1800000",
    },
    {
      firstName: "Ганбат", lastName: "Дорж", phone: "99334455", email: "ganbat@vegete.mn",
      certification: "NASM-CPT, Boxing A", specialty: "Бокс, Кикбоксинг",
      bio: "Монголын мэргэжлийн боксын тэмцээнд алтан медаль хүртсэн. Залуу тамирчдыг олон улсын тэмцээнд амжилттай бэлтгэж ирсэн 12 жилийн туршлагатай.",
      branchId: createdBranches[1].id, salary: "1900000",
    },
    {
      firstName: "Оюунчимэг", lastName: "Нямдорж", phone: "99445566", email: "oyunaa@vegete.mn",
      certification: "ACE-CPT, Spinning", specialty: "Кардио, Спиннинг",
      bio: "Кардио болон спиннинг хичээлүүдийн мэргэшсэн багш. Жинг хасах, тэсвэр хатуужлыг хөгжүүлэх чиглэлээр онцгой мэргэшсэн. 7 жилийн туршлагатай.",
      branchId: createdBranches[1].id, salary: "1700000",
    },
    {
      firstName: "Тэмүүлэн", lastName: "Жаргалсайхан", phone: "99556677", email: "temuulen@vegete.mn",
      certification: "NASM-CPT, CSCS", specialty: "Хүч чадал, Бодибилдинг",
      bio: "Монголын бодибилдингийн аварга шалгаруулах тэмцээний мөнгөн медальт. Хувийн дасгалын хөтөлбөр зохиох, хоол тэжээлийн зөвлөгөө өгөх чиглэлээр мэргэшсэн.",
      branchId: createdBranches[2].id, salary: "1800000",
    },
    {
      firstName: "Энхжин", lastName: "Мөнхбат", phone: "99667788", email: "enkhjin@vegete.mn",
      certification: "ACE-CPT, Pilates", specialty: "Пилатес, Уян хатан",
      bio: "Пилатес, уян хатан чанарын хичээлүүдэд мэргэшсэн. Гэмтлээс сэргэх, нурууны өвчинтэй хүмүүст зориулсан тусгай хөтөлбөр зохиодог. 6 жилийн туршлагатай.",
      branchId: createdBranches[2].id, salary: "1600000",
    },
  ];

  const createdTrainers = await db.insert(trainers).values(trainerData).returning();

  const courseData = [
    {
      title: "CrossFit",
      description: "Өндөр эрчимтэй интервал дасгалуудыг хослуулсан функциональ фитнесс хөтөлбөр. Жин өргөлт, гимнастик, кардио зэрэг олон төрлийн дасгалуудыг хамарна. Бие бялдрын бүх чанарыг хөгжүүлнэ.",
      icon: "Zap", difficulty: "Дунд - Ахисан", duration: "60 мин",
      schedule: "Даваа, Лхагва, Баасан", color: "hsl(0 72% 51%)", sortOrder: 1,
    },
    {
      title: "Хүч чадлын бэлтгэл",
      description: "Чөлөөт жин, тоног төхөөрөмж ашиглан булчингийн хүч, тэсвэр, хэмжээг нэмэгдүүлэх зорилготой хөтөлбөр. Хувийн зорилгод тохирсон дасгалын төлөвлөгөөг бий болгоно.",
      icon: "Dumbbell", difficulty: "Бүх түвшин", duration: "75 мин",
      schedule: "Мягмар, Пүрэв, Бямба", color: "hsl(25 90% 48%)", sortOrder: 2,
    },
    {
      title: "Бокс & Кикбоксинг",
      description: "Мэргэжлийн боксын дасгалжуулагчтай хамтран тулааны урлагийн техник, хүч чадал, хурд, рефлексийг хөгжүүлэх хичээлүүд. Стрессийг тайлах хамгийн үр дүнтэй арга.",
      icon: "Target", difficulty: "Дунд", duration: "60 мин",
      schedule: "Даваа, Лхагва, Баасан", color: "hsl(0 72% 51%)", sortOrder: 3,
    },
    {
      title: "Функциональ дасгал",
      description: "Өдөр тутмын хөдөлгөөнийг сайжруулах зорилготой, бие бүрэн хөдөлгөөнт дасгалуудын хөтөлбөр. Тэнцвэр, уян хатан, координаци болон хүч чадлыг зэрэг хөгжүүлнэ.",
      icon: "Flame", difficulty: "Бүх түвшин", duration: "50 мин",
      schedule: "Даваа - Баасан", color: "hsl(25 90% 48%)", sortOrder: 4,
    },
    {
      title: "Йог & Пилатес",
      description: "Бие сэтгэлийн тэнцвэрийг олоход туслах, уян хатан чанарыг хөгжүүлэх, стрессийг бууруулах зорилготой хичээлүүд. Виньяса, хатха, инь йогийн хэв маягууд.",
      icon: "Heart", difficulty: "Анхан шат", duration: "60 мин",
      schedule: "Мягмар, Пүрэв, Бямба", color: "hsl(142 60% 40%)", sortOrder: 5,
    },
    {
      title: "Спиннинг / Кардио",
      description: "Дугуйн дасгал дээр суурилсан өндөр эрчимтэй кардио хичээл. Зүрхний булчин, тэсвэр хатуужлыг хөгжүүлж, өөхийг шатаах хамгийн хурдан арга.",
      icon: "Bike", difficulty: "Бүх түвшин", duration: "45 мин",
      schedule: "Даваа - Баасан", color: "hsl(217 70% 50%)", sortOrder: 6,
    },
    {
      title: "HIIT",
      description: "Өндөр эрчимтэй интервал бэлтгэл. Богино хугацаанд хамгийн их калори шатааж, бодисын солилцоог идэвхжүүлэх зорилготой дасгалуудын цуврал.",
      icon: "Wind", difficulty: "Ахисан", duration: "30 мин",
      schedule: "Лхагва, Баасан", color: "hsl(0 72% 51%)", sortOrder: 7,
    },
    {
      title: "Табата",
      description: "20 секунд дасгал, 10 секунд амрах зарчмаар явагддаг 4 минутын тойргуудаас бүрдсэн өндөр эрчимтэй бэлтгэлийн хөтөлбөр.",
      icon: "Timer", difficulty: "Дунд - Ахисан", duration: "40 мин",
      schedule: "Мягмар, Пүрэв", color: "hsl(280 55% 50%)", sortOrder: 8,
    },
  ];

  await db.insert(courses).values(courseData);

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
  console.log(`Created: ${createdBranches.length} branches, ${createdTrainers.length} trainers, ${createdMembers.length} members, ${paymentData.length} payments, ${courseData.length} courses`);
}
