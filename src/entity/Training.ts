import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import User from "./User";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  template: boolean;

  @ManyToOne((type) => User, (user) => user.trainings)
  owner: User;
}
