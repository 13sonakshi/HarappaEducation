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

const productRoutes = require('./src/routes/api/v1/products/routes.js');
const customerRoutes = require('./src/routes/api/v1/customers/routes.js');
const sellerRoutes = require('./src/routes/api/v1/sellers/routes.js');
const orderRoutes = require('./src/routes/api/v1/orders/routes.js');




 

productRoutes(app);
customerRoutes(app);
sellerRoutes(app);
orderRoutes(app);


module.exports = app;


