'use strict'

const { 
    connectToRabbitMQ,
    consumerQueue } = require('../dbs/init.rabbit');

const log = console.log;
console.log = function () {
    log.apply(console, [new Date()].concat(arguments));
}

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ(queueName);
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error('Error consume to queue: ', error);
        }
    },

    // case processing
    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ(queueName);

            const notificationQueue = 'notification_queue_process'; // assertQueue

            // const timeExpried = 15000;
            // setTimeout(() => {
            //     channel.consume(notificationQueue, (message) => {
            //         console.log(`Received message from ${notificationQueue}: ${message.content.toString()}`);
            //         channel.ack(message);
            //     });
            // }, timeExpried);

            channel.consume(notificationQueue, (message) => {
                try {
                    const numberTest = Math.random();
                    console.log('numberTest: ', numberTest);
                    if (numberTest < 0.5) {
                        throw new Error('Send notification error, HOT FIX NOW');
                    }

                    console.log(`Received message from ${notificationQueue}`, message.content.toString());
                    channel.ack(message);
                } catch (error) {
                    console.log(`Error processing message: ${error.message}`);
                    channel.nack(message, false, false);
                    /**
                     * nack: negative acknowledgment
                     * false (1): xem có cần phải đẩy lại vào queue trước đó hay sẽ đẩy vào queue dlx (true: cần, false: không cần)
                     * false (2): chỉ tin nhắn hiện tại, true: tất cả tin nhắn cùng lúc bị bỏ qua
                    */
                }
                
            });

        } catch (error) {
            console.error('Error consume to queue: ', error);
        }
    },

    // case failed processing
    consumerToQueueFail: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ(queueName);

            const notificationExchangeDLX = 'notification_exchange_dlx';
            const notificationRoutingKeyDLX = 'notification_routingkey_dlx';
            const notificationQueueHotfix = 'notification_queue_hotfix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });

            const queueResult = await channel.assertQueue(notificationQueueHotfix, { exclusive: false });

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);

            channel.consume(queueResult.queue, (msgFail) => {
                console.log(`This notification error: pls hot fix: ${msgFail.content.toString()}`);
            }, {
                noAck: true
            });
        } catch (error) {
            console.error('Error consume to queue: ', error);
            throw error;
        }
    }
}

module.exports = messageService;