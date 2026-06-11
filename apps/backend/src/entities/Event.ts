import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("events")
export class Event {
    @PrimaryColumn({ type: "varchar", length: 100 })
    id: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    nome?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    topico?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    sub_topico?: string;

    @Column({ type: "integer", default: 0 })
    em_ocorrencia: number;

    @Column({ type: "varchar", length: 100, nullable: true })
    inicio?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    fim?: string;

    @Column({ type: "text", nullable: true })
    descricao?: string;

    @Column({ type: "text", nullable: true })
    anotacao?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    cor?: string;
}
