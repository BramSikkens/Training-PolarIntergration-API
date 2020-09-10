import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Athlete from "./Athlete";

@Entity()
export default class DailyMetric {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sleepQuality: number;

  @Column()
  fatigue: number;

  @Column()
  soreness: number;
  @Column()
  stress: number;
  @Column()
  overalFeeling: number;

  @Column()
  sickness: number;

  @Column()
  injury: number;

  @Column()
  weight: number;

  @Column()
  date: Date;

  @ManyToOne((type) => Athlete, (athlete) => athlete.dailyMetrics)
  athlete: Athlete;
}
