/* jslint node: true */
'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    mBuilder = require('../../utils/messageBuilder'),
    _ = require('lodash');

/**
 *
 */
exports.load = function (req, res, next, id) {

    if (req.method === 'PUT') {
        next();

    } else {

        User.load(id, function (err, user) {

            if (err || !user) {
                return res.json( mBuilder.buildPreConditionFailure(id) );
            }

            req.loadedUser = user;
            next();
        });
    }
};

/**
 *
 */
exports.getUser = function (req, res, next) {
    res.json(req.loadedUser);
};

/**
 *
 */
exports.create = function (req, res) {
    var user = new User(req.body),
        result;

    user.save( function saveUser(err, inserted) {
        result = mBuilder.buildQuickResponse(err);
        return res.json(result);
    });
};


exports.listAll = function (req, res) {
    User.find({}, function(err, users) {
        return res.json( mBuilder.buildQuickResponse(err, 'Error listing users!', users) );
    });
};