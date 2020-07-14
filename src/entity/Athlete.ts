import { ChildEntity, Column } from "typeorm";
import User from "./User";

@ChildEntity()
export default class Athlete extends User {
  @Column()
  test: string;
}
