const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const CaptorController = require(publicConfig.controllers.captor_path);
const DeviceController = require(publicConfig.controllers.device_path);

const captorRouter = express.Router();
captorRouter.use(bodyParser.json());

/**
* @api {get} /Captor GET Captor
* @apiGroup captor
* @apiUse searchById
* @apiUse captorCreated
* @apiUse error500
*/
captorRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    CaptorController.getAll(id)
      .then( (captor) => {
        if (captor[0] !== undefined){
          res.status(200).json({
              success : true,
              status : 200,
              datas : captor
          });
        }else{
          res.status(206).json({
              success : true,
              status : 206,
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
* @api {post} /Captor ADD Captor
* @apiGroup captor
* @apiUse captorExample
* @apiUse captorCreated
* @apiUse error500
* @apiUse error206
* @apiUse error400
*/
captorRouter.post('/', function(req, res) {
    const name = req.body.name;
    const ref = req.body.ref;
    if (name === undefined || ref === undefined){
      // Renvoi d'une erreur
      res.status(400).json({
          success : false,
          status : 400,
          message : "Bad Request"
      }).end();
      return;
    }
    DeviceController.add(name, ref, 2)
      .then((device) => {
        CaptorController.add( device.id)
          .then((captor) => {
            res.status(200).json({
                success : true,
                status : 200,
                datas : captor
            });
          })
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

/**
* @api {delete} /captor DELETE Captor
* @apiGroup captor
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 Captor deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "Captor deleted"
*     }
* @apiUse error500
* @apiUse error206
* @apiUse error400
*/
captorRouter.delete('/:id', function (req, res) {
  var id = req.params.id;
  if (id === undefined){
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

      CaptorController.delete(device[0].id)
        .then( (captor) => {
          res.status(200).json({
              success : true,
              status : 200,
              message : "Captor deleted"
          });
        });
      })
    } else {
        res.status(206).json({
            success : true,
            status : 206,
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


module.exports = captorRouter;
