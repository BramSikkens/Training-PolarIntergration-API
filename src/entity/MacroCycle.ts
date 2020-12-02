import { Entity, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Cycle } from "./Cycle";
import { MesoCycle } from "./MesoCycle";
import Athlete from "./Athlete";
import Team from "./Team";

@Entity()
export default class MacroCycle extends Cycle {
  @OneToMany((type) => MesoCycle, (mesoCycle) => mesoCycle.macroCycle, {
    cascade: true,
    // eager: true,
    onDelete: "CASCADE",
  })
  mesoCycles: MesoCycle[];

  @ManyToOne((type) => Team, (team) => team.macroCycles, {
    onDelete: "CASCADE",
  })
  team: Team;
}
