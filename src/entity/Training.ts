import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import User from "./User";

@Entity()
export default abstract class Training {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({ length: 1000 })
  trainingData: string;

  @Column()
  duration: string;

  @Column()
  period: string;

  @Column()
  order: number;

  @ManyToOne((type) => User, (user) => user.trainings)
  owner: User;
}
