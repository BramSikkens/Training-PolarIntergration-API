import { ChildEntity, Column, Entity, ManyToOne } from "typeorm";
import Training from "./Training";
import Athlete from "./Athlete";
import PlannedTraining from "./PlannedTraining";

@Entity()
export default class CompletedTraining extends Training {
  @Column()
  dateCompleted: Date;

  @Column()
  RPI: number;

  @Column()
  source: string;

  @Column("longtext")
  polarData: string;

  @Column()
  postComment: string;

  @ManyToOne((type) => Athlete, (athlete) => athlete.completedTrainings)
  athlete: Athlete;

  @ManyToOne((type) => PlannedTraining)
  plannedTraining: PlannedTraining;
}
