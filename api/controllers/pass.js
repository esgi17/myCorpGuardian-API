const ModelIndex = require('../models');
const Pass = ModelIndex.Pass;
const Op = ModelIndex.sequelize.Op;

const PassController = function() { };

/**
* Récupération des badges
**/
PassController.getAll = function( id ) {
    const options = {
      include: [{
          model: ModelIndex.User,
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
    return Pass.findAll(options);
};

/**
*  Creation d'un badge
**/
PassController.add = function(user_id) {
    return Pass.create({
        user_id: user_id
    });
};

/**
*  Attribution d'un badge
**/
PassController.attribute = function (passId, userId) {
  console.log({passId, userId});
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
  return Pass.update(options, obj);
};

/**
* Suppression d'un badge
**/
PassController.delete = function ( ) {
    // TODO

}
// Export du controller
module.exports = PassController;
