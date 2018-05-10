const express = require('express');
const router = express.Router();

// Bring in temperature Models
let Temperature = require('../models/temperature');
// Bring in user Models
let User = require('../models/user');

// Add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_temperature', {
    title:'Adicionar temperatura'
  });
});

// Add Submit POST route
router.post('/add', function(req, res){
  req.checkBody('filho','Insira o filho').notEmpty();
  req.checkBody('temperatura','Insira a temperatura').notEmpty();
  //req.checkBody('parente','Insira o parente').notEmpty();

  // Get Errord
  let errors = req.validationErrors();

  if(errors) {
    res.render('add_temperature', {
      title:'Adicionar temperatura',
      errors:errors
    });
  } else {
    let temperature = new Temperature();
    temperature.filho = req.body.filho;
    temperature.temperatura = req.body.temperatura;
    temperature.parente = req.user._id;

    temperature.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Temperatura adicionada');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:filho', ensureAuthenticated, function(req, res){
  Temperature.findById(req.params.filho, function(err, temperature){
    if(temperature.parente != req.user._id){
      req.flash('danger', 'Não autorizado');
      req.redirect('/');
    }
    res.render('edit_temperature', {
      title:'Editar temperatura',
      temperature:temperature
    });
  });
});

// Update Submit POST route
router.post('/edit/:id', function(req, res){
  let temperature = {};
  temperature.filho = req.body.filho;
  temperature.temperatura = req.body.temperatura;
  temperature.parente = req.user._id;

  let query = {_id:req.params.id}

  Temperature.update(query, temperature, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Temperatura alterada.');
      res.redirect('/');
    }
  });
});

// Delete a temperature
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Temperature.findById(req.params.id, function(){
    if(temperature.parente != req.user._id){
      res.status(500).send();
    } else {
      Temperature.remove(query, function(err){
        if(err){
        console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get single temperature
router.get('/:id', function(req, res){
  Temperature.findById(req.params.id, function(err, temperature){
    User.findById(temperature.parente, function(err, user){
      res.render('temperature', {
        temperature:temperature,
        parente: user.name
      });
    });
  });
});

//Access controls
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Faça login por favor.');
    res.redirect('/users/login');
  }
}

module.exports = router;
