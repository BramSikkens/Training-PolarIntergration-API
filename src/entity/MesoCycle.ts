import { Entity, ManyToOne, OneToMany } from "typeorm";
import { Cycle } from "./Cycle";
import { MacroCycle } from "./MacroCycle";
import { MicroCycle } from "./MicroCycle";

@Entity()
export class MesoCycle extends Cycle {
  @ManyToOne((type) => MacroCycle, (macroCycle) => macroCycle.mesoCycles)
  macroCycle: MacroCycle;

  @OneToMany((type) => MicroCycle, (microCycle) => microCycle.mesoCycle, {
    eager: true,
  })
  microcycles: MicroCycle[];
}
