const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432, 
    dialect: 'postgres',
    dialectOptions: {
        // --- ADIÇÃO IMPORTANTE ---
        // Isso força o Sequelize a procurar as tabelas no seu esquema criado
        searchPath: 'hd_estoque' 
    },
    pool: {
        max: 5, 
        min: 0, 
        acquire: 30000, 
        idle: 10000
    },
    logging: false, // Desabilita a exibição de logs das queries no console
    define: {
        timestamps: false,
        underscored: true,
        freezeTableName: true // Evita que o Sequelize pluralize os nomes das tabelas
    },
    timezone: '+00:00' // Define o fuso horário para UTC
});

// Testar a conexão
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

//testConnection();

module.exports = sequelize;