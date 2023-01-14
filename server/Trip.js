const sequelize = require('./database');
const DataTypes = require('sequelize');
const Trip = sequelize.define('trip', {
    idTrip: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    plecareA: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sosireB: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mijlocTransport: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['bus', 'metrou', 'train', 'tram']
    },
    oraPlecare: {
        type: DataTypes.STRING,
        allowNull: false
    },
    durataCalatoriei: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observatii: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivelulSatisfactiei: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['foarte slab', 'slab', 'mediu', 'bun','foarte bun']
    }
});

module.exports = Trip;