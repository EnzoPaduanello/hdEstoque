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

router.get('/colecao/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const colecao = await Colecao.findByPk(id);
        if (!colecao) {
            return res.status(404).json({ success: false, message: 'Coleção não encontrada' });
        }
        res.json(colecao);
    } catch (error) {
        console.log('Erro ao buscar coleção', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar coleção' });
    }
});

router.put('/colecao/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const colecao = await Colecao.findByPk(id);
        if (!colecao) {
            return res.status(404).json({ success: false, message: 'Coleção não encontrada' });
        }

        colecao.nome = nome;
        colecao.descricao = descricao || null;
        await colecao.save();

        res.json({ success: true, colecao });
    } catch (error) {
        console.log('Erro ao atualizar coleção', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar coleção' });
    }
});

router.delete('/colecao/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const colecao = await Colecao.findByPk(id);
        
        if (!colecao) {
            return res.status(404).json({ success: false, message: 'Coleção não encontrada' });
        }

        await colecao.destroy();
        res.json({ success: true, message: 'colecao excluído com sucesso' });
    } catch (error) {
        console.log('Erro ao excluir colecao', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir colecao' });
    }
});

module.exports = router;