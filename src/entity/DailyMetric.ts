import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Athlete from "./Athlete";

@Entity()
export default class DailyMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sleepingHours: number;

  @Column()
  feelingSick: number;

  @Column()
  weight: number;

  @Column()
  date: Date;

  @ManyToOne((type) => Athlete, (athlete) => athlete.dailyMetrics)
  athletes: Athlete;
}
