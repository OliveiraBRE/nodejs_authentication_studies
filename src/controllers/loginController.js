module.exports = {
  getSignup(req, res, next) {
    res.render('signup', {
      pageTitle: 'Login'
    });
  }
}