module.exports = function(sequelize, DataTypes){
    const PluginAssociation = sequelize.define('PluginAssociation', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        right : {
            type: DataTypes.TINYINT,
            allowNull : false
        },
        installed : {
            type: DataTypes.TINYINT,
            allowNull : false
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });

    PluginAssociation.associate = _associate;
    return PluginAssociation;
}

function _associate(models) {
    models.PluginAssociation.belongsTo(models.Plugin, {
        as : 'plugin'
    })
    models.PluginAssociation.belongsTo(models.Corp, {
        as : 'corp'
    })
}
