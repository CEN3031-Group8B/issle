'use strict';
/* 
Import modules/files you may need to correctly run the script. 
Make sure to save your DB's uri in the config file, then import it with a require statement!
*/
var fs = require('fs'),
mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
Listing = require('./StandardsSchema'),
config = require('./config');

mongoose.connect(config.db.uri);
mongoose.connection.on('open', function (ref) {
 // console.log('Connected to mongo server.');
});


fs.readFile('./json.json', 'utf8', function(err, data){
  if(err) throw err;
  var obj = JSON.parse(data);
  for(var Benchmark in obj){
	var listings = new Listing({benchmark: obj[Benchmark].Benchmark,
								description: obj[Benchmark].Description,
								subject: obj[Benchmark].Subject,
								grade: obj[Benchmark].Grade,
								bodyOfKnowledge: obj[Benchmark].bodyOfKnowledge
  });
	listings.save(function(err){
      
    });
  }
			
});


