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

// GET config (topics & subtopics)
router.get('/config', (req, res) => {
    db.all("SELECT * FROM timeline_topics ORDER BY position ASC, name ASC", [], (err, topics) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all("SELECT * FROM timeline_subtopics ORDER BY name ASC", [], (err, subtopics) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ topics, subtopics });
        });
    });
});

// PUT topics reorder
router.put('/config/topics/reorder', (req, res) => {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Formato de reordenação inválido.' });

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare("UPDATE timeline_topics SET position = ? WHERE id = ?");
        try {
            order.forEach((id, index) => {
                stmt.run(index, id);
            });
            stmt.finalize();
            db.run("COMMIT", (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ success: true });
                }
            });
        } catch (err) {
            db.run("ROLLBACK");
            console.error("Erro ao reordenar tópicos:", err);
            res.status(500).json({ error: 'Erro ao reordenar tópicos.' });
        }
    });
});

// POST topic (create or update)
router.post('/config/topics', (req, res) => {
    const { id, name, color } = req.body;
    if (!id || !name || !color) return res.status(400).json({ error: 'Campos obrigatórios faltando.' });

    db.run(
        "INSERT OR REPLACE INTO timeline_topics (id, name, color) VALUES (?, ?, ?)",
        [id, name, color],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ success: true });
        }
    );
});

// DELETE topic
router.delete('/config/topics/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM timeline_topics WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        // Manually cascade delete associated subtopics
        db.run("DELETE FROM timeline_subtopics WHERE topic_id = ?", [id], (subErr) => {
            res.json({ success: true });
        });
    });
});

// POST subtopic
router.post('/config/subtopics', (req, res) => {
    const { topic_id, name } = req.body;
    if (!topic_id || !name) return res.status(400).json({ error: 'Campos obrigatórios faltando.' });

    db.run(
        "INSERT INTO timeline_subtopics (topic_id, name) VALUES (?, ?)",
        [topic_id, name],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ success: true, id: this.lastID });
        }
    );
});

// DELETE subtopic
router.delete('/config/subtopics/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM timeline_subtopics WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;
