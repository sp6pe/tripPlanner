var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/airportdistance');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));


module.exports = {
  Airport: require('./models/airport')
};