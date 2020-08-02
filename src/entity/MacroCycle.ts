import { Entity, OneToMany } from "typeorm";
import { Cycle } from "./Cycle";
import { MesoCycle } from "./MesoCycle";

@Entity()
export class MacroCycle extends Cycle {
  @OneToMany((type) => MesoCycle, (mesoCycle) => mesoCycle.macroCycle)
  mesoCycles: MesoCycle[];
}
