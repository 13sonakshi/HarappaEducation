const path = require("path");
const mongoose = require("mongoose");
const sourcePath = path.resolve(process.cwd(), "src");
const User = require(sourcePath + "/models/users");

const bcrypt = require("bcryptjs");

const moment = require("moment");
const response = require(sourcePath + "/lib/response");
const utility = require(sourcePath + "/lib/utility");
const min = 1000;
const max = 9999;

class Auth {
  constructor() {}

  /***************************************************************************************************************************************************************/
  /************************************************************************ /api/v1/signin ************************************************************************/
  /**
     * @api {post} /signin signin
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/signin/
     * @apiGroup User
     * @apiName signin
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      user_name         phone number/Email string
     * @apiParam (Expected parameters) {String}      password         Password string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/


    testRoute(req, res) {
      res.send('API works')
    }

    
  signin(req, res) {
    var device_token = req.body.device_token;

    var device_type = req.body.device_type;
    console.log(req.body.user_name);
    // User.findOne( {'user_name':{$regex: new RegExp(req.body.user_name, "i")}}).then(user => {
    //  User.findOne( {'user_name': req.body.user_name}).then(user => {
    //{ $regex: new RegExp("^" + req.body.user_name.toLowerCase(), "i") }
    User.findOne({
      user_name: { $regex: new RegExp("^" + req.body.user_name + "$", "i") }
    }).then(user => {
      if (!user) {
        return response.setResponse(res).authenticationFailed();
      } else {
        console.log("here");
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) {
            return response.setResponse(res).internalError(err);
          } else if (isMatch) {
            console.log(user);

            var token = jwt.sign(
              { id: user._id, user_name: user.user_name },
              process.env.JWT_SECRET,
              {
                expiresIn: "365d" // 365 days
              }
            );
            saveDeviceTokenInLogin(device_token, device_type, token, user._id);
            var rec = user.convertToJSON();

            rec.token = token;
            return response
              .setResponse(res)
              .success(rec, "Signin successfully");
          } else {
            return response.setResponse(res).authenticationFailed();
          }
        });
      }
    });
  }

  /***************************************************************************************************************************************************************/
  /************************************************************************ /api/v1/signup ************************************************************************/
  /**
     * @api {post} /signup signup
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/signup/
     * @apiGroup User
     * @apiName signup
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      username         username  string
     * @apiParam (Expected parameters) {String}      device_token         device token string
     * @apiParam (Expected parameters) {String}      device_type          android/ios it would be also a string
     * @apiParam (Expected parameters) {String}      email            email string
     * @apiParam (Expected parameters) {String}      password            password string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/

  signup(req, res) {
    console.log("here inside the api ");
    var regexp = /<(.*?)>/g;

    //  var random = Math.floor(Math.random() * (max - min + 1)) + min;
    var random = 1111;
    var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    //registration.addresses.push({ name: 'test1', address: 'Bhagsar' },{ name: 'test1', address: 'Bhagsar' });

    if (!req.body.user_name) {
      return response
        .setResponse(res)
        .validationError({}, "username is required.");
    } else {
      //check if username  is already exist

      //  { $regex: new RegExp("^" + req.body.user_name.toLowerCase(), "i") }
      User.find(
        {
          $or: [
            {
              user_name: {
                $regex: new RegExp(
                  "^" + req.body.user_name.toLowerCase() + "$",
                  "i"
                )
              }
            },
            {
              email: {
                $regex: new RegExp(
                  "^" + req.body.email.toLowerCase() + "$",
                  "i"
                )
              }
            },
            { phone_number: req.body.phone_number }
          ]
        },
        function(err, doc) {
          //User.find( { user_name: req.body.user_name, email: req.body.email, phone_number: req.body.phone_number }, function (err, doc) {
          if (err) {
            return response.setResponse(res).internalError(err);
          } else if (doc != null && doc.length > 0) {
            console.log(doc[0].user_name.toLowerCase() + "lower");
           console.log(req.body.user_name.toLowerCase() + "length");
        //  return false;

            if (
              // doc[0].user_name == req.body.user_name.toLowerCase() ||
              // doc[0].user_name == req.body.user_name.toUpperCase() ||
              // doc[0].user_name == req.body.user_name  
              //chavi = Chavi 
              doc[0].user_name.toLowerCase() == req.body.user_name.toLowerCase()
              ) {
              console.log(doc + "comes inside  username");
            //  return false;

              return response.setResponse(res).validationError(
                {
                  is_already_registered: doc.is_already_registered
                },
                "This Username is already in use"
              );
            } else if (doc[0].phone_number == req.body.phone_number) {
              console.log(doc + "comes inside  number");

              return response
                .setResponse(res)
                .validationError({}, "This phone number is already in use");
            } else if (
              doc[0].email == req.body.email.toLowerCase() ||
              doc[0].email == req.body.email.toUpperCase()
            ) {
              console.log(doc + "comes inside  email");

              return response
                .setResponse(res)
                .validationError({}, "This email address is already in use");
            }
          } else {
            console.log(doc);

            const user = new User();

            user.user_name = req.body.user_name;
            user.email = req.body.email;
            user.password = password;
            user.device_token = req.body.device_token;
            user.device_type = req.body.device_type;
            user.rating = 0;
            user.image = "";
            user.phone_number = req.body.phone_number;
            user.country_code = "";
            user.is_login = true;
            user.otp = random;
            user.user_credits = 0;
            user.token = "";
            //registration.otp = 1111; //random;
            user.save((regErr, data) => {
              if (regErr) {
                if (regErr.code == 11000) {
                  var message = regErr.errmsg;
                }


                return response.setResponse(res).validationError({}, message);
              } else {
                //console.log(data._id);
                // if (req.body.phone_number != '') {
                //                      sendSms(req.body.phone_number, random);
                //                }

                var token = jwt.sign(
                  { id: data._id, user_name: data.user_name },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "365d" // 365 days
                  }
                );

                var rec = {};
                rec._id = data._id;
                rec.user_name = req.body.user_name;
                rec.email = req.body.email;
                rec.password = password;
                rec.device_token = req.body.device_token;
                rec.device_type = req.body.device_type;
                rec.rating = 0;
                rec.image = "";
                rec.otp = random;
                rec.phone_number = req.body.phone_number;
                rec.token = token;

                //var message = "Dear "+ req.body.user_name+", <br/><br/> Welcome and thank you for being part of our Kbro Beta test team. Kbro has been developed to assist users with arranging their transport and travel needs. We hope it proves invaluable for moving people, parcels, freight or almost anything anywhere around the country or the world.<br/><br/> Using Kbro is simple, users input their requirements as either an Offer or a Request. You may, for example, submit a Request for a lift somewhere or to move something. Also, you can submit an Offer to transport passengers or items for other people. Kbro will advise you when a matching Offer or Request is found.<br/><br/> People can use Kbro to earn extra cash by submitting an Offer, or Offers, to move parcels, freight or almost anything anywhere. The user is then able to review matching Requests and select appropriate jobs. Kbro will match Offers and Requests in the database and for a small fee provide contact details so that users can make mutually acceptable arrangements. One user pays Kbro for another users contact information. We are not concerned with the transaction between users once they have made contact.<br/><br/> Much the same as other web/app-based services, Kbro will have limited use until the database is populated with sufficient users, think Ebay or RSVP. Until we have sufficient users, feel free to try out the app with non-genuine or TEST Offers and Requests to see how they match up. If you would like to try doing both Offers and Requests, you will need two different profiles. If you are entering a TEST Offer or a TEST Request, please type TEST in the comments section of the Search form so other users know that your offer is for testing purposes only.<br/> Kbro is free to use during the Beta test period and it will be free for an introductory period after it is uploaded and available for public use.Beta testers are required step through the Credit buying process, this is part of the Beta testing procedure, no charges apply. Do not enter credit card information during the Beta test period.<br/><br/> We are interested in your thoughts and comments on how well, or otherwise, the app matches Offers and Requests.<br/>We also want to hear about your first impressions, what you think of the app and how it could be improved. We are very interested to hear about any functional deficiencies or irregular behaviour, so we can investigate and iron out the bugs. We are contactable via the 'Contact Developer' button on the Profile page, or if you prefer email, we are happy to accept your feedback and/or questions at betatest@Kbro.co.";
                var message =
                  "Dear new Kbro User, <br/><br/> Welcome and thank you for being part of our Kbro Beta test team. Kbro has been developed to assist Users with arranging their transport and travel needs. We hope it proves invaluable for moving people, parcels, freight or almost anything anywhere around the country or the world.<br/><br/> Using Kbro is simple, users input their requirements as either an Offer or a Request. You may, for example, submit a Request for a lift somewhere or to move something. Also, you can submit an Offer to transport passengers or items for other people. Kbro will advise you when a matching Offer or Request is found.<br/><br/>People can use Kbro to earn extra cash by submitting an Offer, or Offers, to move parcels, freight or almost anything anywhere. The user is then able to review matching Requests and select appropriate jobs. Kbro will match Offers and Requests in the database and for a small fee provide contact details so that users can make mutually acceptable arrangements. One user pays Kbro for another users contact information. We are not concerned with the transaction between users once they have made contact.<br/><br/>The app also has a very simple internal messaging service to keep track of comms with other Users, if you want to.<br/><br/>Much the same as other web/app-based services, Kbro will have limited use until the database is populated with sufficient users, think Ebay or RSVP.<br/><br/>Test the app by submitting Offers and Requests, the Offers and Requests you submit can be as simple or detailed as you like. Have a look through the options available. When you submit an Offer or Request there has to be a matching Offer or Request from another User in the system for the app to make a match.<br/><br/>If you would like to try generating some matches you will need two different profiles, one to submit an Offer and the other to submit the matching Request. The second profile is quite easy and quick to do, simply log out of your first profile and tap ‘Sign Up Here’ on the logon screen.<br/><br/>Pls enter:<br/><br/>Username: Enter the same name as you used for your initial Sign Up followed by the digit 2. E.g. Initial Sign Up John, second profile John2<br/><br/>Mobile Number: Enter any 10 digits<br/><br/>Email: Enter any email format. E.g. xxxx@gmail.com<br/><br/>Password: Any 8 digits (you can make this the same as your initial Password)<br/><br/>Accept the terms and conditions, tap Sign Up. You now have a second profile.<br/><br/>We are interested in your thoughts and comments on how well, or otherwise, the app performs.<br/><br/>We also want to hear about your first impressions, what you think of the app and how it could be improved. We are very interested to hear about any functional deficiencies or irregular behaviour, so we can investigate and iron out the bugs. We are contactable via the 'Contact Developer' button on the Profile page.<br/><br/>Otherwise feel free to contact David in Australia on 0436 809 797 or at jabiru@outlook.com or Rob at rlk_ja@hotmail.com.<br/><br/>Happy testing,<br/><br/>David, Rob and the Kbro team.";
                var subject = "Kbro Welcome !";
                sendMails(req.body.email, subject, message);
                saveDeviceTokenInLogin(
                  req.body.device_token,
                  req.body.device_type,
                  token,
                  data._id
                );

                return response
                  .setResponse(res)
                  .success(rec, "User registered successfully");
              }
            });
          }
        }
      );
    }
  }

  /***************************************************************************************************************************************************************/
  /************************************************************************ /api/v1/signOut ************************************************************************/
  /**
   * @api {post} /signOut signOut
   * @apiHeader {String} Authorization Bearer tokenString
   * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
   * @apiDescription http://localhost:3000/api/v1/signOut/
   * @apiGroup User
   * @apiName signOut
   * ***************************************************************************************************************************************************************
   * ***************************************************************************************************************************************************************
   * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
   * @apiSuccess {String}                message           response message string
   * @apiSuccess {Object}                data              result
   * **************************************************************"*************************************************************************************************
   * @apiVersion 1.0.0
   **/
  signOut(req, res) {
    const token_header = req.header("Authorization");
    const token = token_header.split(" ")[1];
    //const token = token_header.split(" ")[1];
console.log(token +"after split ");
console.log(token_header);
    const jwt_data = jwt.decode(token);
   // console.log(jwt_data);
  //  return false;

    var user_id = req.body.id;
    //console.log(user_id);
    User.updateOne(
      { _id: user_id },
      { is_login: false, device_token: null },
      (err, user) => {
        if (err) {
          return response.setResponse(res).internalError(err);
        } else {
          const expiredJwt = new expiredJwtToken(req.body);
          expiredJwt.token = token;
          expiredJwt.save((err, data) => {
            if (err) {
              return response.setResponse(res).internalError(err);
            } else {
              return response
                .setResponse(res)
                .success({}, "Signout successfully");
            }
          });
          //return response.setResponse(res).success({},'Signout successfully');
        }
      }
    );
  }

