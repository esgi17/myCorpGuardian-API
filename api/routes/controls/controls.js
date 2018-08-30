express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers');
const publicRoute = require('../public');
const publicConfig = require('../public/config');
const ControlsController = controllers.ControlsController;
const GroupController = require(publicConfig.controllers.group_path);
const DeviceTypeController = require(publicConfig.controllers.deviceType_path);
const UserController = require(publicConfig.controllers.user_path);
const EventController = require(publicConfig.controllers.event_path);
const StateController = require(publicConfig.controllers.state_path);
const DeviceController = require(publicConfig.controllers.device_path);
const DoorController = require(publicConfig.controllers.door_path);
const CaptorController = require(publicConfig.controllers.captor_path);
const PassController = require(publicConfig.controllers.pass_path);
const CameraController = require(publicConfig.controllers.camera_path);
const ScheduleController = require(publicConfig.controllers.schedule_path);
//const HomeController = controllers.HomeController;

const controlsRouter = express.Router();
controlsRouter.use(bodyParser.json());


controlsRouter.use(function ( req, res, next ){

  // Inserer un event
  // Si ok =>
  next();
},
function(req,res, next) {
  publicRoute.attach(controlsRouter);
  next();
});

/*
*  Récuperer l'id du device en passant sa reference
*   param : <string> ref_device => si vide, on renvoie une erreur
*   return : objet device
*/
controlsRouter.get('/', function(req, res) {
  const ref_device = req.query.ref_device;
  const door_id = req.query.door_id;
  const now  = new Date();
  let day = now.getDay();
  //const date = new Date('01 Jan 2000 ' + now.getHours().toString() + ':' + now.getMinutes().toString() + ':' + now.getSeconds().toString() + ' GMT');
  const date = new Date(Date.UTC(00, 0, 1, now.getHours(), now.getMinutes(), now.getSeconds(), 0));
  if( ref_device === undefined || door_id === undefined ) {
    res.status(400).json({
      success : false,
      status : 400,
      message : "Bad request "
    }).end();
  }
  DeviceController.getByReference(ref_device)
  .then( (device) => {

    if(device[0] !== undefined){
      PassController.find(device[0].dataValues.id)
      .then((pass) => {
        if(pass[0] !== undefined){
          UserController.getAll(pass[0].dataValues.user_id)
          .then((user) => {

            if(user[0] !== undefined){
              if (now.getDay() === 0){
                day = 7;
              }
              ScheduleController.getByGroupDoorDay(user[0].dataValues.group_id, door_id, day-1)
              .then((result) => {
                if (result[0] !== undefined){
                  let begin = new Date('01 Jan 1900 ' + result[0].dataValues.h_start + ' GMT');
                  let end = new Date('01 Jan 1900 ' + result[0].dataValues.h_stop + ' GMT');
                  if (begin.valueOf() <= date.valueOf() && date.valueOf() <= end.valueOf()){
                    EventController.add("Door Opened", undefined, device[0].dataValues.id, pass.id)
                    .then(() => {

                      res.status(202).end();
                    }).catch( (err) => {
                      console.error(err);
                      res.status(500).end();
                    });
                  }else{
                    EventController.add("Badging : out of Schedule", undefined, device[0].dataValues.id, pass.id)
                      .then(() => {
                        res.status(403).end();
                      })
                  }
                }else{
                  EventController.add("Badging : Schedule unassigned", undefined, device[0].dataValues.id, pass.id)
                    .then(() => {
                      res.status(403).end();

                    })
                }
              }).catch( (err) => {
                console.error(err);
                res.status(500).end();
              });
            }else{
              EventController.add("Badging : badge unassigned", undefined, device[0].dataValues.id, pass.id)
                .then(() => {
                  res.status(403).end();
                })
            }
          }).catch( (err) => {
            console.error(err);
            res.status(500).end();
          });
        }else{

          res.status(403).end();
        }
      }).catch( (err) => {
        console.error(err);
        res.status(500).end();
      });
    }else{
      DeviceController.add("BadgeUnknown", ref_device, 2)
      .then((added) => {
        PassController.add(added.dataValues.id)
        .then((pass) => {
          EventController.add("Unknown Badge", undefined, added.dataValues.id, pass.dataValues.id)
          .then(() => {
            res.status(422).end();

          }).catch( (err) => {
            console.error(err);
            res.status(500).end();
          });
        }).catch( (err) => {
          console.error(err);
          res.status(500).end();
        });
      }).catch( (err) => {
        console.error(err);
        res.status(500).end();
      });
    }
  }).catch( (err) => {
    console.error(err);
    res.status(500).end();
  });

});

controlsRouter.get('/state', function(req, res) {
  const captor = req.query.captor;

  if( captor === undefined) {
    res.status(400).json({
      success : false,
      status : 400,
      message : "Bad request ! "
    }).end();
  }
  StateController.getAll(1)
  .then( (state) => {
    CaptorController.getAll(captor)
    .then((answer) => {
      if(answer[0] !== undefined){

      if (state[0].dataValues.state == 1){

        EventController.add("Move detected on captor, Alarm", captor, answer[0].dataValues.device_id, undefined)
        .then((event) => {
          res.status(401).end();
        })
      }else{
        EventController.add("Move detected on captor, not Alarm", captor, answer[0].dataValues.device_id, undefined)
        .then(() => {
          res.status(200).end();
        })
      }
    }else{
      EventController.add("Captor not defined", captor, undefined, undefined)
        .then(() => {
          res.status(400).end();
        })
    }
    })
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

  DeviceController.add("DoorTest1", "BetonArmé", 1)
  .then((device) => {
    DoorController.add(device.id)
    .then(() => {
      DeviceController.add("DoorTest2", "Door", 1)
      .then((device) => {
        DoorController.add(device.id)
        .then(() => {
          DeviceController.add("CaptorTest1", "Detector", 2)
          .then((device) => {
            CaptorController.add(device.id)
            .then(() => {
              DeviceController.add("CaptorTest2", "DetectorToo", 2)
              .then((device) => {
                CaptorController.add(device.id)
                .then(() => {
                  DeviceController.add("Cam1", "HFW5431", 4)
                  .then((device) => {
                    CameraController.add("rtsp://admin:admin@192.168.1.108", device.id)
                    .then(() => {
                      DeviceController.add("PassTest1", "284", 3)
                      .then((device) => {
                        PassController.add(device.id )
                        .then((event) => {

                          res.status(200).json({
                            success : true,
                            status : 200,
                            datas : event
                          });
                        }).catch((err) => {
                          console.error(err);
                          res.status(500).end();
                        });
                      }).catch((err) => {
                        console.error(err);
                        res.status(501).end();
                      });
                    }).catch((err) => {
                      console.error(err);
                      res.status(502).end();
                    });
                  }).catch((err) => {
                    console.error(err);
                    res.status(503).end();
                  });
                }).catch((err) => {
                  console.error(err);
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
