import express from 'express';
import request from 'request';
import config from './config.json';

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const cache = {};

app.use((req, res) => {
  const { path } = req;
  const preQuery = req.query.query;
  const query = new Buffer(preQuery, 'base64').toString();
  const toCache = `${path}${preQuery}`;
  try {
    request({
      method: 'GET', url: `${config.elasticsearchHost}/${path}`,
      body: query
    }, function (err, response) {
      res.set('Content-Type', 'application/json');

      if (err) {
        if (!cache[toCache]) {
          res.status(500).send({error: err.message});
          return;
        }

        res.send(cache[toCache]);
        return;
      }

      if (response.statusCode > 399) {
        if (!cache[toCache]) {
          res.status(response.statusCode);
          res.send(response.body);
          return;
        }

        res.send(cache[toCache]);
        return;
      }

      cache[toCache] = response.body;
      res.send(response.body);
    });
  } catch (e) {
    if (!cache[toCache]) {
      res.status(500).send({error: e.message});
      return;
    }

    res.send
  }
});

app.listen(config.port, function () {
  console.log(this.address());
});
