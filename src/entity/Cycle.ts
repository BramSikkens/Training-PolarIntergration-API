import { Column, PrimaryGeneratedColumn } from "typeorm";
export abstract class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  beginDate: Date;

  @Column()
  endDate: Date;
}