  /***************************************************************************************************************************************************************/
  /************************************************************************ /api/v1/forgetPassword ************************************************************************/
  /**
     * @api {post} /forgetPassword forgetPassword
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/forgetPassword/
     * @apiGroup User
     * @apiName forgetPassword
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      phone_number         phone number/Email string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/
  forgetPassword(req, res) {
    //var random = 'kbro@kwix';

    if (!req.body.user_name) {
      return response.setResponse(res).invalidRequest("user_name is required.");
    } else {
      User.findOne({
        user_name: 
       // { $regex: new RegExp(req.body.user_name, "i") }
        { $regex: new RegExp(
          "^" + req.body.user_name.toLowerCase() + "$",
          "i"
        )}
      }).then(result => {
        if (!result) {
          return response
            .setResponse(res)
            .failure({ not_exists: true }, "Username is not registered.");
        } else {
          var to = result.email;
          var subject = "Kbro Forget Password";
          // var url ='http://localhost:8800/changepassword'+"?username="+req.body.user_name+"&mail="+to;

          //var url ='http://18.217.253.252:9010/changepassword'+"?username="+req.body.user_name+"&mail="+to;
          var url =
            "http://3.130.93.152:9010/changepassword" +
            "?username=" +
            req.body.user_name +
            "&mail=" +
            to;

          var message =
            "Use this link to reset your password <a href=" +
            url +
            ">click here</a>";
          sendMails(to, subject, message);
          return response
            .setResponse(res)
            .success({}, "Email sent successfully");
        }
      });
    }
  }

  /***************************************************************************************************************************************************************/
  /************************************************************************ /api/v1/resetPassword ************************************************************************/
  /**
     * @api {post} /resetPassword resetPassword
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded.
     * @apiDescription http://localhost:3000/api/v1/resetPassword/
     * @apiGroup User
     * @apiName resetPassword
     * ***************************************************************************************************************************************************************
     * @apiParam (Expected parameters) {String}      token         token string
     * @apiParam (Expected parameters) {String}      password      password string

     * ***************************************************************************************************************************************************************
     * @apiSuccess {boolean=false,true}    success           response status ( false for error, true for success )
     * @apiSuccess {String}                message           response message string
     * @apiSuccess {Object}                data              result
     * ***************************************************************************************************************************************************************
     * @apiVersion 1.0.0
     **/
  resetPassword(req, res) {
    User.findOne({
      user_name: {
        $regex: new RegExp(
          "^" + req.body.username.toLowerCase() + "$",
          "i"
        )
      }
    }).then(result => {
      if (!result) {
        console.log("hhhhhh");
        return response.setResponse(res).invalidRequest();
      } else {
        var password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
        User.update(
          { user_name: {
            $regex: new RegExp(
              "^" + req.body.username.toLowerCase() + "$",
              "i"
            )
          }
           },
          { $set: { password: password } },
          (err, doc) => {
            if (err) {
              console.log(err);
              return response.setResponse(res).internalError(err);
            } else {
              console.log("here");
              return response
                .setResponse(res)
                .success({}, "Password reset successfully");
            }
          }
        );
      }
    });
    // }
  }

