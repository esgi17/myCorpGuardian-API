const RouteManager = function() { };

RouteManager.attach = function(app) {
    app.use('/admin', require('./admin'));
    app.use('/corp', require('./corp'));
    app.use('/plugin', require('./plugin'));
    app.use('/pluginAssociation', require('./pluginAssociation'));
}

module.exports = RouteManager;
