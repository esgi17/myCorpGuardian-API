module.exports = function (sequelize, DataTypes) {
    const DeviceType = sequelize.define('DeviceType', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    DeviceType.sync({force: false}).then(() => {
      // Table created
      var array = ["Door", "Captor", "Pass", "Camera"];
      for (var i = 0; i < 4; i++){

        DeviceType.create({
          name: array[i]
        });
      }
    });
    return DeviceType;
}

// INTERNAL

function _associate(models) {

}
