const route = require('express').Router();
const isAuth = require('../middleware/is-auth');
const loginController = require('../controllers/loginController');

route.get('/signup', loginController.getSignup);
route.post('/signup', loginController.createUser);
route.get('/signin', loginController.getSignin);
route.post('/login', loginController.postLogin);
route.post('/logout', loginController.getLogout);
route.get('/home', isAuth, loginController.home);

module.exports = route;