import express from 'express';
import request from 'request';
import config from './config.json';

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use((req, res) => {
  const { path } = req;
  const query = new Buffer(req.query.query, 'base64').toString();
  request({
    method: 'GET', url: `${config.elasticsearchHost}/${path}`,
    body: query
  }).pipe(res);
});

app.listen(config.port, function () {
  console.log(this.address());
});
