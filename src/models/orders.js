const mongoose = require('mongoose')
const Double = require('@mongoosejs/double');


const Schema = mongoose.Schema;


var uniqueValidator = require('mongoose-unique-validator');

var SchemaTypes = mongoose.Schema.Types;

const ordersSchema = new mongoose.Schema({
  customer_id:{ type: SchemaTypes.ObjectId,},
  total_amount:Number,
  order_number:Number,
  order_date:{ type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});




module.exports = mongoose.model('Orders', ordersSchema);
