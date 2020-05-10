const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const mongoose = require('mongoose');
var foreach = require('foreach');
const push = require(sourcePath + '/lib/push');
const customerModel = require(sourcePath + '/models/customers');
const ordersDetailModel = require(sourcePath + '/models/orderDetails');

const pagination = require(sourcePath + '/lib/pagination');
const response = require(sourcePath + '/lib/response');
const moment = require('moment');
//const emailjs = require("emailjs");


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
              return response.setResponse(res).success(data, 'Customer added successfully');
            }
        });
    }


    checkCustomerOrderStatus(req, res) {
   
      ordersDetailModel.find({order_id:req.query.orderId},(err,products)=>{
          if(err){
              return response.setResponse(res).internalError(err);
          }else {
              return response.setResponse(res).success({products}, 'Listing fetched successfully.');
          }
      });

  }

   
    



   
}

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

module.exports = new Customers();







