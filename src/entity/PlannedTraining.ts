import { ChildEntity, Column, JoinTable, ManyToMany } from "typeorm";
import Athlete from "./Athlete";
import Training from "./Training";
import User from "./User";

@ChildEntity()
export default class PlannedTraining extends Training {
  @ManyToMany((type) => User, (athlete) => athlete.plannedTrainings, {
    cascade: true,
  })
  athletes: Athlete[];

  @Column()
  beginDate: Date;
}
