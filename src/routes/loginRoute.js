const route = require('express').Router();

route.get('/', (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login'
  });
});

module.exports = route;