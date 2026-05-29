const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('./database');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Carregar variáveis do arquivo .env local, se existir
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const index = trimmed.indexOf('=');
            if (index !== -1) {
                const key = trimmed.substring(0, index).trim();
                let val = trimmed.substring(index + 1).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                process.env[key] = val;
            }
        });
        console.log('✅ Arquivo .env carregado com sucesso.');
    } catch (envErr) {
        console.error('Erro ao ler arquivo .env:', envErr.message);
    }
}

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Servir arquivos estáticos do build (em produção) e manter pasta public
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Somente Imagens (PNG, JPG, WEBP) e PDF são permitidos.'));
        }
    }
});

// --- Rate Limiters ---
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        console.warn(`[RATE LIMIT] Login bloqueado para IP: ${req.ip} - ${req.body?.email || ''}`);
        res.status(429).json(options.message);
    }
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20,
    message: { error: 'Limite de uploads atingido. Tente novamente em 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalApiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 200,
    message: { error: 'Muitas requisições. Aguarde um momento.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Aplica limite geral para todas as rotas API
app.use('/api', generalApiLimiter);

// --- Monitoramento (Health Check) ---
const os = require('os');
app.get('/api/health', (req, res) => {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutos`,
        memory: {
            used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        },
        system: {
            platform: os.platform(),
            freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
            cpuLoad: os.loadavg()[0] ? os.loadavg()[0].toFixed(2) : 'N/A'
        }
    });
});

// --- Logging Middleware ---
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
);

app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));

app.use((req, res, next) => {
    // console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`); // Substituído pelo morgan
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '***';
        console.log('Body:', JSON.stringify(sanitizedBody));
    }
    next();
});

// --- API Endpoints ---

// 0. Timeline Integration API
const timelineRoutes = require('./timeline_routes');
app.use('/api/timeline', timelineRoutes);

