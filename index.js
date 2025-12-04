const express = require('express');
const sequelize = require('./config/db')
const path = require('path');
const bodyParser = require('body-parser')

// --- Importação dos Models ---
const Material = require('./models/material');
const Cor = require('./models/cor');
const Categoria = require('./models/categoria');
const Colecao = require('./models/colecao');
const Produto = require('./models/produto');
const LocalArmazenamento = require('./models/localArmazenamento');
const ProdutoLocalArmazenamento = require('./models/produtoLocalArmazenamento');

// --- Importação dos Controllers ---
const categoriaController = require('./controllers/categoriaController');
const colecaoController = require('./controllers/colecaoController');
const corController = require('./controllers/corController');
const localArmazenamentoController = require('./controllers/localArmazenamentoController');
const materialController = require('./controllers/materialController');

// --- Definição das Relações (Associações) ---

// Produto pertence a Material (1 Material tem N Produtos)
Produto.belongsTo(Material, { foreignKey: 'idMaterial', as: 'material' });
Material.hasMany(Produto, { foreignKey: 'idMaterial' });

// Produto pertence a Cor
Produto.belongsTo(Cor, { foreignKey: 'idCor', as: 'cor' });
Cor.hasMany(Produto, { foreignKey: 'idCor' });

// Produto pertence a Categoria
Produto.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoria' });
Categoria.hasMany(Produto, { foreignKey: 'idCategoria' });

// Produto pertence a Colecao
Produto.belongsTo(Colecao, { foreignKey: 'idColecao', as: 'colecao' });
Colecao.hasMany(Produto, { foreignKey: 'idColecao' });

// Relação N:N (Muitos para Muitos) - Estoque
// Um Produto pode estar em vários locais, e um local tem vários produtos
Produto.hasMany(ProdutoLocalArmazenamento, { foreignKey: 'idProduto' });
ProdutoLocalArmazenamento.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produto' });

LocalArmazenamento.hasMany(ProdutoLocalArmazenamento, { foreignKey: 'idLocalArmazenamento' });
ProdutoLocalArmazenamento.belongsTo(LocalArmazenamento, { foreignKey: 'idLocalArmazenamento', as: 'local' });

// Inicialização do app
const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());
app.use(express.json());

// Middleware para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use('/api', categoriaController);
app.use('/api', colecaoController);
app.use('/api', corController);
app.use('/api', localArmazenamentoController);
app.use('/api', materialController);

// Teste rápido de rota
app.get('/', (req, res) => {
    res.send('API do Home Decor Estoque está rodando!');
});

//Categoria
app.get('/categoria/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'categoria', 'cadastroCategoria.html'));
});

//Coleção
app.get('/colecao/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'colecao', 'cadastroColecao.html'));
});

//Cor
app.get('/cor/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cor', 'cadastroCor.html'));
});

//Local de Armazenamento
app.get('/localArmazenamento/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'localArmazenamento', 'cadastroLocalArmazenamento.html'));
});

//Material
app.get('/material', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'material', 'gerenciamentoMaterial.html'));
});

app.get('/material/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'material', 'cadastroMaterial.html'));
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