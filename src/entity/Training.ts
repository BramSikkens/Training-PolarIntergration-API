import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import User from "./User";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class Training {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  template: boolean;

  @Column({ length: 1000 })
  trainingData: string;

  @ManyToOne((type) => User, (user) => user.trainings)
  owner: User;
}
