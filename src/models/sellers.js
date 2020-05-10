const mongoose = require('mongoose')
const Double = require('@mongoosejs/double');

var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;


var uniqueValidator = require('mongoose-unique-validator');

var SchemaTypes = mongoose.Schema.Types;

const sellersSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
 
  phone_number: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    sparse: true
  },
  image : String,  
  address : String,

  app_notifications : {
  	type : Boolean,
  	default : true
  },
 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Sellers', sellersSchema);
