import { apiClient } from '../api/client.js';
import { auth } from '../api/auth.js';
import { dom } from '../utils/dom.js';

let inventoryItems = [];
let auditLogs = [];
let inventoryCategories = [];
let currentSubTab = 'monitoring';
let currentPage = 1;
let itemsPerPage = 10;
let lastSavedItemId = null;

// Pool Tab State
let poolCategoryFilter = 'all';
let poolStatusFilter = 'all';
let poolSearchTerm = '';
let poolCurrentPage = 1;
let poolItemsPerPage = 10;

const DEFAULT_CATEGORIES = [
    { name: "Notebook", description: "Laptops e computadores portáteis", is_system: true },
    { name: "Desktop", description: "Computadores de mesa e estações de trabalho", is_system: true },
    { name: "Servidor", description: "Servidores físicos e lâminas de rack", is_system: true },
    { name: "Switch", description: "Switches de rede de acesso e distribuição", is_system: true },
    { name: "Roteador", description: "Roteadores e gateways de borda", is_system: true },
    { name: "Monitor", description: "Monitores e telas de vídeo", is_system: true },
    { name: "Impressora", description: "Impressoras térmicas, multifuncionais e laser", is_system: true },
    { name: "Nobreak", description: "Nobreaks e estabilizadores", is_system: true },
    { name: "Periférico", description: "Teclados, mouses, webcams e fones", is_system: true },
    { name: "Outro", description: "Diversos e equipamentos gerais", is_system: true }
];

