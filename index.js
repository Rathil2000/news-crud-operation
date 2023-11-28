const express = require("express");
const mongoose= require('mongoose');
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
dotenv.config();
const app=express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');

port=3000
app.listen(port,(req,res)=>{
    console.log(`server is running on port:${port}`);
});
app.use('/', authRoutes);
app.use('/crud', crudRoutes);



mongoose.connect("mongodb+srv://Rathil:cJe6U7k0m1qfR6AW@cluster0.fibw1dl.mongodb.net/news")