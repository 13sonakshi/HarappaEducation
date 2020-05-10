const path = require('path');
const sourcePath = path.resolve(process.cwd(), 'src');
const express = require('express');
const mongoose = require('mongoose');
const response = require(sourcePath + '/lib/response');
const user = require(sourcePath + '/routes/api/v1/users/users');


const router = express.Router();
const { body, validationResult } = require('express-validator/check');
const auth = require('./auth');
const userModel = mongoose.model('Users');


const routes = (app) => {
    // Auth Routes
    app.route('/test').get(auth.testRoute);








   




};

module.exports = routes;
