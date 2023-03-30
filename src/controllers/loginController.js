const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  home(req, res, next) {
    res.render('home', {
      pageTitle: 'Home',
      isLoggedIn: true
    });
  },

  getSignup(req, res, next) {
    res.render('signup', {
      pageTitle: 'SignUp',
      isLoggedIn: false,
      invalidEmail: false,
      invalidPassword: false
    });
  },

  getSignin(req, res, next) {
    res.render('signin', {
      pageTitle: 'SignIn',
      isLoggedIn: false,
      invalidEmail: false,
      invalidPassword: false
    });
  },

  createUser(req, res, next) {
    const { email, password, confirmPassword } = req.body;
    User.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
          return res.redirect('/signin');
        }
        return bcrypt.hash(password, 12)
          .then(hashedPassword => {
            if (password === confirmPassword) {
              const user = new User({
                email: email,
                password: hashedPassword
              })
              return user.save();
            } else {
              return res.render('signup', {
                pageTitle: 'SignUp',
                isLoggedIn: false,
                invalidEmail: false,
                invalidPassword: true
              });
            }
          })
          .then(() => {
            res.redirect('/signin');
          })
      })
      .catch(error => {
        console.error(error);
      })
  }
}