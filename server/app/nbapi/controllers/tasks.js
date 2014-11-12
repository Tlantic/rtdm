/* jslint node: true */
'use strict';
var mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    mBuilder = require('../../utils/messageBuilder'),
    _ = require('lodash');

/**
 *
 */
exports.load = function (req, res, next, id) {

    if (req.method === 'PUT') {
        next();
    } else {
        Task.load(id, function (err, task) {

            if (err || !task) {
                return res.json( mBuilder.buildPreConditionFailure(id) );
            }

            req.loadedTask = task;
            next();
        });
    }
};

exports.checkOwnership = function (req, res, next, id) {
    if (id) {
        req.loadedOwner = id;
        next();
    } else {
        return res.json( mBuilder.buildPreConditionFailure('Ownership not found!') );
    }
};

/**
 *
 */
exports.getTask = function (req, res, next) {
    res.json(req.loadedTask);
};

exports.getTaskByOwner = function (req, res, next) {
    Task.where('owner',  req.loadedOwner).exec(function (err, tasks) {
        return res.json( mBuilder.buildQuickResponse(err, 'Error listing tasks!', tasks) );
    });
};

/**
 *
 */
exports.create = function (req, res) {
    var task = new Task(req.body),
        result;

    task.save( function saveUser(err, inserted) {
        result = mBuilder.buildQuickResponse(err);
        return res.json(result);
    });
};

/**
 *
 */
exports.update = function (req, res) {
    var task = req.loadedTask;

    // task = _.extend(task, req.body);
    if (task.startedAt==null || task.startedAt==undefined) {
        task.startedAt = Date.now();
    }
    task = _.extend(task, {
        lastUpdate: {
            timestamp: Date.now(),
            lat: req.body.lastCoords.lat,
            lon: req.body.lastCoords.lon
        }
    });

    task.save(function (err) {
        res.json( mBuilder.buildQuickResponse(err, 'Unexpected error updating task.', task) );
    });
};

exports.listAll = function (req, res) {
    Task.find({}, function(err, tasks) {
        return res.json( mBuilder.buildQuickResponse(err, 'Error listing tasks!', tasks) );
    });
};

exports.resetAll = function (req, res) {
    Task.find({}, function(err, tasks) {
        _.each(tasks, function(t) {
            t.lastUpdate.lat = null;
            t.lastUpdate.lon = null;
            t.startedAt = null;
            t.finishedAt = null;
            t.save();
        });
        return res.json( mBuilder.buildQuickResponse(err, 'Error nullifying tasks!', true) );
    });
};