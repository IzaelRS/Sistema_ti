const express = require('express');
const db = require('./database');

const router = express.Router();

// Logging Middleware (Optional, good for debugging)
router.use((req, res, next) => {
    console.log(`[Timeline API] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// API Endpoints

// GET all events
router.get('/events', (req, res) => {
    db.all("SELECT * FROM events", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST (Create or Update) event
router.post('/events', (req, res) => {
    const { id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor } = req.body;

    const sql = `INSERT OR REPLACE INTO events (id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Event saved', id: id });
    });
});

// DELETE event
router.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM events WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Event deleted', changes: this.changes });
    });
});

module.exports = router;
