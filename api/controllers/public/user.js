const publicConfig = require('./config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const UserController = function() {}
/**
*  Creation d'un User en base
**/
UserController.add = function(firstname, lastname, job, group_id) {
    return UserController.sequelize.User.create({
        firstname: firstname,
        lastname: lastname,
        job: job,
        group_id: group_id
    });
};

/**
* Suppression d'un User en base
**/
UserController.delete = function(id) {
  return UserController.sequelize.User.destroy({
    where: {
      id : id
    }
  });
}

/**
*  Modification d'un User en base
**/
UserController.update = function(id, firstname, lastname, job, group_id) {
    return UserController.sequelize.User.update({
        firstname: firstname,
        lastname: lastname,
        job: job,
        group_id: group_id
    },{
        where: {
          id : id
        }
    });
};

UserController.affectGroup = function(group_id, user_id) {
    return UserController.sequelize.User.update({
        group_id : group_id
    },
    {
        where : {
            id : user_id
        }
    });
}
/**
*  Récupération des élements en base
**/
UserController.getAll = function (id) {

    const options = {
      include: [{
        model: UserController.sequelize.Group,
        as : 'group'
      }]
    };
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return UserController.sequelize.User.findAll(options);
};

UserController.disconnect = function() {

//      UserController.sequelize.close();

}

// Export du controller
module.exports = UserController;
