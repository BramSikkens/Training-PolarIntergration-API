import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Athlete from "../entity/Athlete";

@Entity()
export default class TrainingZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  zoneType: string;

  @Column()
  maxHr: number;

  @Column()
  minHr: number;

  @Column()
  minPwr: number;

  @Column()
  maxPwr: number;

  @Column()
  minSpd: number;

  @Column()
  maxSpd: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dateCreated: Date;

  @ManyToOne((type) => Athlete, (athlete) => athlete.trainingZones)
  athletes: Athlete;
}
