const express = require('express');
const bodyParser = require('body-parser');
const CorpController = require('../../controllers/general').CorpController;

const corpRouter = express.Router();
corpRouter.use(bodyParser.json());

corpRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    CorpController.getAll(id)
        .then( (corp) => {
            if( corp[0] !== undefined ) {
                res.status(200).json({
                    success : true,
                    status : 200,
                    datas : corp
                });
            } else {
                res.status(404).json({
                    success : false,
                    status : 404,
                    message : "Object not found"
                }).end();
            }
        })
        .catch( (err) => {
            console.log(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
        })
})

corpRouter.put('/:id', function(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const db_url = req.body.db_url;
    const db_name = req.body.db_name;
    const db_login = req.body.db_login;
    const db_pwd = req.body.db_pwd;
    if( id === undefined ) {
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad request !"
        }).end();
    }
    CorpController.getAll(id)
        .then( (corp) => {
            if( corp[0] !== undefined ) {
              console.log(corp[0].name);
              CorpController.update(id, name || corp[0].name, db_url || corp[0].db_url, db_name || corp[0].db_name, db_login || corp[0].db_login, db_pwd || corp[0].db_pwd)
                  .then( (user) => {
                      res.status(200).json({
                          success: true,
                          status : 200,
                          datas : user
                      })
                  })
                  .catch( (err) => {
                    console.log(err);
                    res.status(500).json({
                        success : false,
                        status : 500,
                        message : "500 Internal Server Error"
                    }).end();
                  });
            } else {
                res.status(404).json({
                    success: false,
                    status : 404,
                    message : "Object not found"
                });
            }
        })
        .catch( (err) => {
            console.log(err);
            res.status(500).json({
                success : false,
                status : 500,
                message : "500 Internal Server Error"
            }).end();
        })

})

corpRouter.post('/', function(req,res) {
    const name = req.body.name;
    const db_url = req.body.db_url;
    const db_name = req.body.db_name;
    const db_login = req.body.db_login;
    const db_pwd = req.body.db_pwd;

    if( name === undefined
      || db_url === undefined
      || db_name === undefined
      || db_login === undefined
      || db_pwd === undefined ) {
          res.status(400).json({
              success : false,
              status : 400,
              message : "Bad Request"
          }).end();
      }
      CorpController.add(name, db_url, db_name, db_login, db_pwd)
          .then( (corp) => {
                // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
                res.status(200).json({
                    success : true,
                    status : 200,
                    datas : corp
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
})

corpRouter.delete('/:id', function(req, res) {
    var id = req.params.id;
    if( id === undefined ) {
        res.status(400).json({
            success: false,
            status : 400,
            message : "Bad request"
        }).end();
        return;
    }
    CorpController.getAll(id)
        .then( (corp) => {
            if( corp[0] !== undefined ) {
                CorpController.delete(id)
                .then( (corp) => {
                  res.status(200).json({
                    success: true,
                    status : 200,
                    message : "Corp deleted"
                  })
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
})

module.exports = corpRouter;
