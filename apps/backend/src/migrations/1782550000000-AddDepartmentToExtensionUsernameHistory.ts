import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartmentToExtensionUsernameHistory1782550000000 implements MigrationInterface {
    name = 'AddDepartmentToExtensionUsernameHistory1782550000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension_username_history" ADD "old_department" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "extension_username_history" ADD "new_department" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extension_username_history" DROP COLUMN "new_department"`);
        await queryRunner.query(`ALTER TABLE "extension_username_history" DROP COLUMN "old_department"`);
    }
}
