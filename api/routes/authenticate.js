const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let config = require('../config');
const controllers = require('../controllers/general');
const controlsRoute = require('./controls');
const publicRoute = require('./public');
const AdminController = controllers.AdminController;

const loginRouter = express.Router();
loginRouter.use(bodyParser.urlencoded({
    extended: true
}));
loginRouter.use(bodyParser.json());

/**
* Route de connexion
* POST => /
* <string>login, <string>password
*/
loginRouter.post('/', function(req,res) {
    const login = req.body.login;
    const password = req.body.password;
    if( login === undefined || password === undefined ) {
        res.status(400).json({
            success : false,
            message : 'Bad request ! Missing parameters..'
        }).end();
        return;
    }
    AdminController.exist(req.body.login)
      .then( (user) => {
        if(!user) {
            res.status(404).json({
                success: false,
                message: 'Authentication failed. User not found' });
            } else if (user) {
                if( !AdminController.verifyPassword(req.body.password, user.password)) {
                    res.status(404).json({
                        success: false,
                        message: 'Authenfication failed. Wrong password'
                    });
                } else {
                  const payload = {
                      admin : user.admin
                  };
                  var token = jwt.sign(payload, config.secret);
                  res.status(201).json({
                      success: true,
                      message: 'Token generated',
                      token: token
                  });
                }
            }
        })
});

/*
* Middleware de vérification de l'authentification
* <string> token
*/
loginRouter.use(function(req,res,next) {
    // Vérification du token
    var token = req.body.token || req.query.token || req.headers['authorization'];
    if (AdminController.checkToken(token)) {
        controlsRoute.attach(loginRouter);
        next();
    } else {
        return res.status(401).send({
            success: false,
            message: 'No token or bad token provided.'
        });
    }
});

/**
* Route de vérification de la connexion
* Si retour OK => alors la requete a passée le middleware et donc on est authentifié
*/
loginRouter.get('/', function(req, res) {
    return res.status(200).send({
        success : true,
        message : "connected"
    })
});

module.exports = loginRouter;
