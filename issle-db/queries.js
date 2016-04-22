/* Fill out these functions using Mongoose queries*/
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
config = require('./config'),
Listing = require('./ListingSchema');

mongoose.connect(config.db.uri);
console.log(config.db.uri);

mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
});
		
var findLibraryWest = function() {
  /* 
    Find the document that contains data corresponding to Library West,
    then log it to the console. 
   */

	Listing.find({'name': 'Library West'}, function(err,list){
	if(err) return handleError(err);
	console.log(list);
  
  });
};
var removeCable = function() {
  /*
    Find the document with the code 'CABL'. This cooresponds with courses that can only be viewed 
    on cable TV. Since we live in the 21st century and most courses are now web based, go ahead
    and remove this listing from your database and log the document to the console. 
   */
	Listing.findOneAndRemove({'code': 'CABL'}, function(err,list){
	if(err) return handleError(err);
	console.log(list);
	
  
  });
};
var updatePhelpsMemorial = function() {
  /*
    Phelps Memorial Hospital Center's address is incorrect. Find the listing, update it, and then 
    log the updated document to the console. 
   */
	Listing.findOne({'code': 'PHL'}, function(err,list){
		if(err) return handleError(err);
		list.address = '100 Phelps Lab P.O. Box 116350 Gainesville, FL  32611';
		list.coordinates.latitude = '29.6447855';
		list.coordinates.longitude = '-82.3491879';
		list.save(function(err){
			if(err) return handleError(err);
			
		});
		console.log(list);
   });
};
var retrieveAllListings = function() {
  /* 
    Retrieve all listings in the database, and log them to the console. 
   */
   Listing.find({}, function(err,list){
	if(err) return handleError(err);
	console.log(list);
  });
};


findLibraryWest();
removeCable();
updatePhelpsMemorial();
retrieveAllListings();
