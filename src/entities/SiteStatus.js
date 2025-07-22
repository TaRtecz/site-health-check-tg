import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class SiteStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  siteId;

  @Column()
  isUp;
} 