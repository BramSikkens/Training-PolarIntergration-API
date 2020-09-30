import { ChildEntity, OneToMany, Column } from "typeorm";
import User from "./User";
import Team from "./Team";

@ChildEntity()
export default class Trainer extends User {
  @OneToMany((type) => Team, (team) => team.trainer, { cascade: true })
  teams: Team[];

  role: string;
}
git 