import { ChildEntity, Column, OneToMany } from "typeorm";
import User from "./User";
import DailyMetric from "./DailyMetric";
import TrainingZone from "./TrainingZone";
import CompletedTraining from "./CompletedTraining";

@ChildEntity()
export default class Athlete extends User {
  @OneToMany((type) => DailyMetric, (dailyMetric) => dailyMetric.athletes)
  dailyMetrics: DailyMetric[];

  @OneToMany((type) => TrainingZone, (trainingZone) => trainingZone.athletes)
  trainingZones: TrainingZone[];

  @OneToMany(
    (type) => CompletedTraining,
    (completedTraining) => completedTraining.athlete
  )
  completedTrainings: CompletedTraining[];
}
