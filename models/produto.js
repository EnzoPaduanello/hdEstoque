const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Produto = sequelize.define('Produto', {
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
    idMaterial: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'material',
            key: 'id'
        },
        field: 'id_material'
    },
    idCor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'cor',
            key: 'id'
        },
        field: 'id_cor'
    },
    idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categoria',
            key: 'id'
        },
        field: 'id_categoria'
    },
    idColecao: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'colecao',
            key: 'id'
        },
        field: 'id_colecao'
    },
    preco:{
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        unique: false,
        field: 'preco'
    },
    gastoMaterialMetro:{
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        unique: false,
        field: 'gasto_material_metro'
    }
}, {
    tableName: 'produto',
    schema: 'hd_estoque',
    timestamps: false
});

module.exports = Produto;