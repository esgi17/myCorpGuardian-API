const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const CameraController = require(publicConfig.controllers.camera_path);
const DeviceController = require(publicConfig.controllers.device_path);

const cameraRouter = express.Router();
cameraRouter.use(bodyParser.json());


cameraRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    CameraController.getAll(id)
      .then( (camera) => {
        if(camera[0] !== undefined){

        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
        res.status(200).json({
            success : true,
            status : 200,
            datas : camera
        });
      }else{
        res.status(404).json({
            success : false,
            status : 404,
            message : "Object not found"
        }).end();
      }
      })
      .catch( (err) => {
          console.error(err);
          res.status(500).json({
              success : false,
              status : 500,
              message : "500 Internal Server Error"
          }).end();
      });
});


cameraRouter.post('/', function(req, res) {
    const name = req.body.name;
    const ref = req.body.ref;
    const url = req.body.url;

    if( name === undefined || ref === undefined  || url == undefined) {
      // Renvoi d'une erreur
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
        return;
    }
    DeviceController.add(name, ref, 4)
      .then((device) => {
        CameraController.add(url, device.id)
          .then((camera) => {
            res.status(200).json({
              success : true,
              status : 200,
              datas : camera
            });
          }).catch( (err) => {
              // Sinon, on renvoie un erreur systeme
              console.error(err);
              res.status(500).json({
                  success : false,
                  status : 500,
                  message : "500 Internal Server Error"
              }).end();
    })
    .catch( (err) => {
        // Sinon, on renvoie un erreur systeme
        console.error(err);
        res.status(500).json({
            success : false,
            status : 500,
            message : "500 Internal Server Error"
        }).end();
    });
  });
});

cameraRouter.delete('/:id', function (req, res) {
  var id = req.params.id;
  if(id === undefined){
    // Renvoi d'une erreur
    res.status(400).json({
        success : false,
        status : 400,
        message : "Bad Request"
    }).end();
    return;
  }
  DeviceController.getAll(id)
  .then( (device) => {
    if (device[0] !== undefined) {
      DeviceController.delete(id)
        .then(() => {

      CameraController.delete(device[0].id)
        .then( (camera) => {
            res.status(200).json({
                success : true,
                status : 200,
                message : "Camera deleted"
            });
        });
      })
    } else {
      res.status(404).json({
          success : false,
          status : 404,
          message : "Camera not found"
      }).end();
    }
    }).catch( (err) => {
        console.error(err);
        res.status(500).json({
            success : false,
            status : 500,
            message : "500 Internal Server Error"
        }).end();
    });
});


cameraRouter.put('/', function(req, res) {
  const url = req.body.url;
  const id = req.body.id;

  CameraController.getAll(id)
    .then( (camera) => {
      if (camera[0] !== undefined) {
          CameraController.update( id, url )
            .then( (camera) => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    datas : camera
                });
            });
      } else {
          res.status(404).json({
              success: false,
              status : 404,
              message : "Object not found"
          });
      }
    }).catch( (err) => {
        console.error(err);
        res.status(500).json({
            success : false,
            status : 500,
            message : "500 Internal Server Error"
        }).end();
    });
});

module.exports = cameraRouter;
