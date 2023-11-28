const Register = require("../models/registerModel");
const password_reset = require("../models/password_resetModel");
const multer = require('multer')
const path = require('path')
const randomstring = require('randomstring');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const sendMail = require("../helpers/sendMail")
const { body,validationResult } = require('express-validator');

// Validation middleware
const validateEmail = body('email').isEmail().withMessage('Invalid email address');
const validatePassword = body('password').matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage('Please enter password alphanumeric, @special character and minimum 8 charcter');
const validateMobile = body('mobile').matches(/^\d{10}$/).withMessage('Invalid mobile number');


const register = async (req, res) => {
  try {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // If validation passes, you can handle the registration logic here
  const { email, password, mobile } = req.body;

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    const randomToken = randomstring.generate();
    token = randomToken;

    data = new Register({
      userName: req.body.userName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: secPassword,
    });
  


    const existingUser = await Register.findOne({ email: data.email });
    const existingUserWithMobileNumber = await Register.findOne({ mobile: data.mobile });

    if (existingUser) {
      return res.status(400).json({ message: 'User registration failed', errors: [{ param: 'email', msg: 'Email is already taken' }] });
    }

    if (existingUserWithMobileNumber) {
      return res.status(400).json({ message: 'User registration failed', errors: [{ param: 'mobileNumber', msg: 'Mobile number is already taken' }] });
    }

    // var token = { token: randomToken }

    const User = Register.create(data);
    console.log(data.email, 1112222);
    const saved_user = await Register.find({ email: data.email });
    console.log(saved_user, 11111);
    const authToken = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
    let mailSubject = "Mail Verification";

    let content = '<p>Hii ' + req.body.userName + ', \
  Please <a href="http://localhost:3000/mail-verification?token='+ randomToken + '"> Verify</a> your Mail.';
    sendMail(req.body.email, mailSubject, content);

    const { confirmPassword } = req.body
    const isMatch = password === confirmPassword
    console.log(isMatch);
    if (isMatch) {
      res.status(201).send({ "status": "success", "message": "Registration Success", "token": token, "authToken": authToken })
    } else {
      res.send({ "status": "failed", "message": "Password is not match" })
    }
  } catch (error) {

    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const verifymail = async (req, res) => {
  try {



    const user = await Register.updateOne(
      { token: token },
      { $set: { isEmailVerified: true } },
      { new: true }
    );
    console.log(user, 11111);
    if (!user) {
      return res.status(404).json({ message: 'User not found or invalid token' });
    }

    return res.render('mail-verification', { message: 'email verify sucessfully..' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  const data = await Register.find({
    where: {
      token: token
    }
  })
  console.log(data, 22222);
  if (data) {
    var token = { token: 'null' }
    const result = await Register.updateOne(token, { where: { Id: data.id } })
    console.log(result, 333333);
    return res.render('mail-verification', { message: 'email verify sucessfully..' });
  } else {
    return res.render('404')
  }
}

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email, 111);
    // const {error} = schemaauth.forgetpassword.validate(req.body);
    data = new Register({
      userName: req.body.userName,
      email: req.body.email,
    });

    var data = await Register.find({  email: data.email  })
    console.log(data, 2222);

    if (data) {
      let email = req.body.email;
      
      let mailsubject = 'forget password';
      let token = randomstring.generate();
      console.log(data[0].userName, 1111);
      let content = '<p> heyy, ' + data[0].userName + '\
      please <a href = "http://localhost:3000/reset-password?token='+ token + '"> Click Here </a> To Reset Password';
      sendMail(email, mailsubject, content)
      const result = await password_reset.create({ email, token })
      console.log(result, 12313131);
      // const deleteuser = await password_reset.destroy({ where: { email: email } })

      res.status(200).send({ sucess: "true", message: "mail send successfully for reset password..." })
    }
    else {
      res.status(401).send({ sucess: "false", message: "email does not exist" })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: "something wrong" })
  }
}


const resetpassword = async (req, res) => {
  try {
    var token = req.query.token;
    console.log(token);
    if (token) {
      // const result = await password_reset.find({ where: { token: token } })
      result = {
        email: "rathilthummar@gmail.com",
        token: "avBweL5622SUWHmt8cmrz1PcO0jTgr6S"
      }
      console.log(result, 1221212);
      let resultLength = 0;
      if (result !== null && typeof result === 'object') {
        resultLength = Object.keys(result).length;

      } else {
        console.error('Invalid object:', result);
      }

      console.log("email is ", result.email);
      if (resultLength > 0) {
        // const data = await password_reset.findOne({ where: { email: result.email } })
        data = {
          email: "rathilthummar@gmail.com",
          token: "avBweL5622SUWHmt8cmrz1PcO0jTgr6S"
        }
        console.log(data, 12121);
        res.render('reset-password', { user: data })
      } else {
        res.status(400).render('404')
      }
    } else {
      res.render('404')
    }

  } catch (error) {
    console.log(error);
  }
}

const resetpassworduser = async (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.render('reset-password', { error_message: "Password Not Match..", user: { id: req.body.user_id, email: req.body.email } })   //pass user value 
  } else {
    // const password = bcrypt.hash(req.body.confirm_password,10,async (err,hash)=>{
    // if (err){
    //   console.log(err);
    // }
    //const tokendelete = await password_resets.destroy({where:{email:req.body.email}})  //delete token from password_reset

    try {
      console.log(req.body.confirm_password, 111111111);
      const hashpassword = await bcrypt.hash(req.body.confirm_password, 10);
      console.log(hashpassword, 111111111111111);
      //var password = req.body.confirm_Password
      const email = req.body.email;
      console.log(email);
      const userupdate = await Register.updateOne({ email: email }, { $set: { password: hashpassword } });
      console.log(userupdate, 444444);
      if (userupdate.acknowledged == true) {
        res.render('message', { message: 'password reset successfully..' })
      } else {
        res.render('message', { message: 'somthing went wrong..' })
      }
    }
    catch (error) {
      console.error("Error:", error);
      res.render('message', { message: 'An error occurred.' });
    }
  }
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000' },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname))

    if (mimeType && extname) {
      return cb(null, true)
    }
    cb('Give proper files formate to upload')
  }
}).single('image')

module.exports =
{
  validateEmail,
  validatePassword,
  validateMobile,
  register,
  verifymail,
  forgotpassword,
  resetpassword,
  resetpassworduser,
  upload,
}