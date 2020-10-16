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
  trainingLoad: number;

  @Column()
  trainingZones: string;

  @Column()
  color: string;

  @ManyToOne((type) => MesoCycle, (mesoCycle) => mesoCycle.microcycles, {
    onDelete: "CASCADE",
  })
  mesoCycle: MesoCycle;
}
