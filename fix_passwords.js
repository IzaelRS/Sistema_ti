const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'intranet.db');
const db = new sqlite3.Database(dbPath);

console.log('--- Verificando Usuários ---');
db.all("SELECT id, email, name, password FROM users", [], (err, rows) => {
    if (err) {
        console.error('Erro ao listar usuários:', err.message);
        return;
    }
    rows.forEach(row => {
        console.log(`ID: ${row.id} | Email: ${row.email} | Nome: ${row.name} | Senha: ${row.password || 'VAZIA'}`);

        // Se a senha estiver vazia ou for nula, vamos resetar
        if (!row.password || row.password === '') {
            console.log(`Resetando senha para o usuário: ${row.email}`);
            db.run("UPDATE users SET password = ? WHERE id = ?", ['admin123', row.id]);
        }
    });

    // Garantir que o usuário ti@empresa.com.br tenha a senha admin123
    db.run("UPDATE users SET password = ? WHERE email = ?", ['admin123', 'ti@empresa.com.br'], function (err) {
        if (err) console.error('Erro ao forçar senha:', err.message);
        else console.log('Senha forçada para ti@empresa.com.br com sucesso!');
        db.close();
    });
});
