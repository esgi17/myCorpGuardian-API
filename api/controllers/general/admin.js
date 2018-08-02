const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
let config = require('../../config');
const ModelIndex = require('../../models/general');
const Admin = ModelIndex.User;
const Op = ModelIndex.sequelize.Op;

const AdminController = function() { };

AdminController.isAdmin;

AdminController.add = function(login, password, isAdmin, corp_id) {
    return Admin.create({
        login: login,
        password: passwordHash.generate(password),
        isAdmin : isAdmin,
        corp_id : corp_id
    });
}

AdminController.exist = function (login) {
    const options = {
      include : [{
        model: ModelIndex.Corp,
        as : 'corp'
      }]
    }
    const where = {}

    if( login !== undefined ) {
        where.login = {
            [Op.eq] : `${login}`
        }
    }
    options.where = where;
    return Admin.find(options);
}

AdminController.verifyPassword = function (pwd, pwd1) {
    if( passwordHash.verify(pwd, pwd1) ) {
        return true;
    }
    return false;
}


AdminController.checkToken = function (token, secret) {
    if (token) {
        try {
          
            var decoded = jwt.verify(token, secret);
            return true;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}

module.exports = AdminController;
