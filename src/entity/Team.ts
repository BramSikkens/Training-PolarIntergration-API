import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";

import Trainer from "./Trainer";
import User from "./User";

@Entity()
export default class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @ManyToOne((type) => Trainer, (trainer) => trainer.teams)
  trainer: Trainer;

  @ManyToMany((type) => User)
  @JoinTable({ name: "Teams_Users" })
  users: User[];
}
