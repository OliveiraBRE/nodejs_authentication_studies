const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  home(req, res, next) {
    if (!req.session.isLoggedIn) {
      return res.redirect('/signin');
    }

    res.render('home', {
      pageTitle: 'Home',
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user.email,
      csrfToken: req.csrfToken()
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
  },

  postLogin(req, res, next) {
    const { email, password } = req.body;

    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return res.redirect('/signup');
        }

        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(() => {
                res.redirect('/home');
              });
            }

            return res.redirect('/signin');
          })
          .catch(error => {
            console.error(error);
            res.redirect('/signin');
          })
      })
      .catch(error => console.error(error));
  },

  getLogout(req, res, next) {
    req.session.destroy(error => {
      if (error) console.error(error);

      res.redirect('/signin');
    })
  }
}