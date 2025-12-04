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

router.get('/material/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const material = await Material.findByPk(id);
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material não encontrado' });
        }
        res.json(material);
    } catch (error) {
        console.log('Erro ao buscar material', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar material' });
    }
});

router.put('/material/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const material = await Material.findByPk(id);
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material não encontrado' });
        }

        material.nome = nome;
        material.descricao = descricao;
        await material.save();

        res.json({ success: true, material });
    } catch (error) {
        console.log('Erro ao atualizar material', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar material' });
    }
});

router.delete('/material/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findByPk(id);
        
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material não encontrado' });
        }

        await material.destroy();
        res.json({ success: true, message: 'Material excluído com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir material', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir material' });
    }
});

module.exports = router;