const publicConfig = require('./config');
const login = require('../../routes/authenticate');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const ScheduleController = function() {};
/**
*  Creation d'un Schedule en base
**/
ScheduleController.add = function( h_start, h_stop, day, door_id, group_id ) {
    return ScheduleController.sequelize.Schedule.create({
        h_start: h_start,
        h_stop: h_stop,
        day: day,
        door_id: door_id,
        group_id: group_id
    });
};

/**
* Suppression d'un Schedule en base
**/
ScheduleController.delete = function(id) {
  return ScheduleController.sequelize.Schedule.destroy({
    where: {
      id : id
    }
  });
}

/**
*  Modification d'un Schedule en base
**/
ScheduleController.update = function( id, h_start, h_stop, day, door_id, group_id ) {
    return ScheduleController.sequelize.Schedule.update({
        h_start: h_start,
        h_stop: h_stop,
        day: day,
        door_id: door_id,
        group_id: group_id
    },{
      where: {
        id : id
      }
    });
};

/**
*  Récupération des élements en base
**/
ScheduleController.getAll = function (id) {
    const options = {
      include: [{
        model: ScheduleController.sequelize.Group,
        as : 'group'
      },
      {
        model: ScheduleController.sequelize.Door,
        as : 'door'
      }]
    };
    const where = {};

    if( id !== undefined ) {
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return ScheduleController.sequelize.Schedule.findAll(options);
};

ScheduleController.getByGroupDoorDay = function(group_id, door_id, day){
  return ScheduleController.sequelize.Schedule.findAll({
    where : {
      door_id : door_id,
      group_id : group_id,
      day : day
    }
  })
}


// Export du controller
module.exports = ScheduleController;
