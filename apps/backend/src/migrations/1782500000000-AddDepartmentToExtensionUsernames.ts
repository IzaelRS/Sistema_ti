import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartmentToExtensionUsernames1782500000000 implements MigrationInterface {
    name = 'AddDepartmentToExtensionUsernames1782500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension_usernames" ADD "department" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension_usernames" DROP COLUMN "department"`);
    }
}
