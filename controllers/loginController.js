const Register = require("../models/registerModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklist = [];
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(password);
    if (email && password) {
      const user = await Register.findOne({ email: email })
      console.log(user, 111);

      if (user != null) {
        // const isMatch = password === user.password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch, 2222);

        if (user.isEmailVerified == false) {
          res.send({ "status": "failed", "message": "Please Verify Your Mail" })
        }
        if ((user.email === email) && isMatch) {
          // Generate JWT Token
          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

          res.send({ "status": "success", "message": "Login Success", "token": token })
        } else {
          res.send({ "status": "failed", "message": "Email or Password is not Valid" })
        }
      } else {
        res.send({ "status": "failed", "message": "You are not a Registered User" })
      }
    } else {
      res.send({ "status": "failed", "message": "All Fields are Required" })
    }
  } catch (error) {
    console.log(error)
    res.send({ "status": "failed", "message": "Unable to Login" });
    return;
  }
}

const logout = (async (req, res) => {
  const token = req.headers.authorization;

  // Add the token to the blacklist
  await tokenBlacklist.push(token);

  res.json({ message: 'Logout successful' });
});
module.exports = { login, logout }