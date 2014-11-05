/* jslint node: true */
'use strict ';

exports.validatePresenceOf = function validatePresenceOf(value) {
    return value && value.length;
};

exports.checkStringLen = function checkStringLen(field) {
    return (typeof field === 'string' && field.length > 0);
};

exports.isNullOrUndefined = function isNullOrUndefined(obj) {
    return (obj === undefined || obj === null);
};