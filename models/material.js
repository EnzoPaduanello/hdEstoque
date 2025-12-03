const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Material = sequelize.define('Material', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    nome:{
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'nome'
    },
    descricao:{
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao'
    }
}, {
    tableName: 'material',
    timestamps: false
});

module.exports = Material;