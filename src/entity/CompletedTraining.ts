import {
  ChildEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import Training from "./Training";
import Athlete from "./Athlete";
import PlannedTraining from "./PlannedTraining";
import MetaData from "./MetaData";

@Entity()
export default class CompletedTraining extends Training {
  @Column()
  dateCompleted: Date;

  @Column()
  RPI: number;

  @Column()
  source: string;

  @OneToOne(() => MetaData, {
    cascade: true,
  })
  @JoinColumn()
  polarData: MetaData;

  @Column()
  postComment: string;

  @Column("text")
  timeInZones: string;

  @Column()
  distance: string;

  @Column()
  calories: number;

  @Column()
  avgHr: number;

  @Column()
  maxHr: number;

  @ManyToOne((type) => Athlete, (athlete) => athlete.completedTrainings)
  athlete: Athlete;

  @ManyToOne((type) => PlannedTraining)
  plannedTraining: PlannedTraining;
}
