const express = require('express');
const router = express.Router();

const Produto = require('../models/produto');

router.post('/produto', async (req, res) => {
    try{
        const { nome,
            idMaterial,
            idCor,
            idCategoria,
            idColecao,
            preco,
            gastoMaterialMetro 
        } = req.body;

        const novoProduto = await Produto.create({ 
            nome,
            idMaterial,
            idCor,
            idCategoria,
            idColecao,
            preco,
            gastoMaterialMetro 
        })

        res.status(201).json({ success: true, produto: novoProduto})
    } catch (error) {
        console.log('Erro ao criar produto', error)
        res.status(500).json({ success: false, message: 'Erro ao criar produto' })
    }
});

router.get('/produto', async (req, res) => {
    try{
        const produtos = await Produto.findAll()
        res.json(produtos)
    } catch (error) {
        console.log('Erro ao buscar produtos', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar produtos' })
    }
});

router.get('/produto/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ success: false, message: 'produto não encontrada' });
        }
        res.json(produto);
    } catch (error) {
        console.log('Erro ao buscar produto', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar produto' });
    }
});

router.put('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nome,
            idMaterial,
            idCor,
            idCategoria,
            idColecao,
            preco,
            gastoMaterialMetro 
        } = req.body;

        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ success: false, message: 'produto não encontrada' });
        }

        produto.nome = nome;
        produto.idMaterial = idMaterial;
        produto.idCor = idCor;
        produto.idCategoria = idCategoria;
        produto.idColecao = idColecao;
        produto.preco = preco;
        produto.gastoMaterialMetro = gastoMaterialMetro;

        await produto.save();

        res.json({ success: true, produto });
    } catch (error) {
        console.log('Erro ao atualizar produto', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar produto' });
    }
});

router.delete('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Produto.findByPk(id);
        
        if (!produto) {
            return res.status(404).json({ success: false, message: 'produto não encontrada' });
        }

        await produto.destroy();
        res.json({ success: true, message: 'produto excluída com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir produto', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
    }
});

module.exports = router;