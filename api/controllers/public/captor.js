const publicConfig = require('./config');
const ModelIndex = require(publicConfig.models_path);
const Captor = ModelIndex.Captor;

const Op = ModelIndex.sequelize.Op;

const CaptorController = function() { };

/**
*  Creation d'un Captor en base
**/
CaptorController.add = function( device_id ) {
    const options = {};

    if (device_id !== undefined){
      options.device_id = device_id;
    }
    return Captor.create(options);
};

/**
* Suppression d'un Captor en base
**/
CaptorController.delete = function(id) {
  return Captor.destroy({
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
    return Captor.findAll(options);
};


// Export du controller
module.exports = CaptorController;
