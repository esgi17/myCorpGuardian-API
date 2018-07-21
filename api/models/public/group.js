module.exports = function (sequelize, DataTypes) {
    const Group = sequelize.define('Group', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    })
    Group.associate = _associate;

    Group.sync({force: false}).then(() => {
      // Table created
      return Group.create({
        name: 'host'
      });
    });
    //Group.creation = _creation;
    return Group;
};


// INTERNAL

function _associate(models) {
    models.Group.hasMany(models.User, {
       as : 'users'
    });
}/*
function _creation(models){
  models.Group.create( {
    name: 'host'
  });
}
*/
