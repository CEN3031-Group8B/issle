'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  knox = require(path.resolve('./config/lib/knox.js')), // Require Knox for interfacing with AWS S3 photo store
  knoxClient = knox.knoxClient;                         

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  if (user) {
    // Grab image buffer from front-end controller and upload it to S3 store
    knoxClient.putBuffer(req.files.file.buffer, 'ProfilePictures/' + req.files.file.name,{'Content-Type': 'image/jpeg'},function(uploadError){
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        // Delete file previously used for profile picture
        knoxClient.deleteFile(user.profileImageURL.substring(user.profileImageURL.search('ProfilePictures/')),{'Content-Type': 'image/jpeg'}, function(err){
          if(err){
            return err.message;
          }
        });
        // Concatenate URL to file name
        user.profileImageURL = 'https://s3-us-west-2.amazonaws.com/isslepictures/ProfilePictures/' + req.files.file.name;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};