export const inventoryHandler = {
    init() {
        // Expose globally for inline HTML events
        window.InventoryHandler = this;

        this.setupTabListeners();
        this.setupFormListeners();
        this.setupFilterListeners();
        this.setupDetailsModalListeners();
        this.setupPoolListeners();
        this.setupLiveFormMatching();
        this.setupMovementAutocomplete();
        this.fetchCategories();
    },

    // ============================================================
    // PRODUCT CATALOG & STOCK AVAILABILITY ENGINE (CASE-INSENSITIVE)
    // ============================================================
    getProductKey(name, category) {
        const normName = (name || '').trim().toLowerCase();
        const normCategory = (category || 'Outro').trim().toLowerCase();
        return `${normName}:::${normCategory}`;
    },

    getProductCatalog() {
        const catalogMap = new Map();

        inventoryItems.forEach(item => {
            const key = this.getProductKey(item.name, item.category);
            const status = (item.status || 'ativo').toLowerCase();

            if (!catalogMap.has(key)) {
                catalogMap.set(key, {
                    key,
                    name: (item.name || '').trim(),
                    category: item.category || 'Outro',
                    brand_model: item.brand_model || '',
                    total: 0,
                    available: 0, // Reserva / Estoque
                    inUse: 0,     // Ativo / Em Uso
                    maintenance: 0, // Em Manutenção
                    desativado: 0, // Desativado
                    items: []
                });
            }

            const product = catalogMap.get(key);
            product.total += 1;
            product.items.push(item);

            if (status === 'reserva') {
                product.available += 1;
            } else if (status === 'ativo') {
                product.inUse += 1;
            } else if (status === 'manutencao') {
                product.maintenance += 1;
            } else if (status === 'desativado') {
                product.desativado += 1;
            }
        });

        return Array.from(catalogMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    },

    getProductAvailability(name, category) {
        if (!name) return null;
        const key = this.getProductKey(name, category);
        const catalog = this.getProductCatalog();
        return catalog.find(p => p.key === key) || null;
    },

    setupLiveFormMatching() {
        const nameInput = document.getElementById('inv-form-name');
        const catSelect = document.getElementById('inv-form-category');
        const matchBox = document.getElementById('inv-form-product-match');

        const checkMatch = () => {
            if (!nameInput || !matchBox) return;
            const name = nameInput.value.trim();
            const category = catSelect ? catSelect.value : 'Outro';

            if (!name || name.length < 2) {
                matchBox.classList.add('hidden');
                matchBox.innerHTML = '';
                return;
            }

            const matched = this.getProductAvailability(name, category);
            if (matched) {
                matchBox.classList.remove('hidden');
                matchBox.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                        <div>
                            <span style="color: #a5b4fc; font-weight: 700;">📦 Produto existente no catálogo:</span>
                            <strong style="color: #fff;">${this.escapeHtml(matched.name)}</strong> (${this.escapeHtml(matched.category)})
                        </div>
                        <div style="display: flex; gap: 10px; font-size: 0.8rem;">
                            <span style="color: #34d399; font-weight: 700;">🟢 Estoque: ${matched.available}</span>
                            <span style="color: #60a5fa; font-weight: 700;">🔵 Em Uso: ${matched.inUse}</span>
                            <span style="color: #fbbf24; font-weight: 700;">🟡 Manutenção: ${matched.maintenance}</span>
                            <span style="color: #fff; font-weight: 700;">Total: ${matched.total}</span>
                        </div>
                    </div>
                `;
            } else {
                matchBox.classList.add('hidden');
                matchBox.innerHTML = '';
            }
        };

        if (nameInput) nameInput.addEventListener('input', checkMatch);
        if (catSelect) catSelect.addEventListener('change', checkMatch);
    },

    setupTabListeners() {
        const tabMonitoring = document.getElementById('tab-inv-monitoring');
        const tabPool = document.getElementById('tab-inv-pool');
        const tabConfig = document.getElementById('tab-inv-config');
        const tabCategories = document.getElementById('tab-inv-categories');
        const btnCreateNew = document.getElementById('btn-inv-create-new');
        const btnMovementIn = document.getElementById('btn-inv-movement-in');
        const btnMovementUse = document.getElementById('btn-inv-movement-use');
        const btnMovementMaint = document.getElementById('btn-inv-movement-maint');
        const btnMovementOut = document.getElementById('btn-inv-movement-out');
        const btnClearFilters = document.getElementById('btn-inv-clear-filters');
        const btnExportCsv = document.getElementById('btn-inv-export-csv');

        if (tabMonitoring) {
            tabMonitoring.addEventListener('click', () => this.switchTab('monitoring'));
        }
        if (tabPool) {
            tabPool.addEventListener('click', () => this.switchTab('pool'));
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
        if (btnMovementUse) {
            btnMovementUse.addEventListener('click', () => this.openMovementModal('use'));
        }
        if (btnMovementMaint) {
            btnMovementMaint.addEventListener('click', () => this.openMovementModal('maint'));
        }
        if (btnMovementOut) {
            btnMovementOut.addEventListener('click', () => this.openMovementModal('out'));
        }
        if (btnClearFilters) {
            btnClearFilters.addEventListener('click', () => this.clearFilters());
        }
        if (btnExportCsv) {
            btnExportCsv.addEventListener('click', () => this.exportToCSV());
        }
    },

    async switchTab(tab) {
        currentSubTab = tab;
        const tabMonitoring = document.getElementById('tab-inv-monitoring');
        const tabPool = document.getElementById('tab-inv-pool');
        const tabConfig = document.getElementById('tab-inv-config');
        const tabCategories = document.getElementById('tab-inv-categories');

        const viewMonitoring = document.getElementById('view-inv-monitoring');
        const viewPool = document.getElementById('view-inv-pool');
        const viewConfig = document.getElementById('view-inv-config');
        const viewCategories = document.getElementById('view-inv-categories');

        [tabMonitoring, tabPool, tabConfig, tabCategories].forEach(t => t?.classList.remove('active'));
        [viewMonitoring, viewPool, viewConfig, viewCategories].forEach(v => v?.classList.add('hidden'));

        if (tab === 'monitoring') {
            tabMonitoring?.classList.add('active');
            viewMonitoring?.classList.remove('hidden');
            await this.fetch(lastSavedItemId);
            lastSavedItemId = null;
        } else if (tab === 'pool') {
            tabPool?.classList.add('active');
            viewPool?.classList.remove('hidden');
            if (!inventoryItems || inventoryItems.length === 0) {
                await this.fetch();
            }
            this.renderCategoryDropdowns();
            this.renderPoolView();
        } else if (tab === 'config') {
            tabConfig?.classList.add('active');
            viewConfig?.classList.remove('hidden');
            await this.fetchCategories();
        } else if (tab === 'categories') {
            tabCategories?.classList.add('active');
            viewCategories?.classList.remove('hidden');
            await this.fetchCategories();
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

        const qtyInput = document.getElementById('inv-move-quantity');
        const btnQtyMinus = document.getElementById('btn-inv-qty-minus');
        const btnQtyPlus = document.getElementById('btn-inv-qty-plus');
        const qtyHint = document.getElementById('inv-move-qty-hint');

        const updateQtyHint = () => {
            if (!qtyInput) return;
            let val = parseInt(qtyInput.value) || 1;
            if (val < 1) val = 1;
            qtyInput.value = val;
            if (qtyHint) {
                qtyHint.textContent = `(${val} ${val === 1 ? 'unidade selecionada' : 'unidades selecionadas'})`;
            }
        };

        if (btnQtyMinus) {
            btnQtyMinus.addEventListener('click', () => {
                if (!qtyInput) return;
                let val = parseInt(qtyInput.value) || 1;
                if (val > 1) {
                    qtyInput.value = val - 1;
                    updateQtyHint();
                }
            });
        }

        if (btnQtyPlus) {
            btnQtyPlus.addEventListener('click', () => {
                if (!qtyInput) return;
                let val = parseInt(qtyInput.value) || 1;
                qtyInput.value = val + 1;
                updateQtyHint();
            });
        }

        if (qtyInput) {
            qtyInput.addEventListener('input', updateQtyHint);
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
            debounceTimer = setTimeout(() => {
                currentPage = 1;
                this.fetch();
            }, 250);
        };

        if (searchInput) searchInput.addEventListener('input', triggerFetch);
        if (categoryFilter) categoryFilter.addEventListener('change', triggerFetch);
        if (statusFilter) statusFilter.addEventListener('change', triggerFetch);
    },

    setupDetailsModalListeners() {
        const modal = document.getElementById('modal-inv-details');
        const btnClose1 = document.getElementById('btn-close-inv-details');
        const btnClose2 = document.getElementById('btn-close-inv-details-footer');
        const btnEditFromDetail = document.getElementById('btn-inv-detail-edit');

        const closeModal = () => {
            if (modal) modal.classList.add('hidden');
        };

        if (btnClose1) btnClose1.addEventListener('click', closeModal);
        if (btnClose2) btnClose2.addEventListener('click', closeModal);

        if (btnEditFromDetail) {
            btnEditFromDetail.addEventListener('click', () => {
                const id = Number(modal?.getAttribute('data-item-id'));
                const item = inventoryItems.find(i => i.id === id);
                closeModal();
                if (item) this.openEditForm(item);
            });
        }
    },

    setupPoolListeners() {
        const poolCategorySelect = document.getElementById('pool-filter-category');
        const btnClearCategory = document.getElementById('btn-pool-clear-category');
        const btnRefreshPool = document.getElementById('btn-pool-refresh');
        const btnExportMatrix = document.getElementById('btn-pool-export-matrix');
        const btnExportProducts = document.getElementById('btn-pool-export-products');
        const btnExportGrid = document.getElementById('btn-pool-export-grid');
        const poolSearchInput = document.getElementById('pool-search-input');
        const statusPills = document.querySelectorAll('#pool-status-pills .pool-filter-pill');

        if (poolCategorySelect) {
            poolCategorySelect.addEventListener('change', (e) => {
                poolCategoryFilter = e.target.value;
                poolCurrentPage = 1;
                this.renderPoolView();
            });
        }

        if (btnClearCategory) {
            btnClearCategory.addEventListener('click', () => {
                poolCategoryFilter = 'all';
                if (poolCategorySelect) poolCategorySelect.value = 'all';
                poolCurrentPage = 1;
                this.renderPoolView();
                this.showToast('info', 'Filtro de categoria do Pool resetado.');
            });
        }

        if (btnRefreshPool) {
            btnRefreshPool.addEventListener('click', async () => {
                await this.fetch();
                this.showToast('success', 'Dados do Pool atualizados.');
            });
        }

        if (btnExportMatrix) {
            btnExportMatrix.addEventListener('click', () => this.exportPoolMatrixToCSV());
        }

        if (btnExportProducts) {
            btnExportProducts.addEventListener('click', () => this.exportPoolProductsToCSV());
        }

        if (btnExportGrid) {
            btnExportGrid.addEventListener('click', () => this.exportPoolGridToCSV());
        }

        if (poolSearchInput) {
            let debounceTimer;
            poolSearchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    poolSearchTerm = e.target.value.toLowerCase().trim();
                    poolCurrentPage = 1;
                    this.renderPoolGrid();
                }, 200);
            });
        }

        statusPills.forEach(pill => {
            pill.addEventListener('click', () => {
                statusPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                poolStatusFilter = pill.getAttribute('data-pool-status') || 'all';
                poolCurrentPage = 1;
                this.renderPoolGrid();
            });
        });
    },

    clearFilters() {
        const searchInput = document.getElementById('inv-search-input');
        const categoryFilter = document.getElementById('inv-filter-category');
        const statusFilter = document.getElementById('inv-filter-status');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';

        currentPage = 1;
        this.fetch();
        this.showToast('info', 'Filtros restaurados com sucesso.');
    },

    async fetch(highlightId = null) {
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
            this.renderTable(highlightId);

            // Fetch Audit Logs asynchronously
            this.fetchAuditLogs();

            // If pool tab is currently active, re-render pool
            if (currentSubTab === 'pool') {
                this.renderPoolView();
            }
        } catch (error) {
            console.error('Erro ao buscar inventário:', error);
            this.showToast('error', 'Erro ao carregar dados do inventário.');
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

    renderAuditTable() {
        const tbody = document.getElementById('inv-audit-table-body');
        if (!tbody) return;
        if (!auditLogs || auditLogs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">Nenhum registro de auditoria encontrado.</td></tr>';
            return;
        }
        tbody.innerHTML = auditLogs.slice(0, 50).map(log => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px 10px; color: var(--text-muted); font-size: 0.8rem;">${log.created_at ? new Date(log.created_at).toLocaleString('pt-BR') : '-'}</td>
                <td style="padding: 8px 10px; font-weight: 600; color: #fff;">${this.escapeHtml(log.item_name || 'Item #' + log.item_id)}</td>
                <td style="padding: 8px 10px;"><span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;">${this.escapeHtml(log.action)}</span></td>
                <td style="padding: 8px 10px; font-size: 0.85rem; color: #cbd5e1;">${this.escapeHtml(log.details || '-')}</td>
                <td style="padding: 8px 10px; font-size: 0.8rem; color: #818cf8;">${this.escapeHtml(log.performed_by || '-')}</td>
            </tr>
        `).join('');
    },

    renderStats() {
        const statTotal = document.getElementById('inv-stat-total');
        const statActive = document.getElementById('inv-stat-active');
        const statMaintenance = document.getElementById('inv-stat-maintenance');
        const statReserve = document.getElementById('inv-stat-reserve');

        const total = inventoryItems.length;
        const active = inventoryItems.filter(i => (i.status || '').toLowerCase() === 'ativo').length;
        const maintenance = inventoryItems.filter(i => (i.status || '').toLowerCase() === 'manutencao').length;
        const reserve = inventoryItems.filter(i => (i.status || '').toLowerCase() === 'reserva').length;

        if (statTotal) statTotal.textContent = total;
        if (statActive) statActive.textContent = active;
        if (statMaintenance) statMaintenance.textContent = maintenance;
        if (statReserve) statReserve.textContent = reserve;
    },

    setPageSize(size) {
        itemsPerPage = size;
        currentPage = 1;
        this.renderTable();
    },

    changePage(page) {
        currentPage = page;
        this.renderTable();
    },

    renderTable(highlightId = null) {
        const tbody = document.getElementById('inv-table-body');
        const countSpan = document.getElementById('inv-items-count');

        const totalItems = inventoryItems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        if (currentPage < 1) currentPage = 1;

        if (countSpan) {
            countSpan.textContent = `${totalItems} ${totalItems === 1 ? 'item encontrado' : 'itens encontrados'}`;
        }

        if (!tbody) return;

        if (totalItems === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                        <div style="font-size: 2rem; margin-bottom: 8px;">📦</div>
                        <div style="font-weight: 600; font-size: 1rem; color: #fff;">Nenhum equipamento encontrado</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                            Tente limpar os filtros de pesquisa ou cadastre um novo item na aba Configuração.
                        </div>
                    </td>
                </tr>
            `;
            this.renderPaginationControls('inventory-pagination', 0, 0);
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = inventoryItems.slice(startIndex, startIndex + itemsPerPage);

        const statusBadges = {
            ativo: '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Ativo / Em Uso</span>',
            manutencao: '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Em Manutenção</span>',
            reserva: '<span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Reserva / Estoque</span>',
            desativado: '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 10px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">Desativado</span>'
        };

        tbody.innerHTML = paginatedItems.map(item => {
            const isHighlight = highlightId && Number(item.id) === Number(highlightId);
            const rowClass = isHighlight ? 'row-newly-added' : '';
            const statusKey = (item.status || 'ativo').toLowerCase();
            const badgeHtml = statusBadges[statusKey] || `<span class="badge">${this.escapeHtml(item.status)}</span>`;

            return `
            <tr class="${rowClass}" style="border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'" data-item-id="${item.id}">
                <td style="padding: 12px 10px;">
                    <span style="font-family: monospace; font-weight: 700; color: #a5b4fc; background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.25); padding: 4px 9px; border-radius: 6px; font-size: 0.85rem;">
                        ${item.asset_tag ? this.escapeHtml(item.asset_tag) : 'S/P-' + item.id}
                    </span>
                    ${isHighlight ? '<span style="display: inline-block; margin-left: 6px; font-size: 0.7rem; font-weight: 700; background: #10b981; color: #fff; padding: 2px 6px; border-radius: 10px;">NOVO</span>' : ''}
                </td>
                <td style="padding: 12px 10px;">
                    <strong style="color: #fff; display: block; font-size: 0.95rem;">${this.escapeHtml(item.name)}</strong>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${item.brand_model ? this.escapeHtml(item.brand_model) : ''}</span>
                </td>
                <td style="padding: 12px 10px; color: #e2e8f0; font-size: 0.85rem;">
                    <span style="background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 6px; font-weight: 500;">
                        ${this.escapeHtml(item.category || 'Outro')}
                    </span>
                </td>
                <td style="padding: 12px 10px;">
                    ${badgeHtml}
                </td>
                <td style="padding: 12px 10px; font-size: 0.85rem; color: var(--text-muted);">
                    <div style="color: #fff; font-weight: 500;">${item.location ? this.escapeHtml(item.location) : 'N/A'}</div>
                    <div style="font-size: 0.8rem;">${item.assigned_to ? '👤 ' + this.escapeHtml(item.assigned_to) : 'Sem responsável'}</div>
                </td>
                <td style="padding: 12px 10px; font-size: 0.85rem; color: var(--text-muted); font-family: monospace;">
                    <div>${item.serial_number ? 'S/N: ' + this.escapeHtml(item.serial_number) : '-'}</div>
                    <div style="color: #818cf8; font-weight: 600;">${item.ip_address ? 'IP: ' + this.escapeHtml(item.ip_address) : ''}</div>
                </td>
                <td style="padding: 12px 10px; text-align: right;" onclick="event.stopPropagation();">
                    <div style="display: inline-flex; gap: 4px; align-items: center;">
                        <button class="btn-icon btn-view-inv" data-id="${item.id}" title="Visualizar Detalhes" style="color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 6px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button class="btn-icon btn-edit-inv" data-id="${item.id}" title="Editar Equipamento" style="color: #818cf8; background: rgba(129, 140, 248, 0.1); padding: 6px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon btn-delete-inv" data-id="${item.id}" data-name="${this.escapeHtml(item.name)}" title="Excluir Equipamento" style="color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');

        // Attach action listeners
        tbody.querySelectorAll('tr[data-item-id]').forEach(row => {
            row.addEventListener('click', () => {
                const id = Number(row.getAttribute('data-item-id'));
                const item = inventoryItems.find(i => i.id === id);
                if (item) this.openItemDetailsModal(item);
            });
        });

        tbody.querySelectorAll('.btn-view-inv').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = Number(btn.getAttribute('data-id'));
                const item = inventoryItems.find(i => i.id === id);
                if (item) this.openItemDetailsModal(item);
            });
        });

        tbody.querySelectorAll('.btn-edit-inv').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = Number(btn.getAttribute('data-id'));
                const item = inventoryItems.find(i => i.id === id);
                if (item) this.openEditForm(item);
            });
        });

        tbody.querySelectorAll('.btn-delete-inv').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = Number(btn.getAttribute('data-id'));
                const name = btn.getAttribute('data-name');
                this.deleteItem(id, name);
            });
        });

        this.renderPaginationControls('inventory-pagination', totalPages, totalItems);
    },

    renderPaginationControls(containerId, totalPages, totalItems) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (totalPages === 0) {
            container.innerHTML = '';
            return;
        }

        let html = `
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.InventoryHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
                    <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
                    <option value="100" ${itemsPerPage === 100 ? 'selected' : ''}>100</option>
                </select>
            </div>
        `;

        // Prev Button
        html += `
            <button class="pagination-btn" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="window.InventoryHandler.changePage(${currentPage - 1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;

        // Page buttons
        let lastPrintedPage = 0;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                if (lastPrintedPage && i - lastPrintedPage > 1) {
                    html += `<span style="color: var(--text-muted); padding: 0 4px;">...</span>`;
                }
                html += `
                    <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                            onclick="window.InventoryHandler.changePage(${i})">
                        ${i}
                    </button>
                `;
                lastPrintedPage = i;
            }
        }

        // Next Button
        html += `
            <button class="pagination-btn" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="window.InventoryHandler.changePage(${currentPage + 1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;

        // Pagination Info
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        html += `
            <span class="pagination-info">
                Exibindo ${start}-${end} de ${totalItems}
            </span>
        `;

        container.innerHTML = html;
    },

    // ============================================================
    // POOL VIEW & EXCEL-LIKE CONSOLIDATION METHODS
    // ============================================================
    renderPoolView() {
        this.renderPoolKPIs();
        this.renderPoolMatrix();
        this.renderPoolProductsTable();
        this.renderPoolGrid();
    },

    getFilteredPoolItems() {
        if (poolCategoryFilter === 'all') {
            return inventoryItems;
        }
        return inventoryItems.filter(i => (i.category || 'Outro') === poolCategoryFilter);
    },

    renderPoolKPIs() {
        const poolItems = this.getFilteredPoolItems();
        const total = poolItems.length;
        const active = poolItems.filter(i => (i.status || '').toLowerCase() === 'ativo').length;
        const reserve = poolItems.filter(i => (i.status || '').toLowerCase() === 'reserva').length;
        const maintenance = poolItems.filter(i => (i.status || '').toLowerCase() === 'manutencao').length;
        const desativado = poolItems.filter(i => (i.status || '').toLowerCase() === 'desativado').length;

        const calcPct = (count) => total > 0 ? `${((count / total) * 100).toFixed(1)}% do pool` : '0% do pool';

        dom.setText('pool-stat-total', total);
        dom.setText('pool-stat-active', active);
        dom.setText('pool-stat-active-pct', calcPct(active));

        dom.setText('pool-stat-reserve', reserve);
        dom.setText('pool-stat-reserve-pct', calcPct(reserve));

        dom.setText('pool-stat-maintenance', maintenance);
        dom.setText('pool-stat-maintenance-pct', calcPct(maintenance));

        dom.setText('pool-stat-desativado', desativado);
        dom.setText('pool-stat-desativado-pct', calcPct(desativado));

        // Pill counts
        dom.setText('pool-pill-all', total);
        dom.setText('pool-pill-ativo', active);
        dom.setText('pool-pill-reserva', reserve);
        dom.setText('pool-pill-manutencao', maintenance);
        dom.setText('pool-pill-desativado', desativado);
    },

    getCategoryMatrixData() {
        // Collect all unique categories
        const itemCategories = inventoryItems.map(i => i.category || 'Outro');
        const dbCategoryNames = (inventoryCategories || []).map(c => c.name);
        const defaultNames = DEFAULT_CATEGORIES.map(c => c.name);
        let allCategoryNames = [...new Set([...itemCategories, ...dbCategoryNames, ...defaultNames])].filter(Boolean).sort();

        // If category filter is active, only show that category in the matrix
        if (poolCategoryFilter !== 'all') {
            allCategoryNames = allCategoryNames.filter(c => c === poolCategoryFilter);
        }

        const matrix = [];
        let totalActive = 0, totalReserve = 0, totalMaintenance = 0, totalDesativado = 0, totalGrand = 0;

        allCategoryNames.forEach(catName => {
            const itemsInCat = inventoryItems.filter(i => (i.category || 'Outro') === catName);
            const active = itemsInCat.filter(i => (i.status || '').toLowerCase() === 'ativo').length;
            const reserve = itemsInCat.filter(i => (i.status || '').toLowerCase() === 'reserva').length;
            const maintenance = itemsInCat.filter(i => (i.status || '').toLowerCase() === 'manutencao').length;
            const desativado = itemsInCat.filter(i => (i.status || '').toLowerCase() === 'desativado').length;
            const total = itemsInCat.length;

            totalActive += active;
            totalReserve += reserve;
            totalMaintenance += maintenance;
            totalDesativado += desativado;
            totalGrand += total;

            const usagePct = total > 0 ? ((active / total) * 100).toFixed(0) : 0;

            matrix.push({
                category: catName,
                active,
                reserve,
                maintenance,
                desativado,
                total,
                usagePct
            });
        });

        const grandUsagePct = totalGrand > 0 ? ((totalActive / totalGrand) * 100).toFixed(0) : 0;

        return {
            matrix,
            totals: {
                totalActive,
                totalReserve,
                totalMaintenance,
                totalDesativado,
                totalGrand,
                grandUsagePct
            }
        };
    },

    renderPoolMatrix() {
        const tbody = document.getElementById('pool-matrix-tbody');
        const tfoot = document.getElementById('pool-matrix-tfoot');
        if (!tbody) return;

        const { matrix, totals } = this.getCategoryMatrixData();

        if (matrix.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-muted);">Nenhum dado encontrado para a categoria selecionada.</td></tr>`;
            if (tfoot) tfoot.innerHTML = '';
            return;
        }

        tbody.innerHTML = matrix.map(row => {
            const barColor = Number(row.usagePct) >= 75 ? '#34d399' : Number(row.usagePct) >= 40 ? '#60a5fa' : '#fbbf24';
            return `
                <tr>
                    <td style="font-weight: 600; color: #fff;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${row.total > 0 ? '#818cf8' : 'rgba(255,255,255,0.2)'}; margin-right: 8px;"></span>
                        ${this.escapeHtml(row.category)}
                    </td>
                    <td class="pool-cell-number" style="color: #34d399;">${row.active}</td>
                    <td class="pool-cell-number" style="color: #60a5fa;">${row.reserve}</td>
                    <td class="pool-cell-number" style="color: #fbbf24;">${row.maintenance}</td>
                    <td class="pool-cell-number" style="color: #f87171;">${row.desativado}</td>
                    <td class="pool-cell-number" style="color: #fff; font-size: 1rem; background: rgba(255,255,255,0.02);">${row.total}</td>
                    <td style="text-align: center; padding: 8px 12px;">
                        <div style="font-weight: 700; font-size: 0.82rem; color: ${barColor}; font-family: monospace;">${row.usagePct}%</div>
                        <div class="pool-progress-container">
                            <div class="pool-progress-bar" style="width: ${row.usagePct}%; background: ${barColor};"></div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (tfoot) {
            tfoot.innerHTML = `
                <tr>
                    <td style="font-weight: 800; color: #fff; letter-spacing: 0.05em;">TOTAL GERAL DO POOL</td>
                    <td class="pool-cell-number" style="color: #34d399; font-size: 1.1rem;">${totals.totalActive}</td>
                    <td class="pool-cell-number" style="color: #60a5fa; font-size: 1.1rem;">${totals.totalReserve}</td>
                    <td class="pool-cell-number" style="color: #fbbf24; font-size: 1.1rem;">${totals.totalMaintenance}</td>
                    <td class="pool-cell-number" style="color: #f87171; font-size: 1.1rem;">${totals.totalDesativado}</td>
                    <td class="pool-cell-number" style="color: #fff; font-size: 1.2rem; background: rgba(99, 102, 241, 0.2);">${totals.totalGrand}</td>
                    <td style="text-align: center;">
                        <div style="font-weight: 800; font-size: 0.9rem; color: #a5b4fc; font-family: monospace;">${totals.grandUsagePct}%</div>
                    </td>
                </tr>
            `;
        }
    },

    // ============================================================
    // PRODUCT AVAILABILITY & STOCK SUMMARY TABLE (POOL VIEW)
    // ============================================================
    renderPoolProductsTable() {
        const tbody = document.getElementById('pool-products-tbody');
        if (!tbody) return;

        let catalog = this.getProductCatalog();
        if (poolCategoryFilter !== 'all') {
            catalog = catalog.filter(p => p.category === poolCategoryFilter);
        }

        if (catalog.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 25px; color: var(--text-muted);">
                        Nenhum produto cadastrado no catálogo com a categoria selecionada.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = catalog.map(p => {
            let availabilityBadge;
            if (p.available > 1) {
                availabilityBadge = `<span class="badge" style="background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🟢 Disponível (${p.available} un)</span>`;
            } else if (p.available === 1) {
                availabilityBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🟡 Estoque Baixo (1 un)</span>`;
            } else {
                availabilityBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🔴 Sem Estoque (0 un)</span>`;
            }

            return `
                <tr>
                    <td style="font-weight: 600; color: #fff;">
                        <span style="display: block; font-size: 0.92rem;">${this.escapeHtml(p.name)}</span>
                        ${p.brand_model ? `<span style="font-size: 0.75rem; color: var(--text-muted);">${this.escapeHtml(p.brand_model)}</span>` : ''}
                    </td>
                    <td style="color: #cbd5e1; font-size: 0.85rem;">
                        <span style="background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px;">
                            ${this.escapeHtml(p.category)}
                        </span>
                    </td>
                    <td class="pool-cell-number" style="color: #34d399; font-size: 1.05rem;">
                        <strong>${p.available}</strong>
                    </td>
                    <td class="pool-cell-number" style="color: #60a5fa;">
                        ${p.inUse}
                    </td>
                    <td class="pool-cell-number" style="color: #fbbf24;">
                        ${p.maintenance}
                    </td>
                    <td class="pool-cell-number" style="color: #fff; font-size: 1.05rem; background: rgba(255,255,255,0.02);">
                        ${p.total}
                    </td>
                    <td style="text-align: center;">
                        ${availabilityBadge}
                    </td>
                </tr>
            `;
        }).join('');
    },

    exportPoolProductsToCSV() {
        let catalog = this.getProductCatalog();
        if (poolCategoryFilter !== 'all') {
            catalog = catalog.filter(p => p.category === poolCategoryFilter);
        }

        if (catalog.length === 0) {
            this.showToast('info', 'Sem dados de produtos para exportar.');
            return;
        }

        const headers = ["Produto / Modelo", "Categoria", "Disponível em Estoque (Reserva)", "Em Uso (Ativo)", "Em Manutenção", "Desativado", "Total Geral", "Status Estoque"];
        const rows = catalog.map(p => {
            const stockStatus = p.available > 1 ? `Disponível (${p.available} un)` : p.available === 1 ? 'Estoque Baixo (1 un)' : 'Sem Estoque (0 un)';
            return [
                p.name,
                p.category,
                p.available,
                p.inUse,
                p.maintenance,
                p.desativado,
                p.total,
                stockStatus
            ];
        });

        let csvContent = "\uFEFF";
        csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(";") + "\r\n";
        rows.forEach(row => {
            csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";") + "\r\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStr = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `disponibilidade_estoque_produtos_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('success', 'Relatório de disponibilidade de produtos exportado com sucesso.');
    },

    renderPoolGrid() {
        const tbody = document.getElementById('pool-grid-tbody');
        const countSpan = document.getElementById('pool-grid-count');
        if (!tbody) return;

        let filtered = this.getFilteredPoolItems();

        // Apply status pill filter
        if (poolStatusFilter !== 'all') {
            filtered = filtered.filter(i => (i.status || '').toLowerCase() === poolStatusFilter.toLowerCase());
        }

        // Apply search term filter
        if (poolSearchTerm) {
            filtered = filtered.filter(i => {
                const combined = `${i.name || ''} ${i.brand_model || ''} ${i.serial_number || ''} ${i.asset_tag || ''} ${i.location || ''} ${i.assigned_to || ''} ${i.ip_address || ''} ${i.category || ''}`.toLowerCase();
                return combined.includes(poolSearchTerm);
            });
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / poolItemsPerPage);

        if (poolCurrentPage > totalPages) poolCurrentPage = Math.max(1, totalPages);
        if (poolCurrentPage < 1) poolCurrentPage = 1;

        if (countSpan) {
            countSpan.textContent = `${totalItems} ${totalItems === 1 ? 'item exibido' : 'itens exibidos'} no pool`;
        }

        if (totalItems === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
                        Nenhum item encontrado no pool com os filtros selecionados.
                    </td>
                </tr>
            `;
            this.renderPoolPagination(0, 0);
            return;
        }

        const startIndex = (poolCurrentPage - 1) * poolItemsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + poolItemsPerPage);

        const statusBadges = {
            ativo: '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🟢 Ativo</span>',
            reserva: '<span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🔵 Estoque</span>',
            manutencao: '<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🟡 Manutenção</span>',
            desativado: '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🔴 Desativado</span>'
        };

        tbody.innerHTML = paginated.map(item => {
            const statusKey = (item.status || 'ativo').toLowerCase();
            const badgeHtml = statusBadges[statusKey] || `<span class="badge">${this.escapeHtml(item.status)}</span>`;

            return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'" data-item-id="${item.id}">
                    <td style="padding: 10px 8px;">
                        <span style="font-family: monospace; font-weight: 700; color: #a5b4fc; background: rgba(99, 102, 241, 0.12); padding: 3px 7px; border-radius: 4px; font-size: 0.8rem;">
                            ${item.asset_tag ? this.escapeHtml(item.asset_tag) : 'S/P-' + item.id}
                        </span>
                    </td>
                    <td style="padding: 10px 8px;">
                        <strong style="color: #fff; font-size: 0.9rem; display: block;">${this.escapeHtml(item.name)}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${item.brand_model ? this.escapeHtml(item.brand_model) : ''}</span>
                    </td>
                    <td style="padding: 10px 8px; color: #cbd5e1; font-size: 0.85rem;">
                        ${this.escapeHtml(item.category || 'Outro')}
                    </td>
                    <td style="padding: 10px 8px;">
                        ${badgeHtml}
                    </td>
                    <td style="padding: 10px 8px; color: #cbd5e1; font-size: 0.85rem;">
                        ${item.location ? this.escapeHtml(item.location) : '-'}
                    </td>
                    <td style="padding: 10px 8px; color: #cbd5e1; font-size: 0.85rem;">
                        ${item.assigned_to ? this.escapeHtml(item.assigned_to) : '<span style="color: var(--text-muted);">-</span>'}
                    </td>
                    <td style="padding: 10px 8px; font-size: 0.8rem; font-family: monospace; color: var(--text-muted);">
                        <div>${item.serial_number ? this.escapeHtml(item.serial_number) : '-'}</div>
                        <div style="color: #818cf8;">${item.ip_address ? this.escapeHtml(item.ip_address) : ''}</div>
                    </td>
                    <td style="padding: 10px 8px; text-align: right;" onclick="event.stopPropagation();">
                        <button class="btn-icon btn-pool-view-item" data-id="${item.id}" title="Visualizar Detalhes" style="color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 5px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Action listeners
        tbody.querySelectorAll('tr[data-item-id]').forEach(row => {
            row.addEventListener('click', () => {
                const id = Number(row.getAttribute('data-item-id'));
                const item = inventoryItems.find(i => i.id === id);
                if (item) this.openItemDetailsModal(item);
            });
        });

        tbody.querySelectorAll('.btn-pool-view-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = Number(btn.getAttribute('data-id'));
                const item = inventoryItems.find(i => i.id === id);
                if (item) this.openItemDetailsModal(item);
            });
        });

        this.renderPoolPagination(totalPages, totalItems);
    },

    setPoolPageSize(size) {
        poolItemsPerPage = size;
        poolCurrentPage = 1;
        this.renderPoolGrid();
    },

    changePoolPage(page) {
        poolCurrentPage = page;
        this.renderPoolGrid();
    },

    renderPoolPagination(totalPages, totalItems) {
        const container = document.getElementById('pool-pagination');
        if (!container) return;

        if (totalPages === 0) {
            container.innerHTML = '';
            return;
        }

        let html = `
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.InventoryHandler.setPoolPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${poolItemsPerPage === 10 ? 'selected' : ''}>10</option>
                    <option value="25" ${poolItemsPerPage === 25 ? 'selected' : ''}>25</option>
                    <option value="50" ${poolItemsPerPage === 50 ? 'selected' : ''}>50</option>
                    <option value="100" ${poolItemsPerPage === 100 ? 'selected' : ''}>100</option>
                </select>
            </div>
        `;

        html += `
            <button class="pagination-btn" 
                    ${poolCurrentPage === 1 ? 'disabled' : ''} 
                    onclick="window.InventoryHandler.changePoolPage(${poolCurrentPage - 1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;

        let lastPrintedPage = 0;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= poolCurrentPage - 1 && i <= poolCurrentPage + 1)) {
                if (lastPrintedPage && i - lastPrintedPage > 1) {
                    html += `<span style="color: var(--text-muted); padding: 0 4px;">...</span>`;
                }
                html += `
                    <button class="pagination-btn ${i === poolCurrentPage ? 'active' : ''}" 
                            onclick="window.InventoryHandler.changePoolPage(${i})">
                        ${i}
                    </button>
                `;
                lastPrintedPage = i;
            }
        }

        html += `
            <button class="pagination-btn" 
                    ${poolCurrentPage === totalPages ? 'disabled' : ''} 
                    onclick="window.InventoryHandler.changePoolPage(${poolCurrentPage + 1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;

        const start = (poolCurrentPage - 1) * poolItemsPerPage + 1;
        const end = Math.min(poolCurrentPage * poolItemsPerPage, totalItems);
        html += `
            <span class="pagination-info">
                Exibindo ${start}-${end} de ${totalItems}
            </span>
        `;

        container.innerHTML = html;
    },

    exportPoolMatrixToCSV() {
        const { matrix, totals } = this.getCategoryMatrixData();
        if (!matrix || matrix.length === 0) {
            this.showToast('info', 'Sem dados na matriz para exportar.');
            return;
        }

        const headers = ["Categoria", "Ativo / Em Uso", "Estoque / Reserva", "Em Manutenção", "Desativado", "Total Geral", "% Em Uso"];
        const rows = matrix.map(r => [
            r.category,
            r.active,
            r.reserve,
            r.maintenance,
            r.desativado,
            r.total,
            `${r.usagePct}%`
        ]);

        // Append grand totals row
        rows.push([
            "TOTAL GERAL DO POOL",
            totals.totalActive,
            totals.totalReserve,
            totals.totalMaintenance,
            totals.totalDesativado,
            totals.totalGrand,
            `${totals.grandUsagePct}%`
        ]);

        let csvContent = "\uFEFF";
        csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(";") + "\r\n";
        rows.forEach(row => {
            csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";") + "\r\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStr = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `pool_resumo_matriz_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('success', 'Matriz do Pool exportada com sucesso.');
    },

    exportPoolGridToCSV() {
        if (!inventoryItems || inventoryItems.length === 0) {
            this.showToast('info', 'Nenhum equipamento para exportar.');
            return;
        }

        let itemsToExport = this.getFilteredPoolItems();
        if (poolStatusFilter !== 'all') {
            itemsToExport = itemsToExport.filter(i => (i.status || '').toLowerCase() === poolStatusFilter.toLowerCase());
        }

        const headers = [
            "ID", "Patrimônio", "Nome", "Categoria", "Marca / Modelo", "Status Pool",
            "Localização / Setor", "Responsável", "Nº de Série", "Endereço IP",
            "Endereço MAC", "Data de Compra", "Vencimento Garantia", "Observações"
        ];

        const rows = itemsToExport.map(item => [
            item.id,
            item.asset_tag || '',
            item.name || '',
            item.category || '',
            item.brand_model || '',
            item.status || '',
            item.location || '',
            item.assigned_to || '',
            item.serial_number || '',
            item.ip_address || '',
            item.mac_address || '',
            item.purchase_date || '',
            item.warranty_expires || '',
            (item.notes || '').replace(/\r?\n/g, ' ')
        ]);

        let csvContent = "\uFEFF";
        csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(";") + "\r\n";
        rows.forEach(row => {
            csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";") + "\r\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStr = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `pool_ativos_geral_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('success', `Planilha do Pool exportada (${itemsToExport.length} itens).`);
    },

    openItemDetailsModal(item) {
        const modal = document.getElementById('modal-inv-details');
        if (!modal || !item) return;

        modal.setAttribute('data-item-id', item.id);

        dom.setText('inv-detail-asset-tag', item.asset_tag || 'S/P-' + item.id);
        dom.setText('inv-detail-name', item.name || 'Sem nome');
        dom.setText('inv-detail-brand', item.brand_model || 'Modelo não especificado');
        dom.setText('inv-detail-category', item.category || 'Outro');
        dom.setText('inv-detail-serial', item.serial_number || '-');
        dom.setText('inv-detail-location', item.location || 'Não informado');
        dom.setText('inv-detail-assigned', item.assigned_to || 'Sem responsável atribuído');
        dom.setText('inv-detail-ip', item.ip_address || '-');
        dom.setText('inv-detail-mac', item.mac_address || '-');
        dom.setText('inv-detail-purchase-date', item.purchase_date ? this.formatDateBR(item.purchase_date) : '-');
        dom.setText('inv-detail-notes', item.notes || 'Nenhuma observação cadastrada.');

        // Status badge
        const badgeElem = document.getElementById('inv-detail-status-badge');
        if (badgeElem) {
            const statusKey = (item.status || 'ativo').toLowerCase();
            const labels = {
                ativo: 'Ativo / Em Uso',
                manutencao: 'Em Manutenção',
                reserva: 'Reserva / Estoque',
                desativado: 'Desativado'
            };
            const colors = {
                ativo: '#34d399',
                manutencao: '#fbbf24',
                reserva: '#60a5fa',
                desativado: '#f87171'
            };
            badgeElem.innerHTML = `
                <span class="badge" style="background: rgba(255,255,255,0.08); color: ${colors[statusKey] || '#fff'}; border: 1px solid ${colors[statusKey] || '#fff'}; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 12px;">
                    ● ${labels[statusKey] || item.status}
                </span>
            `;
        }

        // Warranty computation
        const warrantyWrapper = document.getElementById('inv-detail-warranty-wrapper');
        if (warrantyWrapper) {
            if (!item.warranty_expires) {
                warrantyWrapper.innerHTML = '<span style="color: var(--text-muted);">-</span>';
            } else {
                const expireDate = new Date(item.warranty_expires);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const diffTime = expireDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0) {
                    warrantyWrapper.innerHTML = `
                        <span class="warranty-badge-valid">
                            ✓ Em Garantia (${this.formatDateBR(item.warranty_expires)} - restam ${diffDays} dias)
                        </span>
                    `;
                } else {
                    warrantyWrapper.innerHTML = `
                        <span class="warranty-badge-expired">
                            ⚠ Expirada (${this.formatDateBR(item.warranty_expires)} - vencida há ${Math.abs(diffDays)} dias)
                        </span>
                    `;
                }
            }
        }

        modal.classList.remove('hidden');
    },

    openEditForm(item) {
        this.resetForm();

        dom.setValue('inv-form-id', item.id);
        dom.setValue('inv-form-name', item.name || '');
        dom.setValue('inv-form-category', item.category || 'Outro');
        dom.setValue('inv-form-brand-model', item.brand_model || '');
        dom.setValue('inv-form-notes', item.notes || '');

        const qtyGroup = document.getElementById('group-inv-form-qty');
        if (qtyGroup) qtyGroup.style.display = 'none';

        const saveBtn = document.getElementById('btn-inv-form-save');
        if (saveBtn) saveBtn.textContent = 'Salvar Alterações';

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

        const qtyGroup = document.getElementById('group-inv-form-qty');
        if (qtyGroup) qtyGroup.style.display = 'block';

        const qtyInput = document.getElementById('inv-form-quantity');
        if (qtyInput) qtyInput.value = '1';

        const saveBtn = document.getElementById('btn-inv-form-save');
        if (saveBtn) saveBtn.textContent = 'Cadastrar Equipamento';

        const matchBox = document.getElementById('inv-form-product-match');
        if (matchBox) {
            matchBox.classList.add('hidden');
            matchBox.innerHTML = '';
        }

        const titleElem = document.getElementById('inv-form-title');
        if (titleElem) {
            titleElem.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Cadastrar Equipamento no Catálogo
            `;
        }
    },

    async handleSaveItem() {
        const id = dom.getValue('inv-form-id');
        const name = dom.getValue('inv-form-name');
        if (!name || !name.trim()) {
            this.showToast('error', 'O nome do equipamento é obrigatório.');
            return;
        }

        const user = auth.getUser();
        const performed_by = user ? `${user.name} (${user.email})` : 'Usuário TI';
        const category = dom.getValue('inv-form-category') || 'Outro';
        const brand_model = dom.getValue('inv-form-brand-model') || '';
        const notes = dom.getValue('inv-form-notes') || '';
        const quantity = Math.max(1, parseInt(dom.getValue('inv-form-quantity')) || 1);

        try {
            if (id) {
                // Update existing item details
                const currentItem = inventoryItems.find(i => i.id === Number(id));
                const payload = {
                    name: name.trim(),
                    category,
                    brand_model,
                    status: currentItem?.status || 'reserva',
                    location: currentItem?.location || '',
                    assigned_to: currentItem?.assigned_to || '',
                    asset_tag: currentItem?.asset_tag || '',
                    serial_number: currentItem?.serial_number || '',
                    notes,
                    performed_by
                };
                await apiClient.put(`/inventory/${id}`, payload);
                lastSavedItemId = Number(id);
                this.showToast('success', `Equipamento "${payload.name}" atualizado com sucesso!`);
            } else {
                // Batch register new equipment items into stock (reserva)
                const batchPayload = {
                    name: name.trim(),
                    category,
                    brand_model,
                    status: 'reserva',
                    location: 'Estoque / TI',
                    assigned_to: '',
                    notes: notes || 'Equipamento cadastrado no catálogo',
                    quantity,
                    asset_tag_prefix: 'PAT',
                    performed_by
                };
                await apiClient.post('/inventory/batch', batchPayload);
                this.showToast('success', `Equipamento "${name.trim()}" cadastrado com sucesso (${quantity} ${quantity === 1 ? 'unidade adicionada ao estoque' : 'unidades adicionadas ao estoque'})!`);
            }

            // Clear search and category filters so the new item is immediately visible
            const searchInput = document.getElementById('inv-search-input');
            const categoryFilter = document.getElementById('inv-filter-category');
            const statusFilter = document.getElementById('inv-filter-status');

            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (statusFilter) statusFilter.value = 'all';

            currentPage = 1;
            this.resetForm();
            await this.switchTab('monitoring');
        } catch (error) {
            console.error('Erro ao salvar item de inventário:', error);
            this.showToast('error', 'Erro ao salvar equipamento: ' + (error.message || 'Falha na requisição.'));
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
            this.showToast('success', `Equipamento "${name}" excluído.`);
            await this.fetch();
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            this.showToast('error', 'Erro ao excluir equipamento: ' + (error.message || 'Falha na requisição.'));
        }
    },

    async fetchCategories() {
        try {
            const data = await apiClient.get('/inventory/categories');
            inventoryCategories = (Array.isArray(data) && data.length > 0) ? data : DEFAULT_CATEGORIES;
            this.renderCategoryDropdowns();
            this.renderCategoryTable();
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            inventoryCategories = DEFAULT_CATEGORIES;
            this.renderCategoryDropdowns();
            this.renderCategoryTable();
        }
    },

    renderCategoryDropdowns() {
        const filterSelect = document.getElementById('inv-filter-category');
        const formSelect = document.getElementById('inv-form-category');
        const poolCatSelect = document.getElementById('pool-filter-category');

        const categoriesToUse = (inventoryCategories && inventoryCategories.length > 0) ? inventoryCategories : DEFAULT_CATEGORIES;

        if (filterSelect) {
            const currentVal = filterSelect.value;
            let html = '<option value="all">Todas as Categorias</option>';
            categoriesToUse.forEach(cat => {
                html += `<option value="${this.escapeHtml(cat.name)}">${this.escapeHtml(cat.name)}</option>`;
            });
            filterSelect.innerHTML = html;
            if (currentVal && Array.from(filterSelect.options).some(o => o.value === currentVal)) {
                filterSelect.value = currentVal;
            }
        }

        if (formSelect) {
            const currentVal = formSelect.value;
            let html = '';
            categoriesToUse.forEach(cat => {
                html += `<option value="${this.escapeHtml(cat.name)}">${this.escapeHtml(cat.name)}</option>`;
            });
            formSelect.innerHTML = html;
            if (currentVal && Array.from(formSelect.options).some(o => o.value === currentVal)) {
                formSelect.value = currentVal;
            }
        }

        if (poolCatSelect) {
            const currentVal = poolCatSelect.value || poolCategoryFilter;
            let html = '<option value="all">📁 Todas as Categorias (Geral)</option>';
            categoriesToUse.forEach(cat => {
                const count = inventoryItems.filter(i => (i.category || 'Outro') === cat.name).length;
                html += `<option value="${this.escapeHtml(cat.name)}">${this.escapeHtml(cat.name)} (${count})</option>`;
            });
            poolCatSelect.innerHTML = html;
            if (currentVal && Array.from(poolCatSelect.options).some(o => o.value === currentVal)) {
                poolCatSelect.value = currentVal;
            }
        }
    },

    renderCategoryTable() {
        const tbody = document.getElementById('inv-cat-table-body');
        const countSpan = document.getElementById('inv-cat-count');

        const categoriesToUse = (inventoryCategories && inventoryCategories.length > 0) ? inventoryCategories : DEFAULT_CATEGORIES;

        if (countSpan) {
            countSpan.textContent = `${categoriesToUse.length} ${categoriesToUse.length === 1 ? 'categoria' : 'categorias'}`;
        }

        if (!tbody) return;

        tbody.innerHTML = categoriesToUse.map(cat => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px; font-weight: 600; color: #fff;">${this.escapeHtml(cat.name)}</td>
                <td style="padding: 10px; color: var(--text-muted); font-size: 0.85rem;">${this.escapeHtml(cat.description || '-')}</td>
                <td style="padding: 10px;">
                    ${cat.is_system ? 
                        '<span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;">Padrão do Sistema</span>' : 
                        '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;">Personalizada</span>'
                    }
                </td>
                <td style="padding: 10px; text-align: right;">
                    ${!cat.is_system ? `
                        <button class="btn-icon btn-delete-cat" data-id="${cat.id}" data-name="${this.escapeHtml(cat.name)}" title="Excluir Categoria" style="color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 6px;">
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
            this.showToast('error', 'Por favor, informe o nome da categoria.');
            return;
        }

        try {
            await apiClient.post('/inventory/categories', { name, description });
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';
            await this.fetchCategories();
            this.showToast('success', `Categoria "${name}" criada com sucesso!`);
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            this.showToast('error', 'Erro ao criar categoria: ' + (error.message || 'Falha na requisição.'));
        }
    },

    async deleteCategory(id, name) {
        if (!confirm(`Deseja realmente excluir a categoria "${name}"?`)) return;

        try {
            await apiClient.delete(`/inventory/categories/${id}`);
            await this.fetchCategories();
            this.showToast('success', `Categoria "${name}" excluída.`);
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            this.showToast('error', 'Erro ao excluir categoria: ' + (error.message || 'Falha na requisição.'));
        }
    },

    // ============================================================
    // DYNAMIC MOVEMENT MODAL (ENTRADA / EM USO / MANUTENÇÃO / SAÍDA)
    // ============================================================
    setupMovementAutocomplete() {
        const itemInput = document.getElementById('inv-move-item-input');
        const hiddenIdInput = document.getElementById('inv-move-item-id');
        const clearBtn = document.getElementById('btn-inv-move-clear-select');
        const dropdown = document.getElementById('inv-move-autocomplete-list');

        // Type buttons (Entrada, Em Uso, Manutenção, Saída)
        ['in', 'use', 'maint', 'out'].forEach(t => {
            const btn = document.getElementById(`btn-type-${t}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.setMovementType(t);
                });
            }
        });

        if (!itemInput || !dropdown) return;

        let activeIndex = -1;

        const renderDropdown = (query = '') => {
            const catalog = this.getProductCatalog();
            const q = query.trim().toLowerCase();

            const matches = q
                ? catalog.filter(p => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
                : catalog;

            if (matches.length === 0) {
                dropdown.innerHTML = `
                    <div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                        Nenhum equipamento cadastrado corresponde a "${this.escapeHtml(query)}"
                    </div>
                `;
                dropdown.classList.remove('hidden');
                return;
            }

            let html = '';
            matches.forEach((p, idx) => {
                const nameDisplay = this.highlightMatch(p.name, q);
                const catDisplay = this.highlightMatch(p.category || 'Outro', q);
                html += `
                    <div class="inv-autocomplete-item" data-key="${this.escapeHtml(p.key)}" data-name="${this.escapeHtml(p.name)}" data-category="${this.escapeHtml(p.category || 'Outro')}" data-index="${idx}">
                        <div>
                            <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${nameDisplay}</div>
                            <div style="font-size: 0.75rem; color: #818cf8; margin-top: 2px;">📁 ${catDisplay}</div>
                        </div>
                        <div style="text-align: right; font-size: 0.72rem; font-family: 'Space Mono', monospace; display: flex; flex-direction: column; gap: 2px;">
                            <span style="color: #34d399; font-weight: 600;">🟢 ${p.available} no Estoque</span>
                            <span style="color: #60a5fa;">🔵 ${p.inUse} em Uso</span>
                            <span style="color: #fbbf24;">🟡 ${p.maintenance} em Manut.</span>
                        </div>
                    </div>
                `;
            });

            dropdown.innerHTML = html;
            dropdown.classList.remove('hidden');
            activeIndex = -1;

            // Click listener for each item
            dropdown.querySelectorAll('.inv-autocomplete-item').forEach(itemElem => {
                itemElem.addEventListener('click', () => {
                    const key = itemElem.getAttribute('data-key');
                    const name = itemElem.getAttribute('data-name');
                    const category = itemElem.getAttribute('data-category');
                    this.selectAutocompleteProduct(key, name, category);
                });
            });
        };

        itemInput.addEventListener('input', () => {
            hiddenIdInput.value = '';
            if (clearBtn) clearBtn.style.display = itemInput.value ? 'block' : 'none';
            renderDropdown(itemInput.value);
            this.updateMovementStockSummary(null);
        });

        itemInput.addEventListener('focus', () => {
            if (!hiddenIdInput.value) {
                renderDropdown(itemInput.value);
            }
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                itemInput.value = '';
                hiddenIdInput.value = '';
                clearBtn.style.display = 'none';
                dropdown.classList.add('hidden');
                this.updateMovementStockSummary(null);
                itemInput.focus();
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!itemInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });

        // Keyboard navigation (Up, Down, Enter, Escape)
        itemInput.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.inv-autocomplete-item');
            if (dropdown.classList.contains('hidden') || items.length === 0) {
                if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    renderDropdown(itemInput.value);
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                this.highlightAutocompleteItem(items, activeIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                this.highlightAutocompleteItem(items, activeIndex);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0 && items[activeIndex]) {
                    items[activeIndex].click();
                } else if (items.length === 1) {
                    items[0].click();
                }
            } else if (e.key === 'Escape') {
                dropdown.classList.add('hidden');
            }
        });
    },

    setMovementType(type) {
        const moveTypeInput = document.getElementById('inv-move-type');
        const modalTitle = document.getElementById('inv-movement-modal-title');
        const modalIcon = document.getElementById('inv-movement-icon');
        const assignedLabel = document.getElementById('lbl-inv-move-assigned-to');

        if (moveTypeInput) moveTypeInput.value = type;

        // Update active class on 4 buttons
        ['in', 'use', 'maint', 'out'].forEach(t => {
            const btn = document.getElementById(`btn-type-${t}`);
            if (btn) {
                if (t === type) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });

        if (type === 'in') {
            if (modalIcon) modalIcon.textContent = '🟢';
            if (modalTitle) modalTitle.innerHTML = '<span>🟢</span> + Entrada de Equipamento no Estoque';
            if (assignedLabel) assignedLabel.textContent = 'USUÁRIO RESPONSÁVEL (Opcional)';
        } else if (type === 'use') {
            if (modalIcon) modalIcon.textContent = '🔵';
            if (modalTitle) modalTitle.innerHTML = '<span>🔵 👤</span> Equipamento Em Uso / Alocação';
            if (assignedLabel) assignedLabel.textContent = 'USUÁRIO RESPONSÁVEL *';
        } else if (type === 'maint') {
            if (modalIcon) modalIcon.textContent = '🟡';
            if (modalTitle) modalTitle.innerHTML = '<span>🟡 🔧</span> Enviar Equipamento para Manutenção';
            if (assignedLabel) assignedLabel.textContent = 'USUÁRIO RESPONSÁVEL (Opcional)';
        } else {
            if (modalIcon) modalIcon.textContent = '🔴';
            if (modalTitle) modalTitle.innerHTML = '<span>🔴</span> - Saída / Baixa Definitiva';
            if (assignedLabel) assignedLabel.textContent = 'USUÁRIO RESPONSÁVEL (Opcional)';
        }

        this.renderMovementActionOptions();
        const p = this.getSelectedMovementProduct();
        this.updateMovementStockSummary(p);
    },

    renderMovementActionOptions(defaultAction = null) {
        const optionsContainer = document.getElementById('inv-move-action-options');
        const titleLabel = document.getElementById('lbl-inv-move-action-title');
        const moveTypeInput = document.getElementById('inv-move-type');
        const type = moveTypeInput ? moveTypeInput.value : 'in';
        const p = this.getSelectedMovementProduct();

        if (!optionsContainer) return;

        let actions = [];

        if (type === 'in') {
            if (titleLabel) titleLabel.textContent = '3. AÇÃO DE ENTRADA (DESTINO: ESTOQUE) *';
            actions = [
                {
                    id: 'add_stock',
                    title: '📦 Adicionar Novo Lote ao Estoque',
                    desc: 'Cadastra novas unidades de compra/reposição diretamente no estoque.',
                    badge: 'Novo Lote',
                    badgeColor: '#34d399',
                    badgeBg: 'rgba(16, 185, 129, 0.25)'
                },
                {
                    id: 'return_from_use',
                    title: '🔄 Retorno / Devolução de Item em Uso',
                    desc: 'Equipamento devolvido por colaborador; retorna para a reserva do estoque.',
                    badge: `${p ? p.inUse : 0} em uso`,
                    badgeColor: '#60a5fa',
                    badgeBg: 'rgba(59, 130, 246, 0.25)'
                },
                {
                    id: 'return_from_maint',
                    title: '🔧 Retorno de Manutenção para o Estoque',
                    desc: 'Equipamento reparado; retorna pronto para o estoque.',
                    badge: `${p ? p.maintenance : 0} em manut.`,
                    badgeColor: '#fbbf24',
                    badgeBg: 'rgba(245, 158, 11, 0.25)'
                }
            ];
        } else if (type === 'use') {
            if (titleLabel) titleLabel.textContent = '3. AÇÃO EM USO (DESTINO: COLABORADOR / SETOR) *';
            actions = [
                {
                    id: 'use_from_stock',
                    title: '📦 Retirar do Estoque e Entregar ao Usuário',
                    desc: 'Retira itens disponíveis da reserva e aloca para o colaborador/setor.',
                    badge: `${p ? p.available : 0} disp. no estoque`,
                    badgeColor: '#34d399',
                    badgeBg: 'rgba(16, 185, 129, 0.25)'
                },
                {
                    id: 'use_direct_new',
                    title: '✨ Adicionar Direto no Uso (Novo Item)',
                    desc: 'Cadastra novas unidades entregues diretamente ao usuário (sem passar pelo estoque).',
                    badge: 'Novo Lote',
                    badgeColor: '#60a5fa',
                    badgeBg: 'rgba(59, 130, 246, 0.25)'
                }
            ];
        } else if (type === 'maint') {
            if (titleLabel) titleLabel.textContent = '3. ORIGEM DO ENVIO PARA MANUTENÇÃO *';
            actions = [
                {
                    id: 'maint_from_use',
                    title: '👤 Retirar de Em Uso e Enviar para Manutenção',
                    desc: 'Equipamento com defeito que estava com colaborador; enviado para conserto.',
                    badge: `${p ? p.inUse : 0} em uso`,
                    badgeColor: '#60a5fa',
                    badgeBg: 'rgba(59, 130, 246, 0.25)'
                },
                {
                    id: 'maint_from_stock',
                    title: '📦 Retirar do Estoque e Enviar para Manutenção',
                    desc: 'Equipamento do estoque que apresentou defeito; enviado para conserto.',
                    badge: `${p ? p.available : 0} disp. no estoque`,
                    badgeColor: '#34d399',
                    badgeBg: 'rgba(16, 185, 129, 0.25)'
                }
            ];
        } else {
            if (titleLabel) titleLabel.textContent = '3. ORIGEM DA SAÍDA / BAIXA DEFINITIVA *';
            actions = [
                {
                    id: 'out_from_use',
                    title: '👤 Retirar de Em Uso (Baixa Definitiva)',
                    desc: 'Baixa em equipamento que estava com colaborador (perda / descarte / desativação).',
                    badge: `${p ? p.inUse : 0} em uso`,
                    badgeColor: '#60a5fa',
                    badgeBg: 'rgba(59, 130, 246, 0.25)'
                },
                {
                    id: 'out_from_maint',
                    title: '🔧 Retirar de Manutenção (Baixa / Sucata)',
                    desc: 'Equipamento sem conserto / sucata / perda irreparável em manutenção.',
                    badge: `${p ? p.maintenance : 0} em manut.`,
                    badgeColor: '#fbbf24',
                    badgeBg: 'rgba(245, 158, 11, 0.25)'
                },
                {
                    id: 'out_from_stock',
                    title: '📦 Retirar do Estoque (Baixa / Descarte)',
                    desc: 'Baixa definitiva em equipamento que estava guardado no estoque.',
                    badge: `${p ? p.available : 0} disp. no estoque`,
                    badgeColor: '#34d399',
                    badgeBg: 'rgba(16, 185, 129, 0.25)'
                }
            ];
        }

        const selectedActionId = defaultAction || actions[0]?.id;

        let html = '';
        actions.forEach(a => {
            const isSelected = a.id === selectedActionId;
            html += `
                <label class="inv-action-pill ${isSelected ? 'active' : ''}" data-action="${a.id}">
                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <input type="radio" name="inv_movement_action" value="${a.id}" ${isSelected ? 'checked' : ''} style="margin-top: 3px; accent-color: #6366f1;">
                        <div>
                            <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${a.title}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${a.desc}</div>
                        </div>
                    </div>
                    <span class="pool-badge" style="background: ${a.badgeBg}; color: ${a.badgeColor}; font-size: 0.72rem; white-space: nowrap; margin-left: 8px;">
                        ${a.badge}
                    </span>
                </label>
            `;
        });

        optionsContainer.innerHTML = html;

        // Pill click listener
        optionsContainer.querySelectorAll('.inv-action-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                optionsContainer.querySelectorAll('.inv-action-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const radio = pill.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                this.updateMovementStockSummary(this.getSelectedMovementProduct());
            });
        });
    },

    getSelectedMovementAction() {
        const radio = document.querySelector('input[name="inv_movement_action"]:checked');
        return radio ? radio.value : null;
    },

    highlightMatch(text, query) {
        if (!query) return this.escapeHtml(text);
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<span class="match-highlight">$1</span>');
    },

    highlightAutocompleteItem(items, index) {
        items.forEach((it, i) => {
            if (i === index) {
                it.classList.add('active');
                it.scrollIntoView({ block: 'nearest' });
            } else {
                it.classList.remove('active');
            }
        });
    },

    getSelectedMovementProduct() {
        const hiddenIdInput = document.getElementById('inv-move-item-id');
        const itemInput = document.getElementById('inv-move-item-input');
        const key = hiddenIdInput?.value;
        const catalog = this.getProductCatalog();

        if (key) {
            return catalog.find(p => p.key === key) || null;
        }

        const typed = (itemInput?.value || '').trim().toLowerCase();
        if (typed) {
            return catalog.find(p => `${p.name} / ${p.category}`.toLowerCase() === typed) ||
                   catalog.find(p => p.name.toLowerCase() === typed) || null;
        }
        return null;
    },

    selectAutocompleteProduct(key, name, category) {
        const itemInput = document.getElementById('inv-move-item-input');
        const hiddenIdInput = document.getElementById('inv-move-item-id');
        const clearBtn = document.getElementById('btn-inv-move-clear-select');
        const dropdown = document.getElementById('inv-move-autocomplete-list');
        const locationInput = document.getElementById('inv-move-location');
        const assignedInput = document.getElementById('inv-move-assigned-to');

        if (itemInput) itemInput.value = `${name} / ${category}`;
        if (hiddenIdInput) hiddenIdInput.value = key;
        if (clearBtn) clearBtn.style.display = 'block';
        if (dropdown) dropdown.classList.add('hidden');

        const catalog = this.getProductCatalog();
        const p = catalog.find(prod => prod.key === key);

        if (p) {
            if (locationInput && !locationInput.value) locationInput.value = p.items[0]?.location || '';
            if (assignedInput && !assignedInput.value) assignedInput.value = p.items[0]?.assigned_to || '';
            this.renderMovementActionOptions(this.getSelectedMovementAction());
            this.updateMovementStockSummary(p);
        }
    },

    updateMovementStockSummary(p) {
        const summaryBox = document.getElementById('inv-move-stock-summary');
        const alertBox = document.getElementById('inv-move-stock-alert');
        const action = this.getSelectedMovementAction();

        if (p && summaryBox) {
            summaryBox.classList.remove('hidden');
            dom.setText('inv-move-avail-stock', p.available);
            dom.setText('inv-move-in-use', p.inUse);
            dom.setText('inv-move-in-maint', p.maintenance);
            dom.setText('inv-move-total-stock', p.total);

            if (alertBox) {
                if (['use_from_stock', 'maint_from_stock', 'out_from_stock'].includes(action) && p.available === 0) {
                    alertBox.classList.remove('hidden');
                    alertBox.innerHTML = `⚠️ Atenção: Não há unidades disponíveis no estoque (reserva) deste produto para retirar.`;
                } else if (['return_from_use', 'maint_from_use', 'out_from_use'].includes(action) && p.inUse === 0) {
                    alertBox.classList.remove('hidden');
                    alertBox.innerHTML = `⚠️ Atenção: Não há unidades em uso cadastradas para este produto.`;
                } else if (['return_from_maint', 'out_from_maint'].includes(action) && p.maintenance === 0) {
                    alertBox.classList.remove('hidden');
                    alertBox.innerHTML = `⚠️ Atenção: Não há unidades em manutenção cadastradas para este produto.`;
                } else {
                    alertBox.classList.add('hidden');
                }
            }
        } else {
            if (summaryBox) summaryBox.classList.add('hidden');
            if (alertBox) alertBox.classList.add('hidden');
        }
    },

    openMovementModal(type = 'in', preselectItemId = null) {
        const modal = document.getElementById('modal-inv-movement');
        const itemInput = document.getElementById('inv-move-item-input');
        const hiddenIdInput = document.getElementById('inv-move-item-id');
        const clearBtn = document.getElementById('btn-inv-move-clear-select');
        const dropdown = document.getElementById('inv-move-autocomplete-list');
        const qtyInput = document.getElementById('inv-move-quantity');
        const qtyHint = document.getElementById('inv-move-qty-hint');
        const locationInput = document.getElementById('inv-move-location');
        const assignedInput = document.getElementById('inv-move-assigned-to');
        const notesInput = document.getElementById('inv-move-notes');

        if (!modal) return;

        if (qtyInput) qtyInput.value = '1';
        if (qtyHint) qtyHint.textContent = '(1 unidade selecionada)';
        if (locationInput) locationInput.value = '';
        if (assignedInput) assignedInput.value = '';
        if (notesInput) notesInput.value = '';

        if (itemInput) itemInput.value = '';
        if (hiddenIdInput) hiddenIdInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (dropdown) dropdown.classList.add('hidden');

        this.setMovementType(type);

        if (preselectItemId) {
            const catalog = this.getProductCatalog();
            const matchedP = catalog.find(p => p.key === preselectItemId || p.items.some(it => it.id === Number(preselectItemId)));
            if (matchedP) {
                this.selectAutocompleteProduct(matchedP.key, matchedP.name, matchedP.category);
            }
        }

        modal.classList.remove('hidden');
    },

    closeMovementModal() {
        const modal = document.getElementById('modal-inv-movement');
        const form = document.getElementById('form-inv-movement');
        const itemInput = document.getElementById('inv-move-item-input');
        const hiddenIdInput = document.getElementById('inv-move-item-id');
        const clearBtn = document.getElementById('btn-inv-move-clear-select');
        const dropdown = document.getElementById('inv-move-autocomplete-list');
        const qtyInput = document.getElementById('inv-move-quantity');
        const qtyHint = document.getElementById('inv-move-qty-hint');

        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
        if (itemInput) itemInput.value = '';
        if (hiddenIdInput) hiddenIdInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        if (dropdown) dropdown.classList.add('hidden');
        if (qtyInput) qtyInput.value = '1';
        if (qtyHint) qtyHint.textContent = '(1 unidade selecionada)';
        this.updateMovementStockSummary(null);
    },

    async handleSaveMovement() {
        const selectedKey = dom.getValue('inv-move-item-id');
        const itemInputValue = (dom.getValue('inv-move-item-input') || '').trim();
        const moveType = dom.getValue('inv-move-type') || 'in';
        const action = this.getSelectedMovementAction();
        const location = dom.getValue('inv-move-location');
        const assigned_to = dom.getValue('inv-move-assigned-to');
        const notes = dom.getValue('inv-move-notes');
        const quantity = Math.max(1, parseInt(dom.getValue('inv-move-quantity')) || 1);

        const catalog = this.getProductCatalog();
        let p = catalog.find(prod => prod.key === selectedKey);

        // If user typed without clicking dropdown, try matching by name/category
        if (!p && itemInputValue) {
            const query = itemInputValue.toLowerCase();
            p = catalog.find(prod => `${prod.name} / ${prod.category}`.toLowerCase() === query) ||
                catalog.find(prod => prod.name.toLowerCase() === query);
        }

        if (!p) {
            this.showToast('error', 'Por favor, selecione um equipamento cadastrado válido no campo de busca.');
            return;
        }

        if (moveType === 'use' && !assigned_to && action !== 'add_stock') {
            this.showToast('warning', 'Informe o Usuário Responsável para alocar o equipamento em uso.');
            const assignedInput = document.getElementById('inv-move-assigned-to');
            if (assignedInput) assignedInput.focus();
            return;
        }

        const user = auth.getUser();
        const performed_by = user ? `${user.name} (${user.email})` : 'Usuário TI';

        try {
            // ========================================================
            // CASE 1: CRIAR NOVAS UNIDADES (add_stock ou use_direct_new)
            // ========================================================
            if (action === 'add_stock' || action === 'use_direct_new') {
                const sampleItem = p.items[0];
                const targetStatus = action === 'use_direct_new' ? 'ativo' : 'reserva';
                const actionLabel = action === 'use_direct_new' ? 'Adicionado diretamente em uso' : 'Entrada em lote no estoque';

                const batchPayload = {
                    name: p.name,
                    category: p.category || 'Outro',
                    brand_model: p.brand_model || sampleItem?.brand_model || '',
                    status: targetStatus,
                    location: location || sampleItem?.location || '',
                    assigned_to: action === 'use_direct_new' ? assigned_to : '',
                    purchase_date: sampleItem?.purchase_date || '',
                    warranty_expires: sampleItem?.warranty_expires || '',
                    notes: notes ? notes : (sampleItem?.notes || actionLabel),
                    quantity,
                    asset_tag_prefix: sampleItem?.asset_tag ? sampleItem.asset_tag.split('-')[0] : 'PAT',
                    performed_by
                };

                await apiClient.post('/inventory/batch', batchPayload);
                this.closeMovementModal();
                this.showToast('success', `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de "${p.name} / ${p.category}" ${action === 'use_direct_new' ? 'alocadas em uso com sucesso!' : 'adicionadas ao estoque com sucesso!'}`);
                await this.fetch();
                return;
            }

            // ========================================================
            // CASE 2: MOVIMENTAÇÃO DE ITENS EXISTENTES
            // ========================================================
            const matchingItems = inventoryItems.filter(i => this.getProductKey(i.name, i.category) === p.key);
            let candidates = [];
            let targetStatus = 'reserva';
            let successMessage = '';

            if (action === 'return_from_use') {
                // Devolução: Ativo -> Reserva
                targetStatus = 'reserva';
                const activeItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'ativo');
                if (activeItems.length === 0) {
                    this.showToast('error', `Não há unidades em uso de "${p.name}" para devolução.`);
                    return;
                }
                if (activeItems.length < quantity) {
                    this.showToast('error', `Quantidade solicitada (${quantity}) maior que o saldo em uso (${activeItems.length} un.).`);
                    return;
                }
                candidates = activeItems.slice(0, quantity);
                successMessage = `Devolução concluída: ${candidates.length} ${candidates.length === 1 ? 'unidade retornou' : 'unidades retornaram'} ao estoque.`;
            } else if (action === 'return_from_maint') {
                // Retorno Manutenção: Manutenção -> Reserva
                targetStatus = 'reserva';
                const maintItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'manutencao');
                if (maintItems.length === 0) {
                    this.showToast('error', `Não há unidades em manutenção de "${p.name}" para retornar.`);
                    return;
                }
                if (maintItems.length < quantity) {
                    this.showToast('error', `Quantidade solicitada (${quantity}) maior que o saldo em manutenção (${maintItems.length} un.).`);
                    return;
                }
                candidates = maintItems.slice(0, quantity);
                successMessage = `Retorno de manutenção concluído: ${candidates.length} ${candidates.length === 1 ? 'unidade retornou' : 'unidades retornaram'} ao estoque.`;
            } else if (action === 'use_from_stock') {
                // Em Uso: Reserva -> Ativo
                targetStatus = 'ativo';
                const reserveItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'reserva');
                if (reserveItems.length === 0) {
                    this.showToast('error', `Não há unidades no estoque (reserva) de "${p.name}".`);
                    return;
                }
                if (reserveItems.length < quantity) {
                    this.showToast('error', `Saldo insuficiente no estoque: apenas ${reserveItems.length} ${reserveItems.length === 1 ? 'unidade disponível' : 'unidades disponíveis'}.`);
                    return;
                }
                candidates = reserveItems.slice(0, quantity);
                successMessage = `Alocação concluída: ${candidates.length} ${candidates.length === 1 ? 'unidade alocada' : 'unidades alocadas'} para ${assigned_to || 'o responsável'}.`;
            } else if (action === 'maint_from_use') {
                // Manutenção: Ativo -> Manutenção
                targetStatus = 'manutencao';
                const activeItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'ativo');
                if (activeItems.length === 0) {
                    this.showToast('error', `Não há unidades em uso de "${p.name}" para enviar à manutenção.`);
                    return;
                }
                if (activeItems.length < quantity) {
                    this.showToast('error', `Quantidade solicitada (${quantity}) maior que o saldo em uso (${activeItems.length} un.).`);
                    return;
                }
                candidates = activeItems.slice(0, quantity);
                successMessage = `Envio para manutenção concluído: ${candidates.length} ${candidates.length === 1 ? 'unidade enviada' : 'unidades enviadas'}.`;
            } else if (action === 'maint_from_stock') {
                // Manutenção: Reserva -> Manutenção
                targetStatus = 'manutencao';
                const reserveItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'reserva');
                if (reserveItems.length === 0) {
                    this.showToast('error', `Não há unidades no estoque de "${p.name}" para enviar à manutenção.`);
                    return;
                }
                if (reserveItems.length < quantity) {
                    this.showToast('error', `Saldo insuficiente no estoque: apenas ${reserveItems.length} ${reserveItems.length === 1 ? 'unidade disponível' : 'unidades disponíveis'}.`);
                    return;
                }
                candidates = reserveItems.slice(0, quantity);
                successMessage = `Envio para manutenção concluído: ${candidates.length} ${candidates.length === 1 ? 'unidade do estoque enviada' : 'unidades do estoque enviadas'}.`;
            } else if (action === 'out_from_use') {
                // Saída: Ativo -> Desativado
                targetStatus = 'desativado';
                const activeItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'ativo');
                if (activeItems.length === 0) {
                    this.showToast('error', `Não há unidades em uso de "${p.name}" para dar saída.`);
                    return;
                }
                if (activeItems.length < quantity) {
                    this.showToast('error', `Quantidade solicitada (${quantity}) maior que o saldo em uso (${activeItems.length} un.).`);
                    return;
                }
                candidates = activeItems.slice(0, quantity);
                successMessage = `Saída / Baixa concluída: ${candidates.length} ${candidates.length === 1 ? 'unidade desativada' : 'unidades desativadas'}.`;
            } else if (action === 'out_from_maint') {
                // Saída: Manutenção -> Desativado
                targetStatus = 'desativado';
                const maintItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'manutencao');
                if (maintItems.length === 0) {
                    this.showToast('error', `Não há unidades em manutenção de "${p.name}" para dar baixa.`);
                    return;
                }
                if (maintItems.length < quantity) {
                    this.showToast('error', `Quantidade solicitada (${quantity}) maior que o saldo em manutenção (${maintItems.length} un.).`);
                    return;
                }
                candidates = maintItems.slice(0, quantity);
                successMessage = `Baixa por sucata / defeito concluída: ${candidates.length} ${candidates.length === 1 ? 'unidade baixada' : 'unidades baixadas'}.`;
            } else if (action === 'out_from_stock') {
                // Saída: Reserva -> Desativado
                targetStatus = 'desativado';
                const reserveItems = matchingItems.filter(i => (i.status || '').toLowerCase() === 'reserva');
                if (reserveItems.length === 0) {
                    this.showToast('error', `Não há unidades no estoque de "${p.name}" para dar saída.`);
                    return;
                }
                if (reserveItems.length < quantity) {
                    this.showToast('error', `Saldo insuficiente no estoque: apenas ${reserveItems.length} ${reserveItems.length === 1 ? 'unidade disponível' : 'unidades disponíveis'}.`);
                    return;
                }
                candidates = reserveItems.slice(0, quantity);
                successMessage = `Saída do estoque concluída: ${candidates.length} ${candidates.length === 1 ? 'unidade desativada' : 'unidades desativadas'}.`;
            }

            if (candidates.length === 0) {
                this.showToast('error', `Nenhum item disponível para a movimentação selecionada.`);
                return;
            }

            // Perform atomic batch update for candidate items
            await Promise.all(candidates.map(it => {
                const payload = {
                    name: it.name,
                    category: it.category,
                    status: targetStatus,
                    brand_model: it.brand_model,
                    asset_tag: it.asset_tag,
                    serial_number: it.serial_number,
                    location: location !== undefined ? location : it.location,
                    assigned_to: (targetStatus === 'reserva' || targetStatus === 'desativado') ? '' : (assigned_to !== undefined ? assigned_to : it.assigned_to),
                    ip_address: it.ip_address,
                    mac_address: it.mac_address,
                    purchase_date: it.purchase_date,
                    warranty_expires: it.warranty_expires,
                    notes: notes ? (it.notes ? it.notes + ' | ' + notes : notes) : it.notes,
                    performed_by
                };
                return apiClient.put(`/inventory/${it.id}`, payload);
            }));

            this.closeMovementModal();
            this.showToast('success', successMessage || `Movimentação de ${candidates.length} unidades concluída com sucesso!`);
            await this.fetch(candidates[0]?.id);
        } catch (error) {
            console.error('Erro ao salvar movimentação:', error);
            this.showToast('error', 'Erro ao registrar movimentação: ' + (error.message || 'Falha na requisição.'));
        }
    },

    exportToCSV() {
        if (!inventoryItems || inventoryItems.length === 0) {
            this.showToast('info', 'Nenhum equipamento para exportar.');
            return;
        }

        const headers = [
            "ID", "Patrimônio", "Nome", "Categoria", "Marca / Modelo", "Status",
            "Localização / Setor", "Responsável", "Nº de Série", "Endereço IP",
            "Endereço MAC", "Data de Compra", "Vencimento Garantia", "Observações"
        ];

        const rows = inventoryItems.map(item => [
            item.id,
            item.asset_tag || '',
            item.name || '',
            item.category || '',
            item.brand_model || '',
            item.status || '',
            item.location || '',
            item.assigned_to || '',
            item.serial_number || '',
            item.ip_address || '',
            item.mac_address || '',
            item.purchase_date || '',
            item.warranty_expires || '',
            (item.notes || '').replace(/\r?\n/g, ' ')
        ]);

        let csvContent = "\uFEFF"; // UTF-8 BOM for Excel compatibility
        csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(";") + "\r\n";

        rows.forEach(row => {
            csvContent += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";") + "\r\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStr = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `inventario_ti_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('success', `Exportação concluída (${inventoryItems.length} itens exportados).`);
    },

    showToast(type, message) {
        let container = document.getElementById('inv-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'inv-toast-container';
            container.className = 'inv-toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `inv-toast ${type}`;
        toast.innerHTML = `
            <span>${icons[type] || '🔔'}</span>
            <div style="flex: 1;">${this.escapeHtml(message)}</div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 300);
        }, 4000);
    },

    formatDateBR(dateStr) {
        if (!dateStr) return '-';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateStr;
        } catch (e) {
            return dateStr;
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
