/* jslint node: true */
'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    mBuilder = require('../../utils/messageBuilder'),
    _ = require('lodash');

