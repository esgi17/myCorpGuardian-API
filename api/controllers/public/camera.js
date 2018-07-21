const publicConfig = require('./config');
const ModelIndex = require(publicConfig.models_path);
const Camera = ModelIndex.Camera;

const Op = ModelIndex.sequelize.Op;

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
      return Camera.findAll(options);
  };


/**
*  Retrouver une porte en base
**/
CameraController.find = function( id ) {
  if ( id != undefined ){
    return Camera.findById( id );
  }
}

/**
*  Creation d'un groupe
**/
CameraController.add = function(url, device_id ) {
  const options = {};
  options.url = url;
  if (device_id !== undefined){
    options.device_id = device_id;
  }
    return Camera.create(options);
};

/**
* Suppression d'un groupe
**/
CameraController.delete = function ( id ) {
  return Camera.destroy({
    where: {
      id : id
    }
  });
}

/**
*  Modification d'une porte en base
**/
CameraController.update = function( id,url) {
    return Camera.update({
        url: url
    },{
      where: {
        id : id
      }
    });
};


// Export du controller
module.exports = CameraController;
