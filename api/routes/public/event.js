const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const EventController = require(publicConfig.controllers.event_path);

const eventRouter = express.Router();
eventRouter.use(bodyParser.json());

/**
* @api {get} /Event GET Event
* @apiGroup event
* @apiUse searchById
* @apiUse eventCreated
* @apiUse error500
*/
eventRouter.get('/:id?', function(req, res) {
    var idEvent = req.params.id;
    var idPass = req.query.id_pass;
    var idDevice = req.query.id_device;
    EventController.getAll(idEvent, idPass, idDevice)
      .then( (event) => {
        if (event[0] !== undefined){
          res.status(200).json({
            success : true,
            status : 200,
            datas : event
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
          console.error(err);
          res.status(500).json({
              success : false,
              status : 500,
              message : "500 Internal Server Error"
          }).end();
      });
});

/**
* @api {post} /Event ADD Event
* @apiGroup event
* @apiUse eventExample
* @apiUse eventCreated
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
eventRouter.post('/', function(req, res) {
    //const date = req.body.date;
    const title = req.body.title;
    const device_id = req.body.device_id;
    const data = req.body.data;
    const pass_id = req.body.pass_id;

    if(  title === undefined ) {
      // Renvoi d'une erreur
      res.status(400).json({
          success : false,
          status : 400,
          message : "Bad Request"
      }).end();
      return;
    }
    EventController.add(  title, data, device_id, pass_id )
      .then( (event) => {
        // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
        res.status(200).json(event);
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
* @api {delete} /event DELETE Event
* @apiGroup event
* @apiUse searchById
* @apiSuccessExample
*    HTTP/1.1 200 Event deleted
*     {
*       "success" : true
*       "status": 200
*       "message": "Event deleted"
*     }
* @apiUse error500
* @apiUse error404
* @apiUse error400
*/
eventRouter.delete('/:id', function (req, res) {
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
  EventController.getAll(id)
  .then( (event) => {
    if (event[0] !== undefined) {
      EventController.delete(id)
        .then( (event) => {
          res.status(200).json({
              success : true,
              status : 200,
              message : "Event deleted"
          });
        });
    } else {
      res.status(400).json({
          success : false,
          status : 400,
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


module.exports = eventRouter;
