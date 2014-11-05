/* jslint node:true */
'use strict';

module.exports = function usersRoutes(app) {
    var tasks = require('../controllers/tasks');

    app.put('/tasks', tasks.create);                    
    app.get('/tasks/:taskId', tasks.getTask);
    app.get('/tasksByOwner/:ownerId', tasks.getTaskByOwner);
    
    
    // Finish with setting up the user param
    app.param('taskId', tasks.load);
    app.param('ownerId', tasks.checkOwnership);
};