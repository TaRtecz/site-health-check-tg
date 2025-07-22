import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  name;

  @Column()
  url;

  @Column({ default: '*/5 * * * *' })
  cronInterval;

  @Column({ default: true })
  enabled;
} 