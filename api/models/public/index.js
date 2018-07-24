const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config');
const Op = Sequelize.Op;
const basename = path.basename(module.filename);

class ModelIndex {
    constructor() {
        this.modelIndex = new Array();
        this.sequelize = new Sequelize(config.private_bdd.dbname, config.private_bdd.user, config.private_bdd.password, {
            host: config.private_bdd.host,
            dialect: config.private_bdd.dialect,
            port: config.private_bdd.port,
            operatorsAliases: Op
        });
    }

    init() {
        this.op = Op;
        this.loadModels();
        return new Promise(
            (resolve, reject) => {
              this.openDatabase()
                  .then( () => {
                      this.sequelize.sync();
                      resolve(this.sequelize);
                  })
                  .catch( (err) => {
                      console.log(err);
                      reject()
                  });
            }
        )


    }

    getModel(modelName) {
        return this[modelName];
    };

    loadModels() {
        fs.readdirSync(__dirname)
            .filter((file) => {
                return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
            })
            .forEach((file) => {
                const model = this.sequelize['import'](path.join(__dirname, file));
                this.sequelize[model.name] = model;
            });

        // ASSOCIATE MODELS
        Object.keys(this.sequelize)
        .forEach((modelName) => {
            if (this.sequelize[modelName].associate) {
                this.sequelize[modelName].associate(this.sequelize);
            }
        })
    }
    // LOAD MODELS
    openDatabase() {
        return this.sequelize
            .authenticate()
                .then(() => this.sequelize.sync({force : false})
                  .then(() => {
                      Object.keys(ModelIndex)
                          .forEach((modelName) => {
                              if (ModelIndex[modelName].synchro){
                                  //ModelIndex[modelName].synchro(ModelIndex);

                              }
                          })
                  })
                  .catch( (err) => {
                      console.log(err);
                  })
                )
                .catch((err) => {
                    console.log(err);
                });

    }

    getModels() {
        return this.sequelize;
    }
}

module.exports = ModelIndex;
