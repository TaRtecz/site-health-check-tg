import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from "typeorm";

@Entity()
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  siteId!: number;

  @Column()
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
} 