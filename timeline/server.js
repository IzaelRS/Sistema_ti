const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'timeline.db');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body));
    }
    next();
});

// User Database Setup
function createUsersTable() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nome TEXT,
        perfil TEXT,
        email TEXT,
        senha TEXT
    )`, (err) => {
        if (!err) {
            // Migrations for existing users table
            db.run(`ALTER TABLE users ADD COLUMN email TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column name')) console.error(err);
            });
            db.run(`ALTER TABLE users ADD COLUMN senha TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column name')) console.error(err);
            });

            // Seed/Update default admin
            db.get("SELECT * FROM users WHERE id = '1'", (err, row) => {
                if (!err) {
                    if (!row) {
                        db.run("INSERT INTO users (id, nome, perfil, email, senha) VALUES (?, ?, ?, ?, ?)",
                            ["1", "Administrador", "administrativo", "admin@admin.com", "admin123"]);
                    } else if (!row.email || !row.senha || row.senha === '12345') {
                        // Reset/Fix credentials if they are missing or set to the accidental '12345'
                        db.run("UPDATE users SET email = ?, senha = ? WHERE id = '1'", ["admin@admin.com", "admin123"]);
                    }
                }
            });
        }
    });
}

// Database Setup
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        createTable();
        createUsersTable();
    }
});

function createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        nome TEXT,
        topico TEXT,
        sub_topico TEXT,
        em_ocorrencia INTEGER,
        inicio TEXT,
        fim TEXT,
        descricao TEXT,
        anotacao TEXT
    )`);

    // Migration: Add columns if they don't exist
    const columns = [
        { name: 'sub_topico', type: 'TEXT' },
        { name: 'em_ocorrencia', type: 'INTEGER' },
        { name: 'cor', type: 'TEXT' }
    ];

    columns.forEach(col => {
        db.run(`ALTER TABLE events ADD COLUMN ${col.name} ${col.type}`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                console.error(`Error adding column ${col.name}:`, err.message);
            }
        });
    });
}

// API Endpoints

// GET all events
app.get('/api/events', (req, res) => {
    db.all("SELECT * FROM events", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST (Create or Update) event
app.post('/api/events', (req, res) => {
    const { id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor } = req.body;

    const sql = `INSERT OR REPLACE INTO events (id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Event saved', id: id });
    });
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM events WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Event deleted', changes: this.changes });
    });
});

// GET all users
app.get('/api/users', (req, res) => {
    db.all("SELECT id, nome, perfil, email FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.get("SELECT id, nome, perfil, email FROM users WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ success: false, message: 'E-mail ou senha incorretos' });
        }
    });
});

// POST Monitor Login (No password, read-only standard access)
app.post('/api/login/monitor', (req, res) => {
    // Return a virtual user for monitoring
    const monitorUser = {
        id: 'monitor-session',
        nome: 'Monitoramento',
        perfil: 'padrao', // Standard role (view-only/attention)
        email: 'monitoramento@sistema.local'
    };
    res.json({ success: true, user: monitorUser });
});

// POST Create/Update user
app.post('/api/users', (req, res) => {
    const { id, nome, perfil, email, senha } = req.body;

    // Check for uniqueness
    db.get("SELECT id FROM users WHERE (nome = ? OR email = ?) AND id != ?", [nome, email, id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.status(400).json({ error: "Já existe um usuário com este nome ou e-mail." });
            return;
        }

        const sql = `INSERT OR REPLACE INTO users (id, nome, perfil, email, senha) VALUES (?, ?, ?, ?, ?)`;
        const params = [id, nome, perfil, email, senha];

        db.run(sql, params, function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'User saved', id: id });
        });
    });
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'User deleted', changes: this.changes });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
