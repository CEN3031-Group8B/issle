'use strict';

/**
 * Module dependencies.
 */
 var _ = require('lodash'),
 path = require('path'),
 mongoose = require('mongoose'),
 Project = mongoose.model('Project'),
 User = mongoose.model('User'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 knox = require(path.resolve('./config/lib/knox.js')), // S3 Connection
 knoxClient = knox.knoxClient;
/**
 * Create a Project
 */
 exports.create = function(req, res) {
 	var project = new Project(req.body);
 	project.user = req.user;

 	project.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(project);
 		}
 	});
 };

/**
 * Show the current Project
 */
 exports.read = function(req, res) {
 	res.jsonp(req.project);
 };

/**
 * Update a Project
 */
 exports.update = function(req, res) {
 	var project = req.project ;

 	project = _.extend(project , req.body);

 	project.save(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(project);
 		}
 	});
 };

/**
 * Delete a Project
 */
 exports.delete = function(req, res) {
 	var project = req.project ;

 	project.remove(function(err) {
 		if (err) {
 			return res.status(400).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		} else {
 			res.jsonp(project);
 		}
 	});
 };

/**
 * List of Projects
 */
 exports.list = function(req, res) {
 	//this is where the search querries for search by projects are created
 	//the way the search works is by a hiarchy
    //if a project name is put in then that over takes all other search parameters
    //if a standard is put in and but not a standard then that takes priority
  	//if none of the text based search parameters are put in then it first checks if thier is a subject
    //if there is put it in with the query if not, then just search by the min and max grade.

 	if (req.query.userId)
 	{
 		Project.find()
 		.where('user').equals(req.query.userId)
 		.sort('-created')
 		.populate('user', 'displayName')
 		.exec(function(err, projects) {
 			if (err) {
 				return res.status(400).send({
 					message: errorHandler.getErrorMessage(err)
 				});
 			} else {
 				res.jsonp(projects);
 			}
 		});
 	}
 	else
 	{
 		if(req.query.projectName) {
 			Project.find().
 			where('name').regex(new RegExp(req.query.projectName, 'i')).
 			sort('-created').populate('user', 'displayName').
 			exec(function(err, projects) {
 				if (err) {
 					return res.status(400).send({
 						message: errorHandler.getErrorMessage(err)
 					});
 				} else {
 					res.jsonp(projects);
 				}
 			});
 		} else if(req.query.benchmark) {
 			Project.find().
 			where('essentialDetails.overallStandards').regex(new RegExp(req.query.benchmark, 'i')).
 			sort('-created').populate('user', 'displayName').
 			exec(function(err, projects) {
 				if (err) {
 					return res.status(400).send({
 						message: errorHandler.getErrorMessage(err)
 					});
 				} else {
 					res.jsonp(projects);
 				}
 			});
 		} else if(req.query.subject) {
 			Project.find().
 			where('minGrade').gte(req.query.minGrade).
 			where('maxGrade').lte(req.query.maxGrade).
 			where('essentialDetails.overallSubjects').regex(new RegExp(req.query.subject,'i')).
 			sort('-created').populate('user', 'displayName').
 			exec(function(err, projects) {
 				if (err) {
 					return res.status(400).send({
 						message: errorHandler.getErrorMessage(err)
 					});
 				} else {
 					res.jsonp(projects);
 				}
 			});
 		} else {
 			Project.find().
 			where('minGrade').gte(req.query.minGrade).
 			where('maxGrade').lte(req.query.maxGrade).
 			sort('-created').populate('user', 'displayName').
 			exec(function(err, projects) {
 				if (err) {
 					return res.status(400).send({
 						message: errorHandler.getErrorMessage(err)
 					});
 				} else {
 					res.jsonp(projects);
 				}
 			});
 		}
 	}
 };

/**
 * Upload picture for project
 */
 exports.uploadDiagram = function (req,res){

	 var project = req.project;
	 console.log("body: " + req.body);
	 console.log("files: " + req.files);
	 console.log("file: " + req.file);
	 console.log("buffer: " + req.file.buffer);
	 // Upload Buffer from front-end client
	 knoxClient.putBuffer(req.files.file.buffer, 'ProjectDrawings/' + req.files.file.name,{'Content-Type': 'image/jpeg'},function(uploadError){
		 if (uploadError) {
			 return res.status(400).send({
				 message: 'Error occurred while uploading project drawing'
			 });
		 } else {
			 // Delete previous existing image
			 knoxClient.deleteFile(project.worksheetStep.theWorksheet.substring(project.worksheetStep.theWorksheet.search('ProjectDrawings/')),{'Content-Type': 'image/jpeg'}, function(err){
				 if(err){
					 return err.message;
				 }
			 });
			 // Concatenate url onto image url
			 project.worksheetStep.theWorksheet = 'https://s3-us-west-2.amazonaws.com/isslepictures/ProjectDrawings/' + req.files.file.name;
			 console.log('updating pic');
			 project.save(function(err) {
				 if (err) {
					 return res.status(400).send({
						 message: errorHandler.getErrorMessage(err)
					 });
				 } else {
					 res.jsonp(project);
				 }
			 });
			 console.log('done upload');
		 }
	 });
 };

 /**
 * Add Collaborator to Project
 */
 exports.addCollab = function(req, res) {
 	console.log(req.email);
 	res.json(req.email);

 	// User.find().where('email').equals(req.email).sort('-created').populate('user', 'displayName').exec(function(err, user) {
 	// 	if (err) {
 	// 		return res.status(400).send({
 	// 		message: errorHandler.getErrorMessage(err)
 	// 	});
 	// 	} else {
 	// 		res.jsonp(user);
 	// 	}
 	// });
 };

 exports.projectByID = function(req, res, next, id) { Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
 	if (err) return next(err);
 	if (! project) return next(new Error('Failed to load Project ' + id));
 	req.project = project ;
 	next();
 	});
};


/**
 * id by email
 */
exports.userByEmail = function (req, res, next, email) {
  //MAKE req.email work and plug into kow@c.com spot
  User.findOne({'email': email}, "displayName email").sort('-created').exec(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    req.email = user;
    next();
  });
};