// 1. Procedures (FAQs)
app.get('/api/procedures', (req, res) => {
    db.all("SELECT * FROM procedures ORDER BY position ASC, created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/procedures', (req, res) => {
    const { name, responsible, group_name, note, color } = req.body;

    // Provide defaults for removed but required DB fields
    const model = req.body.model || '';
    const observation = req.body.observation || '';
    const content = req.body.content || '';

    if (!name || !responsible || !group_name) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    const query = `
        INSERT INTO procedures (name, responsible, group_name, model, note, observation, content, color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        name,
        responsible || 'N/A',
        group_name || 'Geral',
        '',
        note || '',
        '',
        content || '[]',
        color || '#4F46E5'
    ];

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, ...req.body });
    });
});

app.put('/api/procedures/reorder', (req, res) => {
    const { order } = req.body;

    if (!Array.isArray(order)) {
        return res.status(400).json({ error: 'Formato inválido.' });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare("UPDATE procedures SET position = ? WHERE id = ?");
        try {
            order.forEach((id, index) => {
                stmt.run(index, id);
            });
            stmt.finalize();
            db.run("COMMIT", (err) => {
                if (err) throw err;
                res.json({ success: true });
            });
        } catch (err) {
            db.run("ROLLBACK");
            console.error('Erro ao reordenar:', err);
            res.status(500).json({ error: 'Erro ao reordenar.' });
        }
    });
});

app.put('/api/procedures/:id', (req, res) => {
    const { name, responsible, group_name, note, model, observation, content, color } = req.body;
    const { id } = req.params;

    if (!name) {
        return res.status(400).json({ error: 'O nome do procedimento é obrigatório.' });
    }

    const query = `
        UPDATE procedures
        SET name = ?, responsible = ?, group_name = ?, model = ?, note = ?, observation = ?, content = ?, color = ?
        WHERE id = ?
    `;
    const params = [
        name,
        responsible || 'N/A',
        group_name || 'Geral',
        model || '',
        note || '',
        observation || '',
        content || '[]',
        color || '#4F46E5',
        id
    ];

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Procedimento não encontrado.' });
        res.json({ id, ...req.body });
    });
});

app.delete('/api/procedures/:id', (req, res) => {
    db.run("DELETE FROM procedures WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Procedimento excluído.' });
    });
});


// 2. Documents
app.get('/api/documents', (req, res) => {
    db.all("SELECT * FROM documents ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/upload', uploadLimiter, (req, res) => {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading (e.g. file too large).
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // An unknown error occurred when uploading (e.g. invalid file type).
            return res.status(400).json({ error: err.message });
        }

        // Everything went fine.
        if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado ou formato inválido.' });

        res.json({
            path: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            originalname: req.file.originalname
        });
    });
});

app.post('/api/documents', uploadLimiter, upload.single('document'), (req, res) => {
    console.log('DEBUG: upload documents req.body =', req.body);
    console.log('DEBUG: upload documents req.file =', req.file);
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });

    const { filename, originalname, mimetype, size, path: filePath } = req.file;
    const category = req.body.category || 'Geral';
    const customName = req.body.customName;
    const start_date = req.body.startDate || null;
    const end_date = req.body.endDate || null;
    
    let finalName = originalname;
    if (customName && customName.trim() !== '') {
        const ext = path.extname(originalname);
        const customExt = path.extname(customName);
        if (customExt.toLowerCase() === ext.toLowerCase()) {
            finalName = customName.trim();
        } else {
            finalName = customName.trim() + ext;
        }
    }

    db.run(
        "INSERT INTO documents (filename, original_name, mimetype, size, path, category, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [filename, finalName, mimetype, size, filePath, category, start_date, end_date],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, originalname: finalName, filename, category, start_date, end_date });
        }
    );
});

app.delete('/api/documents/:id', (req, res) => {
    db.get("SELECT path FROM documents WHERE id = ?", req.params.id, (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Arquivo não encontrado.' });

        // Delete file from filesystem
        fs.unlink(row.path, (unlinkErr) => {
            if (unlinkErr) console.error('Erro ao deletar arquivo:', unlinkErr);

            // Delete from DB
            db.run("DELETE FROM documents WHERE id = ?", req.params.id, (dbErr) => {
                if (dbErr) return res.status(500).json({ error: dbErr.message });
                res.json({ message: 'Documento excluído.' });
            });
        });
    });
});

// 3. User / Account (Management and Profile)
// NOTE: SELECT excludes password field for security
app.get('/api/users', (req, res) => {
    db.all("SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', async (req, res) => {
    console.log('POST /api/users - body:', { ...req.body, password: '***' });
    const { name, email, role, password } = req.body;
    if (!name || !email || !role) {
        console.warn('POST /api/users - Missing required fields');
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
        db.run(
            "INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)",
            [name, email, role, hashedPassword],
            function (err) {
                if (err) {
                    console.error('POST /api/users - DB Error:', err.message);
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Este email já está cadastrado.' });
                    }
                    return res.status(500).json({ error: err.message });
                }
                console.log('POST /api/users - Success, ID:', this.lastID);
                res.status(201).json({ id: this.lastID, name, email, role });
            }
        );
    } catch (err) {
        console.error('Erro ao processar senha:', err);
        res.status(500).json({ error: 'Erro interno ao criar usuário.' });
    }
});

app.get('/api/users/:id', (req, res) => {
    db.get("SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(row);
    });
});

app.put('/api/users/:id', async (req, res) => {
    console.log(`PUT /api/users/${req.params.id} - body:`, { ...req.body, password: '***' });
    const { name, email, role, password } = req.body;

    try {
        // If password is provided, hash it; otherwise keep existing
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run(
                "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?",
                [name, email, role, hashedPassword, req.params.id],
                function (err) {
                    if (err) {
                        console.error(`PUT /api/users/${req.params.id} - DB Error:`, err.message);
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return res.status(400).json({ error: 'Este email já está sendo usado por outro usuário.' });
                        }
                        return res.status(500).json({ error: err.message });
                    }
                    console.log(`PUT /api/users/${req.params.id} - Success`);
                    res.json({ success: true, id: req.params.id, name, email, role });
                }
            );
        } else {
            // Update without changing password
            db.run(
                "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
                [name, email, role, req.params.id],
                function (err) {
                    if (err) {
                        console.error(`PUT /api/users/${req.params.id} - DB Error:`, err.message);
                        if (err.message.includes('UNIQUE constraint failed')) {
                            return res.status(400).json({ error: 'Este email já está sendo usado por outro usuário.' });
                        }
                        return res.status(500).json({ error: err.message });
                    }
                    console.log(`PUT /api/users/${req.params.id} - Success`);
                    res.json({ success: true, id: req.params.id, name, email, role });
                }
            );
        }
    } catch (err) {
        console.error('Erro ao processar senha:', err);
        res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
    }
});

// --- User Auth ---
app.post('/api/login', loginLimiter, (req, res) => {
    console.log('Tentativa de login:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) {
            console.error('Erro no login (BD):', err.message);
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        try {
            // Support both bcrypt hashed and legacy plaintext passwords
            let isValid = false;
            if (user.password && user.password.startsWith('$2')) {
                // Bcrypt hash
                isValid = await bcrypt.compare(password, user.password);
            } else {
                // Legacy plaintext comparison (for existing users before migration)
                isValid = (password === user.password);

                // If valid, upgrade to bcrypt hash
                if (isValid) {
                    const hash = await bcrypt.hash(password, 10);
                    db.run("UPDATE users SET password = ? WHERE id = ?", [hash, user.id]);
                    console.log(`Senha do usuário ${user.email} migrada para bcrypt.`);
                }
            }

            if (!isValid) {
                return res.status(401).json({ error: 'Email ou senha incorretos.' });
            }

            console.log('Login bem-sucedido:', user.email);
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (bcryptErr) {
            console.error('Erro na verificação de senha:', bcryptErr);
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    });
});

app.delete('/api/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// For backward compatibility / "My Account" page
app.get('/api/user', (req, res) => {
    db.get("SELECT id, name, email, role, avatar_url, created_at FROM users LIMIT 1", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.put('/api/user', (req, res) => {
    const { name, email, role } = req.body;
    db.run(
        "UPDATE users SET name = ?, email = ?, role = ? WHERE id = (SELECT id FROM users LIMIT 1)",
        [name, email, role],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// --- Accounts ---

app.get('/api/accounts', (req, res) => {
    db.all("SELECT * FROM accounts ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/accounts', (req, res) => {
    const { company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency } = req.body;
    db.run(
        "INSERT INTO accounts (company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [company_name, type, category || 'Outros', value || 0, due_date, description, observation, status, payment_status || 'Pendente', attachment_path || null, frequency || 'Mensal'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.put('/api/accounts/:id', (req, res) => {
    const { company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency } = req.body;
    db.run(
        "UPDATE accounts SET company_name = ?, type = ?, category = ?, value = ?, due_date = ?, description = ?, observation = ?, status = ?, payment_status = ?, attachment_path = ?, frequency = ? WHERE id = ?",
        [company_name, type, category || 'Outros', value || 0, due_date, description, observation, status, payment_status || 'Pendente', attachment_path || null, frequency || 'Mensal', req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, changes: this.changes });
        }
    );
});

app.delete('/api/accounts/:id', (req, res) => {
    db.run("DELETE FROM accounts WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Telefonia (Gnew API Proxy) ---
let gnewToken = null;
const GNEW_API_URL = 'https://gnew.drmonitora.com.br';
const GNEW_USERNAME = process.env.GNEW_USERNAME || 'teste'; // Configure seu usuário aqui ou via env
const GNEW_PASSWORD = process.env.GNEW_PASSWORD || '123';   // Configure sua senha aqui ou via env

function getMockExtensions() {
    const mockList = [];
    const firstNames = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Julia", "Lucas", "Mariana", "Nicolas", "Olivia", "Pedro", "Renata", "Samuel", "Tatiana", "Valter", "Yasmin"];
    const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Rocha", "Dias", "Moreira", "Pinto", "Teixeira", "Mendes"];
    const routes = ["Rota Local", "Rota DDD", "Rota Celular", "Rota Internacional", "Rota VIP"];
    
    for (let i = 100; i <= 250; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i * 3) % lastNames.length];
        mockList.push({
            id: i,
            exten: `${i}`,
            nome: `${firstName} ${lastName}`,
            ddr: `(11) 3709-${String(2000 + i).padStart(4, '0')}`,
            empresa_id: 1,
            observacao: i % 7 === 0 ? "Ramal temporário de testes" : i % 5 === 0 ? "Setor Financeiro" : "Suporte N1",
            extensao_id: i,
            Username: `ramal_${i}`,
            Secret: `Pwd@${i * 17 + 1000}`,
            regra_saida_nome: routes[i % routes.length],
            Ativo: true
        });
    }
    return mockList;
}

async function getGnewToken() {
    if (gnewToken) return gnewToken;
    
    console.log(`[TELEFONIA] Autenticando na API Gnew em ${GNEW_API_URL}/api/v2/token/ com usuário: ${GNEW_USERNAME}`);
    try {
        const response = await fetch(`${GNEW_API_URL}/api/v2/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: GNEW_USERNAME, password: GNEW_PASSWORD })
        });
        
        if (!response.ok) {
            const errBody = await response.text();
            console.error('[TELEFONIA] Erro na autenticação com PABX:', errBody);
            throw new Error(`Falha na autenticação com o PABX Gnew (Status: ${response.status})`);
        }
        
        const data = await response.json();
        gnewToken = data.token;
        console.log('[TELEFONIA] Autenticado com sucesso. Token obtido.');
        return gnewToken;
    } catch (err) {
        console.error('[TELEFONIA] Erro ao autenticar no PABX:', err.message);
        throw err;
    }
}

