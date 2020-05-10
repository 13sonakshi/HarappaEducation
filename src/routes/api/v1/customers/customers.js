const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const customerModel = require(sourcePath + '/models/customers');
const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');

const utility = require(sourcePath + '/lib/utility');
const ObjectId = mongoose.Types.ObjectId;



class Customers {
    constructor() {

    }


    addCustomers(req, res) {
        console.log('here');
        var customer = new customerModel();
        customer.name = req.body.name;
        customer.email = req.body.email;
        customer.phone_number = req.body.phone;
      


        customer.save((regErr,data)=>{
            if(regErr){
                if(regErr.code == 11000) {
                  var message = regErr.errmsg
                }
                return response.setResponse(res).validationError({},message);
            } else {
              return response.setResponse(res).success(data, 'customer added successfully');
            }
        });
    }


   

   
    
   


   
}

module.exports = new Customers();







