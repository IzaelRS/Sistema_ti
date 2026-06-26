import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExtensionUsernamesTable1782397014679 implements MigrationInterface {
    name = 'CreateExtensionUsernamesTable1782397014679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "extension_usernames" ("exten" character varying(50) NOT NULL, "username" character varying(255) NOT NULL, CONSTRAINT "PK_dfe551aaabcbd76bd9344c448fc" PRIMARY KEY ("exten"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "extension_usernames"`);
    }

}
