import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import Event from "./Event";
import PlannedTraining from "./PlannedTraining";
import Training from "./Training";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  club: string;

  @ManyToMany((type) => Event)
  @JoinTable()
  events: Event[];

  @OneToMany((type) => Training, (training) => training.owner)
  trainings: Training[];
}
