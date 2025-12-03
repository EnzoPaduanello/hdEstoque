const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const produtoArmazenamento = sequelize.define('produtoArmazenamento', {
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
    tableName: 'produto_armazenamento',
    timestamps: false
});

module.exports = produtoArmazenamento;