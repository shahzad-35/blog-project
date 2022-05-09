const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: '',
    user:'',
    pass: '',
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  }
});


exports.getLogin = (req, res, next) => {
  var message = req.flash('error');
  message = message.length > 0 ? message[0]: null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(result => {
          if(result){
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        req.flash('error', 'User with same email already exists. Please Use another email to Signup');
        return res.redirect('/signup');
      } else {
        return bcrypt.hash(password, 12)
          .then(hash => {
            const newUser = new User({
              name: name,
              email: email,
              password: hash,
              cart: { items: [] }
            });
            return newUser.save();
          })
          .then(result => {
            let mailOptions = {
              from: process.env.MY_EMAIL,
              to: email,
              subject: 'Successful signed up.',
              text: 'Congratulations! You are successfully signed up.',
              html: '<h1>Welcome</h1><p>That was easy!</p>'
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            res.redirect('/login');
          });
      }
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getSignup = (req, res, next) => {
  var message = req.flash('error');
  message = message.length > 0 ? message[0]: null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};