async function fetchPaginatedGnew(initialUrl) {
    let token = await getGnewToken();
    let allResults = [];
    let nextPageUrl = initialUrl;

    while (nextPageUrl) {
        let response = await fetch(nextPageUrl, {
            headers: { 'Authorization': `Token ${token}` }
        });
        
        if (response.status === 401) {
            console.warn('[TELEFONIA] Token inválido ou expirado. Tentando re-autenticar...');
            gnewToken = null;
            token = await getGnewToken();
            response = await fetch(nextPageUrl, {
                headers: { 'Authorization': `Token ${token}` }
            });
        }

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Status ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const results = data.results || [];
        allResults = allResults.concat(results);
        nextPageUrl = data.next || null;
    }
    return allResults;
}

app.get('/api/telephony/extensions', async (req, res) => {
    if (req.query.mock === 'true') {
        return res.json(getMockExtensions());
    }

    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/sip/?page_size=100`);
        console.log(`[TELEFONIA] Total de ramais consolidados: ${results.length}`);
        res.json(results);
    } catch (err) {
        console.error('[TELEFONIA] Erro na rota de ramais SIP:', err.message);
        res.status(500).json({ error: `Erro no proxy de telefonia: ${err.message}` });
    }
});

app.get('/api/telephony/queues', async (req, res) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/queue/?page_size=100`);
        console.log(`[TELEFONIA] Total de filas consolidadas: ${results.length}`);
        res.json(results);
    } catch (err) {
        console.error('[TELEFONIA] Erro na rota de filas:', err.message);
        res.status(500).json({ error: `Erro no proxy de filas: ${err.message}` });
    }
});

