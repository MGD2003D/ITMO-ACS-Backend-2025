import "dotenv/config";
import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import { RegisterRoutes } from "./generated/routes";
import swaggerJson from "../build/swagger.json";
import { connectRabbitMQ } from './rabbitmq-config';
import { Channel } from 'amqplib';

const PORT = process.env.PORT || 3002;
const app = express();

export let rabbitMQChannel: Channel | undefined;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

RegisterRoutes(app);

AppDataSource.initialize()
    .then(async () => {
        console.log("Recipes DB Connected");

        try {
            const { channel } = await connectRabbitMQ();
            rabbitMQChannel = channel;
        } catch (error) {
            console.error("Failed to connect to RabbitMQ, recipes service might not be fully functional for messaging.", error);
        }

        app.listen(PORT, () => console.log(`Recipes service running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection error", err);
    });