"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
exports.initializeDatabase = initializeDatabase;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Procedure_1 = require("./entities/Procedure");
const Document_1 = require("./entities/Document");
const Account_1 = require("./entities/Account");
const Event_1 = require("./entities/Event");
const TimelineTopic_1 = require("./entities/TimelineTopic");
const TimelineSubtopic_1 = require("./entities/TimelineSubtopic");
const MonitoringEvent_1 = require("./entities/MonitoringEvent");
const bcrypt = __importStar(require("bcrypt"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "db",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "intranet_ti",
    synchronize: true,
    logging: false,
    entities: [User_1.User, Procedure_1.Procedure, Document_1.Document, Account_1.Account, Event_1.Event, TimelineTopic_1.TimelineTopic, TimelineSubtopic_1.TimelineSubtopic, MonitoringEvent_1.MonitoringEvent],
    subscribers: [],
    migrations: [],
});
async function initializeDatabase() {
    try {
        await exports.AppDataSource.initialize();
        console.log("✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso via TypeORM.");
        await runSeeds();
    }
    catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
        throw error;
    }
}
async function runSeeds() {
    const userRepository = exports.AppDataSource.getRepository(User_1.User);
    const topicRepository = exports.AppDataSource.getRepository(TimelineTopic_1.TimelineTopic);
    const subtopicRepository = exports.AppDataSource.getRepository(TimelineSubtopic_1.TimelineSubtopic);
    // 1. Seed User
    const userCount = await userRepository.count();
    if (userCount === 0) {
        try {
            const hash = await bcrypt.hash("admin123", 10);
            const defaultAdmin = userRepository.create({
                name: "Usuário TI",
                email: "ti@empresa.com.br",
                role: "Administrador",
                password: hash
            });
            await userRepository.save(defaultAdmin);
            console.log("✅ Usuário administrador padrão criado com sucesso.");
        }
        catch (e) {
            console.error("Erro ao criar usuário administrador padrão:", e.message);
        }
    }
    // 2. Seed Timeline Topics
    const topicCount = await topicRepository.count();
    if (topicCount === 0) {
        try {
            const defaultTopics = [
                { id: "atendimento", name: "Atendimento", color: "#3b82f6", position: 0 },
                { id: "internet", name: "Internet", color: "#10b981", position: 1 },
                { id: "infraestrutura", name: "Infraestrutura", color: "#f59e0b", position: 2 },
                { id: "sistema", name: "Sistema", color: "#8b5cf6", position: 3 },
                { id: "integracoes", name: "Integrações", color: "#ec4899", position: 4 }
            ];
            await topicRepository.save(defaultTopics);
            console.log("✅ Tópicos da timeline inicializados.");
        }
        catch (e) {
            console.error("Erro ao criar tópicos padrões da timeline:", e.message);
        }
    }
    // 3. Seed Timeline Subtopics
    const subtopicCount = await subtopicRepository.count();
    if (subtopicCount === 0) {
        try {
            const defaultSubtopics = {
                "atendimento": ["Gnew", "Opa", "Chat Neo", "Rota 0", "Rota 08"],
                "internet": ["Americanet", "Vivo", "Imaxima", "Claro", "Starlink"],
                "infraestrutura": ["Eletrica", "Gerador", "Nobreak", "Rede", "Servidores"],
                "sistema": ["Neo", "AWS", "GCP", "Apps", "Comunicadores"],
                "integracoes": ["Infocar", "Bradesco", "Autentique", "Sinch", "Pluga"]
            };
            const subtopicEntities = [];
            for (const [topicId, subs] of Object.entries(defaultSubtopics)) {
                for (const subName of subs) {
                    subtopicEntities.push(subtopicRepository.create({
                        topic_id: topicId,
                        name: subName
                    }));
                }
            }
            await subtopicRepository.save(subtopicEntities);
            console.log("✅ Sub-tópicos da timeline inicializados.");
        }
        catch (e) {
            console.error("Erro ao criar sub-tópicos padrões da timeline:", e.message);
        }
    }
}
