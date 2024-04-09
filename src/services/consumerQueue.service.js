'use strict'

const { 
    connectToRabbitMQ,
    consumerQueue } = require('../dbs/init.rabbit');

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ(queueName);
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error('Error consume to queue: ', error);
        }
    }
}

module.exports = messageService;