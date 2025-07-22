import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  url!: string;

  @Column({ default: '*/5 * * * *' })
  cronInterval!: string;

  @Column({ default: true })
  enabled!: boolean;
} 