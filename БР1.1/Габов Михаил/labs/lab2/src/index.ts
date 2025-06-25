import "dotenv/config";
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { AppDataSource } from "./data-source";
import { RegisterRoutes } from "./generated/routes";

import swaggerJson from "../build/swagger.json";

console.log("Servers block from swagger.json:", JSON.stringify(swaggerJson.servers, null, 2));


const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson, {
    swaggerOptions: {
        urls: [{ url: "http://localhost:3000/swagger.json", name: "Local Dev" }]
    }
}));

app.get('/swagger.json', (_req, res) => {
    res.json(swaggerJson);
});


RegisterRoutes(app);

app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    if (err.name === 'ValidateError') {
        return res.status(422).json({
            message: "Validation Failed",
            details: err.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
    _next();
});

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection error", err);
    });