'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Counties = mongoose.model('Counties'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

	
exports.create = function(req, res) {
	var counties = new Counties(req.body);
	//standard.user = req.user;

	counties.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(counties);
		}
	});
};
exports.read = function(req, res) {
	res.jsonp(req.counties);
};
exports.update = function(req, res) {
	var counties = req.counties ;

	//counties = _.extend(standard , req.body);

	counties.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(counties);
		}
	});
};
	
	
exports.delete = function(req, res) {
	var counties = req.counties ;

	counties.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(counties);
		}
	});
};

exports.list = function(req, res) {
/*
  Counties.find().exec(function(err, counties) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(counties);
    }
  });
  */
  if(req.query.county){
	Counties.find().
		where('county').equals(req.query.county).
		//where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		//sort('-created').populate('user', 'displayName').
		exec(function(err, counties) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(counties);
			res.jsonp(counties);
		}
	});
  }
  else{
  Counties.find().
		//where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		//sort('county');
		//sort('-created').populate('user', 'displayName').
		exec(function(err, counties) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(counties);
		}
	});
  }
  
};	
/*
exports.list = function(req, res) { 
	//this is where the search querries for search by standards are created
	//the way the search works is by a hiarchy
	//if a standard is put in then that over takes all other search parameters
	//if a description keyword is put in and but not a standard then that takes priority
	//if none of the text based search parameters are put in then it first checks if thier is a subject
	//if there is put it in with the query if not, then just search by the min and max grade.
	console.log('tried to query');
	if(req.query.benchmark) {
	Standard.find().
		where('benchmark').equals(req.query.benchmark).
		sort('-created').populate('user', 'displayName').
		exec(function(err, standards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(standards);
		}
	});
	}
	else if(req.query.keyword) {
	Standard.find().
		where('description').regex(new RegExp(req.query.keyword, 'i')).
		sort('-created').populate('user', 'displayName').
		exec(function(err, standards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(standards);
		}
	});
	} else if(req.query.subject) {
	Standard.find().
		where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		where('subject').equals(req.query.subject).
		sort('-created').populate('user', 'displayName').
		exec(function(err, standards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(standards);
		}
		});
	} else {
	Standard.find().
		where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		sort('-created').populate('user', 'displayName').
		exec(function(err, standards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(standards);
		}
	});
	}
};
	*/

exports.countiesByID = function(req, res, next, id) {
  Counties.findById(id).exec(function(err, counties) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.counties = counties;
      next();
    }
  });
};