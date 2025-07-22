import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from "typeorm";

@Entity()
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  siteId;

  @Column()
  status;

  @CreateDateColumn()
  createdAt;
} 