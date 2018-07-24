const publicConfig = require('./config');
const ModelIndex = require(publicConfig.models_path);
const Device = ModelIndex.Device;

const Op = ModelIndex.sequelize.Op;

const DeviceController = function() { };

/**
*  Creation d'un Device en base
**/
DeviceController.add = function(name, ref, deviceType) {
    const options = {};
    options.name = name;
    options.ref = ref;
    if (deviceType !== undefined){
      options.device_type_id = deviceType;
    }
    return Device.create(options);
};

/**
* Suppression d'un Device en base
**/
DeviceController.delete = function(id) {
  return Device.destroy({
    where: {
      id : id
    }
  });
}
DeviceController.getByReference = function(ref_device){
  const options = {
    include: [{
      model: ModelIndex.DeviceType,
      as : 'deviceType'
    }]
  };
  const where = {
    ref: ref_device
  };
  options.where = where;
  return Device.findAll(options)
}
/**
*  Récupération des élements en base
**/
DeviceController.getAll = function (id) {
    const options = {
      include: [{
        model: ModelIndex.DeviceType,
        as : 'deviceType'
      }]
    };
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return Device.findAll(options);
};


// Export du controller
module.exports = DeviceController;
