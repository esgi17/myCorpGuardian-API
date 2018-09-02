const GeneralModelIndex = require('../../models/general');
const Plugin = GeneralModelIndex.Plugin;
const PluginAssociation = GeneralModelIndex.PluginAssociation;
const Op = GeneralModelIndex.sequelize.Op;

const PluginController = function() {};

PluginController.getAll = function(id) {
    const options = {
        include : [{
            model: GeneralModelIndex.PluginAssociation,
            as : 'pluginAssociation'
        }]
    };
    const where = {};
    if (id !== undefined){
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    options.where = where;
    return Plugin.findAll(options);
}

PluginController.update = function(id, name){
    return Plugin.update({
        name: name
    },{
        where : {
            id: id
        }
    })
}

PluginController.add = function(name){
    return Plugin.create({
        name: name
    })
}

PluginController.delete = function(id){
    return Plugin.destroy({
        where: {
            id: id
        }
    });
}

module.exports = PluginController;
