/* jslint node: true */
'use strict ';

var fHelper = require('./formatHelper');

exports.buildQuickResponse = function buildQResp(err, msg, data) {
    var isFine = fHelper.isNullOrUndefined(err),
        result = { ok: isFine, result: data };
    if (!isFine) {
        result.error = {
            code: err.code,
            details: err.toString()
        };
        
        if (fHelper.checkStringLen(msg)) {
            result.error.message = msg;
        }
    }
    
    return result;
};


/**
 * PLEASE CHECK: http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */

// 400 - Bad Request
exports.buildBadRequest = function buildBadRequest() {
    return this.buildQuickResponse(400, 'Bad Request');
};

// 401 - Not Authorized
exports.buildNotAuthorized = function buildNotAuth() {
    return this.buildQuickResponse(401, 'Not authorized');
};

// 412 - Precondition Failed
exports.buildPreConditionFailure = function buildPCFailure(info) {
    return this.buildQuickResponse(412, 'Precondition Failed: The server does not meet one of the preconditions that the requester put on the request', info);
};