import { Router, Request, Response } from "express";
import { AppDataSource } from "../database";
import { Event as TimelineEvent } from "../entities/Event";
import { TimelineTopic } from "../entities/TimelineTopic";
import { TimelineSubtopic } from "../entities/TimelineSubtopic";

const router = Router();

// Logging Middleware
router.use((req: Request, res: Response, next) => {
    console.log(`[Timeline API] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// GET all events
router.get("/events", async (req: Request, res: Response) => {
    try {
        const eventRepository = AppDataSource.getRepository(TimelineEvent);
        const events = await eventRepository.find();
        res.json(events);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST (Create or Update) event
router.post("/events", async (req: Request, res: Response) => {
    try {
        const { id, nome, topico, sub_topico, em_ocorrencia, inicio, fim, descricao, anotacao, cor } = req.body;
        if (!id) {
            res.status(400).json({ error: "O id do evento é obrigatório." });
            return;
        }

        const eventRepository = AppDataSource.getRepository(TimelineEvent);
        
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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE event
router.delete("/events/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventRepository = AppDataSource.getRepository(TimelineEvent);
        const result = await eventRepository.delete(id);
        res.json({ message: "Event deleted", changes: result.affected || 0 });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// GET config (topics & subtopics)
router.get("/config", async (req: Request, res: Response) => {
    try {
        const topicRepository = AppDataSource.getRepository(TimelineTopic);
        const subtopicRepository = AppDataSource.getRepository(TimelineSubtopic);

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
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT topics reorder
router.put("/config/topics/reorder", async (req: Request, res: Response) => {
    try {
        const { order } = req.body;
        if (!Array.isArray(order)) {
            res.status(400).json({ error: "Formato de reordenação inválido." });
            return;
        }

        // Perform updates within transaction
        await AppDataSource.transaction(async transactionalEntityManager => {
            for (let index = 0; index < order.length; index++) {
                const id = order[index];
                await transactionalEntityManager.update(TimelineTopic, id, { position: index });
            }
        });

        res.json({ success: true });
    } catch (err: any) {
        console.error("Erro ao reordenar tópicos:", err);
        res.status(500).json({ error: "Erro ao reordenar tópicos: " + err.message });
    }
});

// POST topic (create or update)
router.post("/config/topics", async (req: Request, res: Response) => {
    try {
        const { id, name, color } = req.body;
        if (!id || !name || !color) {
            res.status(400).json({ error: "Campos obrigatórios faltando." });
            return;
        }

        const topicRepository = AppDataSource.getRepository(TimelineTopic);
        const topic = topicRepository.create({ id, name, color });
        await topicRepository.save(topic);
        res.status(201).json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE topic
router.delete("/config/topics/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const topicRepository = AppDataSource.getRepository(TimelineTopic);
        const subtopicRepository = AppDataSource.getRepository(TimelineSubtopic);

        // Delete associated subtopics and then the topic itself
        await AppDataSource.transaction(async transactionalEntityManager => {
            await transactionalEntityManager.delete(TimelineSubtopic, { topic_id: id });
            await transactionalEntityManager.delete(TimelineTopic, id);
        });

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST subtopic
router.post("/config/subtopics", async (req: Request, res: Response) => {
    try {
        const { topic_id, name } = req.body;
        if (!topic_id || !name) {
            res.status(400).json({ error: "Campos obrigatórios faltando." });
            return;
        }

        const subtopicRepository = AppDataSource.getRepository(TimelineSubtopic);
        const subtopic = subtopicRepository.create({ topic_id, name });
        const result = await subtopicRepository.save(subtopic);
        res.status(201).json({ success: true, id: result.id });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE subtopic
router.delete("/config/subtopics/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const subtopicRepository = AppDataSource.getRepository(TimelineSubtopic);
        await subtopicRepository.delete(id);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
