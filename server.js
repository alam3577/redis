const express = require('express');
const Queue = require('bull');
const redis = require('redis');
const axios = require('axios');

const app = express();
require('./processor/index');
const redisClient = redis.createClient();

const myQueue = new Queue('myQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

app.get('/fetch', async (req, res) => {
  try {
    const {data} = await axios.get('https://jsonplaceholder.typicode.com/posts');
    data?.forEach((post, i) => {
      myQueue.add(
        { post },
        {attempts: 1}
        )
      .then(() => {
        if (data.length === i+1) {
          res.json({message: 'Job added to queue'});
        }
      }); 
    });
  } catch (error) {
    console.log({error});
  }
});

// Define a job to fetch the JSON API
// myQueue.process(async (job, done) => {
//   // console.log({job})
//   const apiUrl = job.data.url;
//   const response = await axios.get(apiUrl);
//   // console.log(response.data); // log the response to the console
// });

myQueue.on('global:completed', (job, result) => {
  console.log(`completed job`, {job: job, result: result});
})
// app.get('/fetch-data', async (req, res) => {
//   const {data} = await axios.get('https://jsonplaceholder.typicode.com/todos');
//   console.log({data})
//   data.forEach((user, i) => {
//     myQueue.add({user}).then(() => {
//       if (i+ 1 === data.length) {
//         res.json({mes: "All users added"});
//       }
//     })
//   });
//   // myQueue.add();
//   // res.send('Job added to queue');
// });

// async function fetchData() {
//   const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
//   console.log({response})
//   const data = await response.json();
//   await redisSetAsync('my-data-key', JSON.stringify(data));
//   return data;
// }

// myQueue.process(async (job) => {
//   // console.log({job})
//   const data = await job.data();
//   console.log({data: data?.user});
//   return data;
// });

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});