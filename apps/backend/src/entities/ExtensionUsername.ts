import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("extension_usernames")
export class ExtensionUsername {
    @PrimaryColumn({ type: "varchar", length: 50 })
    exten: string;

    @Column({ type: "varchar", length: 255 })
    username: string;
}
