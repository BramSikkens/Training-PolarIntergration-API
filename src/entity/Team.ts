import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { injectable, inject } from "inversify";
import Trainer from "./Trainer";
import User from "./User";

@injectable()
@Entity()
export default class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @ManyToOne((type) => Trainer, (trainer) => trainer.teams)
  trainer: Trainer;

  @ManyToMany((type) => User)
  @JoinTable()
  users: User[];
}
