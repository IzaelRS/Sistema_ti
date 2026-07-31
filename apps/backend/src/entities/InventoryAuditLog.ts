import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("inventory_audit_logs")
export class InventoryAuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer", nullable: true })
    item_id?: number;

    @Column({ type: "varchar", length: 255 })
    item_name: string;

    @Column({ type: "varchar", length: 50 })
    action: string;

    @Column({ type: "varchar", length: 255, default: "Sistema" })
    performed_by: string;

    @Column({ type: "text", nullable: true })
    details?: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
