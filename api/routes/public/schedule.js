const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const ScheduleController = require(publicConfig.controllers.schedule_path);

const scheduleRouter = express.Router();
scheduleRouter.use(bodyParser.json());

/**
* @api {get} /Schedule GET Schedule
* @apiGroup schedule
* @apiUse searchById
* @apiUse scheduleCreated
* @apiUse error500
*/
scheduleRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    ScheduleController.getAll(id)
    .then( (schedule) => {
        if(schedule[0] !== undefined){

            // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
            res.status(200).json({
                success : true,
                status : 200,
                datas : schedule
            });
        }else{
            res.status(206).json({
                success : true,
                status : 206,
                datas : schedule,
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
* @api {post} /Schedule ADD Schedule
* @apiGroup schedule
* @apiUse scheduleExample
* @apiUse scheduleCreated
* @apiUse error500
* @apiUse error206
* @apiUse error400
*/
scheduleRouter.post('/', function(req, res) {
    const h_start = req.body.h_start;
    const h_stop = req.body.h_stop;
    const day = req.body.day;
    const door_id = req.body.door_id;
    const group_id = req.body.group_id;

    if( h_start === undefined || h_stop === undefined || day === undefined) {
        // Renvoi d'une erreur
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
        return;
    }
    ScheduleController.add( h_start, h_stop, day, door_id, group_id )
    .then( (schedule) => {
        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
        res.status(200).json({
            success : true,
            status : 200,
            datas : schedule
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
* @api {delete} /schedule DELETE Schedule
* @apiGroup schedule
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 Schedule deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "Schedule deleted"
*     }
* @apiUse error500
* @apiUse error206
* @apiUse error400
*/
scheduleRouter.delete('/:id', function (req, res) {
    var id = req.params.id;
    if (id === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
        return;
    }
    ScheduleController.getAll(id)
    .then( (schedule) => {
        if (schedule[0] !== undefined) {
            ScheduleController.delete(id)
            .then( schedule => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    message : "Schedule deleted"
                });
            });
        } else {
            res.status(206).json({
                success : true,
                status : 206,
                datas : schedule,
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
* @api {put} /Schedule UPDATE Schedule
* @apiGroup schedule
* @apiUse scheduleExample
* @apiUse scheduleCreated
* @apiUse error500
* @apiUse error206
* @apiUse error400
*/
scheduleRouter.put('/', function(req, res) {
    const h_start = req.body.h_start;
    const h_stop = req.body.h_stop;
    const day = req.body.day;
    const door_id = req.body.door_id;
    const group_id = req.body.group_id;
    const id = req.body.id;
    if (h_start === undefined || h_stop === undefined
        || day === undefined
        || id === undefined){
            res.status(400).json({
                success : false,
                status : 400,
                message : "Bad Request"
            }).end();
            return;
        }
        ScheduleController.getAll(id)
        .then( (schedule) => {
            if (schedule[0] !== undefined) {
                ScheduleController.update( id, h_start, h_stop, day, door_id, group_id )
                .then( (schedule) => {
                    res.status(200).json({
                        success : true,
                        status : 200,
                        datas : schedule
                    });
                });
            } else {
                res.status(206).json({
                    success: true,
                    status : 206,
                    datas : schedule,
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

    module.exports = scheduleRouter;
