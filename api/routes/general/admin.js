const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('../../controllers/general');
const AdminController = controllers.AdminController;

const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

adminRouter.get('/:id?', function(req, res) {
    // Récupération des parametres
    const id = req.params.id;
    // On appelle la methode
    AdminController.getAll(id)
      .then( (user) => {
          // Si la méthode ne renvoie pas d'erreur, on renvoie le resultat
          res.status(200).json({
              success : true,
              status : 200,
              datas : user
          });
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

adminRouter.post('/', function(req, res) {
    /* Récupération des parametres */
    const login = req.body.login;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin || 0;
    const corp_id = req.body.corp_id;

    // Si les parametres obligatoires ne sont pas tous remplis
    if( login === undefined || password === undefined) {
        // Renvoi d'une erreur
        res.status(400).json({
            success : false,
            status : 400,
            message : "Bad Request ! Missing parameters.."
        }).end();
        return;
    }
    // Sinon, on appelle la methode
    AdminController.add(login, password, isAdmin, corp_id)
      .then( (admin) => {
            // Si la methode ne renvoie pas d'erreur, on renvoie le résultat
            res.status(200).json({
                success : true,
                status : 200,
                datas : admin
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

module.exports = adminRouter;
