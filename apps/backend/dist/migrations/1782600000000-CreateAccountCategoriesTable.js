"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountCategoriesTable1782600000000 = void 0;
class CreateAccountCategoriesTable1782600000000 {
    constructor() {
        this.name = 'CreateAccountCategoriesTable1782600000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "account_categories" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "is_system" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_account_categories_name" UNIQUE ("name"), CONSTRAINT "PK_account_categories_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "account_categories" ("name", "is_system") VALUES ('Infraestrutura', true), ('Licenças de Software', true), ('Serviços Web', true), ('Telefonia / Internet', true), ('Equipamentos', true), ('Outros', true) ON CONFLICT DO NOTHING`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "account_categories"`);
    }
}
exports.CreateAccountCategoriesTable1782600000000 = CreateAccountCategoriesTable1782600000000;
