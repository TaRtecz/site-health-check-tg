import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class SiteStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  siteId!: number;

  @Column()
  isUp!: boolean;
} 