const route = require('express').Router();
const loginController = require('../controllers/loginController');

route.get('/signup', loginController.getSignup);
route.post('/signup', loginController.createUser);
route.get('/signin', loginController.getSignin);
route.get('/home', loginController.home);

module.exports = route;