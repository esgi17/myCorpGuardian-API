const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const WallController = require(publicConfig.controllers.wall_path);

const wallRouter = express.Router();
wallRouter.use(bodyParser.json());

wallRouter.get('/:id?', function(req, res){
    const id = req.params.id;

    WallController.getAll(id)
        .then((wall) => {
            if (wall[0] !== undefined){
                res.status(200).json({
                    success: true,
                    status : 200,
                    datas: wall
                });
            }else{
                res.status(204).json({
                    success : true,
                    status: 204,
                    message: "Object not found"
                }).end();
                return;
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                status: 500,
                message: "500 Internal Server Error"
            }).end();
        });
});

wallRouter.post('/', function(req, res){
    const name = req.body.name;
    const x1 = req.body.x1 || "-10";
    const x2 = req.body.x2 || "-10";
    const y1 = req.body.y1 || "-10";
    const y2 = req.body.y2 || "-10";

    if (name === undefined || x1 === undefined || x2 === undefined || y1 === undefined|| y2 === undefined){
        res.status(400).json({
            success : false,
            status: 400,
            message: "Bad request"
        }).end();
        return;
    }
    WallController.add(name, x1, x2, y1, y2)
        .then((wall) => {
            res.status(200).json({
                success: true,
                status: 200,
                datas: wall
            });
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                status: 500,
                message: "500 Internal Server Error"
            }).end();
        });
});

wallRouter.delete('/:name', function(req, res){
    let name = req.params.name;
    if (name === undefined){
        res.status(400).json({
            success: false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    WallController.getByName(name)
        .then((wall) => {
            if (wall[0] !== undefined){
                WallController.delete(wall[0].id)
                    .then((wall)=> {

                    res.status(200).json({
                        success: true,
                        status: 200,
                        message: "Wall deleted"
                    });
                });
            }else{
                res.status(204).json({
                    success: true,
                    status: 204,
                    message: "Object not found"
                });
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                status: 500,
                message: "500 Internal Server Error"
            }).end();
        });
});

wallRouter.put('/', function(req, res){
    const id = req.body.id;
    const name = req.body.name;
    const x1 = req.body.x1;
    const x2 = req.body.x2;
    const y1 = req.body.y1;
    const y2 = req.body.y2;

    if (id === undefined){
        res.status(400).json({
            success: false,
            status: 400,
            message: "Bad Request"
        }).end();
        return;
    }
    WallController.getAll(id)
        .then((wall) => {
            if (wall[0] !== undefined){
                WallController.update(id, name || wall[0].name, x1 || wall[0].x1, x2 || wall[0].x2, y1 || wall[0].y1, y2 || wall[0].y2)
                    .then((rep) => {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            message: "Wall updated"
                        });
                    });
            }else{
                res.status(204).json({
                    success: true,
                    status : 204,
                    message: "Object not found"
                }).end();
                return;
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                status: 500,
                message: "500 Internal Server Error"
            }).end();
        });
});

module.exports = wallRouter;
