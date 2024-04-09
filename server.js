'use strict'

const { consumerToQueue } = require('./src/services/consumerQueue.service');

const queueName = 'topic_queue';
consumerToQueue(queueName).then(() => {
    console.log(`Consumer started queue ${queueName}`);
}).catch((error) => {
    console.error('Error starting consumer: ', error);
});
