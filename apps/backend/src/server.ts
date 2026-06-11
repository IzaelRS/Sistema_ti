import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { MoreThan } from "typeorm";
import dns from "dns";
import https from "https";
import http from "http";
import os from "os";
import querystring from "querystring";
import { exec } from "child_process";

import { AppDataSource, initializeDatabase } from "./database";
import { User } from "./entities/User";
import { Procedure } from "./entities/Procedure";
import { Document } from "./entities/Document";
import { Account } from "./entities/Account";
import { MonitoringEvent } from "./entities/MonitoringEvent";
import timelineRoutes from "./routes/timeline_routes";

// Carregar variáveis do arquivo .env local, se existir
const envPath = path.join(__dirname, "../../../.env");
if (fs.existsSync(envPath)) {
    try {
        const envContent = fs.readFileSync(envPath, "utf8");
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) return;
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
    } catch (envErr: any) {
        console.error("Erro ao ler arquivo .env:", envErr.message);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do build (caso queira rodar stand-alone) e uploads
const distPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, "../../../public")));

// Ensure uploads folder exists relative to monorepo root (shared volume mountpoint /app/uploads)
const uploadsDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Somente Imagens (PNG, JPG, WEBP) e PDF são permitidos.") as any);
        }
    }
});

// --- Rate Limiters ---
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: { error: "Muitas tentativas de login. Tente novamente em 15 minutos." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        console.warn(`[RATE LIMIT] Login bloqueado para IP: ${req.ip} - ${req.body?.email || ""}`);
        res.status(429).json(options.message);
    }
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20,
    message: { error: "Limite de uploads atingido. Tente novamente em 1 hora." },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalApiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 200,
    message: { error: "Muitas requisições. Aguarde um momento." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Aplica limite geral para todas as rotas API
app.use("/api", generalApiLimiter);

// --- Monitoramento (Health Check) ---
app.get("/api/health", (req: Request, res: Response) => {
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
            platform: os.platform(),
            freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
            cpuLoad: os.loadavg()[0] ? os.loadavg()[0].toFixed(2) : "N/A"
        }
    });
});

// --- Logging Middleware ---
const logsDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const accessLogStream = fs.createWriteStream(
    path.join(logsDir, "access.log"),
    { flags: "a" }
);

app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = "***";
        console.log("Body:", JSON.stringify(sanitizedBody));
    }
    next();
});

// --- API Endpoints ---

// 0. Timeline Integration API
app.use("/api/timeline", timelineRoutes);

// 1. Procedures (FAQs)
app.get("/api/procedures", async (req: Request, res: Response) => {
    try {
        const procedureRepository = AppDataSource.getRepository(Procedure);
        const rows = await procedureRepository.find({
            order: {
                position: "ASC",
                created_at: "DESC"
            }
        });
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/procedures", async (req: Request, res: Response) => {
    try {
        const { name, responsible, group_name, note, color } = req.body;
        const model = req.body.model || "";
        const observation = req.body.observation || "";
        const content = req.body.content || "";

        if (!name || !responsible || !group_name) {
            res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            return;
        }

        const procedureRepository = AppDataSource.getRepository(Procedure);
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/procedures/reorder", async (req: Request, res: Response) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) {
            res.status(400).json({ error: "Formato inválido." });
            return;
        }

        await AppDataSource.transaction(async transactionalEntityManager => {
            for (let index = 0; index < order.length; index++) {
                const id = order[index];
                await transactionalEntityManager.update(Procedure, id, { position: index });
            }
        });

        res.json({ success: true });
    } catch (err: any) {
        console.error("Erro ao reordenar:", err);
        res.status(500).json({ error: "Erro ao reordenar." });
    }
});

