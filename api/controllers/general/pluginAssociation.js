const GeneralModelIndex = require('../../models/general');
const PluginAssociation = GeneralModelIndex.PluginAssociation;
const Op = GeneralModelIndex.sequelize.Op;

const PluginAssociationController = function() {};

PluginAssociationController.getAll = function(id, corp_id, plugin_id){
    const options = {
        include: [{
            model: GeneralModelIndex.Plugin,
            as : 'plugin'
        },{
            model : GeneralModelIndex.Corp,
            as : 'corp'
        }]
    };
    const where = {};
    if (id !== undefined){
        where.id = {
            [Op.eq] : `${id}`
        };
    }
    if (corp_id !== undefined){
        where.corp_id = {
            [Op.eq] : `${corp_id}`
        }
    }
    if (plugin_id !== undefined){
        where.plugin_id = {
            [Op.eq] : `${plugin_id}`
        }
    }
    options.where = where;
    return PluginAssociation.findAll(options);
}

PluginAssociationController.update = function(id, right, installed, corp_id, plugin_id){
    return PluginAssociation.update({
        right: right,
        installed: installed,
        corp_id: corp_id,
        plugin_id: plugin_id
    }, {
        where : {
            id: id
        }
    })
}

PluginAssociationController.add = function(right, installed, corp_id, plugin_id){
    return PluginAssociation.create({
        right: right,
        installed: installed,
        corp_id: corp_id,
        plugin_id: plugin_id
    })
}

PluginAssociationController.delete = function(id) {
    return PluginAssociation.destroy({
        where: {
            id: id
        }
    });
}

PluginAssociationController.getByPlugin = function (plugin_id){
    const options = {
        include: [{
            model: PluginAssociationController.sequelize.Plugin,
            as : 'plugin'
        }]
    };
    const where = {
        plugin_id: plugin_id
    };
    options.where = where;
    return PluginAssociation.findAll(options);
}

PluginAssociationController.getByCorp = function (corp_id){
    const options = {
        include: [{
            model: PluginAssociation.Corp,
            as : 'corp'
        }]
    };
    const where = {
        corp_id: copr_id
    };
    options.where = where;
    return PluginAssociation.findAll(options);
}
module.exports = PluginAssociationController;
