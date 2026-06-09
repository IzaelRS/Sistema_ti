import { apiClient } from '../api/client.js';

let gnewAlerts = []; // alertas sinteticos gerados a partir dos dados Gnew
let eventsSearchQuery = '';
let activeTab = 'alerts'; // 'alerts', 'events', 'gnew'
let gnewDiagData = null;

export const monitoringHandler = {
    init() {
        // Tab switching listeners
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        if (tabAlerts) tabAlerts.addEventListener('click', () => this.setActiveTab('alerts'));
        const tabEvents = document.getElementById('tab-monitoring-events');
        if (tabEvents) tabEvents.addEventListener('click', () => this.setActiveTab('events'));
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabGnew) tabGnew.addEventListener('click', () => this.setActiveTab('gnew'));

        // Search in event history
        const eventsSearchInput = document.getElementById('monitoring-events-search-input');
        if (eventsSearchInput) {
            eventsSearchInput.addEventListener('input', (e) => {
                eventsSearchQuery = e.target.value.toLowerCase();
                this.render();
            });
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

        // Bind global helper
        window.monitoringHandler = this;
    },

    setActiveTab(tab) {
        activeTab = tab;
        
        // Toggle active classes on tab buttons
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        const tabEvents = document.getElementById('tab-monitoring-events');
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabAlerts) tabAlerts.classList.toggle('active', tab === 'alerts');
        if (tabEvents) tabEvents.classList.toggle('active', tab === 'events');
        if (tabGnew) tabGnew.classList.toggle('active', tab === 'gnew');

        // Toggle active divs
        const divAlerts = document.getElementById('monitoring-tab-content-alerts');
        const divEvents = document.getElementById('monitoring-tab-content-events');
        const divGnew = document.getElementById('monitoring-tab-content-gnew');
        
        if (divAlerts) {
            divAlerts.classList.toggle('hidden', tab !== 'alerts');
            divAlerts.classList.toggle('active', tab === 'alerts');
        }
        if (divEvents) {
            divEvents.classList.toggle('hidden', tab !== 'events');
            divEvents.classList.toggle('active', tab === 'events');
        }
        if (divGnew) {
            divGnew.classList.toggle('hidden', tab !== 'gnew');
            divGnew.classList.toggle('active', tab === 'gnew');
        }

        if (tab === 'gnew') {
            this.fetchDiagnostics();
        } else {
            this.render();
        }
    },

    render() {
        // Histórico = apenas alertas Gnew (threshold)
        if (activeTab === 'alerts') {
            this.renderGnewServicesStatus();
        } else {
            this.renderEvents(gnewAlerts);
        }
    },

    // Alertas Ativos: lista compacta de serviços Gnew
    renderGnewServicesStatus() {
        const grid = document.getElementById('monitoring-alerts-grid');
        if (!grid) return;

        // Troca grid por lista
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

    renderEvents(eventsToRender) {
        const grid = document.getElementById('monitoring-events-grid');
        if (!grid) return;

        // Troca grid por lista
        grid.style.display = 'flex';
        grid.style.flexDirection = 'column';
        grid.style.gap = '0';

        const list = eventsToRender || [];
        const filtered = list.filter(item =>
            !eventsSearchQuery || (item.title || '').toLowerCase().includes(eventsSearchQuery)
        );

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum alerta de threshold registrado no momento.
                </div>
            `;
            return;
        }

        grid.innerHTML = `
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Evento</span>
                    <span class="monitor-list-col-sev">Severidade</span>
                    <span class="monitor-list-col-time">Horário</span>
                </div>
                ${filtered.map((item, idx) => {
                    const severityClass = item.severity || 'info';
                    let severityLabel = 'Info';
                    let dotColor = '#3b82f6';
                    let badgeBg = 'rgba(59,130,246,0.12)';
                    let badgeColor = '#93c5fd';
                    let badgeBorder = 'rgba(59,130,246,0.3)';
                    if (severityClass === 'critical') {
                        severityLabel = 'Crítico'; dotColor = '#ef4444';
                        badgeBg = 'rgba(239,68,68,0.12)'; badgeColor = '#fca5a5'; badgeBorder = 'rgba(239,68,68,0.3)';
                    } else if (severityClass === 'warning') {
                        severityLabel = 'Alerta'; dotColor = '#f59e0b';
                        badgeBg = 'rgba(245,158,11,0.12)'; badgeColor = '#fde047'; badgeBorder = 'rgba(245,158,11,0.3)';
                    } else if (severityClass === 'success') {
                        severityLabel = 'Ok'; dotColor = '#10b981';
                        badgeBg = 'rgba(16,185,129,0.12)'; badgeColor = '#6ee7b7'; badgeBorder = 'rgba(16,185,129,0.3)';
                    }
                    const timeStr = item.created_at ? new Date(item.created_at).toLocaleString('pt-BR') : '-';
                    const rowBg = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
                    return `
                        <div class="monitor-list-row" style="background: ${rowBg};">
                            <div class="monitor-list-col-name">
                                <span class="monitor-dot" style="background: ${dotColor};"></span>
                                <div>
                                    <span class="monitor-svc-name">${item.title}</span>
                                    ${item.description ? `<span class="monitor-svc-desc">${item.description}</span>` : ''}
                                </div>
                            </div>
                            <div class="monitor-list-col-sev">
                                <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${severityLabel}</span>
                            </div>
                            <div class="monitor-list-col-time">${timeStr}</div>
                        </div>`;
                }).join('')}
            </div>`;
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

        // Check thresholds and generate alerts
        this.checkGnewThresholds();
    },

    // -----------------------------------------------------------------------
    // checkGnewThresholds — Verifica limites e injeta alertas no histórico
    //   RAM    >= 90%  → alerta crítico
    //   Disco  >= 80%  → alerta de aviso (qualquer ponto de montagem)
    //   Serviço off    → alerta crítico por serviço
    // Os alertas ficam ativos até o valor normalizar (são recalculados a cada
    // chamada e não persistem entre sessões — apenas na memória da tab).
    // -----------------------------------------------------------------------
    checkGnewThresholds() {
        if (!gnewDiagData) return;

        const RAM_THRESHOLD  = 90; // %
        const DISK_THRESHOLD = 80; // %
        const now = new Date().toISOString();
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
                id: 'gnew-alert-ram',
                title: `⚠️ Uso de RAM crítico: ${ramPct}%`,
                description: `O uso de memória RAM atingiu ${ramPct}%, superando o limite de ${RAM_THRESHOLD}%. Verifique os processos em execução no PABX.`,
                severity: 'critical',
                source: 'Gnew Monitor',
                ip: '',
                created_at: now,
                _gnewAlert: true
            });
        }

        // --- Disco (todos os pontos de montagem) ---
        let disks = [];
        if (gnewDiagData.disco) {
            if (gnewDiagData.disco.output) {
                // Parse contingency string
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
                    id: `gnew-alert-disk-${disk.mountpoint}`,
                    title: `⚠️ Disco (${disk.mountpoint}): ${disk.percent}%`,
                    description: `O ponto de montagem "${disk.mountpoint}" está com ${disk.percent}% de uso, superando o limite de ${DISK_THRESHOLD}%. Verifique o espaço disponível.`,
                    severity: disk.percent >= 95 ? 'critical' : 'warning',
                    source: 'Gnew Monitor',
                    ip: '',
                    created_at: now,
                    _gnewAlert: true
                });
            }
        });

        // --- Serviços Gnew offline ---
        if (gnewDiagData.servicos && Array.isArray(gnewDiagData.servicos.servicos)) {
            gnewDiagData.servicos.servicos.forEach(svc => {
                const isAtivo = svc.status === 'active' || svc.status_label === 'ativo';
                if (!isAtivo) {
                    newAlerts.push({
                        id: `gnew-alert-svc-${svc.nome}`,
                        title: `🔴 Serviço offline: ${svc.nome}`,
                        description: `O serviço "${svc.nome}" está com status "${svc.status_label || svc.status}". Verifique o systemd do PABX.`,
                        severity: 'critical',
                        source: 'Gnew Monitor',
                        ip: '',
                        created_at: now,
                        _gnewAlert: true
                    });
                }
            });
        }

        // Substitui alertas Gnew anteriores pelos recém-calculados
        gnewAlerts = newAlerts;

        // Se há alertas ativos, re-renderiza o histórico caso esteja visível
        if (activeTab === 'events') {
            const allEvents = [
                ...allNotifications,
                ...gnewAlerts
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            this.renderEvents(allEvents);
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
