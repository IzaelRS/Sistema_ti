import { apiClient } from '../api/client.js';

let allNotifications = [];
let searchQuery = '';
let eventsSearchQuery = '';
let autoRefreshInterval = null;
let activeTab = 'alerts'; // 'alerts', 'disabled', 'events', 'gnew'
let disabledServices = [];
let gnewDiagData = null;

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
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabGnew) {
            tabGnew.addEventListener('click', () => this.setActiveTab('gnew'));
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

        // Detailed Disk Accordion toggle listener
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
                e.stopPropagation(); // prevent accordion toggle
                this.fetchDiagnostics();
            });
        }

        const refreshGnewServicesBtn = document.getElementById('btn-refresh-gnew-services');
        if (refreshGnewServicesBtn) {
            refreshGnewServicesBtn.addEventListener('click', async () => {
                const btn = refreshGnewServicesBtn;
                const svg = btn.querySelector('svg');
                if (btn.disabled) return;

                // Visual feedback: disable + spin icon
                btn.disabled = true;
                btn.style.opacity = '0.6';
                btn.style.cursor = 'not-allowed';
                if (svg) svg.style.animation = 'spin 0.8s linear infinite';

                try {
                    await this.fetchDiagnostics();
                } finally {
                    // Restore button state
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.cursor = 'pointer';
                    if (svg) svg.style.animation = '';
                }
            });
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
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabAlerts && tabDisabled && tabEvents) {
            tabAlerts.classList.toggle('active', tab === 'alerts');
            tabDisabled.classList.toggle('active', tab === 'disabled');
            tabEvents.classList.toggle('active', tab === 'events');
            if (tabGnew) tabGnew.classList.toggle('active', tab === 'gnew');
        }

        // Toggle active divs
        const divAlerts = document.getElementById('monitoring-tab-content-alerts');
        const divDisabled = document.getElementById('monitoring-tab-content-disabled');
        const divEvents = document.getElementById('monitoring-tab-content-events');
        const divGnew = document.getElementById('monitoring-tab-content-gnew');
        
        if (divAlerts && divDisabled && divEvents) {
            divAlerts.classList.toggle('hidden', tab !== 'alerts');
            divAlerts.classList.toggle('active', tab === 'alerts');
            
            divDisabled.classList.toggle('hidden', tab !== 'disabled');
            divDisabled.classList.toggle('active', tab === 'disabled');
            
            divEvents.classList.toggle('hidden', tab !== 'events');
            divEvents.classList.toggle('active', tab === 'events');

            if (divGnew) {
                divGnew.classList.toggle('hidden', tab !== 'gnew');
                divGnew.classList.toggle('active', tab === 'gnew');
            }
        }

        if (tab === 'gnew') {
            this.fetchDiagnostics();
        } else {
            this.render();
        }
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
        if (activeTab === 'gnew') {
            await this.fetchDiagnostics();
            return;
        }

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
                    
                    // Convert units like 7.8Gi to floats
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
                // Formato de Contingência (String)
                mem = this.parseMemoryOutput(gnewDiagData.memoria.output);
            } else if (typeof gnewDiagData.memoria.percent !== 'undefined') {
                // Formato Real JSON
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
                // Formato de Contingência (String)
                disk = this.parseDiskOutput(gnewDiagData.disco.output);
            } else if (Array.isArray(gnewDiagData.disco)) {
                // Formato Real JSON (Array)
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
                    // Contingency format (Linux df terminal string output)
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
                    // Real JSON format (array of mountpoints)
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
