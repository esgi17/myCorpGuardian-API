const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
//const publicRoute = require('../public');
const publicConfig = require('../public/config');
const ControlsController = controllers.ControlsController;
const GroupController = require(publicConfig.controllers.group_path);
const deviceTypeController = require(publicConfig.controllers.deviceType_path);
const userController = require(publicConfig.controllers.user_path);
const eventController = require(publicConfig.controllers.event_path);
const stateController = require(publicConfig.controllers.state_path);
const DeviceController = require(publicConfig.controllers.device_path);
const DoorController = require(publicConfig.controllers.door_path);
const CaptorController = require(publicConfig.controllers.captor_path);
const PassController = require(publicConfig.controllers.pass_path);
const CameraController = require(publicConfig.controllers.camera_path);
//const HomeController = controllers.HomeController;

const controlsRouter = express.Router();
controlsRouter.use(bodyParser.json());

controlsRouter.use(function ( req, res, next ){
  console.log("Insert event");
  // Inserer un event
  // Si ok =>
  next();
},
function(req,res, next) {

  console.log("yo3");
  //publicRoute.attach(controlsRouter);

  console.log("yo4");
  next();
});

/*
*  Récuperer l'id du device en passant sa reference
*   param : <string> ref_device => si vide, on renvoie une erreur
*   return : objet device
*/
controlsRouter.get('/', function(req, res) {
  const ref_device = req.params.ref_device;
  if( ref_device === undefined ) {
    res.status(400).json({
      success : false,
      status : 400,
      message : "Bad request ! "
    }).end();
  }
  DevicesController.getByReference(ref_device)
  .then( (device) => {
    res.status(200).json({
      success : true,
      status : 200,
      datas : device
    });
  })
  .catch( (err) => {
    res.status(500).end();
  });
});

controlsRouter.get('/deviceType', function(req, res) {
  const id_device = req.params.id_device;
  if( id_device === undefined ) {
    res.status(400).json({
      success : false,
      status : 400,
      message : "Bad request ! "
    }).end();
  }
  DevicesController.getType(id_device)
  .then( (deviceType) => {
    res.status(200).json({
      success : true,
      status : 200,
      datas : deviceType
    });
  })
  .catch( (err) => {
    res.status(500).end();
  });
});

controlsRouter.post('/', function(req, res){
  const groupname = req.body.groupname || "host";
  const firstDevice = req.body.firstDevice || "Door";
  const secondDevice = req.body.secondDevice || "Captor";
  const thirdDevice = req.body.thirdDevice || "Pass";
  const fourthDevice = req.body.fourthDevice || "Camera";

  DeviceController.add("DoorTest1", "BetonArméMaggle", 1)
  .then((device) => {
    DoorController.add(device.id)
    .then(() => {
      DeviceController.add("DoorTest2", "XDoorPredator", 1)
      .then((device) => {
        DoorController.add(device.id)
        .then(() => {
          DeviceController.add("CaptorTest1", "XxDetectorxX", 2)
          .then((device) => {
            CaptorController.add(device.id)
            .then(() => {
              DeviceController.add("CaptorTest2", "XxDetectorTooxX", 2)
              .then((device) => {
                CaptorController.add(device.id)
                .then(() => {
                  DeviceController.add("Cam1", "HFW5431", 4)
                  .then((device) => {
                    CameraController.add("rtsp://admin:admin@192.168.1.108", device.id)
                    .then(() => {
                      DeviceController.add("PassTest1", "284", 3)
                      .then((device) => {
                        PassController.add("12893", "1", device.id )
                        .then((event) => {

                          res.status(200).json({
                            success : true,
                            status : 200,
                            datas : event
                          });
                        }).catch((err) => {
                          console.log(err);
                          res.status(500).end();
                        });
                      }).catch((err) => {
                        console.log(err);
                        res.status(501).end();
                      });
                    }).catch((err) => {
                      console.log(err);
                      res.status(502).end();
                    });
                  }).catch((err) => {
                    console.log(err);
                    res.status(503).end();
                  });
                }).catch((err) => {
                  console.log(err);
                  res.status(504).end();
                });
              }).catch((err) => {
                res.status(505).end();
              });
            }).catch((err) => {
              res.status(506).end();
            });

          }).catch((err) => {
            res.status(507).end();
          });
        }).catch((err) => {
          res.status(508).end();
        });
      }).catch((err) => {
        res.status(509).end();
      });
    }).catch((err) => {
      res.status(510).end();
    });
  }).catch((err) => {
    res.status(511).end();
  });
});


module.exports = controlsRouter;
