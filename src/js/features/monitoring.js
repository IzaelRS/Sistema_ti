import { apiClient } from '../api/client.js';

let allNotifications = [];
let searchQuery = '';
let eventsSearchQuery = '';
let autoRefreshInterval = null;
let activeTab = 'alerts'; // 'alerts', 'disabled', 'events'
let disabledServices = [];

export const monitoringHandler = {
    init() {
        // Load disabled services from localStorage
        try {
            const stored = localStorage.getItem('monitoring_disabled_services');
            disabledServices = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Erro ao ler localStorage:', e);
            disabledServices = [];
        }

        // Tab switching listeners
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        if (tabAlerts) {
            tabAlerts.addEventListener('click', () => this.setActiveTab('alerts'));
        }
        const tabDisabled = document.getElementById('tab-monitoring-disabled');
        if (tabDisabled) {
            tabDisabled.addEventListener('click', () => this.setActiveTab('disabled'));
        }
        const tabEvents = document.getElementById('tab-monitoring-events');
        if (tabEvents) {
            tabEvents.addEventListener('click', () => this.setActiveTab('events'));
        }

        // Setup filters & search listeners
        const searchInput = document.getElementById('monitoring-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                this.render();
            });
        }

        const eventsSearchInput = document.getElementById('monitoring-events-search-input');
        if (eventsSearchInput) {
            eventsSearchInput.addEventListener('input', (e) => {
                eventsSearchQuery = e.target.value.toLowerCase();
                this.render();
            });
        }

        const refreshBtn = document.getElementById('btn-refresh-monitoring');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.fetch();
            });
        }

        const autoRefreshCheckbox = document.getElementById('monitoring-auto-refresh');
        if (autoRefreshCheckbox) {
            autoRefreshCheckbox.addEventListener('change', (e) => {
                this.toggleAutoRefresh(e.target.checked);
            });
            // Initial state
            this.toggleAutoRefresh(autoRefreshCheckbox.checked);
        }

        // Bind global helper for onClick event handler
        window.monitoringHandler = this;
    },

    setActiveTab(tab) {
        activeTab = tab;
        
        // Toggle active classes on tab buttons
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        const tabDisabled = document.getElementById('tab-monitoring-disabled');
        const tabEvents = document.getElementById('tab-monitoring-events');
        if (tabAlerts && tabDisabled && tabEvents) {
            tabAlerts.classList.toggle('active', tab === 'alerts');
            tabDisabled.classList.toggle('active', tab === 'disabled');
            tabEvents.classList.toggle('active', tab === 'events');
        }

        // Toggle active divs
        const divAlerts = document.getElementById('monitoring-tab-content-alerts');
        const divDisabled = document.getElementById('monitoring-tab-content-disabled');
        const divEvents = document.getElementById('monitoring-tab-content-events');
        
        if (divAlerts && divDisabled && divEvents) {
            divAlerts.classList.toggle('hidden', tab !== 'alerts');
            divAlerts.classList.toggle('active', tab === 'alerts');
            
            divDisabled.classList.toggle('hidden', tab !== 'disabled');
            divDisabled.classList.toggle('active', tab === 'disabled');
            
            divEvents.classList.toggle('hidden', tab !== 'events');
            divEvents.classList.toggle('active', tab === 'events');
        }

        this.render();
    },

    toggleService(serviceName, enable) {
        if (enable) {
            // Remove from disabled list
            disabledServices = disabledServices.filter(s => s !== serviceName);
        } else {
            // Add to disabled list
            if (!disabledServices.includes(serviceName)) {
                disabledServices.push(serviceName);
            }
        }
        
        // Save to localStorage
        localStorage.setItem('monitoring_disabled_services', JSON.stringify(disabledServices));
        
        this.render();
    },

    toggleAutoRefresh(enabled) {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }

        if (enabled) {
            autoRefreshInterval = setInterval(() => {
                const activeNav = document.querySelector('.nav-btn.active');
                if (activeNav && activeNav.dataset.section === 'monitoring') {
                    this.fetch();
                }
            }, 30000); // 30 seconds
        }
    },

    async fetch() {
        try {
            const res = await apiClient.get('/monitoring/notifications');
            
            let rawList = [];
            let isOffline = false;

            if (Array.isArray(res)) {
                rawList = res;
                this.updateApiStatus(true, "API Online (OLIJUS)");
            } else if (res && Array.isArray(res.notifications)) {
                rawList = res.notifications;
                isOffline = res.status === 'offline';
                this.updateApiStatus(!isOffline, isOffline ? "API Offline (Contingência)" : "API Online (OLIJUS)");
            } else if (res && Array.isArray(res.data)) {
                rawList = res.data;
                this.updateApiStatus(true, "API Online (OLIJUS)");
            } else {
                this.updateApiStatus(false, "Resposta Inválida");
            }

            // Filter to 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            allNotifications = rawList
                .map(item => this.parseNotification(item))
                .filter(item => {
                    const itemDate = new Date(item.created_at);
                    return itemDate >= thirtyDaysAgo;
                });
                
            this.render();
        } catch (err) {
            console.error('Erro ao buscar notificações de monitoramento:', err);
            this.updateApiStatus(false, "Erro de Conexão");
            
            const gridAlerts = document.getElementById('monitoring-alerts-grid');
            if (gridAlerts && allNotifications.length === 0) {
                gridAlerts.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); border-radius: var(--border-radius);">
                        <h4 style="color: #ef4444; margin-bottom: 5px;">Erro ao Carregar Monitoramento</h4>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Não foi possível estabelecer contato com a API. Detalhes: ${err.message}</p>
                    </div>
                `;
            }
        }
    },

    parseNotification(item) {
        // Derive severity
        let severity = 'info';
        const msgUpper = (item.message || '').toUpperCase();
        
        // If it states the service is restored or resolved, treat as success/restored
        if (msgUpper.includes('RESTAURADO') || msgUpper.includes('RESTAURADA') || msgUpper.includes('RESOLVIDO') || msgUpper.includes('RESOLVIDA')) {
            severity = 'success';
        } else if (msgUpper.includes('FALHA') || msgUpper.includes('DOWN') || msgUpper.includes('ERROR') || msgUpper.includes('DESCONECTADO') || msgUpper.includes('CRITICAL')) {
            severity = 'critical';
        } else if (msgUpper.includes('WARNING') || msgUpper.includes('ALERTA') || msgUpper.includes('AVISO') || msgUpper.includes('INSTABILIDADE')) {
            severity = 'warning';
        } else if (msgUpper.includes('SUCESSO') || msgUpper.includes('ADICIONADO') || msgUpper.includes('NOVO') || msgUpper.includes('DECOLAGEM')) {
            severity = 'success';
        }

        // Extract IP (if available in description or message)
        let ip = '';
        const ipMatch = (item.message || '').match(/\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)/) || (item.message || '').match(/\(([^)]+)\)/);
        if (ipMatch) {
            ip = ipMatch[1].trim();
        }

        // Parse Title & Description
        let title = 'Notificação';
        let description = item.message || '';
        
        if (item.message) {
            const lines = item.message.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length > 0) {
                title = lines[0];
                if (lines.length > 1) {
                    description = lines.slice(1).join('\n');
                } else {
                    description = lines[0];
                    if (title.length > 45) {
                        title = item.type === 'new_device' ? 'Novo Dispositivo' : 'Alerta de Monitoramento';
                        description = lines[0];
                    }
                }
            }
        }

        return {
            id: item.id || Math.random().toString(),
            title: title,
            description: description,
            severity: severity,
            source: 'OLIJUS',
            ip: ip,
            created_at: item.timestamp || item.created_at || new Date().toISOString()
        };
    },

    updateApiStatus(isOnline, text) {
        const badge = document.getElementById('monitoring-api-status');
        if (badge) {
            badge.className = `api-status-badge ${isOnline ? 'online' : 'offline'}`;
            const statusText = badge.querySelector('.status-text');
            if (statusText) statusText.textContent = text;
        }
    },

    getProcessedServices() {
        const servicesMap = {};

        allNotifications.forEach(item => {
            let serviceName = '';
            let ip = '';
            
            // Extract service name and IP from description or title
            const serviceMatch = (item.description || '').match(/O serviço ([^\(]+)\s*(?:\(([^)]+)\))?/i) || 
                                 (item.title || '').match(/O serviço ([^\(]+)\s*(?:\(([^)]+)\))?/i);
            const pingMatch = (item.description || '').match(/dispositivo ([^\(]+)\s*(?:\(([^)]+)\))?/i);

            if (serviceMatch) {
                serviceName = serviceMatch[1].trim();
                ip = serviceMatch[2] ? serviceMatch[2].trim() : '';
            } else if (pingMatch) {
                serviceName = pingMatch[1].trim();
                ip = pingMatch[2] ? pingMatch[2].trim() : '';
            } else {
                serviceName = item.title;
            }

            // Clean service name of symbols
            serviceName = serviceName.replace(/[🚀🛰️🛸🌟🛸]/g, '').trim();

            if (!serviceName) return;

            const key = serviceName.toLowerCase();
            const isOffline = item.severity === 'critical' || item.severity === 'warning';

            if (!servicesMap[key]) {
                servicesMap[key] = {
                    name: serviceName,
                    ip: ip,
                    status: isOffline ? 'offline' : 'online',
                    lastUpdated: item.created_at
                };
            } else {
                // Determine status based on the newest event chronologically
                const isNewer = new Date(item.created_at) > new Date(servicesMap[key].lastUpdated);
                if (isNewer) {
                    servicesMap[key].status = isOffline ? 'offline' : 'online';
                    servicesMap[key].lastUpdated = item.created_at;
                }
                
                // Retain IP if found
                if (ip && !servicesMap[key].ip) {
                    servicesMap[key].ip = ip;
                }
            }
        });

        return Object.values(servicesMap);
    },

    render() {
        const services = this.getProcessedServices();
        
        // Filter out services based on disabled state
        let activeServices = services.filter(s => !disabledServices.includes(s.name));
        const disabledServicesList = services.filter(s => disabledServices.includes(s.name));

        // Sort active services based on localStorage drag sequence
        const savedOrder = JSON.parse(localStorage.getItem('monitoring_services_order') || '[]');
        if (savedOrder.length > 0) {
            activeServices.sort((a, b) => {
                let idxA = savedOrder.indexOf(a.name);
                let idxB = savedOrder.indexOf(b.name);
                if (idxA === -1) idxA = 999;
                if (idxB === -1) idxB = 999;
                return idxA - idxB;
            });
        }

        // Update KPIs with active services only
        this.updateKPIs(activeServices);

        if (activeTab === 'alerts') {
            this.renderActiveServices(activeServices);
        } else if (activeTab === 'disabled') {
            this.renderDisabledServices(disabledServicesList);
        } else {
            this.renderEvents();
        }
    },

    renderActiveServices(activeList) {
        const grid = document.getElementById('monitoring-alerts-grid');
        if (!grid) return;

        // Apply search query
        const filtered = activeList.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery));

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum serviço ativo encontrado.
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(s => {
            const statusClass = s.status === 'offline' ? 'warning' : 'success';
            const statusLabel = s.status === 'offline' ? 'Offline' : 'Online';

            return `
                <div class="notification-card ${statusClass}" draggable="true" data-service="${s.name}" style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 10px; cursor: grab;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; pointer-events: none;">
                        <div>
                            <h3 class="notification-title" style="font-size: 1.05rem; font-weight: 600; color: var(--text-main); line-height: 1.4;">${s.name}</h3>
                            ${s.ip ? `<span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace; display: block; margin-top: 4px;">IP: ${s.ip}</span>` : ''}
                        </div>
                        <span class="severity-badge ${statusClass}" style="font-size: 0.75rem; padding: 3px 8px;">${statusLabel}</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 4px;">
                        <button class="btn" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #fca5a5; border-radius: 6px; cursor: pointer; transition: all 0.2s;"
                                onclick="window.monitoringHandler.toggleService('${s.name}', false)">
                            Desativar
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.setupDragAndDrop(grid);
    },

    setupDragAndDrop(grid) {
        const cards = grid.querySelectorAll('.notification-card[draggable="true"]');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                // Persist the actual visual order
                const orderedCards = Array.from(grid.querySelectorAll('.notification-card[data-service]'));
                const newOrder = orderedCards.map(c => c.dataset.service);
                localStorage.setItem('monitoring_services_order', JSON.stringify(newOrder));
            });
        });

        if (!grid.dataset.dragOverAttached) {
            grid.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingCard = grid.querySelector('.dragging');
                if (!draggingCard) return;

                const afterElement = getDragAfterElement(grid, e.clientY, e.clientX);
                if (afterElement == null) {
                    grid.appendChild(draggingCard);
                } else {
                    grid.insertBefore(draggingCard, afterElement);
                }
            });
            grid.dataset.dragOverAttached = 'true';
        }
    },

    renderDisabledServices(disabledList) {
        const grid = document.getElementById('monitoring-disabled-grid');
        if (!grid) return;

        if (disabledList.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum serviço desativado.
                </div>
            `;
            return;
        }

        grid.innerHTML = disabledList.map(s => {
            return `
                <div class="notification-card info" style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 10px; opacity: 0.75;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                        <h3 class="notification-title" style="font-size: 1.05rem; font-weight: 600; color: var(--text-muted); line-height: 1.4; text-decoration: line-through;">${s.name}</h3>
                        <span class="severity-badge info" style="font-size: 0.75rem; padding: 3px 8px; background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);">Desativado</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 4px;">
                        <button class="btn" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #6ee7b7; border-radius: 6px; cursor: pointer; transition: all 0.2s;"
                                onclick="window.monitoringHandler.toggleService('${s.name}', true)">
                            Ativar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderEvents() {
        const grid = document.getElementById('monitoring-events-grid');
        if (!grid) return;

        const filtered = allNotifications.filter(item => {
            return !eventsSearchQuery || (item.title || '').toLowerCase().includes(eventsSearchQuery);
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum evento encontrado no histórico com os filtros atuais.
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(item => {
            const timeStr = item.created_at ? new Date(item.created_at).toLocaleString('pt-BR') : 'Sem data';
            const severityClass = item.severity || 'info';
            
            let severityLabel = 'Info';
            if (severityClass === 'critical') severityLabel = 'Crítico';
            else if (severityClass === 'warning') severityLabel = 'Alerta';
            else if (severityClass === 'success') severityLabel = 'Sucesso';

            return `
                <div class="notification-card ${severityClass}" style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; width: 100%;">
                        <div>
                            <h3 class="notification-title" style="font-size: 1rem; font-weight: 600; line-height: 1.4; margin: 0; word-break: break-word; color: var(--text-main);">${item.title}</h3>
                            ${item.ip ? `<span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace; display: block; margin-top: 4px;">IP: ${item.ip}</span>` : ''}
                        </div>
                        <span class="severity-badge ${severityClass}" style="font-size: 0.7rem; padding: 3px 8px;">${severityLabel}</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 2px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">
                            ${timeStr}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    },

    updateKPIs(activeServices) {
        let total = activeServices.length;
        let offline = activeServices.filter(s => s.status === 'offline').length;
        let online = activeServices.filter(s => s.status === 'online').length;

        const totalEl = document.getElementById('monitor-kpi-total');
        const warningEl = document.getElementById('monitor-kpi-warning');
        const infoEl = document.getElementById('monitor-kpi-info');

        if (totalEl) totalEl.textContent = total;
        if (warningEl) warningEl.textContent = offline;
        if (infoEl) infoEl.textContent = online;
    }
};

// Helper for finding position in multi-line grids
function getDragAfterElement(container, y, x) {
    const draggableElements = [...container.querySelectorAll('.notification-card[draggable="true"]:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const distance = Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2);

        if (distance < closest.distance) {
            return { distance: distance, element: child };
        } else {
            return closest;
        }
    }, { distance: Number.POSITIVE_INFINITY }).element;
}
