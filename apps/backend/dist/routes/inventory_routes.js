"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const InventoryItem_1 = require("../entities/InventoryItem");
const InventoryAuditLog_1 = require("../entities/InventoryAuditLog");
const InventoryCategory_1 = require("../entities/InventoryCategory");
const router = (0, express_1.Router)();
// GET /api/inventory/categories - List categories
router.get("/categories", async (req, res) => {
    try {
        const catRepo = database_1.AppDataSource.getRepository(InventoryCategory_1.InventoryCategory);
        const categories = await catRepo.find({ order: { name: "ASC" } });
        return res.json(categories);
    }
    catch (error) {
        console.error("Erro ao buscar categorias de inventário:", error);
        return res.status(500).json({ error: "Erro ao buscar categorias de inventário." });
    }
});
// POST /api/inventory/categories - Create category
router.post("/categories", async (req, res) => {
    try {
        const catRepo = database_1.AppDataSource.getRepository(InventoryCategory_1.InventoryCategory);
        const { name, description } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "O nome da categoria é obrigatório." });
        }
        const existing = await catRepo.findOneBy({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ error: "Já existe uma categoria com este nome." });
        }
        const newCategory = catRepo.create({
            name: name.trim(),
            description: description?.trim() || null,
            is_system: false
        });
        const saved = await catRepo.save(newCategory);
        return res.status(201).json(saved);
    }
    catch (error) {
        console.error("Erro ao criar categoria de inventário:", error);
        return res.status(500).json({ error: "Erro ao criar categoria de inventário." });
    }
});
// DELETE /api/inventory/categories/:id - Delete category
router.delete("/categories/:id", async (req, res) => {
    try {
        const catRepo = database_1.AppDataSource.getRepository(InventoryCategory_1.InventoryCategory);
        const id = Number(req.params.id);
        const category = await catRepo.findOneBy({ id });
        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }
        if (category.is_system) {
            return res.status(400).json({ error: "Categorias padrão do sistema não podem ser excluídas." });
        }
        await catRepo.remove(category);
        return res.json({ message: "Categoria removida com sucesso." });
    }
    catch (error) {
        console.error("Erro ao remover categoria de inventário:", error);
        return res.status(500).json({ error: "Erro ao remover categoria." });
    }
});
// GET /api/inventory - List items with optional filters
router.get("/", async (req, res) => {
    try {
        const itemRepo = database_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
        const { search, category, status, location } = req.query;
        const query = itemRepo.createQueryBuilder("item");
        if (search) {
            const searchTerm = `%${String(search).trim()}%`;
            query.andWhere("(item.name ILIKE :search OR item.brand_model ILIKE :search OR item.serial_number ILIKE :search OR item.asset_tag ILIKE :search OR item.assigned_to ILIKE :search OR item.ip_address ILIKE :search)", { search: searchTerm });
        }
        if (category && category !== "all") {
            query.andWhere("item.category = :category", { category });
        }
        if (status && status !== "all") {
            query.andWhere("item.status = :status", { status });
        }
        if (location && location !== "all") {
            query.andWhere("item.location ILIKE :location", { location: `%${location}%` });
        }
        query.orderBy("item.created_at", "DESC");
        const items = await query.getMany();
        return res.json(items);
    }
    catch (error) {
        console.error("Erro ao buscar inventário:", error);
        return res.status(500).json({ error: "Erro ao buscar itens de inventário." });
    }
});
// GET /api/inventory/audit-logs - List audit logs
router.get("/audit-logs", async (req, res) => {
    try {
        const auditRepo = database_1.AppDataSource.getRepository(InventoryAuditLog_1.InventoryAuditLog);
        const logs = await auditRepo.find({
            order: { created_at: "DESC" },
            take: 100
        });
        return res.json(logs);
    }
    catch (error) {
        console.error("Erro ao buscar logs de auditoria:", error);
        return res.status(500).json({ error: "Erro ao carregar logs de auditoria de inventário." });
    }
});
// GET /api/inventory/:id - Get single item
router.get("/:id", async (req, res) => {
    try {
        const itemRepo = database_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
        const id = Number(req.params.id);
        const item = await itemRepo.findOneBy({ id });
        if (!item) {
            return res.status(404).json({ error: "Item de inventário não encontrado." });
        }
        return res.json(item);
    }
    catch (error) {
        console.error("Erro ao buscar item de inventário:", error);
        return res.status(500).json({ error: "Erro ao buscar item de inventário." });
    }
});
// POST /api/inventory - Create item
router.post("/", async (req, res) => {
    try {
        const itemRepo = database_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
        const auditRepo = database_1.AppDataSource.getRepository(InventoryAuditLog_1.InventoryAuditLog);
        const { name, category, brand_model, serial_number, asset_tag, status, location, assigned_to, ip_address, mac_address, purchase_date, warranty_expires, notes, performed_by } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "O nome do item é obrigatório." });
        }
        const newItem = itemRepo.create({
            name: name.trim(),
            category: category || "Outro",
            brand_model: brand_model?.trim() || null,
            serial_number: serial_number?.trim() || null,
            asset_tag: asset_tag?.trim() || null,
            status: status || "ativo",
            location: location?.trim() || null,
            assigned_to: assigned_to?.trim() || null,
            ip_address: ip_address?.trim() || null,
            mac_address: mac_address?.trim() || null,
            purchase_date: purchase_date || null,
            warranty_expires: warranty_expires || null,
            notes: notes?.trim() || null
        });
        const savedItem = await itemRepo.save(newItem);
        // Record Audit Log
        const auditLog = auditRepo.create({
            item_id: savedItem.id,
            item_name: savedItem.name,
            action: "Criado",
            performed_by: performed_by || "Sistema / Usuário TI",
            details: `Item cadastrado com categoria '${savedItem.category}' e status '${savedItem.status}'. Local: ${savedItem.location || "N/A"}.`
        });
        await auditRepo.save(auditLog);
        return res.status(201).json(savedItem);
    }
    catch (error) {
        console.error("Erro ao criar item de inventário:", error);
        return res.status(500).json({ error: "Erro ao salvar item no inventário." });
    }
});
// PUT /api/inventory/:id - Update item
router.put("/:id", async (req, res) => {
    try {
        const itemRepo = database_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
        const auditRepo = database_1.AppDataSource.getRepository(InventoryAuditLog_1.InventoryAuditLog);
        const id = Number(req.params.id);
        const existingItem = await itemRepo.findOneBy({ id });
        if (!existingItem) {
            return res.status(404).json({ error: "Item de inventário não encontrado." });
        }
        const oldStatus = existingItem.status;
        const oldLocation = existingItem.location;
        const oldAssignedTo = existingItem.assigned_to;
        const { name, category, brand_model, serial_number, asset_tag, status, location, assigned_to, ip_address, mac_address, purchase_date, warranty_expires, notes, performed_by } = req.body;
        if (name !== undefined)
            existingItem.name = name.trim();
        if (category !== undefined)
            existingItem.category = category;
        if (brand_model !== undefined)
            existingItem.brand_model = brand_model?.trim() || null;
        if (serial_number !== undefined)
            existingItem.serial_number = serial_number?.trim() || null;
        if (asset_tag !== undefined)
            existingItem.asset_tag = asset_tag?.trim() || null;
        if (status !== undefined)
            existingItem.status = status;
        if (location !== undefined)
            existingItem.location = location?.trim() || null;
        if (assigned_to !== undefined)
            existingItem.assigned_to = assigned_to?.trim() || null;
        if (ip_address !== undefined)
            existingItem.ip_address = ip_address?.trim() || null;
        if (mac_address !== undefined)
            existingItem.mac_address = mac_address?.trim() || null;
        if (purchase_date !== undefined)
            existingItem.purchase_date = purchase_date || null;
        if (warranty_expires !== undefined)
            existingItem.warranty_expires = warranty_expires || null;
        if (notes !== undefined)
            existingItem.notes = notes?.trim() || null;
        const updatedItem = await itemRepo.save(existingItem);
        // Changes summary for audit
        const changes = [];
        if (oldStatus !== updatedItem.status)
            changes.push(`Status: '${oldStatus}' ➔ '${updatedItem.status}'`);
        if (oldLocation !== updatedItem.location)
            changes.push(`Local: '${oldLocation || "N/A"}' ➔ '${updatedItem.location || "N/A"}'`);
        if (oldAssignedTo !== updatedItem.assigned_to)
            changes.push(`Responsável: '${oldAssignedTo || "N/A"}' ➔ '${updatedItem.assigned_to || "N/A"}'`);
        const actionText = oldStatus !== updatedItem.status ? "Status Alterado" : "Atualizado";
        const detailsText = changes.length > 0 ? changes.join(", ") : "Dados cadastrais atualizados.";
        const auditLog = auditRepo.create({
            item_id: updatedItem.id,
            item_name: updatedItem.name,
            action: actionText,
            performed_by: performed_by || "Sistema / Usuário TI",
            details: detailsText
        });
        await auditRepo.save(auditLog);
        return res.json(updatedItem);
    }
    catch (error) {
        console.error("Erro ao atualizar item de inventário:", error);
        return res.status(500).json({ error: "Erro ao atualizar item no inventário." });
    }
});
// DELETE /api/inventory/:id - Delete item
router.delete("/:id", async (req, res) => {
    try {
        const itemRepo = database_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
        const auditRepo = database_1.AppDataSource.getRepository(InventoryAuditLog_1.InventoryAuditLog);
        const id = Number(req.params.id);
        const existingItem = await itemRepo.findOneBy({ id });
        if (!existingItem) {
            return res.status(404).json({ error: "Item de inventário não encontrado." });
        }
        const itemName = existingItem.name;
        const performed_by = req.query.performed_by || "Sistema / Usuário TI";
        await itemRepo.remove(existingItem);
        const auditLog = auditRepo.create({
            item_id: id,
            item_name: itemName,
            action: "Excluído",
            performed_by: performed_by,
            details: `Item de inventário ID #${id} excluído do sistema.`
        });
        await auditRepo.save(auditLog);
        return res.json({ message: "Item excluído com sucesso." });
    }
    catch (error) {
        console.error("Erro ao excluir item de inventário:", error);
        return res.status(500).json({ error: "Erro ao excluir item de inventário." });
    }
});
exports.default = router;
