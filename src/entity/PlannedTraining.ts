import { ChildEntity, Column, JoinTable, ManyToMany } from "typeorm";
import Athlete from "./Athlete";
import Training from "./Training";

@ChildEntity()
export default class PlannedTraining extends Training {
  @ManyToMany((type) => Athlete)
  @JoinTable()
  athletes: Athlete[];

  @Column()
  beginDate: Date;
}
