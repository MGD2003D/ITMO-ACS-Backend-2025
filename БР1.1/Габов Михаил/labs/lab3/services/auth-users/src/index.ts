import "dotenv/config";
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import { RegisterRoutes } from "./generated/routes";
import swaggerJson from "../build/swagger.json";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

RegisterRoutes(app);

AppDataSource.initialize()
    .then(() => {
        console.log("Auth & Users DB Connected");
        app.listen(PORT, () => console.log(`Auth & Users service running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection error", err);
    });