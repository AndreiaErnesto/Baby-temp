const mongoose = require('mongoose');

// User schema
let userSchema = mongoose.Schema({
  name:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  username:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require: true
  }
});

const User = module.exports = mongoose.model('User', userSchema);
