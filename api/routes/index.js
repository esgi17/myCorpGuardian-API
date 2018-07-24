const RouteManager = function() { };
const publicRouteManager = require('./public');
const generalRouteManger = require('./general');
const controlsRouteManger = require('./controls');

RouteManager.attach = function(app) {
    app.use(require('./authenticate'));
    generalRouteManger.attach(app);
    controlsRouteManger.attach(app);
    publicRouteManager.attach(app);
}

module.exports = RouteManager;
