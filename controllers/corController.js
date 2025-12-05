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

router.get('/cor/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const cor = await Cor.findByPk(id);
        if (!cor) {
            return res.status(404).json({ success: false, message: 'cor não encontrada' });
        }
        res.json(cor);
    } catch (error) {
        console.log('Erro ao buscar cor', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar cor' });
    }
});

router.put('/cor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const cor = await Cor.findByPk(id);
        if (!cor) {
            return res.status(404).json({ success: false, message: 'Cor não encontrada' });
        }

        cor.nome = nome;
        cor.descricao = descricao || null;
        await cor.save();

        res.json({ success: true, cor });
    } catch (error) {
        console.log('Erro ao atualizar cor', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar cor' });
    }
});

router.delete('/cor/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cor = await Cor.findByPk(id);
        
        if (!cor) {
            return res.status(404).json({ success: false, message: 'Cor não encontrada' });
        }

        await cor.destroy();
        res.json({ success: true, message: 'Cor excluído com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir cor', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir cor' });
    }
});

module.exports = router;