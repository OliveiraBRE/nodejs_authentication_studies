const route = require('express').Router();
const { check, body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const loginController = require('../controllers/loginController');
const User = require('../models/User');

route.get('/signup', loginController.getSignup);
route.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Email inválido')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email já cadastrado');
            }
          })
      }),

    body('password', 'Ao menos 6 caracteres')
      .isLength({ min: 6 }),

    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Senha não confere com a confirmação de senha');
        }

        return true;
      })
  ]
  , loginController.createUser);

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