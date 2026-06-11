import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("timeline_topics")
export class TimelineTopic {
    @PrimaryColumn({ type: "varchar", length: 100 })
    id: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 50 })
    color: string;

    @Column({ type: "integer", default: 0 })
    position: number;
}
