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
var TailSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    timestamp: Date,
    coords: {
        lat: String,
        lon: String
    }
});

/**
 * Validations
 */
TailSchema.path('task').validate(function(task) {
    var result = fHelper.validatePresenceOf(task); 
    return result;
}, 'Task cannot be blank');

TailSchema.path('timestamp').validate(function(timpestamp) {
    var result = fHelper.validatePresenceOf(timestamp); 
    return result;
}, 'Timestamp cannot be blank');

/**
 * Statics
 */
TailSchema.statics.load = function(id, cb) {
    this.findOne({ _id: id }).populate('task').exec(cb);
};

mongoose.model('Tail', TailSchema);