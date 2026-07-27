const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function fixPassword() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'intranet_ti'
    });

    try {
        await client.connect();
        console.log('Conectado ao PostgreSQL.');

        const hash = await bcrypt.hash('12345', 10);
        console.log('Novo hash bcrypt gerado:', hash);

        const res = await client.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email', [hash, 'izael.rodrigues@drmonitora.com.br']);
        console.log('Usuário atualizado com sucesso:', res.rows);

    } catch (err) {
        console.error('Erro ao atualizar senha:', err);
    } finally {
        await client.end();
    }
}

fixPassword();
