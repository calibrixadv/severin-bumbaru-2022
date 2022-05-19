require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const { dirname } = require('path');
const helmet = require('helmet');
const { getSystemErrorMap } = require('util');
const jwt=require('jsonwebtoken')

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const User = require('./public/model/user')
const Faculty = require('./public/model/faculty')


//start

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//database

mongoose.connect('mongodb://127.0.0.1/login-app-db').then(() => {
    console.log("connected to database");
}).catch(err=>console.log(err))



//POST METHODS
app.post('/api/change-password', async (req, res) => {
  const { token, newpassword:plainTextPassword } = req.body
  try {
    const user = jwt.verify(token, process.env.SECRET_TOKEN)
    const _id = user.id
    const password = await bcrypt.hash(plainTextPassword, 10)
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
      return res.json({ status: 'error', error: 'Invalid password' })
    }
    if (plainTextPassword.length < 5) {
      return res.json({ status: 'error', error: 'Password too small!(Min 5 characters)' })
    }
    if(bcrypt.compare(password,User.password)){
      return res.json({ status: 'error', error: 'The new password cannot be the old one!' })
    }
    await User.updateOne({ _id },
      {
        $set: { password }
      }
    )
    res.json({status:'ok'})
  } catch (error) {
    res.json({ status: 'error', error: 'Invalid token!' })
    console.log('error')
  }
})

app.post('/api/search-data', async(req,res)=>{
  const Name=req.body.Name
  const fac = await Faculty.findOne({Name}).lean()
  if(!fac) return res.json({status:'error',error:'Unable to find Faculty'})
  return res.json({status:'ok',data:fac})
})

app.post('/api/login', async(req,res)=>{

  const {username,password}=req.body

  const user=await User.findOne({username}).lean()

  if(!user){
    return res.json({status:'error',error:'Invalid username/password'})
  }

  if(await bcrypt.compare(password,user.password)){
    const token=jwt.sign({
      id:user._id,
      username:user.username
    }, process.env.SECRET_TOKEN)
    return res.json({status:'ok',data:token})
  }
  return res.json({status:'error', error:'Invalid username/password'})
})

app.post('/api/register', async (req, res) => {

  //hashing
  const { username,email ,password: plainTextPassword } = req.body
  
  if(!username || typeof username!=='string'){
    return res.json({status:'error', error:'Invalid username'})
  }

  if(!plainTextPassword || typeof plainTextPassword !=='string'){
    return res.json({status:'error', error:'Invalid password'})
  }
  if(plainTextPassword.length<5){
    return res.json({status:'error', error:'Password too small!(Min 5 characters)'})
  }
  const password = await bcrypt.hash(plainTextPassword , 10)

  try {
    const response=await User.create({
      username,
      email,
      password
    })
    console.log("new user",response)
  } catch (error) {
    if(error.code==11000){
      return res.json({ status: 'error',error: 'Username/Email already in use'})
    }
    throw error
  }
  res.json({ status: 'ok' })
})

//get methods
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/main.html"));
})
router.get("/cv", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/res/cv.html"));
})
router.get("/detail", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/res/detail.html"));
})
router.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/res/home.html"));
})
router.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/login/login.html"));
})
router.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/register/register.html"));
})
router.get("/change-pass", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/change-pass/change-password.html"));
})
router.get("/about-us", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/res/about-us.html"));
})
router.get("/contact-us", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/api/res/contact-us.html"));
})
//security

app.use(helmet.xssFilter()); //input clear
app.use(helmet.hidePoweredBy());//hide express
app.use(helmet.noSniff()); //remove snif
app.use(helmet.ieNoOpen()); //no dwnl	
app.use(helmet.hsts({maxAge:90*24*3600, force:true}));  ///https for maxAge time
app.use(helmet.dnsPrefetchControl()); //-performanance + security
app.use(helmet.contentSecurityPolicy({directives:
  {
    defaultSrc:["'self'"],
    scriptSrc:["'self'","https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js","https://polyfill.io/v3/polyfill.min.js","https://*.googleapis.com","https://*.gstatic.com","*.google.com","*.googleusercontent.com","https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"],
    fontSrc:["'self'","fonts.gstatic.com"], 
    styleSrcElem:["'self'","https://fonts.googleapis.com","'unsafe-inline'"],
    styleSrc:["'self'","'unsafe-inline'"],
    frameSrc:["'self'","*.google.com"],
    connectSrc:["'self'","https://*.googleapis.com","*.google.com","https://*.gstatic.com"],
    imgSrc:["'self'","data:","blob:","*.googleapis.com","maps.google.com","maps.gstatic.com","www.gstatic.com","*.ggpht.com"]
  }}));
app.use('/', router);
app.listen(2119);
console.log('Running at Port 2119');