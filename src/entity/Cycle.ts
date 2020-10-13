import { Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import Athlete from "./Athlete";

export abstract class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  beginDate: Date;

  @Column()
  endDate: Date;
}
