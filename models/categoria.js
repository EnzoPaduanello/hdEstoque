const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Categoria = sequelize.define('Categoria', {
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
    tableName: 'categoria',
    schema: 'hd_estoque',
    timestamps: false
});

module.exports = Categoria;