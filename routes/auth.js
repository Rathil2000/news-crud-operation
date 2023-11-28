const express = require('express');
const router = express.Router();
const Register = require("../models/registerModel");
const { register, verifymail, forgotpassword, resetpassword, resetpassworduser } = require('../controllers/registerController');
const { login, logout } = require("../controllers/loginController")
const { body } = require("express-validator")

router.post('/register',
  body('email').optional().trim().isEmail(),
  body('password').optional().trim().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Please enter password alphanumeric, @special character and minimum 8 charcter'),
  body('mobile').optional().trim().matches(/^\d{10}$/).withMessage('Invalid mobile number')
  , register)
router.post('/login', login);
router.post('/logout', logout);
router.get('/mail-verification', verifymail);
router.post('/forget-password', forgotpassword)
router.get('/reset-password', resetpassword);
router.post('/reset-password', resetpassworduser);
module.exports = router;
