const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const GroupController = function() { };
/**
* Récupération des badges
**/
GroupController.getAll = function( id ) {
  const options = {
    include: [{
       model: GroupController.sequelize.User,
       as : 'users'
     }]
  };
  const where = {};

  if( id !== undefined ) {
      where.id = {
          [Op.eq] : `${id}`
      };
  }
  options.where = where;
  return GroupController.sequelize.Group.findAll(options);
};
/**
*  Retrouver un groupe en base
**/
GroupController.find = function( id ) {
  if ( id != undefined ){
    return GroupController.sequelize.Group.findById( id );
  }
}

/**
*  Creation d'un groupe
**/
GroupController.add = function(name) {
    return GroupController.sequelize.Group.create({
        name : name
    });
};


GroupController.update = function(id, name) {
    return GroupController.sequelize.Group.update({
          name : name,
      },
      {
          where : {
              id : id
          }
      }
    );
}

/**
* Suppression d'un groupe
**/
GroupController.delete = function ( id ) {
  return GroupController.sequelize.Group.destroy({
    where: {
      id : id
    }
  });
}


// Export du controller
module.exports = GroupController;
