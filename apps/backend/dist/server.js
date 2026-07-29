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
const os_1 = __importDefault(require("os"));
const database_1 = require("./database");
const User_1 = require("./entities/User");
const Procedure_1 = require("./entities/Procedure");
const Document_1 = require("./entities/Document");
const Account_1 = require("./entities/Account");
const AccountCategory_1 = require("./entities/AccountCategory");
const KeepNote_1 = require("./entities/KeepNote");
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
        const department = req.body.department ? req.body.department.trim() : null;
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
            end_date,
            department
        });
        const result = await documentRepository.save(newDoc);
        res.status(201).json({ id: result.id, originalname: finalName, filename, category, start_date, end_date, department });
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
// --- Account Categories ---
app.get("/api/account-categories", async (req, res) => {
    try {
        const repo = database_1.AppDataSource.getRepository(AccountCategory_1.AccountCategory);
        const categories = await repo.find({
            order: { name: "ASC" }
        });
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/account-categories", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            res.status(400).json({ error: "Nome da categoria é obrigatório." });
            return;
        }
        const repo = database_1.AppDataSource.getRepository(AccountCategory_1.AccountCategory);
        const trimmedName = name.trim();
        const existing = await repo.findOneBy({ name: trimmedName });
        if (existing) {
            res.status(400).json({ error: "Categoria já existe." });
            return;
        }
        const newCategory = repo.create({
            name: trimmedName,
            is_system: false
        });
        const result = await repo.save(newCategory);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/api/account-categories/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const transferTo = req.query.transferTo;
        const repo = database_1.AppDataSource.getRepository(AccountCategory_1.AccountCategory);
        const category = await repo.findOneBy({ id });
        if (!category) {
            res.status(404).json({ error: "Categoria não encontrada." });
            return;
        }
        if (transferTo && transferTo.trim()) {
            const accountRepo = database_1.AppDataSource.getRepository(Account_1.Account);
            await accountRepo.update({ category: category.name }, { category: transferTo.trim() });
        }
        await repo.delete(id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- Keep Notes Routes ---
app.get("/api/keep-notes", async (req, res) => {
    try {
        const repo = database_1.AppDataSource.getRepository(KeepNote_1.KeepNote);
        const notes = await repo.find({
            order: {
                is_pinned: "DESC",
                created_at: "DESC"
            }
        });
        res.json(notes);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post("/api/keep-notes", async (req, res) => {
    try {
        const { title, content, color, font_family, font_size, is_pinned } = req.body;
        if (!content || !content.trim()) {
            res.status(400).json({ error: "O conteúdo da nota é obrigatório." });
            return;
        }
        const repo = database_1.AppDataSource.getRepository(KeepNote_1.KeepNote);
        const newNote = repo.create({
            title: title ? title.trim() : "",
            content: content.trim(),
            color: color || "#1e293b",
            font_family: font_family || "Poppins",
            font_size: font_size || "medium",
            is_pinned: Boolean(is_pinned)
        });
        const saved = await repo.save(newNote);
        res.json(saved);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/api/keep-notes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const repo = database_1.AppDataSource.getRepository(KeepNote_1.KeepNote);
        const note = await repo.findOneBy({ id });
        if (!note) {
            res.status(404).json({ error: "Nota não encontrada." });
            return;
        }
        const { title, content, color, font_family, font_size, is_pinned } = req.body;
        if (title !== undefined)
            note.title = title.trim();
        if (content !== undefined)
            note.content = content.trim();
        if (color !== undefined)
            note.color = color;
        if (font_family !== undefined)
            note.font_family = font_family;
        if (font_size !== undefined)
            note.font_size = font_size;
        if (is_pinned !== undefined)
            note.is_pinned = Boolean(is_pinned);
        const updated = await repo.save(note);
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete("/api/keep-notes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const repo = database_1.AppDataSource.getRepository(KeepNote_1.KeepNote);
        const note = await repo.findOneBy({ id });
        if (!note) {
            res.status(404).json({ error: "Nota não encontrada." });
            return;
        }
        await repo.delete(id);
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
        const { exten, department, changed_by } = req.body;
        if (!exten) {
            res.status(400).json({ error: "O número do ramal (exten) é obrigatório." });
            return;
        }
        const extensionUsernameRepository = database_1.AppDataSource.getRepository(ExtensionUsername_1.ExtensionUsername);
        const historyRepository = database_1.AppDataSource.getRepository(ExtensionUsernameHistory_1.ExtensionUsernameHistory);
        let record = await extensionUsernameRepository.findOneBy({ exten });
        const oldDepartment = record ? record.department : null;
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
        // Registrar no histórico caso tenha mudado
        if (oldDepartment !== newDepartment) {
            const historyRecord = historyRepository.create({
                exten,
                old_department: oldDepartment,
                new_department: newDepartment,
                changed_by: changed_by || "Sistema"
            });
            await historyRepository.save(historyRecord);
            console.log(`[TELEFONIA] Histórico registrado para o ramal ${exten} (Departamento): de "${oldDepartment || ''}" para "${newDepartment}" por "${changed_by || 'Sistema'}"`);
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
            query.andWhere("(LOWER(history.old_username) LIKE :username OR LOWER(history.new_username) LIKE :username OR LOWER(history.old_department) LIKE :username OR LOWER(history.new_department) LIKE :username)", { username: `%${String(username).toLowerCase()}%` });
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
