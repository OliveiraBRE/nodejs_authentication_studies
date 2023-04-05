const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2802138433dd94",
    pass: "0cfb75757ceff6"
  }
});

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
          .catch(error => console.error(error));
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
                res.redirect('/');
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
  },

  getReset(req, res, next) {
    res.render('reset', {
      pageTitle: 'Reset',
      isLoggedIn: false,
      invalidEmail: false
    })
  },

  postReset(req, res, next) {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        res.redirect('/reset');
      }

      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            return res.render('reset', {
              pageTitle: 'Reset',
              isLoggedIn: false,
              invalidEmail: true
            });
          }

          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(user => {
          transport.sendMail({
            from: 'dev.bruno.b3w@gmail.com',
            to: req.body.email,
            subject: "Reset de Senha",
            html: `
               <!doctype html>
               <html>
                 <head>
                   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 </head>
                 <body style="font-family: sans-serif;">
                   <p>Você solicitou reset de senha</p>
                   <p>Clique neste <a href="http://192.168.100.51:9909/reset/${token}">link</a> para cadastrar uma nova senha</p>
                 </body>
               </html>
            `
          });
        })
        .then(() => {
          res.redirect('/signin');
        })
        .catch(error => console.error(error));
    })
  },

  getNewPassword(req, res, next) {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        res.render('new-password', {
          pageTitle: 'Nova Senha',
          userId: user._id.toString(),
          passwordToken: token,
          isLoggedIn: false
      });
      })
      .catch(error => console.error(error));
  },

  postNewPassword(req, res, next) {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then(() => {
      res.redirect('/signin');
    })
    .catch(error => console.error(error));

  }
}