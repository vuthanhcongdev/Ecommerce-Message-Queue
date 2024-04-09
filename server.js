'use strict'

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFail } = require('./src/services/consumerQueue.service');

const queueName = 'topic_queue';
// consumerToQueue(queueName).then(() => {
//     console.log(`Consumer started queue ${queueName}`);
// }).catch((error) => {
//     console.error('Error starting consumer: ', error);
// });

consumerToQueueNormal(queueName).then(() => {
    console.log(`Consumer started queue NORMAL`);
}).catch((error) => {
    console.error('Error starting consumer: ', error);
});

consumerToQueueFail(queueName).then(() => {
    console.log(`Consumer started queue FAIL`);
}).catch((error) => {
    console.error('Error starting consumer: ', error);
});
