import { apiClient } from '../api/client.js';
import { auth } from '../api/auth.js';
import { dom } from '../utils/dom.js';

let inventoryItems = [];
let auditLogs = [];
let inventoryCategories = [];
let currentSubTab = 'monitoring';

export const inventoryHandler = {
    init() {
        this.setupTabListeners();
        this.setupFormListeners();
        this.setupFilterListeners();
        this.fetchCategories();
    },

    setupTabListeners() {
        const tabMonitoring = document.getElementById('tab-inv-monitoring');
        const tabConfig = document.getElementById('tab-inv-config');
        const tabCategories = document.getElementById('tab-inv-categories');
        const btnCreateNew = document.getElementById('btn-inv-create-new');
        const btnMovementIn = document.getElementById('btn-inv-movement-in');
        const btnMovementOut = document.getElementById('btn-inv-movement-out');

        if (tabMonitoring) {
            tabMonitoring.addEventListener('click', () => this.switchTab('monitoring'));
        }
        if (tabConfig) {
            tabConfig.addEventListener('click', () => {
                this.resetForm();
                this.switchTab('config');
            });
        }
        if (tabCategories) {
            tabCategories.addEventListener('click', () => this.switchTab('categories'));
        }
        if (btnCreateNew) {
            btnCreateNew.addEventListener('click', () => {
                this.resetForm();
                this.switchTab('config');
            });
        }
        if (btnMovementIn) {
            btnMovementIn.addEventListener('click', () => this.openMovementModal('in'));
        }
        if (btnMovementOut) {
            btnMovementOut.addEventListener('click', () => this.openMovementModal('out'));
        }
    },

    switchTab(tab) {
        currentSubTab = tab;
        const tabMonitoring = document.getElementById('tab-inv-monitoring');
        const tabConfig = document.getElementById('tab-inv-config');
        const tabCategories = document.getElementById('tab-inv-categories');

        const viewMonitoring = document.getElementById('view-inv-monitoring');
        const viewConfig = document.getElementById('view-inv-config');
        const viewCategories = document.getElementById('view-inv-categories');

        [tabMonitoring, tabConfig, tabCategories].forEach(t => t?.classList.remove('active'));
        [viewMonitoring, viewConfig, viewCategories].forEach(v => v?.classList.add('hidden'));

        if (tab === 'monitoring') {
            tabMonitoring?.classList.add('active');
            viewMonitoring?.classList.remove('hidden');
            this.fetch();
        } else if (tab === 'config') {
            tabConfig?.classList.add('active');
            viewConfig?.classList.remove('hidden');
            this.fetchCategories();
        } else if (tab === 'categories') {
            tabCategories?.classList.add('active');
            viewCategories?.classList.remove('hidden');
            this.fetchCategories();
        }
    },

    setupFormListeners() {
        const form = document.getElementById('inventory-form');
        const btnReset = document.getElementById('btn-inv-form-reset');
        const btnCancel = document.getElementById('btn-inv-form-cancel');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSaveItem();
            });
        }

        const categoryForm = document.getElementById('inventory-category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSaveCategory();
            });
        }

        const movementForm = document.getElementById('form-inv-movement');
        if (movementForm) {
            movementForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSaveMovement();
            });
        }

        const btnCloseMovement = document.getElementById('btn-close-inv-movement');
        const btnCancelMovement = document.getElementById('btn-cancel-inv-movement');
        if (btnCloseMovement) btnCloseMovement.addEventListener('click', () => this.closeMovementModal());
        if (btnCancelMovement) btnCancelMovement.addEventListener('click', () => this.closeMovementModal());

        if (btnReset) {
            btnReset.addEventListener('click', () => this.resetForm());
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', () => this.switchTab('monitoring'));
        }
    },

    setupFilterListeners() {
        const searchInput = document.getElementById('inv-search-input');
        const categoryFilter = document.getElementById('inv-filter-category');
        const statusFilter = document.getElementById('inv-filter-status');

        let debounceTimer;
        const triggerFetch = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.fetch(), 300);
        };

        if (searchInput) searchInput.addEventListener('input', triggerFetch);
        if (categoryFilter) categoryFilter.addEventListener('change', triggerFetch);
        if (statusFilter) statusFilter.addEventListener('change', triggerFetch);
    },

    async fetch() {
        try {
            const searchInput = document.getElementById('inv-search-input');
            const categoryFilter = document.getElementById('inv-filter-category');
            const statusFilter = document.getElementById('inv-filter-status');

            const params = new URLSearchParams();
            if (searchInput && searchInput.value.trim()) params.append('search', searchInput.value.trim());
            if (categoryFilter && categoryFilter.value !== 'all') params.append('category', categoryFilter.value);
            if (statusFilter && statusFilter.value !== 'all') params.append('status', statusFilter.value);

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const data = await apiClient.get(`/inventory${queryString}`);
            
            inventoryItems = Array.isArray(data) ? data : [];
            this.renderStats();
            this.renderTable();

            // Fetch Audit Logs asynchronously
            this.fetchAuditLogs();
        } catch (error) {
            console.error('Erro ao buscar inventário:', error);
        }
    },

    async fetchAuditLogs() {
        try {
            const data = await apiClient.get('/inventory/audit-logs');
            auditLogs = Array.isArray(data) ? data : [];
            this.renderAuditTable();
        } catch (error) {
            console.error('Erro ao buscar logs de auditoria:', error);
        }
    },

    renderStats() {
        const statTotal = document.getElementById('inv-stat-total');
        const statActive = document.getElementById('inv-stat-active');
        const statMaintenance = document.getElementById('inv-stat-maintenance');
        const statReserve = document.getElementById('inv-stat-reserve');

        const total = inventoryItems.length;
        const active = inventoryItems.filter(i => i.status === 'ativo').length;
        const maintenance = inventoryItems.filter(i => i.status === 'manutencao').length;
        const reserve = inventoryItems.filter(i => i.status === 'reserva').length;

        if (statTotal) statTotal.textContent = total;
        if (statActive) statActive.textContent = active;
        if (statMaintenance) statMaintenance.textContent = maintenance;
        if (statReserve) statReserve.textContent = reserve;
    },

    renderTable() {
        const tbody = document.getElementById('inv-table-body');
        const countSpan = document.getElementById('inv-items-count');

        if (countSpan) {
            countSpan.textContent = `${inventoryItems.length} ${inventoryItems.length === 1 ? 'item encontrado' : 'itens encontrados'}`;
        }

        if (!tbody) return;

        if (inventoryItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
                        Nenhum equipamento cadastrado ou encontrado nos filtros selecionados.
                    </td>
                </tr>
            `;
            return;
        }

        const statusBadges = {
            ativo: '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Ativo</span>',
            manutencao: '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Em Manutenção</span>',
            reserva: '<span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Reserva</span>',
            desativado: '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Desativado</span>'
        };

        tbody.innerHTML = inventoryItems.map(item => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                <td style="padding: 12px 10px;">
                    <span style="font-family: monospace; font-weight: 700; color: #a5b4fc; background: rgba(99, 102, 241, 0.1); padding: 3px 8px; border-radius: 4px; font-size: 0.85rem;">
                        ${item.asset_tag ? this.escapeHtml(item.asset_tag) : 'S/P-' + item.id}
                    </span>
                </td>
                <td style="padding: 12px 10px;">
                    <strong style="color: #fff; display: block; font-size: 0.95rem;">${this.escapeHtml(item.name)}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${item.brand_model ? this.escapeHtml(item.brand_model) : ''}</span>
                </td>
                <td style="padding: 12px 10px; color: #e2e8f0; font-size: 0.85rem;">
                    ${this.escapeHtml(item.category)}
                </td>
                <td style="padding: 12px 10px;">
                    ${statusBadges[item.status] || item.status}
                </td>
                <td style="padding: 12px 10px; font-size: 0.85rem; color: var(--text-muted);">
                    <div style="color: #fff; font-weight: 500;">${item.location ? this.escapeHtml(item.location) : 'N/A'}</div>
                    <div>${item.assigned_to ? '👤 ' + this.escapeHtml(item.assigned_to) : 'Sem responsável'}</div>
                </td>
                <td style="padding: 12px 10px; font-size: 0.85rem; color: var(--text-muted); font-family: monospace;">
                    <div>${item.serial_number ? 'S/N: ' + this.escapeHtml(item.serial_number) : ''}</div>
                    <div style="color: #818cf8;">${item.ip_address ? 'IP: ' + this.escapeHtml(item.ip_address) : ''}</div>
                </td>
                <td style="padding: 12px 10px; text-align: right;">
                    <button class="btn-icon btn-edit-inv" data-id="${item.id}" title="Editar Equipamento" style="color: #818cf8; margin-right: 6px;">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon btn-delete-inv" data-id="${item.id}" data-name="${this.escapeHtml(item.name)}" title="Excluir Equipamento" style="color: #ef4444;">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');

        // Attach action listeners
        tbody.querySelectorAll('.btn-edit-inv').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(btn.getAttribute('data-id'));
                const item = inventoryItems.find(i => i.id === id);
                if (item) this.openEditForm(item);
            });
        });

        tbody.querySelectorAll('.btn-delete-inv').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(btn.getAttribute('data-id'));
                const name = btn.getAttribute('data-name');
                this.deleteItem(id, name);
            });
        });
    },

    renderAuditTable() {
        const tbody = document.getElementById('inv-audit-table-body');
        if (!tbody) return;

        if (auditLogs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 15px; color: var(--text-muted); font-size: 0.85rem;">
                        Nenhuma movimentação registrada no histórico.
                    </td>
                </tr>
            `;
            return;
        }

        const actionColors = {
            'Criado': '#34d399',
            'Atualizado': '#60a5fa',
            'Status Alterado': '#fbbf24',
            'Excluído': '#f87171'
        };

        tbody.innerHTML = auditLogs.map(log => {
            const dateFormatted = new Date(log.created_at).toLocaleString('pt-BR');
            const color = actionColors[log.action] || '#e2e8f0';

            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 8px; font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${dateFormatted}</td>
                    <td style="padding: 8px; font-size: 0.8rem; font-weight: 600; color: #fff;">${this.escapeHtml(log.item_name)}</td>
                    <td style="padding: 8px; font-size: 0.75rem;"><span style="color: ${color}; font-weight: 700;">${log.action}</span></td>
                    <td style="padding: 8px; font-size: 0.75rem; color: var(--text-muted);">${this.escapeHtml(log.performed_by)}</td>
                    <td style="padding: 8px; font-size: 0.75rem; color: #cbd5e1;">${this.escapeHtml(log.details || '-')}</td>
                </tr>
            `;
        }).join('');
    },

    openEditForm(item) {
        this.resetForm();

        dom.setValue('inv-form-id', item.id);
        dom.setValue('inv-form-name', item.name || '');
        dom.setValue('inv-form-category', item.category || 'Outro');
        dom.setValue('inv-form-status', item.status || 'ativo');
        dom.setValue('inv-form-brand-model', item.brand_model || '');
        dom.setValue('inv-form-asset-tag', item.asset_tag || '');
        dom.setValue('inv-form-serial-number', item.serial_number || '');
        dom.setValue('inv-form-location', item.location || '');
        dom.setValue('inv-form-assigned-to', item.assigned_to || '');
        dom.setValue('inv-form-ip-address', item.ip_address || '');
        dom.setValue('inv-form-mac-address', item.mac_address || '');
        dom.setValue('inv-form-purchase-date', item.purchase_date || '');
        dom.setValue('inv-form-warranty-expires', item.warranty_expires || '');
        dom.setValue('inv-form-notes', item.notes || '');

        const titleElem = document.getElementById('inv-form-title');
        if (titleElem) {
            titleElem.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Editar Equipamento #${item.id} - ${this.escapeHtml(item.name)}
            `;
        }

        this.switchTab('config');
    },

    resetForm() {
        const form = document.getElementById('inventory-form');
        if (form) form.reset();
        dom.setValue('inv-form-id', '');

        const titleElem = document.getElementById('inv-form-title');
        if (titleElem) {
            titleElem.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Configurar / Cadastrar Item de Inventário
            `;
        }
    },

    async handleSaveItem() {
        const id = dom.getValue('inv-form-id');
        const user = auth.getUser();
        const performed_by = user ? `${user.name} (${user.email})` : 'Usuário TI';

        const payload = {
            name: dom.getValue('inv-form-name'),
            category: dom.getValue('inv-form-category'),
            status: dom.getValue('inv-form-status'),
            brand_model: dom.getValue('inv-form-brand-model'),
            asset_tag: dom.getValue('inv-form-asset-tag'),
            serial_number: dom.getValue('inv-form-serial-number'),
            location: dom.getValue('inv-form-location'),
            assigned_to: dom.getValue('inv-form-assigned-to'),
            ip_address: dom.getValue('inv-form-ip-address'),
            mac_address: dom.getValue('inv-form-mac-address'),
            purchase_date: dom.getValue('inv-form-purchase-date'),
            warranty_expires: dom.getValue('inv-form-warranty-expires'),
            notes: dom.getValue('inv-form-notes'),
            performed_by
        };

        try {
            if (id) {
                await apiClient.put(`/inventory/${id}`, payload);
            } else {
                await apiClient.post('/inventory', payload);
            }
            this.resetForm();
            this.switchTab('monitoring');
        } catch (error) {
            console.error('Erro ao salvar item de inventário:', error);
            alert('Erro ao salvar equipamento: ' + (error.message || 'Falha na requisição.'));
        }
    },

    async deleteItem(id, name) {
        if (!confirm(`Tem certeza que deseja excluir o equipamento "${name}"? Esta ação registrará um log de exclusão no histórico.`)) {
            return;
        }

        const user = auth.getUser();
        const performed_by = user ? `${user.name} (${user.email})` : 'Usuário TI';

        try {
            await apiClient.delete(`/inventory/${id}?performed_by=${encodeURIComponent(performed_by)}`);
            this.fetch();
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            alert('Erro ao excluir item de inventário: ' + (error.message || 'Falha na requisição.'));
        }
    },

    async fetchCategories() {
        try {
            const data = await apiClient.get('/inventory/categories');
            inventoryCategories = Array.isArray(data) ? data : [];
            this.renderCategoryDropdowns();
            this.renderCategoryTable();
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    },

    renderCategoryDropdowns() {
        const filterSelect = document.getElementById('inv-filter-category');
        const formSelect = document.getElementById('inv-form-category');

        if (filterSelect) {
            const currentVal = filterSelect.value;
            let html = '<option value="all">Todas as Categorias</option>';
            inventoryCategories.forEach(cat => {
                html += `<option value="${this.escapeHtml(cat.name)}">${this.escapeHtml(cat.name)}</option>`;
            });
            filterSelect.innerHTML = html;
            if (currentVal) filterSelect.value = currentVal;
        }

        if (formSelect) {
            const currentVal = formSelect.value;
            let html = '';
            inventoryCategories.forEach(cat => {
                html += `<option value="${this.escapeHtml(cat.name)}">${this.escapeHtml(cat.name)}</option>`;
            });
            formSelect.innerHTML = html;
            if (currentVal) formSelect.value = currentVal;
        }
    },

    renderCategoryTable() {
        const tbody = document.getElementById('inv-cat-table-body');
        const countSpan = document.getElementById('inv-cat-count');

        if (countSpan) {
            countSpan.textContent = `${inventoryCategories.length} ${inventoryCategories.length === 1 ? 'categoria' : 'categorias'}`;
        }

        if (!tbody) return;

        if (inventoryCategories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted);">
                        Nenhuma categoria cadastrada.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = inventoryCategories.map(cat => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px; font-weight: 600; color: #fff;">${this.escapeHtml(cat.name)}</td>
                <td style="padding: 10px; color: var(--text-muted); font-size: 0.85rem;">${this.escapeHtml(cat.description || '-')}</td>
                <td style="padding: 10px;">
                    ${cat.is_system ? 
                        '<span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;">Sistema</span>' : 
                        '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;">Personalizada</span>'
                    }
                </td>
                <td style="padding: 10px; text-align: right;">
                    ${!cat.is_system ? `
                        <button class="btn-icon btn-delete-cat" data-id="${cat.id}" data-name="${this.escapeHtml(cat.name)}" title="Excluir Categoria" style="color: #ef4444;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    ` : '<span style="font-size: 0.75rem; color: var(--text-muted);">-</span>'}
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-delete-cat').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.getAttribute('data-id'));
                const name = btn.getAttribute('data-name');
                this.deleteCategory(id, name);
            });
        });
    },

    async handleSaveCategory() {
        const nameInput = document.getElementById('inv-cat-name');
        const descInput = document.getElementById('inv-cat-desc');

        const name = nameInput ? nameInput.value.trim() : '';
        const description = descInput ? descInput.value.trim() : '';

        if (!name) {
            alert('Por favor, informe o nome da categoria.');
            return;
        }

        try {
            await apiClient.post('/inventory/categories', { name, description });
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';
            await this.fetchCategories();
            alert(`Categoria "${name}" criada com sucesso!`);
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            alert('Erro ao criar categoria: ' + (error.message || 'Falha na requisição.'));
        }
    },

    async deleteCategory(id, name) {
        if (!confirm(`Deseja realmente excluir a categoria "${name}"?`)) return;

        try {
            await apiClient.delete(`/inventory/categories/${id}`);
            await this.fetchCategories();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria: ' + (error.message || 'Falha na requisição.'));
        }
    },

    openMovementModal(type) {
        const modal = document.getElementById('modal-inv-movement');
        const titleElem = document.getElementById('inv-movement-modal-title');
        const iconElem = document.getElementById('inv-movement-icon');
        const moveTypeInput = document.getElementById('inv-move-type');
        const itemSelect = document.getElementById('inv-move-item-id');
        const statusSelect = document.getElementById('inv-move-status');
        const reasonSelect = document.getElementById('inv-move-reason');
        const locationInput = document.getElementById('inv-move-location');
        const assignedInput = document.getElementById('inv-move-assigned-to');

        if (!modal || !itemSelect) return;

        // Populate item select dropdown
        let html = '<option value="">Selecione um equipamento cadastrado...</option>';
        inventoryItems.forEach(item => {
            const tag = item.asset_tag ? `[${item.asset_tag}] ` : '';
            const statusLabel = item.status ? `(${item.status.toUpperCase()})` : '';
            html += `<option value="${item.id}">${tag}${this.escapeHtml(item.name)} ${statusLabel}</option>`;
        });
        itemSelect.innerHTML = html;

        if (moveTypeInput) moveTypeInput.value = type;

        if (type === 'in') {
            if (iconElem) iconElem.textContent = '🟢';
            if (titleElem) titleElem.innerHTML = '<span>🟢</span> + Entrada / Adicionar ao Estoque';
            if (statusSelect) statusSelect.value = 'ativo';
            if (reasonSelect) reasonSelect.value = 'Entrada de Novo Lote';
        } else {
            if (iconElem) iconElem.textContent = '🔴';
            if (titleElem) titleElem.innerHTML = '<span>🔴</span> - Saída / Retirar do Estoque';
            if (statusSelect) statusSelect.value = 'manutencao';
            if (reasonSelect) reasonSelect.value = 'Envio para Manutenção';
        }

        // Pre-fill fields on item select change
        itemSelect.onchange = () => {
            const selectedId = Number(itemSelect.value);
            const selectedItem = inventoryItems.find(i => i.id === selectedId);
            if (selectedItem) {
                if (locationInput) locationInput.value = selectedItem.location || '';
                if (assignedInput) assignedInput.value = selectedItem.assigned_to || '';
            }
        };

        modal.classList.remove('hidden');
    },

    closeMovementModal() {
        const modal = document.getElementById('modal-inv-movement');
        const form = document.getElementById('form-inv-movement');
        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
    },

    async handleSaveMovement() {
        const itemId = Number(dom.getValue('inv-move-item-id'));
        const moveType = dom.getValue('inv-move-type');
        const newStatus = dom.getValue('inv-move-status');
        const reason = dom.getValue('inv-move-reason');
        const location = dom.getValue('inv-move-location');
        const assigned_to = dom.getValue('inv-move-assigned-to');
        const notes = dom.getValue('inv-move-notes');

        if (!itemId) {
            alert('Por favor, selecione um equipamento.');
            return;
        }

        const item = inventoryItems.find(i => i.id === itemId);
        if (!item) return;

        const user = auth.getUser();
        const performed_by = user ? `${user.name} (${user.email})` : 'Usuário TI';

        const actionPrefix = moveType === 'in' ? 'Entrada (+)' : 'Saída (-)';
        const detailText = `[${actionPrefix}] Motivo: ${reason}. Novo Status: '${newStatus}'. Local: '${location || 'N/A'}'. Responsável: '${assigned_to || 'N/A'}'. ${notes ? 'Obs: ' + notes : ''}`;

        const payload = {
            name: item.name,
            category: item.category,
            status: newStatus,
            brand_model: item.brand_model,
            asset_tag: item.asset_tag,
            serial_number: item.serial_number,
            location: location || item.location,
            assigned_to: assigned_to || item.assigned_to,
            ip_address: item.ip_address,
            mac_address: item.mac_address,
            purchase_date: item.purchase_date,
            warranty_expires: item.warranty_expires,
            notes: notes ? (item.notes ? item.notes + ' | ' + notes : notes) : item.notes,
            performed_by
        };

        try {
            await apiClient.put(`/inventory/${itemId}`, payload);
            this.closeMovementModal();
            await this.fetch();
            alert(`Movimentação de ${actionPrefix} registrada com sucesso para "${item.name}"!`);
        } catch (error) {
            console.error('Erro ao salvar movimentação:', error);
            alert('Erro ao registrar movimentação: ' + (error.message || 'Falha na requisição.'));
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};
