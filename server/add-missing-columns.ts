import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addMissingColumns() {
  const client = await pool.connect();
  try {
    console.log("Adding missing columns...");
    
    // Add bio column to trainers table if it doesn't exist
    await client.query(`
      ALTER TABLE trainers 
      ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
    `);
    console.log("✓ Added bio column to trainers table");
    
    // Add hours column to branches table if it doesn't exist
    await client.query(`
      ALTER TABLE branches 
      ADD COLUMN IF NOT EXISTS hours TEXT DEFAULT 'Даваа - Баасан: 06:00 - 22:00
Бямба - Ням: 08:00 - 20:00';
    `);
    console.log("✓ Added hours column to branches table");
    
    // Add features column to branches table if it doesn't exist
    await client.query(`
      ALTER TABLE branches 
      ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT ARRAY[]::TEXT[];
    `);
    console.log("✓ Added features column to branches table");
    
    console.log("✓ Successfully added all missing columns");
    
  } catch (error) {
    console.error("Error adding columns:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addMissingColumns()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
