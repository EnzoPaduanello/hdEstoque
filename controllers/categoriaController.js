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

module.exports = router;