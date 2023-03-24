const route = require('express').Router();

route.get('/', (req, res, next) => {
  res.render('login', {});
});

module.exports = route;