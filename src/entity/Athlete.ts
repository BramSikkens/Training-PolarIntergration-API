import { ChildEntity, Column, OneToMany } from "typeorm";
import User from "./User";
import DailyMetric from "./DailyMetric";
import TrainingZone from "./TrainingZone";

@ChildEntity()
export default class Athlete extends User {
  @OneToMany((type) => DailyMetric, (dailyMetric) => dailyMetric.athletes)
  dailyMetrics: DailyMetric[];

  @OneToMany((type) => TrainingZone, (trainingZone) => trainingZone.athletes)
  trainingZones: TrainingZone[];
}
