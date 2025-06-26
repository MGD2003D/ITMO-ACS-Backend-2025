import amqp from 'amqplib';
import 'dotenv/config';

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = +(process.env.RABBITMQ_PORT || 5672);
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'user';
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || 'password';

console.log('[RabbitMQ Config] RABBITMQ_HOST:', RABBITMQ_HOST);
console.log('[RabbitMQ Config] RABBITMQ_PORT:', RABBITMQ_PORT);
console.log('[RabbitMQ Config] RABBITMQ_USER:', RABBITMQ_USER);
console.log('[RabbitMQ Config] RABBITMQ_PASS:', RABBITMQ_PASS);

const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

console.log('[RabbitMQ Config] Constructed RABBITMQ_URL:', RABBITMQ_URL);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const connectRabbitMQ = async (retries = 5, delay = 5000) => {
    for (let i = 1; i <= retries; i++) {
        try {
            console.log(`[RabbitMQ] Attempting to connect (Attempt ${i}/${retries})...`);
            const connection = await amqp.connect(RABBITMQ_URL);

            connection.on('error', (err) => {
                console.error('[RabbitMQ] Connection error:', err);
            });
            connection.on('close', () => {
                console.warn('[RabbitMQ] Connection closed.');
            });

            const channel = await connection.createChannel();
            channel.on('error', (err) => {
                console.error('[RabbitMQ] Channel error:', err);
            });
            channel.on('close', () => {
                console.warn('[RabbitMQ] Channel closed.');
            });

            console.log('Connected to RabbitMQ');
            return { connection, channel };

        } catch (error) {
            console.error(`[RabbitMQ] Connection attempt ${i} failed.`, error);
            if (i < retries) {
                console.log(`[RabbitMQ] Retrying in ${delay / 1000} seconds...`);
                await sleep(delay);
            } else {
                console.error('[RabbitMQ] All connection attempts failed.');
                throw error;
            }
        }
    }
    throw new Error('Failed to connect to RabbitMQ after all retries.');
};