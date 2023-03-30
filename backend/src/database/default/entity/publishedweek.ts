import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";

@Entity()
export default class PublishedWeek extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "date",
  })
  date: string;

  @Column({
    type: "date",
  })
  startOfWeek: string;

  @Column({
    type: "date",
  })
  endOfWeek: string;
}
