module.exports = function (sequelize, DataTypes) {
    const Event = sequelize.define('Event', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title : {
            type : DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        data: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    Event.sync({force: false}).then(() => {
      // Table created
      Event.create({
        title: 'DataBase Created',
        date: new Date()
      });
      Event.create({
        title: 'SuperUser Created',
        date: new Date()
      });
      Event.create({
        title: 'State Created',
        date: new Date()
      });
    });
    Event.associate = _associate;
    return Event;
}

// INTERNAL

function _associate(models) {
  models.Event.belongsTo(models.Device, {
    as : 'device'
  });
  models.Event.belongsTo(models.Pass, {
    as : 'pass'
  });
}
