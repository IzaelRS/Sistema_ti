const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'intranet.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
        console.error("Error or no users table:", err.message);
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err2, tables) => {
            console.log("Tables:", tables);
            db.close();
        });
        return;
    }
    console.log("Users in SQLite:", JSON.stringify(rows, null, 2));
    db.close();
});
