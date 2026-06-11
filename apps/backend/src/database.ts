import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Procedure } from "./entities/Procedure";
import { Document } from "./entities/Document";
import { Account } from "./entities/Account";
import { Event } from "./entities/Event";
import { TimelineTopic } from "./entities/TimelineTopic";
import { TimelineSubtopic } from "./entities/TimelineSubtopic";
import { MonitoringEvent } from "./entities/MonitoringEvent";
import * as bcrypt from "bcrypt";
import path from "path";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "intranet_ti",
    synchronize: false,
    logging: false,
    entities: [User, Procedure, Document, Account, Event, TimelineTopic, TimelineSubtopic, MonitoringEvent],
    subscribers: [],
    migrations: [
        path.join(__dirname, "migrations/**/*.{ts,js}")
    ],
});

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso via TypeORM.");

        console.log("🔄 Executando migrations pendentes...");
        await AppDataSource.runMigrations();
        console.log("✅ Migrations executadas com sucesso.");

        await runSeeds();
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
        throw error;
    }
}

async function runSeeds() {
    const userRepository = AppDataSource.getRepository(User);
    const topicRepository = AppDataSource.getRepository(TimelineTopic);
    const subtopicRepository = AppDataSource.getRepository(TimelineSubtopic);

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
        } catch (e: any) {
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
        } catch (e: any) {
            console.error("Erro ao criar tópicos padrões da timeline:", e.message);
        }
    }

    // 3. Seed Timeline Subtopics
    const subtopicCount = await subtopicRepository.count();
    if (subtopicCount === 0) {
        try {
            const defaultSubtopics: { [key: string]: string[] } = {
                "atendimento": ["Gnew", "Opa", "Chat Neo", "Rota 0", "Rota 08"],
                "internet": ["Americanet", "Vivo", "Imaxima", "Claro", "Starlink"],
                "infraestrutura": ["Eletrica", "Gerador", "Nobreak", "Rede", "Servidores"],
                "sistema": ["Neo", "AWS", "GCP", "Apps", "Comunicadores"],
                "integracoes": ["Infocar", "Bradesco", "Autentique", "Sinch", "Pluga"]
            };

            const subtopicEntities = [];
            for (const [topicId, subs] of Object.entries(defaultSubtopics)) {
                for (const subName of subs) {
                    subtopicEntities.push(
                        subtopicRepository.create({
                            topic_id: topicId,
                            name: subName
                        })
                    );
                }
            }
            await subtopicRepository.save(subtopicEntities);
            console.log("✅ Sub-tópicos da timeline inicializados.");
        } catch (e: any) {
            console.error("Erro ao criar sub-tópicos padrões da timeline:", e.message);
        }
    }
}
