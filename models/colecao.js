const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Colecao = sequelize.define('Colecao', {
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
    tableName: 'colecao',
    timestamps: false
});

module.exports = Colecao;