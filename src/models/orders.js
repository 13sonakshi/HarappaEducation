const mongoose = require('mongoose')
const Double = require('@mongoosejs/double');


const Schema = mongoose.Schema;


var uniqueValidator = require('mongoose-unique-validator');

var SchemaTypes = mongoose.Schema.Types;

const ordersSchema = new mongoose.Schema({
  quantity: Number,
  product_id:{ type: SchemaTypes.ObjectId,},
  customer_id:{ type: SchemaTypes.ObjectId,},
  order_status: {
  	type : String,
  	enum : ['Accepted','Rejected','Dispatched','Delivered'] //Accepted/Rejected/Dispatched/Delivered
  },
  total_amount:Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});




module.exports = mongoose.model('Orders', ordersSchema);
