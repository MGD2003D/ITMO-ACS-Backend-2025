import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Comment, Like, Favorite } from "./models";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: +(process.env.DB_PORT || 5433),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "interactions_db",
    synchronize: true,
    logging: false,
    entities: [ Comment, Like, Favorite ],
});