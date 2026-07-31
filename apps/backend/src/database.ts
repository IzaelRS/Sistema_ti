import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Procedure } from "./entities/Procedure";
import { Document } from "./entities/Document";
import { Account } from "./entities/Account";
import { Event } from "./entities/Event";
import { TimelineTopic } from "./entities/TimelineTopic";
import { TimelineSubtopic } from "./entities/TimelineSubtopic";
import { ExtensionUsername } from "./entities/ExtensionUsername";
import { ExtensionUsernameHistory } from "./entities/ExtensionUsernameHistory";
import { AccountCategory } from "./entities/AccountCategory";
import { KeepNote } from "./entities/KeepNote";
import { InventoryItem } from "./entities/InventoryItem";
import { InventoryAuditLog } from "./entities/InventoryAuditLog";
import { InventoryCategory } from "./entities/InventoryCategory";
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
    entities: [User, Procedure, Document, Account, AccountCategory, KeepNote, Event, TimelineTopic, TimelineSubtopic, ExtensionUsername, ExtensionUsernameHistory, InventoryItem, InventoryAuditLog, InventoryCategory],
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

        await ensureInventoryTablesExist();
        await runSeeds();
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
        throw error;
    }
}

async function ensureInventoryTablesExist() {
    try {
        await AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS "inventory_items" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "category" character varying(100) NOT NULL DEFAULT 'Outro',
                "brand_model" character varying(255),
                "serial_number" character varying(100),
                "asset_tag" character varying(100),
                "status" character varying(50) NOT NULL DEFAULT 'ativo',
                "location" character varying(150),
                "assigned_to" character varying(150),
                "ip_address" character varying(50),
                "mac_address" character varying(50),
                "purchase_date" character varying(50),
                "warranty_expires" character varying(50),
                "notes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_inventory_items_id" PRIMARY KEY ("id")
            );
        `);

        await AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS "inventory_audit_logs" (
                "id" SERIAL NOT NULL,
                "item_id" integer,
                "item_name" character varying(255) NOT NULL,
                "action" character varying(50) NOT NULL,
                "performed_by" character varying(255) NOT NULL DEFAULT 'Sistema',
                "details" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_inventory_audit_logs_id" PRIMARY KEY ("id")
            );
        `);

        await AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS "inventory_categories" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL UNIQUE,
                "description" character varying(255),
                "is_system" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_inventory_categories_id" PRIMARY KEY ("id")
            );
        `);
        console.log("✅ Tabelas de inventário verificadas/criadas com sucesso.");
    } catch (e: any) {
        console.error("Erro ao verificar/criar tabelas de inventário:", e.message);
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

    // 4. Seed Account Categories
    const categoryRepository = AppDataSource.getRepository(AccountCategory);
    const categoryCount = await categoryRepository.count();
    if (categoryCount === 0) {
        try {
            const defaultCategories = [
                { name: "Infraestrutura", is_system: true },
                { name: "Licenças de Software", is_system: true },
                { name: "Serviços Web", is_system: true },
                { name: "Telefonia / Internet", is_system: true },
                { name: "Equipamentos", is_system: true },
                { name: "Outros", is_system: true }
            ];
            await categoryRepository.save(defaultCategories);
            console.log("✅ Categorias de contas inicializadas.");
        } catch (e: any) {
            console.error("Erro ao criar categorias padrões de contas:", e.message);
        }
    }

    // 5. Seed Inventory Items
    const inventoryRepository = AppDataSource.getRepository(InventoryItem);
    const auditRepository = AppDataSource.getRepository(InventoryAuditLog);
    const inventoryCount = await inventoryRepository.count();
    if (inventoryCount === 0) {
        try {
            const defaultItems = [
                {
                    name: "Notebook Dell Latitude 5420",
                    category: "Notebook",
                    brand_model: "Dell / Latitude 5420 i7 16GB RAM 512GB SSD",
                    serial_number: "8XGT92M",
                    asset_tag: "PAT-2026-001",
                    status: "ativo",
                    location: "TI / Infraestrutura",
                    assigned_to: "Carlos Silva (Analista TI)",
                    ip_address: "192.168.1.105",
                    mac_address: "00:1A:2B:3C:4D:5E",
                    purchase_date: "2025-03-15",
                    warranty_expires: "2028-03-15",
                    notes: "Notebook principal de desenvolvimento/suporte."
                },
                {
                    name: "Switch Cisco Catalyst 2960",
                    category: "Switch",
                    brand_model: "Cisco / 2960X-24PS-L 24 Portas PoE",
                    serial_number: "FOC2145X092",
                    asset_tag: "PAT-2026-002",
                    status: "ativo",
                    location: "Rack Principal - Data Center",
                    assigned_to: "Infraestrutura",
                    ip_address: "192.168.1.254",
                    mac_address: "00:2B:3C:4D:5E:6F",
                    purchase_date: "2024-01-10",
                    warranty_expires: "2027-01-10",
                    notes: "Switch de distribuição do andar 1."
                },
                {
                    name: "Monitor Dell 24 P2419H",
                    category: "Monitor",
                    brand_model: "Dell / P2419H IPS Full HD",
                    serial_number: "CN-089X21-729",
                    asset_tag: "PAT-2026-003",
                    status: "reserva",
                    location: "Estoque TI",
                    assigned_to: undefined,
                    notes: "Equipamento em perfeito estado guardado em reserva."
                }
            ];

            const savedItems = await inventoryRepository.save(defaultItems);
            console.log("✅ Itens de inventário iniciais criados.");

            const defaultLogs = savedItems.map(item => ({
                item_id: item.id,
                item_name: item.name,
                action: "Criado",
                performed_by: "Sistema TI",
                details: `Carga inicial de item no inventário (Categoria: ${item.category}, Status: ${item.status}).`
            }));
            await auditRepository.save(defaultLogs);
        } catch (e: any) {
            console.error("Erro ao criar itens de inventário iniciais:", e.message);
        }
    }

    // 6. Seed Inventory Categories
    const invCatRepo = AppDataSource.getRepository(InventoryCategory);
    const invCatCount = await invCatRepo.count();
    if (invCatCount === 0) {
        try {
            const defaultInvCategories = [
                { name: "Notebook", description: "Laptops e computadores portáteis", is_system: true },
                { name: "Desktop", description: "Computadores de mesa e estações de trabalho", is_system: true },
                { name: "Servidor", description: "Servidores físicos e lâminas de rack", is_system: true },
                { name: "Switch", description: "Switches de rede de acesso e distribuição", is_system: true },
                { name: "Roteador", description: "Roteadores e gateways de borda", is_system: true },
                { name: "Monitor", description: "Monitores e telas de vídeo", is_system: true },
                { name: "Impressora", description: "Impressoras térmicas, multifuncionais e laser", is_system: true },
                { name: "Nobreak", description: "Nobreaks, no-breaks industriais e estabilizadores", is_system: true },
                { name: "Periférico", description: "Teclados, mouses, webcams e fones", is_system: true },
                { name: "Outro", description: "Diversos e equipamentos gerais", is_system: true }
            ];
            await invCatRepo.save(defaultInvCategories);
            console.log("✅ Categorias de inventário inicializadas.");
        } catch (e: any) {
            console.error("Erro ao criar categorias de inventário:", e.message);
        }
    }
}
