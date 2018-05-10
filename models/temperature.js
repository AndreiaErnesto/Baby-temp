let mongoose = require('mongoose');

// Temperature Schema
let temperatureSchema = mongoose.Schema({
  filho:{
    type: String,
    require: true
  },
  temperatura:{
    type: String,
    require: true
  },
  parente:{
    type: String,
    require: true
  }
});

let Temperature = module.exports = mongoose.model('Temperature', temperatureSchema);
