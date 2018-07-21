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
CameraController.add = function( name, ref ) {
    return Camera.create({
      name : name,
      ref : ref
    });
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
CameraController.update = function( id, name, ref ) {
    return User.update({
        name: name,
        ref: ref,
        url: url
    },{
      where: {
        id : id
      }
    });
};


// Export du controller
module.exports = CameraController;
