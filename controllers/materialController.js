const express = require('express');
const router = express.Router();

const Material = require('../models/material');

router.post('/material', async (req, res) => {
    try{
        const { nome, descricao } = req.body;
        const novaMaterial = await Material.create({ nome, descricao })
        res.status(201).json({ success: true, material: novaMaterial})
    } catch (error) {
        console.log('Erro ao criar material', error)
        res.status(500).json({ success: false, message: 'Erro ao criar material' })
    }
});

router.get('/material', async (req, res) => {
    try{
        const materiais = await Material.findAll()
        res.json(materiais)
    } catch (error) {
        console.log('Erro ao buscar materiais', error)
        res.status(500).json({ success: false, message: 'Erro ao buscar materiais' })
    }
});

module.exports = router;