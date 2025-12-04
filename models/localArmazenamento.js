const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const localArmazenamento = sequelize.define('localArmazenamento', {
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
    tableName: 'local_armazenamento',
    schema: 'hd_estoque',
    timestamps: false
});

module.exports = localArmazenamento;