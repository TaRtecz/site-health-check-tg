import { DataSource } from "typeorm";
import { Site } from "../entities/Site";
import { SiteStatus } from "../entities/SiteStatus";
import { Log } from "../entities/Log";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Site, SiteStatus, Log],
}); 