app.put("/api/procedures/:id", async (req: Request, res: Response) => {
    try {
        const { name, responsible, group_name, note, model, observation, content, color } = req.body;
        const id = parseInt(req.params.id);

        if (!name) {
            res.status(400).json({ error: "O nome do procedimento é obrigatório." });
            return;
        }

        const procedureRepository = AppDataSource.getRepository(Procedure);
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/procedures/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const procedureRepository = AppDataSource.getRepository(Procedure);
        await procedureRepository.delete(id);
        res.json({ success: true, message: "Procedimento excluído." });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Documents
app.get("/api/documents", async (req: Request, res: Response) => {
    try {
        const documentRepository = AppDataSource.getRepository(Document);
        const rows = await documentRepository.find({
            order: { created_at: "DESC" }
        });
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/upload", uploadLimiter, (req: Request, res: Response) => {
    upload.single("file")(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            res.status(400).json({ error: err.message });
            return;
        } else if (err) {
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

app.post("/api/documents", uploadLimiter, upload.single("document"), async (req: Request, res: Response) => {
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
            const ext = path.extname(originalname);
            const customExt = path.extname(customName);
            if (customExt.toLowerCase() === ext.toLowerCase()) {
                finalName = customName.trim();
            } else {
                finalName = customName.trim() + ext;
            }
        }

        const documentRepository = AppDataSource.getRepository(Document);
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const documentRepository = AppDataSource.getRepository(Document);
        const row = await documentRepository.findOneBy({ id });
        
        if (!row) {
            res.status(404).json({ error: "Arquivo não encontrado." });
            return;
        }

        // Unlink file (path is stored relative to project, e.g. uploads/filename.ext)
        const absolutePath = path.join(__dirname, "../../../", row.path);
        fs.unlink(absolutePath, async (unlinkErr) => {
            if (unlinkErr) console.error("Erro ao deletar arquivo do disco:", unlinkErr);

            try {
                await documentRepository.delete(id);
                res.json({ message: "Documento excluído." });
            } catch (dbErr: any) {
                res.status(500).json({ error: dbErr.message });
            }
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// 3. User / Account (Management and Profile)
app.get("/api/users", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const rows = await userRepository.find({
            select: ["id", "name", "email", "role", "avatar_url", "created_at"],
            order: { created_at: "DESC" }
        });
        res.json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/users", async (req: Request, res: Response) => {
    try {
        console.log("POST /api/users - body:", { ...req.body, password: "***" });
        const { name, email, role, password } = req.body;
        if (!name || !email || !role) {
            console.warn("POST /api/users - Missing required fields");
            res.status(400).json({ error: "Campos obrigatórios estão faltando." });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            res.status(400).json({ error: "Este email já está cadastrado." });
            return;
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
        const newUser = userRepository.create({
            name,
            email,
            role,
            password: hashedPassword
        });

        const result = await userRepository.save(newUser);
        console.log("POST /api/users - Success, ID:", result.id);
        res.status(201).json({ id: result.id, name, email, role });
    } catch (err: any) {
        console.error("Erro ao cadastrar usuário:", err);
        res.status(500).json({ error: "Erro interno ao criar usuário: " + err.message });
    }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userRepository = AppDataSource.getRepository(User);
        const row = await userRepository.findOne({
            select: ["id", "name", "email", "role", "avatar_url", "created_at"],
            where: { id }
        });

        if (!row) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }
        res.json(row);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
    try {
        console.log(`PUT /api/users/${req.params.id} - body:`, { ...req.body, password: "***" });
        const { name, email, role, password } = req.body;
        const id = parseInt(req.params.id);

        const userRepository = AppDataSource.getRepository(User);
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
            user.password = await bcrypt.hash(password, 10);
        }

        await userRepository.save(user);
        console.log(`PUT /api/users/${id} - Success`);
        res.json({ success: true, id, name, email, role });
    } catch (err: any) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ error: "Erro interno ao atualizar usuário: " + err.message });
    }
});

// --- User Auth ---
app.post("/api/login", loginLimiter, async (req: Request, res: Response) => {
    console.log("Tentativa de login:", req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email e senha são obrigatórios." });
        return;
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });
        
        if (!user) {
            res.status(401).json({ error: "Email ou senha incorretos." });
            return;
        }

        let isValid = false;
        if (user.password && user.password.startsWith("$2")) {
            // Bcrypt comparison
            isValid = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plaintext comparison
            isValid = (password === user.password);

            // Upgrade plaintext to bcrypt
            if (isValid) {
                user.password = await bcrypt.hash(password, 10);
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
    } catch (err: any) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: "Erro interno no servidor: " + err.message });
    }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete(id);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// For backward compatibility / "My Account" page
app.get("/api/user", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            select: ["id", "name", "email", "role", "avatar_url", "created_at"],
            where: {},
            order: { created_at: "ASC" }
        });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/user", async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- Accounts ---
app.get("/api/accounts", async (req: Request, res: Response) => {
    try {
        const accountRepository = AppDataSource.getRepository(Account);
        const rows = await accountRepository.find({
            order: { created_at: "DESC" }
        });
        
        // Parse values to number since pg decimal type returns strings to prevent precision losses
        const parsedRows = rows.map(r => ({
            ...r,
            value: typeof r.value === "string" ? parseFloat(r.value) : r.value
        }));
        res.json(parsedRows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/accounts", async (req: Request, res: Response) => {
    try {
        const { company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency } = req.body;
        const accountRepository = AppDataSource.getRepository(Account);
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/accounts/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { company_name, type, category, value, due_date, description, observation, status, payment_status, attachment_path, frequency } = req.body;
        const accountRepository = AppDataSource.getRepository(Account);
        
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/accounts/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const accountRepository = AppDataSource.getRepository(Account);
        await accountRepository.delete(id);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- Telefonia (Gnew API Proxy) ---
let gnewToken: string | null = null;
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
    if (gnewToken) return gnewToken;
    
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
        
        const data = await response.json() as any;
        gnewToken = data.token;
        console.log("[TELEFONIA] Autenticado com sucesso. Token obtido.");
        return gnewToken as string;
    } catch (err: any) {
        console.error("[TELEFONIA] Erro ao autenticar no PABX:", err.message);
        throw err;
    }
}

async function fetchPaginatedGnew(initialUrl: string) {
    let token = await getGnewToken();
    let allResults: any[] = [];
    let nextPageUrl: string | null = initialUrl;

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

        const data = await response.json() as any;
        const results = data.results || [];
        allResults = allResults.concat(results);
        nextPageUrl = data.next || null;
    }
    return allResults;
}

app.get("/api/telephony/extensions", async (req: Request, res: Response) => {
    if (req.query.mock === "true") {
        res.json(getMockExtensions());
        return;
    }

    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/sip/?page_size=100`);
        console.log(`[TELEFONIA] Total de ramais consolidados: ${results.length}`);
        res.json(results);
    } catch (err: any) {
        console.error("[TELEFONIA] Erro na rota de ramais SIP:", err.message);
        res.status(500).json({ error: `Erro no proxy de telefonia: ${err.message}` });
    }
});

app.get("/api/telephony/queues", async (req: Request, res: Response) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/queue/?page_size=100`);
        console.log(`[TELEFONIA] Total de filas consolidadas: ${results.length}`);
        res.json(results);
    } catch (err: any) {
        console.error("[TELEFONIA] Erro na rota de filas:", err.message);
        res.status(500).json({ error: `Erro no proxy de filas: ${err.message}` });
    }
});

app.get("/api/telephony/blfs", async (req: Request, res: Response) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/blf/?page_size=100`);
        console.log(`[TELEFONIA] Total de BLFs consolidados: ${results.length}`);
        res.json(results);
    } catch (err: any) {
        console.error("[TELEFONIA] Erro na rota de BLFs:", err.message);
        res.status(500).json({ error: `Erro no proxy de BLFs: ${err.message}` });
    }
});

app.get("/api/telephony/users", async (req: Request, res: Response) => {
    try {
        const results = await fetchPaginatedGnew(`${GNEW_API_URL}/api/v2/usuarios/?page_size=100`);
        console.log(`[TELEFONIA] Total de usuários consolidados: ${results.length}`);
        res.json(results);
    } catch (err: any) {
        console.error("[TELEFONIA] Erro na rota de usuários Gnew:", err.message);
        res.status(500).json({ error: `Erro no proxy de usuários Gnew: ${err.message}` });
    }
});

// --- Gnew Diagnostico API Proxy ---
async function fetchGnewDiagnostic(endpoint: string, token: string) {
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
    } catch (e: any) {
        clearTimeout(timeoutId);
        return { error: e.message, success: false };
    }
}

app.get("/api/monitoring/diagnostico", async (req: Request, res: Response) => {
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
    } catch (err: any) {
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
        }).catch(() => {});

        res.json({
            status: "offline",
            message: "Usando dados locais de contingência. API externa offline.",
            error: err.message,
            data
        });
    }
});

// Helper to log monitoring events to the database (persistent, deduplicated)
async function logMonitoringEvent({ alert_key, title, description, severity, source, value_pct }: any) {
    try {
        const monitoringEventRepository = AppDataSource.getRepository(MonitoringEvent);
        const twoHoursAgo = new Date();
        twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

        // Find if there is an existing event in the last 2 hours
        const existing = await monitoringEventRepository.findOne({
            where: {
                alert_key,
                created_at: MoreThan(twoHoursAgo)
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
    } catch (err) {
        console.error("[MONITORING DB] Erro ao registrar evento no banco:", err);
        throw err;
    }
}

// Helpers to parse memory and disk output on the backend
function parseMemoryOutputBackend(output: string) {
    try {
        const lines = output.split("\n");
        const memLine = lines.find(l => l.trim().startsWith("Mem:"));
        if (memLine) {
            const tokens = memLine.trim().split(/\s+/);
            if (tokens.length >= 3) {
                const totalStr = tokens[1];
                const usedStr = tokens[2];
                
                const parseVal = (str: string) => {
                    const val = parseFloat(str);
                    if (str.toLowerCase().includes("g")) return val * 1024;
                    if (str.toLowerCase().includes("m")) return val;
                    if (str.toLowerCase().includes("k")) return val / 1024;
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
    } catch (e) {
        console.warn("Erro ao fazer parse da memória no backend:", e);
    }
    return { percentage: 0, detail: "Erro no parse" };
}

function parseDiskOutputBackend(output: string) {
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
    } catch (e) {
        console.warn("Erro ao fazer parse do disco no backend:", e);
    }
    return { percentage: 0, detail: "Erro no parse" };
}

// Check thresholds for Gnew diagnostics and save alerts
async function runGnewDiagnosticsCheckFromData(data: any) {
    if (!data) return;

    // Evaluate RAM threshold
    let ramPct = 0;
    if (data.memoria) {
        if (data.memoria.output) {
            ramPct = parseMemoryOutputBackend(data.memoria.output).percentage;
        } else if (typeof data.memoria.percent !== "undefined") {
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
    let disks: any[] = [];
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
            } catch (e) { /* ignore */ }
        } else if (Array.isArray(data.disco)) {
            disks = data.disco.map((d: any) => ({ mountpoint: d.mountpoint, percent: Math.round(d.percent || 0) }));
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
    let servicesArr: any[] = [];
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
function resolveDnsPublic(hostname: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const resolver = new dns.Resolver();
        resolver.setServers(["8.8.8.8"]); // Google Public DNS
        resolver.resolve4(hostname, (err, addresses) => {
            if (err || !addresses || !addresses.length) {
                reject(err || new Error("Nenhum IP retornado por 8.8.8.8"));
            } else {
                resolve(addresses[0]);
            }
        });
    });
}

function checkApiStatusViaIp(ip: string, hostname: string, pathStr: string, isHttps: boolean, method: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const lib = isHttps ? https : http;
        const options: any = {
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

async function checkApiStatus(url: string, method = "GET") {
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
        } catch (e: any) {
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
    } catch (e: any) {
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
            } catch (fallbackErr) {
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
        await AppDataSource.query("SELECT 1");
        const latency = Date.now() - start;
        return {
            online: true,
            latency,
            message: "Banco de dados PostgreSQL operando normalmente."
        };
    } catch (err: any) {
        const latency = Date.now() - start;
        return {
            online: false,
            latency,
            message: err.message
        };
    }
}

async function runApisStatusCheckActual() {
    const [gnew, infocar, autentique, sinch, pluga, database] = await Promise.all([
        checkApiStatus("https://gnew.drmonitora.com.br/api/v2/"),
        checkApiStatus("https://api.infocar.com.br"),
        checkApiStatus("https://api.autentique.com.br/v2/graphql", "POST"),
        checkApiStatus("https://sms.api.sinch.com"),
        checkApiStatus("https://api.pluga.co"),
        checkDatabaseStatus()
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
        } else if (api.latency >= 2000) {
            api.status = "warning";
        } else {
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
            }).catch(() => {});
        } else if (api.status === "warning") {
            logMonitoringEvent({
                alert_key: `api-alert-latency-${api.id}`,
                title: `Latência Alta: ${api.name}`,
                description: `A API "${api.name}" (${api.url}) está operando com tempo de resposta alto (${api.latency}ms).`,
                severity: "warning",
                source: "API Monitor",
                value_pct: null
            }).catch(() => {});
        }
    }

    return apis;
}

let cachedApisStatus: any = null;
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
    } catch (err) {
        isCheckingApis = false;
        throw err;
    }
}

// GET: Status de todas as APIs
app.get("/api/monitoring/apis-status", async (req: Request, res: Response) => {
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
    } catch (err: any) {
        console.error("Erro ao verificar status das APIs:", err);
        res.status(500).json({ error: "Erro ao verificar status das APIs: " + err.message });
    }
});

// GET: Lista histórico de eventos de monitoramento
app.get("/api/monitoring/events", async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 200;
        const monitoringEventRepository = AppDataSource.getRepository(MonitoringEvent);
        const rows = await monitoringEventRepository.find({
            order: { created_at: "DESC" },
            take: limit
        });

        const formattedRows = rows.map(r => ({
            ...r,
            created_at: r.created_at ? r.created_at.toISOString().replace(/\.\d{3}Z$/, "Z") : null
        }));
        res.json(formattedRows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Registra um novo evento/alerta no histórico
app.post("/api/monitoring/events", async (req: Request, res: Response) => {
    try {
        const { alert_key, title, description, severity, source, value_pct } = req.body;
        if (!alert_key || !title) {
            res.status(400).json({ error: "alert_key e title são obrigatórios." });
            return;
        }

        const result = await logMonitoringEvent({ alert_key, title, description, severity, source, value_pct });
        if (result.skipped) {
            res.status(200).json({ id: result.id, skipped: true });
        } else {
            res.status(201).json({ id: result.id });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Limpa todo o histórico de eventos
app.delete("/api/monitoring/events", async (req: Request, res: Response) => {
    try {
        const monitoringEventRepository = AppDataSource.getRepository(MonitoringEvent);
        const result = await monitoringEventRepository.delete({});
        res.json({ success: true, deleted: result.affected || 0 });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// --- Lansweeper Switch Monitoring ---
const lansweeperAgent = new https.Agent({
    rejectUnauthorized: false
});

let cachedSwitchesStatus: any = null;
let isCheckingSwitches = false;

function getLansweeperLoginParams(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: "/login.aspx",
            method: "GET",
            agent: lansweeperAgent
        };

        https.get(options, (res) => {
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

function loginLansweeper(url: string, username: string, password: string, initialCookies: string, viewstate: string, eventval: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const postData = querystring.stringify({
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

        const req = https.request(options, (res) => {
            const newCookies = res.headers["set-cookie"] || [];
            resolve([initialCookies, ...newCookies.map(c => c.split(";")[0])].join("; "));
        });

        req.on("error", reject);
        req.write(postData);
        req.end();
    });
}

function fetchLansweeperReport(url: string, cookies: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
            path: "/ReportJson.aspx?det=Web50getdevicebytype&@devicetype=6&top=500&page=1&cache=0",
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

        const req = https.request(options, (res) => {
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
                    } else {
                        resolve(parsed);
                    }
                } catch (e: any) {
                    reject(new Error("Falha no parse do JSON do Lansweeper: " + e.message));
                }
            });
        });

        req.on("error", reject);
        req.write("");
        req.end();
    });
}

function pingSwitch(ip: string): Promise<any> {
    return new Promise((resolve) => {
        const start = Date.now();
        const cmd = os.platform() === "win32"
            ? `ping -n 1 -w 2000 ${ip}`
            : `ping -c 1 -W 2 ${ip}`;

        exec(cmd, (err, stdout, stderr) => {
            const elapsed = Date.now() - start;
            if (err) {
                resolve({ online: false, latency: elapsed, message: "Sem resposta (Offline)" });
            } else {
                const match = stdout.match(/(?:time|tempo)[=<](\d+(?:\.\d+)?)\s*ms/i);
                const latency = match ? Math.round(parseFloat(match[1])) : elapsed;
                resolve({ online: true, latency, message: "Operando normalmente" });
            }
        });
    });
}

async function fetchRawSwitchesList() {
    const lansweeperUrl = process.env.LANSWEEPER_URL;
    const username = process.env.LANSWEEPER_USER;
    const password = process.env.LANSWEEPER_PASS;

    if (!lansweeperUrl || !username || !password) {
        throw new Error("Configurações do Lansweeper ausentes no arquivo .env");
    }

    const loginParams = await getLansweeperLoginParams(lansweeperUrl);
    const cookies = await loginLansweeper(lansweeperUrl, username, password, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
    const reportData = await fetchLansweeperReport(lansweeperUrl, cookies);

    if (!reportData || !Array.isArray(reportData.AddedRows)) {
        throw new Error("Nenhum dado retornado no relatório do Lansweeper");
    }

    return reportData.AddedRows.map((row: any) => {
        const stripHtml = (htmlStr: string) => (htmlStr || "").replace(/<[^>]*>/g, "").trim();
        const assetId = row[1];
        const name = stripHtml(row[2]);
        const type = row[3];
        const ip = row[6];
        const model = stripHtml(row[9]);
        const location = row[10] || "N/A";

        return { id: assetId, name, type, ip, model, location };
    }).filter((sw: any) => sw.ip && sw.ip.trim() !== "");
}

async function runSwitchesStatusCheckActual() {
    const rawSwitches = await fetchRawSwitchesList();

    const pingPromises = rawSwitches.map(async (sw: any) => {
        const pingResult = await pingSwitch(sw.ip);
        
        if (!pingResult.online) {
            logMonitoringEvent({
                alert_key: `switch-offline-${sw.id}`,
                title: `Switch Offline: ${sw.name}`,
                description: `O Switch "${sw.name}" (${sw.ip}) localizado em "${sw.location}" está inativo ou inacessível na rede local.`,
                severity: "critical",
                source: "Monitor de Rede",
                value_pct: null
            }).catch(() => {});
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
    } catch (err) {
        isCheckingSwitches = false;
        throw err;
    }
}

// GET: Monitoramento de Switches
app.get("/api/monitoring/switches", async (req: Request, res: Response) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const forceRefresh = req.query.refresh === "true";
        const ping = req.query.ping !== "false";

        if (!ping) {
            let switches = [];
            if (cachedSwitchesStatus && !forceRefresh) {
                switches = cachedSwitchesStatus;
            } else {
                const list = await fetchRawSwitchesList();
                switches = list.map((sw: any) => {
                    const cached = cachedSwitchesStatus ? cachedSwitchesStatus.find((c: any) => c.id === sw.id) : null;
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
    } catch (err: any) {
        console.error("Erro ao verificar status dos switches:", err);
        res.status(500).json({ error: "Erro ao verificar status dos switches: " + err.message });
    }
});

// GET: Ping individual switch
app.get("/api/monitoring/switches/:id/ping", async (req: Request, res: Response) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    try {
        const start = Date.now();
        const assetId = req.params.id;

        if (!cachedSwitchesStatus) {
            const list = await fetchRawSwitchesList();
            cachedSwitchesStatus = list.map((sw: any) => ({
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

        const sw = cachedSwitchesStatus.find((c: any) => c.id === assetId);
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
            }).catch(() => {});
        }

        res.json({
            success: true,
            elapsed_ms: Date.now() - start,
            switch: sw
        });
    } catch (err: any) {
        console.error("Erro ao pingar switch:", err);
        res.status(500).json({ error: "Erro ao pingar switch: " + err.message });
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
            } else {
                await logMonitoringEvent({
                    alert_key: "gnew-api-offline",
                    title: "API Gnew Offline",
                    description: "A API externa do PABX Gnew está offline ou inacessível.",
                    severity: "critical",
                    source: "Gnew Monitor",
                    value_pct: null
                });
            }
        } else {
            await logMonitoringEvent({
                alert_key: "gnew-api-offline",
                title: "API Gnew Offline",
                description: "A API externa do PABX Gnew está offline ou com problemas de autenticação.",
                severity: "critical",
                source: "Gnew Monitor",
                value_pct: null
            });
        }
    } catch (err) {
        console.error("[BACKGROUND MONITOR] Error in periodic check:", err);
    }
}

// Start periodic checks in the background (every 5 minutes)
setInterval(runBackgroundMonitoringChecks, 5 * 60 * 1000);

// Run initial check after server starts (with 5 seconds delay)
setTimeout(runBackgroundMonitoringChecks, 5000);

// 404 Catch-all para rotas da API
app.use("/api", (req: Request, res: Response) => {
    console.warn(`[404 NOT FOUND API] ${req.method} ${req.url}`);
    res.status(404).json({ error: `Rota da API não encontrada: ${req.method} ${req.url}` });
});

// Catch-all para o Frontend (SPA) - Redireciona qualquer rota não mapeada para o seu index.html
app.get(/^(?!\/(api|uploads))/, (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[ERRO GLOBAL]:", err);
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: "Erro no upload: " + err.message });
    } else if (err) {
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
});

// Initialize DB and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor Express rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Erro fatal ao inicializar o banco de dados. Encerrando servidor.", err);
    process.exit(1);
});
