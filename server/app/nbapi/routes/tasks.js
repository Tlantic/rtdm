/* jslint node:true */
'use strict';

module.exports = function usersRoutes(app) {
    var tasks = require('../controllers/tasks');

    app.put('/tasks', tasks.create);
    app.post('/tasks/:taskId', tasks.update);
    app.get('/tasks/:taskId', tasks.getTask);
    app.delete('/tasks/:taskId', tasks.reset);
    
    app.get('/tasks/list/all', tasks.listAll);
    app.get('/tasks/reset/all', tasks.resetAll);
    
    app.get('/tasksByOwner/:ownerId', tasks.getTaskByOwner);
    
    
    // Finish with setting up the user param
    app.param('taskId', tasks.load);
    app.param('ownerId', tasks.checkOwnership);
};
