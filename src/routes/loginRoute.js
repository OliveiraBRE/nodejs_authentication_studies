const route = require('express').Router();
const isAuth = require('../middleware/is-auth');
const loginController = require('../controllers/loginController');

route.get('/signup', loginController.getSignup);
route.post('/signup', loginController.createUser);
route.get('/signin', loginController.getSignin);
route.post('/login', loginController.postLogin);
route.get('/logout', loginController.getLogout);
route.post('/logout', loginController.getLogout);
route.get('/reset', loginController.getReset);
route.post('/reset', loginController.postReset);
route.get('/reset/:token', loginController.getNewPassword);
route.post('/new-password', loginController.postNewPassword);
route.get('/', isAuth, loginController.home);

module.exports = route;