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

router.get('/localArmazenamento/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const localArmazenamento = await LocalArmazenamento.findByPk(id);
        if (!localArmazenamento) {
            return res.status(404).json({ success: false, message: 'Local de armazenamento não encontrado' });
        }
        res.json(localArmazenamento);
    } catch (error) {
        console.log('Erro ao buscar local de armazenamento', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar local de armazenamento' });
    }
});

router.put('/localArmazenamento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const localArmazenamento = await LocalArmazenamento.findByPk(id);
        if (!localArmazenamento) {
            return res.status(404).json({ success: false, message: 'Local de armazenamento não encontrado' });
        }

        localArmazenamento.nome = nome;
        localArmazenamento.descricao = descricao || null;
        await localArmazenamento.save();

        res.json({ success: true, localArmazenamento });
    } catch (error) {
        console.log('Erro ao atualizar local de armazenamento', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar local de armazenamento' });
    }
});

router.delete('/localArmazenamento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const localArmazenamento = await LocalArmazenamento.findByPk(id);
        
        if (!localArmazenamento) {
            return res.status(404).json({ success: false, message: 'Local de armazenamento não encontrado' });
        }

        await localArmazenamento.destroy();
        res.json({ success: true, message: 'Local de armazenamento excluído com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir local de armazenamento', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir local de armazenamento' });
    }
});

module.exports = router;