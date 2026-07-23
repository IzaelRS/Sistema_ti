"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateKeepNotesTable1782700000000 = void 0;
class CreateKeepNotesTable1782700000000 {
    constructor() {
        this.name = 'CreateKeepNotesTable1782700000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "keep_notes" ("id" SERIAL NOT NULL, "title" character varying(255), "content" text NOT NULL, "color" character varying(50) NOT NULL DEFAULT '#1e293b', "font_family" character varying(100) NOT NULL DEFAULT 'Poppins', "font_size" character varying(50) NOT NULL DEFAULT 'medium', "is_pinned" boolean NOT NULL DEFAULT false, "position" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_keep_notes_id" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "keep_notes"`);
    }
}
exports.CreateKeepNotesTable1782700000000 = CreateKeepNotesTable1782700000000;
