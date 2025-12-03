const express = require('express');
const sequelize = require('./config/db')

// Inicialização do app
const app = express();
const PORT = 3000;

app.use(express.json()); // Permite que o servidor entenda JSON

// Teste rápido de rota
app.get('/', (req, res) => {
    res.send('API do HD Estoque está rodando!');
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console
    res.status(500).send('Algo deu errado!');
});

// Inicia o servidor APÓS tentar conectar ao banco
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    try {
        await sequelize.authenticate();
        console.log('Banco de dados conectado no esquema hd_estoque!');
    } catch (error) {
        console.error('Falha ao conectar no banco:', error);
    }
});