const {Sequelize} = require('sequelize')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'my.db'
    
});

module.exports = sequelize;