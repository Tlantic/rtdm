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
var UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        unique: true
    }
});

/**
 * Validations
 */
UserSchema.path('name').validate(function(name) {
    var result = fHelper.checkStringLen(name); 
    return result;
}, 'Name cannot be blank');

UserSchema.path('username').validate(function(username) {
    var result = fHelper.checkStringLen(username); 
    return result;
}, 'Username cannot be blank');

/**
 * Statics
 */
UserSchema.statics.load = function(id, cb) {
    this.findOne({ _id: id }).exec(cb);
};

mongoose.model('User', UserSchema);