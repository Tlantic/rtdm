/* jslint node:true */
'use strict';

module.exports = function usersRoutes(app) {
    var users = require('../controllers/users');

    app.put('/users', users.create);                    // *** create user
    app.get('/users/:userId', users.getUser);           // *** get user info
    
    app.get('/users/list/all', users.listAll);           // *** get user info
    
    // Finish with setting up the user param
    app.param('userId', users.load);
};