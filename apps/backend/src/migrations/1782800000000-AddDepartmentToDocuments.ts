import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartmentToDocuments1782800000000 implements MigrationInterface {
    name = 'AddDepartmentToDocuments1782800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "department" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "department"`);
    }
}
