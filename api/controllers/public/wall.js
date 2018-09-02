const publicConfig = require('./config');
//const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const WallController = function () {};

WallController.add = function(x1, x2, y1, y2){
    return WallController.sequelize.Wall.create({
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    });
};

WallController.delete = function(id){
    return WallController.sequelize.Wall.destroy({
        where: {
            id: id
        }
    });
}

WallController.update = function(id, x1, x2, y1, y2){
    return WallController.sequelize.Wall.update({
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    },
    {
        where: {
            id: id
        }
    });
}

WallController.getAll = function(id){
    const options = {};
    const where = {};

    if (id !== undefined){
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return WallController.sequelize.Wall.findAll(options);
};

WallController.disconnect = function(){

}

module.exports = WallController;
