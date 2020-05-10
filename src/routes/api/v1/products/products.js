const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const productModel = require(sourcePath + '/models/products');
const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');

const utility = require(sourcePath + '/lib/utility');
const ObjectId = mongoose.Types.ObjectId;



class Products {
    constructor() {

    }


    addToProducts(req, res) {
        console.log('here');
        var products = new productModel();
        products.name = req.body.name;
        products.image = req.body.image;
        products.description = req.body.description;
        products.price = req.body.price;
        products.categoryType = req.body.category_type;
        products.weight=req.body.weight;
        products.seller_id=req.body.sellerId;



        products.save((regErr,data)=>{
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

module.exports = new Products();







