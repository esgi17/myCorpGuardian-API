const GeneralModelIndex = require('../../models/general');
const Corp = GeneralModelIndex.Corp;
const User = GeneralModelIndex.User;
const Op = GeneralModelIndex.sequelize.Op;

const CorpController = function() {};

CorpController.getAll = function(id) {
    const options = {
        include : [{
            model:  GeneralModelIndex.User,
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
    return Corp.findAll(options);
}

CorpController.update = function( id, name, db_url, db_name, db_login, db_pwd ) {
    return Corp.update({
        name: name,
        db_url: db_url,
        db_name: db_name,
        db_login: db_login,
        db_pwd: db_pwd
    },{
        where : {
            id: id
        }
    })
}

CorpController.add = function( name, db_url, db_name, db_login, db_pwd ) {
    return Corp.create({
        name : name,
        db_url : db_url,
        db_name : db_name,
        db_login : db_login,
        db_pwd : db_pwd
    })
}

CorpController.delete = function(id) {
    return Corp.destroy({
        where: {
            id : id
        }
    });
}

module.exports = CorpController;
