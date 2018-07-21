const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const CameraController = require(publicConfig.controllers.camera_path);

const cameraRouter = express.Router();
cameraRouter.use(bodyParser.json());

/**
* @api {get} /Camera GET Camera
* @apiGroup camera
* @apiUse searchById
* @apiUse cameraCreated
* @apiUse error500
*/
cameraRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    CameraController.getAll(id)
      .then( (camera) => {
        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
        res.status(200).json({
            success : true,
            status : 200,
            datas : camera
        });
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
* @api {post} /Camera ADD Camera
* @apiGroup camera
* @apiUse cameraExample
* @apiUse cameraCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
cameraRouter.post('/', function(req, res) {
    const name = req.body.name;
    const ref = req.body.ref;
    const url = req.body.url;

    if( ip === undefined || type === undefined ) {
      // Renvoi d'une erreur
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
    }
    CameraController.add( ip, name, ref )
      .then( (camera) => {
        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
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
    });
});

/**
* @api {delete} /camera DELETE Camera
* @apiGroup camera
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 Camera deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "Camera deleted"
*     }
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
cameraRouter.delete('/:id', function (req, res) {
  var id = parseInt(req.params.id);
  CameraController.find(id)
  .then( (camera) => {
    if (camera) {
      CameraController.delete(id)
        .then( camera => {
            res.status(200).json({
                success : true,
                status : 200,
                message : "Camera deleted"
            });
        });
    } else {
      res.status(400).json({
          success : false,
          status : 400,
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

/**
* @api {put} /Camera UPDATE Camera
* @apiGroup camera
* @apiUse cameraExample
* @apiUse cameraCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
cameraRouter.put('/:id?', function(req, res) {
  const name = req.body.name;
  const ref = req.body.ref;
  const id = parseInt(req.params.id);

  CameraController.getAll(id)
    .then( (camera) => {
      if (camera) {
          CameraController.update( id, name, ref )
            .then( (camera) => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    datas : camera
                });
            });
      } else {
          res.status(400).json({
              success: false,
              status : 400,
              message : "Bad Request"
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
