"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDepartmentToExtensionUsernames1782500000000 = void 0;
class AddDepartmentToExtensionUsernames1782500000000 {
    constructor() {
        this.name = 'AddDepartmentToExtensionUsernames1782500000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "extension_usernames" ADD "department" character varying(255)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "extension_usernames" DROP COLUMN "department"`);
    }
}
exports.AddDepartmentToExtensionUsernames1782500000000 = AddDepartmentToExtensionUsernames1782500000000;
