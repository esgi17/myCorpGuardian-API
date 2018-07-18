const ModelIndex = require('../models');
const User = ModelIndex.User;
const Op = ModelIndex.sequelize.Op;

const UserController = function() { };

/**
*  Creation d'un User en base
**/
UserController.add = function(name, surname, login, job, isManager, group_id) {
    return User.create({
        name: name,
        surname: surname,
        login: login,
        job: job,
        isManager: isManager,
        group_id: group_id
    });
};

/**
*  Récupération des élements en base
**/
UserController.getAll = function (search) {
    const options = {
      include: [{
        model: ModelIndex.Group,
        as : 'group'
      }]
    };
    const where = {};

    if( search !== undefined ) {
        where.login = {
            [Op.like]:`${search}%`
        };
    }
    options.where = where;
    return User.findAll(options);
};

UserController.update = function (name, surname, login, job, isManager, group_id ) {
    // TODO

}
// Export du controller
module.exports = UserController;
