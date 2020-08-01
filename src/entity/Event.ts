import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./User";

@Entity()
export default class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  beginDate: Date;

  @Column()
  endDate: Date;

  @Column()
  type: string;
}
