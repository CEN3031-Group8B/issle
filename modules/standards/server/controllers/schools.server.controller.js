'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Schools = mongoose.model('Schools'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

	
exports.create = function(req, res) {
	var schools = new Schools(req.body);
	//standard.user = req.user;

	schools.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(schools);
		}
	});
};
exports.read = function(req, res) {
	res.jsonp(req.schools);
};
exports.update = function(req, res) {
	var schools = req.schools ;

	//schools = _.extend(standard , req.body);

	schools.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(schools);
		}
	});
};
	
	
exports.delete = function(req, res) {
	var schools = req.schools ;

	schools.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(schools);
		}
	});
};

exports.list = function(req, res) {
/*
  Schools.find().exec(function(err, schools) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(schools);
    }
  });
  */
  if(req.query.county){
	Schools.find().
		where('county').equals(req.query.county).
		//where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		//sort('-created').populate('user', 'displayName').
		exec(function(err, schools) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(schools);
			res.jsonp(schools);
		}
	});
  }
  else{
  Schools.find().
		//where('grade').gte(req.query.minGrade).lte(req.query.maxGrade).
		//sort('county');
		//sort('-created').populate('user', 'displayName').
		exec(function(err, schools) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(schools);
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

exports.schoolsByID = function(req, res, next, id) {
  Schools.findById(id).exec(function(err, schools) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.schools = schools;
      next();
    }
  });
};