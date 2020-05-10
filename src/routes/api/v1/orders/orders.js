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
        orders.customerId = req.body.customerId;
        orders.save((regErr,data)=>{
            if(regErr){
                if(regErr.code == 11000) {
                  var message = regErr.errmsg
                }
                return response.setResponse(res).validationError({},message);
            } else {
                

                if (req.body.products_array !== "") {
                    saveProductsByUser(req.body.products_array,data._id,req.body.customerId).then( async (res) => {
                        if (res == true) {
                            

                        }else{

                        }

                    });   


                    return response.setResponse(res).success(data, 'Order placed successfully');

      
                 }
            }
        });
    }


   

   
    
   


   
}

/* Initialize and invoke a the saveAnimalByUser function
to save animals data for user in animal_space_model.
*/



function saveProductsByUser(product_array, order_id,customer_id) {
console.log(customer_id);
    return new Promise(function (resolve, reject) {
    var data = JSON.parse(JSON.stringify(product_array));
    for ( var i = 0; i < data.length; i++) {
      data[i].order_id = order_id;
      data[i].customer_id = customer_id;

    }
  
    console.log(data);
    ordersDetailModel.insertMany(data).then((res) => {

        // var message = "Dear new Harppa Seller, <br/><br/>.You have received new order";
        //                   var subject = "Harppa Welcome !";
        //                   sendMails(res.sellerId, subject, message);
        
        
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







