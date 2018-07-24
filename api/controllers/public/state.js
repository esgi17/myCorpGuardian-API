const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const StateController = function() {};

StateController.add = function(state){
    return StateController.sequelize.State.create({
      state: state
    });
};

StateController.update = function(state){
    return StateController.sequelize.State.update({
      state: state
    },{
      where : {
        id: 1
      }
    });
};

StateController.getAll = function(id){
    const where = {};
    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    return StateController.sequelize.State.findAll(where);
};

module.exports = StateController;
