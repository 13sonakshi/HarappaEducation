const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const express = require('express');
const mongoose = require('mongoose');
const response = require(sourcePath + '/lib/response');
const order = require(sourcePath + '/routes/api/v1/orders/orders');


const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const orderModel = mongoose.model('Orders');


const routes = (app) => {
    //  Routes
   
    app.route('/addOrder').post(order.addOrders);










   




};

module.exports = routes;
