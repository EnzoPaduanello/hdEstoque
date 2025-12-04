const express = require('express');
const router = express.Router();

const LocalArmazenamento = require('../models/localArmazenamento');

router.post('/localArmazenamento', async (req, res) => {
    try{
        const { nome, descricao } = req.body;
        const novoLocalArmazenamento = await LocalArmazenamento.create({ nome, descricao })
        res.status(201).json({ success: true, localArmazenamento: novoLocalArmazenamento})
    } catch (error) {
        console.log('Erro ao criar local de armazenamento', error)
        res.status(500).json({ success: false, message: 'Erro ao criar local de armazenamento' })
    }
});

router.get('/localArmazenamento', async (req, res) => {
    try{
        const locaisArmazenamento = await LocalArmazenamento.findAll()
        res.json(locaisArmazenamento)
    } catch (error) {
        console.log('Erro ao buscar locais de armazenamento', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar locais de armazenamento' })
    }
});

module.exports = router;