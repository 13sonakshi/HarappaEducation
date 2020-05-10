const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const express = require('express');
const mongoose = require('mongoose');
const response = require(sourcePath + '/lib/response');
const product = require(sourcePath + '/routes/api/v1/products/products');


const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const productModel = mongoose.model('Products');


const routes = (app) => {
    //  Routes
   
    app.route('/addProduct').post(product.addToProducts);










   




};

module.exports = routes;
