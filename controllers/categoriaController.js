const express = require('express');
const router = express.Router();

const Categoria = require('../models/categoria');

router.post('/categoria', async (req, res) => {
    try{
        const { nome, descricao } = req.body;
        const novaCategoria = await Categoria.create({ nome, descricao })
        res.status(201).json({ success: true, categoria: novaCategoria})
    } catch (error) {
        console.log('Erro ao criar categoria', error)
        res.status(500).json({ success: false, message: 'Erro ao criar categoria' })
    }
});

router.get('/categoria', async (req, res) => {
    try{
        const categorias = await Categoria.findAll()
        res.json(categorias)
    } catch (error) {
        console.log('Erro ao buscar categorias', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar categorias' })
    }
});

router.get('/categoria/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
        }
        res.json(categoria);
    } catch (error) {
        console.log('Erro ao buscar categoria', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar categoria' });
    }
});

router.put('/categoria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
        }

        categoria.nome = nome;
        categoria.descricao = descricao || null;
        await categoria.save();

        res.json({ success: true, categoria });
    } catch (error) {
        console.log('Erro ao atualizar categoria', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar categoria' });
    }
});

router.delete('/categoria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
        }

        await categoria.destroy();
        res.json({ success: true, message: 'Categoria excluída com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir categoria', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir categoria' });
    }
});

module.exports = router;