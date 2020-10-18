import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import Event from "./Event";
import PolarAuthorisation from "./PolarAuthorisation";
import PolarUserData from "./PolarUserData";
import Training from "./Training";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @OneToMany((type) => Training, (training) => training.owner)
  trainings: Training[];

  @OneToOne((type) => PolarAuthorisation, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  polarAuthorisation: PolarAuthorisation;

  @JoinColumn()
  @OneToOne((type) => PolarUserData, { cascade: true, onDelete: "CASCADE" })
  polarUserData: PolarUserData;
}
