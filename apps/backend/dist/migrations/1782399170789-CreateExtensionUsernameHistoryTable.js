"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExtensionUsernameHistoryTable1782399170789 = void 0;
class CreateExtensionUsernameHistoryTable1782399170789 {
    constructor() {
        this.name = 'CreateExtensionUsernameHistoryTable1782399170789';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "extension_username_history" ("id" SERIAL NOT NULL, "exten" character varying(50) NOT NULL, "old_username" character varying(255), "new_username" character varying(255), "changed_by" character varying(255), "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85757e2a8cd591ae86eec499cfd" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "extension_username_history"`);
    }
}
exports.CreateExtensionUsernameHistoryTable1782399170789 = CreateExtensionUsernameHistoryTable1782399170789;
