const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const ordersModel = require(sourcePath + '/models/orders');
const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');

const utility = require(sourcePath + '/lib/utility');
const ObjectId = mongoose.Types.ObjectId;



class Orders {
    constructor() {

    }


    addOrder(req, res) {
        console.log('here');
        var orders = new ordersModel();
        orders.quantity = req.body.quantity;
        orders.productId = req.body.product_id;
        orders.customerId = req.body.customer_id;
        orders.total = req.body.total_amount;
        orders.weight=req.body.weight



        orders.save((regErr,data)=>{
            if(regErr){
                if(regErr.code == 11000) {
                  var message = regErr.errmsg
                }
                return response.setResponse(res).validationError({},message);
            } else {
              return response.setResponse(res).success(data, 'Product added successfully');
            }
        });
    }


    getProducts(req, res) {
   
        const self = this;
        productModel.find({parent_id : null},{ parent_id:0 },(err,products)=>{
            if(err){
                return response.setResponse(res).internalError(err);
            }else {
                //var cat = categories.convertToJSON();
                return response.setResponse(res).success({products}, 'Product listing fetched successfully.');
            }
        });

    }

   
    
   


   
}

module.exports = new Orders();







