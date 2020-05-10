const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const userModel = require(sourcePath + '/models/users');
const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const utility = require(sourcePath + '/lib/utility');
const ObjectId = mongoose.Types.ObjectId;



class User {
    constructor() {

    }


    /***************************************************************************************************************************************************************/
    /************************************************************************ /api/v1/changePassword ************************************************************************/
    /**
     * @api {post} /changePassword changePassword
     * @apiHeader {String} Authorzation Beare tokenString
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/changePassword/
     * @apiGroup User
     * @apiName changePassword
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      password         Password(OLD) string
     * @apiParam (Expected parameters) {String}      new_password     New Password string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/
    changePassword(req, res) {
        if (!req.body.password) {
            return response.setResponse(res).invalidRequest('password is required.');
        } else if (!req.body.new_password) {
            return response.setResponse(res).invalidRequest('new password is required.');
        } else {
            var user_id = req.user.id;
            userModel.findById(user_id).then((user) => {
               // console.log(user);
                if (!user) {
                    return response.setResponse(res).authenticationFailed();
                } else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (err) {
                            return response.setResponse(res).internalError(err);
                        } else if (isMatch) {
                            const save_data = {
                                password: bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10)),
                            }
                            userModel.update({ _id: user_id }, { $set: save_data }, (err, doc) => {
                                if (err) {
                                    return response.setResponse(res).internalError(err);
                                } else {
                                    return response.setResponse(res).success({}, 'Password changed successfully');
                                }
                            });
                        } else {
                            return response.setResponse(res).failure({ old_password_matched: false }, 'The password you entered is incorrect.')
                        }
                    });
                }

            });
        }
    }

    func() {
      //  console.log('IN HERE');
    }








    /***************************************************************************************************************************************************************/
    /************************************************************************ /api/v1/updateProfile ************************************************************************/
    /**
     * @api {post} /updateProfile updateProfile
     * @apiHeader {String} Authorzation Beare tokenString
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/updateProfile/
     * @apiGroup User
     * @apiName updateProfile
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      name             Name string
     * @apiParam (Expected parameters) {String}      email            Email(OLD) string
     * @apiParam (Expected parameters) {String}      password         Password string
     * @apiParam (Expected parameters) {String}      image            image string
     * @apiParam (Expected parameters) {String}      gender           Gender string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/


     
    updateProfile(req, res) {

        // var user_id = req.user.id;
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


 



    updateUserSettings(req,res){
        var  user_id =req.body.user_id;
        var status = req.body.status;
        console.log(status);
        console.log(' update status for push');

        userModel.findByIdAndUpdate(user_id, { 'app_notifications': status }, { new: true, upsert: true },async  (err, doc) => {
            if (err) {
                console.log(err);
                return response.setResponse(res).internalError(err);

            } else {
                return response.setResponse(res).success({}, 'Settings updated successfully');


               
            }
        });

    }

    /***************************************************************************************************************************************************************/
    /************************************************************************ /api/v1/modifyProfile ************************************************************************/
    /**
     * @api {post} /modifyProfile modifyProfile
     * @apiHeader {String} Authorzation Beare tokenString
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/modifyProfile/
     * @apiGroup User
     * @apiName modifyProfile
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      name             Name string
     * @apiParam (Expected parameters) {String}      email            Email(OLD) string
     * @apiParam (Expected parameters) {String}      password         Password string
     * @apiParam (Expected parameters) {String}      image            image string
     * @apiParam (Expected parameters) {String}      gender           Gender string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/
    modifyProfile(req, res) {
        //this.func();
        var user_id = req.user.id;
        const self = this;
        //console.log(req.body);
       // console.log(req.files);
        if (!req.body.user_name) {
            return response.setResponse(res).invalidRequest('name is required');
        } else if (!req.body.password && req.body.is_edit_profile == "0") {
            return response.setResponse(res).invalidRequest('password is required');
        } else if (!req.body.gender) {
            return response.setResponse(res).invalidRequest('gender is required');
        } else if (req.files && req.files.image &&
            !(req.files.image.mimetype === 'image/jpeg' || req.files.image.mimetype === 'image/gif' || req.files.image.mimetype === 'image/png')) {
            return response.setResponse(res).invalidRequest('profile image is not valid image');
        } else {
           // console.log("Update profile request : " + req.body.is_edit_profile);
            // utility.uploadToS3(req.files.image.filename, req.files.image.file, req.files.image.mimetype, 'admin_images/' ).then((s3_upload_info) => {
            userModel.findById(user_id).then((result) => {
                if (!result) {
                    return response.setResponse(res).authenticationFailed();
                } else {
                    const save_data = {
                        user_name: req.body.user_name,
                        gender: req.body.gender,
                        is_profile_completed: true,
                        is_login: true
                    }

                    if (req.body.email && req.body.is_edit_profile == "0") {
                      //  console.log('Inside email save check');
                        save_data.email = req.body.email;
                    }

                    if (req.body.password) {
                        save_data.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
                    }

                    userModel.findOne({ email: req.body.email, user_type: 'user' }, (err, user) => {
                        if (err) {
                            //console.log(err.codeName)
                            return response.setResponse(res).internalError(err);
                        } else if (user && req.body.is_edit_profile === "0") {
                            return response.setResponse(res).validationError({}, 'The Email you have entered is already registered');
                        } else {
                            utility.checkUploadState(req, 'image', 'User/').then((s3_upload_info) => {
                                userModel.findByIdAndUpdate(user_id, { $set: save_data }, { new: true }, (err, doc) => {
                                    if (err) {
                                        return response.setResponse(res).internalError(err);
                                    } else {
                                        var rec = doc.convertToJSON();
                                        var s3image = '';
                                        if (s3_upload_info) {
                                            s3image = s3_upload_info.Location;
                                        }
                                        userModel.findByIdAndUpdate(user_id, {
                                            'image': s3image
                                        }, { new: true, upsert: true }, (err, docs) => {
                                            if (err) {
                                                console.log(err)
                                                return response.setResponse(res).internalError(err);
                                            } else {
                                                rec = docs.convertToJSON();
                                                return response.setResponse(res).success(rec, 'Profile updated successfully');
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    }

    /***************************************************************************************************************************************************************/
    /************************************************************************ /api/v1/imageUpload ************************************************************************/
    /**
     * @api {post} /imageUpload imageUpload
     * @apiHeader {String} Authorzation Beare tokenString
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/modifyProfile/
     * @apiGroup User
     * @apiName imageUpload
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      image            image string
     
     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/
    imageUpload(req, res) {
        //this.func();
        var user_id = req.user.id;
        const self = this;
        //console.log(req.body);
     //   console.log(req.files);
        utility.checkUploadState(req, 'image', 'User/').then((s3_upload_info) => {
            console.log("image upload s3 : " + s3_upload_info);
            var s3image = '';
            if (s3_upload_info) {
                s3image = s3_upload_info.Location;
            }
            userModel.findByIdAndUpdate(user_id, {
                'image': s3image
            }, { new: true, upsert: true }, (err, docs) => {
                if (err) {
                    console.log(err)
                    return response.setResponse(res).internalError(err);
                } else {
                    var rec = docs.convertToJSON();
                    return response.setResponse(res).success(rec, 'Profile image updated successfully.');
                }
            });
        });


    }


    getProfile(req, res) {
      //  console.log(req.query.id);
        //return false;
        var user_id = req.query.id;
        const self = this;
        //    userModel.findById(user_id).select("user_name email")
        userModel.findById(user_id)

            .then(async (result) => {
                if (!result) {
                    return response.setResponse(res).authenticationFailed();
                } else {
                    let user_data = result.convertToJSON();
                    user_data._id = req.query.id;


                    var count = await getUserAvgRatingCount(user_id)

                    // console.log(count);
                    var avg = await getUserAvgRating(user_id)
                  //  console.log(avg + "in get profile");
                    user_data.avgRating = avg;
                    user_data.totalRating = count;

                    return response.setResponse(res).success(user_data);
                }
            });

    }

    checkUploadState(req) {
        if (req.files && req.files.image) {
            return utility.uploadToS3(req.files.image.filename, req.files.image.file, req.files.image.mimetype, 'admin_images/');
        } else {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
    }

    getContent(req, res) {
        var content = req.query.content
        // content = terms_conditions / privacy_policy 
        contentModel.find({}, content, (err, data) => {
            if (err) {
                return response.setResponse(res).internalError(err);
            } else {
             //   console.log(data);
                return response.setResponse(res).success(data, 'data fetched successfully.');
            }
        })
    }
    getGlobalSettings(req, res) {
      
        setting_model.find({},  (err, data) => {
            if (err) {
                return response.setResponse(res).internalError(err);
            } else {
               // console.log(data);
                return response.setResponse(res).success(data, 'Settings fetched successfully.');
            }
        })

    }


    getUserSettings(req, res) {
      
        userModel.find({ _id:ObjectId(req.query.user_id)},  (err, data) => {
            if (err) {
                return response.setResponse(res).internalError(err);
            } else {
               // console.log(data);
                return response.setResponse(res).success(data, 'Details fetched successfully.');
            }
        })

    }

    spendSomeCredits(req,res) {
        var userId=req.body.user_id;
        var offerId=req.body.offer_id;
        var matchId =req.body.match_id;
     //   console.log(offerId+"spend some credits offerid");
        userModel.findById(userId)
            .then((result) => {
              //  console.log(result)
                if (result) {
                    if (result.user_credits > 0) {
                        var updatedCreditCounts = result.user_credits - 1;
                        userModel.findByIdAndUpdate(userId, { 'user_credits': updatedCreditCounts }, { new: true, upsert: true },async  (err, doc) => {
                            if (err) {
                             //   console.log(err);
                                return response.setResponse(res).internalError(err);

                            } else {
//console.log(offerId);
//console.log('checkingj here spend some credits');
                            await   UpdateOfferIdContactSeenStatus(userId,matchId);
                    return response.setResponse(res).success({}, 'One Credit has been deducted from your accout. You can now view the details.');

                            }
                        });
                    }
                    else{
                        //error not enough credits 
                        return response.setResponse(res).validationError({}, ' Not enough credits');

                    }


                }



            });

    

}



getMessageSeenForSemiFree(req,res) {
    var userId=req.body.user_id;
   
    var matchId =req.body.match_id;
    //SemiFreeMessageSeen status updated by user. 
    const update_data = {
        SemiFreeMessageSeen:true
    }
    
        match_model.findByIdAndUpdate(matchId, { $set: update_data }, { new: true }, (error1, result1) => {
        if(error1){
            return response.setResponse(res).internalError(err);
        
        }else{
            return response.setResponse(res).success({  }, 'Message has been seen successfully');
        }
    });



}


    createPaypalTransaction(req, res) {
        var { amount, user_id, offer_id, plan_id, credits,match_id } = req.body
        if (offer_id == "") {
            offer_id = null;
        }
        if (match_id == "") {
            match_id = null;
        }
        //`'${process.env.HTTP}${':'}${process.env.PORT}${"/api/v1/paymentSuccess"}'`
       // console.log(process.env.HTTP + ":" + process.env.PORT + "/api/v1/paymentSuccess");
        var paymentSuccessUrl = process.env.HTTP + ":" + process.env.PORT + "/api/v1/paymentSuccess";
        var paymentFailedUrl = process.env.HTTP + ":" + process.env.PORT + "/api/v1/paymentFailed";


        const create_payment_json = {

            "intent": "sale",

            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": paymentSuccessUrl,
                "cancel_url": paymentFailedUrl
            },

            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": user_id,

                        "sku": credits,
                        "price": amount,
                        "currency": "AUD",
                        "quantity": 1,
                    }]
                },
                "amount": {
                    "currency": "AUD",
                    "total": amount
                },
                "description": match_id,
                // "credits":credits,
            }]
        };

        paypal.payment.create(create_payment_json, async function (error, payment) {
            if (error) {
                return response.setResponse(res).failure({ status: 3 }, 'Error occurs in redirecting to payment gateway');

                // res.send({status:1,msg:'Error occurs in redirecting to payment gateway'})
                console.log(error);
            } else {
                var response1 = { 'url': payment.links[1].href };


                return response.setResponse(res).success(response1);
                //  for(let i = 0;i < payment.links.length;i++){
                //  if(payment.links[i].rel === 'approval_url'){
                //    res.redirect(payment.links[1].href);
                //  res.send(payment.links[1].href);
                // }
                // }
            }
        });

    }
    paymentSuccess(req, res) {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            // "transactions": [{
            //     "amount": {
            //         "currency": "USD",
            //         "total": "25.00"
            //     }
            // }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
               // console.log(error.response);
                return response.setResponse(res).failure({ status: 2 }, 'error occurs while processing');

                // res.send({status:2,msg:'error occurs while processing'})
            } else {
                //  console.log(JSON.stringify(payment));
                // console.log(payment.id);
                // console.log(payment.state);
                // console.log(payment.transactions[0].description);
                // console.log(payment.transactions[0].amount.total);
                // console.log(payment.transactions[0].item_list.items[0].name);
                // console.log(payment.transactions[0].item_list.items[0].sku);
                // console.log(payment.transactions[0].item_list.items[0].quantity);
                const addPayment = new PayentModel({
                    transaction_id: payment.id,
                    payment_status: payment.state,
                    match_id:ObjectId(payment.transactions[0].description),
                    amount: payment.transactions[0].amount.total,
                    user_id: payment.transactions[0].item_list.items[0].name,
                   // match_id:payment.transactions[0].item_list.items[0].quantity,
                })
                addPayment.save(async function (err, data) {
                    if (err) {
                        console.log(err)
                        res.send('cant save')
                        return
                    }
                  //  console.log(data)
                    // res.send('payment details save in db')
updateUserCreditPoints(payment.transactions[0].item_list.items[0].name, payment.transactions[0].item_list.items[0].sku,payment.transactions[0].description).then( async  function (resp){
if(resp){
    
        
    return response.setResponse(res).success({ status: 0 }, 'Payment successful, credits have been added to your account');

}else{
//console.log('in false');
}





});
                   


                })


            }
        });
    }
    paymentFailed(req, res) {
        return response.setResponse(res).failure({ status: 3 }, 'Error occurs in completion of payment');
        //     res.send({status:3,msg:'Error occurs in completion of payment'})
    }

}

module.exports = new User();






function getUserAvgRatingCount(user_id) {

    return new Promise((resolve, reject) => {
        // console.log("getAllratings------- " + user_id)


        ratingreview_model.find({ touser_id: ObjectId(user_id) }, (err, rateData) => {

            if (err) {
                console.log(err);
                reject(-1);
            } else {
                //  console.log("Printing Data------- ")
                //  console.log(rateData.length);
                var TotalCount = rateData.length;

                if (TotalCount == "") {
                    TotalCount = 0;
                }
                resolve(TotalCount);
            }


        });
    })

}


function getUserAvgRating(user_id) {
    return new Promise((resolve, reject) => {
        console.log("getAllratings------- " + user_id)




        ratingreview_model.aggregate(


            [
                {
                    "$match": {
                        "touser_id": ObjectId(user_id)
                    }
                },
                {
                    $group:
                    {
                        _id: null,
                        avgQuantity: { $avg: "$rating" }
                    }
                }
            ]
        ).then(avgRating => {

          //  console.log("Printing Data------- ")
         //   console.log(avgRating);

            if (avgRating == "") {
               // console.log('here');
                var avgRate = 0;
            } else {
                var avgRate = avgRating[0].avgQuantity;
            }



            resolve(avgRate);



        });
    })

}

function updateUserCreditPoints(userId, credits,matchId) {
    return new Promise((resolve, reject) => {

       // console.log(offerId);
        //   getmatchIdByofferId(userId,offerId).then(function(err,res){



        //   });
       
        userModel.findById(userId)

            .then(async (result) => {
            //    console.log(result)
                if (result) {
                    var creditPoint = parseInt(credits);
                    if(result.user_credits==0 && credits==1){
                        var updatedCreditCounts = 0;
                        await   UpdateOfferIdContactSeenStatus(userId,matchId);
                   
                        //console.log('now updating othersData');
                       
                        


                    }else{
                        var updatedCreditCounts = result.user_credits + creditPoint;
                       // await   getmatchIdByofferId(userId,offerId);
                    }

                    userModel.findByIdAndUpdate(userId, { 'user_credits': updatedCreditCounts }, { new: true, upsert: true },async  (err, doc) => {
                        if (err) {
                            console.log(err);
                           reject(false);
                        } else {
                          //  console.log('now updating othersData');
                            resolve(true);

                          // await   getmatchIdByofferId(userId,offerId);
                           
                        }
                    });

                }





            });

            

    });

}


function UpdateOfferIdContactSeenStatus(otheruserId,matchId){
    return new Promise((resolve,reject)=>{
//console.log(matchId+"here is updating contact seen")
        

const update_data = {
    contact_seen:true
}


    match_model.findByIdAndUpdate(matchId, { $set: update_data }, { new: true }, (error1, result1) => {
        if(error1){
console.log(error1);
    }else{
        resolve(true);

    }




});





        


    });

}

function getUpdateseen(user_id,id) {

    return new Promise((resolve, reject) => {
        // console.log("getAllratings------- " + user_id)
        const save_data = {
            other_user_id:user_id,
            contact_seen:true
        }
            
            offer_model.findByIdAndUpdate(id, {$set: save_data}, { new: true,upsert:true }, (err, doc) => {
                if (err) {
                    console.log(err);
                    reject(false);
                } else {
        
                    resolve(true);
                }
            });

      
    })

}
