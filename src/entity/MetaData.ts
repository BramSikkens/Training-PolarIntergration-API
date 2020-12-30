import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export default class MetaData {
  constructor(metaData: string) {
    this.data = metaData;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("longtext")
  data: string;
}
