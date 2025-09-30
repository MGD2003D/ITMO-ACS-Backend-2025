import "dotenv/config";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { initRabbitMQ } from './rabbitmq-config';
import { app } from './app';

const PORT = process.env.PORT || 3002;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function startServer() {
  try {
    if (!RABBITMQ_URL) {
      throw new Error('RABBITMQ_URL not defifned');
    }

    console.log("Connecting to database...");
    const dbConnection = AppDataSource.initialize();

    console.log("Connecting to RabbitMQ...");
    const rabbitConnection = initRabbitMQ(RABBITMQ_URL);

    await Promise.all([dbConnection, rabbitConnection]);

    console.log("All connections established successfully.");

    app.listen(PORT, () => {
      console.log(`Recipes service running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start the server due to connection errors:", error);
    process.exit(1);
  }
}

startServer();