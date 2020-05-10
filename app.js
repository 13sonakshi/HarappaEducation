const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors')
const sourcePath = path.resolve(process.cwd(), 'src');



const response = require(sourcePath +  '/lib/response');


require('dotenv').config();
var bb = require('express-busboy');
var fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const User = require(sourcePath +  '/models/users');




// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.use(cors());
bb.extend(app, {
    upload: true,
    path: 'uploads',
    allowedPath: /./
});




// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)







 
  





const userRoutes = require('./src/routes/api/v1/users/routes.js');
const productRoutes = require('./src/routes/api/v1/products/routes.js');



 

userRoutes(app);
productRoutes(app);



module.exports = app;


