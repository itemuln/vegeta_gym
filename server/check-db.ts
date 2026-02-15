import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkTables() {
  const client = await pool.connect();
  try {
    console.log("Checking database tables and data...\n");
    
    // Check courses
    const coursesResult = await client.query('SELECT COUNT(*) as count FROM courses;');
    console.log(`Courses: ${coursesResult.rows[0].count} records`);
    
    const coursesData = await client.query('SELECT id, title, is_active FROM courses LIMIT 3;');
    console.log("Sample courses:", coursesData.rows);
    
    // Check branches
    const branchesResult = await client.query('SELECT COUNT(*) as count FROM branches;');
    console.log(`\nBranches: ${branchesResult.rows[0].count} records`);
    
    // Check trainers
    const trainersResult = await client.query('SELECT COUNT(*) as count FROM trainers;');
    console.log(`Trainers: ${trainersResult.rows[0].count} records`);
    
    // Check members
    const membersResult = await client.query('SELECT COUNT(*) as count FROM members;');
    console.log(`Members: ${membersResult.rows[0].count} records`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTables();
