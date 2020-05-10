const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const ordersModel = require(sourcePath + '/models/orders');
const ordersDetailModel = require(sourcePath + '/models/orderDetails');

const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');

const utility = require(sourcePath + '/lib/utility');
const ObjectId = mongoose.Types.ObjectId;



class Orders {
    constructor() {

    }


    addOrders(req, res) {
        console.log('here');

        var orders = new ordersModel();
        orders.order_number= Math.floor(Math.random() * 10);
        orders.customerId = req.body.customer_id;
        orders.save((regErr,data)=>{
            if(regErr){
                if(regErr.code == 11000) {
                  var message = regErr.errmsg
                }
                return response.setResponse(res).validationError({},message);
            } else {
                

                if (req.body.products_array !== "") {
                    saveProductsByUser(req.body.products_array, data._id, req.body.customer_id).then( async (res) => {
                        if (res == true) {
                            console.log('success');

                        }else{

                        }

                    });   
                    return response.setResponse(res).success(data, 'Product added successfully');
      
                 }
            }
        });
    }


   

   
    
   


   
}

/* Initialize and invoke a the saveAnimalByUser function
to save animals data for user in animal_space_model.
*/



function saveProductsByUser(product_array, order_id, customer_id) {
    //console.log(product_array);

    return new Promise(function (resolve, reject) {


    var data = JSON.parse(JSON.stringify(product_array));
    console.log(data+"heyyy");
    for ( var i = 0; i < data.length; i++) {
      data[i].order_id = order_id;
      data[i].customer_id = customer_id;
    }
  
  console.log(data);
  
    ordersDetailModel.insertMany(data).then((res) => {
        resolve(true);
    //  console.log('success in saving products');
    })
      .catch((err) => {
        reject(false);
      //  console.log(err);
      });
  
    });
  
  }


module.exports = new Orders();







