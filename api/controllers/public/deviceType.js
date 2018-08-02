const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const DeviceTypeController = function() { };

/**
*  Creation d'un DeviceType en base
**/
DeviceTypeController.add = function(name) {
    return DeviceTypeController.sequelize.DeviceType.create({
        name: name
    });
};

/**
* Suppression d'un DeviceType en base
**/
DeviceTypeController.delete = function(id) {
    return DeviceTypeController.sequelize.DeviceType.destroy({
        where: {
            id : id
        }
    });
}

/**
*  Modification d'un DeviceType en base
**/
DeviceTypeController.update = function( id, name ) {
    return DeviceTypeController.sequelize.DeviceType.update({
        name: name
    },{
        where: {
            id : id
        }
    });
};

/**
*  Récupération des élements en base
**/
DeviceTypeController.getAll = function (id, name) {
    const options = {};
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }

    if( name !== undefined ) {
        where.name = {
            [Op.eq] : `${name}`
        }
    }
    options.where = where;
    return DeviceTypeController.sequelize.DeviceType.findAll(options);
};


// Export du controller
module.exports = DeviceTypeController;
