const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "thisisasamplesecret";
const Register = require("../models/registerModel")
const auth = (req,res,next)=>{
  try{
    let token = req.headers.authorization;

    if(token){
      token= token.split(" ")[1];
      let decodedToken   = jwt.verify(token, JWT_SECRET_KEY);
   
      req.user_Id  =decodedToken.user_id;
    }else{
      res.status(401).json({message: "Unauthorized User"});
    }
    next();
  }catch(error){
    console.log(error);
    res.status(401).json({message: "Unauthorized User"})
  }
}

module.exports = auth;