const RouteManager = function() { };

RouteManager.attach = function(app) {
    app.use('/admin', require('./admin'));
    app.use('/corp', require('./corp'));
}

module.exports = RouteManager;
