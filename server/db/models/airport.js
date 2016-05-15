
var mongoose = require('mongoose');

//model to store airport data in the DB
var schema = new mongoose.Schema({
	code:{
		type: String
	},
	name:{
		type:String
	},
	country:{
		type: String
	},
	lat:{
		type:Number
	},
	lng:{
		type:Number
	}


});

module.exports = mongoose.model('Airport', schema);



