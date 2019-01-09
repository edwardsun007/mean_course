/* All login and SignUp API requests are here */
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // JWT package
const router = express.Router();

router.post("/signup", (req,res) => {
  bcrypt.genSalt(10, (err, salt)=>{
    if(err){
      console.log('genSalt err:',err);
    }else{
      console.log('got salt:',salt);
      bcrypt.hash(req.body.password, salt, (err, hash)=>{
        if(err){
          console.log('bcrypt hash has error:')
          res.status(500).json({
            error:err
          })
        }
        else{
          const user = new User ({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash
          });
          user.save( (err, user)=> {
            if(err){
              console.log('save user failed.')
              res.json({error: err});
            }else{
              res.json({message: "Created User", data:user});
            }
          })
        }
      })
    }
  });
})

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){
        return res.status(401).json({message: 'Authentication failed'});
      }
      // compare password
      bcrypt.compare(req.body.password, user.password, (err, result)=>{
        if(err){
          return res.status(401).json({message:'Auth Failed'});
        }
        if (!result){
          return res.status(401).json({message:'Auth Failed'});
        }
        if(result===true){ // authen ok, create token here
          const token = jwt.sign(
            {email: user.email, userId:user._id},
            'secret_usually_should_be_longer',
            { expiresIn: '1h' }
            ); // 1st argu is payload -- data that you want to send back to client side
          // NEVER put password in the payload to avoid Hacker !!!!
          // secret usually is some complicated random string to make sure the signature is uncrackable
          // expiresin 1h is good setting
          return res.status(200).json({
            token: token
          });// send back the token to client browser
        }
      })
    })
});

module.exports = router;
