const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const DoorController = function() { };

/**
*  Récupération des élements en base
**/
DoorController.getAll = function (id) {
      const options = {};
      const where = {};

      if( id !== undefined ) {
          where.id = {
              [Op.eq] : `${id}`
          };
      }
      options.where = where;
      return DoorController.sequelize.Door.findAll(options);
  };


/**
*  Retrouver une porte en base
**/
DoorController.find = function( id ) {
  if ( id != undefined ){
    return DoorController.sequelize.Door.findById( id );
  }
}

/**
*  Creation d'un groupe
**/
DoorController.add = function( device_id) {
    const options ={};
    if (device_id !== undefined){
      options.device_id = device_id
    }
    return DoorController.sequelize.Door.create(options);
};

/**
* Suppression d'un groupe
**/
DoorController.delete = function ( id ) {
  return DoorController.sequelize.Door.destroy({
    where: {
      id : id
    }
  });
}



// Export du controller
module.exports = DoorController;
