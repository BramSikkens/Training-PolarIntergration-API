import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  ColumnType,
} from "typeorm";
import Event from "./Event";
import Training from "./Training";
import PlannedTraining from "./PlannedTraining";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  club: string;

  @Column({ length: 1000 })
  data: string;

  @Column()
  type: string;

  @Column()
  role: string;

  @ManyToMany((type) => Event, (event) => event.users)
  @JoinTable()
  events: Event[];

  @ManyToMany(
    (type) => PlannedTraining,
    (plannedTraining) => plannedTraining.athletes
  )
  @JoinTable()
  plannedTrainings: PlannedTraining[];

  @OneToMany((type) => Training, (training) => training.owner)
  trainings: Training[];
}
