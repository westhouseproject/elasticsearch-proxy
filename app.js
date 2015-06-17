import express from 'express';
import request from 'request';
import config from './config.json';

const app = express();

app.get('/data', (req, res) => {
  request({
    method: 'GET', url: config.elasticsearchUrl,
    body: JSON.stringify({
      aggs: {
        values: {
          date_histogram: {
            field: 'time',
            interval: '1M',
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