const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let config = require('../config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const controllers = require('../controllers/general');
const pControllers = require('../controllers/public');
const controlsRoute = require('./controls');
const publicRoute = require('./public');
const UserController = pControllers.UserController;
const StateController = pControllers.StateController;
const ScheduleController = pControllers.ScheduleController;
const PassController = pControllers.PassController;
const GroupController = pControllers.GroupController;
const EventController = pControllers.EventController;
const DoorController = pControllers.DoorController;
const DeviceTypeController = pControllers.DeviceTypeController;
const DeviceController = pControllers.DeviceController;
const CaptorController = pControllers.CaptorController;
const CameraController = pControllers.CameraController;
const AdminController = controllers.AdminController;
const ModelIndex = require('../models/public');



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
                  if( user.isAdmin == 0) {
                      AdminController.isAdmin = false;
                      config.private_bdd = {
                          host : user.corp.db_url,
                          dialect : 'mysql',
                          dbname : user.corp.db_name,
                          user : user.corp.db_login,
                          password : user.corp.db_pwd,
                          port : 3306
                      }
                      config.secret_user = 'my-super-secret';
                      var modelIndex = new ModelIndex();
                      modelIndex.init()
                          .then( (sequelize) => {
                              // Init des controllers

                              UserController.sequelize = sequelize;
                              StateController.sequelize = sequelize;
                              ScheduleController.sequelize = sequelize;
                              PassController.sequelize = sequelize;
                              GroupController.sequelize = sequelize;
                              EventController.sequelize = sequelize;
                              DoorController.sequelize = sequelize;
                              DeviceTypeController.sequelize = sequelize;
                              DeviceController.sequelize = sequelize;
                              CaptorController.sequelize = sequelize;
                              CameraController.sequelize = sequelize;


                              loginRouter.modelIndex = sequelize;
                              AdminController.isAdmin = false;
                              const payload = {
                                  admin : user.admin
                              };
                              var token = jwt.sign(payload, config.secret_user);
                              res.status(201).json({
                                  success: true,
                                  message: 'Token generated',
                                  token: token,
                                  isAdmin: user.isAdmin
                              });
                          })
                          .catch( (error) => {
                              console.error(error)
                          });
                    }
                    else {
                        AdminController.isAdmin = true;
                        const payload = {
                            admin : user.admin
                        };
                        var token = jwt.sign(payload, config.secret_admin);
                        res.status(201).json({
                            success: true,
                            message: 'Token generated',
                            token: token,
                            isAdmin: user.isAdmin
                        });
                    }
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
    console.log(token);
    if (AdminController.checkToken(token, config.secret_user)) {
          controlsRoute.attach(loginRouter);
          publicRoute.attach(loginRouter);
          next();
    } else if ( AdminController.checkToken(token, config.secret_admin) ) {

          next();
    } else {
          return res.status(401).send({
              success: false,
              message: 'No token or bad token provided.'
          });
      }
});


loginRouter.get('/logout', function(req, res) {
    const UserController = require('../controllers/public').UserController;
    UserController.disconnect();
})

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
