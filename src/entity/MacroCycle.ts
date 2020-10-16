import { Entity, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Cycle } from "./Cycle";
import { MesoCycle } from "./MesoCycle";
import Athlete from "./Athlete";

@Entity()
export class MacroCycle extends Cycle {
  @OneToMany((type) => MesoCycle, (mesoCycle) => mesoCycle.macroCycle, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  mesoCycles: MesoCycle[];

  @ManyToMany((type) => Athlete, (athlete) => athlete.macroCycles)
  @JoinTable()
  athletes: Athlete[];
}
