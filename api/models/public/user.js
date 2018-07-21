module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id : {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    firstname : {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname : {
      type: DataTypes.STRING,
      allowNull: false
    },
    job : {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  User.associate = _associate;
  User.synchro = _synchro;

return User;
}


// INTERNAL

function _associate(models) {
  models.User.belongsTo(models.Group, {
    as : 'group'
  });
}

function _synchro(models){
  models.User.sync().then(() => {
    models.User.create({
      firstname: 'Installer',
      lastname: 'Supervisor',
      job: 'SuperUser',
      group_id: "1"
    }).catch( (err) => {
      // Sinon, on renvoie un erreur systeme
      console.error(err);
    });
  }).catch( (err) => {
    // Sinon, on renvoie un erreur systeme
    console.error(err);
  })
}
