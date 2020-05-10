const mongoose = require('mongoose')
const Double = require('@mongoosejs/double');


const Schema = mongoose.Schema;


var uniqueValidator = require('mongoose-unique-validator');

var SchemaTypes = mongoose.Schema.Types;

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  phone_number: {
    type: String,
    trim: true,
  },
  image : String,
  category_type: {
  	type : String,
  	enum : ['Books','fashion','Electronics']
  },
  
  description : String,
  Price : Number,
  weight : Number,

  
  is_active : {
  	type : Boolean,
  	default : false
  },
  
  seller_id : { type: SchemaTypes.ObjectId,},
 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});




module.exports = mongoose.model('Products', productsSchema);
