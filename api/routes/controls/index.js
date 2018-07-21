const RouteManager = function() { };
const publicRouteManager = require('../public');
const generalRouteManger = require('../general');

RouteManager.attach = function(app) {
    //app.use('/',)
    app.use('/controls', require('./controls'));
    publicRouteManager.attach(app);

}

module.exports = RouteManager;