  verifyOtp(req, res) {
    if (!(req.body.user_id && req.body.otp)) {
      return response
        .setResponse(res)
        .validationError("userId / otp is required.");
    } else {
      User.findOne({ _id: req.body.user_id, otp: req.body.otp }, (err, doc) => {
        if (err) {
          return response.setResponse(res).internalError(err);
        } else if (!doc) {
          return response
            .setResponse(res)
            .failure(
              { valid_otp: false },
              "The OTP you have entered is Invalid"
            );
        } else {
          const save_data = {
            is_otp_verified: true
          };

          User.findByIdAndUpdate(
            req.body.user_id,
            { $set: save_data },
            { new: true, upsert: true },
            (err, doc) => {
              if (err) {
                console.log(err);
                return response.setResponse(res).internalError(err);
              } else {
                return response
                  .setResponse(res)
                  .success({}, "OTP verified successfully");
              }
            }
          );
        }
      });
    }
  }

  resendOtp(req, res) {
    //var random = Math.floor(Math.random() * (max - min + 1)) + min;

    var random = 1111;

    User.findOne({ phone_number: req.body.phone_number }).then(result => {
      if (!result) {
        console.log("hhhhhh");
        return response.setResponse(res).invalidRequest();
      } else {
        //     if (req.body.phone_number != '') {
        //         sendSms(req.body.phone_number, random);
        //   }
        User.update(
          { phone_number: req.body.phone_number },
          { $set: { otp: random } },
          (err, doc) => {
            if (err) {
              console.log(err);
              return response.setResponse(res).internalError(err);
            } else {
              console.log("here");
              return response
                .setResponse(res)
                .success({}, "Otp  sent successfully");
            }
          }
        );
      }
    });
    // }
  }
}

