const express = require('express');
const router = express.Router();

const Cor = require('../models/cor');

router.post('/cor', async (req, res) => {
    try{
        const { nome, descricao } = req.body;
        const novaCor = await Cor.create({ nome, descricao })
        res.status(201).json({ success: true, cor: novaCor})
    } catch (error) {
        console.log('Erro ao criar cor', error)
        res.status(500).json({ success: false, message: 'Erro ao criar cor' })
    }
});

router.get('/cor', async (req, res) => {
    try{
        const cores = await Cor.findAll()
        res.json(cores)
    } catch (error) {
        console.log('Erro ao buscar cores', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar cores' })
    }
});

module.exports = router;