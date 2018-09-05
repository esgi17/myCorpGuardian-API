const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const CameraController = require(publicConfig.controllers.camera_path);
const DeviceController = require(publicConfig.controllers.device_path);

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
        if(camera[0] !== undefined){
            res.status(200).json({
                success : true,
                status : 200,
                datas : camera
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
* @api {post} /Camera ADD Camera
* @apiGroup camera
* @apiUse cameraExample
* @apiUse cameraCreated
* @apiUse error500
* @apiUse error206
* @apiUse error400
*/
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
* @apiUse error206
* @apiUse error400
*/
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
            res.status(206).json({
                success : true,
                status : 206,
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
* @apiUse error206
* @apiUse error400
*/
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
            res.status(206).json({
                success: true,
                status : 206,
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
