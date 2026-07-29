"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDepartmentToDocuments1782800000000 = void 0;
class AddDepartmentToDocuments1782800000000 {
    constructor() {
        this.name = 'AddDepartmentToDocuments1782800000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "documents" ADD "department" character varying(100)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "department"`);
    }
}
exports.AddDepartmentToDocuments1782800000000 = AddDepartmentToDocuments1782800000000;
