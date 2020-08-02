import { ManyToOne } from "typeorm";
import { Cycle } from "./Cycle";
import { MesoCycle } from "./MesoCycle";
import { ChildEntity, Column, JoinTable, ManyToMany, Entity } from "typeorm";

@Entity()
export class MicroCycle extends Cycle {
  @Column()
  locations: string;

  @Column()
  purpose: string;

  @Column()
  number: number;

  @Column()
  payload: string;

  @Column()
  TrainingZone: string;

  @ManyToOne((type) => MesoCycle, (mesoCycle) => mesoCycle.microcycles)
  mesoCycle: MesoCycle;
}
