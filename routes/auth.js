const express = require('express');
const authController = require('../controllers/auth');
const { body, validationResult, check } = require('express-validator');
const User = require('../models/user');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
    '/login',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
      body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
    ],
    authController.postLogin
  );

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please Enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('User with same email already exists. Please Use another email to Signup');
                    }
                })
        }),

    body(
        'password',
        'Please enter password with only numbers and text and atleast 5 characters')
        .isLength({ min: 5 })
        .isAlphanumeric(),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password must match to password");
            }
            return true;
        })
],
    authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;