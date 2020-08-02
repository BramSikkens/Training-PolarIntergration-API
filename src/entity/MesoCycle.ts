import { ManyToOne, OneToMany } from "typeorm";
import { Cycle } from "./Cycle";
import { MacroCycle } from "./MacroCycle";
import { MicroCycle } from "./MicroCycle";
import { ChildEntity, Column, JoinTable, ManyToMany,Entity } from "typeorm";


@Entity()
export class MesoCycle extends Cycle {
  @ManyToOne((type) => MacroCycle, (macroCycle) => macroCycle.mesoCycles)
  macroCycle: MacroCycle;

  @OneToMany((type) => MicroCycle, (microCycle) => microCycle.mesoCycle)
  microcycles: MicroCycle[];
}
