import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("keep_notes")
export class KeepNote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    title?: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "varchar", length: 50, default: "#1e293b" })
    color: string;

    @Column({ type: "varchar", length: 100, default: "Poppins" })
    font_family: string;

    @Column({ type: "varchar", length: 50, default: "medium" })
    font_size: string;

    @Column({ type: "boolean", default: false })
    is_pinned: boolean;

    @Column({ type: "integer", default: 0 })
    position: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
