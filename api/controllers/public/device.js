const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const DeviceController = function() { };

/**
*  Creation d'un Device en base
**/
DeviceController.add = function(name, ref, deviceType, x, y) {
    const options = {};
    options.name = name;
    options.ref = ref;
    if (deviceType !== undefined){
        options.device_type_id = deviceType;
    }
    if (x !== undefined){
        options.x = x;
    }
    if (y !== undefined){
        options.y = y;
    }
    return DeviceController.sequelize.Device.create(options);
};

/**
* Suppression d'un Device en base
**/
DeviceController.delete = function(id) {
    return DeviceController.sequelize.Device.destroy({
        where: {
            id : id
        }
    });
}

DeviceController.getByName = function(name){
    const options = {
    };
    const where = {
        name: name
    };
    options.where = where;
    return DeviceController.sequelize.Device.findAll(options);
}
/**
*  Récupération des élements en base
**/

DeviceController.update = function(name, ref, x, y){
    return DeviceController.sequelize.Device.update({
        ref: ref,
        x: x,
        y: y
    },{
        where: {
            name: name
        }
    });
}
DeviceController.getAll = function (id, device_type_id) {
    const options = {
        include: [{
            model: DeviceController.sequelize.DeviceType,
            as : 'deviceType'
        }]
    };
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }

    if( device_type_id !== undefined ) {
        where.device_type_id = {
            [Op.eq] : `${device_type_id}`
        }
    }

    options.where = where;
    return DeviceController.sequelize.Device.findAll(options);
};


// Export du controller
module.exports = DeviceController;
