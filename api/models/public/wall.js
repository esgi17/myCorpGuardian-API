module.exports = function(sequelize, DataTypes){
    const Wall = sequelize.define('Wall', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        x1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        x2: {
            type: DataTypes.STRING,
            allowNull: false
        },
        y1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        y2: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    return Wall;
}
