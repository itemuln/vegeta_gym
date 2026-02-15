import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log("Testing database connection...\n");
    
    // Test basic connection
    const result = await client.query('SELECT NOW() as current_time;');
    console.log("✓ Connection successful!");
    console.log("Current time:", result.rows[0].current_time);
    
    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log("\n✓ Tables in database:");
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    // Try to select from courses
    console.log("\n✓ Testing courses table access...");
    const coursesTest = await client.query('SELECT COUNT(*) FROM courses;');
    console.log(`  Courses count: ${coursesTest.rows[0].count}`);
    
    if (parseInt(coursesTest.rows[0].count) === 0) {
      console.log("\n⚠️  WARNING: Courses table is empty! Need to seed data.");
    }
    
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    console.error("Code:", error.code);
    console.error("Detail:", error.detail);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
