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

const PORT = process.env.PORT || 3003;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

RegisterRoutes(app);

AppDataSource.initialize()
    .then(async () => {
        console.log("Interactions DB Connected");

        try {
            const { channel } = await connectRabbitMQ();
            (app as any).rabbitMQChannel = channel;

            const queue = 'new_recipe_events';
            await channel.assertQueue(queue, { durable: true });
            console.log(`[Interactions Service] Waiting for messages in queue: ${queue}. To exit press CTRL+C`);

            channel.consume(queue, async (msg) => {
                if (msg) {
                    try {
                        const event = JSON.parse(msg.content.toString());
                        console.log(`[Interactions Service] Received message:`, event);
                        channel.ack(msg);
                        console.log(`[Interactions Service] Message processed and acknowledged.`);
                    } catch (parseError) {
                        console.error('[Interactions Service] Error parsing message:', parseError);
                        channel.reject(msg, false);
                    }
                }
            });

        } catch (error) {
            console.error("Failed to connect to RabbitMQ, interactions service might not be fully functional for messaging.", error);
        }

        app.listen(PORT, () => console.log(`Interactions service running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection error", err);
    });