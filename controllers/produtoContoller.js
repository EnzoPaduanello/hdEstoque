const express = require('express');
const router = express.Router();

const Produto = require('../models/produto');
const Material = require('../models/material');
const Cor = require('../models/cor');
const Categoria = require('../models/categoria');
const Colecao = require('../models/colecao');
const ProdutoLocalArmazenamento = require('../models/produtoLocalArmazenamento');
const LocalArmazenamento = require('../models/localArmazenamento');

// --- CADASTRO (POST) ---
router.post('/produto', async (req, res) => {
    try {
        const { 
            nome, idMaterial, idCor, idCategoria, idColecao, preco, gastoMaterialMetro 
        } = req.body;

        const novoProduto = await Produto.create({
            nome, idMaterial, idCor, idCategoria, idColecao, preco, gastoMaterialMetro
        });

        res.status(201).json({ success: true, produto: novoProduto });
    } catch (error) {
        console.log('Erro ao criar produto', error);
        res.status(500).json({ success: false, message: 'Erro ao criar produto' });
    }
});

// --- LISTAGEM (GET ALL) ---
router.get('/produto', async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            // O include diz: "Traga junto os dados destas tabelas"
            include: [
                { 
                    model: Material, 
                    as: 'material',
                    attributes: ['nome']
                },
                { 
                    model: Cor, 
                    as: 'cor',
                    attributes: ['nome']
                },
                { 
                    model: Categoria, 
                    as: 'categoria',
                    attributes: ['nome']
                },
                { 
                    model: Colecao, 
                    as: 'colecao',
                    attributes: ['nome']
                },
                { 
                    model: ProdutoLocalArmazenamento,
                    include: [
                        {
                            model: LocalArmazenamento,
                            as: 'local',
                            attributes: ['nome']
                        }
                    ]
                }
            ]
        });
        res.json(produtos);
    } catch (error) {
        console.log('Erro ao buscar produtos', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar produtos' });
    }
});

// --- DETALHES (GET ONE) ---
router.get('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produto.findByPk(id, {
            include: [
                { 
                    model: Material, 
                    as: 'material'
                },
                { 
                    model: Cor, 
                    as: 'cor'
                },
                { 
                    model: Categoria, 
                    as: 'categoria'
                },
                { 
                    model: Colecao, 
                    as: 'colecao' 
                }
            ]
        });
        if (!produto) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado' });
        }
        res.json(produto);
    } catch (error) {
        console.log('Erro ao buscar produto', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar produto' });
    }
});

// --- ESTOQUE DO PRODUTO (GET) ---
router.get('/estoque/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const estoque = await ProdutoLocalArmazenamento.findAll({
            where: { idProduto: id },
            include: [{
                model: LocalArmazenamento,
                as: 'local',
                attributes: ['nome']
            }]
        });
        res.json(estoque);
    } catch (error) {
        console.log('Erro ao buscar estoque', error);
        res.status(500).json({ error: 'Erro ao buscar estoque' });
    }
});

// --- DELETAR ESTOQUE (DELETE) ---
router.delete('/estoque/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await ProdutoLocalArmazenamento.destroy({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.log('Erro ao deletar estoque', error);
        res.status(500).json({ error: 'Erro ao deletar item de estoque' });
    }
});

// --- EDIÇÃO COMPLETA (PUT) - AQUI ESTAVA O PROBLEMA (DUPLICIDADE) ---
router.put('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nome, idMaterial, idCor, idCategoria, idColecao, preco, gastoMaterialMetro,
            novosEstoques, // Array de novos cards
            estoquesEditados // Array de cards existentes editados
        } = req.body;

        // 1. Atualiza Produto
        const produto = await Produto.findByPk(id);
        if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });

        produto.nome = nome;
        produto.idMaterial = idMaterial;
        produto.idCor = idCor;
        produto.idCategoria = idCategoria;
        produto.idColecao = idColecao;
        produto.preco = preco;
        produto.gastoMaterialMetro = gastoMaterialMetro;
        await produto.save();

        // 2. Cria Novos Estoques
        if (novosEstoques && novosEstoques.length > 0) {
            for (const item of novosEstoques) {
                // Validação básica para evitar criar sem ID
                if(item.id_local && item.quantidade >= 0) {
                    await ProdutoLocalArmazenamento.create({
                        idProduto: id,
                        idLocalArmazenamento: item.id_local,
                        metrosEmEstoque: item.quantidade
                    });
                }
            }
        }

        // 3. Atualiza Estoques Existentes
        if (estoquesEditados && estoquesEditados.length > 0) {
            for (const item of estoquesEditados) {
                await ProdutoLocalArmazenamento.update(
                    { metrosEmEstoque: item.quantidade },
                    { where: { id: item.id_relacao } }
                );
            }
        }

        res.json({ success: true, produto });
    } catch (error) {
        console.log('Erro ao atualizar produto', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar produto' });
    }
});

// --- DELETAR PRODUTO (DELETE) ---
router.delete('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produto.findByPk(id);
        
        if (!produto) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado' });
        }

        await produto.destroy();
        res.json({ success: true, message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir produto', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
    }
});

module.exports = router;