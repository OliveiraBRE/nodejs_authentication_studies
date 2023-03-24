const route = require('express').Router();

route.get('/', (req, res, next) => {
  res.send('<h1>Hello World</h1>');
  res.end();
});

module.exports = route;