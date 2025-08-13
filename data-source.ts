import dotenv from 'dotenv';
import { DataSource } from "typeorm";
import User from "./models/User";
import Instructor from "./models/Instructor";
import Course from "./models/Course";
import CourseMaterial from "./models/CourseMaterial";
import Purchase from "./models/Purchase";
import Stream from "./models/Stream";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,
  entities: [User, Instructor, Course, CourseMaterial, Purchase, Stream],
  migrations: ["migrations/*.ts", "dist/migrations/*.js"],
});
