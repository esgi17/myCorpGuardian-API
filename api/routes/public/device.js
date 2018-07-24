const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const DeviceController = require(publicConfig.controllers.device_path);

const deviceRouter = express.Router();
deviceRouter.use(bodyParser.json());

/**
* @api {get} /Device GET Device
* @apiGroup device
* @apiUse searchById
* @apiUse deviceCreated
* @apiUse error500
*/
deviceRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    const device_type_id = req.query.device_type_id;
    DeviceController.getAll(id, device_type_id)
      .then( (device) => {
        if (device[0] !== undefined){

        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
          res.status(200).json({
            success : true,
            status : 200,
            datas : device
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

/**
* @api {post} /Device ADD Device
* @apiGroup device
* @apiUse deviceExample
* @apiUse deviceCreated
* @apiUse error500
* @apiUse error404
*/
deviceRouter.post('/', function(req, res) {
    const name = req.body.name;
    const ref = req.body.ref;
    const deviceType = req.body.deviceType;
    if (name === undefined || ref === undefined){
      // Renvoi d'une erreur
      res.status(400).json({
          success : false,
          status : 400,
          message : "Bad Request"
      }).end();
      return;
    }
    DeviceController.add(name, ref, deviceType)
      .then( (device) => {
        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
        res.status(200).json({
            success : true,
            status : 200,
            datas : device
        });
    }).catch( (err) => {
        // Sinon, on renvoie un erreur systeme
        console.error(err);
        res.status(500).json({
            success : false,
            status : 500,
            message : "500 Internal Server Error"
        }).end();
    });
});

/**
* @api {delete} /device DELETE Device
* @apiGroup device
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 Device deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "Device deleted"
*     }
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
deviceRouter.delete('/:id', function (req, res) {
  var id = req.params.id;
  if (id === undefined){
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
        .then( device => {
          res.status(200).json({
              success : true,
              status : 200,
              message : "Device deleted"
          });
        });
    } else {
      res.status(404).json({
          success : false,
          status : 404,
          message : "Object not found"
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


module.exports = deviceRouter;
