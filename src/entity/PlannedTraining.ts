import { ChildEntity, Column, JoinTable, ManyToMany } from "typeorm";
import Athlete from "./Athlete";
import Training from "./Training";
import User from "./User";

@ChildEntity()
export default class PlannedTraining extends Training {
  @ManyToMany((type) => Athlete, (athlete) => athlete.plannedTrainings)
  @JoinTable()
  athletes: Athlete[];

  @Column()
  beginDate: Date;
}
