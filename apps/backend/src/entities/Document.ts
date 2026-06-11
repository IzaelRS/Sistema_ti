import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("documents")
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    filename: string;

    @Column({ type: "varchar", length: 255 })
    original_name: string;

    @Column({ type: "varchar", length: 100 })
    mimetype: string;

    @Column({ type: "bigint" })
    size: number;

    @Column({ type: "varchar", length: 255 })
    path: string;

    @Column({ type: "varchar", length: 100, default: "Geral" })
    category: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    start_date?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    end_date?: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
