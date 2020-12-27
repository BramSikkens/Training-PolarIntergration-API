import { ChildEntity, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import User from "./User";
import DailyMetric from "./DailyMetric";
import TrainingZone from "./TrainingZone";
import CompletedTraining from "./CompletedTraining";
import PlannedTraining from "./PlannedTraining";

@ChildEntity()
export default class Athlete extends User {
  @OneToMany((type) => DailyMetric, (dailyMetric) => dailyMetric.athlete)
  dailyMetrics: DailyMetric[];

  @OneToMany((type) => TrainingZone, (trainingZone) => trainingZone.athletes, {
    cascade: true,
  })
  trainingZones: TrainingZone[];

  @OneToMany(
    (type) => CompletedTraining,
    (completedTraining) => completedTraining.athlete
  )
  completedTrainings: CompletedTraining[];

  @ManyToMany(
    (type) => PlannedTraining,
    (plannedTraining) => plannedTraining.athletes,
    {
      cascade: ["insert", "update"],
    }
  )
  plannedTrainings: PlannedTraining[];
}