module.exports = new Auth();

function sendMails(to, subject, message) {
    console.log(to);
    var from = "norplykwixglobal@gmail.com";
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');
	const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
          //  port: 465,
          //  secure: false,
            auth: {
                user: 'norplykwixglobal@gmail.com',
                pass: 'kite12345'
            }
        }));


    transporter.sendMail({
        html: message,
        from: from,
        to: to,
        //bcc: "Sonakshi <sonakshis@kwixglobal.com>",
        subject: subject,
        attachment:
                [
                    {data: message, alternative: true},
                ]
    }, function (err, message) {
        if (err) {
            console.log('error m ayaa');
            console.log(err);
        } else {
            console.log('result m aaya');
            console.log(message);
        }
    });
}


function sendSms(phone, random) {
  var accountSid = "AC837edcdeea7a9a30801a3c7b17b64068"; // Your Account SID from www.twilio.com/console
  var authToken = "d3f624d80ffd358e7c2c2e87d708a9e9"; // Your Auth Token from www.twilio.com/console

  var client1 = new twilio(accountSid, authToken);

  client1.messages
    .create({
      to: "91" + phone,
      friendlyName: "kbro",
      messagingServiceSid: "PN546fcd7827667b266d30ab597c905500",

      from: "+1 704 209 7852",
      body: "Kbro code: " + random + ". Enjoy your journey!"
    })
    .then(message => console.log(message.sid));
}
function saveDeviceTokenInLogin(device_token, device_type, token, user_id) {
  const save_data = {
    device_token: device_token,
    device_type: device_type,
    token: token,
    is_login: true
  };

  User.findByIdAndUpdate(
    user_id,
    { $set: save_data },
    { new: true, upsert: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    }
  );
}
