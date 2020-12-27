import { type } from "os";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import MacroCycle from "./MacroCycle";
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

  @ManyToMany((type) => User, { cascade: true })
  @JoinTable()
  users: User[];

  @OneToMany((type) => MacroCycle, (macroCycle) => macroCycle.team, {
    eager: true,
    cascade: true,
  })
  macroCycles: MacroCycle[];
}
