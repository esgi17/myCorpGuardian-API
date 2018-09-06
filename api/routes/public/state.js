const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const StateController = require(publicConfig.controllers.state_path);

const stateRouter = express.Router();
stateRouter.use(bodyParser.json());

stateRouter.get('/:id?', function(req,res){
    const id = req.params.id || 1;
    StateController.getAll(id)
    .then((state) => {
        if (state[0] !== undefined){
            res.status(200).json({
                success : true,
                status : 200,
                datas: state
            });
        }else{
            res.status(206).json({
                success : true,
                status : 206,
                datas : state,
                message : "Object not found"
            }).end();
            return;
        }
    }).catch((err) => {
        console.error(err);
        res.status(500).json({
            success : false,
            status : 500,
            message : "500 Internal Server Error"
        }).end()
        return;
    });
});

stateRouter.post('/', function(req,res) {
    const state = req.body.state;

    if (state === undefined){
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    StateController.add(state)
    .then((state) => {
        res.status(200).json({
            success: true,
            status: 200,
            datas: state
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

stateRouter.put('/', function(req,res){
    let state = req.body.state;
    if (state === undefined){
        res.status(400).json({
            success: false,
            status: 400,
            message: "Bad Request"
        }).end();
        return;
    }
    if (state === "true"){
        state = 1;
    }
    else if (state === "false"){
        state = 0;
    }else{
        res.status(400).json({
            success: false,
            status: 400,
            message: "Bad Request"
        }).end();
        return;
    }
    StateController.update(state)
    .then((state) => {
        res.status(200).json({
            success: true,
            status: 200,
            datas : state
        })
    }).catch((err) =>{
        console.error(err);
        res.status(500).json({
            success: false,
            status: 500,
            message: "500 Internal Server Error"
        }).end();
    });
});

module.exports = stateRouter;
