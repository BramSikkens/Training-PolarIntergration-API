import { OneToMany } from "typeorm";
import { Cycle } from "./Cycle";
import { MesoCycle } from "./MesoCycle";
import { ChildEntity, Column, JoinTable, ManyToMany, Entity } from "typeorm";

@Entity()
export class MacroCycle extends Cycle {
  @OneToMany((type) => MesoCycle, (mesoCycle) => mesoCycle.macroCycle)
  mesoCycles: MesoCycle[];
}
