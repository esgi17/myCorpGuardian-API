const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const CaptorController = function() { };

/**
*  Creation d'un Captor en base
**/
CaptorController.add = function( device_id ) {
    const options = {};

    if (device_id !== undefined){
        options.device_id = device_id;
    }
    return CaptorController.sequelize.Captor.create(options);
};

/**
* Suppression d'un Captor en base
**/
CaptorController.delete = function(id) {
    return CaptorController.sequelize.Captor.destroy({
        where: {
            device_id : id
        }
    });
}


/**
*  Récupération des élements en base
**/
CaptorController.getAll = function (id) {
    const options = {};
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return CaptorController.sequelize.Captor.findAll(options);
};


// Export du controller
module.exports = CaptorController;
