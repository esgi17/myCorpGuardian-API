const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const DeviceTypeController = require(publicConfig.controllers.deviceType_path);

const deviceTypeRouter = express.Router();
deviceTypeRouter.use(bodyParser.json());

/**
* @api {get} /DeviceType GET DeviceType
* @apiGroup deviceType
* @apiUse searchById
* @apiUse deviceTypeCreated
* @apiUse error500
*/
deviceTypeRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    const name = req.query.name;
    DeviceTypeController.getAll(id, name)
      .then( (deviceType) => {
        if(deviceType[0] !== undefined){

          // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
          res.status(200).json({
            success : true,
            status : 200,
            datas : deviceType
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
* @api {post} /DeviceType ADD DeviceType
* @apiGroup deviceType
* @apiUse deviceTypeExample
* @apiUse deviceTypeCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
deviceTypeRouter.post('/', function(req, res) {
    const name = req.body.name;

    if( name === undefined ) {
      // Renvoi d'une erreur
      res.status(400).json({
          success : false,
          status : 400,
          message : "Bad Request"
      }).end();
      return;
    }
    DeviceTypeController.add( name )
      .then( (deviceType) => {
        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
        res.status(200).json({
            success : true,
            status : 200,
            datas : deviceType
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
* @api {delete} /deviceType DELETE DeviceType
* @apiGroup deviceType
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 DeviceType deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "DeviceType deleted"
*     }
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
deviceTypeRouter.delete('/:id', function (req, res) {
  var id = req.params.id;
  if( id === undefined) {
      // Renvoi d'une erreur
      res.status(400).json({
          success : false,
          status : 400,
          message : "Bad Request"
      }).end();
      return;
  }
  DeviceTypeController.getAll(id)
  .then( (deviceType) => {
    if (deviceType[0] !== undefined) {
      DeviceTypeController.delete(id)
        .then( (deviceType) => {
          res.status(200).json({
              success : true,
              status : 200,
              message : "DeviceType deleted"
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

/**
* @api {put} /DeviceType UPDATE DeviceType
* @apiGroup deviceType
* @apiUse deviceTypeExample
* @apiUse deviceTypeCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
deviceTypeRouter.put('/', function(req, res) {
  const name = req.body.name;
  const id = req.body.id;
  if (name === undefined || id === undefined){
    res.status(400).json({
        success : false,
        status : 400,
        message : "Bad Request"
    }).end();
    return;
  }
  DeviceTypeController.getAll(id)
    .then( (deviceType) => {
      if (deviceType[0] !== undefined) {
          DeviceTypeController.update(id, name )
            .then( (deviceType) => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    message : "deviceType updated"
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

module.exports = deviceTypeRouter;
