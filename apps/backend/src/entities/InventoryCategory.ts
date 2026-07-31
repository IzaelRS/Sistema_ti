import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("inventory_categories")
export class InventoryCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string;

    @Column({ type: "boolean", default: false })
    is_system: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
