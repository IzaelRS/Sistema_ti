"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDepartmentToExtensionUsernameHistory1782550000000 = void 0;
class AddDepartmentToExtensionUsernameHistory1782550000000 {
    constructor() {
        this.name = 'AddDepartmentToExtensionUsernameHistory1782550000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "extension_username_history" ADD "old_department" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "extension_username_history" ADD "new_department" character varying(255)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "extension_username_history" DROP COLUMN "new_department"`);
        await queryRunner.query(`ALTER TABLE "extension_username_history" DROP COLUMN "old_department"`);
    }
}
exports.AddDepartmentToExtensionUsernameHistory1782550000000 = AddDepartmentToExtensionUsernameHistory1782550000000;
