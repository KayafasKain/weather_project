var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var city   = new Schema({
	name: String
},
{ 
	collection: 'city' 
});
var Weather = module.exports = mongoose.model('city', city);