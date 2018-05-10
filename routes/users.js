const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')

// Bring in User Models
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

//Register Process
router.post('/register',function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const token = jwt.sign({ username }, config.authentication.jwtSecret);

  req.checkBody('name', 'Insira o nome').notEmpty();
  req.checkBody('email', 'Insira o email').notEmpty();
  req.checkBody('email', 'Email inválido').isEmail();
  req.checkBody('username', 'Insira o nome de utilizador').notEmpty();
  req.checkBody('password', 'Insira a password').notEmpty();
  req.checkBody('password2', 'As passwords não são iguais').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password,
      token: token
    });
    console.log('Token:' +token);

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;

        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'Está registado, pode fazer log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login')
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Você já saiu da aplicação');
  res.redirect('/users/login');
});

module.exports = router;
