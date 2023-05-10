const Queue = require('bull');
const redis = require('redis');
const axios = require('axios');
const path = require('path');

const redisClient = redis.createClient();

const myQueue = new Queue('myQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

myQueue.process(path.join(__dirname, 'sajjad.js'))