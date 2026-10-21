import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import { Document } from "../entities/Document.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User, Document],
  migrations: ["migrations/*.js"],

  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  sessionSecret: process.env.SESSION_SECRET,
});
