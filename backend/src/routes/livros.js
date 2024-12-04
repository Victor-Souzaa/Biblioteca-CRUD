const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obter todos os livros com exemplares
router.get('/livros', async (req, res) => {
    try {
        const livrosQuery = `
            SELECT l.*, json_agg(e.*) AS exemplares
            FROM Livros l
            LEFT JOIN Exemplares e ON l.id = e.livro_id
            GROUP BY l.id
        `;
        const { rows } = await pool.query(livrosQuery);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao obter livros' });
    }
});

// Adicionar um novo livro
router.post('/livros', async (req, res) => {
    const { titulo, isbn, autor, editora, assunto, edicao, data_inclusao } = req.body;
    try {
        const query = `
            INSERT INTO Livros (titulo, isbn, autor, editora, assunto, edicao, data_inclusao)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const values = [titulo, isbn, autor, editora, assunto, edicao, data_inclusao];
        const { rows } = await pool.query(query, values);
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar livro' });
    }
});

module.exports = router;
