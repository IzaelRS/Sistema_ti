"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1781184493870 = void 0;
class InitialMigration1781184493870 {
    constructor() {
        this.name = 'InitialMigration1781184493870';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "role" character varying(100) NOT NULL, "password" character varying(255), "avatar_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "procedures" ("id" SERIAL NOT NULL, "title" character varying(255), "name" character varying(255) NOT NULL, "responsible" character varying(255) NOT NULL, "group_name" character varying(100) NOT NULL, "model" character varying(255) NOT NULL DEFAULT '', "note" text, "observation" text, "content" text NOT NULL, "color" character varying(50) NOT NULL DEFAULT '#4F46E5', "position" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7775bab78f27b4c47580b6cb4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" SERIAL NOT NULL, "filename" character varying(255) NOT NULL, "original_name" character varying(255) NOT NULL, "mimetype" character varying(100) NOT NULL, "size" bigint NOT NULL, "path" character varying(255) NOT NULL, "category" character varying(100) NOT NULL DEFAULT 'Geral', "start_date" character varying(50), "end_date" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "company_name" character varying(255) NOT NULL, "type" character varying(100) NOT NULL, "category" character varying(100), "value" numeric(10,2) NOT NULL DEFAULT '0', "due_date" character varying(50), "description" text, "observation" text, "status" character varying(50) NOT NULL DEFAULT 'On', "payment_status" character varying(50) NOT NULL DEFAULT 'Pendente', "attachment_path" character varying(255), "frequency" character varying(100) NOT NULL DEFAULT 'Mensal', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" character varying(100) NOT NULL, "nome" character varying(255), "topico" character varying(100), "sub_topico" character varying(100), "em_ocorrencia" integer NOT NULL DEFAULT '0', "inicio" character varying(100), "fim" character varying(100), "descricao" text, "anotacao" text, "cor" character varying(50), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timeline_topics" ("id" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "color" character varying(50) NOT NULL, "position" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3f30555934941c75800e63265a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timeline_subtopics" ("id" SERIAL NOT NULL, "topic_id" character varying(100) NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_0ef5fbff3b3a2c4c21b9794a3b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monitoring_events" ("id" SERIAL NOT NULL, "alert_key" character varying(100) NOT NULL, "title" character varying(255) NOT NULL, "description" text, "severity" character varying(50) NOT NULL DEFAULT 'info', "source" character varying(100) NOT NULL DEFAULT 'Gnew Monitor', "value_pct" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bd203b18c8da5b593ed793246b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "users" ("name", "email", "role", "password") VALUES ('Usuário TI', 'ti@empresa.com.br', 'Administrador', '$2b$10$2v9BjVBM/.TLHe/oPmtPc.UpjZj.R.S/f7ubKXCceiicT.YX3nptO')`);
        await queryRunner.query(`INSERT INTO "users" ("name", "email", "role", "password") VALUES ('Izael Rodrigues', 'izael.rodrigues@drmonitora.com.br', 'Administrador', '$2b$10$x5o//f3AudU5u7XNsiafLeA5LYHxYkA2wYeFVLr4oSoeSpd51HJu6')`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "monitoring_events"`);
        await queryRunner.query(`DROP TABLE "timeline_subtopics"`);
        await queryRunner.query(`DROP TABLE "timeline_topics"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "procedures"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1781184493870 = InitialMigration1781184493870;
