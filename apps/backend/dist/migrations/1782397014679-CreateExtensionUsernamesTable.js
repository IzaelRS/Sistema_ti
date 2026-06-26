"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExtensionUsernamesTable1782397014679 = void 0;
class CreateExtensionUsernamesTable1782397014679 {
    constructor() {
        this.name = 'CreateExtensionUsernamesTable1782397014679';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "extension_usernames" ("exten" character varying(50) NOT NULL, "username" character varying(255) NOT NULL, CONSTRAINT "PK_dfe551aaabcbd76bd9344c448fc" PRIMARY KEY ("exten"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "extension_usernames"`);
    }
}
exports.CreateExtensionUsernamesTable1782397014679 = CreateExtensionUsernamesTable1782397014679;
