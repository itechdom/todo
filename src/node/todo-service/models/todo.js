var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Todo', new Schema({
	title: String,
	points: Number,
	date: Date,
	category: String,
	tags:[String]
}));
