const express = require('express');
const authController = require('../controllers/auth');
const { body, validationResult, check } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',[ 
                body('email')
                .isEmail()
                .withMessage('Please Enter a valid email'),
                
                body(
                    'password',
                    'Please enter password with only numbers and text and atleast 5 characters')
                .isLength({min: 5})
                .isAlphanumeric(),

                body('confirmPassword')
                .custom((value, {req}) => {
                    if(value !== req.body.password){
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