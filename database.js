const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'intranet.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Table for text procedures (FAQs)
    db.run(`
        CREATE TABLE IF NOT EXISTS procedures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, -- Kept for compatibility, but moving to 'name'
            name TEXT NOT NULL,
            responsible TEXT NOT NULL,
            group_name TEXT NOT NULL,
            model TEXT NOT NULL,
            note TEXT,
            observation TEXT,
            content TEXT NOT NULL,
            color TEXT DEFAULT '#4F46E5',
            position INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Migration for existing databases
    db.run("ALTER TABLE procedures ADD COLUMN position INTEGER DEFAULT 0", () => {
        // Ignore error if column already exists
    });

    // Table for documents (PDF, PNG)
    db.run(`
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            mimetype TEXT NOT NULL,
            size INTEGER NOT NULL,
            path TEXT NOT NULL,
            category TEXT DEFAULT 'Geral',
            start_date TEXT,
            end_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Migration for existing documents table
    db.run("ALTER TABLE documents ADD COLUMN category TEXT DEFAULT 'Geral'", () => {
        // Ignore error if column already exists
    });
    db.run("ALTER TABLE documents ADD COLUMN start_date TEXT", () => {
        // Ignore error if column already exists
    });
    db.run("ALTER TABLE documents ADD COLUMN end_date TEXT", () => {
        // Ignore error if column already exists
    });

    // Table for accounts
    db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            type TEXT CHECK(type IN ('Recorrente', 'Único')) NOT NULL,
            category TEXT,
            value REAL DEFAULT 0,
            due_date TEXT, -- YYYY-MM-DD
            description TEXT,
            observation TEXT,
            status TEXT CHECK(status IN ('On', 'Off')) DEFAULT 'On',
            payment_status TEXT CHECK(payment_status IN ('Pendente', 'Pago', 'Cancelado')) DEFAULT 'Pendente',
            attachment_path TEXT,
            frequency TEXT DEFAULT 'Mensal',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Migration for new accounts columns
    db.run("ALTER TABLE accounts ADD COLUMN category TEXT", () => { });
    db.run("ALTER TABLE accounts ADD COLUMN value REAL DEFAULT 0", () => { });
    db.run("ALTER TABLE accounts ADD COLUMN payment_status TEXT CHECK(payment_status IN ('Pendente', 'Pago', 'Cancelado')) DEFAULT 'Pendente'", () => { });
    db.run("ALTER TABLE accounts ADD COLUMN attachment_path TEXT", () => { });
    db.run("ALTER TABLE accounts ADD COLUMN frequency TEXT DEFAULT 'Mensal'", () => { });

    // Migration for users table
    db.run("ALTER TABLE users ADD COLUMN password TEXT", () => {
        // Ignore error if column already exists
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        password TEXT,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `, async () => {
        // Insert default user if table is empty
        db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
            if (row && row.count === 0) {
                try {
                    const hash = await bcrypt.hash('admin123', 10);
                    db.run("INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
                        ['Usuário TI', 'ti@empresa.com.br', 'Administrador', hash]);
                    console.log('✅ Usuário padrão criado com senha hasheada.');
                } catch (e) {
                    console.error('Erro ao criar usuário padrão:', e);
                }
            }
        });
    });

    // Table for timeline events
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        nome TEXT,
        topico TEXT,
        sub_topico TEXT,
        em_ocorrencia INTEGER,
        inicio TEXT,
        fim TEXT,
        descricao TEXT,
        anotacao TEXT,
        cor TEXT
    )`);

    // Migration: Add timeline events columns if they don't exist (from previous updates)
    const eventColumns = [
        { name: 'sub_topico', type: 'TEXT' },
        { name: 'em_ocorrencia', type: 'INTEGER' },
        { name: 'cor', type: 'TEXT' }
    ];

    eventColumns.forEach(col => {
        db.run(`ALTER TABLE events ADD COLUMN ${col.name} ${col.type}`, () => {
            // Ignore error if column already exists
        });
    });

    // Table for timeline topics
    db.run(`CREATE TABLE IF NOT EXISTS timeline_topics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        position INTEGER DEFAULT 0
    )`, () => {
        // Migration for existing tables
        db.run("ALTER TABLE timeline_topics ADD COLUMN position INTEGER DEFAULT 0", () => {
            // Ignore error if column already exists
        });

        // Seed default topics if table is empty
        db.get("SELECT COUNT(*) as count FROM timeline_topics", (err, row) => {
            if (row && row.count === 0) {
                const defaultTopics = [
                    { id: 'atendimento', name: 'Atendimento', color: '#3b82f6', position: 0 },
                    { id: 'internet', name: 'Internet', color: '#10b981', position: 1 },
                    { id: 'infraestrutura', name: 'Infraestrutura', color: '#f59e0b', position: 2 },
                    { id: 'sistema', name: 'Sistema', color: '#8b5cf6', position: 3 },
                    { id: 'integracoes', name: 'Integrações', color: '#ec4899', position: 4 }
                ];
                const stmt = db.prepare("INSERT INTO timeline_topics (id, name, color, position) VALUES (?, ?, ?, ?)");
                defaultTopics.forEach(t => stmt.run(t.id, t.name, t.color, t.position));
                stmt.finalize();
                console.log('✅ Tópicos da timeline inicializados.');
            }
        });
    });

    // Table for timeline subtopics
    db.run(`CREATE TABLE IF NOT EXISTS timeline_subtopics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY(topic_id) REFERENCES timeline_topics(id) ON DELETE CASCADE
    )`, () => {
        // Seed default subtopics if table is empty
        db.get("SELECT COUNT(*) as count FROM timeline_subtopics", (err, row) => {
            if (row && row.count === 0) {
                const defaultSubtopics = {
                    'atendimento': ['Gnew', 'Opa', 'Chat Neo', 'Rota 0', 'Rota 08'],
                    'internet': ['Americanet', 'Vivo', 'Imaxima', 'Claro', 'Starlink'],
                    'infraestrutura': ['Eletrica', 'Gerador', 'Nobreak', 'Rede', 'Servidores'],
                    'sistema': ['Neo', 'AWS', 'GCP', 'Apps', 'Comunicadores'],
                    'integracoes': ['Infocar', 'Bradesco', 'Autentique', 'Sinch', 'Pluga']
                };
                const stmt = db.prepare("INSERT INTO timeline_subtopics (topic_id, name) VALUES (?, ?)");
                Object.entries(defaultSubtopics).forEach(([topicId, subs]) => {
                    subs.forEach(sub => stmt.run(topicId, sub));
                });
                stmt.finalize();
                console.log('✅ Sub-tópicos da timeline inicializados.');
            }
        });
    });
});

module.exports = db;
