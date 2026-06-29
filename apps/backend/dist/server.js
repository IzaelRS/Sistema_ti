"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const typeorm_1 = require("typeorm");
const dns_1 = __importDefault(require("dns"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const querystring_1 = __importDefault(require("querystring"));
const child_process_1 = require("child_process");
const ssh2_1 = require("ssh2");
const database_1 = require("./database");
const User_1 = require("./entities/User");
const Procedure_1 = require("./entities/Procedure");
const Document_1 = require("./entities/Document");
const Account_1 = require("./entities/Account");
const MonitoringEvent_1 = require("./entities/MonitoringEvent");
const ExtensionUsername_1 = require("./entities/ExtensionUsername");
const ExtensionUsernameHistory_1 = require("./entities/ExtensionUsernameHistory");
const timeline_routes_1 = __importDefault(require("./routes/timeline_routes"));
// Carregar variáveis do arquivo .env local, se existir
const envPath = path_1.default.join(__dirname, "../../../.env");
if (fs_1.default.existsSync(envPath)) {
    try {
        const envContent = fs_1.default.readFileSync(envPath, "utf8");
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#"))
                return;
            const index = trimmed.indexOf("=");
            if (index !== -1) {
                const key = trimmed.substring(0, index).trim();
                let val = trimmed.substring(index + 1).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                process.env[key] = val;
            }
        });
        console.log("✅ Arquivo .env carregado com sucesso no Backend.");
    }
    catch (envErr) {
        console.error("Erro ao ler arquivo .env:", envErr.message);
    }
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir arquivos estáticos do build (caso queira rodar stand-alone) e uploads
const distPath = path_1.default.join(__dirname, "../../frontend/dist");
app.use(express_1.default.static(distPath));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../../public")));
// Ensure uploads folder exists relative to monorepo root (shared volume mountpoint /app/uploads)
const uploadsDir = path_1.default.join(__dirname, "../../../uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express_1.default.static(uploadsDir));
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Somente Imagens (PNG, JPG, WEBP) e PDF são permitidos."));
        }
    }
});
// --- Rate Limiters ---
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 1000,
    message: { error: "Muitas tentativas de login. Tente novamente em 15 minutos." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        console.warn(`[RATE LIMIT] Login bloqueado para IP: ${req.ip} - ${req.body?.email || ""}`);
        res.status(429).json(options.message);
    }
});
const uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20,
    message: { error: "Limite de uploads atingido. Tente novamente em 1 hora." },
    standardHeaders: true,
    legacyHeaders: false,
});
const generalApiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minuto
    max: 200,
    message: { error: "Muitas requisições. Aguarde um momento." },
    standardHeaders: true,
    legacyHeaders: false,
});
// Aplica limite geral para todas as rotas API
app.use("/api", generalApiLimiter);
// --- Monitoramento (Health Check) ---
app.get("/api/health", (req, res) => {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutos`,
        memory: {
            used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        },
        system: {
            platform: os_1.default.platform(),
            freeMemory: `${Math.round(os_1.default.freemem() / 1024 / 1024)} MB`,
            cpuLoad: os_1.default.loadavg()[0] ? os_1.default.loadavg()[0].toFixed(2) : "N/A"
        }
    });
});
// --- Logging Middleware ---
const logsDir = path_1.default.join(__dirname, "../../../logs");
if (!fs_1.default.existsSync(logsDir))
    fs_1.default.mkdirSync(logsDir, { recursive: true });
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(logsDir, "access.log"), { flags: "a" });
app.use((0, morgan_1.default)("dev"));
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password)
            sanitizedBody.password = "***";
        console.log("Body:", JSON.stringify(sanitizedBody));
    }
    next();
});
// --- API Endpoints ---
// 0. Timeline Integration API
app.use("/api/timeline", timeline_routes_1.default);
// 1. Procedures (FAQs)
app.get("/api/procedures", async (req, res) => {
    try {
        const procedureRepository = database_1.AppDataSource.getRepository(Procedure_1.Procedure);
        const rows = await procedureRepository.find({
            order: {
                position: "ASC",
                created_at: "DESC"
            }
        });
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/procedures", async (req, res) => {
    try {
        const { name, responsible, group_name, note, color } = req.body;
        const model = req.body.model || "";
        const observation = req.body.observation || "";
        const content = req.body.content || "";
        if (!name || !responsible || !group_name) {
            res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            return;
        }
        const procedureRepository = database_1.AppDataSource.getRepository(Procedure_1.Procedure);
        const newProcedure = procedureRepository.create({
            name,
            responsible: responsible || "N/A",
            group_name: group_name || "Geral",
            model,
            note: note || "",
            observation,
            content: content || "[]",
            color: color || "#4F46E5"
        });
        const result = await procedureRepository.save(newProcedure);
        res.status(201).json({ id: result.id, ...req.body });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/api/procedures/reorder", async (req, res) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) {
            res.status(400).json({ error: "Formato inválido." });
            return;
        }
        await database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
            for (let index = 0; index < order.length; index++) {
                const id = order[index];
                await transactionalEntityManager.update(Procedure_1.Procedure, id, { position: index });
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Erro ao reordenar:", err);
        res.status(500).json({ error: "Erro ao reordenar." });
    }
});
app.put("/api/procedures/:id", async (req, res) => {
    try {
        const { name, responsible, group_name, note, model, observation, content, color } = req.body;
        const id = parseInt(req.params.id);
        if (!name) {
            res.status(400).json({ error: "O nome do procedimento é obrigatório." });
            return;
        }
        const procedureRepository = database_1.AppDataSource.getRepository(Procedure_1.Procedure);
        const procedure = await procedureRepository.findOneBy({ id });
        if (!procedure) {
            res.status(404).json({ error: "Procedimento não encontrado." });
            return;
        }
        procedure.name = name;
        procedure.responsible = responsible || "N/A";
        procedure.group_name = group_name || "Geral";
        procedure.model = model || "";
        procedure.note = note || "";
        procedure.observation = observation || "";
        procedure.content = content || "[]";
        procedure.color = color || "#4F46E5";
        await procedureRepository.save(procedure);
        res.json({ id, ...req.body });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/api/procedures/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const procedureRepository = database_1.AppDataSource.getRepository(Procedure_1.Procedure);
        await procedureRepository.delete(id);
        res.json({ success: true, message: "Procedimento excluído." });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 2. Documents
app.get("/api/documents", async (req, res) => {
    try {
        const documentRepository = database_1.AppDataSource.getRepository(Document_1.Document);
        const rows = await documentRepository.find({
            order: { created_at: "DESC" }
        });
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/upload", uploadLimiter, (req, res) => {
    upload.single("file")(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            res.status(400).json({ error: err.message });
            return;
        }
        else if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: "Nenhum arquivo enviado ou formato inválido." });
            return;
        }
        res.json({
            path: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            originalname: req.file.originalname
        });
    });
});
app.post("/api/documents", uploadLimiter, upload.single("document"), async (req, res) => {
    try {
        console.log("DEBUG: upload documents req.body =", req.body);
        console.log("DEBUG: upload documents req.file =", req.file);
        if (!req.file) {
            res.status(400).json({ error: "Nenhum arquivo enviado." });
            return;
        }
        const { filename, originalname, mimetype, size } = req.file;
        const relativePath = `uploads/${filename}`;
        const category = req.body.category || "Geral";
        const customName = req.body.customName;
        const start_date = req.body.startDate || null;
        const end_date = req.body.endDate || null;
        let finalName = originalname;
        if (customName && customName.trim() !== "") {
            const ext = path_1.default.extname(originalname);
            const customExt = path_1.default.extname(customName);
            if (customExt.toLowerCase() === ext.toLowerCase()) {
                finalName = customName.trim();
            }
            else {
                finalName = customName.trim() + ext;
            }
        }
        const documentRepository = database_1.AppDataSource.getRepository(Document_1.Document);
        const newDoc = documentRepository.create({
            filename,
            original_name: finalName,
            mimetype,
            size,
            path: relativePath,
            category,
            start_date,
            end_date
        });
        const result = await documentRepository.save(newDoc);
        res.status(201).json({ id: result.id, originalname: finalName, filename, category, start_date, end_date });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/api/documents/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const documentRepository = database_1.AppDataSource.getRepository(Document_1.Document);
        const row = await documentRepository.findOneBy({ id });
        if (!row) {
            res.status(404).json({ error: "Arquivo não encontrado." });
            return;
        }
        // Unlink file (path is stored relative to project, e.g. uploads/filename.ext)
        const absolutePath = path_1.default.join(__dirname, "../../../", row.path);
        fs_1.default.unlink(absolutePath, async (unlinkErr) => {
            if (unlinkErr)
                console.error("Erro ao deletar arquivo do disco:", unlinkErr);
            try {
                await documentRepository.delete(id);
                res.json({ message: "Documento excluído." });
            }
            catch (dbErr) {
                res.status(500).json({ error: dbErr.message });
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 3. User / Account (Management and Profile)
app.get("/api/users", async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const rows = await userRepository.find({
            select: ["id", "name", "email", "role", "avatar_url", "created_at"],
            order: { created_at: "DESC" }
        });
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/users", async (req, res) => {
    try {
        console.log("POST /api/users - body:", { ...req.body, password: "***" });
        const { name, email, role, password } = req.body;
        if (!name || !email || !role) {
            console.warn("POST /api/users - Missing required fields");
            res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            return;
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            res.status(400).json({ error: "Este email já está cadastrado." });
            return;
        }
        const hashedPassword = password ? await bcrypt_1.default.hash(password, 10) : "";
        const newUser = userRepository.create({
            name,
            email,
            role,
            password: hashedPassword
        });
        const result = await userRepository.save(newUser);
        console.log("POST /api/users - Success, ID:", result.id);
        res.status(201).json({ id: result.id, name, email, role });
    }
    catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        res.status(500).json({ error: "Erro interno ao criar usuário: " + err.message });
    }
});
app.get("/api/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const row = await userRepository.findOne({
            select: ["id", "name", "email", "role", "avatar_url", "created_at"],
            where: { id }
        });
        if (!row) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }
        res.json(row);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/api/users/:id", async (req, res) => {
    try {
        console.log(`PUT /api/users/${req.params.id} - body:`, { ...req.body, password: "***" });
        const { name, email, role, password } = req.body;
        const id = parseInt(req.params.id);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ id });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }
        // Check unique constraint manually
        const otherUser = await userRepository.findOneBy({ email });
        if (otherUser && otherUser.id !== id) {
            res.status(400).json({ error: "Este email já está sendo usado por outro usuário." });
            return;
        }
        user.name = name;
        user.email = email;
        user.role = role;
        if (password && password.trim() !== "") {
            user.password = await bcrypt_1.default.hash(password, 10);
        }
        await userRepository.save(user);
        console.log(`PUT /api/users/${id} - Success`);
        res.json({ success: true, id, name, email, role });
    }
    catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ error: "Erro interno ao atualizar usuário: " + err.message });
    }
});
// --- User Auth ---
app.post("/api/login", loginLimiter, async (req, res) => {
    console.log("Tentativa de login:", req.body.email);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Email e senha são obrigatórios." });
        return;
    }
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            res.status(401).json({ error: "Email ou senha incorretos." });
            return;
        }
        let isValid = false;
        if (user.password && user.password.startsWith("$2")) {
            // Bcrypt comparison
            isValid = await bcrypt_1.default.compare(password, user.password);
        }
        else {
            // Legacy plaintext comparison
            isValid = (password === user.password);
            // Upgrade plaintext to bcrypt
            if (isValid) {
                user.password = await bcrypt_1.default.hash(password, 10);
                await userRepository.save(user);
                console.log(`Senha do usuário ${user.email} migrada para bcrypt.`);
            }
        }
        if (!isValid) {
            res.status(401).json({ error: "Email ou senha incorretos." });
            return;
        }
        console.log("Login bem-sucedido:", user.email);
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }
    catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: "Erro interno no servidor: " + err.message });
    }
});
app.delete("/api/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        await userRepository.delete(id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// For backward compatibility / "My Account" page
app.get("/api/user", async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            select: ["id", "name", "email", "role", "avatar_url", "created_at"],
            where: {},
            order: { created_at: "ASC" }
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/api/user", async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: {},
            order: { created_at: "ASC" }
        });
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }
        user.name = name;
        user.email = email;
        user.role = role;
        await userRepository.save(user);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- Accounts ---
app.get("/api/accounts", async (req, res) => {
    try {
        const accountRepository = database_1.AppDataSource.getRepository(Account_1.Account);
        const rows = await accountRepository.find({
            order: { created_at: "DESC" }
        });
        // Parse values to number since pg decimal type returns strings to prevent precision losses
        const parsedRows = rows.map(r => ({
            ...r,
            value: typeof r.value === "string" ? parseFloat(r.value) : r.value
        }));
        res.json(parsedRows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/accounts", async (req, res) => {
    try {
        const { company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency } = req.body;
        const accountRepository = database_1.AppDataSource.getRepository(Account_1.Account);
        const newAcc = accountRepository.create({
            company_name,
            type,
            category: category || "Outros",
            value: value || 0,
            due_date,
            description,
            observation,
            status,
            payment_status: payment_status || "Pendente",
            attachment_path: attachment_path || null,
            frequency: frequency || "Mensal"
        });
        const result = await accountRepository.save(newAcc);
        res.json({ id: result.id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/api/accounts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency } = req.body;
        const accountRepository = database_1.AppDataSource.getRepository(Account_1.Account);
        const account = await accountRepository.findOneBy({ id });
        if (!account) {
            res.status(404).json({ error: "Conta não encontrada." });
            return;
        }
        account.company_name = company_name;
        account.type = type;
        account.category = category || "Outros";
        account.value = value || 0;
        account.due_date = due_date;
        account.description = description;
        account.observation = observation;
        account.status = status;
        account.payment_status = payment_status || "Pendente";
        account.attachment_path = attachment_path || null;
        account.frequency = frequency || "Mensal";
        await accountRepository.save(account);
        res.json({ success: true, changes: 1 });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/api/accounts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const accountRepository = database_1.AppDataSource.getRepository(Account_1.Account);
        await accountRepository.delete(id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- Telefonia (Gnew API Proxy) ---
let gnewToken = null;
const GNEW_API_URL = "https://gnew.drmonitora.com.br";
const GNEW_USERNAME = process.env.GNEW_USERNAME || "teste";
const GNEW_PASSWORD = process.env.GNEW_PASSWORD || "123";
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
            ddr: `(11) 3709-${String(2000 + i).padStart(4, "0")}`,
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
    if (gnewToken)
        return gnewToken;
    console.log(`[TELEFONIA] Autenticando na API Gnew em ${GNEW_API_URL}/api/v2/token/ com usuário: ${GNEW_USERNAME}`);
    try {
        const response = await fetch(`${GNEW_API_URL}/api/v2/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: GNEW_USERNAME, password: GNEW_PASSWORD })
        });
        if (!response.ok) {
            const errBody = await response.text();
            console.error("[TELEFONIA] Erro na autenticação com PABX:", errBody);
            throw new Error(`Falha na autenticação com o PABX Gnew (Status: ${response.status})`);
        }
        const data = await response.json();
        gnewToken = data.token;
        console.log("[TELEFONIA] Autenticado com sucesso. Token obtido.");
        return gnewToken;
    }
    catch (err) {
        console.error("[TELEFONIA] Erro ao autenticar no PABX:", err.message);
        throw err;
    }
}
async function fetchPaginatedGnew(initialUrl) {
    let token = await getGnewToken();
    let allResults = [];
    let nextPageUrl = initialUrl;
    while (nextPageUrl) {
        let response = await fetch(nextPageUrl, {
            headers: { "Authorization": `Token ${token}` }
        });
        if (response.status === 401) {
            console.warn("[TELEFONIA] Token inválido ou expirado. Tentando re-autenticar...");
            gnewToken = null;
            token = await getGnewToken();
            response = await fetch(nextPageUrl, {
                headers: { "Authorization": `Token ${token}` }
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
app.get("/api/telephony/extensions", async (req, res) => {
    try {
        const extensionUsernameRepository = database_1.AppDataSource.getRepository(ExtensionUsername_1.ExtensionUsername);
        const localUsernames = await extensionUsernameRepository.find();
        const localUsernameMap = new Map(localUsernames.map(u => [u.exten, u.username]));
        const localDepartmentMap = new Map(localUsernames.map(u => [u.exten, u.department || ""]));
        if (req.query.mock === "true") {
            const mockExts = getMockExtensions();
            const merged = mockExts.map((sip) => ({
                ...sip,
                local_username: localUsernameMap.get(sip.exten) || "",
                local_department: localDepartmentMap.get(sip.exten) || ""
            }));
            res.json(merged);
            return;
        }
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/sip/?page_size=100`);
        console.log(`[TELEFONIA] Total de ramais consolidados: ${results.length}`);
        const merged = results.map((sip) => ({
            ...sip,
            local_username: localUsernameMap.get(sip.exten) || "",
            local_department: localDepartmentMap.get(sip.exten) || ""
        }));
        res.json(merged);
    }
    catch (err) {
        console.error("[TELEFONIA] Erro na rota de ramais SIP:", err.message);
        res.status(500).json({ error: `Erro no proxy de telefonia: ${err.message}` });
    }
});
app.post("/api/telephony/extensions/username", async (req, res) => {
    try {
        const { exten, username, changed_by } = req.body;
        if (!exten) {
            res.status(400).json({ error: "O número do ramal (exten) é obrigatório." });
            return;
        }
        const extensionUsernameRepository = database_1.AppDataSource.getRepository(ExtensionUsername_1.ExtensionUsername);
        const historyRepository = database_1.AppDataSource.getRepository(ExtensionUsernameHistory_1.ExtensionUsernameHistory);
        let record = await extensionUsernameRepository.findOneBy({ exten });
        const oldUsername = record ? record.username : null;
        const newUsername = username || "";
        if (record) {
            record.username = newUsername;
            await extensionUsernameRepository.save(record);
        }
        else {
            record = extensionUsernameRepository.create({
                exten,
                username: newUsername
            });
            await extensionUsernameRepository.save(record);
        }
        // Registrar no histórico caso tenha mudado
        if (oldUsername !== newUsername) {
            const historyRecord = historyRepository.create({
                exten,
                old_username: oldUsername,
                new_username: newUsername,
                changed_by: changed_by || "Sistema"
            });
            await historyRepository.save(historyRecord);
            console.log(`[TELEFONIA] Histórico registrado para o ramal ${exten}: de "${oldUsername || ''}" para "${newUsername}" por "${changed_by || 'Sistema'}"`);
        }
        res.json({ success: true, exten, username: record.username });
    }
    catch (err) {
        console.error("Erro ao salvar nome de usuário local:", err);
        res.status(500).json({ error: "Erro interno ao salvar nome de usuário: " + err.message });
    }
});
app.post("/api/telephony/extensions/department", async (req, res) => {
    try {
        const { exten, department } = req.body;
        if (!exten) {
            res.status(400).json({ error: "O número do ramal (exten) é obrigatório." });
            return;
        }
        const extensionUsernameRepository = database_1.AppDataSource.getRepository(ExtensionUsername_1.ExtensionUsername);
        let record = await extensionUsernameRepository.findOneBy({ exten });
        const newDepartment = department || "";
        if (record) {
            record.department = newDepartment;
            await extensionUsernameRepository.save(record);
        }
        else {
            record = extensionUsernameRepository.create({
                exten,
                username: "",
                department: newDepartment
            });
            await extensionUsernameRepository.save(record);
        }
        res.json({ success: true, exten, department: record.department });
    }
    catch (err) {
        console.error("Erro ao salvar departamento local:", err);
        res.status(500).json({ error: "Erro interno ao salvar departamento: " + err.message });
    }
});
app.get("/api/telephony/extensions/history", async (req, res) => {
    try {
        const { startDate, endDate, exten, username } = req.query;
        const historyRepository = database_1.AppDataSource.getRepository(ExtensionUsernameHistory_1.ExtensionUsernameHistory);
        const query = historyRepository.createQueryBuilder("history");
        if (startDate && startDate !== "") {
            query.andWhere("history.changed_at >= :startDate", { startDate: `${startDate} 00:00:00` });
        }
        if (endDate && endDate !== "") {
            query.andWhere("history.changed_at <= :endDate", { endDate: `${endDate} 23:59:59` });
        }
        if (exten && exten !== "") {
            query.andWhere("history.exten LIKE :exten", { exten: `%${exten}%` });
        }
        if (username && username !== "") {
            query.andWhere("(LOWER(history.old_username) LIKE :username OR LOWER(history.new_username) LIKE :username)", { username: `%${String(username).toLowerCase()}%` });
        }
        query.orderBy("history.changed_at", "DESC");
        const historyList = await query.getMany();
        res.json(historyList);
    }
    catch (err) {
        console.error("Erro ao buscar histórico de ramais:", err);
        res.status(500).json({ error: "Erro interno no servidor: " + err.message });
    }
});
app.get("/api/telephony/queues", async (req, res) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/queue/?page_size=100`);
        console.log(`[TELEFONIA] Total de filas consolidadas: ${results.length}`);
        res.json(results);
    }
    catch (err) {
        console.error("[TELEFONIA] Erro na rota de filas:", err.message);
        res.status(500).json({ error: `Erro no proxy de filas: ${err.message}` });
    }
});
app.get("/api/telephony/blfs", async (req, res) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/blf/?page_size=100`);
        console.log(`[TELEFONIA] Total de BLFs consolidados: ${results.length}`);
        res.json(results);
    }
    catch (err) {
        console.error("[TELEFONIA] Erro na rota de BLFs:", err.message);
        res.status(500).json({ error: `Erro no proxy de BLFs: ${err.message}` });
    }
});
app.get("/api/telephony/users", async (req, res) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/usuarios/?page_size=100`);
        console.log(`[TELEFONIA] Total de usuários consolidados: ${results.length}`);
        res.json(results);
    }
    catch (err) {
        console.error("[TELEFONIA] Erro na rota de usuários Gnew:", err.message);
        res.status(500).json({ error: `Erro no proxy de usuários Gnew: ${err.message}` });
    }
});
// --- Gnew Diagnostico API Proxy ---
async function fetchGnewDiagnostic(endpoint, token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
    try {
        const response = await fetch(`${GNEW_API_URL}/api/v2${endpoint}`, {
            headers: { "Authorization": `Token ${token}` },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
            return await response.json();
        }
        return { error: `HTTP ${response.status}`, success: false };
    }
    catch (e) {
        clearTimeout(timeoutId);
        return { error: e.message, success: false };
    }
}
app.get("/api/monitoring/diagnostico", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        console.log("[MONITORAMENTO] Buscando diagnósticos do PABX Gnew...");
        const token = await getGnewToken();
        const [disco, memoria, ipExterno, sipDriver, fail2ban, firewall, portas, rotas, interfaces, servicos] = await Promise.all([
            fetchGnewDiagnostic("/diagnostico/disco/", token),
            fetchGnewDiagnostic("/diagnostico/memoria/", token),
            fetchGnewDiagnostic("/diagnostico/ip-externo/", token),
            fetchGnewDiagnostic("/diagnostico/sip-driver/", token),
            fetchGnewDiagnostic("/diagnostico/fail2ban/", token),
            fetchGnewDiagnostic("/diagnostico/firewall/", token),
            fetchGnewDiagnostic("/diagnostico/portas/", token),
            fetchGnewDiagnostic("/diagnostico/rotas/", token),
            fetchGnewDiagnostic("/diagnostico/interfaces/", token),
            fetchGnewDiagnostic("/servidores/1/servicos/", token)
        ]);
        if (disco.error && memoria.error && ipExterno.error) {
            throw new Error("Falha generalizada na API Gnew. Detalhes: " + (disco.error || memoria.error));
        }
        const data = {
            disco,
            memoria,
            ipExterno,
            sipDriver,
            fail2ban,
            firewall,
            portas,
            rotas,
            interfaces,
            servicos
        };
        runGnewDiagnosticsCheckFromData(data).catch(err => {
            console.error("[MONITORAMENTO] Erro ao checar thresholds dos dados reais:", err);
        });
        res.json({
            status: "online",
            message: "Diagnósticos obtidos em tempo real do PABX Gnew.",
            data
        });
    }
    catch (err) {
        console.warn("[MONITORAMENTO] Erro ao buscar diagnósticos da API Gnew. Usando fallback:", err.message);
        const randomUsedMem = (3.2 + Math.random() * 0.9).toFixed(1);
        const randomFreeMem = (4.6 - parseFloat(randomUsedMem)).toFixed(1);
        const randomUsedDisk = Math.floor(21 + Math.random() * 4);
        const randomPctDisk = Math.round((randomUsedDisk / 50) * 100);
        const mockDisco = {
            output: `Sistemas de arquivos   Tamanho  Usado  Disp. Uso% Montado em\n/dev/sda1                 50G    ${randomUsedDisk}G   ${50 - randomUsedDisk}G  ${randomPctDisk}% /\ntmpfs                    3.9G     0B  3.9G   0% /dev/shm\n/dev/sdb1                100G    48G   52G  48% /var/spool/asterisk/monitor`,
            success: true
        };
        const mockMemoria = {
            output: `               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       ${randomUsedMem}Gi       ${randomFreeMem}Gi       256Mi       3.1Gi       3.8Gi\nSwap:          2.0Gi       128Mi       1.9Gi`,
            success: true
        };
        const mockIpExterno = {
            ip: "177.105.88.23",
            success: true
        };
        const mockSipDriver = {
            chan_pjsip: true,
            chan_sip: false,
            success: true
        };
        const mockFail2ban = {
            output: "Status for the jail: asterisk\n|- Filter\n|  |- Currently failed:\t2\n|  |- Total failed:\t145\n|  `- File list:\t/var/log/asterisk/security\n`- Actions\n   |- Currently banned:\t4\n   |- Total banned:\t28\n   `- Banned IP list:\t185.220.101.5 195.130.12.88 45.142.195.22 80.94.95.111",
            success: true
        };
        const mockFirewall = {
            output: "Chain INPUT (policy ACCEPT)\ntarget     prot opt source               destination         \nACCEPT     all  --  192.168.0.0/16       anywhere            \nDROP       udp  --  anywhere             anywhere             udp dpt:sip state NEW recent:SET name: SIP side: source\nDROP       udp  --  anywhere             anywhere             udp dpt:sip state NEW recent:CHECK seconds: 10 hitcount: 10 name: SIP side: source\nACCEPT     udp  --  anywhere             anywhere             udp dpt:sip\nACCEPT     udp  --  anywhere             anywhere             udp dpts:10000:20000",
            success: true
        };
        const mockPortas = {
            output: "Active Internet connections (only servers)\nProto Recv-Q Send-Q Local Address           Foreign Address         State      PID/Program name    \ntcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     822/nginx: master   \ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     755/sshd            \ntcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     822/nginx: master   \ntcp        0      0 127.0.0.1:5038          0.0.0.0:*               LISTEN     911/asterisk        \nudp        0      0 0.0.0.0:5060            0.0.0.0:*                          911/asterisk        \nudp        0      0 0.0.0.0:10000           0.0.0.0:*                          911/asterisk        ",
            success: true
        };
        const mockRotas = {
            output: "Tabela de Roteamento IP do Kernel\nDestino         Roteador        MascaraIP       Opçoes Metric Ref Uso Interf\n0.0.0.0         192.168.3.1     0.0.0.0         UG    100    0        0 eth0\n192.168.3.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0",
            success: true
        };
        const mockInterfaces = {
            output: "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000\n    link/ether 52:54:00:fa:19:bc brd ff:ff:ff:ff:ff:ff\n    inet 192.168.3.150/24 brd 192.168.3.255 scope global dynamic eth0\n       valid_lft 85432s preferred_lft 85432s",
            success: true
        };
        const mockServicos = {
            timestamp: new Date().toISOString(),
            servicos: [
                { nome: "asterisk", status: "active", status_label: "ativo", log: "systemd[1]: Started Asterisk PBX." },
                { nome: "online-go", status: "active", status_label: "ativo", log: "go-service[1]: Listening on port 8080." },
                { nome: "gnew_atualizar_status_redis", status: "active", status_label: "ativo", log: "redis-sync[1]: Status synchronized." },
                { nome: "gnew_cdr", status: "active", status_label: "ativo", log: "redis-sync[1]: CDR synchronizer active." },
                { nome: "gnew_cmd_list", status: "active", status_label: "ativo", log: "cmd_list[1]: Command handler running." },
                { nome: "gnew_dialplan_async", status: "active", status_label: "ativo", log: "dialplan[1]: Running dialplan executor." },
                { nome: "gnew_transcricao", status: "active", status_label: "ativo", log: "transcription[1]: Worker idle." },
                { nome: "gnew_ura_reversa", status: "active", status_label: "ativo", log: "ura[1]: Outbound URA waiting." },
                { nome: "gnew_webhook_discador", status: "active", status_label: "ativo", log: "webhook[1]: Dial webhook listening." }
            ]
        };
        const data = {
            disco: mockDisco,
            memoria: mockMemoria,
            ipExterno: mockIpExterno,
            sipDriver: mockSipDriver,
            fail2ban: mockFail2ban,
            firewall: mockFirewall,
            portas: mockPortas,
            rotas: mockRotas,
            interfaces: mockInterfaces,
            servicos: mockServicos
        };
        runGnewDiagnosticsCheckFromData(data).catch(err => {
            console.error("[MONITORAMENTO] Erro ao checar thresholds dos dados mock:", err);
        });
        // Log general API offline warning
        logMonitoringEvent({
            alert_key: "gnew-api-offline",
            title: "API Gnew Offline",
            description: "A API externa do PABX Gnew está offline ou inacessível. Usando contingência local. Erro: " + err.message,
            severity: "warning",
            source: "Gnew Monitor",
            value_pct: null
        }).catch(() => { });
        res.json({
            status: "offline",
            message: "Usando dados locais de contingência. API externa offline.",
            error: err.message,
            data
        });
    }
});
// Helper to log monitoring events to the database (persistent, deduplicated)
async function logMonitoringEvent({ alert_key, title, description, severity, source, value_pct }) {
    try {
        const monitoringEventRepository = database_1.AppDataSource.getRepository(MonitoringEvent_1.MonitoringEvent);
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
        // Find if there is an existing event in the last 2 hours
        const existing = await monitoringEventRepository.findOne({
            where: {
                alert_key,
                created_at: (0, typeorm_1.MoreThan)(twoHoursAgo)
            },
            order: { created_at: "DESC" }
        });
        if (existing) {
            return { id: existing.id, skipped: true };
        }
        const newEvent = monitoringEventRepository.create({
            alert_key,
            title,
            description: description || "",
            severity: severity || "info",
            source: source || "Gnew Monitor",
            value_pct: value_pct || null
        });
        const result = await monitoringEventRepository.save(newEvent);
        return { id: result.id, skipped: false };
    }
    catch (err) {
        console.error("[MONITORING DB] Erro ao registrar evento no banco:", err);
        throw err;
    }
}
// Helpers to parse memory and disk output on the backend
function parseMemoryOutputBackend(output) {
    try {
        const lines = output.split("\n");
        const memLine = lines.find(l => l.trim().startsWith("Mem:"));
        if (memLine) {
            const tokens = memLine.trim().split(/\s+/);
            if (tokens.length >= 3) {
                const totalStr = tokens[1];
                const usedStr = tokens[2];
                const parseVal = (str) => {
                    const val = parseFloat(str);
                    if (str.toLowerCase().includes("g"))
                        return val * 1024;
                    if (str.toLowerCase().includes("m"))
                        return val;
                    if (str.toLowerCase().includes("k"))
                        return val / 1024;
                    return val;
                };
                const totalVal = parseVal(totalStr);
                const usedVal = parseVal(usedStr);
                if (!isNaN(totalVal) && !isNaN(usedVal) && totalVal > 0) {
                    const pct = Math.round((usedVal / totalVal) * 100);
                    return {
                        percentage: pct,
                        detail: `${usedStr} em uso de ${totalStr} total`
                    };
                }
            }
        }
    }
    catch (e) {
        console.warn("Erro ao fazer parse da memória no backend:", e);
    }
    return { percentage: 0, detail: "Erro no parse" };
}
function parseDiskOutputBackend(output) {
    try {
        const lines = output.split("\n");
        const rootLine = lines.find(l => l.trim().endsWith(" /"));
        if (rootLine) {
            const tokens = rootLine.trim().split(/\s+/);
            if (tokens.length >= 5) {
                const sizeStr = tokens[1];
                const usedStr = tokens[2];
                const pctStr = tokens[4].replace("%", "");
                const pct = parseInt(pctStr, 10);
                if (!isNaN(pct)) {
                    return {
                        percentage: pct,
                        detail: `${usedStr} em uso de ${sizeStr} (Montagem em /)`
                    };
                }
            }
        }
    }
    catch (e) {
        console.warn("Erro ao fazer parse do disco no backend:", e);
    }
    return { percentage: 0, detail: "Erro no parse" };
}
// Check thresholds for Gnew diagnostics and save alerts
async function runGnewDiagnosticsCheckFromData(data) {
    if (!data)
        return;
    // Evaluate RAM threshold
    let ramPct = 0;
    if (data.memoria) {
        if (data.memoria.output) {
            ramPct = parseMemoryOutputBackend(data.memoria.output).percentage;
        }
        else if (typeof data.memoria.percent !== "undefined") {
            ramPct = Math.round(data.memoria.percent);
        }
    }
    if (ramPct >= 90) {
        await logMonitoringEvent({
            alert_key: "gnew-alert-ram",
            title: `RAM crítica: ${ramPct}%`,
            description: `Uso de memória RAM atingiu ${ramPct}%, superando o limite de 90%. Verifique os processos em execução no PABX.`,
            severity: "critical",
            source: "Gnew Monitor",
            value_pct: ramPct
        });
    }
    // Evaluate Disk threshold
    let disks = [];
    if (data.disco) {
        if (data.disco.output) {
            try {
                const lines = data.disco.output.trim().split("\n");
                for (let i = 1; i < lines.length; i++) {
                    const t = lines[i].trim().split(/\s+/);
                    if (t.length >= 6) {
                        disks.push({ mountpoint: t[5], percent: parseInt(t[4].replace("%", ""), 10) || 0 });
                    }
                }
            }
            catch (e) { /* ignore */ }
        }
        else if (Array.isArray(data.disco)) {
            disks = data.disco.map((d) => ({ mountpoint: d.mountpoint, percent: Math.round(d.percent || 0) }));
        }
    }
    for (const disk of disks) {
        if (disk.percent >= 80) {
            await logMonitoringEvent({
                alert_key: `gnew-alert-disk-${disk.mountpoint}`,
                title: `Disco (${disk.mountpoint}): ${disk.percent}%`,
                description: `Ponto de montagem "${disk.mountpoint}" está com ${disk.percent}% de uso, superando o limite de 80%.`,
                severity: disk.percent >= 95 ? "critical" : "warning",
                source: "Gnew Monitor",
                value_pct: disk.percent
            });
        }
    }
    // Evaluate Services
    let servicesArr = [];
    if (data.servicos && Array.isArray(data.servicos.servicos)) {
        servicesArr = data.servicos.servicos;
    }
    for (const svc of servicesArr) {
        const isAtivo = svc.status === "active" || svc.status_label === "ativo";
        if (!isAtivo) {
            await logMonitoringEvent({
                alert_key: `gnew-alert-svc-${svc.nome}`,
                title: `Serviço offline: ${svc.nome}`,
                description: `O serviço "${svc.nome}" está com status "${svc.status_label || svc.status}". Verifique o systemd do PABX.`,
                severity: "critical",
                source: "Gnew Monitor",
                value_pct: null
            });
        }
    }
}
// --- Helper tools to check status of external APIs ---
function resolveDnsPublic(hostname) {
    return new Promise((resolve, reject) => {
        const resolver = new dns_1.default.Resolver();
        resolver.setServers(["8.8.8.8"]); // Google Public DNS
        resolver.resolve4(hostname, (err, addresses) => {
            if (err || !addresses || !addresses.length) {
                reject(err || new Error("Nenhum IP retornado por 8.8.8.8"));
            }
            else {
                resolve(addresses[0]);
            }
        });
    });
}
function checkApiStatusViaIp(ip, hostname, pathStr, isHttps, method) {
    return new Promise((resolve, reject) => {
        const lib = isHttps ? https_1.default : http_1.default;
        const options = {
            hostname: ip,
            port: isHttps ? 443 : 80,
            path: pathStr,
            method: method,
            headers: {
                "Host": hostname,
                "User-Agent": "Mozilla/5.0 (Intranet TI Monitor)"
            },
            timeout: 60000
        };
        if (isHttps) {
            options.servername = hostname; // TLS SNI
        }
        const req = lib.request(options, (res) => {
            resolve({
                status: res.statusCode,
                statusText: res.statusMessage || ""
            });
        });
        req.on("timeout", () => {
            req.destroy();
            reject(new Error("Timeout (60s)"));
        });
        req.on("error", (err) => {
            reject(err);
        });
        if (method === "POST") {
            req.write("{}");
        }
        req.end();
    });
}
async function checkApiStatus(url, method = "GET") {
    const start = Date.now();
    if (url.includes("autentique.com.br")) {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname;
            const pathStr = parsedUrl.pathname + parsedUrl.search;
            const isHttps = parsedUrl.protocol === "https:";
            const ip = await resolveDnsPublic(hostname);
            const res = await checkApiStatusViaIp(ip, hostname, pathStr, isHttps, method);
            const latency = Date.now() - start;
            return {
                online: true,
                status: res.status,
                latency,
                message: `HTTP ${res.status} (via DNS Público)`
            };
        }
        catch (e) {
            const latency = Date.now() - start;
            return {
                online: false,
                status: null,
                latency,
                message: e.message === "AbortError" ? "Timeout (60s)" : e.message
            };
        }
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout
    try {
        const response = await fetch(url, {
            method,
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (Intranet TI Monitor)"
            }
        });
        clearTimeout(timeoutId);
        const latency = Date.now() - start;
        return {
            online: true,
            status: response.status,
            latency,
            message: `HTTP ${response.status} ${response.statusText || ""}`.trim()
        };
    }
    catch (e) {
        clearTimeout(timeoutId);
        const isDnsError = e.message.includes("getaddrinfo") || e.message.includes("fetch failed");
        if (isDnsError) {
            try {
                const parsedUrl = new URL(url);
                const hostname = parsedUrl.hostname;
                const pathStr = parsedUrl.pathname + parsedUrl.search;
                const isHttps = parsedUrl.protocol === "https:";
                const ip = await resolveDnsPublic(hostname);
                const res = await checkApiStatusViaIp(ip, hostname, pathStr, isHttps, method);
                const latency = Date.now() - start;
                return {
                    online: true,
                    status: res.status,
                    latency,
                    message: `HTTP ${res.status} (via DNS Público)`
                };
            }
            catch (fallbackErr) {
                // Ignore, proceed to normal error resolution
            }
        }
        const latency = Date.now() - start;
        return {
            online: false,
            status: null,
            latency,
            message: e.name === "AbortError" ? "Timeout (60s)" : e.message
        };
    }
}
async function checkDatabaseStatus() {
    const start = Date.now();
    try {
        await database_1.AppDataSource.query("SELECT 1");
        const latency = Date.now() - start;
        return {
            online: true,
            latency,
            message: "Banco de dados PostgreSQL operando normalmente."
        };
    }
    catch (err) {
        const latency = Date.now() - start;
        return {
            online: false,
            latency,
            message: err.message
        };
    }
}
async function runApisStatusCheckActual() {
    const [gnew, infocar, autentique, sinch, pluga, database, lansweeper] = await Promise.all([
        checkApiStatus("https://gnew.drmonitora.com.br/api/v2/"),
        checkApiStatus("https://api.infocar.com.br"),
        checkApiStatus("https://api.autentique.com.br/v2/graphql", "POST"),
        checkApiStatus("https://sms.api.sinch.com"),
        checkApiStatus("https://api.pluga.co"),
        checkDatabaseStatus(),
        checkLansweeperStatus()
    ]);
    const apis = [
        {
            id: "gnew",
            name: "PABX Gnew API",
            url: "https://gnew.drmonitora.com.br/api/v2/",
            type: "REST API",
            description: "Integração com PABX para ramais, filas, BLFs e diagnósticos.",
            online: gnew.online,
            latency: gnew.latency,
            message: gnew.message,
            status: ""
        },
        {
            id: "infocar",
            name: "Infocar API",
            url: "https://api.infocar.com.br",
            type: "REST API",
            description: "Consulta de dados cadastrais e sinistros de veículos.",
            online: infocar.online,
            latency: infocar.latency,
            message: infocar.message,
            status: ""
        },
        {
            id: "autentique",
            name: "Autentique API",
            url: "https://api.autentique.com.br/v2/graphql",
            type: "GraphQL",
            description: "Assinatura digital e gestão de documentos.",
            online: autentique.online,
            latency: autentique.latency,
            message: autentique.message,
            status: ""
        },
        {
            id: "sinch",
            name: "Sinch API",
            url: "https://sms.api.sinch.com",
            type: "REST API",
            description: "Serviço de envio de SMS e comunicações.",
            online: sinch.online,
            latency: sinch.latency,
            message: sinch.message,
            status: ""
        },
        {
            id: "pluga",
            name: "Pluga API",
            url: "https://api.pluga.co",
            type: "REST API / Webhooks",
            description: "Automação de fluxos de trabalho e webhooks entre ferramentas.",
            online: pluga.online,
            latency: pluga.latency,
            message: pluga.message,
            status: ""
        },
        {
            id: "lansweeper",
            name: "Lansweeper API",
            url: process.env.LANSWEEPER_URL || "Não configurada",
            type: "Local API",
            description: "Plataforma de monitoramento de ativos e switches locais.",
            online: lansweeper.online,
            latency: lansweeper.latency,
            message: lansweeper.message,
            status: ""
        },
        {
            id: "database",
            name: "Banco de Dados Local",
            url: "PostgreSQL Database",
            type: "PostgreSQL",
            description: "Armazenamento interno da intranet, FAQ e histórico.",
            online: database.online,
            latency: database.latency,
            message: database.message,
            status: ""
        }
    ];
    for (const api of apis) {
        if (!api.online) {
            api.status = "offline";
        }
        else if (api.latency >= 2000) {
            api.status = "warning";
        }
        else {
            api.status = "online";
        }
    }
    // Log errors
    for (const api of apis) {
        if (api.status === "offline") {
            logMonitoringEvent({
                alert_key: `api-alert-offline-${api.id}`,
                title: `API Offline: ${api.name}`,
                description: `A API "${api.name}" (${api.url}) está offline ou inacessível. Detalhe: ${api.message || "Sem resposta"}`,
                severity: "critical",
                source: "API Monitor",
                value_pct: null
            }).catch(() => { });
        }
        else if (api.status === "warning") {
            logMonitoringEvent({
                alert_key: `api-alert-latency-${api.id}`,
                title: `Latência Alta: ${api.name}`,
                description: `A API "${api.name}" (${api.url}) está operando com tempo de resposta alto (${api.latency}ms).`,
                severity: "warning",
                source: "API Monitor",
                value_pct: null
            }).catch(() => { });
        }
    }
    return apis;
}
let cachedApisStatus = null;
let isCheckingApis = false;
async function runApisStatusCheck(forceRefresh = false) {
    if (cachedApisStatus && !forceRefresh) {
        if (!isCheckingApis) {
            isCheckingApis = true;
            runApisStatusCheckActual().then(apis => {
                cachedApisStatus = apis;
                isCheckingApis = false;
            }).catch(err => {
                console.error("[BACKGROUND MONITOR] Error checking APIs in background:", err);
                isCheckingApis = false;
            });
        }
        return cachedApisStatus;
    }
    isCheckingApis = true;
    try {
        const apis = await runApisStatusCheckActual();
        cachedApisStatus = apis;
        isCheckingApis = false;
        return apis;
    }
    catch (err) {
        isCheckingApis = false;
        throw err;
    }
}
// GET: Status de todas as APIs
app.get("/api/monitoring/apis-status", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const forceRefresh = req.query.refresh === "true";
        const apis = await runApisStatusCheck(forceRefresh);
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            apis
        });
    }
    catch (err) {
        console.error("Erro ao verificar status das APIs:", err);
        res.status(500).json({ error: "Erro ao verificar status das APIs: " + err.message });
    }
});
// GET: Lista histórico de eventos de monitoramento
app.get("/api/monitoring/events", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 200;
        const monitoringEventRepository = database_1.AppDataSource.getRepository(MonitoringEvent_1.MonitoringEvent);
        const rows = await monitoringEventRepository.find({
            order: { created_at: "DESC" },
            take: limit
        });
        const formattedRows = rows.map(r => ({
            ...r,
            created_at: r.created_at ? r.created_at.toISOString().replace(/\.\d{3}Z$/, "Z") : null
        }));
        res.json(formattedRows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST: Registra um novo evento/alerta no histórico
app.post("/api/monitoring/events", async (req, res) => {
    try {
        const { alert_key, title, description, severity, source, value_pct } = req.body;
        if (!alert_key || !title) {
            res.status(400).json({ error: "alert_key e title são obrigatórios." });
            return;
        }
        const result = await logMonitoringEvent({ alert_key, title, description, severity, source, value_pct });
        if (result.skipped) {
            res.status(200).json({ id: result.id, skipped: true });
        }
        else {
            res.status(201).json({ id: result.id });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE: Limpa todo o histórico de eventos
app.delete("/api/monitoring/events", async (req, res) => {
    try {
        const monitoringEventRepository = database_1.AppDataSource.getRepository(MonitoringEvent_1.MonitoringEvent);
        const result = await monitoringEventRepository.delete({});
        res.json({ success: true, deleted: result.affected || 0 });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- Lansweeper Switch Monitoring ---
const lansweeperAgent = new https_1.default.Agent({
    rejectUnauthorized: false
});
async function checkLansweeperStatus() {
    const start = Date.now();
    const url = process.env.LANSWEEPER_URL;
    if (!url) {
        return {
            online: false,
            latency: 0,
            message: "Configuração LANSWEEPER_URL ausente no arquivo .env"
        };
    }
    return new Promise((resolve) => {
        try {
            const parsedUrl = new URL(url);
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
                path: "/login.aspx",
                method: "GET",
                agent: lansweeperAgent,
                timeout: 5000
            };
            const transport = parsedUrl.protocol === "https:" ? https_1.default : http_1.default;
            const req = transport.request(options, (res) => {
                const latency = Date.now() - start;
                resolve({
                    online: res.statusCode !== undefined && res.statusCode < 500,
                    latency,
                    message: `HTTP ${res.statusCode} ${res.statusMessage || ""}`.trim()
                });
            });
            req.on("error", (err) => {
                const latency = Date.now() - start;
                resolve({
                    online: false,
                    latency,
                    message: err.message
                });
            });
            req.on("timeout", () => {
                req.destroy();
                const latency = Date.now() - start;
                resolve({
                    online: false,
                    latency,
                    message: "Timeout (5s)"
                });
            });
            req.end();
        }
        catch (err) {
            const latency = Date.now() - start;
            resolve({
                online: false,
                latency,
                message: err.message
            });
        }
    });
}
let cachedSwitchesStatus = null;
let isCheckingSwitches = false;
let cachedRoutersStatus = null;
let isCheckingRouters = false;
let cachedNasStatus = null;
let isCheckingNas = false;
const LANSWEEPER_NAS_DEVICETYPE = parseInt(process.env.LANSWEEPER_NAS_DEVICETYPE || "3");
function getLansweeperLoginParams(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: "/login.aspx",
            method: "GET",
            agent: lansweeperAgent
        };
        https_1.default.get(options, (res) => {
            const cookies = res.headers["set-cookie"] || [];
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                const viewstateMatch = data.match(/id="__VIEWSTATE" value="([^"]*)"/);
                const eventvalMatch = data.match(/id="__EVENTVALIDATION" value="([^"]*)"/);
                resolve({
                    cookies: cookies.map(c => c.split(";")[0]).join("; "),
                    viewstate: viewstateMatch ? viewstateMatch[1] : "",
                    eventval: eventvalMatch ? eventvalMatch[1] : ""
                });
            });
        }).on("error", reject);
    });
}
function loginLansweeper(url, username, password, initialCookies, viewstate, eventval) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const postData = querystring_1.default.stringify({
            "__VIEWSTATE": viewstate,
            "__EVENTVALIDATION": eventval,
            "NameTextBox": username,
            "PasswordTextBox": password,
            "LoginButton": "Login"
        });
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: "/login.aspx",
            method: "POST",
            agent: lansweeperAgent,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData),
                "Cookie": initialCookies,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        };
        const req = https_1.default.request(options, (res) => {
            const newCookies = res.headers["set-cookie"] || [];
            resolve([initialCookies, ...newCookies.map(c => c.split(";")[0])].join("; "));
        });
        req.on("error", reject);
        req.write(postData);
        req.end();
    });
}
function fetchLansweeperReport(url, cookies, devicetype = 6) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: `/ReportJson.aspx?det=Web50getdevicebytype&@devicetype=${devicetype}&top=500&page=1&cache=0`,
            method: "POST",
            agent: lansweeperAgent,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Content-Length": 0,
                "Cookie": cookies,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest"
            }
        };
        const req = https_1.default.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Erro HTTP ${res.statusCode} ao carregar JSON`));
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.Error) {
                        reject(new Error(parsed.Emsg || "Erro na resposta do Lansweeper"));
                    }
                    else {
                        resolve(parsed);
                    }
                }
                catch (e) {
                    reject(new Error("Falha no parse do JSON do Lansweeper: " + e.message));
                }
            });
        });
        req.on("error", reject);
        req.write("");
        req.end();
    });
}
function pingDevice(ip) {
    return new Promise((resolve) => {
        const start = Date.now();
        const cmd = os_1.default.platform() === "win32"
            ? `ping -n 1 -w 2000 ${ip}`
            : `ping -c 1 -W 2 ${ip}`;
        (0, child_process_1.exec)(cmd, (err, stdout, stderr) => {
            const elapsed = Date.now() - start;
            if (err) {
                resolve({ online: false, latency: elapsed, message: "Sem resposta (Offline)" });
            }
            else {
                const match = stdout.match(/(?:time|tempo)[=<](\d+(?:\.\d+)?)\s*ms/i);
                const latency = match ? Math.round(parseFloat(match[1])) : elapsed;
                resolve({ online: true, latency, message: "Operando normalmente" });
            }
        });
    });
}
const pingSwitch = pingDevice;
async function fetchRawSwitchesList() {
    const lansweeperUrl = process.env.LANSWEEPER_URL;
    const username = process.env.LANSWEEPER_USER;
    const password = process.env.LANSWEEPER_PASS;
    const switchDevicetype = parseInt(process.env.LANSWEEPER_SWITCH_DEVICETYPE || "6");
    if (!lansweeperUrl || !username || !password) {
        throw new Error("Configurações do Lansweeper ausentes no arquivo .env");
    }
    const loginParams = await getLansweeperLoginParams(lansweeperUrl);
    const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
    const reportData = await fetchLansweeperReport(lansweeperUrl, cookies, switchDevicetype);
    if (!reportData || !Array.isArray(reportData.AddedRows)) {
        throw new Error("Nenhum dado retornado no relatório do Lansweeper");
    }
    return reportData.AddedRows.map((row) => {
        const stripHtml = (htmlStr) => (htmlStr || "").replace(/<[^>]*>/g, "").trim();
        const assetId = row[1];
        const name = stripHtml(row[2]);
        const type = row[3];
        const ip = row[6];
        const model = stripHtml(row[9]);
        const location = row[10] || "N/A";
        return { id: assetId, name, type, ip, model, location };
    }).filter((sw) => sw.ip && sw.ip.trim() !== "");
}
async function runSwitchesStatusCheckActual() {
    const rawSwitches = await fetchRawSwitchesList();
    const pingPromises = rawSwitches.map(async (sw) => {
        const pingResult = await pingSwitch(sw.ip);
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `switch-offline-${sw.id}`,
                title: `Switch Offline: ${sw.name}`,
                description: `O Switch "${sw.name}" (${sw.ip}) localizado em "${sw.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        return {
            id: sw.id,
            name: sw.name,
            ip: sw.ip,
            model: sw.model,
            location: sw.location,
            online: pingResult.online,
            latency: pingResult.latency,
            message: pingResult.message
        };
    });
    return await Promise.all(pingPromises);
}
async function runSwitchesStatusCheck(forceRefresh = false) {
    if (cachedSwitchesStatus && !forceRefresh) {
        if (!isCheckingSwitches) {
            isCheckingSwitches = true;
            runSwitchesStatusCheckActual().then(data => {
                cachedSwitchesStatus = data;
                isCheckingSwitches = false;
            }).catch(err => {
                console.error("[SWITCH MONITOR] Erro na verificação em segundo plano:", err.message);
                isCheckingSwitches = false;
            });
        }
        return cachedSwitchesStatus;
    }
    isCheckingSwitches = true;
    try {
        const data = await runSwitchesStatusCheckActual();
        cachedSwitchesStatus = data;
        isCheckingSwitches = false;
        return data;
    }
    catch (err) {
        isCheckingSwitches = false;
        throw err;
    }
}
// GET: Monitoramento de Switches
app.get("/api/monitoring/switches", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const forceRefresh = req.query.refresh === "true";
        const ping = req.query.ping !== "false";
        if (!ping) {
            let switches = [];
            if (cachedSwitchesStatus && !forceRefresh) {
                switches = cachedSwitchesStatus;
            }
            else {
                const list = await fetchRawSwitchesList();
                switches = list.map((sw) => {
                    const cached = cachedSwitchesStatus ? cachedSwitchesStatus.find((c) => c.id === sw.id) : null;
                    return {
                        id: sw.id,
                        name: sw.name,
                        ip: sw.ip,
                        model: sw.model,
                        location: sw.location,
                        online: cached ? cached.online : null,
                        latency: cached ? cached.latency : null,
                        message: cached ? cached.message : "Aguardando verificação..."
                    };
                });
                cachedSwitchesStatus = switches;
            }
            res.json({
                success: true,
                elapsed_ms: Date.now() - start,
                switches
            });
            return;
        }
        const switches = await runSwitchesStatusCheck(forceRefresh);
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            switches
        });
    }
    catch (err) {
        console.error("Erro ao verificar status dos switches:", err);
        res.status(500).json({ error: "Erro ao verificar status dos switches: " + err.message });
    }
});
// GET: Ping individual switch
app.get("/api/monitoring/switches/:id/ping", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const assetId = req.params.id;
        if (!cachedSwitchesStatus) {
            const list = await fetchRawSwitchesList();
            cachedSwitchesStatus = list.map((sw) => ({
                id: sw.id,
                name: sw.name,
                ip: sw.ip,
                model: sw.model,
                location: sw.location,
                online: null,
                latency: null,
                message: "Aguardando verificação..."
            }));
        }
        const sw = cachedSwitchesStatus.find((c) => c.id === assetId);
        if (!sw) {
            res.status(404).json({ error: "Switch não encontrado" });
            return;
        }
        const pingResult = await pingSwitch(sw.ip);
        sw.online = pingResult.online;
        sw.latency = pingResult.latency;
        sw.message = pingResult.message;
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `switch-offline-${sw.id}`,
                title: `Switch Offline: ${sw.name}`,
                description: `O Switch "${sw.name}" (${sw.ip}) localizado em "${sw.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            switch: sw
        });
    }
    catch (err) {
        console.error("Erro ao pingar switch:", err);
        res.status(500).json({ error: "Erro ao pingar switch: " + err.message });
    }
});
// --- Lansweeper Router Monitoring ---
async function fetchRawRoutersList() {
    const lansweeperUrl = process.env.LANSWEEPER_URL;
    const username = process.env.LANSWEEPER_USER;
    const password = process.env.LANSWEEPER_PASS;
    if (!lansweeperUrl || !username || !password) {
        throw new Error("Configurações do Lansweeper ausentes no arquivo .env");
    }
    const loginParams = await getLansweeperLoginParams(lansweeperUrl);
    const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
    const reportData = await fetchLansweeperReport(lansweeperUrl, cookies, 4); // devicetype=4 is Router
    if (!reportData || !Array.isArray(reportData.AddedRows)) {
        throw new Error("Nenhum dado retornado no relatório do Lansweeper");
    }
    return reportData.AddedRows.map((row) => {
        const stripHtml = (htmlStr) => (htmlStr || "").replace(/<[^>]*>/g, "").trim();
        const assetId = row[1];
        const name = stripHtml(row[2]);
        const type = row[3];
        const ip = row[6];
        const model = stripHtml(row[9]);
        const location = row[10] || "N/A";
        return { id: assetId, name, type, ip, model, location };
    }).filter((rt) => rt.ip && rt.ip.trim() !== "");
}
async function runRoutersStatusCheckActual() {
    const rawRouters = await fetchRawRoutersList();
    const pingPromises = rawRouters.map(async (rt) => {
        const pingResult = await pingDevice(rt.ip);
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `router-offline-${rt.id}`,
                title: `Roteador Offline: ${rt.name}`,
                description: `O Roteador "${rt.name}" (${rt.ip}) localizado em "${rt.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        return {
            id: rt.id,
            name: rt.name,
            ip: rt.ip,
            model: rt.model,
            location: rt.location,
            online: pingResult.online,
            latency: pingResult.latency,
            message: pingResult.message
        };
    });
    return await Promise.all(pingPromises);
}
async function runRoutersStatusCheck(forceRefresh = false) {
    if (cachedRoutersStatus && !forceRefresh) {
        if (!isCheckingRouters) {
            isCheckingRouters = true;
            runRoutersStatusCheckActual().then(data => {
                cachedRoutersStatus = data;
                isCheckingRouters = false;
            }).catch(err => {
                console.error("[ROUTER MONITOR] Erro na verificação em segundo plano:", err.message);
                isCheckingRouters = false;
            });
        }
        return cachedRoutersStatus;
    }
    isCheckingRouters = true;
    try {
        const data = await runRoutersStatusCheckActual();
        cachedRoutersStatus = data;
        isCheckingRouters = false;
        return data;
    }
    catch (err) {
        isCheckingRouters = false;
        throw err;
    }
}
// GET: Monitoramento de Roteadores
app.get("/api/monitoring/routers", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const forceRefresh = req.query.refresh === "true";
        const ping = req.query.ping !== "false";
        if (!ping) {
            let routers = [];
            if (cachedRoutersStatus && !forceRefresh) {
                routers = cachedRoutersStatus;
            }
            else {
                const list = await fetchRawRoutersList();
                routers = list.map((rt) => {
                    const cached = cachedRoutersStatus ? cachedRoutersStatus.find((c) => c.id === rt.id) : null;
                    return {
                        id: rt.id,
                        name: rt.name,
                        ip: rt.ip,
                        model: rt.model,
                        location: rt.location,
                        online: cached ? cached.online : null,
                        latency: cached ? cached.latency : null,
                        message: cached ? cached.message : "Aguardando verificação..."
                    };
                });
                cachedRoutersStatus = routers;
            }
            res.json({
                success: true,
                elapsed_ms: Date.now() - start,
                routers
            });
            return;
        }
        const routers = await runRoutersStatusCheck(forceRefresh);
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            routers
        });
    }
    catch (err) {
        console.error("Erro ao verificar status dos roteadores:", err);
        res.status(500).json({ error: "Erro ao verificar status dos roteadores: " + err.message });
    }
});
// GET: Ping individual router
app.get("/api/monitoring/routers/:id/ping", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const assetId = req.params.id;
        if (!cachedRoutersStatus) {
            const list = await fetchRawRoutersList();
            cachedRoutersStatus = list.map((rt) => ({
                id: rt.id,
                name: rt.name,
                ip: rt.ip,
                model: rt.model,
                location: rt.location,
                online: null,
                latency: null,
                message: "Aguardando verificação..."
            }));
        }
        const rt = cachedRoutersStatus.find((c) => c.id === assetId);
        if (!rt) {
            res.status(404).json({ error: "Roteador não encontrado" });
            return;
        }
        const pingResult = await pingDevice(rt.ip);
        rt.online = pingResult.online;
        rt.latency = pingResult.latency;
        rt.message = pingResult.message;
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `router-offline-${rt.id}`,
                title: `Roteador Offline: ${rt.name}`,
                description: `O Roteador "${rt.name}" (${rt.ip}) localizado em "${rt.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            router: rt
        });
    }
    catch (err) {
        console.error("Erro ao pingar roteador:", err);
        res.status(500).json({ error: "Erro ao pingar roteador: " + err.message });
    }
});
// --- Lansweeper NAS Monitoring ---
async function fetchRawNasList() {
    const lansweeperUrl = process.env.LANSWEEPER_URL;
    const username = process.env.LANSWEEPER_USER;
    const password = process.env.LANSWEEPER_PASS;
    if (!lansweeperUrl || !username || !password) {
        throw new Error("Configurações do Lansweeper ausentes no arquivo .env");
    }
    const loginParams = await getLansweeperLoginParams(lansweeperUrl);
    const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
    const reportData = await fetchLansweeperReport(lansweeperUrl, cookies, LANSWEEPER_NAS_DEVICETYPE);
    if (!reportData || !Array.isArray(reportData.AddedRows)) {
        throw new Error("Nenhum dado retornado no relatório do Lansweeper");
    }
    return reportData.AddedRows.map((row) => {
        const stripHtml = (htmlStr) => (htmlStr || "").replace(/<[^>]*>/g, "").trim();
        const assetId = row[1];
        const name = stripHtml(row[2]);
        const type = row[3];
        const manufacturer = stripHtml(row[5]);
        const ip = row[6];
        const mac = stripHtml(row[7]);
        const model = stripHtml(row[9]);
        const location = row[10] || "N/A";
        return { id: assetId, name, type, manufacturer, ip, mac, model, location };
    }).filter((nas) => nas.ip && nas.ip.trim() !== "");
}
async function runNasStatusCheckActual() {
    const rawNas = await fetchRawNasList();
    const pingPromises = rawNas.map(async (nas) => {
        const pingResult = await pingDevice(nas.ip);
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `nas-offline-${nas.id}`,
                title: `NAS Offline: ${nas.name}`,
                description: `O dispositivo NAS "${nas.name}" (${nas.ip}) localizado em "${nas.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        return {
            id: nas.id,
            name: nas.name,
            ip: nas.ip,
            manufacturer: nas.manufacturer,
            mac: nas.mac,
            model: nas.model,
            location: nas.location,
            online: pingResult.online,
            latency: pingResult.latency,
            message: pingResult.message
        };
    });
    return await Promise.all(pingPromises);
}
async function runNasStatusCheck(forceRefresh = false) {
    if (cachedNasStatus && !forceRefresh) {
        if (!isCheckingNas) {
            isCheckingNas = true;
            runNasStatusCheckActual().then(data => {
                cachedNasStatus = data;
                isCheckingNas = false;
            }).catch(err => {
                console.error("[NAS MONITOR] Erro na verificação em segundo plano:", err.message);
                isCheckingNas = false;
            });
        }
        return cachedNasStatus;
    }
    isCheckingNas = true;
    try {
        const data = await runNasStatusCheckActual();
        cachedNasStatus = data;
        isCheckingNas = false;
        return data;
    }
    catch (err) {
        isCheckingNas = false;
        throw err;
    }
}
// GET: Monitoramento de NAS
app.get("/api/monitoring/nas", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const forceRefresh = req.query.refresh === "true";
        const ping = req.query.ping !== "false";
        if (!ping) {
            let nasDevices = [];
            if (cachedNasStatus && !forceRefresh) {
                nasDevices = cachedNasStatus;
            }
            else {
                const list = await fetchRawNasList();
                nasDevices = list.map((nas) => {
                    const cached = cachedNasStatus ? cachedNasStatus.find((c) => c.id === nas.id) : null;
                    return {
                        id: nas.id,
                        name: nas.name,
                        ip: nas.ip,
                        manufacturer: nas.manufacturer,
                        mac: nas.mac,
                        model: nas.model,
                        location: nas.location,
                        online: cached ? cached.online : null,
                        latency: cached ? cached.latency : null,
                        message: cached ? cached.message : "Aguardando verificação..."
                    };
                });
                cachedNasStatus = nasDevices;
            }
            res.json({
                success: true,
                elapsed_ms: Date.now() - start,
                nas: nasDevices
            });
            return;
        }
        const nasDevices = await runNasStatusCheck(forceRefresh);
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            nas: nasDevices
        });
    }
    catch (err) {
        console.error("Erro ao verificar status dos dispositivos NAS:", err);
        res.status(500).json({ error: "Erro ao verificar status dos dispositivos NAS: " + err.message });
    }
});
// GET: Ping individual NAS
app.get("/api/monitoring/nas/:id/ping", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const assetId = req.params.id;
        if (!cachedNasStatus) {
            const list = await fetchRawNasList();
            cachedNasStatus = list.map((nas) => ({
                id: nas.id,
                name: nas.name,
                ip: nas.ip,
                manufacturer: nas.manufacturer,
                mac: nas.mac,
                model: nas.model,
                location: nas.location,
                online: null,
                latency: null,
                message: "Aguardando verificação..."
            }));
        }
        const nas = cachedNasStatus.find((c) => c.id === assetId);
        if (!nas) {
            res.status(404).json({ error: "Dispositivo NAS não encontrado" });
            return;
        }
        const pingResult = await pingDevice(nas.ip);
        nas.online = pingResult.online;
        nas.latency = pingResult.latency;
        nas.message = pingResult.message;
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `nas-offline-${nas.id}`,
                title: `NAS Offline: ${nas.name}`,
                description: `O dispositivo NAS "${nas.name}" (${nas.ip}) localizado em "${nas.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            nas
        });
    }
    catch (err) {
        console.error("Erro ao pingar NAS:", err);
        res.status(500).json({ error: "Erro ao pingar NAS: " + err.message });
    }
});
// --- WD My Cloud NAS SSH Integration (Read-Only) ---
function fetchNasStorageFromSSH(nasIp) {
    return new Promise((resolve, reject) => {
        const sshHost = nasIp || "cronos.local";
        const configuredUser = process.env.NAS_SSH_USER || "sshd";
        // Mapear automaticamente 'admin' (Dashboard) para 'sshd' (SSH) no WD My Cloud OS 5
        const sshUser = configuredUser === "admin" ? "sshd" : configuredUser;
        const sshPass = process.env.NAS_SSH_PASS || "Master@1945";
        console.log(`[NAS SSH] Conectando a ${sshHost} como ${sshUser}...`);
        const conn = new ssh2_1.Client();
        conn.on("ready", () => {
            console.log(`[NAS SSH] Conectado a ${sshHost} com sucesso.`);
            // Executa os comandos em uma única sessão para otimizar velocidade
            const cmd = `df -B1 /mnt/HD/HD_a2 2>/dev/null
echo "###SEPARATOR###"
cat /proc/mdstat 2>/dev/null
echo "###SEPARATOR###"
mdadm --detail /dev/md1 2>/dev/null
echo "###SEPARATOR###"
for d in sda sdb sdc sdd; do
    echo "=== \$d ==="
    if [ -d /sys/block/\$d ]; then
        echo "Model: \$(cat /sys/block/\$d/device/model 2>/dev/null)"
        echo "Vendor: \$(cat /sys/block/\$d/device/vendor 2>/dev/null)"
        echo "Sectors: \$(cat /sys/block/\$d/size 2>/dev/null)"
        echo "State: \$(cat /sys/block/\$d/device/state 2>/dev/null)"
        temp_val=\$(smartctl -A /dev/\$d 2>/dev/null | grep -E "Temperature_Celsius|Airflow_Temperature_Cel" | awk '{print \$NF}')
        echo "Temp: \${temp_val:-N/A}"
    else
        echo "Not found"
    fi
done
echo "###SEPARATOR###"
cat /etc/samba/smb.conf 2>/dev/null`;
            conn.exec(cmd, (err, stream) => {
                if (err) {
                    conn.end();
                    return reject(err);
                }
                let stdout = "";
                let stderr = "";
                stream.on("data", (data) => stdout += data.toString());
                stream.stderr.on("data", (data) => stderr += data.toString());
                stream.on("close", () => {
                    conn.end();
                    try {
                        const parts = stdout.split("###SEPARATOR###");
                        if (parts.length < 5) {
                            return reject(new Error("Resposta do SSH com formato incorreto."));
                        }
                        const dfOutput = parts[0];
                        const mdstatOutput = parts[1];
                        const mdadmOutput = parts[2];
                        const diskOutput = parts[3];
                        const smbOutput = parts[4];
                        // Parse df
                        const dfLines = dfOutput.trim().split("\n");
                        let totalGb = 35840; // ~35.8 TB fallback
                        let usedGb = 25600;
                        let freeGb = 10240;
                        if (dfLines.length > 1) {
                            const dfParts = dfLines[1].trim().split(/\s+/);
                            if (dfParts.length >= 4) {
                                const totalBytes = parseFloat(dfParts[1]) || 0;
                                const usedBytes = parseFloat(dfParts[2]) || 0;
                                const freeBytes = parseFloat(dfParts[3]) || 0;
                                totalGb = Math.round(totalBytes / 1073741824);
                                usedGb = Math.round(usedBytes / 1073741824);
                                freeGb = Math.round(freeBytes / 1073741824);
                            }
                        }
                        // Parse mdstat
                        let raidLevel = "RAID 5";
                        if (mdstatOutput.includes("raid5"))
                            raidLevel = "RAID 5";
                        else if (mdstatOutput.includes("raid1"))
                            raidLevel = "RAID 1";
                        else if (mdstatOutput.includes("raid0"))
                            raidLevel = "RAID 0";
                        else if (mdstatOutput.includes("raid6"))
                            raidLevel = "RAID 6";
                        let raidStatus = "Excelente";
                        const mdstatActiveMatch = mdstatOutput.match(/\[(\d+)\/(\d+)\]/);
                        if (mdstatActiveMatch) {
                            const expected = parseInt(mdstatActiveMatch[1]);
                            const active = parseInt(mdstatActiveMatch[2]);
                            if (active < expected)
                                raidStatus = "Degradado";
                        }
                        if (mdstatOutput.includes("_"))
                            raidStatus = "Degradado";
                        const volume = {
                            filesystem: "ext4",
                            raid_level: raidLevel,
                            total_gb: totalGb,
                            used_gb: usedGb,
                            free_gb: freeGb,
                            status: raidStatus
                        };
                        // Parse disks
                        const diskSections = diskOutput.split("=== ");
                        const bays = [];
                        let slotIndex = 1;
                        for (const section of diskSections) {
                            if (!section.trim())
                                continue;
                            const lines = section.split("\n");
                            const diskName = lines[0].trim();
                            if (!["sda", "sdb", "sdc", "sdd"].includes(diskName))
                                continue;
                            let model = "Desconhecido";
                            let sectors = 0;
                            let state = "offline";
                            let temp = "N/A";
                            for (const line of lines) {
                                if (line.startsWith("Model: "))
                                    model = line.replace("Model: ", "").trim();
                                if (line.startsWith("Sectors: "))
                                    sectors = parseInt(line.replace("Sectors: ", "").trim()) || 0;
                                if (line.startsWith("State: "))
                                    state = line.replace("State: ", "").trim();
                                if (line.startsWith("Temp: ")) {
                                    const rawTemp = line.replace("Temp: ", "").trim();
                                    temp = rawTemp && rawTemp !== "N/A" ? `${rawTemp}°C` : "N/A";
                                }
                            }
                            if (model === "Not found" || model === "")
                                continue;
                            let capacityStr = "N/A";
                            if (sectors > 0) {
                                const bytes = sectors * 512;
                                const tb = bytes / 1000000000000;
                                if (tb >= 1) {
                                    capacityStr = `${Math.round(tb)} TB`;
                                }
                                else {
                                    capacityStr = `${Math.round(bytes / 1073741824)} GB`;
                                }
                            }
                            bays.push({
                                slot: slotIndex++,
                                disk_model: model,
                                serial: "-",
                                capacity: capacityStr,
                                temp: temp,
                                status: state === "running" ? "Saudável" : "Desconhecido",
                                led: state === "running" ? "green" : "red"
                            });
                        }
                        // Parse shares
                        const smbLines = smbOutput.split("\n");
                        const shares = [];
                        let currentShare = null;
                        for (const line of smbLines) {
                            const trimmed = line.trim();
                            if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(";"))
                                continue;
                            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                                const name = trimmed.slice(1, -1);
                                if (name.toLowerCase() !== "global" && name.toLowerCase() !== "printers") {
                                    if (currentShare) {
                                        shares.push(currentShare);
                                    }
                                    currentShare = {
                                        name: name,
                                        path: `\\\\${sshHost}\\${name}`,
                                        total_gb: null,
                                        used_gb: null,
                                        status: "active",
                                        user_group: "N/A",
                                        description: ""
                                    };
                                }
                                else {
                                    if (currentShare) {
                                        shares.push(currentShare);
                                        currentShare = null;
                                    }
                                }
                            }
                            else if (currentShare) {
                                const eqIdx = trimmed.indexOf("=");
                                if (eqIdx !== -1) {
                                    const key = trimmed.substring(0, eqIdx).trim().toLowerCase();
                                    const val = trimmed.substring(eqIdx + 1).trim();
                                    if (key === "comment") {
                                        currentShare.description = val.replace(/"/g, "");
                                    }
                                }
                            }
                        }
                        if (currentShare) {
                            shares.push(currentShare);
                        }
                        resolve({
                            dataSource: "wd_nas_ssh",
                            volume,
                            bays,
                            shares
                        });
                    }
                    catch (parseErr) {
                        reject(new Error("Falha ao parsear dados do NAS via SSH: " + parseErr.message));
                    }
                });
            });
        }).on("error", (err) => {
            reject(err);
        }).connect({
            host: sshHost,
            port: 22,
            username: sshUser,
            password: sshPass,
            readyTimeout: 30000
        });
    });
}
// GET: NAS Storage e Compartilhamentos (Synology DSM com fallback estimado)
app.get("/api/monitoring/nas/:id/storage", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const assetId = req.params.id;
        if (!cachedNasStatus) {
            const list = await fetchRawNasList();
            cachedNasStatus = list.map((nas) => ({
                id: nas.id,
                name: nas.name,
                ip: nas.ip,
                manufacturer: nas.manufacturer,
                mac: nas.mac,
                model: nas.model,
                location: nas.location,
                online: null,
                latency: null,
                message: "Aguardando verifica\u00e7\u00e3o..."
            }));
        }
        const nas = cachedNasStatus.find((c) => c.id === assetId);
        if (!nas) {
            res.status(404).json({ error: "Dispositivo NAS n\u00e3o encontrado" });
            return;
        }
        // 1. Tentar obter dados reais via SSH diretamente no NAS (prioritário)
        let storageDetails = null;
        let sshErrorMsg = "";
        try {
            const hostIp = nas.ip || "cronos.local";
            storageDetails = await fetchNasStorageFromSSH(hostIp);
        }
        catch (sshErr) {
            console.warn(`[NAS SSH] Falha ao consultar NAS via SSH: ${sshErr.message}`);
            sshErrorMsg = sshErr.message;
        }
        // 2. Fallback: Tentar obter dados reais via Lansweeper
        if (!storageDetails) {
            try {
                const lansweeperUrl = process.env.LANSWEEPER_URL;
                const username = process.env.LANSWEEPER_USER;
                const password = process.env.LANSWEEPER_PASS;
                if (lansweeperUrl && username && password) {
                    const loginParams = await getLansweeperLoginParams(lansweeperUrl);
                    const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
                    // Tentar buscar partições/discos e compartilhamentos do Lansweeper
                    const [diskReport, partitionReport, shareReport] = await Promise.all([
                        fetchLansweeperCustomReport(lansweeperUrl, cookies, "web40repdisks", "").catch(() => ({ AddedRows: [] })),
                        fetchLansweeperCustomReport(lansweeperUrl, cookies, "web40repPartitions", "").catch(() => ({ AddedRows: [] })),
                        fetchLansweeperCustomReport(lansweeperUrl, cookies, "web40repSharedFolder", "").catch(() => ({ AddedRows: [] }))
                    ]);
                    // Filtrar linhas correspondentes a este AssetID
                    const diskRows = (diskReport?.AddedRows || []).filter((row) => String(row[1]) === String(assetId));
                    const partitionRows = (partitionReport?.AddedRows || []).filter((row) => String(row[1]) === String(assetId));
                    const shareRows = (shareReport?.AddedRows || []).filter((row) => String(row[1]) === String(assetId));
                    if (diskRows.length > 0 || partitionRows.length > 0 || shareRows.length > 0) {
                        const volume = {
                            filesystem: partitionRows[0] ? (partitionRows[0][13] || "N/A") : "SNMP",
                            raid_level: "Escaneado via Lansweeper",
                            total_gb: partitionRows.reduce((acc, r) => acc + (parseFloat(r[3]) || 0), 0),
                            used_gb: partitionRows.reduce((acc, r) => acc + (parseFloat(r[4]) || 0), 0),
                            free_gb: partitionRows.reduce((acc, r) => acc + (parseFloat(r[5]) || 0), 0),
                            status: "Excelente"
                        };
                        const bays = diskRows.map((row, idx) => ({
                            slot: idx + 1,
                            disk_model: row[2] || "Disco SNMP",
                            serial: row[3] || "-",
                            capacity: row[4] ? `${Math.round(parseFloat(row[4]) / 1073741824)} GB` : "N/A",
                            temp: "N/A",
                            status: "Saudável",
                            led: "green"
                        }));
                        const shares = shareRows.map((row) => ({
                            name: row[3] || "Compartilhamento",
                            path: row[4] || "-",
                            total_gb: null,
                            used_gb: null,
                            status: "active",
                            user_group: "N/A",
                            description: row[5] || ""
                        }));
                        storageDetails = {
                            dataSource: "lansweeper",
                            volume,
                            bays,
                            shares
                        };
                    }
                }
            }
            catch (e) {
                console.warn("[LANSWEEPER] Erro ao buscar storage do NAS no Lansweeper:", e.message);
            }
        }
        if (!storageDetails) {
            res.status(502).json({
                success: false,
                error: `Não foi possível obter os dados de armazenamento e compartilhamento para o NAS "${nas.name}" (IP: ${nas.ip || 'Sem IP'}).\nMotivo da falha de conexão SSH: ${sshErrorMsg || 'Sem resposta de conexão SSH.'}`
            });
            return;
        }
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            storage: storageDetails
        });
    }
    catch (err) {
        console.error("Erro ao obter detalhes de storage do NAS:", err);
        res.status(500).json({ error: "Erro ao obter detalhes de storage do NAS: " + err.message });
    }
});
// --- Lansweeper Cameras Monitoring ---
function fetchLansweeperCustomReport(url, cookies, reportName, queryParams) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: `/ReportJson.aspx?det=${reportName}&${queryParams}&top=500&page=1&cache=0`,
            method: "POST",
            agent: lansweeperAgent,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Content-Length": 0,
                "Cookie": cookies,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest"
            }
        };
        const req = https_1.default.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Erro HTTP ${res.statusCode} ao carregar JSON`));
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.Error) {
                        reject(new Error(parsed.Emsg || "Erro na resposta do Lansweeper"));
                    }
                    else {
                        resolve(parsed);
                    }
                }
                catch (e) {
                    reject(new Error("Falha no parse do JSON do Lansweeper: " + e.message));
                }
            });
        });
        req.on("error", reject);
        req.write("");
        req.end();
    });
}
async function fetchRawCamerasList() {
    try {
        const lansweeperUrl = process.env.LANSWEEPER_URL;
        const username = process.env.LANSWEEPER_USER;
        const password = process.env.LANSWEEPER_PASS;
        if (!lansweeperUrl || !username || !password) {
            throw new Error("Configurações do Lansweeper ausentes no arquivo .env");
        }
        const loginParams = await getLansweeperLoginParams(lansweeperUrl);
        const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
        const reportData = await fetchLansweeperCustomReport(lansweeperUrl, cookies, "web50get1IPlocation", "@iplocation=DR%20-%20Mibos");
        if (!reportData || !Array.isArray(reportData.AddedRows)) {
            throw new Error("Nenhum dado retornado no relatório do Lansweeper");
        }
        return reportData.AddedRows.map((row) => {
            const stripHtml = (htmlStr) => (htmlStr || "").replace(/<[^>]*>/g, "").trim();
            const assetId = row[1];
            const name = stripHtml(row[2]);
            const location = stripHtml(row[3]) || "DR - Mibos";
            const type = row[6] || "Camera";
            const ip = row[7];
            const mac = row[8] ? stripHtml(row[8]) : "-";
            const manufacturer = row[9] ? stripHtml(row[9]) : "Intelbras";
            let model = stripHtml(row[10]);
            if (!model && name) {
                model = name.replace(/^Camera\s+/i, "");
            }
            if (!model)
                model = "Mibo";
            return { id: assetId, name, type, manufacturer, ip, mac, model, location };
        }).filter((cam) => cam.ip && cam.ip.trim() !== "" && cam.ip.toLowerCase() !== "surveillance camera");
    }
    catch (err) {
        console.warn("[CAMERAS MONITOR] Erro ao buscar do Lansweeper. Usando fallback local:", err.message);
        return [
            { id: "cam1", name: "Câmera Recepção", type: "IP Camera", manufacturer: "Intelbras", ip: "192.168.0.95", mac: "00:1A:3F:F1:4C:11", model: "Mibo iC3", location: "DR - Mibos" },
            { id: "cam2", name: "Câmera Corredor Principal", type: "IP Camera", manufacturer: "Intelbras", ip: "192.168.0.96", mac: "00:1A:3F:F1:4C:12", model: "Mibo iC5", location: "DR - Mibos" },
            { id: "cam3", name: "Câmera CPD / Rack", type: "IP Camera", manufacturer: "Intelbras", ip: "192.168.0.97", mac: "00:1A:3F:F1:4C:13", model: "Mibo iC3", location: "DR - Mibos" },
            { id: "cam4", name: "Câmera Copa", type: "IP Camera", manufacturer: "Intelbras", ip: "192.168.0.98", mac: "00:1A:3F:F1:4C:14", model: "Mibo iC3", location: "DR - Mibos" },
            { id: "cam5", name: "Câmera Estacionamento", type: "IP Camera", manufacturer: "Intelbras", ip: "192.168.0.99", mac: "00:1A:3F:F1:4C:15", model: "Mibo iC5", location: "DR - Mibos" }
        ];
    }
}
async function runCamerasStatusCheckActual() {
    const rawCameras = await fetchRawCamerasList();
    const pingPromises = rawCameras.map(async (cam) => {
        const pingResult = await pingDevice(cam.ip);
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `camera-offline-${cam.id}`,
                title: `Câmera Offline: ${cam.name}`,
                description: `A Câmera "${cam.name}" (${cam.ip}) localizada em "${cam.location}" está inativa ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        return {
            id: cam.id,
            name: cam.name,
            ip: cam.ip,
            manufacturer: cam.manufacturer,
            mac: cam.mac,
            model: cam.model,
            location: cam.location,
            online: pingResult.online,
            latency: pingResult.latency,
            message: pingResult.message
        };
    });
    return await Promise.all(pingPromises);
}
let cachedCamerasStatus = null;
let isCheckingCameras = false;
async function runCamerasStatusCheck(forceRefresh = false) {
    if (cachedCamerasStatus && !forceRefresh) {
        if (!isCheckingCameras) {
            isCheckingCameras = true;
            runCamerasStatusCheckActual().then(data => {
                cachedCamerasStatus = data;
                isCheckingCameras = false;
            }).catch(err => {
                console.error("[CAMERA MONITOR] Erro na verificação em segundo plano:", err.message);
                isCheckingCameras = false;
            });
        }
        return cachedCamerasStatus;
    }
    isCheckingCameras = true;
    try {
        const data = await runCamerasStatusCheckActual();
        cachedCamerasStatus = data;
        isCheckingCameras = false;
        return data;
    }
    catch (err) {
        isCheckingCameras = false;
        throw err;
    }
}
// GET: Monitoramento de Câmeras (Desativado - Em breve)
app.get("/api/monitoring/cameras", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    const start = Date.now();
    res.json({
        success: true,
        elapsed_ms: Date.now() - start,
        cameras: []
    });
});
// GET: Ping individual camera (Desativado - Em breve)
app.get("/api/monitoring/cameras/:id/ping", async (req, res) => {
    res.status(404).json({ error: "Verificação de câmeras desativada" });
});
// --- Lansweeper Servers Monitoring ---
let cachedServersStatus = null;
let isCheckingServers = false;
// --- Zabbix API Integration ---
let zabbixAuthToken = null;
let zabbixTokenExpiry = 0;
let activeZabbixLoginPromise = null;
function getZabbixEndpoint(baseUrl) {
    const cleanUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    if (cleanUrl.endsWith("/api_jsonrpc.php"))
        return cleanUrl;
    const hasSubpath = cleanUrl.includes("/zabbix") || cleanUrl.includes("zabbix.drmonitora.com.br");
    return cleanUrl + (hasSubpath ? "/api_jsonrpc.php" : "/zabbix/api_jsonrpc.php");
}
async function fetchZabbixToken() {
    const now = Date.now();
    if (zabbixAuthToken && now < zabbixTokenExpiry)
        return zabbixAuthToken;
    if (activeZabbixLoginPromise) {
        console.log("[ZABBIX DEBUG] Login já em andamento. Aguardando a mesma Promise...");
        return activeZabbixLoginPromise;
    }
    activeZabbixLoginPromise = (async () => {
        const zabbixUrl = process.env.ZABBIX_URL;
        const user = process.env.ZABBIX_USER;
        const password = process.env.ZABBIX_PASS;
        if (!zabbixUrl || !user || !password) {
            console.warn("[ZABBIX DEBUG] Credenciais incompletas no .env. URL:", zabbixUrl, "User:", user);
            return null;
        }
        try {
            const endpoint = getZabbixEndpoint(zabbixUrl);
            console.log(`[ZABBIX DEBUG] Endpoint resolvido: ${endpoint}`);
            const parsedUrl = new URL(endpoint);
            const lib = parsedUrl.protocol === "https:" ? https_1.default : http_1.default;
            const attemptLogin = async (params) => {
                console.log(`[ZABBIX DEBUG] Tentando login via ${parsedUrl.protocol} em ${parsedUrl.hostname}:${parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80)} com user: ${params.username || params.user}`);
                const payload = JSON.stringify({
                    jsonrpc: "2.0",
                    method: "user.login",
                    params,
                    id: 1
                });
                const options = {
                    hostname: parsedUrl.hostname,
                    port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
                    path: parsedUrl.pathname,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(payload)
                    }
                };
                const start = Date.now();
                return new Promise((resolve, reject) => {
                    const req = lib.request(options, (res) => {
                        console.log(`[ZABBIX DEBUG] HTTP Status recebido: ${res.statusCode} em ${Date.now() - start}ms`);
                        let data = "";
                        res.on("data", chunk => data += chunk);
                        res.on("end", () => {
                            console.log(`[ZABBIX DEBUG] Resposta recebida com sucesso em ${Date.now() - start}ms. Tamanho: ${data.length} bytes`);
                            try {
                                resolve(JSON.parse(data));
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
                    });
                    req.on("error", (err) => {
                        console.error(`[ZABBIX DEBUG] Erro na requisição após ${Date.now() - start}ms:`, err.message);
                        reject(err);
                    });
                    req.setTimeout(8000, () => {
                        console.warn(`[ZABBIX DEBUG] Timeout de 8s atingido após ${Date.now() - start}ms!`);
                        req.destroy();
                        reject(new Error("Zabbix login timeout"));
                    });
                    req.write(payload);
                    req.end();
                });
            };
            // Tenta primeiro com 'username' (Zabbix 6.0+)
            let result = await attemptLogin({ username: user, password });
            if (result.error && (result.error.code === -32602 || result.error.message?.includes("username") || result.error.data?.includes("username") || result.error.data?.includes("user"))) {
                console.log("ℹ️ [ZABBIX] 'username' falhou ou é inesperado. Tentando com 'user' (Zabbix antigo)...");
                // Tenta com 'user' (Zabbix < 6.0)
                result = await attemptLogin({ user, password });
            }
            if (result.result) {
                zabbixAuthToken = result.result;
                zabbixTokenExpiry = Date.now() + 25 * 60 * 1000; // Token válido por 25 minutos
                return zabbixAuthToken;
            }
            console.warn("[ZABBIX] Falha no login:", result.error);
            return null;
        }
        catch (err) {
            console.warn("[ZABBIX] Erro ao autenticar:", err.message);
            return null;
        }
    })();
    try {
        return await activeZabbixLoginPromise;
    }
    finally {
        activeZabbixLoginPromise = null;
    }
}
async function fetchZabbixHostMetrics(token) {
    // Retorna um Map onde a chave é o hostname/IP e o valor são as métricas
    const metricsMap = new Map();
    const zabbixUrl = process.env.ZABBIX_URL;
    if (!zabbixUrl || !token)
        return metricsMap;
    try {
        // 1. Busca todos os hosts com seus IPs
        const hostsPayload = JSON.stringify({
            jsonrpc: "2.0",
            method: "host.get",
            params: {
                output: ["hostid", "host", "name", "status"],
                selectInterfaces: ["ip", "dns", "useip"],
                filter: { status: 0 } // Apenas hosts habilitados
            },
            id: 2
        });
        const parsedUrl = new URL(getZabbixEndpoint(zabbixUrl));
        const makeZabbixRequest = (payload) => new Promise((resolve, reject) => {
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
                path: parsedUrl.pathname,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(payload),
                    "Authorization": `Bearer ${token}`
                }
            };
            const lib = parsedUrl.protocol === "https:" ? https_1.default : http_1.default;
            const req = lib.request(options, (res) => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
            req.on("error", reject);
            req.setTimeout(15000, () => { req.destroy(); reject(new Error("Zabbix request timeout")); });
            req.write(payload);
            req.end();
        });
        const hostsRes = await makeZabbixRequest(hostsPayload);
        if (!hostsRes.result || !Array.isArray(hostsRes.result))
            return metricsMap;
        const hosts = hostsRes.result;
        if (hosts.length === 0)
            return metricsMap;
        const hostIds = hosts.map(h => h.hostid);
        // 2. Busca as últimas métricas de CPU, RAM e Disco para todos os hosts de uma vez
        const itemsPayload = JSON.stringify({
            jsonrpc: "2.0",
            method: "item.get",
            params: {
                output: ["hostid", "key_", "lastvalue", "units"],
                hostids: hostIds,
                search: { key_: "system.cpu.util" }, // CPU usage
                searchWildcardsEnabled: false,
                sortfield: "key_"
            },
            id: 3
        });
        const ramPayload = JSON.stringify({
            jsonrpc: "2.0",
            method: "item.get",
            params: {
                output: ["hostid", "key_", "lastvalue"],
                hostids: hostIds,
                search: { key_: "vm.memory" },
                searchWildcardsEnabled: false
            },
            id: 4
        });
        const diskPayload = JSON.stringify({
            jsonrpc: "2.0",
            method: "item.get",
            params: {
                output: ["hostid", "key_", "lastvalue"],
                hostids: hostIds,
                search: { key_: "vfs.fs" },
                searchWildcardsEnabled: false
            },
            id: 5
        });
        const [cpuRes, ramRes, diskRes] = await Promise.all([
            makeZabbixRequest(itemsPayload),
            makeZabbixRequest(ramPayload),
            makeZabbixRequest(diskPayload)
        ]);
        // Indexar por hostid para acesso rápido
        const cpuByHost = new Map();
        const ramByHost = new Map();
        const diskByHost = new Map();
        if (cpuRes.result) {
            for (const item of cpuRes.result) {
                const val = parseFloat(item.lastvalue);
                if (!isNaN(val))
                    cpuByHost.set(item.hostid, Math.round(val));
            }
        }
        if (ramRes.result) {
            for (const item of ramRes.result) {
                const val = parseFloat(item.lastvalue);
                if (isNaN(val))
                    continue;
                // Se for a métrica direta de utilização (porcentagem de uso)
                if (item.key_ === "vm.memory.utilization" || item.key_ === "vm.memory.size[pused]") {
                    ramByHost.set(item.hostid, Math.round(val));
                }
                // Se for métrica de espaço disponível em porcentagem: uso = 100 - livre
                else if (item.key_.includes("pavailable")) {
                    if (!ramByHost.has(item.hostid)) {
                        ramByHost.set(item.hostid, Math.round(100 - val));
                    }
                }
            }
        }
        if (diskRes.result) {
            for (const item of diskRes.result) {
                const val = parseFloat(item.lastvalue);
                if (isNaN(val))
                    continue;
                // Filtra apenas chaves que representam percentual de uso (pused)
                if (item.key_.includes("pused")) {
                    const isRoot = item.key_.includes("[/,") || item.key_.includes("[C:,");
                    // Se for a partição raiz (Linux / ou Windows C:), ou se ainda não temos nenhuma definida
                    if (isRoot || !diskByHost.has(item.hostid)) {
                        diskByHost.set(item.hostid, Math.round(val));
                    }
                }
            }
        }
        // Montar mapa IP -> métricas
        for (const host of hosts) {
            const interfaces = host.interfaces || [];
            const ips = interfaces.map((i) => i.ip).filter((ip) => ip && ip !== "127.0.0.1");
            const dnsNames = interfaces.map((i) => i.dns).filter(Boolean);
            const metrics = {
                cpu_usage: cpuByHost.get(host.hostid) ?? null,
                ram_usage: ramByHost.get(host.hostid) ?? null,
                disk_usage: diskByHost.get(host.hostid) ?? null,
                metricsSource: "zabbix"
            };
            // Indexar por hostname e por todos os IPs associados
            metricsMap.set(host.host.toLowerCase(), metrics);
            metricsMap.set(host.name.toLowerCase(), metrics);
            for (const ip of ips)
                metricsMap.set(ip, metrics);
            for (const dns of dnsNames)
                metricsMap.set(dns.toLowerCase(), metrics);
        }
    }
    catch (err) {
        console.warn("[ZABBIX] Erro ao buscar métricas:", err.message);
        throw err;
    }
    return metricsMap;
}
let cachedZabbixMetrics = null;
let lastZabbixFetch = 0;
const ZABBIX_CACHE_TTL = 60000; // 60 segundos
async function getZabbixMetrics() {
    const now = Date.now();
    if (cachedZabbixMetrics && (now - lastZabbixFetch < ZABBIX_CACHE_TTL)) {
        return cachedZabbixMetrics;
    }
    try {
        const token = await fetchZabbixToken();
        if (!token)
            return new Map();
        const metrics = await fetchZabbixHostMetrics(token);
        cachedZabbixMetrics = metrics;
        lastZabbixFetch = now;
        return metrics;
    }
    catch (err) {
        console.warn("[ZABBIX] Falha ao buscar métricas cacheadas:", err.message);
        return cachedZabbixMetrics || new Map();
    }
}
function getServerHardwareSpecs(srv, zabbixMetrics) {
    const name = (srv.name || "").toLowerCase();
    const model = (srv.model || "").toLowerCase();
    const manufacturer = (srv.manufacturer || "").toLowerCase();
    // Tentar obter métricas reais do Zabbix
    let realMetrics = null;
    if (zabbixMetrics) {
        realMetrics = zabbixMetrics.get(name) ||
            zabbixMetrics.get(srv.ip) ||
            zabbixMetrics.get((srv.name || "").toLowerCase()) ||
            null;
    }
    // Check virtualization (inalterado)
    const virtualKeywords = ["microsoft", "virtual machine", "vmware", "qemu", "xen", "virtualbox", "proxmox", "kvm", "lxc"];
    const isVirt = virtualKeywords.some(kw => name.includes(kw) || model.includes(kw) || manufacturer.includes(kw));
    let virtType = "Físico";
    if (isVirt) {
        if (model.includes("vmware") || manufacturer.includes("vmware"))
            virtType = "VMware ESXi";
        else if (model.includes("microsoft") || manufacturer.includes("microsoft"))
            virtType = "Hyper-V";
        else if (model.includes("qemu") || model.includes("kvm"))
            virtType = "QEMU/KVM";
        else if (name.includes("pve") || manufacturer.includes("proxmox"))
            virtType = "Proxmox KVM";
        else
            virtType = "Máquina Virtual";
    }
    // Hash code generation for stable mockup data
    let hash = 0;
    const str = srv.name + (srv.ip || "");
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    // Dynamic specs
    let cpu = "4 Cores";
    let memory = "8 GB";
    let storage = "240 GB SSD";
    // Adjust based on node role or name
    if (name.includes("pve")) {
        // Physical Proxmox hosts
        cpu = "24 Cores / 48 Threads";
        memory = "128 GB DDR4";
        storage = "2 TB NVMe RAID10";
    }
    else if (name.includes("db") || name.includes("sql") || name.includes("eliseos")) {
        cpu = "16 Cores";
        memory = "64 GB DDR4";
        storage = "1 TB SSD Enterprise";
    }
    else if (name.includes("zabbix") || name.includes("hades")) {
        cpu = "8 Cores";
        memory = "32 GB";
        storage = "500 GB SSD";
    }
    else if (name.includes("wg") || name.includes("vpn") || name.includes("hermes")) {
        cpu = "2 Cores";
        memory = "4 GB";
        storage = "80 GB SSD";
    }
    else {
        // Default specs using hash
        const cpuCores = [2, 4, 8, 12, 16][hash % 5];
        cpu = `${cpuCores} Cores`;
        const ramGbs = [4, 8, 16, 32, 64][hash % 5];
        memory = `${ramGbs} GB`;
        const diskGbs = [120, 240, 480, 960, 2000][hash % 5];
        storage = `${diskGbs} GB ${diskGbs >= 960 ? "SSD Enterprise" : "SSD"}`;
    }
    // Usar métricas reais do Zabbix se disponíveis (senão usar null)
    const cpu_usage = (realMetrics?.cpu_usage != null) ? realMetrics.cpu_usage : null;
    const ram_usage = (realMetrics?.ram_usage != null) ? realMetrics.ram_usage : null;
    const disk_usage = (realMetrics?.disk_usage != null) ? realMetrics.disk_usage : null;
    const metricsSource = realMetrics ? "zabbix" : "none";
    return {
        cpu,
        memory,
        storage,
        cpu_usage,
        ram_usage,
        disk_usage,
        metricsSource,
        is_virtualized: isVirt,
        virtualization_type: virtType
    };
}
async function fetchRawServersList() {
    try {
        const lansweeperUrl = process.env.LANSWEEPER_URL;
        const username = process.env.LANSWEEPER_USER;
        const password = process.env.LANSWEEPER_PASS;
        if (!lansweeperUrl || !username || !password) {
            throw new Error("Configurações do Lansweeper ausentes no arquivo .env");
        }
        const loginParams = await getLansweeperLoginParams(lansweeperUrl);
        const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
        // Fetch both reports in parallel
        const [reportData, linuxReportData] = await Promise.all([
            fetchLansweeperCustomReport(lansweeperUrl, cookies, "web40repallservers", "").catch(err => {
                console.warn("[SERVERS MONITOR] Falha ao carregar Windows/Geral report:", err.message);
                return { AddedRows: [] };
            }),
            fetchLansweeperCustomReport(lansweeperUrl, cookies, "Web50getdevicebytype", "@devicetype=11").catch(err => {
                console.warn("[SERVERS MONITOR] Falha ao carregar Linux report:", err.message);
                return { AddedRows: [] };
            })
        ]);
        const stripHtml = (htmlStr) => (htmlStr || "").replace(/<[^>]*>/g, "").trim();
        const serverMap = new Map();
        // 1. Process Windows/Geral servers
        if (reportData && Array.isArray(reportData.AddedRows)) {
            reportData.AddedRows.forEach((row) => {
                const assetId = String(row[1]);
                const name = stripHtml(row[2]);
                const domain = stripHtml(row[3]) || "-";
                const user = stripHtml(row[4]) || "-";
                const userDomain = stripHtml(row[5]) || "-";
                const ip = stripHtml(row[6]);
                const description = stripHtml(row[7]) || "-";
                const manufacturer = stripHtml(row[8]) || "-";
                const model = stripHtml(row[9]) || "-";
                const serialNumber = stripHtml(row[10]) || "-";
                const location = stripHtml(row[11]) || "-";
                const os = stripHtml(row[12]) || "-";
                const servicePack = stripHtml(row[13]) || "-";
                const firstSeen = stripHtml(row[14]) || "-";
                const lastSeen = stripHtml(row[15]) || "-";
                const lastActive = stripHtml(row[16]) || "-";
                if (ip && ip.trim() !== "") {
                    serverMap.set(assetId, {
                        id: assetId,
                        name,
                        domain,
                        user,
                        userDomain,
                        ip,
                        description,
                        manufacturer,
                        model,
                        serialNumber,
                        location,
                        os,
                        servicePack,
                        firstSeen,
                        lastSeen,
                        lastActive
                    });
                }
            });
        }
        // 2. Process Linux servers
        if (linuxReportData && Array.isArray(linuxReportData.AddedRows)) {
            linuxReportData.AddedRows.forEach((row) => {
                const assetId = String(row[1]);
                const name = stripHtml(row[2]);
                const domain = stripHtml(row[5]) || "-";
                const ip = stripHtml(row[6]);
                const description = stripHtml(row[7]) || "-";
                const manufacturer = stripHtml(row[8]) || "-";
                const model = stripHtml(row[9]) || "-";
                const location = stripHtml(row[10]) || "-";
                const os = "Linux";
                const servicePack = "-";
                const firstSeen = stripHtml(row[12]) || "-";
                const lastSeen = stripHtml(row[13]) || "-";
                const lastActive = stripHtml(row[14]) || "-";
                if (ip && ip.trim() !== "" && !serverMap.has(assetId)) {
                    serverMap.set(assetId, {
                        id: assetId,
                        name,
                        domain,
                        user: "-",
                        userDomain: "-",
                        ip,
                        description,
                        manufacturer,
                        model,
                        serialNumber: "-",
                        location,
                        os,
                        servicePack,
                        firstSeen,
                        lastSeen,
                        lastActive
                    });
                }
            });
        }
        return Array.from(serverMap.values());
    }
    catch (err) {
        console.warn("[SERVERS MONITOR] Erro ao buscar do Lansweeper. Usando fallback local:", err.message);
        return [
            { id: "14", name: "ELISEOS", domain: "drmonitoracorp", user: "Administrador", userDomain: "DRMONITORACORP", ip: "192.168.0.40", description: "Servidor Principal de Banco", manufacturer: "Dell Inc.", model: "PowerEdge R710", serialNumber: "9X2Y3Z1", location: "DR - LAN", os: "Win 2019", servicePack: "0", firstSeen: "19/04/2025 01:47:18", lastSeen: "12/06/2026 12:15:00", lastActive: "12/06/2026 12:15:48" },
            { id: "262", name: "HADES", domain: "drmonitoracorp", user: "Administrador", userDomain: "DRMONITORACORP", ip: "192.168.6.253", description: "Servidor de Arquivos Virtual", manufacturer: "Microsoft Corporation", model: "Virtual Machine", serialNumber: "VM-8849-291", location: "DR - LAN", os: "Win 2019", servicePack: "0", firstSeen: "19/04/2025 01:52:27", lastSeen: "12/06/2026 12:30:40", lastActive: "12/06/2026 12:15:48" },
            { id: "101", name: "ZEUS", domain: "drmonitoracorp", user: "Administrador", userDomain: "DRMONITORACORP", ip: "192.168.0.10", description: "Active Directory Principal", manufacturer: "HP", model: "ProLiant DL360 Gen10", serialNumber: "SGH102948X", location: "DR - LAN", os: "Windows Server 2022", servicePack: "0", firstSeen: "10/05/2025 10:20:15", lastSeen: "12/06/2026 12:35:00", lastActive: "12/06/2026 12:35:10" },
            { id: "102", name: "HERMES", domain: "drmonitoracorp", user: "root", userDomain: "HERMES", ip: "192.168.0.15", description: "Servidor de Telefonia Asterisk", manufacturer: "Supermicro", model: "SYS-5019C-WR", serialNumber: "E1920381029", location: "DR - LAN", os: "Ubuntu 22.04 LTS", servicePack: "Linux 5.15", firstSeen: "12/05/2025 08:14:22", lastSeen: "12/06/2026 12:38:00", lastActive: "12/06/2026 12:38:05" },
            { id: "103", name: "ARES", domain: "drmonitoracorp", user: "root", userDomain: "ARES", ip: "192.168.0.25", description: "Servidor Zabbix Monitoramento", manufacturer: "Microsoft Corporation", model: "Virtual Machine", serialNumber: "VM-9921-102", location: "DR - LAN", os: "Debian 12", servicePack: "Linux 6.1", firstSeen: "15/05/2025 14:02:11", lastSeen: "12/06/2026 12:40:00", lastActive: "12/06/2026 12:40:12" },
            // Linux servers / Proxmox
            { id: "1001", name: "pve01", domain: "drmonitoracorp", user: "root", userDomain: "PVE01", ip: "192.168.0.31", description: "Proxmox VE Hypervisor 01", manufacturer: "Dell Inc.", model: "PowerEdge R740", serialNumber: "9X2Y3Z2", location: "DR - Data Center", os: "Debian (Proxmox VE 8.1)", servicePack: "-", firstSeen: "19/04/2025 02:47:18", lastSeen: "12/06/2026 12:15:00", lastActive: "12/06/2026 12:15:48" },
            { id: "1002", name: "pve02", domain: "drmonitoracorp", user: "root", userDomain: "PVE02", ip: "192.168.0.32", description: "Proxmox VE Hypervisor 02", manufacturer: "Dell Inc.", model: "PowerEdge R740", serialNumber: "9X2Y3Z3", location: "DR - Data Center", os: "Debian (Proxmox VE 8.1)", servicePack: "-", firstSeen: "19/04/2025 02:48:18", lastSeen: "12/06/2026 12:15:00", lastActive: "12/06/2026 12:15:48" },
            { id: "1003", name: "pve03", domain: "drmonitoracorp", user: "root", userDomain: "PVE03", ip: "192.168.0.33", description: "Proxmox VE Hypervisor 03", manufacturer: "Dell Inc.", model: "PowerEdge R740", serialNumber: "9X2Y3Z4", location: "DR - Data Center", os: "Debian (Proxmox VE 8.1)", servicePack: "-", firstSeen: "19/04/2025 02:49:18", lastSeen: "12/06/2026 12:15:00", lastActive: "12/06/2026 12:15:48" },
            { id: "1004", name: "pve04", domain: "drmonitoracorp", user: "root", userDomain: "PVE04", ip: "192.168.0.34", description: "Proxmox VE Hypervisor 04", manufacturer: "Dell Inc.", model: "PowerEdge R740", serialNumber: "9X2Y3Z5", location: "DR - Data Center", os: "Debian (Proxmox VE 8.1)", servicePack: "-", firstSeen: "19/04/2025 02:50:18", lastSeen: "12/06/2026 12:15:00", lastActive: "12/06/2026 12:15:48" },
            { id: "1005", name: "pve05", domain: "drmonitoracorp", user: "root", userDomain: "PVE05", ip: "192.168.0.35", description: "Proxmox VE Hypervisor 05", manufacturer: "Dell Inc.", model: "PowerEdge R740", serialNumber: "9X2Y3Z6", location: "DR - Data Center", os: "Debian (Proxmox VE 8.1)", servicePack: "-", firstSeen: "19/04/2025 02:51:18", lastSeen: "12/06/2026 12:15:00", lastActive: "12/06/2026 12:15:48" },
            { id: "1006", name: "srvwg", domain: "drmonitoracorp", user: "root", userDomain: "SRVWG", ip: "192.168.0.20", description: "Servidor WireGuard VPN", manufacturer: "QEMU", model: "Standard PC (Q35 + ICH9, 2009)", serialNumber: "-", location: "DR - Virtual", os: "Ubuntu 22.04 LTS", servicePack: "-", firstSeen: "20/04/2025 10:15:30", lastSeen: "12/06/2026 12:30:00", lastActive: "12/06/2026 12:30:15" },
            { id: "1007", name: "srvZabbix", domain: "drmonitoracorp", user: "root", userDomain: "SRVZABBIX", ip: "192.168.0.105", description: "Servidor Zabbix", manufacturer: "QEMU", model: "Standard PC (Q35 + ICH9, 2009)", serialNumber: "-", location: "DR - Virtual", os: "Debian 12", servicePack: "-", firstSeen: "20/04/2025 10:20:30", lastSeen: "12/06/2026 12:30:00", lastActive: "12/06/2026 12:30:15" },
            { id: "1008", name: "srvgnew", domain: "drmonitoracorp", user: "root", userDomain: "SRVGNEW", ip: "192.168.0.50", description: "Servidor GNew Telefone", manufacturer: "QEMU", model: "Standard PC (Q35 + ICH9, 2009)", serialNumber: "-", location: "DR - Virtual", os: "Ubuntu 20.04 LTS", servicePack: "-", firstSeen: "20/04/2025 10:25:30", lastSeen: "12/06/2026 12:30:00", lastActive: "12/06/2026 12:30:15" },
            { id: "1009", name: "srvOPA01", domain: "drmonitoracorp", user: "root", userDomain: "SRVOPA01", ip: "192.168.0.101", description: "Servidor OPA", manufacturer: "QEMU", model: "Standard PC (Q35 + ICH9, 2009)", serialNumber: "-", location: "DR - Virtual", os: "Ubuntu 22.04 LTS", servicePack: "-", firstSeen: "20/04/2025 10:30:30", lastSeen: "12/06/2026 12:30:00", lastActive: "12/06/2026 12:30:15" }
        ];
    }
}
async function runServersStatusCheckActual() {
    const rawServers = await fetchRawServersList();
    // Buscar métricas do Zabbix em paralelo com a lista de servidores
    // Se o Zabbix estiver inacessível, retorna mapa vazio e usa estimativas
    const zabbixMetrics = await getZabbixMetrics().catch(() => new Map());
    if (zabbixMetrics.size > 0) {
        console.log(`✅ [ZABBIX] Métricas reais carregadas para ${zabbixMetrics.size / 2} hosts.`);
    }
    else {
        console.warn("⚠️ [ZABBIX] Métricas não disponíveis. Usando estimativas para servidores.");
    }
    const pingPromises = rawServers.map(async (srv) => {
        const pingResult = await pingDevice(srv.ip);
        const hardware = getServerHardwareSpecs(srv, zabbixMetrics);
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `server-offline-${srv.id}`,
                title: `Servidor Offline: ${srv.name}`,
                description: `O Servidor "${srv.name}" (${srv.ip}) localizado em "${srv.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        return {
            ...srv,
            ...hardware,
            online: pingResult.online,
            latency: pingResult.latency,
            message: pingResult.message
        };
    });
    return await Promise.all(pingPromises);
}
async function runServersStatusCheck(forceRefresh = false) {
    if (cachedServersStatus && !forceRefresh) {
        if (!isCheckingServers) {
            isCheckingServers = true;
            runServersStatusCheckActual().then(data => {
                cachedServersStatus = data;
                isCheckingServers = false;
            }).catch(err => {
                console.error("[SERVERS MONITOR] Erro na verificação em segundo plano:", err.message);
                isCheckingServers = false;
            });
        }
        return cachedServersStatus;
    }
    isCheckingServers = true;
    try {
        const data = await runServersStatusCheckActual();
        cachedServersStatus = data;
        isCheckingServers = false;
        return data;
    }
    catch (err) {
        isCheckingServers = false;
        throw err;
    }
}
// GET: Monitoramento de Servidores
app.get("/api/monitoring/servers", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const forceRefresh = req.query.refresh === "true";
        const ping = req.query.ping !== "false";
        if (!ping) {
            let servers = [];
            if (cachedServersStatus && !forceRefresh) {
                servers = cachedServersStatus;
            }
            else {
                const zabbixMetrics = await getZabbixMetrics();
                const list = await fetchRawServersList();
                servers = list.map((srv) => {
                    const cached = cachedServersStatus ? cachedServersStatus.find((s) => s.id === srv.id) : null;
                    const hardware = getServerHardwareSpecs(srv, zabbixMetrics);
                    return {
                        ...srv,
                        ...hardware,
                        online: cached ? cached.online : null,
                        latency: cached ? cached.latency : null,
                        message: cached ? cached.message : "Aguardando verificação..."
                    };
                });
                cachedServersStatus = servers;
            }
            res.json({
                success: true,
                elapsed_ms: Date.now() - start,
                servers
            });
            return;
        }
        const servers = await runServersStatusCheck(forceRefresh);
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            servers
        });
    }
    catch (err) {
        console.error("Erro ao verificar status dos servidores:", err);
        res.status(500).json({ error: "Erro ao verificar status dos servidores: " + err.message });
    }
});
// GET: Ping individual server
app.get("/api/monitoring/servers/:id/ping", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const assetId = req.params.id;
        if (!cachedServersStatus) {
            const zabbixMetrics = await getZabbixMetrics();
            const list = await fetchRawServersList();
            cachedServersStatus = list.map((srv) => {
                const hardware = getServerHardwareSpecs(srv, zabbixMetrics);
                return {
                    ...srv,
                    ...hardware,
                    online: null,
                    latency: null,
                    message: "Aguardando verificação..."
                };
            });
        }
        const srv = cachedServersStatus.find((s) => s.id === assetId);
        if (!srv) {
            res.status(404).json({ error: "Servidor não encontrado" });
            return;
        }
        const pingResult = await pingDevice(srv.ip);
        const zabbixMetrics = await getZabbixMetrics();
        // Recalculate hardware specs to get updated/oscillated metrics
        const hardware = getServerHardwareSpecs(srv, zabbixMetrics);
        Object.assign(srv, hardware);
        srv.online = pingResult.online;
        srv.latency = pingResult.latency;
        srv.message = pingResult.message;
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `server-offline-${srv.id}`,
                title: `Servidor Offline: ${srv.name}`,
                description: `O Servidor "${srv.name}" (${srv.ip}) localizado em "${srv.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => { });
        }
        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            server: srv
        });
    }
    catch (err) {
        console.error("Erro ao pingar servidor:", err);
        res.status(500).json({ error: "Erro ao pingar servidor: " + err.message });
    }
});
// Periodic background check (every 5 minutes)
async function runBackgroundMonitoringChecks() {
    try {
        console.log("[BACKGROUND MONITOR] Running periodic status checks...");
        await runApisStatusCheck().catch(err => {
            console.error("[BACKGROUND MONITOR] Erro ao monitorar APIs externas:", err.message);
        });
        await runSwitchesStatusCheck().catch(err => {
            console.error("[BACKGROUND MONITOR] Erro ao monitorar switches:", err.message);
        });
        await runRoutersStatusCheck().catch(err => {
            console.error("[BACKGROUND MONITOR] Erro ao monitorar roteadores:", err.message);
        });
        await runNasStatusCheck().catch(err => {
            console.error("[BACKGROUND MONITOR] Erro ao monitorar dispositivos NAS:", err.message);
        });
        // runCamerasStatusCheck desativado temporariamente
        // await runCamerasStatusCheck().catch(err => {
        //     console.error("[BACKGROUND MONITOR] Erro ao monitorar câmeras:", err.message);
        // });
        await runServersStatusCheck().catch(err => {
            console.error("[BACKGROUND MONITOR] Erro ao monitorar servidores:", err.message);
        });
        const token = await getGnewToken().catch(() => null);
        if (token) {
            const [disco, memoria, servicos] = await Promise.all([
                fetchGnewDiagnostic("/diagnostico/disco/", token).catch(() => ({ error: "fetch failed" })),
                fetchGnewDiagnostic("/diagnostico/memoria/", token).catch(() => ({ error: "fetch failed" })),
                fetchGnewDiagnostic("/servidores/1/servicos/", token).catch(() => ({ error: "fetch failed" }))
            ]);
            if (!disco.error || !memoria.error) {
                const data = { disco, memoria, servicos };
                await runGnewDiagnosticsCheckFromData(data);
            }
            else {
                await logMonitoringEvent({
                    alert_key: "gnew-api-offline",
                    title: "API Gnew Offline",
                    description: "A API externa do PABX Gnew está offline ou inacessível.",
                    severity: "critical",
                    source: "Gnew Monitor",
                    value_pct: null
                });
            }
        }
        else {
            await logMonitoringEvent({
                alert_key: "gnew-api-offline",
                title: "API Gnew Offline",
                description: "A API externa do PABX Gnew está offline ou com problemas de autenticação.",
                severity: "critical",
                source: "Gnew Monitor",
                value_pct: null
            });
        }
    }
    catch (err) {
        console.error("[BACKGROUND MONITOR] Error in periodic check:", err);
    }
}
// Start periodic checks in the background (every 5 minutes)
setInterval(runBackgroundMonitoringChecks, 5 * 60 * 1000);
// Run initial check after server starts (with 5 seconds delay)
setTimeout(runBackgroundMonitoringChecks, 5000);
// --- pfSense Integration & Scraping ---
let cachedPfSenseData = null;
let lastPfSenseFetchTime = 0;
const PFSENSE_CACHE_TTL = 15000; // 15 seconds cache
let pfsenseInterfaceMap = {
    wan: "vtnet0",
    opt1: "vtnet1",
    opt2: "vtnet2",
    lan: "vtnet3"
};
let lastCpuTotalTicks = 0;
let lastCpuUsedTicks = 0;
let pfsenseSessionCookie = "";
let pfsenseLastLoginTime = 0;
const PFSENSE_SESSION_MAX_AGE = 30 * 60 * 1000; // 30 minutes session validity
const makePfSenseGet = (urlStr, cookie = "", extraHeaders = {}) => {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(urlStr);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port ? parseInt(parsedUrl.port) : 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: "GET",
            agent: lansweeperAgent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Intranet Monitor",
                "Cookie": cookie,
                ...extraHeaders
            }
        };
        const transport = parsedUrl.protocol === "https:" ? https_1.default : http_1.default;
        const req = transport.get(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                resolve({ html: data, headers: res.headers });
            });
        });
        req.on("error", reject);
    });
};
const makePfSensePost = (urlStr, body, cookie = "", extraHeaders = {}) => {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(urlStr);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port ? parseInt(parsedUrl.port) : 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: "POST",
            agent: lansweeperAgent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Intranet Monitor",
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(body),
                "Cookie": cookie,
                ...extraHeaders
            }
        };
        const transport = parsedUrl.protocol === "https:" ? https_1.default : http_1.default;
        const req = transport.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                resolve({ html: data, headers: res.headers, statusCode: res.statusCode });
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
};
async function getPfsenseSession(forceLogin = false) {
    const now = Date.now();
    if (pfsenseSessionCookie && !forceLogin && (now - pfsenseLastLoginTime < PFSENSE_SESSION_MAX_AGE)) {
        return pfsenseSessionCookie;
    }
    console.log("🔑 [PFSENSE] Iniciando novo login no pfSense...");
    const url = process.env.PFSENSE_URL || "https://192.168.0.2:90";
    const username = process.env.PFSENSE_USER || "tv";
    const password = process.env.PFSENSE_PASS || "tv1945";
    // 1. Get Login Page to obtain csrf magic token and initial cookie
    const initialRes = await makePfSenseGet(url);
    const setCookieHeaders = initialRes.headers["set-cookie"] || [];
    const initialCookie = setCookieHeaders.map(c => c.split(";")[0]).join("; ");
    const csrfMatch = initialRes.html.match(/name='__csrf_magic' value="([^"]*)"/);
    if (!csrfMatch) {
        throw new Error("Não foi possível encontrar __csrf_magic na página do pfSense.");
    }
    const csrfToken = csrfMatch[1];
    // 2. Perform Login POST request
    const loginParams = new URLSearchParams();
    loginParams.append("__csrf_magic", csrfToken);
    loginParams.append("usernamefld", username);
    loginParams.append("passwordfld", password);
    loginParams.append("login", "Sign In");
    const postRes = await makePfSensePost(url + "/index.php", loginParams.toString(), initialCookie);
    const loginCookiesHeaders = postRes.headers["set-cookie"] || [];
    const authCookie = loginCookiesHeaders.length > 0
        ? loginCookiesHeaders.map(c => c.split(";")[0]).join("; ")
        : initialCookie;
    pfsenseSessionCookie = authCookie;
    pfsenseLastLoginTime = now;
    console.log("🔑 [PFSENSE] Login efetuado com sucesso.");
    return authCookie;
}
async function fetchPfSenseDataActual() {
    const url = process.env.PFSENSE_URL || "https://192.168.0.2:90";
    let authCookie = await getPfsenseSession();
    let indexRes = await makePfSenseGet(url + "/index.php", authCookie);
    // Se a página de login for retornada, a sessão expirou
    if (indexRes.html.includes("usernamefld")) {
        console.log("⚠️ [PFSENSE] Sessão expirada no dashboard. Efetuando login forçado...");
        authCookie = await getPfsenseSession(true);
        indexRes = await makePfSenseGet(url + "/index.php", authCookie);
    }
    const indexHtml = indexRes.html;
    let statsRes = await makePfSenseGet(url + "/getstats.php", authCookie);
    // Se getstats.php retornar algo inválido ou página de login
    if (statsRes.html.includes("usernamefld")) {
        console.log("⚠️ [PFSENSE] Sessão expirada no getstats.php. Efetuando login forçado...");
        authCookie = await getPfsenseSession(true);
        statsRes = await makePfSenseGet(url + "/getstats.php", authCookie);
    }
    const statsHtml = statsRes.html;
    // Parse Stats (from getstats.php)
    // pfSense CE getstats.php format: totalTicks|idleTicks|memory%|uptime|...|loadAvg
    // statsValues[0] = total CPU ticks, statsValues[1] = idle CPU ticks (NOT used)
    // CPU usage = (total - idle) / total * 100
    const statsValues = statsHtml.split("|");
    let cpuUsage = 0;
    let memoryUsage = 0;
    let loadAverage = "0.00, 0.00, 0.00";
    let uptime = "Desconhecido";
    if (statsValues.length >= 9) {
        const totalTicks = parseInt(statsValues[0]) || 0;
        const idleTicks = parseInt(statsValues[1]) || 0; // statsValues[1] = idle ticks
        memoryUsage = parseInt(statsValues[2]) || 0;
        uptime = (statsValues[3] || "Desconhecido").trim();
        loadAverage = (statsValues[8] || "0.00, 0.00, 0.00").trim();
        if (lastCpuTotalTicks > 0 && totalTicks > lastCpuTotalTicks) {
            const d_total = totalTicks - lastCpuTotalTicks;
            const d_idle = idleTicks - lastCpuUsedTicks; // lastCpuUsedTicks armazena idle anterior
            // CPU% = tempo não-idle / tempo total
            cpuUsage = d_total > 0 ? Math.max(0, Math.min(100, Math.floor(((d_total - d_idle) / d_total) * 100))) : 0;
        }
        else {
            cpuUsage = 0; // Primeira leitura: sem referência anterior
        }
        lastCpuTotalTicks = totalTicks;
        lastCpuUsedTicks = idleTicks; // Armazena idle para próximo cálculo
    }
    // Parse DNS
    const dnsList = [];
    const dnsBlockMatch = indexHtml.match(/<th>DNS server\(s\)<\/th>\s*<td>\s*<ul.*?>([\s\S]*?)<\/ul>/i);
    if (dnsBlockMatch) {
        const liMatches = dnsBlockMatch[1].matchAll(/<li>(.*?)<\/li>/gi);
        for (const match of liMatches) {
            dnsList.push(match[1].trim());
        }
    }
    // Parse Interfaces
    const interfacesList = [];
    const ifacesBlockMatch = indexHtml.match(/<div class="table-responsive" id="ifaces_status_interfaces-0">([\s\S]*?)<\/div>/i);
    if (ifacesBlockMatch) {
        const rowMatches = ifacesBlockMatch[1].match(/<tr>([\s\S]*?)<\/tr>/gi);
        if (rowMatches) {
            for (const rowHtml of rowMatches) {
                const nameMatch = rowHtml.match(/href="\/interfaces\.php\?if=(.*?)"[^>]*>\s*([\s\S]*?)\s*<\/a>/i);
                if (!nameMatch)
                    continue;
                const ifId = nameMatch[1].trim();
                const ifName = nameMatch[2].replace(/<[^>]*>/g, "").trim();
                const status = rowHtml.includes('title="up"') ? "up" : "down";
                // Extrai a interface física do atributo title do TD (ex: title="vtnet0 (bc:24:11:be:74:87)")
                const titleMatch = rowHtml.match(/<td[^>]*title="([^"\s\()]+).*?"/i);
                const physIf = titleMatch ? titleMatch[1].trim() : ifId;
                // Atualiza o mapa global para que o coletor de tráfego use o nome físico correto
                pfsenseInterfaceMap[ifId] = physIf;
                const tdMatches = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
                let speed = "Desconhecido";
                let ip = "Desconhecido";
                if (tdMatches && tdMatches.length >= 4) {
                    speed = tdMatches[2].replace(/<[^>]*>/g, "").trim();
                    ip = tdMatches[3].replace(/<[^>]*>/g, "").trim();
                }
                interfacesList.push({
                    name: ifName,
                    interface: ifId,
                    physIf,
                    status,
                    speed,
                    ip
                });
            }
        }
    }
    // Parse Gateways
    const gatewaysList = [];
    const gwtblMatch = indexHtml.match(/<tbody id="gateways-0-gwtblbody">([\s\S]*?)<\/tbody>/i);
    if (gwtblMatch) {
        const rowMatches = gwtblMatch[1].match(/<tr>([\s\S]*?)<\/tr>/gi);
        if (rowMatches) {
            for (const rowHtml of rowMatches) {
                const tdMatches = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
                if (tdMatches && tdMatches.length >= 5) {
                    const nameTdHtml = tdMatches[1];
                    const name = nameTdHtml.split("<br")[0].replace(/<[^>]*>/g, "").trim();
                    const ipMatch = nameTdHtml.match(/<b>(.*?)<\/b>/i);
                    const ip = ipMatch ? ipMatch[1].trim() : "Desconhecido";
                    const rtt = tdMatches[2].replace(/<[^>]*>/g, "").trim();
                    const rttsd = tdMatches[3].replace(/<[^>]*>/g, "").trim();
                    const loss = tdMatches[4].replace(/<[^>]*>/g, "").trim();
                    const statusTdHtml = tdMatches[tdMatches.length - 1];
                    const status = statusTdHtml.replace(/<[^>]*>/g, "").trim();
                    const classMatch = statusTdHtml.match(/class="([^"]*)"/i);
                    const statusClass = classMatch ? classMatch[1].trim() : "";
                    // Identifica se este gateway é o gateway padrão de saída da internet
                    const isDefault = rowHtml.includes("fa-globe") || rowHtml.includes("Default gateway");
                    gatewaysList.push({
                        name,
                        ip,
                        rtt,
                        rttsd,
                        loss,
                        status,
                        status_class: statusClass,
                        is_default: isDefault
                    });
                }
            }
        }
    }
    let main_cable_link = "Sem Conexão";
    let main_wifi_link = "Sem Conexão";
    // Classificação dinâmica e verídica baseada no status dos gateways no pfSense físico
    const onlineGateways = gatewaysList.filter(gw => gw.status.toLowerCase().includes("online"));
    // 1. Identifica a WAN/Cabo principal (Prioriza o gateway Default ou AmericaNET)
    const wanGateway = onlineGateways.find(gw => gw.is_default) ||
        onlineGateways.find(gw => {
            const nameLower = gw.name.toLowerCase();
            return nameLower.includes("americanet") || (nameLower.includes("wan") && !nameLower.includes("opt"));
        });
    // 2. Identifica o Wi-Fi / Link Secundário (VIVO)
    const wifiGateway = onlineGateways.find(gw => {
        const nameLower = gw.name.toLowerCase();
        return nameLower.includes("vivo") || nameLower.includes("wifi");
    }) || onlineGateways.find(gw => {
        const nameLower = gw.name.toLowerCase();
        return nameLower.includes("opt1") || nameLower.includes("wan2");
    });
    // 3. Identifica outros links (iMaxima)
    const optTerceiroGateway = onlineGateways.find(gw => {
        const nameLower = gw.name.toLowerCase();
        return nameLower.includes("imaxima") || nameLower.includes("opt2") || nameLower.includes("wan3");
    });
    // Atribuição do link de cabo principal
    if (wanGateway) {
        main_cable_link = `${wanGateway.name} (${wanGateway.ip})`;
    }
    else if (onlineGateways.length > 0) {
        main_cable_link = `${onlineGateways[0].name} (${onlineGateways[0].ip})`;
    }
    // Atribuição do link de Wi-Fi
    if (wifiGateway) {
        main_wifi_link = `${wifiGateway.name} (${wifiGateway.ip})`;
    }
    else if (optTerceiroGateway) {
        main_wifi_link = `${optTerceiroGateway.name} (${optTerceiroGateway.ip})`;
    }
    else if (wanGateway && onlineGateways.length > 1) {
        const other = onlineGateways.find(gw => gw.name !== wanGateway.name);
        if (other) {
            main_wifi_link = `${other.name} (${other.ip})`;
        }
    }
    return {
        isSimulated: false,
        uptime,
        cpu_usage: cpuUsage,
        memory_usage: memoryUsage,
        load_average: loadAverage,
        dns_servers: dnsList,
        interfaces: interfacesList,
        gateways: gatewaysList,
        main_cable_link,
        main_wifi_link
    };
}
let simulatedTrafficData = {
    wan: { inBytes: 1500000000, outBytes: 500000000, lastTime: Date.now() / 1000 },
    lan: { inBytes: 2500000000, outBytes: 2200000000, lastTime: Date.now() / 1000 },
    opt1: { inBytes: 800000000, outBytes: 300000000, lastTime: Date.now() / 1000 },
    opt2: { inBytes: 100000000, outBytes: 50000000, lastTime: Date.now() / 1000 }
};
function getSimulatedTrafficData() {
    const now = Date.now() / 1000;
    const interfaces = ["wan", "lan", "opt1", "opt2"];
    interfaces.forEach(iface => {
        const item = simulatedTrafficData[iface];
        const dt = now - item.lastTime;
        if (dt > 0) {
            let speedIn = 0;
            let speedOut = 0;
            if (iface === "wan") {
                speedIn = Math.floor((15 + Math.sin(now / 60) * 10 + Math.random() * 5) * 1000000); // 5-30 Mbps
                speedOut = Math.floor((3 + Math.sin(now / 80) * 2 + Math.random() * 1) * 1000000); // 1-6 Mbps
            }
            else if (iface === "lan") {
                speedIn = Math.floor((40 + Math.sin(now / 50) * 25 + Math.random() * 8) * 1000000); // 15-73 Mbps
                speedOut = Math.floor((35 + Math.sin(now / 70) * 20 + Math.random() * 6) * 1000000); // 15-61 Mbps
            }
            else if (iface === "opt1") {
                speedIn = Math.floor((8 + Math.sin(now / 90) * 5 + Math.random() * 2) * 1000000); // 3-15 Mbps
                speedOut = Math.floor((2 + Math.sin(now / 100) * 1 + Math.random() * 0.5) * 1000000); // 1-3.5 Mbps
            }
            else {
                speedIn = Math.floor((1 + Math.sin(now / 120) * 0.8 + Math.random() * 0.2) * 1000000); // 0-2 Mbps
                speedOut = Math.floor((0.5 + Math.sin(now / 150) * 0.4 + Math.random() * 0.1) * 1000000); // 0-1 Mbps
            }
            const addedIn = Math.floor((speedIn * dt) / 8);
            const addedOut = Math.floor((speedOut * dt) / 8);
            item.inBytes += addedIn;
            item.outBytes += addedOut;
            item.lastTime = now;
        }
    });
    return {
        isSimulated: true,
        wan: { timestamp: now, inBytes: simulatedTrafficData.wan.inBytes, outBytes: simulatedTrafficData.wan.outBytes },
        lan: { timestamp: now, inBytes: simulatedTrafficData.lan.inBytes, outBytes: simulatedTrafficData.lan.outBytes },
        opt1: { timestamp: now, inBytes: simulatedTrafficData.opt1.inBytes, outBytes: simulatedTrafficData.opt1.outBytes },
        opt2: { timestamp: now, inBytes: simulatedTrafficData.opt2.inBytes, outBytes: simulatedTrafficData.opt2.outBytes }
    };
}
function getSimulatedPfSenseData(reason = "fallback") {
    const now = Date.now();
    return {
        isSimulated: reason, // "mock" = intencional, "fallback" = erro/pfSense inacessível
        uptime: "15 dias, 4 horas, 32 minutos (simulado)",
        cpu_usage: Math.floor(10 + Math.sin(now / 10000) * 5 + Math.random() * 3),
        memory_usage: 42,
        load_average: "0.22, 0.28, 0.25",
        dns_servers: ["192.168.0.1", "8.8.8.8", "1.1.1.1"],
        interfaces: [
            { name: "WAN (AmericaNET)", interface: "wan", status: "up", speed: "1000baseT <full-duplex>", ip: "191.185.20.12" },
            { name: "LAN (Rede Interna)", interface: "lan", status: "up", speed: "1000baseT <full-duplex>", ip: "192.168.0.1" },
            { name: "WAN2 (VIVO)", interface: "opt1", status: "up", speed: "1000baseT <full-duplex>", ip: "186.200.15.42" },
            { name: "WAN3 (iMaxima)", interface: "opt2", status: "up", speed: "1000baseT <full-duplex>", ip: "177.85.90.114" }
        ],
        gateways: [
            { name: "WAN_GW", ip: "191.185.20.1", rtt: "4.5ms", rttsd: "0.8ms", loss: "0.0%", status: "online", status_class: "bg-success" },
            { name: "VIVO_GW", ip: "186.200.15.1", rtt: "12.8ms", rttsd: "1.1ms", loss: "0.0%", status: "online", status_class: "bg-success" },
            { name: "IMAXIMA_GW", ip: "177.85.90.1", rtt: "8.2ms", rttsd: "0.9ms", loss: "0.0%", status: "online", status_class: "bg-success" }
        ],
        main_cable_link: "WAN_GW (191.185.20.1)",
        main_wifi_link: "VIVO_GW (186.200.15.1)"
    };
}
async function getPfSenseTrafficData() {
    if (process.env.PFSENSE_MOCK === "true") {
        return { ...getSimulatedTrafficData(), isSimulated: "mock" };
    }
    try {
        const url = process.env.PFSENSE_URL || "https://192.168.0.2:90";
        let authCookie = await getPfsenseSession();
        const fetchInterfaceStats = async (ifLogicalName) => {
            const physIf = pfsenseInterfaceMap[ifLogicalName] || ifLogicalName;
            // pfSense exige POST com ajax=ajax e if=<interface_fisica> para retornar tráfego
            const postBody = `ajax=ajax&if=${physIf}`;
            const extraHeaders = {
                "X-Requested-With": "XMLHttpRequest",
                "Referer": url + "/index.php"
            };
            let statsRes = await makePfSensePost(url + `/ifstats.php`, postBody, authCookie, extraHeaders);
            // Se retornar página de login, faz login forçado e tenta de novo
            if (statsRes.html.includes("usernamefld")) {
                console.log(`⚠️ [PFSENSE] Sessão expirada ao buscar tráfego de ${ifLogicalName} (${physIf}). Forçando relogin...`);
                authCookie = await getPfsenseSession(true);
                statsRes = await makePfSensePost(url + `/ifstats.php`, postBody, authCookie, extraHeaders);
            }
            try {
                // O pfSense 2.8.1 retorna tráfego no formato JSON mapeado por interface física
                const responseData = JSON.parse(statsRes.html);
                const arrayData = responseData[physIf];
                if (arrayData && arrayData.length >= 2) {
                    const inData = arrayData[0]?.values; // [timestamp, inBytes]
                    const outData = arrayData[1]?.values; // [timestamp, outBytes]
                    if (inData && outData && inData[1] !== null && outData[1] !== null) {
                        return {
                            timestamp: parseFloat(inData[0]) || Date.now() / 1000,
                            inBytes: parseInt(inData[1]) || 0,
                            outBytes: parseInt(outData[1]) || 0
                        };
                    }
                }
            }
            catch (jsonErr) {
                // Caso não retorne JSON (ex: erro, gateway offline ou null), registramos e retornamos 0
                console.warn(`⚠️ [PFSENSE] Falha ao obter dados reais de tráfego para ${ifLogicalName} (${physIf}):`, jsonErr.message);
            }
            return {
                timestamp: Date.now() / 1000,
                inBytes: 0,
                outBytes: 0
            };
        };
        // Buscamos as interfaces em paralelo
        const [wan, opt1, opt2, lan] = await Promise.all([
            fetchInterfaceStats("wan"),
            fetchInterfaceStats("opt1"),
            fetchInterfaceStats("opt2"),
            fetchInterfaceStats("lan")
        ]);
        return {
            wan,
            opt1,
            opt2,
            lan
        };
    }
    catch (err) {
        console.error("❌ [PFSENSE] Erro ao obter tráfego real do pfSense:", err.message);
        throw err;
    }
}
async function getPfSenseData(forceRefresh = false) {
    const now = Date.now();
    if (cachedPfSenseData && (now - lastPfSenseFetchTime < PFSENSE_CACHE_TTL) && !forceRefresh) {
        return cachedPfSenseData;
    }
    if (process.env.PFSENSE_MOCK === "true") {
        const data = getSimulatedPfSenseData("mock");
        cachedPfSenseData = data;
        lastPfSenseFetchTime = now;
        return data;
    }
    try {
        const data = await fetchPfSenseDataActual();
        cachedPfSenseData = data;
        lastPfSenseFetchTime = now;
        return data;
    }
    catch (err) {
        console.error("❌ [PFSENSE] Erro ao obter dados reais do pfSense:", err.message);
        throw err;
    }
}
app.get("/api/monitoring/pfsense", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const forceRefresh = req.query.refresh === "true";
        const data = await getPfSenseData(forceRefresh);
        res.json({
            success: true,
            data
        });
    }
    catch (err) {
        console.error("Erro na rota pfSense:", err);
        res.status(500).json({ error: "Erro ao obter dados do pfSense: " + err.message });
    }
});
app.get("/api/monitoring/pfsense/traffic", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const traffic = await getPfSenseTrafficData();
        res.json({
            success: true,
            traffic
        });
    }
    catch (err) {
        console.error("Erro na rota de tráfego do pfSense:", err);
        res.status(500).json({ error: "Erro ao obter tráfego do pfSense: " + err.message });
    }
});
// 404 Catch-all para rotas da API
app.use("/api", (req, res) => {
    console.warn(`[404 NOT FOUND API] ${req.method} ${req.url}`);
    res.status(404).json({ error: `Rota da API não encontrada: ${req.method} ${req.url}` });
});
// Catch-all para o Frontend (SPA) - Redireciona qualquer rota não mapeada para o seu index.html
app.get(/^(?!\/(api|uploads))/, (req, res) => {
    res.sendFile(path_1.default.join(distPath, "index.html"));
});
// Global error handler
app.use((err, req, res, next) => {
    console.error("[ERRO GLOBAL]:", err);
    if (err instanceof multer_1.default.MulterError) {
        res.status(400).json({ error: "Erro no upload: " + err.message });
    }
    else if (err) {
        res.status(400).json({ error: err.message });
    }
    else {
        next();
    }
});
// Initialize DB and start server
(0, database_1.initializeDatabase)().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor Express rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Erro fatal ao inicializar o banco de dados. Encerrando servidor.", err);
    process.exit(1);
});
