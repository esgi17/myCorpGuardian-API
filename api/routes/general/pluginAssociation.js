const express = require('express');
const bodyParser = require('body-parser');
const PluginAssociationController = require('../../controllers/general').PluginAssociationController;

const pluginAssociationRouter = express.Router();
pluginAssociationRouter.use(bodyParser.json());

pluginAssociationRouter.get('/:id?', function(req, res){
    const id = req.params.id;
    const plugin_id = req.query.plugin_id;
    const corp_id = req.query.corp_id;
    PluginAssociationController.getAll(id, corp_id,plugin_id)
        .then((plugin) => {
            if (plugin[0] !== undefined){
                res.status(200).json({
                    success : true,
                    status : 200,
                    datas : plugin
                });
            }else{
                res.status(204).json({
                    success : true,
                    status : 204,
                    message : "Object not found"
                }).end();
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status: 500,
                message : "500 Internal Server Error"
            }).end();
        })
})

pluginAssociationRouter.put('/:id?', function(req,res){
    const id = req.params.id;
    const right = req.body.right;
    const installed = req.body.installed;
    const corp_id = req.body.corp_id;
    const plugin_id = req.body.plugin_id;

    if (id === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    PluginAssociationController.getAll(id)
        .then((plugin) => {
            if(plugin[0] !== undefined){
                console.log(plugin[0]);
                PluginAssociationController.update(id, right || plugin[0].right, installed || plugin[0].installed, corp_id || plugin[0].corp_id, plugin_id || plugin[0].plugin_id)
                    .then((rep) =>{
                        res.status(200).json({
                            success: true,
                            status : 200,
                            datas : rep
                        })
                    }).catch((err) =>{
                        console.error(err);
                        res.status(500).json({
                            success : false,
                            status: 500,
                            message : "500 Internal Server Error"
                        }).end();
                    });
            }else{
                res.status(204).json({
                    success: true,
                    status: 204,
                    message : "Object not foud"
                });
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
        })
})

pluginAssociationRouter.post('/', function(req, res){
    const right = req.body.right;
    const installed = req.body.installed;
    const corp_id = req.body.corp_id;
    const plugin_id = req.body.plugin_id;

    if (right === undefined || installed === undefined ||corp_id === undefined || plugin_id === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    PluginAssociationController.add(right, installed, corp_id, plugin_id)
        .then((plugin) =>{
            res.status(200).json({
                success: true,
                status: 200,
                datas: plugin
            });
        }).catch((err) => {
            console.error(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
        });
})

pluginAssociationRouter.delete('/:id', function(req, res){
    let id = req.params.id;
    if (id === undefined){
        res.status(400).json({
            success: false,
            status : 400,
            message: "Bad request"
        }).end();
        return;
    }
    PluginAssociationController.getAll(id)
        .then((plugin) => {
            if (plugin[0] !== undefined){
                PluginAssociationController.delete(id)
                    .then((rep) => {
                        res.status(200).json({
                            success : true,
                            status: 200,
                            message : "Plugin deleted"
                        })
                    })
            }else{
                res.status(204).json({
                    success : true,
                    status : 204,
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

module.exports = pluginAssociationRouter;
