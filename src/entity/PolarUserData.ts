import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import User from "./User";

@Entity()
export default class PolarUserData {
  @PrimaryColumn()
  polarUserId: number;

  @Column()
  memberId: string;

  @Column()
  registrationdate: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthdate: string;

  @Column()
  gender: string;

  @Column()
  weight: string;

  @Column()
  height: string;

  @OneToOne((type) => User, (user) => user.polarUserData, {
    onDelete: "CASCADE",
  })
  user: User;
}
