module.exports = function (sequelize, DataTypes) {
    const Device = sequelize.define('Device', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ref: {
            type: DataTypes.STRING,
            allowNull: false
        },
        x: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '-10'
        },
        y: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '-10'
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    Device.associate = _associate;
    return Device;
}

// INTERNAL

function _associate(models) {
  models.Device.belongsTo(models.DeviceType, {
    as : 'deviceType'
  });
}
