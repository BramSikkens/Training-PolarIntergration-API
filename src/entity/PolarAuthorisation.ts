import {
  ChildEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "./User";

@Entity()
export default class PolarAuthorisation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  accessToken: string;

  @Column()
  tokenType: string;

  @Column()
  expiresIn: number;

  @Column()
  xUserId: number;

  @OneToOne((type) => User, (user) => user.polarAuthorisation, {
    onDelete: "CASCADE",
    eager: true,
  })
  user: User;
}
