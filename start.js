require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('debug', true);
// process.env.DATABASE
// "mongodb://localhost:27017/kbro"
mongoose.connect(process.env.DATABASE, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection
  .on('connected', () => {
    console.log(`Mongoose connection open on port ${process.env.PORT}`);
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err}`);
  });
   


const path = require('path')
const app = require('./app');

const express = require('express'); 
var remote = express();
remote.use(function(req, res, next) {
  res.end('end');
});

console.log(process.env.PORT);
const server = app.listen(process.env.PORT, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

// const server = app.listen('8001', () => {
//   console.log(`server is running on 8001`);
// });

server.on('connection', function(socket) {
  socket.on('data', function(chunk) {
    console.log(chunk.toString());
  });
});


