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
  if(req.query.county){
	Schools.find().
		where('county').equals(req.query.county).
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