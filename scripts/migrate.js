const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('sqlite.db');

// Read and execute migration
const migrationFile = path.join(__dirname, '..', 'drizzle', '0000_clean_johnny_blaze.sql');
const migration = fs.readFileSync(migrationFile, 'utf8');

// Split by semicolon and execute each statement
const statements = migration.split(';').filter(stmt => stmt.trim());

statements.forEach((stmt) => {
  if (stmt.trim()) {
    try {
      db.exec(stmt);
      console.log('Executed:', stmt.substring(0, 50) + '...');
    } catch (error) {
      console.error('Error executing statement:', stmt);
      console.error(error);
    }
  }
});

console.log('Migration completed successfully!');
db.close();