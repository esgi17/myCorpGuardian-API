module.exports = function (sequelize, DataTypes) {
    const Corp = sequelize.define('Corp', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        db_url : {
            type : DataTypes.STRING,
            allowNull : false
        },
        db_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        db_login : {
            type : DataTypes.STRING,
            allowNull : false
        },
        db_pwd : {
            type : DataTypes.STRING,
            allowNull : true
        }
    },
    {
        paranoid: true,
        underscored: true,
        freezeTableName: true
    });
    Corp.associate = _associate;
    return Corp;
}

// INTERNAL

function _associate(models) {
    models.Corp.hasMany(models.User, {
        as : 'user'
    });
}
