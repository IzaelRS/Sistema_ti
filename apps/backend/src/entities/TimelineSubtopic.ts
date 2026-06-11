import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("timeline_subtopics")
export class TimelineSubtopic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    topic_id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;
}
