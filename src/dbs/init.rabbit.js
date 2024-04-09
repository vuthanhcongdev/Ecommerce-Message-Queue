'use strict'

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        if (!connection) throw new Error('Error connecting to RabbitMQ');

        const channel = await connection.createChannel();

        return { channel, connection };
    } catch (error) {
        console.error(error);
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ();

        // Publish message to a queue
        const queue = 'test_queue';
        const message = 'Hello World';

        await channel.assertQueue(queue, { durable: false });

        await channel.sendToQueue(queue, Buffer.from(message));

        console.log(`Message sent to queue: ${queue}`);
        await connection.close();
    } catch (error) {
        console.error(error);
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true });
        console.log(`Waiting for messages in queue: ${queueName}`);

        channel.consume(queueName, (message) => {
            console.log(`Received message from ${queueName}: ${message.content.toString()}`);
            /**
             * 1. find user following that SHOP
             * 2. send message to user
             * 3. yes, ok ==> success
             * 4. no, ok ==> failed
            */
        }, { noAck: true });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}