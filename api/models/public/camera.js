module.exports = function (sequelize, DataTypes) {
    const Camera = sequelize.define('Camera', {
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
        url: {
            type : DataTypes.STRING,
            allowNull: false
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    Camera.associate = _associate;
    return Camera;
}

// INTERNAL

function _associate(models) {
  models.Camera.belongsTo(models.Device, {
    as : 'device'
  });
}
