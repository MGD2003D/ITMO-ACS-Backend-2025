import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import {
    User,
    Recipe,
    Ingredient,
    RecipeIngredient,
    Comment,
    Like,
    Favorite,
    Follow,
    RecipeStep,
} from "./models";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: +(process.env.DB_PORT || 5433),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "recipes",
    synchronize: true,
    logging: true,
    entities: [
        User,
        Recipe,
        Ingredient,
        RecipeIngredient,
        Comment,
        Like,
        Favorite,
        Follow,
        RecipeStep,
    ],
});