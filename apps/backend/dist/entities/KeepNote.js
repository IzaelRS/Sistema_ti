"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepNote = void 0;
const typeorm_1 = require("typeorm");
let KeepNote = class KeepNote {
};
exports.KeepNote = KeepNote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KeepNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], KeepNote.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], KeepNote.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "#1e293b" }),
    __metadata("design:type", String)
], KeepNote.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, default: "Poppins" }),
    __metadata("design:type", String)
], KeepNote.prototype, "font_family", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "medium" }),
    __metadata("design:type", String)
], KeepNote.prototype, "font_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], KeepNote.prototype, "is_pinned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", default: 0 }),
    __metadata("design:type", Number)
], KeepNote.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], KeepNote.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], KeepNote.prototype, "updated_at", void 0);
exports.KeepNote = KeepNote = __decorate([
    (0, typeorm_1.Entity)("keep_notes")
], KeepNote);
