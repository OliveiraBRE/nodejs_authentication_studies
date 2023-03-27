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
  }
}