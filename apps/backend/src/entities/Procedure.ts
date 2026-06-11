import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("procedures")
export class Procedure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    title?: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    responsible: string;

    @Column({ type: "varchar", length: 100 })
    group_name: string;

    @Column({ type: "varchar", length: 255, default: "" })
    model: string;

    @Column({ type: "text", nullable: true })
    note?: string;

    @Column({ type: "text", nullable: true })
    observation?: string;

    @Column({ type: "text" })
    content: string;

    @Column({ type: "varchar", length: 50, default: "#4F46E5" })
    color: string;

    @Column({ type: "integer", default: 0 })
    position: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
