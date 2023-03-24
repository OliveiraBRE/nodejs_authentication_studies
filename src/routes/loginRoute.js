const route = require('express').Router();
const loginController = require('../controllers/loginController');

route.get('/signup', loginController.getSignup);

module.exports = route;