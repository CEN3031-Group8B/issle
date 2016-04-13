'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	CountiesAndSchools = mongoose.model('CountiesAndSchools'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

	
exports.create = function(req, res) {
	var countiesandschools = new CountiesAndSchools(req.body);
	//standard.user = req.user;

	countiesandschools.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(countiesandschools);
		}
	});
};
exports.read = function(req, res) {
	res.jsonp(req.countiesandschools);
};
exports.update = function(req, res) {
	var countiesandschools = req.countiesandschools ;

	//countiesandschools = _.extend(standard , req.body);

	countiesandschools.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(countiesandschools);
		}
	});
};
	
	
exports.delete = function(req, res) {
	var countiesandschools = req.countiesandschools ;

	countiesandschools.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(countiesandschools);
		}
	});
};

exports.list = function(req, res) {
/*
  CountiesAndSchools.find().exec(function(err, countiesandschools) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(countiesandschools);
    }
  });
  */
  if(req.query.county){
	CountiesAndSchools.find().
		where('county').equals(req.query.county).
		//where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		//sort('-created').populate('user', 'displayName').
		exec(function(err, countiesandschools) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(countiesandschools);
			res.jsonp(countiesandschools);
		}
	});
  }
  else{
  CountiesAndSchools.find().
		//where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		//sort('county');
		//sort('-created').populate('user', 'displayName').
		exec(function(err, countiesandschools) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(countiesandschools);
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

exports.countyByID = function(req, res, next, id) {
  CountiesAndSchools.findById(id).exec(function(err, countiesandschools) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.countiesandschools = countiesandschools;
      next();
    }
  });
};