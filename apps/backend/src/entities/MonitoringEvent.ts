import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("monitoring_events")
export class MonitoringEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    alert_key: string;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "varchar", length: 50, default: "info" })
    severity: string;

    @Column({ type: "varchar", length: 100, default: "Gnew Monitor" })
    source: string;

    @Column({ type: "integer", nullable: true })
    value_pct?: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}
