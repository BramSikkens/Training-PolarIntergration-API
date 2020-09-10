import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from "typeorm";
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

  @ManyToMany((type) => User, (user) => user.events, { cascade: true })
  users: User[];
}
