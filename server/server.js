/* jslint node: true */

// Setting node environment vars in case they are not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// ***** LOADING GLOBALS *****
// NOTE: Avoid having too much objects in global context.
global.config  = require('./config/all.js');


// ***** Starting Server Modules *****

// logger block
var logger = require('./app/utils/plogger.js').getLogger(global.config.logging);
logger.info('Starting server blocks...');

// core block
var core = require('./app/core.js')(global.config.core, logger);
core.init();

// mongo database connection + model loading
var mongoose = require('mongoose'),
    db = mongoose.connect(global.config.db),
    lHelper = require('./app/utils/loadHelper.js');

lHelper.walk(global.config.root + '/app/models');



// routing block
var router = require('./app/router/router.js')(global.config.router, logger);
router.init(require('./config/express.js'));

// loading NBAPI
router.loadAPI('/app/nbapi/routes');


// publishing studio
router.app.use('/backoffice', require('express').static(__dirname + "/public"));
router.app.use('/mobileapp', require('express').static(__dirname + "/../mobile/cordova/rtdmma/src"));


// ***** Start the app by listening on <port> *****
// NOTE: The Http Port is set on config file, based on each target environment (development, test, etc...)

try {
    router.start();
    logger.info('Pegasus Application Server is up and flying...');
} catch (e) {
    logger.fatal(e);
} finally {
    // exporting app to node context
    exports = module.exports = router.app;
}



/*
// Configuring Express JS

app.listen(app.get('http_port'));


*/