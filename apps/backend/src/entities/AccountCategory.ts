import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("account_categories")
export class AccountCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @Column({ type: "boolean", default: false })
    is_system: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
