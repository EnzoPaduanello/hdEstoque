const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const produtoLocalArmazenamento = sequelize.define('produtoLocalArmazenamento', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    idProduto:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'produto',
            key:'id'
        },
        field: 'id_produto'
    },
    idLocalArmazenamento:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'local_armazenamento',
            key:'id'
        },
        field: 'id_local_armazenamento'
    },
    metrosEmEstoque: {
        type: DataTypes.REAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'metros_em_estoque'
    }
}, {
    tableName: 'produto_local_armazenamento',
    timestamps: false
});

module.exports = produtoLocalArmazenamento;