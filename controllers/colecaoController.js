const express = require('express');
const router = express.Router();

const Colecao = require('../models/colecao');

router.post('/colecao', async (req, res) => {
    try{
        const { nome, descricao } = req.body;
        const novaColecao = await Colecao.create({ nome, descricao })
        res.status(201).json({ success: true, colecao: novaColecao})
    } catch (error) {
        console.log('Erro ao criar colecao', error)
        res.status(500).json({ success: false, message: 'Erro ao criar colecao' })
    }
});

router.get('/colecao', async (req, res) => {
    try{
        const colecoes = await Colecao.findAll()
        res.json(colecoes)
    } catch (error) {
        console.log('Erro ao buscar coleções', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar coleções' })
    }
});

module.exports = router;