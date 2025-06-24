import "dotenv/config";
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";

import { AppDataSource } from "./data-source";

import userRoutes from "./routes/userRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import ingredientRoutes from "./routes/ingredientRoutes";
import likeRoutes from "./routes/likeRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import followRoutes from "./routes/followRoutes";
import commentRoutes from "./routes/commentRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users",       userRoutes);
app.use("/recipes",     recipeRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/likes",       likeRoutes);
app.use("/favorites",   favoriteRoutes);
app.use("/follows",     followRoutes);
app.use("/comments",    commentRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection error", err);
    });
