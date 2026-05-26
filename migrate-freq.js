const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'intranet.db');
const db = new sqlite3.Database(dbPath);

console.log('Migrating database frequency values...');

db.serialize(() => {
    db.run("UPDATE accounts SET frequency = '1 dia' WHERE frequency = 'Dia'");
    db.run("UPDATE accounts SET frequency = '7 dias' WHERE frequency = 'Semana'");
    db.run("UPDATE accounts SET frequency = '15 dias' WHERE frequency = '15 Dias'");
    db.run("UPDATE accounts SET frequency = '1 mes' WHERE frequency = 'Mensal'");
    db.run("UPDATE accounts SET frequency = '3 meses' WHERE frequency = '3 Meses'");
    db.run("UPDATE accounts SET frequency = '6 meses' WHERE frequency = '6 Meses'");
    db.run("UPDATE accounts SET frequency = '1 ano' WHERE frequency = 'Ano'", function () {
        console.log('Frequencies migrated.');
        db.close();
    });
});
