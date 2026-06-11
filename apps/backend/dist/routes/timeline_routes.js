"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const Event_1 = require("../entities/Event");
const TimelineTopic_1 = require("../entities/TimelineTopic");
const TimelineSubtopic_1 = require("../entities/TimelineSubtopic");
const router = (0, express_1.Router)();
// Logging Middleware
router.use((req, res, next) => {
    console.log(`[Timeline API] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// GET all events
router.get("/events", async (req, res) => {
    try {
        const eventRepository = database_1.AppDataSource.getRepository(Event_1.Event);
        const events = await eventRepository.find();
        res.json(events);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST (Create or Update) event
router.post("/events", async (req, res) => {
    try {
        const { id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor } = req.body;
        if (!id) {
            res.status(400).json({ error: "O id do evento é obrigatório." });
            return;
        }
        const eventRepository = database_1.AppDataSource.getRepository(Event_1.Event);
        // Save performs insert or update depending on primary key existence
        const eventData = eventRepository.create({
            id,
            nome,
            topico,
            sub_topico,
            em_ocorrencia: Number(em_ocorrencia),
            inicio,
            fim,
            descricao,
            anotacao,
            cor
        });
        await eventRepository.save(eventData);
        res.json({ message: "Event saved", id: id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE event
router.delete("/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const eventRepository = database_1.AppDataSource.getRepository(Event_1.Event);
        const result = await eventRepository.delete(id);
        res.json({ message: "Event deleted", changes: result.affected || 0 });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET config (topics & subtopics)
router.get("/config", async (req, res) => {
    try {
        const topicRepository = database_1.AppDataSource.getRepository(TimelineTopic_1.TimelineTopic);
        const subtopicRepository = database_1.AppDataSource.getRepository(TimelineSubtopic_1.TimelineSubtopic);
        const topics = await topicRepository.find({
            order: {
                position: "ASC",
                name: "ASC"
            }
        });
        const subtopics = await subtopicRepository.find({
            order: {
                name: "ASC"
            }
        });
        res.json({ topics, subtopics });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// PUT topics reorder
router.put("/config/topics/reorder", async (req, res) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) {
            res.status(400).json({ error: "Formato de reordenação inválido." });
            return;
        }
        // Perform updates within transaction
        await database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
            for (let index = 0; index < order.length; index++) {
                const id = order[index];
                await transactionalEntityManager.update(TimelineTopic_1.TimelineTopic, id, { position: index });
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Erro ao reordenar tópicos:", err);
        res.status(500).json({ error: "Erro ao reordenar tópicos: " + err.message });
    }
});
// POST topic (create or update)
router.post("/config/topics", async (req, res) => {
    try {
        const { id, name, color } = req.body;
        if (!id || !name || !color) {
            res.status(400).json({ error: "Campos obrigatórios faltando." });
            return;
        }
        const topicRepository = database_1.AppDataSource.getRepository(TimelineTopic_1.TimelineTopic);
        const topic = topicRepository.create({ id, name, color });
        await topicRepository.save(topic);
        res.status(201).json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE topic
router.delete("/config/topics/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const topicRepository = database_1.AppDataSource.getRepository(TimelineTopic_1.TimelineTopic);
        const subtopicRepository = database_1.AppDataSource.getRepository(TimelineSubtopic_1.TimelineSubtopic);
        // Delete associated subtopics and then the topic itself
        await database_1.AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.delete(TimelineSubtopic_1.TimelineSubtopic, { topic_id: id });
            await transactionalEntityManager.delete(TimelineTopic_1.TimelineTopic, id);
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST subtopic
router.post("/config/subtopics", async (req, res) => {
    try {
        const { topic_id, name } = req.body;
        if (!topic_id || !name) {
            res.status(400).json({ error: "Campos obrigatórios faltando." });
            return;
        }
        const subtopicRepository = database_1.AppDataSource.getRepository(TimelineSubtopic_1.TimelineSubtopic);
        const subtopic = subtopicRepository.create({ topic_id, name });
        const result = await subtopicRepository.save(subtopic);
        res.status(201).json({ success: true, id: result.id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE subtopic
router.delete("/config/subtopics/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const subtopicRepository = database_1.AppDataSource.getRepository(TimelineSubtopic_1.TimelineSubtopic);
        await subtopicRepository.delete(id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
