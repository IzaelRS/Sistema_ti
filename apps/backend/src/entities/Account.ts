import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("accounts")
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    company_name: string;

    @Column({ type: "varchar", length: 100 })
    type: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    category?: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    value: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    due_date?: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "text", nullable: true })
    observation?: string;

    @Column({ type: "varchar", length: 50, default: "On" })
    status: string;

    @Column({ type: "varchar", length: 50, default: "Pendente" })
    payment_status: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    attachment_path?: string;

    @Column({ type: "varchar", length: 100, default: "Mensal" })
    frequency: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
