import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("inventory_items")
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 100, default: "Outro" })
    category: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    brand_model?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    serial_number?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    asset_tag?: string;

    @Column({ type: "varchar", length: 50, default: "ativo" })
    status: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    location?: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    assigned_to?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    ip_address?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    mac_address?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    purchase_date?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    warranty_expires?: string;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
