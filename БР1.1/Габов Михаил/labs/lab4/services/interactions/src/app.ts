import express from "express";
import "express-async-errors";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";
import swaggerJson from "../build/swagger.json";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

RegisterRoutes(app);

export { app };