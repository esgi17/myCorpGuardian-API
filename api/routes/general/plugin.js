const express = require('express');
const bodyParser = require('body-parser');
const PluginController = require('../../controllers/general').PluginController;

const pluginRouter = express.Router();
pluginRouter.use(bodyParser.json());

pluginRouter.get('/:id?', function(req,res){
    const id = req.params.id;
    PluginController.getAll(id)
        .then((plugin) => {
            if (plugin[0] !== undefined){
                res.status(200).json({
                    success : true,
                    status : 200,
                    datas : plugin
                });
            }else{
                res.status(206).json({
                    success : true,
                    status : 206,
                    message : "Object not found"
                }).end();
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
        })
})

pluginRouter.put('/:id', function(req,res){
    const id = req.params.id;
    const name = req.body.name;

    if (id === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
    }
    PluginController.getAll(id)
        .then( (plugin) => {
            if (plugin[0] !== undefined){
                PluginController.update(id, name || plugin[0].name)
                    .then((rep) => {
                        res.status(200).json({
                            success : true,
                            status : 200,
                            datas : rep
                        })
                    })
                    .catch( (err) => {
                        console.error(err);
                        res.status(500).json({
                            success : false,
                            status : 500,
                            message : "500 Internal Server Error"
                        }).end();
                    });
            }else{
                res.status(206).json({
                    success : true,
                    status : 206,
                    message : "Object not found"
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
        })
})

pluginRouter.post('/', function(req,res){
    const name = req.body.name;

    if (name === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
    }
    PluginController.add(name)
        .then( (plugin) => {
            res.status(200).json({
                success : true,
                status : 200,
                datas : plugin
            });
        }).catch( (err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "Internal Server Error"
            }).end();
        });
})

pluginRouter.delete('/:id', function(req, res) {
    let id = req.params.id;
    if (id === undefined ){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    PluginController.getAll(id)
        .then((plugin) => {
            if (plugin[0] !== undefined){
                PluginController.delete(id)
                    .then((rep) => {
                        res.status(200).json({
                            success : true,
                            status : 200,
                            message : "Plugin deleted"
                        })
                    })
            }else{
                res.status(206).json({
                    success : true,
                    status :  206,
                    message : "Object not found"
                });
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "Internal Server Error"
            }).end();
        });
})

module.exports = pluginRouter;
