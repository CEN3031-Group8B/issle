/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
Schema = mongoose.Schema;

/* Create your schema */
var listingSchema = new Schema({
	/* your code here */
	benchmark: String,
	description: String,
	subject: String,
	grade: String,
	bodyOfKnowledge: String,
	updated_at: Date,
	created_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
listingSchema.pre('save', function(next) {
	/* your code here */
	if(!this.created_at)
		this.created_at = new Date();
	this.updated_at = new Date();
	next();
});

/* Use your schema to instantiate a Mongoose model */

var Listing = mongoose.model('Standards', listingSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Listing;
