const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const express = require('express');
const mongoose = require('mongoose');
const response = require(sourcePath + '/lib/response');
const seller = require(sourcePath + '/routes/api/v1/sellers/sellers');


const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const sellerModel = mongoose.model('Sellers');


const routes = (app) => {
    //  Routes[]
   
    app.route('/addSeller').post(seller.addSellers);
    app.route('/getNewSellerOrders').get(seller.getSellerOrders);










   




};

module.exports = routes;
