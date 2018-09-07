const express = require('express');
const bodyParser = require('body-parser');
const publicConfig = require('./config');
const PluginController = require(publicConfig.controllers.plugin_path);
const file_folder_path = 'file_folder/';

const downloadRouter = express.Router();
downloadRouter.use(bodyParser.json());

downloadRouter.get('/:id?', function(req, res) {
    const id = req.params.id;
    PluginController.getAll(id)
        .then( (plugin ) => {
            if( plugin[0] !== undefined ) {
                res.download(file_folder_path + plugin[0].name + ".jar");
            } else {
              res.status(206).json({
                  success : true,
                  status : 206,
                  datas : plugin,
                  message : "Object not found"
              }).end();
            }
        })
        .catch( (err) => {
            console.log(err);
        })


})

module.exports = downloadRouter;
