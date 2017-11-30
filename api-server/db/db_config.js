const config = require('../config.json');
var mongoose   = require('mongoose');

var start_db = function(){

	mongoose.connect('mongodb://' + 
		config['MongoDB'].user + 
		":" +
		config['MongoDB'].password +
		"@" +
		config['MongoDB'].address +
		"/" +
		config['MongoDB'].db_name

	); 

	// Handle the connection event
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function() {
	  console.log("DB connection alive");
	});
}

module.exports.start_db = start_db;
