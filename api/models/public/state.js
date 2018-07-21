module.exports = function(sequelize, DataTypes){
  const State = sequelize.define('State', {
    id : {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true
    },
    state: {
      type : DataTypes.BOOLEAN,
      allowNull : false
    }
  },
  {
    paranoid: true,
    underscored: true,
    freezeTableName: true

  });
  return State;
}
