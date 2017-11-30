var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var user   = new Schema({
	login: String,
	password: String,
	email: String
},
{ 
	collection: 'users' 
});

module.exports = mongoose.model('user', user);