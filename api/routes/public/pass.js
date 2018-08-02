const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const PassController = require(publicConfig.controllers.pass_path);
const DeviceController = require(publicConfig.controllers.device_path);
//const HomeController = controllers.HomeController;

const passRouter = express.Router();
passRouter.use(bodyParser.json());

/**
* @api {get} /Pass GET Pass
* @apiGroup pass
* @apiUse searchById
* @apiUse passCreated
* @apiUse error500
* @apiUse error404
*/
passRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    PassController.getAll(id)
    .then( (pass) => {
        if (pass[0] !== undefined){
            res.status(200).json({
                success : true,
                status : 200,
                datas : pass
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
* @api {post} /Pass ADD Pass
* @apiGroup pass
* @apiUse passExample
* @apiUse passCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
passRouter.post('/', function(req, res) {
    const name = req.body.name;
    const ref = req.body.ref;
    //const user_id = req.body.user_id;
    //const id = req.body.id;
    if( name === undefined || ref === undefined) {
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
        return;
    }
    DeviceController.add(name, ref, 3)
    .then((device) => {
        PassController.add( device.id)
        .then((pass) => {
            res.status(200).json({
                success : true,
                status : 200,
                datas : pass
            });
        }).catch( (err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
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
* @api {delete} /pass DELETE Pass
* @apiGroup pass
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 Pass deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "Pass deleted"
*     }
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
passRouter.delete('/:id', function (req, res) {
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
    PassController.getAll(id)
    .then( (pass) => {
        if (pass[0] !== undefined) {
            DeviceController.delete(id)
            .then(() => {

                PassController.delete(pass[0].id)
                .then( pass => {
                    res.status(200).json({
                        success : true,
                        status : 200,
                        message : "Pass deleted"
                    });
                });
            })
        } else {
            res.status(404).json({
                success : false,
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

/**
* @api {put} /Pass UPDATE Pass
* @apiGroup pass
* @apiUse passExample
* @apiUse passCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
passRouter.put('/', function(req, res) {
    const user_id = req.body.user_id;
    const id = req.body.id;
    if (id === undefined || user_id === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
        return;
    }
    PassController.getAll(id)
    .then( (user) => {
        if (user[0] !== undefined) {
            PassController.affect(id, user_id)
            .then( user => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    message : "Pass updated"
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


module.exports = passRouter;
