const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// 1. Database file eka hadanna (meke thamai data thiyenne)
const db = new Database('movie-db.sqlite'); 

// 2. Drizzle folder eke thiyena okkoma .sql files tika order eken ganna
const drizzleDir = path.join(__dirname, 'drizzle');
const files = fs.readdirSync(drizzleDir).filter(file => file.endsWith('.sql')).sort();

if (files.length === 0) {
  console.log("❌ No SQL files found in drizzle folder.");
} else {
  files.forEach(file => {
    console.log(`⏳ Executing ${file}...`);
    const sqlFile = path.join(drizzleDir, file);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    db.exec(sql);
  });
  console.log('✅ Local SQLite database created and updated successfully!');
}