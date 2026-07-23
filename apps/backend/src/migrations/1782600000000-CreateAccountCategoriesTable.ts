import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountCategoriesTable1782600000000 implements MigrationInterface {
    name = 'CreateAccountCategoriesTable1782600000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_categories" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "is_system" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_account_categories_name" UNIQUE ("name"), CONSTRAINT "PK_account_categories_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "account_categories" ("name", "is_system") VALUES ('Infraestrutura', true), ('Licenças de Software', true), ('Serviços Web', true), ('Telefonia / Internet', true), ('Equipamentos', true), ('Outros', true) ON CONFLICT DO NOTHING`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account_categories"`);
    }
}
