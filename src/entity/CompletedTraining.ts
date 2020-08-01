import { ChildEntity, Column, ManyToOne } from "typeorm";
import Training from "./Training";
import Athlete from "./Athlete";

@ChildEntity()
export default class CompletedTraining extends Training {
  @Column()
  dateCompleted: Date;

  @Column()
  RPI: number;

  @Column()
  postComment: string;

  @ManyToOne(type => Athlete, athlete => athlete.completedTrainings)
  athlete: Athlete;
}
