import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKeepNotesTable1782700000000 implements MigrationInterface {
    name = 'CreateKeepNotesTable1782700000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "keep_notes" ("id" SERIAL NOT NULL, "title" character varying(255), "content" text NOT NULL, "color" character varying(50) NOT NULL DEFAULT '#1e293b', "font_family" character varying(100) NOT NULL DEFAULT 'Poppins', "font_size" character varying(50) NOT NULL DEFAULT 'medium', "is_pinned" boolean NOT NULL DEFAULT false, "position" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_keep_notes_id" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "keep_notes"`);
    }
}
