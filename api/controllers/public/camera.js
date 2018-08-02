const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const CameraController = function() { };

/**
*  Récupération des élements en base
**/
CameraController.getAll = function (id) {
    const options = {};
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return CameraController.sequelize.Camera.findAll(options);
};

/**
*  Creation d'un groupe
**/
CameraController.add = function(url, device_id ) {
    const options = {};
    options.url = url;
    if (device_id !== undefined){
        options.device_id = device_id;
    }
    return CameraController.sequelize.Camera.create(options);
};

/**
* Suppression d'un groupe
**/
CameraController.delete = function ( id ) {
    return CameraController.sequelize.Camera.destroy({
        where: {
            id : id
        }
    });
}

/**
*  Modification d'une porte en base
**/
CameraController.update = function( id,url) {
    return CameraController.sequelize.Camera.update({
        url: url
    },{
        where: {
            id : id
        }
    });
};


// Export du controller
module.exports = CameraController;
