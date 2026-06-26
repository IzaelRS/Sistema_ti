import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExtensionUsernameHistoryTable1782399170789 implements MigrationInterface {
    name = 'CreateExtensionUsernameHistoryTable1782399170789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "extension_username_history" ("id" SERIAL NOT NULL, "exten" character varying(50) NOT NULL, "old_username" character varying(255), "new_username" character varying(255), "changed_by" character varying(255), "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85757e2a8cd591ae86eec499cfd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "extension_username_history"`);
    }

}
