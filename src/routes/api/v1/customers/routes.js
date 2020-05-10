const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const express = require('express');
const mongoose = require('mongoose');
const response = require(sourcePath + '/lib/response');
const customer = require(sourcePath + '/routes/api/v1/customers/customers');


const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const customerModel = mongoose.model('Customers');


const routes = (app) => {
    //  Routes
   
    app.route('/addCustomer').post(customer.addCustomers);










   




};

module.exports = routes;
