const publicConfig = require('./config');
const ModelIndex = require(publicConfig.models_path);
const State = ModelIndex.State;

const Op = ModelIndex.sequelize.Op;

const StateController = function() {};

StateController.add = function(state){
  return State.create({
    state: state
  });
};

StateController.update = function(state){
  return State.update({
    state: state
  },{
    where : {
      id: 1
    }
  });
};

StateController.getAll = function(id){
  const options = {};
  const where = {};
  if( id !== undefined ) {
      where.id = {
          [Op.eq] : `${id}`
      };
  }
  options.where = where;
  return State.findAll(options);
};

module.exports = StateController;
