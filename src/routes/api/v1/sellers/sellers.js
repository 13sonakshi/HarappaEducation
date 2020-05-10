const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const sellersModel = require(sourcePath + '/models/sellers');
const ordersDetailModel = require(sourcePath + '/models/orderDetails');

const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');

const utility = require(sourcePath + '/lib/utility');
const ObjectId = mongoose.Types.ObjectId;



class Sellers {
    constructor() {

    }


    addSellers(req, res) {
        console.log('here');
        var seller = new sellersModel();
        seller.name = req.body.name;
        seller.email = req.body.email;
        seller.phone_number = req.body.phone;
      


        seller.save((regErr,data)=>{
            if(regErr){
                if(regErr.code == 11000) {
                  var message = regErr.errmsg
                }
                return response.setResponse(res).validationError({},message);
            } else {
              return response.setResponse(res).success(data, 'seller added successfully');
            }
        });
    }
    


   

    getSellerOrders(req, res) {
      console.log(req.query.id);
        var seller_id = req.query.id;
        ordersDetailModel.find({seller_id :ObjectId(seller_id)})
  .then(async (result) => {

                if (!result) {
                 
                  return response.setResponse(res).validationError({},'No new order found!');
                } else {
                    // let user_data = result.convertToJSON();
                    // user_data._id = req.query.id;
                  return response.setResponse(res).success(result);
                }
            });

    }
    
   
    updateSubOrderStatus(req, res) {

      var seller_id = req.body.sellerId;
      var subOrderId = req.body.subOrderId;
      var status = req.body.status;
     
      const save_data = {

      order_status: status,
       

    }

            ordersDetailModel.findByIdAndUpdate(subOrderId, { $set: save_data }, { new: true, upsert: true }, (err, doc) => {
                              if (err) {
                                  return response.setResponse(res).internalError(err);
                              } else {

                                  //   var rec = doc.convertToJSON();
                                  return response.setResponse(res).success({}, 'Status updated successfully');

                              }
                          });
                      
                  
             
    

  }


   
}

module.exports = new Sellers();







