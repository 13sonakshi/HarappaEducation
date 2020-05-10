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
    
   
    updateProfile(req, res) {

      var user_id = req.body.id;
      var password = req.body.password;
      var new_password = req.body.new_password;
      var phone_number = req.body.phone_number;
      var email = req.body.email;
      var date_joined = req.body.date_joined;
      var image = req.body.image;
      var country_code = req.body.country_code;
      //console.log(req);

      userModel.findById(user_id).then((result) => {
          if (!result) {
              return response.setResponse(res).authenticationFailed();
          } else {
              if (password == '' || new_password == '') {
                  const save_data = {
                      //password: bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10)),
                      updated_at: date_joined,
                      phone_number: phone_number,
                      email: email,
                      image: image,
                      country_code: country_code,
                      user_credits: 0,

                  }
                //  console.log('here' + save_data);


                  userModel.findByIdAndUpdate(user_id, { $set: save_data }, { new: true, upsert: true }, (err, doc) => {
                      if (err) {
                          console.log(err);
                          return response.setResponse(res).internalError(err);
                      } else {

                          // var rec = doc.convertToJSON();
                          return response.setResponse(res).success({}, 'Profile updated successfully');

                      }
                  });

              } else {
                  //console.log(req);
               //   console.log('here to match passwrd');
                //  console.log(req.body.password);
                  //var password1 = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

                  result.comparePassword(req.body.password, function (err, isMatch) {
                      if (err) {
                     //     console.log(err + "here cccin else");
                          return response.setResponse(res).internalError(err);
                      } else if (isMatch) {
                      //    console.log('match found');
                          const save_data = {
                              password: bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10)),
                              updated_at: date_joined,
                              phone_number: phone_number,
                              email: email,
                              image: image,
                              country_code: country_code,
                              user_credits: 0,


                          }
                      //    console.log('here' + save_data);


                          userModel.findByIdAndUpdate(user_id, { $set: save_data }, { new: true, upsert: true }, (err, doc) => {
                              if (err) {
                               //   console.log(err);
                                  return response.setResponse(res).internalError(err);
                              } else {

                                  //   var rec = doc.convertToJSON();
                                  return response.setResponse(res).success({}, 'Profile updated successfully');

                              }
                          });
                      } else {
                          return response.setResponse(res).failure({ old_password_matched: false }, 'The password you entered is incorrect.')
                      }
                  });
              }
              //console.log('user found');   


          }
      });


  }


   
}

module.exports = new Sellers();







