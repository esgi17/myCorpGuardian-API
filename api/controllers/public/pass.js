const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PassController = function() { };

/**
* Récupération des badges
**/
PassController.getAll = function( id ) {
    const options = {
      include: [{
          model: PassController.sequelize.User,
          as : 'user'
      }]
    };
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq]: id
        }
    }
    options.where = where;
    return PassController.sequelize.Pass.findAll(options);
};

/**
*  Retrouver un badge en base
**/
PassController.find = function(id) {
    return PassController.sequelize.Pass.findAll({
      where : {
        device_id : id
      }
    });
}

/**
*  Creation d'un badge
**/
PassController.add = function(device_id) {
    return PassController.sequelize.Pass.create({
        device_id: device_id
    });
};

/**
*  Attribution d'un badge
**/
PassController.affect = function (passId, userId) {
  const options = {
    user_id : userId
  };
  const obj = {};

  if( passId !== undefined ) {
      obj.where = {
          id : passId
      };
  }
  //options.where = where;
  return PassController.sequelize.Pass.update(options, obj);
};

/**
* Suppression d'un badge
**/
PassController.delete = function ( id ) {
  return PassController.sequelize.destroy({
    where: {
      device_id : id
    }
  });
}
// Export du controller
module.exports = PassController;
