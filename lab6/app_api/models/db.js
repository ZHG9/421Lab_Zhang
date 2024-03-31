var mongoose = require( 'mongoose' );
require('dotenv').config();
var gracefulShutdown;

var dbURI = process.env.DB_URL


mongoose.connect(dbURI);

// Monitor and report when database is connected                      
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

// Monitor and report error connecting to database
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

// Monitor and report when database is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
}); 


// Closes (disconnects) from Mongoose DB upon shutdown    
function gracefulShutdown(msg, callback) {
  mongoose.connection.close()
      .then(() => {
          console.log('Mongoose disconnected through ' + msg);
          callback();
      })
      .catch((err) => {
          console.error('Mongoose disconnection error: ' + err);
          callback(err);
      });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
}); });

// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.exit(0);
}); });

// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
}); });

require('./blogs');
require('./users');