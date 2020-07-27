import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  OneToMany,
} from "typeorm";

import Event from "./Event";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  club: string;

  @OneToMany((type) => Event, (event) => event.users)
  events: Event[];
}
