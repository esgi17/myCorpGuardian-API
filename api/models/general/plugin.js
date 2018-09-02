module.exports = function(sequelize, DataTypes) {
    const Plugin = sequelize.define('Plugin', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    Plugin.associate = _associate
    return Plugin;
}

function _associate(models) {
    models.Plugin.hasMany(models.PluginAssociation, {
        as : 'pluginAssociation'
    });
}
