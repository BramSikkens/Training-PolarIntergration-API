import { ChildEntity, OneToMany } from "typeorm";
import User from "./User";
import Team from "./Team";

@ChildEntity()
export default class Trainer extends User {
  @OneToMany((type) => Team, (team) => team.trainer)
  teams: Team[];
}
