import { apiClient } from '../api/client.js';

const PAGE_SIZE = 30;

let gnewAlerts = []; // alertas sinteticos gerados a partir dos dados Gnew
let eventsSearchQuery = '';
let eventsFilterSeverity = 'all';
let eventsFilterDateStart = ''; // YYYY-MM-DD
let eventsFilterDateEnd   = ''; // YYYY-MM-DD
let eventsCurrentPage = 1;      // página corrente (1-indexed)
let eventsTotalFiltered = 0;    // total de registros após filtros
let activeTab = 'alerts'; // 'alerts', 'events', 'apis', 'gnew'
let gnewDiagData = null;
let autoRefreshInterval = null;

export const monitoringHandler = {
    init() {
        // Tab switching listeners
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        if (tabAlerts) tabAlerts.addEventListener('click', () => this.setActiveTab('alerts'));
        const tabEvents = document.getElementById('tab-monitoring-events');
        if (tabEvents) tabEvents.addEventListener('click', () => this.setActiveTab('events'));
        const tabApis = document.getElementById('tab-monitoring-apis');
        if (tabApis) tabApis.addEventListener('click', () => this.setActiveTab('apis'));
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabGnew) tabGnew.addEventListener('click', () => this.setActiveTab('gnew'));

        // Search in event history
        const eventsSearchInput = document.getElementById('monitoring-events-search-input');
        if (eventsSearchInput) {
            eventsSearchInput.addEventListener('input', (e) => {
                eventsSearchQuery = e.target.value.toLowerCase();
                eventsCurrentPage = 1;
                this.fetchAndRenderEventHistory();
            });
        }

        // Severity filter dropdown
        const severityFilter = document.getElementById('monitoring-events-severity-filter');
        if (severityFilter) {
            severityFilter.addEventListener('change', (e) => {
                eventsFilterSeverity = e.target.value;
                eventsCurrentPage = 1;
                this.fetchAndRenderEventHistory();
            });
        }

        // Date range filters
        const dateStart = document.getElementById('monitoring-events-date-start');
        const dateEnd   = document.getElementById('monitoring-events-date-end');
        if (dateStart) {
            dateStart.addEventListener('change', (e) => {
                eventsFilterDateStart = e.target.value;
                eventsCurrentPage = 1;
                this.fetchAndRenderEventHistory();
            });
        }
        if (dateEnd) {
            dateEnd.addEventListener('change', (e) => {
                eventsFilterDateEnd = e.target.value;
                eventsCurrentPage = 1;
                this.fetchAndRenderEventHistory();
            });
        }

        // Clear date filters button
        const clearDateBtn = document.getElementById('btn-clear-event-date-filter');
        if (clearDateBtn) {
            clearDateBtn.addEventListener('click', () => {
                eventsFilterDateStart = '';
                eventsFilterDateEnd   = '';
                eventsCurrentPage = 1;
                if (dateStart) dateStart.value = '';
                if (dateEnd)   dateEnd.value   = '';
                this.fetchAndRenderEventHistory();
            });
        }

        // Clear history button
        const clearBtn = document.getElementById('btn-clear-event-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearEventHistory());
        }

        // Refresh button (global) - triggers Gnew fetch
        const refreshBtn = document.getElementById('btn-refresh-monitoring');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.fetchDiagnostics());
        }

        // Disk Accordion toggle
        const diskAccordionHeader = document.getElementById('gnew-disk-accordion-header');
        if (diskAccordionHeader) {
            diskAccordionHeader.addEventListener('click', () => {
                const content = document.getElementById('gnew-disk-accordion-content');
                const chevron = document.getElementById('gnew-disk-chevron');
                if (content && chevron) {
                    const isCollapsed = content.style.maxHeight === '0px';
                    if (isCollapsed) {
                        content.style.maxHeight = '1000px';
                        chevron.style.transform = 'rotate(0deg)';
                    } else {
                        content.style.maxHeight = '0px';
                        chevron.style.transform = 'rotate(-90deg)';
                    }
                }
            });
        }

        const refreshGnewDiskBtn = document.getElementById('btn-refresh-gnew-disk');
        if (refreshGnewDiskBtn) {
            refreshGnewDiskBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.fetchDiagnostics();
            });
        }

        const refreshGnewServicesBtn = document.getElementById('btn-refresh-gnew-services');
        if (refreshGnewServicesBtn) {
            refreshGnewServicesBtn.addEventListener('click', async () => {
                const btn = refreshGnewServicesBtn;
                const svg = btn.querySelector('svg');
                if (btn.disabled) return;
                btn.disabled = true;
                btn.style.opacity = '0.6';
                btn.style.cursor = 'not-allowed';
                if (svg) svg.style.animation = 'spin 0.8s linear infinite';
                try {
                    await this.fetchDiagnostics();
                } finally {
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.cursor = 'pointer';
                    if (svg) svg.style.animation = '';
                }
            });
        }

        const refreshApisBtn = document.getElementById('btn-refresh-apis-status');
        if (refreshApisBtn) {
            refreshApisBtn.addEventListener('click', () => this.fetchAndRenderApisStatus());
        }

        // Auto-refresh checkbox (alerts tab)
        const autoRefreshChk = document.getElementById('monitoring-auto-refresh');
        if (autoRefreshChk) {
            autoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startAutoRefresh();
                } else {
                    this._stopAutoRefresh();
                }
            });
            // Start immediately if checked
            if (autoRefreshChk.checked) this._startAutoRefresh();
        }

        // Bind global helper
        window.monitoringHandler = this;
    },

    _startAutoRefresh() {
        this._stopAutoRefresh();
        autoRefreshInterval = setInterval(() => {
            if (activeTab === 'alerts' || activeTab === 'gnew') {
                this.fetchDiagnostics();
            }
        }, 30000);
    },

    _stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
    },

    fetch() {
        // Called when section is first loaded
        this.setActiveTab('alerts');
        this.fetchDiagnostics();
    },

    setActiveTab(tab) {
        activeTab = tab;
        
        // Toggle active classes on tab buttons
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        const tabEvents = document.getElementById('tab-monitoring-events');
        const tabApis = document.getElementById('tab-monitoring-apis');
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabAlerts) tabAlerts.classList.toggle('active', tab === 'alerts');
        if (tabEvents) tabEvents.classList.toggle('active', tab === 'events');
        if (tabApis) tabApis.classList.toggle('active', tab === 'apis');
        if (tabGnew) tabGnew.classList.toggle('active', tab === 'gnew');

        // Toggle active divs
        const divAlerts = document.getElementById('monitoring-tab-content-alerts');
        const divEvents = document.getElementById('monitoring-tab-content-events');
        const divApis = document.getElementById('monitoring-tab-content-apis');
        const divGnew = document.getElementById('monitoring-tab-content-gnew');
        
        if (divAlerts) {
            divAlerts.classList.toggle('hidden', tab !== 'alerts');
            divAlerts.classList.toggle('active', tab === 'alerts');
        }
        if (divEvents) {
            divEvents.classList.toggle('hidden', tab !== 'events');
            divEvents.classList.toggle('active', tab === 'events');
        }
        if (divApis) {
            divApis.classList.toggle('hidden', tab !== 'apis');
            divApis.classList.toggle('active', tab === 'apis');
        }
        if (divGnew) {
            divGnew.classList.toggle('hidden', tab !== 'gnew');
            divGnew.classList.toggle('active', tab === 'gnew');
        }

        if (tab === 'gnew') {
            this.fetchDiagnostics();
        } else if (tab === 'events') {
            eventsCurrentPage = 1; // sempre começa na página 1 ao abrir a aba
            this.fetchAndRenderEventHistory();
        } else if (tab === 'apis') {
            this.fetchAndRenderApisStatus();
        } else {
            this.renderGnewServicesStatus();
        }
    },


    render() {
        if (activeTab === 'alerts') {
            this.renderGnewServicesStatus();
        } else if (activeTab === 'events') {
            this.fetchAndRenderEventHistory();
        } else if (activeTab === 'apis') {
            this.fetchAndRenderApisStatus();
        }
    },

    // -----------------------------------------------------------------------
    // Alertas Ativos: lista compacta de serviços Gnew
    // -----------------------------------------------------------------------
    renderGnewServicesStatus() {
        const grid = document.getElementById('monitoring-alerts-grid');
        if (!grid) return;

        grid.style.display = 'flex';
        grid.style.flexDirection = 'column';
        grid.style.gap = '0';

        if (!gnewDiagData || !gnewDiagData.servicos || !Array.isArray(gnewDiagData.servicos.servicos) || gnewDiagData.servicos.servicos.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de serviço disponível.</p>
                    <p style="font-size: 0.85rem;">Acesse a aba <strong>Gnew</strong> para carregar os dados do PABX.</p>
                </div>
            `;
            return;
        }

        const services = gnewDiagData.servicos.servicos;
        const total = services.length;
        const offline = services.filter(s => s.status !== 'active' && s.status_label !== 'ativo').length;
        const online = total - offline;

        // Update KPIs
        const totalEl = document.getElementById('monitor-kpi-total');
        const warningEl = document.getElementById('monitor-kpi-warning');
        const infoEl = document.getElementById('monitor-kpi-info');
        if (totalEl) totalEl.textContent = total;
        if (warningEl) warningEl.textContent = offline;
        if (infoEl) infoEl.textContent = online;

        grid.innerHTML = `
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
                ${services.map((svc, idx) => {
                    const isAtivo = svc.status === 'active' || svc.status_label === 'ativo';
                    const dotColor = isAtivo ? '#10b981' : '#ef4444';
                    const statusLabel = isAtivo ? 'Online' : (svc.status_label || svc.status || 'Offline');
                    const badgeBg = isAtivo ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
                    const badgeColor = isAtivo ? '#6ee7b7' : '#fca5a5';
                    const badgeBorder = isAtivo ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
                    const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
                    return `
                        <div class="monitor-list-row" style="background: ${rowBg};">
                            <div class="monitor-list-col-name">
                                <span class="monitor-dot" style="background: ${dotColor};"></span>
                                <span class="monitor-svc-name">${svc.nome}</span>
                            </div>
                            <div class="monitor-list-col-status">
                                <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                            </div>
                        </div>`;
                }).join('')}
            </div>`;
    },

    // -----------------------------------------------------------------------
    // Histórico de Eventos — busca do banco, filtra, pagina e renderiza
    // -----------------------------------------------------------------------
    async fetchAndRenderEventHistory() {
        const grid = document.getElementById('monitoring-events-grid');
        if (!grid) return;

        // Show loading state
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div class="event-history-loading">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite; margin-bottom: 0.75rem; opacity: 0.5;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <p style="font-size: 0.9rem;">Carregando histórico...</p>
                </div>
            </div>`;

        try {
            // Busca todos (até 1000) para filtrar/paginar no cliente
            let events = await apiClient.get('/monitoring/events?limit=1000');

            // --- Filtro: texto livre ---
            if (eventsSearchQuery) {
                events = events.filter(ev =>
                    (ev.title || '').toLowerCase().includes(eventsSearchQuery) ||
                    (ev.description || '').toLowerCase().includes(eventsSearchQuery) ||
                    (ev.source || '').toLowerCase().includes(eventsSearchQuery)
                );
            }

            // --- Filtro: severidade ---
            if (eventsFilterSeverity !== 'all') {
                events = events.filter(ev => ev.severity === eventsFilterSeverity);
            }

            // --- Filtro: data início ---
            if (eventsFilterDateStart) {
                const startMs = new Date(eventsFilterDateStart + 'T00:00:00').getTime();
                events = events.filter(ev => {
                    if (!ev.created_at) return false;
                    return new Date(ev.created_at).getTime() >= startMs;
                });
            }

            // --- Filtro: data fim ---
            if (eventsFilterDateEnd) {
                const endMs = new Date(eventsFilterDateEnd + 'T23:59:59').getTime();
                events = events.filter(ev => {
                    if (!ev.created_at) return false;
                    return new Date(ev.created_at).getTime() <= endMs;
                });
            }

            eventsTotalFiltered = events.length;

            // Garante que a página atual não ultrapasse o total de páginas
            const totalPages = Math.max(1, Math.ceil(eventsTotalFiltered / PAGE_SIZE));
            if (eventsCurrentPage > totalPages) eventsCurrentPage = totalPages;

            // --- Badge de contagem ---
            const countEl = document.getElementById('event-history-count');
            if (countEl) {
                countEl.textContent = eventsTotalFiltered > 0 ? eventsTotalFiltered : '';
                countEl.style.display = eventsTotalFiltered > 0 ? 'inline-flex' : 'none';
            }

            // --- Fatia da página corrente (os 30 mais recentes por padrão = página 1) ---
            const offset = (eventsCurrentPage - 1) * PAGE_SIZE;
            const pageSlice = events.slice(offset, offset + PAGE_SIZE);

            // Renderiza a lista e a paginação
            this.renderEvents(pageSlice);
            this.renderPagination(eventsTotalFiltered, totalPages);

        } catch (err) {
            console.error('Erro ao buscar histórico de eventos:', err);
            grid.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p style="font-size: 0.9rem; color: #fca5a5;">Erro ao carregar o histórico de eventos.</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">${err.message}</p>
                </div>`;
        }
    },

    // -----------------------------------------------------------------------
    // Paginação — renderiza a barra abaixo da lista
    // -----------------------------------------------------------------------
    renderPagination(total, totalPages) {
        const container = document.getElementById('event-history-pagination');
        if (!container) return;

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const page = eventsCurrentPage;
        const from = (page - 1) * PAGE_SIZE + 1;
        const to   = Math.min(page * PAGE_SIZE, total);

        // Gera os botões de página (janela de ±2 páginas em relação à corrente)
        const pageButtons = [];
        const window_ = 2;
        let start = Math.max(1, page - window_);
        let end   = Math.min(totalPages, page + window_);

        if (start > 1) {
            pageButtons.push(`<button class="eh-page-btn" data-page="1">1</button>`);
            if (start > 2) pageButtons.push(`<span class="eh-page-ellipsis">…</span>`);
        }
        for (let p = start; p <= end; p++) {
            pageButtons.push(`<button class="eh-page-btn${p === page ? ' active' : ''}" data-page="${p}">${p}</button>`);
        }
        if (end < totalPages) {
            if (end < totalPages - 1) pageButtons.push(`<span class="eh-page-ellipsis">…</span>`);
            pageButtons.push(`<button class="eh-page-btn" data-page="${totalPages}">${totalPages}</button>`);
        }

        container.innerHTML = `
            <div class="eh-pagination">
                <span class="eh-page-info">Exibindo <strong>${from}–${to}</strong> de <strong>${total}</strong> eventos</span>
                <div class="eh-page-controls">
                    <button class="eh-page-btn eh-page-nav" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    ${pageButtons.join('')}
                    <button class="eh-page-btn eh-page-nav" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>`;

        // Registra cliques
        container.querySelectorAll('.eh-page-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = parseInt(btn.dataset.page, 10);
                if (!isNaN(p) && p >= 1 && p <= totalPages && p !== eventsCurrentPage) {
                    eventsCurrentPage = p;
                    this.fetchAndRenderEventHistory();
                    // Scroll suave até o topo da lista
                    const grid = document.getElementById('monitoring-events-grid');
                    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    },

    renderEvents(eventsToRender) {
        const grid = document.getElementById('monitoring-events-grid');
        if (!grid) return;

        grid.style.display = 'flex';
        grid.style.flexDirection = 'column';
        grid.style.gap = '0';

        const list = eventsToRender || [];

        if (list.length === 0) {
            grid.innerHTML = `
                <div class="event-history-empty">
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.2; margin-bottom: 1rem;">
                        <path d="M18 20V10"></path>
                        <path d="M12 20V4"></path>
                        <path d="M6 20v-6"></path>
                    </svg>
                    <p style="font-size: 0.95rem; font-weight: 500; margin: 0 0 4px;">Nenhum evento registrado</p>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
                        Alertas de disco, RAM e serviços offline são registrados automaticamente aqui.
                    </p>
                </div>`;
            return;
        }

        // Group events by date
        const groups = {};
        list.forEach(item => {
            const dateKey = item.created_at
                ? new Date(item.created_at).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                : 'Data desconhecida';
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(item);
        });

        const rowsHtml = Object.entries(groups).map(([dateLabel, items]) => {
            const itemsHtml = items.map((item) => {
                const sev = item.severity || 'info';
                let severityLabel = 'Info';
                let dotColor = '#3b82f6';
                let badgeBg = 'rgba(59,130,246,0.12)';
                let badgeColor = '#93c5fd';
                let badgeBorder = 'rgba(59,130,246,0.3)';
                let leftAccent = '#3b82f6';

                if (sev === 'critical') {
                    severityLabel = 'Crítico'; dotColor = '#ef4444'; leftAccent = '#ef4444';
                    badgeBg = 'rgba(239,68,68,0.12)'; badgeColor = '#fca5a5'; badgeBorder = 'rgba(239,68,68,0.3)';
                } else if (sev === 'warning') {
                    severityLabel = 'Alerta'; dotColor = '#f59e0b'; leftAccent = '#f59e0b';
                    badgeBg = 'rgba(245,158,11,0.12)'; badgeColor = '#fde047'; badgeBorder = 'rgba(245,158,11,0.3)';
                } else if (sev === 'success') {
                    severityLabel = 'Ok'; dotColor = '#10b981'; leftAccent = '#10b981';
                    badgeBg = 'rgba(16,185,129,0.12)'; badgeColor = '#6ee7b7'; badgeBorder = 'rgba(16,185,129,0.3)';
                }

                const dt = item.created_at ? new Date(item.created_at) : null;
                const timeStr = dt ? dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-';
                const relStr = dt ? this._relativeTime(dt) : '';
                const valuePct = item.value_pct != null ? `${item.value_pct}%` : null;

                return `
                    <div class="event-history-row" style="border-left: 3px solid ${leftAccent};">
                        <div class="event-history-row-left">
                            <span class="monitor-dot" style="background: ${dotColor}; flex-shrink: 0;"></span>
                            <div class="event-history-row-info">
                                <span class="event-history-row-title">${item.title}</span>
                                ${item.description ? `<span class="event-history-row-desc">${item.description}</span>` : ''}
                            </div>
                        </div>
                        <div class="event-history-row-meta">
                            ${valuePct ? `<span class="event-history-row-value">${valuePct}</span>` : ''}
                            <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder}; flex-shrink: 0;">${severityLabel}</span>
                            <div class="event-history-row-time">
                                <span class="event-time-clock">${timeStr}</span>
                                ${relStr ? `<span class="event-time-rel">${relStr}</span>` : ''}
                            </div>
                        </div>
                    </div>`;
            }).join('');

            return `
                <div class="event-history-date-group">
                    <div class="event-history-date-header">
                        <span class="event-history-date-line"></span>
                        <span class="event-history-date-label">${dateLabel}</span>
                        <span class="event-history-date-line"></span>
                    </div>
                    ${itemsHtml}
                </div>`;
        }).join('');

        grid.innerHTML = `<div class="event-history-list">${rowsHtml}</div>`;
    },

    _relativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffH = Math.floor(diffMin / 60);
        const diffD = Math.floor(diffH / 24);

        if (diffMs < 60000) return 'agora mesmo';
        if (diffMin < 60) return `${diffMin}min atrás`;
        if (diffH < 24) return `${diffH}h atrás`;
        if (diffD === 1) return 'ontem';
        return `${diffD} dias atrás`;
    },

    updateKPIs(total, offline) {
        const online = total - offline;
        const totalEl = document.getElementById('monitor-kpi-total');
        const warningEl = document.getElementById('monitor-kpi-warning');
        const infoEl = document.getElementById('monitor-kpi-info');
        if (totalEl) totalEl.textContent = total;
        if (warningEl) warningEl.textContent = offline;
        if (infoEl) infoEl.textContent = online;
    },

    async fetchDiagnostics() {
        try {
            const res = await apiClient.get('/monitoring/diagnostico?t=' + Date.now());
            const isOnline = res && res.status === 'online';
            
            this.updateGnewApiStatus(isOnline, isOnline ? 'Gnew Online' : 'Gnew Offline (Contingência)', res ? res.message : '');
            
            if (res && res.data) {
                gnewDiagData = res.data;
                this.renderGnewDiagnostics();
            } else {
                throw new Error("Dados inválidos na resposta da API.");
            }
        } catch (err) {
            console.error('Erro ao buscar diagnósticos da Gnew:', err);
            this.updateGnewApiStatus(false, 'Erro de Conexão', err.message);
        }
    },

    updateGnewApiStatus(isOnline, text, message) {
        const badge = document.getElementById('gnew-api-status-badge');
        const messageEl = document.getElementById('gnew-api-message');
        if (badge) {
            badge.className = `api-status-badge ${isOnline ? 'online' : 'offline'}`;
            badge.style.background = isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            badge.style.color = isOnline ? '#6ee7b7' : '#fca5a5';
            badge.style.borderColor = isOnline ? '#10b981' : '#ef4444';
            const statusText = badge.querySelector('.status-text');
            if (statusText) statusText.textContent = text;
        }
        if (messageEl && message) {
            messageEl.textContent = message;
        }
    },

    parseMemoryOutput(output) {
        try {
            const lines = output.split('\n');
            const memLine = lines.find(l => l.trim().startsWith('Mem:'));
            if (memLine) {
                const tokens = memLine.trim().split(/\s+/);
                if (tokens.length >= 3) {
                    const totalStr = tokens[1];
                    const usedStr = tokens[2];
                    
                    const parseVal = (str) => {
                        const val = parseFloat(str);
                        if (str.toLowerCase().includes('g')) return val * 1024;
                        if (str.toLowerCase().includes('m')) return val;
                        if (str.toLowerCase().includes('k')) return val / 1024;
                        return val;
                    };
                    
                    const totalVal = parseVal(totalStr);
                    const usedVal = parseVal(usedStr);
                    
                    if (!isNaN(totalVal) && !isNaN(usedVal) && totalVal > 0) {
                        const pct = Math.round((usedVal / totalVal) * 100);
                        return {
                            percentage: pct,
                            detail: `${usedStr} em uso de ${totalStr} total`
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Erro ao fazer parse da memória:", e);
        }
        return { percentage: 0, detail: 'Erro no parse' };
    },

    parseDiskOutput(output) {
        try {
            const lines = output.split('\n');
            const rootLine = lines.find(l => l.trim().endsWith(' /'));
            if (rootLine) {
                const tokens = rootLine.trim().split(/\s+/);
                if (tokens.length >= 5) {
                    const sizeStr = tokens[1];
                    const usedStr = tokens[2];
                    const pctStr = tokens[4].replace('%', '');
                    const pct = parseInt(pctStr, 10);
                    
                    if (!isNaN(pct)) {
                        return {
                            percentage: pct,
                            detail: `${usedStr} em uso de ${sizeStr} (Montagem em /)`
                        };
                    }
                }
            }
        } catch (e) {
            console.warn("Erro ao fazer parse do disco:", e);
        }
        return { percentage: 0, detail: 'Erro no parse' };
    },

    renderGnewDiagnostics() {
        if (!gnewDiagData) return;

        // Render Memory RAM KPI
        if (gnewDiagData.memoria) {
            let mem = { percentage: 0, detail: 'Dados de memória indisponíveis' };
            if (gnewDiagData.memoria.output) {
                mem = this.parseMemoryOutput(gnewDiagData.memoria.output);
            } else if (typeof gnewDiagData.memoria.percent !== 'undefined') {
                const totalGb = (gnewDiagData.memoria.total_mb / 1024).toFixed(1);
                const usedGb = (gnewDiagData.memoria.used_mb / 1024).toFixed(1);
                mem = {
                    percentage: Math.round(gnewDiagData.memoria.percent),
                    detail: `${usedGb}GB em uso de ${totalGb}GB total`
                };
            }

            const memText = document.getElementById('gnew-kpi-mem-text');
            const memBar = document.getElementById('gnew-kpi-mem-bar');
            const memDetail = document.getElementById('gnew-kpi-mem-detail');
            if (memText) memText.textContent = `${mem.percentage}%`;
            if (memBar) memBar.style.width = `${mem.percentage}%`;
            if (memDetail) memDetail.textContent = mem.detail;
        }

        // Render Disk KPI
        if (gnewDiagData.disco) {
            let disk = { percentage: 0, detail: 'Dados de disco indisponíveis' };
            if (gnewDiagData.disco.output) {
                disk = this.parseDiskOutput(gnewDiagData.disco.output);
            } else if (Array.isArray(gnewDiagData.disco)) {
                const rootMount = gnewDiagData.disco.find(m => m.mountpoint === '/');
                if (rootMount) {
                    disk = {
                        percentage: Math.round(rootMount.percent),
                        detail: `${rootMount.used_gb.toFixed(1)}GB em uso de ${rootMount.total_gb.toFixed(1)}GB (Montagem em /)`
                    };
                }
            }

            const diskText = document.getElementById('gnew-kpi-disk-text');
            const diskBar = document.getElementById('gnew-kpi-disk-bar');
            const diskDetail = document.getElementById('gnew-kpi-disk-detail');
            if (diskText) diskText.textContent = `${disk.percentage}%`;
            if (diskBar) diskBar.style.width = `${disk.percentage}%`;
            if (diskDetail) diskDetail.textContent = disk.detail;
        }

        // Render Disk detailed table
        const tableBody = document.getElementById('gnew-disk-table-body');
        if (tableBody) {
            let parsedDisks = [];

            if (gnewDiagData.disco) {
                if (gnewDiagData.disco.output) {
                    try {
                        const lines = gnewDiagData.disco.output.trim().split('\n');
                        for (let i = 1; i < lines.length; i++) {
                            const tokens = lines[i].trim().split(/\s+/);
                            if (tokens.length >= 6) {
                                parsedDisks.push({
                                    mountpoint: tokens[5],
                                    total: tokens[1],
                                    used: tokens[2],
                                    free: tokens[3],
                                    percent: parseInt(tokens[4].replace('%', ''), 10) || 0
                                });
                            }
                        }
                    } catch (e) {
                        console.warn("Erro ao fazer parse da tabela de disco offline:", e);
                    }
                } else if (Array.isArray(gnewDiagData.disco)) {
                    parsedDisks = gnewDiagData.disco.map(item => {
                        return {
                            mountpoint: item.mountpoint,
                            total: typeof item.total_gb === 'number' ? `${item.total_gb.toFixed(2)} GB` : (item.total_gb || '0 GB'),
                            used: typeof item.used_gb === 'number' ? `${item.used_gb.toFixed(2)} GB` : (item.used_gb || '0 GB'),
                            free: typeof item.free_gb === 'number' ? `${item.free_gb.toFixed(2)} GB` : (item.free_gb || '0 GB'),
                            percent: typeof item.percent === 'number' ? Math.round(item.percent) : (parseInt(item.percent, 10) || 0)
                        };
                    });
                }
            }

            if (parsedDisks.length > 0) {
                tableBody.innerHTML = parsedDisks.map(disk => {
                    const pct = disk.percent;
                    return `
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                            <td style="padding: 12px; font-weight: 500; color: var(--text-main); font-family: monospace;">${disk.mountpoint}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${disk.total}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${disk.used}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${disk.free}</td>
                            <td style="padding: 12px; text-align: right; font-family: monospace;">
                                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
                                    <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; border: 1px solid var(--glass-border); flex-shrink: 0;">
                                        <div style="width: ${pct}%; height: 100%; background: #2563eb; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-main); min-width: 40px; text-align: right;">${pct}%</span>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            } else {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                            Nenhum ponto de montagem de disco encontrado.
                        </td>
                    </tr>
                `;
            }
        }

        // Render System Services List
        if (gnewDiagData.servicos && gnewDiagData.servicos.timestamp) {
            try {
                const date = new Date(gnewDiagData.servicos.timestamp);
                const formattedDate = date.toLocaleString('pt-BR');
                const timestampEl = document.getElementById('gnew-services-timestamp');
                if (timestampEl) timestampEl.textContent = `Última verificação: ${formattedDate}`;
            } catch (e) {
                console.warn("Erro ao formatar timestamp dos serviços:", e);
            }
        }

        const servicesList = document.getElementById('gnew-services-list');
        if (servicesList) {
            let servicesArr = [];
            if (gnewDiagData.servicos && Array.isArray(gnewDiagData.servicos.servicos)) {
                servicesArr = gnewDiagData.servicos.servicos;
            }

            if (servicesArr.length > 0) {
                servicesList.innerHTML = servicesArr.map(service => {
                    const isAtivo = service.status === 'active' || service.status_label === 'ativo';
                    const badgeColor = isAtivo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                    const textColor = isAtivo ? '#6ee7b7' : '#fca5a5';
                    const borderColor = isAtivo ? '#10b981' : '#ef4444';
                    const dotColor = isAtivo ? '#10b981' : '#ef4444';
                    
                    return `
                        <div class="service-card" style="border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; background: rgba(255, 255, 255, 0.01); display: flex; flex-direction: column; overflow: hidden; transition: all 0.2s;">
                            <!-- Service Info Row -->
                            <div class="service-header-row" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; user-select: none; transition: background 0.2s;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <!-- Chevron arrow -->
                                    <svg class="service-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" style="transition: transform 0.2s ease; transform: rotate(0deg); color: var(--text-muted); flex-shrink: 0;">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                    <span style="font-weight: 500; font-size: 0.9rem; color: var(--text-main); font-family: monospace;">${service.nome}</span>
                                </div>
                                <!-- Status Badge -->
                                <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid ${borderColor}; background: ${badgeColor}; color: ${textColor};">
                                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${dotColor};"></span>
                                    <span>${service.status_label || service.status}</span>
                                </div>
                            </div>
                            <!-- Log Area (Collapsible) -->
                            <div class="service-log-content" style="max-height: 0; overflow: hidden; transition: all 0.3s ease-in-out; background: rgba(0, 0, 0, 0.2); border-top: 1px solid transparent;">
                                <pre style="margin: 0; padding: 12px; font-family: monospace; font-size: 0.75rem; color: #a3a3a3; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${service.log || 'Sem logs de sistema disponíveis.'}</pre>
                            </div>
                        </div>
                    `;
                }).join('');

                // Register toggle listeners
                const headerRows = servicesList.querySelectorAll('.service-header-row');
                headerRows.forEach(row => {
                    row.addEventListener('click', () => {
                        const card = row.closest('.service-card');
                        const logContent = card.querySelector('.service-log-content');
                        const chevron = card.querySelector('.service-chevron');
                        const isExpanded = logContent.style.maxHeight === '300px';

                        if (isExpanded) {
                            logContent.style.maxHeight = '0px';
                            logContent.style.borderTopColor = 'transparent';
                            chevron.style.transform = 'rotate(0deg)';
                        } else {
                            logContent.style.maxHeight = '300px';
                            logContent.style.borderTopColor = 'rgba(255, 255, 255, 0.05)';
                            chevron.style.transform = 'rotate(90deg)';
                        }
                    });
                });
            } else {
                servicesList.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhum serviço encontrado no servidor.
                    </div>
                `;
            }
        }

        // Render External IP
        if (gnewDiagData.ipExterno) {
            const ipText = document.getElementById('gnew-kpi-ip-text');
            if (ipText) {
                ipText.textContent = gnewDiagData.ipExterno.ip || 'Não detectado';
            }
        }

        // Check thresholds and generate alerts
        this.checkGnewThresholds();
    },

    // -----------------------------------------------------------------------
    // checkGnewThresholds — Verifica limites, persiste alertas no banco e
    // atualiza o histórico se a aba estiver visível.
    //   RAM    >= 90%  → alerta crítico
    //   Disco  >= 80%  → alerta de aviso (qualquer ponto de montagem)
    //   Serviço off    → alerta crítico por serviço
    // -----------------------------------------------------------------------
    async checkGnewThresholds() {
        if (!gnewDiagData) return;

        const RAM_THRESHOLD  = 90; // %
        const DISK_THRESHOLD = 80; // %
        const newAlerts = [];

        // --- RAM ---
        let ramPct = 0;
        if (gnewDiagData.memoria) {
            if (gnewDiagData.memoria.output) {
                ramPct = this.parseMemoryOutput(gnewDiagData.memoria.output).percentage;
            } else if (typeof gnewDiagData.memoria.percent !== 'undefined') {
                ramPct = Math.round(gnewDiagData.memoria.percent);
            }
        }
        if (ramPct >= RAM_THRESHOLD) {
            newAlerts.push({
                alert_key: 'gnew-alert-ram',
                title: `RAM crítica: ${ramPct}%`,
                description: `Uso de memória RAM atingiu ${ramPct}%, superando o limite de ${RAM_THRESHOLD}%. Verifique os processos em execução no PABX.`,
                severity: 'critical',
                source: 'Gnew Monitor',
                value_pct: ramPct
            });
        }

        // --- Disco (todos os pontos de montagem) ---
        let disks = [];
        if (gnewDiagData.disco) {
            if (gnewDiagData.disco.output) {
                try {
                    const lines = gnewDiagData.disco.output.trim().split('\n');
                    for (let i = 1; i < lines.length; i++) {
                        const t = lines[i].trim().split(/\s+/);
                        if (t.length >= 6) {
                            disks.push({ mountpoint: t[5], percent: parseInt(t[4].replace('%', ''), 10) || 0 });
                        }
                    }
                } catch (e) { /* ignore */ }
            } else if (Array.isArray(gnewDiagData.disco)) {
                disks = gnewDiagData.disco.map(d => ({ mountpoint: d.mountpoint, percent: Math.round(d.percent || 0) }));
            }
        }
        disks.forEach(disk => {
            if (disk.percent >= DISK_THRESHOLD) {
                newAlerts.push({
                    alert_key: `gnew-alert-disk-${disk.mountpoint}`,
                    title: `Disco (${disk.mountpoint}): ${disk.percent}%`,
                    description: `Ponto de montagem "${disk.mountpoint}" está com ${disk.percent}% de uso, superando o limite de ${DISK_THRESHOLD}%.`,
                    severity: disk.percent >= 95 ? 'critical' : 'warning',
                    source: 'Gnew Monitor',
                    value_pct: disk.percent
                });
            }
        });

        // --- Serviços Gnew offline ---
        if (gnewDiagData.servicos && Array.isArray(gnewDiagData.servicos.servicos)) {
            gnewDiagData.servicos.servicos.forEach(svc => {
                const isAtivo = svc.status === 'active' || svc.status_label === 'ativo';
                if (!isAtivo) {
                    newAlerts.push({
                        alert_key: `gnew-alert-svc-${svc.nome}`,
                        title: `Serviço offline: ${svc.nome}`,
                        description: `O serviço "${svc.nome}" está com status "${svc.status_label || svc.status}". Verifique o systemd do PABX.`,
                        severity: 'critical',
                        source: 'Gnew Monitor',
                        value_pct: null
                    });
                }
            });
        }

        // Atualiza lista em memória para uso na aba de Alertas Ativos
        gnewAlerts = newAlerts;

        // Persiste os alertas detectados no banco (deduplicação server-side)
        if (newAlerts.length > 0) {
            const savePromises = newAlerts.map(alert =>
                fetch('/api/monitoring/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alert)
                }).catch(() => {})
            );
            await Promise.all(savePromises);
        }

        // Se a aba histórico estiver visível, atualiza
        if (activeTab === 'events') {
            this.fetchAndRenderEventHistory();
        }
    },

    async clearEventHistory() {
        const clearBtn = document.getElementById('btn-clear-event-history');
        if (!confirm('Tem certeza que deseja limpar todo o histórico de eventos? Esta ação não pode ser desfeita.')) return;

        try {
            if (clearBtn) {
                clearBtn.disabled = true;
                clearBtn.textContent = 'Limpando...';
            }
            await fetch('/api/monitoring/events', { method: 'DELETE' });
            await this.fetchAndRenderEventHistory();

            const countEl = document.getElementById('event-history-count');
            if (countEl) countEl.style.display = 'none';
        } catch (err) {
            console.error('Erro ao limpar histórico:', err);
            alert('Erro ao limpar o histórico. Tente novamente.');
        } finally {
            if (clearBtn) {
                clearBtn.disabled = false;
                clearBtn.textContent = 'Limpar Histórico';
            }
        }
    },

    async fetchAndRenderApisStatus() {
        const grid = document.getElementById('monitoring-apis-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 12px; color: var(--text-muted);">
                <div class="api-loading-spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 0.9rem;">Verificando integridade das APIs...</span>
            </div>
        `;

        const btn = document.getElementById('btn-refresh-apis-status');
        let svg = null;
        if (btn) {
            svg = btn.querySelector('svg');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            if (svg) svg.style.animation = 'spin 0.8s linear infinite';
        }

        try {
            const res = await apiClient.get('/monitoring/apis-status?t=' + Date.now());
            if (res && res.success && Array.isArray(res.apis)) {
                this.renderApisGrid(res.apis);
            } else {
                throw new Error("Resposta inválida do servidor.");
            }
        } catch (err) {
            console.error('Erro ao buscar status das APIs:', err);
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                    <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status das APIs</p>
                    <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${err.message}</p>
                </div>
            `;
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.cursor = 'pointer';
                if (svg) svg.style.animation = '';
            }
        }
    },

    renderApisGrid(apis) {
        const grid = document.getElementById('monitoring-apis-grid');
        if (!grid) return;

        if (apis.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);">
                    Nenhuma API cadastrada.
                </div>
            `;
            return;
        }

        grid.innerHTML = apis.map(api => {
            const badgeClass = api.online ? 'online' : 'offline';
            const badgeBg = api.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            const badgeColor = api.online ? '#6ee7b7' : '#fca5a5';
            const badgeBorder = api.online ? '#10b981' : '#ef4444';
            const latencyColor = api.latency < 200 ? '#6ee7b7' : api.latency < 500 ? '#fde047' : '#fca5a5';

            return `
                <div class="api-status-card glass" data-api-id="${api.id}">
                    <div class="api-card-header">
                        <div class="api-info-meta">
                            <span class="api-type-tag">${api.type}</span>
                            <h4 class="api-name">${api.name}</h4>
                        </div>
                        <span class="api-badge ${badgeClass}" style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                            <span class="status-dot"></span>
                            ${api.online ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    <div class="api-card-body">
                        <p class="api-desc">${api.description}</p>
                        <div class="api-url-wrapper">
                            <span class="api-url-label">Endpoint:</span>
                            <code class="api-url-code" title="${api.url}">${api.url}</code>
                        </div>
                    </div>
                    <div class="api-card-footer">
                        <div class="api-stat">
                            <span class="stat-label">Latência:</span>
                            <span class="stat-value" style="color: ${latencyColor}">${api.latency}ms</span>
                        </div>
                        <div class="api-stat" style="max-width: 60%;">
                            <span class="stat-label">Detalhe:</span>
                            <span class="stat-value detail-value" title="${api.message || '-'}">${api.message || '-'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
