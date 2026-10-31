const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const db = new Database('movie-db.sqlite');

(async () => {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();

    // පරණ එක තියෙනවා නම් අයින් කරන්න
    db.prepare('DELETE FROM admins WHERE email = ?').run(email);
    
    // අලුතින් ඇතුළත් කරන්න
    db.prepare('INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)').run(id, email, hash);

    console.log(`✅ D1 Admin created: ${email} / ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  }
})();