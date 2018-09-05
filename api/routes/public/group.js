const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const GroupController = require(publicConfig.controllers.group_path);

const groupRouter = express.Router();
groupRouter.use(bodyParser.json());

/*
* Récupération des groupes
* @method : get
* @route : /group/
*/
groupRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    GroupController.getAll( id )
    .then( (group) => {
        if (group[0] !== undefined){

            res.status(200).json({
                success : true,
                status : 200,
                datas : group
            });
        }else{
            res.status(204).json({
                success : true,
                status : 204,
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

/*
* Ajout d'un groupe
* @method : post
* @route : /user/
*/
groupRouter.post('/', function(req, res) {
    const name = req.body.name;
    if( name === undefined ) {
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request"
        }).end();
        return;
    }
    GroupController.add(name)
    .then( (group) => {
        res.status(200).json({
            success : true,
            status : 200,
            datas : group
        });
    })
    .catch( (err) => {
        console.error(err);
        res.status(500).json({
            success : false,
            status : 500,
            message : "500 Internal Server Error"
        }).end();
    })
});

/*
* Suppression d'un groupe
* @method : delete
* @route : /group/
*/
groupRouter.delete('/:id', function (req, res) {
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
    GroupController.getAll(id)
    .then( (group) => {
        if (group[0] !== undefined) {
            GroupController.delete(id)
            .then( group => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    message : "Group deleted"
                });
            });
        } else {
            res.status(204).json({
                success : true,
                status : 204,
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

groupRouter.put('/', function(req,res) {
    const name = req.body.name;
    const id = req.body.id;
    if(name === undefined || id === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    GroupController.getAll(id)
    .then((group) => {
        if(group[0] !== undefined){
            GroupController.update(id, name)
            .then((group) => {
                res.status(200).json({
                    success : true,
                    status : 200,
                    message : "Group updated"
                });
            });
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
            message : "500 Internal Server Error"
        }).end();
    });
});


module.exports = groupRouter;
