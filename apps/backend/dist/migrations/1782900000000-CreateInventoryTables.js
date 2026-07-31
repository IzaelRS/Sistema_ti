"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInventoryTables1782900000000 = void 0;
class CreateInventoryTables1782900000000 {
    constructor() {
        this.name = 'CreateInventoryTables1782900000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
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
        await queryRunner.query(`
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
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "inventory_categories" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL UNIQUE,
                "description" character varying(255),
                "is_system" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_inventory_categories_id" PRIMARY KEY ("id")
            );
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "inventory_categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "inventory_audit_logs"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "inventory_items"`);
    }
}
exports.CreateInventoryTables1782900000000 = CreateInventoryTables1782900000000;