app.get('/api/telephony/blfs', async (req, res) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/blf/?page_size=100`);
        console.log(`[TELEFONIA] Total de BLFs consolidados: ${results.length}`);
        res.json(results);
    } catch (err) {
        console.error('[TELEFONIA] Erro na rota de BLFs:', err.message);
        res.status(500).json({ error: `Erro no proxy de BLFs: ${err.message}` });
    }
});

app.get('/api/telephony/users', async (req, res) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/usuarios/?page_size=100`);
        console.log(`[TELEFONIA] Total de usuários consolidados: ${results.length}`);
        res.json(results);
    } catch (err) {
        console.error('[TELEFONIA] Erro na rota de usuários Gnew:', err.message);
        res.status(500).json({ error: `Erro no proxy de usuários Gnew: ${err.message}` });
    }
});

// --- Monitoramento Proxy ---
app.get('/api/monitoring/notifications', async (req, res) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('http://192.168.3.178/api/monitoring/notifications', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('[MONITORAMENTO] Erro ao buscar da API de monitoramento:', err.message);
        
        // Retornamos dados de contingência/mock estruturados se a API estiver offline
        const mockNotifications = [
            {
                id: 1,
                title: "Instabilidade Link Internet",
                description: "Link da Americanet com alta perda de pacotes no gateway principal.",
                severity: "warning",
                source: "Zabbix",
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                title: "Uso de CPU Elevado - Servidor BD",
                description: "Servidor PostgreSQL (192.168.3.15) atingiu 95% de uso de CPU.",
                severity: "critical",
                source: "Prometheus",
                created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                title: "Backup Concluído com Sucesso",
                description: "Backup diário das bases Neo / ERP finalizado sem erros.",
                severity: "info",
                source: "CronJob",
                created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            }
        ];
        
        res.json({
            status: "offline",
            message: "Usando dados locais de contingência. API externa offline.",
            error: err.message,
            notifications: mockNotifications
        });
    }
});

// 404 Catch-all para rotas da API
app.use('/api', (req, res) => {
    console.warn(`[404 NOT FOUND API] ${req.method} ${req.url}`);
    res.status(404).json({ error: `Rota da API não encontrada: ${req.method} ${req.url}` });
});

// Catch-all para o Frontend (SPA) - Redireciona qualquer rota não mapeada para o seu index.html
app.get(/^(?!\/(api|uploads))/, (req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global error handler for Multer and other errors
app.use((err, req, res, next) => {
    console.error('[ERRO GLOBAL]:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Erro no upload: ' + err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
