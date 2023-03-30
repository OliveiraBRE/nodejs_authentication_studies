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
      isLoggedIn: false
    });
  },

  createUser(req, res, next) {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    })
    user.save()
    .then(() => {
      res.redirect('/home');
    })
    .catch(() => console.error(error));
  }
}