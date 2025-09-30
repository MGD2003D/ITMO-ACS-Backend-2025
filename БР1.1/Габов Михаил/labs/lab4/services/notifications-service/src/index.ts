import "dotenv/config";
import amqplib from 'amqplib';
import axios from 'axios';

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const RECIPES_SERVICE_URL = process.env.RECIPES_SERVICE_URL;

async function main() {
    console.log('[Notifications Service] Connecting to RabbitMQ...');
    try {
        if (!RABBITMQ_URL) {
        throw new Error('RABBITMQ_URL not defifned');
        }

        const connection = await amqplib.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        console.log('[Notifications Service] RabbitMQ connection successful!');

        const newRecipesQueue = 'new_recipe_events';
        const interactionsQueue = 'interactions_events';

        await channel.assertQueue(newRecipesQueue, { durable: true });
        await channel.assertQueue(interactionsQueue, { durable: true });

        channel.consume(newRecipesQueue, async (msg) => {
            if (msg) {
                const event = JSON.parse(msg.content.toString());
                try {
                    const userResponse = await axios.get(`${AUTH_SERVICE_URL}/users/${event.userId}`);
                    const username = userResponse.data.username;
                    console.log(`\nНОВЫЙ РЕЦЕПТ: Пользователь '${username}' выпустил новый рецепт: "${event.title}"!`);
                } catch (error) {
                    console.error("Failed to process new recipe event:", error);
                }
                channel.ack(msg);
            }
        });

        channel.consume(interactionsQueue, async (msg) => {
            if (msg) {
                const event = JSON.parse(msg.content.toString());
                if (event.type === 'LikeCreated') {
                    const { userId, recipeId } = event.data;
                    try {
                        const recipeResponse = await axios.get(`${RECIPES_SERVICE_URL}/recipes/${recipeId}`);
                        const recipeTitle = recipeResponse.data.title;
                        const authorId = recipeResponse.data.user.id;

                        const authorResponse = await axios.get(`${AUTH_SERVICE_URL}/users/${authorId}`);
                        const authorUsername = authorResponse.data.username;

                        console.log(`\nНОВЫЙ ЛАЙК: Пользователь (ID: ${userId}) поставил лайк на рецепт "${recipeTitle}" от автора '${authorUsername}'!`);
                    } catch (error) {
                        console.error("Failed to process like event:", error);
                    }
                }
                channel.ack(msg);
            }
        });

        console.log('[Notifications Service] Waiting for messages...');

    } catch (error) {
        console.error('[Notifications Service] Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
}

main();