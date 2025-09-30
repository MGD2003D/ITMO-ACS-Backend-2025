import amqplib, { Connection, Channel } from 'amqplib';

let connection: Connection | null = null;
let channel: Channel | null = null;

export async function initRabbitMQ(url: string): Promise<void> {

    console.log('Connecting to RabbitMQ...');
    try {
        connection = await amqplib.connect(url);
        console.log('RabbitMQ connection successful!');

        channel = await connection.createChannel();
        console.log('RabbitMQ channel created!');

        await channel.assertQueue('new_recipe_events', { durable: true });
        
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
}

export function getRabbitMQChannel(): Channel {
    if (!channel) {
        throw new Error('RabbitMQ channel has not been initialized. Call initRabbitMQ first.');
    }
    return channel;
}