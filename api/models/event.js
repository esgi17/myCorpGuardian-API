module.exports = function (sequelize, DataTypes) {
    const Event = sequelize.define('Event', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    // User.associate = _associate;
    return Event;
}

// INTERNAL

function _associate(models) {

}
