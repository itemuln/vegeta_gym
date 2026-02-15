import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createCoursesTable() {
  const client = await pool.connect();
  try {
    console.log("Creating courses table...\n");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'Dumbbell',
        difficulty TEXT NOT NULL DEFAULT 'Бүх түвшин',
        duration TEXT NOT NULL DEFAULT '60 мин',
        schedule TEXT NOT NULL DEFAULT '',
        color TEXT NOT NULL DEFAULT 'hsl(0 72% 51%)',
        is_active BOOLEAN NOT NULL DEFAULT true,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("✓ Created courses table");
    
    // Check if courses table is empty
    const count = await client.query('SELECT COUNT(*) FROM courses;');
    console.log(`Current courses count: ${count.rows[0].count}`);
    
    if (parseInt(count.rows[0].count) === 0) {
      console.log("\n✓ Inserting course data...");
      
      await client.query(`
        INSERT INTO courses (title, description, icon, difficulty, duration, schedule, color, sort_order) VALUES
        ('CrossFit', 'Өндөр эрчимтэй интервал дасгалуудыг хослуулсан функциональ фитнесс хөтөлбөр. Жин өргөлт, гимнастик, кардио зэрэг олон төрлийн дасгалуудыг хамарна. Бие бялдрын бүх чанарыг хөгжүүлнэ.', 'Zap', 'Дунд - Ахисан', '60 мин', 'Даваа, Лхагва, Баасан', 'hsl(0 72% 51%)', 1),
        ('Хүч чадлын бэлтгэл', 'Чөлөөт жин, тоног төхөөрөмж ашиглан булчингийн хүч, тэсвэр, хэмжээг нэмэгдүүлэх зорилготой хөтөлбөр. Хувийн зорилгод тохирсон дасгалын төлөвлөгөөг бий болгоно.', 'Dumbbell', 'Бүх түвшин', '75 мин', 'Мягмар, Пүрэв, Бямба', 'hsl(25 90% 48%)', 2),
        ('Бокс & Кикбоксинг', 'Мэргэжлийн боксын дасгалжуулагчтай хамтран тулааны урлагийн техник, хүч чадал, хурд, рефлексийг хөгжүүлэх хичээлүүд. Стрессийг тайлах хамгийн үр дүнтэй арга.', 'Target', 'Дунд', '60 мин', 'Даваа, Лхагва, Баасан', 'hsl(0 72% 51%)', 3),
        ('Функциональ дасгал', 'Өдөр тутмын хөдөлгөөнийг сайжруулах зорилготой, бие бүрэн хөдөлгөөнт дасгалуудын хөтөлбөр. Тэнцвэр, уян хатан, координаци болон хүч чадлыг зэрэг хөгжүүлнэ.', 'Flame', 'Бүх түвшин', '50 мин', 'Даваа - Баасан', 'hsl(25 90% 48%)', 4),
        ('Йог & Пилатес', 'Бие сэтгэлийн тэнцвэрийг олоход туслах, уян хатан чанарыг хөгжүүлэх, стрессийг бууруулах зорилготой хичээлүүд. Виньяса, хатха, инь йогийн хэв маягууд.', 'Heart', 'Анхан шат', '60 мин', 'Мягмар, Пүрэв, Бямба', 'hsl(142 60% 40%)', 5),
        ('Спиннинг / Кардио', 'Дугуйн дасгал дээр суурилсан өндөр эрчимтэй кардио хичээл. Зүрхний булчин, тэсвэр хатуужлыг хөгжүүлж, өөхийг шатаах хамгийн хурдан арга.', 'Bike', 'Бүх түвшин', '45 мин', 'Даваа - Баасан', 'hsl(217 70% 50%)', 6),
        ('HIIT', 'Өндөр эрчимтэй интервал бэлтгэл. Богино хугацаанд хамгийн их калори шатааж, бодисын солилцоог идэвхжүүлэх зорилготой дасгалуудын цуврал.', 'Wind', 'Ахисан', '30 мин', 'Лхагва, Баасан', 'hsl(0 72% 51%)', 7),
        ('Табата', '20 секунд дасгал, 10 секунд амрах зарчмаар явагддаг 4 минутын тойргуудаас бүрдсэн өндөр эрчимтэй бэлтгэлийн хөтөлбөр.', 'Timer', 'Дунд - Ахисан', '40 мин', 'Мягмар, Пүрэв', 'hsl(280 55% 50%)', 8);
      `);
      
      console.log("✓ Inserted 8 courses");
    }
    
    console.log("\n✅ All done!");
    
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createCoursesTable();
