const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const sellersModel = require(sourcePath + '/models/sellers');
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
    


   

   
    
   


   
}

module.exports = new Sellers();







