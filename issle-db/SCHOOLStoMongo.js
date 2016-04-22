'use strict';
/* 
Import modules/files you may need to correctly run the script. 
Make sure to save your DB's uri in the config file, then import it with a require statement!
*/
var fs = require('fs'),
mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
Listing = require('./SchoolsSchema'),
config = require('./config');

mongoose.connect(config.db.uri);
mongoose.connection.on('open', function (ref) {
 // console.log('Connected to mongo server.');
});


fs.readFile('./schools.json', 'utf8', function(err, data){
  if(err) throw err;
  var obj = JSON.parse(data);
  for(var Schools in obj){
	var listings = new Listing({school: obj[Schools].School,
								county: obj[Schools].County
  });
	listings.save(function(err){
      
    });
  }
			
});


