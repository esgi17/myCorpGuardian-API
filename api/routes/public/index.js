const privateRouteManager = function() { };

privateRouteManager.attach = function(app) {
    app.use('/group', require('./group'));
    app.use('/pass', require('./pass'));
    app.use('/schedule', require('./schedule'));
    app.use('/event', require('./event'));
    app.use('/door', require('./door'));
    app.use('/deviceType', require('./deviceType'));
    app.use('/user', require('./user'));
    app.use('/device', require('./device'));
    app.use('/captor', require('./captor'));
    app.use('/camera', require('./camera'));
    app.use('/state', require('./state'));
    app.use('/wall', require('./wall'));
    app.use('/download', require('./download'));
}

module.exports = privateRouteManager;
