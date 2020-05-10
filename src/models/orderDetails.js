const mongoose = require('mongoose')
const Double = require('@mongoosejs/double');


const Schema = mongoose.Schema;


var uniqueValidator = require('mongoose-unique-validator');

var SchemaTypes = mongoose.Schema.Types;

const orderDetailsSchema = new mongoose.Schema({
  quantity: Number,
  product_id:{ type: SchemaTypes.ObjectId,},
  seller_id:{ type: SchemaTypes.ObjectId,},

  order_id:{ type: SchemaTypes.ObjectId,},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});




module.exports = mongoose.model('OrderDetails', orderDetailsSchema);
