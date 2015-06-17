import express from 'express';
import request from 'request';
import config from './config.json';

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/data', (req, res) => {
  request({
    method: 'GET', url: config.elasticsearchUrl,
    body: JSON.stringify({
      aggs: {
        values: {
          date_histogram: {
            field: 'time',
            interval: '1d',
            format: 'yyyy-MM-dd'
          },
          aggs: {
            consumption: {
              avg: { 'field': 'value' }
            }
          }
        }
      }
    })
  }).pipe(res);
});

app.listen(config.port, function () {
  console.log(this.address());
});