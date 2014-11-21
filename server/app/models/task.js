/* jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fHelper = require('../utils/formatHelper');

/**
 * User Schema
 */
var TaskSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    createdAt:  { type: Date, default: Date.now },
    startedAt: Date,
    finishedAt: Date,
    failureReason: String,
    address: String,
    coords: {
        lat: String,
        lon: String
    },
    lastUpdate: {
        timestamp: Date,
        lat: String,
        lon: String,
    }
});

/**
 * Validations
 */
TaskSchema.path('owner').validate(function(owner) {
    var result = fHelper.validatePresenceOf(owner); 
    return result;
}, 'Owner cannot be blank');

TaskSchema.path('address').validate(function(address) {
    var result = fHelper.checkStringLen(address); 
    return result;
}, 'Address cannot be blank');

/**
 * Statics
 */
TaskSchema.statics.load = function(id, cb) {
    this.findOne({ _id: id }).populate('owner').exec(cb);
};

mongoose.model('Task', TaskSchema);