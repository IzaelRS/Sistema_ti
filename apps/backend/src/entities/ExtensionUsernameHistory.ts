import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("extension_username_history")
export class ExtensionUsernameHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50 })
    exten: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    old_username: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    new_username: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    old_department: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    new_department: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    changed_by: string | null;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    changed_at: Date;
}
