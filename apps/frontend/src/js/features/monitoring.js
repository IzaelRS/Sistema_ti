import { apiClient } from '../api/client.js';

const PAGE_SIZE = 30;

let eventsSearchQuery = '';
let eventsFilterSeverity = 'all';
let eventsFilterDateStart = ''; // YYYY-MM-DD
let eventsFilterDateEnd   = ''; // YYYY-MM-DD
let eventsCurrentPage = 1;      // página corrente (1-indexed)
let eventsTotalFiltered = 0;    // total de registros após filtros
let activeTab = 'alerts'; // 'alerts', 'events', 'apis', 'gnew', 'infra'
let activeInfraTab = 'switches'; // 'switches', 'routers', 'nas', 'cameras', 'servers'
let gnewDiagData = null;
let apisStatusData = [];
let switchesStatusData = [];
let routersStatusData = [];
let nasStatusData = [];
let camerasStatusData = [];
let serversStatusData = [];
let autoRefreshInterval = null;
let switchesAutoRefreshInterval = null;
let routersAutoRefreshInterval = null;
let nasAutoRefreshInterval = null;
let camerasAutoRefreshInterval = null;
let serversAutoRefreshInterval = null;
let networkAutoRefreshInterval = null;
let trafficCharts = {};
let lastTrafficData = null;
let trafficPollingInterval = null;
let isPingingSequentially = false;

export const monitoringHandler = {
    init() {
        console.log('📊 [MONITORING] Initializing monitoringHandler...');
        // Tab switching listeners
        const tabAlerts = document.getElementById('tab-monitoring-alerts');
        if (tabAlerts) tabAlerts.addEventListener('click', () => this.setActiveTab('alerts'));
        const tabEvents = document.getElementById('tab-monitoring-events');
        if (tabEvents) tabEvents.addEventListener('click', () => this.setActiveTab('events'));
        const tabApis = document.getElementById('tab-monitoring-apis');
        if (tabApis) tabApis.addEventListener('click', () => this.setActiveTab('apis'));
        const tabGnew = document.getElementById('tab-monitoring-gnew');
        if (tabGnew) tabGnew.addEventListener('click', () => this.setActiveTab('gnew'));
        const tabInfra = document.getElementById('tab-monitoring-infra');
        if (tabInfra) tabInfra.addEventListener('click', () => {
            console.log('📊 [MONITORING] Clicked on Infraestrutura tab');
            this.setActiveTab('infra');
        });
        const tabNetwork = document.getElementById('tab-monitoring-network');
        if (tabNetwork) tabNetwork.addEventListener('click', () => this.setActiveTab('network'));

        // Infra subtabs click
        const tabInfraSwitches = document.getElementById('tab-infra-switches');
        if (tabInfraSwitches) tabInfraSwitches.addEventListener('click', () => {
            console.log('📊 [MONITORING] Clicked on Switches subtab');
            this.setInfraTab('switches');
        });
        const tabInfraRouters = document.getElementById('tab-infra-routers');
        if (tabInfraRouters) tabInfraRouters.addEventListener('click', () => {
            console.log('📊 [MONITORING] Clicked on Routers subtab');
            this.setInfraTab('routers');
        });
        const tabInfraNas = document.getElementById('tab-infra-nas');
        if (tabInfraNas) tabInfraNas.addEventListener('click', () => {
            console.log('📊 [MONITORING] Clicked on NAS subtab');
            this.setInfraTab('nas');
        });
        const tabInfraCameras = document.getElementById('tab-infra-cameras');
        if (tabInfraCameras) tabInfraCameras.addEventListener('click', () => {
            console.log('📊 [MONITORING] Clicked on Cameras subtab');
            this.setInfraTab('cameras');
        });
        const tabInfraServers = document.getElementById('tab-infra-servers');
        if (tabInfraServers) tabInfraServers.addEventListener('click', () => {
            console.log('📊 [MONITORING] Clicked on Servers subtab');
            this.setInfraTab('servers');
        });

        // Refresh switches button
        const refreshSwitchesBtn = document.getElementById('btn-refresh-switches-status');
        if (refreshSwitchesBtn) {
            refreshSwitchesBtn.addEventListener('click', () => this.fetchAndRenderSwitchesStatus(true));
        }

        // Refresh routers button
        const refreshRoutersBtn = document.getElementById('btn-refresh-routers-status');
        if (refreshRoutersBtn) {
            refreshRoutersBtn.addEventListener('click', () => this.fetchAndRenderRoutersStatus(true));
        }

        // Refresh NAS button
        const refreshNasBtn = document.getElementById('btn-refresh-nas-status');
        if (refreshNasBtn) {
            refreshNasBtn.addEventListener('click', () => this.fetchAndRenderNasStatus(true));
        }

        // Refresh Cameras button
        const refreshCamerasBtn = document.getElementById('btn-refresh-cameras-status');
        if (refreshCamerasBtn) {
            refreshCamerasBtn.addEventListener('click', () => this.fetchAndRenderCamerasStatus(true));
        }

        // Refresh Servers button
        const refreshServersBtn = document.getElementById('btn-refresh-servers-status');
        if (refreshServersBtn) {
            refreshServersBtn.addEventListener('click', () => this.fetchAndRenderServersStatus(true));
        }

        // Search in Servers tab
        const serversSearchInput = document.getElementById('servers-search');
        if (serversSearchInput) {
            serversSearchInput.addEventListener('input', () => {
                this.renderServersAccordion(serversStatusData);
            });
        }

        // Sanfona de filtros dos servidores
        const btnToggleFilters = document.getElementById('btn-toggle-server-filters');
        if (btnToggleFilters) {
            btnToggleFilters.addEventListener('click', () => {
                const accordion = btnToggleFilters.closest('.server-filters-accordion');
                if (accordion) {
                    accordion.classList.toggle('active');
                }
            });
        }

        // Checkboxes de filtros dos Servidores
        const serverFilterIds = [
            'filter-type-physical',
            'filter-type-virtual',
            'filter-platform-win2019',
            'filter-platform-win2025',
            'filter-platform-linux',
            'filter-activity-online',
            'filter-activity-offline'
        ];
        serverFilterIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.renderServersAccordion(serversStatusData);
                });
            }
        });

        // Search in event history
        const eventsSearchInput = document.getElementById('monitoring-events-search-input');
        if (eventsSearchInput) {
            eventsSearchInput.addEventListener('input', (e) => {
                eventsSearchQuery = e.target.value.toLowerCase();
                eventsCurrentPage = 1;
                this.fetchAndRenderEventHistory();
            });
        }

        // Search in active alerts (services + apis)
        const alertsSearchInput = document.getElementById('monitoring-search-input');
        if (alertsSearchInput) {
            alertsSearchInput.addEventListener('input', () => {
                this.renderGnewServicesStatus();
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

        // Clear history by period button ("Limpar Histórico")
        const clearBtn = document.getElementById('btn-clear-event-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearEventHistoryByPeriod());
        }

        // Delete all event history button ("Apagar Tudo")
        const deleteAllBtn = document.getElementById('btn-delete-all-event-history');
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', () => this.clearEventHistory());
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
        
        // Auto-refresh checkbox (switches tab)
        const switchesAutoRefreshChk = document.getElementById('switches-auto-refresh');
        if (switchesAutoRefreshChk) {
            switchesAutoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startSwitchesAutoRefresh();
                } else {
                    this._stopSwitchesAutoRefresh();
                }
            });
            if (switchesAutoRefreshChk.checked) this._startSwitchesAutoRefresh();
        }

        // Auto-refresh checkbox (routers tab)
        const routersAutoRefreshChk = document.getElementById('routers-auto-refresh');
        if (routersAutoRefreshChk) {
            routersAutoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startRoutersAutoRefresh();
                } else {
                    this._stopRoutersAutoRefresh();
                }
            });
            if (routersAutoRefreshChk.checked) this._startRoutersAutoRefresh();
        }

        // Auto-refresh checkbox (NAS tab)
        const nasAutoRefreshChk = document.getElementById('nas-auto-refresh');
        if (nasAutoRefreshChk) {
            nasAutoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startNasAutoRefresh();
                } else {
                    this._stopNasAutoRefresh();
                }
            });
            if (nasAutoRefreshChk.checked) this._startNasAutoRefresh();
        }

        // Auto-refresh checkbox (Cameras tab)
        const camerasAutoRefreshChk = document.getElementById('cameras-auto-refresh');
        if (camerasAutoRefreshChk) {
            camerasAutoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startCamerasAutoRefresh();
                } else {
                    this._stopCamerasAutoRefresh();
                }
            });
            if (camerasAutoRefreshChk.checked) this._startCamerasAutoRefresh();
        }

        // Auto-refresh checkbox (Servers tab)
        const serversAutoRefreshChk = document.getElementById('servers-auto-refresh');
        if (serversAutoRefreshChk) {
            serversAutoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startServersAutoRefresh();
                } else {
                    this._stopServersAutoRefresh();
                }
            });
            if (serversAutoRefreshChk.checked) this._startServersAutoRefresh();
        }

        // Refresh Network button
        const refreshNetworkBtn = document.getElementById('btn-refresh-network-status');
        if (refreshNetworkBtn) {
            refreshNetworkBtn.addEventListener('click', () => this.fetchAndRenderNetworkStatus(true));
        }

        // Auto-refresh checkbox (Network tab)
        const networkAutoRefreshChk = document.getElementById('network-auto-refresh');
        if (networkAutoRefreshChk) {
            networkAutoRefreshChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startNetworkAutoRefresh();
                } else {
                    this._stopNetworkAutoRefresh();
                }
            });
            if (networkAutoRefreshChk.checked) this._startNetworkAutoRefresh();
        }

        // Enable traffic graphs checkbox
        const trafficEnableChk = document.getElementById('network-traffic-enable');
        if (trafficEnableChk) {
            trafficEnableChk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this._startTrafficPolling();
                } else {
                    this._stopTrafficPolling();
                }
            });
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

    _startSwitchesAutoRefresh() {
        this._stopSwitchesAutoRefresh();
        switchesAutoRefreshInterval = setInterval(() => {
            if (activeTab === 'infra' && activeInfraTab === 'switches') {
                this.fetchAndRenderSwitchesStatus(false, true);
            }
        }, 60000);
    },

    _stopSwitchesAutoRefresh() {
        if (switchesAutoRefreshInterval) {
            clearInterval(switchesAutoRefreshInterval);
            switchesAutoRefreshInterval = null;
        }
    },

    _startNetworkAutoRefresh() {
        this._stopNetworkAutoRefresh();
        networkAutoRefreshInterval = setInterval(() => {
            if (activeTab === 'network') {
                this.fetchAndRenderNetworkStatus(false);
            }
        }, 30000);
    },

    _stopNetworkAutoRefresh() {
        if (networkAutoRefreshInterval) {
            clearInterval(networkAutoRefreshInterval);
            networkAutoRefreshInterval = null;
        }
    },

    _startRoutersAutoRefresh() {
        this._stopRoutersAutoRefresh();
        routersAutoRefreshInterval = setInterval(() => {
            if (activeTab === 'infra' && activeInfraTab === 'routers') {
                this.fetchAndRenderRoutersStatus(false, true);
            }
        }, 60000);
    },

    _stopRoutersAutoRefresh() {
        if (routersAutoRefreshInterval) {
            clearInterval(routersAutoRefreshInterval);
            routersAutoRefreshInterval = null;
        }
    },

    _startNasAutoRefresh() {
        this._stopNasAutoRefresh();
        nasAutoRefreshInterval = setInterval(() => {
            if (activeTab === 'infra' && activeInfraTab === 'nas') {
                this.fetchAndRenderNasStatus(false, true);
            }
        }, 60000);
    },

    _stopNasAutoRefresh() {
        if (nasAutoRefreshInterval) {
            clearInterval(nasAutoRefreshInterval);
            nasAutoRefreshInterval = null;
        }
    },

    _startCamerasAutoRefresh() {
        this._stopCamerasAutoRefresh();
        camerasAutoRefreshInterval = setInterval(() => {
            if (activeTab === 'infra' && activeInfraTab === 'cameras') {
                this.fetchAndRenderCamerasStatus(false, true);
            }
        }, 60000);
    },

    _stopCamerasAutoRefresh() {
        if (camerasAutoRefreshInterval) {
            clearInterval(camerasAutoRefreshInterval);
            camerasAutoRefreshInterval = null;
        }
    },

    _startServersAutoRefresh() {
        this._stopServersAutoRefresh();
        serversAutoRefreshInterval = setInterval(() => {
            if (activeTab === 'infra' && activeInfraTab === 'servers') {
                this.fetchAndRenderServersStatus(false, true);
            }
        }, 60000);
    },

    _stopServersAutoRefresh() {
        if (serversAutoRefreshInterval) {
            clearInterval(serversAutoRefreshInterval);
            serversAutoRefreshInterval = null;
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
        const tabInfra = document.getElementById('tab-monitoring-infra');
        const tabNetwork = document.getElementById('tab-monitoring-network');
        if (tabAlerts) tabAlerts.classList.toggle('active', tab === 'alerts');
        if (tabEvents) tabEvents.classList.toggle('active', tab === 'events');
        if (tabApis) tabApis.classList.toggle('active', tab === 'apis');
        if (tabGnew) tabGnew.classList.toggle('active', tab === 'gnew');
        if (tabInfra) tabInfra.classList.toggle('active', tab === 'infra');
        if (tabNetwork) tabNetwork.classList.toggle('active', tab === 'network');

        // Toggle active divs
        const divAlerts = document.getElementById('monitoring-tab-content-alerts');
        const divEvents = document.getElementById('monitoring-tab-content-events');
        const divApis = document.getElementById('monitoring-tab-content-apis');
        const divGnew = document.getElementById('monitoring-tab-content-gnew');
        const divInfra = document.getElementById('monitoring-tab-content-infra');
        const divNetwork = document.getElementById('monitoring-tab-content-network');
        
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
        if (divInfra) {
            divInfra.classList.toggle('hidden', tab !== 'infra');
            divInfra.classList.toggle('active', tab === 'infra');
        }
        if (divNetwork) {
            divNetwork.classList.toggle('hidden', tab !== 'network');
            divNetwork.classList.toggle('active', tab === 'network');
        }

        if (tab === 'gnew') {
            this.fetchDiagnostics();
            this._stopTrafficPolling();
        } else if (tab === 'events') {
            eventsCurrentPage = 1; // sempre começa na página 1 ao abrir a aba
            this.fetchAndRenderEventHistory();
            this._stopTrafficPolling();
        } else if (tab === 'apis') {
            this.fetchAndRenderApisStatus();
            this._stopTrafficPolling();
        } else if (tab === 'infra') {
            this.setInfraTab(activeInfraTab);
            this._stopTrafficPolling();
        } else if (tab === 'network') {
            this.fetchAndRenderNetworkStatus();
            this._startTrafficPolling();
        } else {
            this.renderGnewServicesStatus();
            this._stopTrafficPolling();
        }
    },

    setInfraTab(subTab) {
        console.log('📊 [MONITORING] setInfraTab called with:', subTab);
        activeInfraTab = subTab;
        
        const tabSwitches = document.getElementById('tab-infra-switches');
        const tabRouters = document.getElementById('tab-infra-routers');
        const tabNas = document.getElementById('tab-infra-nas');
        const tabCameras = document.getElementById('tab-infra-cameras');
        const tabServers = document.getElementById('tab-infra-servers');
        if (tabSwitches) tabSwitches.classList.toggle('active', subTab === 'switches');
        if (tabRouters) tabRouters.classList.toggle('active', subTab === 'routers');
        if (tabNas) tabNas.classList.toggle('active', subTab === 'nas');
        if (tabCameras) tabCameras.classList.toggle('active', subTab === 'cameras');
        if (tabServers) tabServers.classList.toggle('active', subTab === 'servers');

        const contentSwitches = document.getElementById('infra-tab-content-switches');
        const contentRouters = document.getElementById('infra-tab-content-routers');
        const contentNas = document.getElementById('infra-tab-content-nas');
        const contentCameras = document.getElementById('infra-tab-content-cameras');
        const contentServers = document.getElementById('infra-tab-content-servers');
        if (contentSwitches) {
            contentSwitches.classList.toggle('hidden', subTab !== 'switches');
            contentSwitches.classList.toggle('active', subTab === 'switches');
        }
        if (contentRouters) {
            contentRouters.classList.toggle('hidden', subTab !== 'routers');
            contentRouters.classList.toggle('active', subTab === 'routers');
        }
        if (contentNas) {
            contentNas.classList.toggle('hidden', subTab !== 'nas');
            contentNas.classList.toggle('active', subTab === 'nas');
        }
        if (contentCameras) {
            contentCameras.classList.toggle('hidden', subTab !== 'cameras');
            contentCameras.classList.toggle('active', subTab === 'cameras');
        }
        if (contentServers) {
            contentServers.classList.toggle('hidden', subTab !== 'servers');
            contentServers.classList.toggle('active', subTab === 'servers');
        }

        if (subTab === 'switches') {
            this.fetchAndRenderSwitchesStatus();
        } else if (subTab === 'routers') {
            this.fetchAndRenderRoutersStatus();
        } else if (subTab === 'nas') {
            this.fetchAndRenderNasStatus();
        } else if (subTab === 'cameras') {
            this.fetchAndRenderCamerasStatus();
        } else if (subTab === 'servers') {
            this.fetchAndRenderServersStatus();
        }
    },

    render() {
        if (activeTab === 'alerts') {
            this.renderGnewServicesStatus();
        } else if (activeTab === 'events') {
            this.fetchAndRenderEventHistory();
        } else if (activeTab === 'apis') {
            this.fetchAndRenderApisStatus();
        } else if (activeTab === 'infra') {
            if (activeInfraTab === 'switches') {
                this.fetchAndRenderSwitchesStatus();
            } else if (activeInfraTab === 'routers') {
                this.fetchAndRenderRoutersStatus();
            } else if (activeInfraTab === 'nas') {
                this.fetchAndRenderNasStatus();
            } else if (activeInfraTab === 'cameras') {
                this.fetchAndRenderCamerasStatus();
            } else if (activeInfraTab === 'servers') {
                this.fetchAndRenderServersStatus();
            }
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

        const services = (gnewDiagData && gnewDiagData.servicos && Array.isArray(gnewDiagData.servicos.servicos))
            ? gnewDiagData.servicos.servicos
            : [];

        const apis = apisStatusData || [];
        const switches = switchesStatusData || [];
        const routers = routersStatusData || [];
        const nasDevices = nasStatusData || [];
        const cameras = camerasStatusData || [];
        const servers = serversStatusData || [];

        if (services.length === 0 && apis.length === 0 && switches.length === 0 && routers.length === 0 && nasDevices.length === 0 && cameras.length === 0 && servers.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de monitoramento disponível.</p>
                    <p style="font-size: 0.85rem;">Aguardando carga dos serviços do PABX, das APIs integradas ou da infraestrutura...</p>
                </div>
            `;
            return;
        }

        const total = services.length + apis.length + switches.length + routers.length + nasDevices.length + cameras.length + servers.length;
        const offlineServices = services.filter(s => s.status !== 'active' && s.status_label !== 'ativo').length;
        const offlineApis = apis.filter(a => !a.online || a.status === 'warning').length;
        const offlineSwitches = switches.filter(s => !s.online).length;
        const offlineRouters = routers.filter(r => !r.online).length;
        const offlineNas = nasDevices.filter(n => !n.online).length;
        const offlineCameras = cameras.filter(c => !c.online).length;
        const offlineServers = servers.filter(s => !s.online).length;
        const offline = offlineServices + offlineApis + offlineSwitches + offlineRouters + offlineNas + offlineCameras + offlineServers;
        const online = total - offline;

        // Update KPIs
        const totalEl = document.getElementById('monitor-kpi-total');
        const warningEl = document.getElementById('monitor-kpi-warning');
        const infoEl = document.getElementById('monitor-kpi-info');
        if (totalEl) totalEl.textContent = total;
        if (warningEl) warningEl.textContent = offline;
        if (infoEl) infoEl.textContent = online;

        // Filter out by search query if search is active
        const searchInput = document.getElementById('monitoring-search-input');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        let filteredServices = services;
        let filteredApis = apis;
        let filteredSwitches = switches;
        let filteredRouters = routers;
        let filteredNas = nasDevices;
        let filteredCameras = cameras;
        let filteredServers = servers;

        if (query) {
            filteredServices = services.filter(s => s.nome.toLowerCase().includes(query));
            filteredApis = apis.filter(a => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query));
            filteredSwitches = switches.filter(s => s.name.toLowerCase().includes(query) || s.ip.toLowerCase().includes(query));
            filteredRouters = routers.filter(r => r.name.toLowerCase().includes(query) || r.ip.toLowerCase().includes(query));
            filteredNas = nasDevices.filter(n => n.name.toLowerCase().includes(query) || n.ip.toLowerCase().includes(query));
            filteredCameras = cameras.filter(c => c.name.toLowerCase().includes(query) || c.ip.toLowerCase().includes(query));
            filteredServers = servers.filter(s => s.name.toLowerCase().includes(query) || s.ip.toLowerCase().includes(query));
        }

        let html = `
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço / API / Infraestrutura</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
        `;

        let rowIdx = 0;

        // Serviços Gnew
        filteredServices.forEach(svc => {
            const isAtivo = svc.status === 'active' || svc.status_label === 'ativo';
            const dotColor = isAtivo ? '#10b981' : '#ef4444';
            const statusLabel = isAtivo ? 'Online' : (svc.status_label || svc.status || 'Offline');
            const badgeBg = isAtivo ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)';
            const badgeColor = isAtivo ? '#6ee7b7' : '#fca5a5';
            const badgeBorder = isAtivo ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem;">[Serviço PABX] ${svc.nome}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        // APIs Integradas
        filteredApis.forEach(api => {
            let dotColor = '#10b981';
            let statusLabel = 'Online';
            let badgeBg = 'rgba(16,185,129,0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16,185,129,0.3)';

            if (api.status === 'warning') {
                dotColor = '#f59e0b';
                statusLabel = 'Alerta';
                badgeBg = 'rgba(245,158,11,0.12)';
                badgeColor = '#fde047';
                badgeBorder = 'rgba(245,158,11,0.3)';
            } else if (api.status === 'offline' || !api.online) {
                dotColor = '#ef4444';
                statusLabel = 'Offline';
                badgeBg = 'rgba(239,68,68,0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239,68,68,0.3)';
            }

            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:var(--accent);">[API] ${api.name}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        // Infraestrutura (Switches)
        filteredSwitches.forEach(sw => {
            let dotColor = '#10b981';
            let statusLabel = 'Online';
            let badgeBg = 'rgba(16,185,129,0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16,185,129,0.3)';

            if (sw.online === null) {
                dotColor = '#94a3b8';
                statusLabel = 'Aguardando...';
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
            } else if (!sw.online) {
                dotColor = '#ef4444';
                statusLabel = 'Offline';
                badgeBg = 'rgba(239,68,68,0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239,68,68,0.3)';
            }

            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#38bdf8;">[Switch] ${sw.name} (${sw.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        // Infraestrutura (Routers)
        filteredRouters.forEach(rt => {
            let dotColor = '#10b981';
            let statusLabel = 'Online';
            let badgeBg = 'rgba(16,185,129,0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16,185,129,0.3)';

            if (rt.online === null) {
                dotColor = '#94a3b8';
                statusLabel = 'Aguardando...';
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
            } else if (!rt.online) {
                dotColor = '#ef4444';
                statusLabel = 'Offline';
                badgeBg = 'rgba(239,68,68,0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239,68,68,0.3)';
            }

            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f43f5e;">[Roteador] ${rt.name} (${rt.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        // Infraestrutura (NAS)
        filteredNas.forEach(nas => {
            let dotColor = '#10b981';
            let statusLabel = 'Online';
            let badgeBg = 'rgba(16, 185, 129, 0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';

            if (nas.online === null) {
                dotColor = '#94a3b8';
                statusLabel = 'Aguardando...';
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
            } else if (!nas.online) {
                dotColor = '#ef4444';
                statusLabel = 'Offline';
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239, 68, 68, 0.3)';
            }

            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f97316;">[NAS] ${nas.name} (${nas.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        // Infraestrutura (Cameras)
        filteredCameras.forEach(cam => {
            let dotColor = '#10b981';
            let statusLabel = 'Online';
            let badgeBg = 'rgba(16, 185, 129, 0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';

            if (cam.online === null) {
                dotColor = '#94a3b8';
                statusLabel = 'Aguardando...';
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
            } else if (!cam.online) {
                dotColor = '#ef4444';
                statusLabel = 'Offline';
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239, 68, 68, 0.3)';
            }

            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#10b981;">[Câmera] ${cam.name} (${cam.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        // Infraestrutura (Servidores)
        filteredServers.forEach(srv => {
            let dotColor = '#10b981';
            let statusLabel = 'Online';
            let badgeBg = 'rgba(16, 185, 129, 0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';

            if (srv.online === null) {
                dotColor = '#94a3b8';
                statusLabel = 'Aguardando...';
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
            } else if (!srv.online) {
                dotColor = '#ef4444';
                statusLabel = 'Offline';
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239, 68, 68, 0.3)';
            }

            const rowBg = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)';
            rowIdx++;

            html += `
                <div class="monitor-list-row" style="background: ${rowBg};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${dotColor};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#6366f1;">[Servidor] ${srv.name} (${srv.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                    </div>
                </div>`;
        });

        html += `</div>`;
        grid.innerHTML = html;
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
            // Busca filtrada e paginada diretamente no backend
            const queryParams = new URLSearchParams({
                page: eventsCurrentPage,
                limit: PAGE_SIZE,
                search: eventsSearchQuery || '',
                severity: eventsFilterSeverity || 'all',
                startDate: eventsFilterDateStart || '',
                endDate: eventsFilterDateEnd || ''
            });

            const response = await apiClient.get(`/monitoring/events?${queryParams.toString()}`);
            
            const events = response.events || [];
            eventsTotalFiltered = response.total || 0;
            const totalPages = response.totalPages || 1;

            if (eventsCurrentPage > totalPages) eventsCurrentPage = totalPages;

            // --- Badge de contagem ---
            const countEl = document.getElementById('event-history-count');
            if (countEl) {
                countEl.textContent = eventsTotalFiltered > 0 ? eventsTotalFiltered : '';
                countEl.style.display = eventsTotalFiltered > 0 ? 'inline-flex' : 'none';
            }

            // Renderiza a lista e a paginação
            this.renderEvents(events);
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
            // Buscas em paralelo para otimizar latência de carregamento
            const [resDiag, resApis, resSwitches, resRouters, resNas, resCameras, resServers] = await Promise.all([
                apiClient.get('/monitoring/diagnostico?t=' + Date.now()),
                apiClient.get('/monitoring/apis-status?t=' + Date.now()),
                apiClient.get('/monitoring/switches?t=' + Date.now()),
                apiClient.get('/monitoring/routers?t=' + Date.now()),
                apiClient.get('/monitoring/nas?t=' + Date.now()),
                apiClient.get('/monitoring/cameras?t=' + Date.now()),
                apiClient.get('/monitoring/servers?t=' + Date.now())
            ]);
            
            const isOnline = resDiag && resDiag.status === 'online';
            this.updateGnewApiStatus(isOnline, isOnline ? 'Gnew Online' : 'Gnew Offline (Contingência)', resDiag ? resDiag.message : '');
            
            if (resDiag && resDiag.data) {
                gnewDiagData = resDiag.data;
                this.renderGnewDiagnostics();
            } else {
                throw new Error("Dados inválidos na resposta da API.");
            }

            if (resApis && resApis.success && Array.isArray(resApis.apis)) {
                apisStatusData = resApis.apis;
            }

            if (resSwitches && resSwitches.success && Array.isArray(resSwitches.switches)) {
                switchesStatusData = resSwitches.switches;
            }

            if (resRouters && resRouters.success && Array.isArray(resRouters.routers)) {
                routersStatusData = resRouters.routers;
            }

            if (resNas && resNas.success && Array.isArray(resNas.nas)) {
                nasStatusData = resNas.nas;
            }

            if (resCameras && resCameras.success && Array.isArray(resCameras.cameras)) {
                camerasStatusData = resCameras.cameras;
            }

            if (resServers && resServers.success && Array.isArray(resServers.servers)) {
                serversStatusData = resServers.servers;
            }
            
            // Se estiver na aba de Alertas Ativos, re-renderiza para atualizar
            if (activeTab === 'alerts') {
                this.renderGnewServicesStatus();
            }
        } catch (err) {
            console.error('Erro ao buscar dados de monitoramento:', err);
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
    },

    async clearEventHistoryByPeriod() {
        const btn = document.getElementById('btn-clear-event-history');
        const input = prompt(
            "Limpar histórico de eventos por período:\n\n" +
            "Digite a quantidade de dias que deseja MANTER no histórico (ex: 7, 30, 90, 365).\n" +
            "Todos os eventos mais antigos que esse período serão apagados permanentemente do banco.\n\n" +
            "Quantidade de dias a MANTER:", 
            "30"
        );

        if (input === null) return; // Cancelado pelo usuário

        const days = parseInt(input.trim(), 10);
        if (isNaN(days) || days < 0) {
            alert("Por favor, digite um número inteiro de dias válido (ex: 30).");
            return;
        }

        try {
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Limpando...';
            }
            await fetch(`/api/monitoring/events?days=${days}`, { method: 'DELETE' });
            await this.fetchAndRenderEventHistory();
            alert(`Limpeza realizada! Eventos com mais de ${days} dias foram excluídos.`);
        } catch (err) {
            console.error('Erro ao limpar histórico por período:', err);
            alert('Erro ao limpar o histórico. Tente novamente.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Limpar Histórico';
            }
        }
    },

    async clearEventHistory() {
        const clearBtn = document.getElementById('btn-delete-all-event-history');
        if (!confirm('Tem certeza que deseja apagar permanentemente todo o histórico de eventos? Esta ação não pode ser desfeita.')) return;

        try {
            if (clearBtn) {
                clearBtn.disabled = true;
                clearBtn.textContent = 'Apagando...';
            }
            await fetch('/api/monitoring/events', { method: 'DELETE' });
            await this.fetchAndRenderEventHistory();

            const countEl = document.getElementById('event-history-count');
            if (countEl) countEl.style.display = 'none';
        } catch (err) {
            console.error('Erro ao apagar histórico:', err);
            alert('Erro ao apagar o histórico. Tente novamente.');
        } finally {
            if (clearBtn) {
                clearBtn.disabled = false;
                clearBtn.textContent = 'Apagar Tudo';
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
            const res = await apiClient.get('/monitoring/apis-status?refresh=true&t=' + Date.now());
            if (res && res.success && Array.isArray(res.apis)) {
                apisStatusData = res.apis;
                
                // Se a aba de Alertas Ativos estiver visível, atualiza ela também
                if (activeTab === 'alerts') {
                    this.renderGnewServicesStatus();
                }

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
            let badgeClass = 'online';
            let badgeBg = 'rgba(16, 185, 129, 0.1)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = '#10b981';
            let badgeText = 'Online';

            if (api.status === 'warning') {
                badgeClass = 'warning';
                badgeBg = 'rgba(245, 158, 11, 0.1)';
                badgeColor = '#fde047';
                badgeBorder = '#f59e0b';
                badgeText = 'Alerta';
            } else if (api.status === 'offline' || !api.online) {
                badgeClass = 'offline';
                badgeBg = 'rgba(239, 68, 68, 0.1)';
                badgeColor = '#fca5a5';
                badgeBorder = '#ef4444';
                badgeText = 'Offline';
            }

            const latencyColor = api.latency < 500 ? '#6ee7b7' : api.latency < 2000 ? '#fde047' : '#fca5a5';

            return `
                <div class="api-status-card glass" data-api-id="${api.id}">
                    <div class="api-card-header">
                        <div class="api-info-meta">
                            <span class="api-type-tag">${api.type}</span>
                            <h4 class="api-name">${api.name}</h4>
                        </div>
                        <span class="api-badge ${badgeClass}" style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                            <span class="status-dot"></span>
                            ${badgeText}
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
    },

    async fetchAndRenderNetworkStatus(forceRefresh = false) {
        const btn = document.getElementById('btn-refresh-network-status');
        let svg = null;
        if (btn) {
            svg = btn.querySelector('svg');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            if (svg) svg.style.animation = 'spin 0.8s linear infinite';
        }

        try {
            const url = `/monitoring/pfsense${forceRefresh ? '?refresh=true' : ''}`;
            const res = await apiClient.get(url);
            if (res && res.success && res.data) {
                const info = res.data;
                
                // Toggle simulation badge — diferencia "mock" intencional de "fallback" por erro
                const sourceBadge = document.getElementById('network-source-badge');
                const badge = document.getElementById('network-simulation-badge');
                if (badge) {
                    if (!info.isSimulated) {
                        // Dados reais do pfSense
                        badge.style.display = 'none';
                        if (sourceBadge) {
                            sourceBadge.style.display = 'inline-block';
                            sourceBadge.textContent = '🛡️ pfSense API';
                            sourceBadge.style.background = 'rgba(16, 185, 129, 0.1)';
                            sourceBadge.style.color = '#6ee7b7';
                            sourceBadge.style.border = '1px solid rgba(16, 185, 129, 0.25)';
                        }
                    } else {
                        if (sourceBadge) sourceBadge.style.display = 'none';
                        if (info.isSimulated === 'mock') {
                            // Mock ativado intencionalmente via PFSENSE_MOCK=true
                            badge.style.display = 'inline-block';
                            badge.textContent = '⚠️ Modo Simulação (PFSENSE_MOCK=true)';
                            badge.style.background = 'rgba(245, 158, 11, 0.12)';
                            badge.style.color = '#fde047';
                            badge.style.border = '1px solid rgba(245, 158, 11, 0.3)';
                        } else {
                            // Fallback por erro — pfSense inacessível
                            badge.style.display = 'inline-block';
                            badge.textContent = '🔴 pfSense Inacessível — Dados Estimados';
                            badge.style.background = 'rgba(239, 68, 68, 0.10)';
                            badge.style.color = '#fca5a5';
                            badge.style.border = '1px solid rgba(239, 68, 68, 0.25)';
                        }
                    }
                }
                
                // Update CPU Usage
                const cpuText = document.getElementById('network-kpi-cpu-text');
                const cpuBar = document.getElementById('network-kpi-cpu-bar');
                const loadAvgText = document.getElementById('network-kpi-load-average');
                if (cpuText) cpuText.textContent = `${info.cpu_usage}%`;
                if (cpuBar) cpuBar.style.width = `${info.cpu_usage}%`;
                if (loadAvgText) loadAvgText.textContent = `Load Average: ${info.load_average}`;

                // Update Memory Usage
                const memText = document.getElementById('network-kpi-mem-text');
                const memBar = document.getElementById('network-kpi-mem-bar');
                if (memText) memText.textContent = `${info.memory_usage}%`;
                if (memBar) memBar.style.width = `${info.memory_usage}%`;

                // Update Uptime
                const uptimeText = document.getElementById('network-kpi-uptime-text');
                if (uptimeText) uptimeText.textContent = info.uptime || 'Desconhecido';

                // Update Active Links
                const cableLinkText = document.getElementById('network-kpi-main-cable');
                const wifiLinkText = document.getElementById('network-kpi-main-wifi');
                if (cableLinkText) cableLinkText.textContent = info.main_cable_link || 'Sem Conexão';
                if (wifiLinkText) wifiLinkText.textContent = info.main_wifi_link || 'Sem Conexão';

                // Render Gateways
                this.renderNetworkGateways(info.gateways);

                // Render Interfaces
                this.renderNetworkInterfaces(info.interfaces);

                // Render DNS
                this.renderNetworkDns(info.dns_servers);
            } else {
                throw new Error(res.error || 'Falha ao processar dados do pfSense.');
            }
        } catch (err) {
            console.error('Erro ao buscar status da rede pfSense:', err);
            
            // Toggle simulation badge to show Offline
            const sourceBadge = document.getElementById('network-source-badge');
            if (sourceBadge) sourceBadge.style.display = 'none';
            const badge = document.getElementById('network-simulation-badge');
            if (badge) {
                badge.style.display = 'inline-block';
                badge.textContent = '🔴 pfSense Inacessível — Sem Conexão';
                badge.style.background = 'rgba(239, 68, 68, 0.10)';
                badge.style.color = '#fca5a5';
                badge.style.border = '1px solid rgba(239, 68, 68, 0.25)';
            }

            // Set KPI texts to error/unavailable
            const cpuText = document.getElementById('network-kpi-cpu-text');
            const cpuBar = document.getElementById('network-kpi-cpu-bar');
            const loadAvgText = document.getElementById('network-kpi-load-average');
            if (cpuText) cpuText.textContent = 'Erro';
            if (cpuBar) cpuBar.style.width = '0%';
            if (loadAvgText) loadAvgText.textContent = 'Falha na conexão';

            const memText = document.getElementById('network-kpi-mem-text');
            const memBar = document.getElementById('network-kpi-mem-bar');
            if (memText) memText.textContent = 'Erro';
            if (memBar) memBar.style.width = '0%';

            const uptimeText = document.getElementById('network-kpi-uptime-text');
            if (uptimeText) uptimeText.textContent = 'Indisponível (Sem conexão)';

            const gatewaysContainer = document.getElementById('network-gateways-container');
            if (gatewaysContainer) {
                gatewaysContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                        <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status dos Gateways</p>
                        <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${err.message}</p>
                    </div>
                `;
            }
            const interfacesTbody = document.getElementById('network-interfaces-tbody');
            if (interfacesTbody) {
                interfacesTbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 2rem; color: #fca5a5;">
                            Erro ao carregar interfaces: ${err.message}
                        </td>
                    </tr>
                `;
            }
            const dnsContainer = document.getElementById('network-dns-container');
            if (dnsContainer) {
                dnsContainer.innerHTML = `
                    <div style="color: #fca5a5; font-size: 0.85rem; text-align: center; padding: 1rem;">
                        Erro ao carregar DNS
                    </div>
                `;
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.cursor = 'pointer';
                if (svg) svg.style.animation = '';
            }
        }
    },

    renderNetworkGateways(gateways) {
        const container = document.getElementById('network-gateways-container');
        if (!container) return;

        if (!gateways || gateways.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; background: var(--card-bg); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    Nenhum gateway detectado.
                </div>
            `;
            return;
        }

        container.innerHTML = gateways.map(gw => {
            let statusBadgeClass = 'online';
            let statusBorderColor = '#10b981';
            let statusBadgeStyle = 'background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid #10b981;';
            
            const isOnline = gw.status.toLowerCase().includes('online');
            const isWarning = gw.status.toLowerCase().includes('warning') || gw.status.toLowerCase().includes('loss') || gw.status.toLowerCase().includes('high');
            
            if (isWarning) {
                statusBadgeClass = 'warning';
                statusBorderColor = '#f59e0b';
                statusBadgeStyle = 'background: rgba(245, 158, 11, 0.1); color: #fde047; border: 1px solid #f59e0b;';
            } else if (!isOnline) {
                statusBadgeClass = 'offline';
                statusBorderColor = '#ef4444';
                statusBadgeStyle = 'background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid #ef4444;';
            }

            const lossPercent = parseFloat(gw.loss) || 0;
            const lossColor = lossPercent > 5 ? '#fca5a5' : lossPercent > 0 ? '#fde047' : 'var(--text-main)';

            return `
                <div class="kpi-card" style="display: flex; flex-direction: column; gap: 12px; padding: 1.25rem; border-left: 4px solid ${statusBorderColor}; position: relative; background: var(--card-bg); border-radius: var(--border-radius); border-top: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${gw.name}</span>
                        <span class="api-badge ${statusBadgeClass}" style="${statusBadgeStyle} display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot"></span>
                            ${gw.status}
                        </span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">IP: ${gw.ip}</div>
                    <div style="display: flex; gap: 15px; margin-top: 5px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.04);">
                            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Latência (RTT)</div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); font-family: monospace;">${gw.rtt}</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.04);">
                            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Perda</div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: ${lossColor}; font-family: monospace;">${gw.loss}</div>
                        </div>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); text-align: right; margin-top: 2px;">RTTsd: ${gw.rttsd}</div>
                </div>
            `;
        }).join('');
    },

    renderNetworkInterfaces(interfaces) {
        const tbody = document.getElementById('network-interfaces-tbody');
        if (!tbody) return;

        if (!interfaces || interfaces.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhuma interface de rede detectada.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = interfaces.map(iface => {
            const isUp = iface.status === 'up';
            const badgeClass = isUp ? 'online' : 'offline';
            const badgeStyle = isUp 
                ? 'background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid #10b981;' 
                : 'background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid #ef4444;';
            const badgeText = isUp ? 'UP' : 'DOWN';

            return `
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${iface.name} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; font-family: monospace;">(${iface.interface})</span></td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${iface.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${iface.speed}</td>
                    <td style="padding: 12px; text-align: right;">
                        <span class="api-badge ${badgeClass}" style="${badgeStyle} display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot"></span>
                            ${badgeText}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderNetworkDns(dnsServers) {
        const container = document.getElementById('network-dns-container');
        if (!container) return;

        if (!dnsServers || dnsServers.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 1rem; color: var(--text-muted); font-style: italic;">
                    Nenhum servidor DNS listado.
                </div>
            `;
            return;
        }

        container.innerHTML = dnsServers.map(dns => {
            return `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent); flex-shrink: 0;">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="2" x2="12" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                    </svg>
                    <span style="font-family: monospace; font-size: 0.9rem; color: var(--text-main); font-weight: 600;">${dns}</span>
                </div>
            `;
        }).join('');
    },

    async fetchAndRenderSwitchesStatus(forceRefresh = false, sequential = false) {
        const switchesAutoRefreshChk = document.getElementById('switches-auto-refresh');
        const isSequential = sequential || (switchesAutoRefreshChk && switchesAutoRefreshChk.checked);

        const tbody = document.getElementById('monitoring-switches-tbody');
        if (!tbody) return;

        const btn = document.getElementById('btn-refresh-switches-status');
        let svg = null;
        if (btn) {
            svg = btn.querySelector('svg');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            if (svg) svg.style.animation = 'spin 0.8s linear infinite';
        }

        try {
            if (isSequential) {
                // Step 1: Fetch raw list of switches without pings
                const res = await apiClient.get(`/monitoring/switches?ping=false&refresh=${forceRefresh}&t=${Date.now()}`);
                if (res && res.success && Array.isArray(res.switches)) {
                    // Render the table with all switches in pending/previous state
                    this.renderSwitchesTable(res.switches);

                    // Step 2: Show sync icon on all rows
                    res.switches.forEach(sw => {
                        const row = document.getElementById(`switch-row-${sw.id}`);
                        if (row) {
                            const indicator = row.querySelector('.switch-sync-indicator');
                            if (indicator) {
                                indicator.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `;
                            }
                        }
                    });

                    // Step 3: Sequential pinging
                    isPingingSequentially = true;
                    for (const sw of res.switches) {
                        // If user changed tab, we stop
                        if (activeTab !== 'infra') break;

                        const row = document.getElementById(`switch-row-${sw.id}`);
                        if (row) {
                            // Make this switch spinner spin
                            const indicator = row.querySelector('.switch-sync-indicator');
                            if (indicator) {
                                indicator.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `;
                            }
                        }

                        try {
                            const pingRes = await apiClient.get(`/monitoring/switches/${sw.id}/ping?t=${Date.now()}`);
                            if (pingRes && pingRes.success && pingRes.switch) {
                                // Update this row
                                const updatedSw = pingRes.switch;
                                const swRow = document.getElementById(`switch-row-${updatedSw.id}`);
                                if (swRow) {
                                    let badgeBg = 'rgba(16, 185, 129, 0.12)';
                                    let badgeColor = '#6ee7b7';
                                    let badgeBorder = 'rgba(16, 185, 129, 0.3)';
                                    let statusLabel = 'Online';

                                    if (!updatedSw.online) {
                                        badgeBg = 'rgba(239, 68, 68, 0.12)';
                                        badgeColor = '#fca5a5';
                                        badgeBorder = 'rgba(239, 68, 68, 0.3)';
                                        statusLabel = 'Offline';
                                    }

                                    const latencyColor = updatedSw.latency < 50 ? '#6ee7b7' : updatedSw.latency < 150 ? '#fde047' : '#fca5a5';
                                    const latencyText = updatedSw.online ? `${updatedSw.latency}ms` : '-';

                                    const badgeContainer = swRow.querySelector('.monitor-badge');
                                    if (badgeContainer) {
                                        badgeContainer.style.background = badgeBg;
                                        badgeContainer.style.color = badgeColor;
                                        badgeContainer.style.borderColor = badgeBorder;
                                        badgeContainer.textContent = statusLabel;
                                    }

                                    const latencyContainer = swRow.querySelector('.switch-latency');
                                    if (latencyContainer) {
                                        latencyContainer.style.color = latencyColor;
                                        latencyContainer.textContent = latencyText;
                                    }

                                    // Clear sync icon with visual confirmation tick
                                    const indicator = swRow.querySelector('.switch-sync-indicator');
                                    if (indicator) {
                                        indicator.innerHTML = `
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `;
                                        setTimeout(() => {
                                            if (indicator.querySelector('polyline')) {
                                                indicator.innerHTML = '';
                                            }
                                        }, 3000);
                                    }
                                }
                            }
                        } catch (pingErr) {
                            console.error(`Erro ao pingar switch ${sw.name}:`, pingErr);
                            const swRow = document.getElementById(`switch-row-${sw.id}`);
                            if (swRow) {
                                const badgeContainer = swRow.querySelector('.monitor-badge');
                                if (badgeContainer) {
                                    badgeContainer.style.background = 'rgba(239, 68, 68, 0.12)';
                                    badgeContainer.style.color = '#fca5a5';
                                    badgeContainer.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    badgeContainer.textContent = 'Erro';
                                }
                                const indicator = swRow.querySelector('.switch-sync-indicator');
                                if (indicator) indicator.innerHTML = '';
                            }
                        }
                    }
                    isPingingSequentially = false;
                } else {
                    throw new Error("Resposta inválida do servidor.");
                }
            } else {
                // Load all at once on backend
                const url = `/monitoring/switches?refresh=${forceRefresh}&t=${Date.now()}`;
                const res = await apiClient.get(url);
                if (res && res.success && Array.isArray(res.switches)) {
                    this.renderSwitchesTable(res.switches);
                } else {
                    throw new Error("Resposta inválida do servidor.");
                }
            }
        } catch (err) {
            console.error('Erro ao buscar status dos switches:', err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos switches</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${err.message}</p>
                    </td>
                </tr>
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

    renderSwitchesTable(switches) {
        const tbody = document.getElementById('monitoring-switches-tbody');
        if (!tbody) return;

        if (switches.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum switch encontrado.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = switches.map(sw => {
            let badgeBg = 'rgba(16, 185, 129, 0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';
            let statusLabel = 'Online';

            if (sw.online === null) {
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
                statusLabel = 'Aguardando...';
            } else if (!sw.online) {
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239, 68, 68, 0.3)';
                statusLabel = 'Offline';
            }

            const latencyColor = sw.online ? (sw.latency < 50 ? '#6ee7b7' : sw.latency < 150 ? '#fde047' : '#fca5a5') : 'var(--text-muted)';
            const latencyText = sw.online ? `${sw.latency}ms` : '-';

            return `
                <tr id="switch-row-${sw.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${sw.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">
                        ${sw.ip}
                        <span title="Dados cadastrais importados do Lansweeper" style="background: rgba(59, 130, 246, 0.08); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; margin-left: 6px; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📦 Lansweeper</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${sw.model || '-'}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${sw.location || '-'}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                            <span title="Status verificado via Ping ICMP Real" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📡 Ping ICMP</span>
                            <span class="switch-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="switch-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${latencyColor};">${latencyText}</td>
                </tr>
            `;
        }).join('');
    },

    async fetchAndRenderRoutersStatus(forceRefresh = false, sequential = false) {
        console.log('📊 [MONITORING] fetchAndRenderRoutersStatus called. forceRefresh:', forceRefresh, 'sequential:', sequential);
        const routersAutoRefreshChk = document.getElementById('routers-auto-refresh');
        const isSequential = sequential || (routersAutoRefreshChk && routersAutoRefreshChk.checked);

        const tbody = document.getElementById('monitoring-routers-tbody');
        if (!tbody) {
            console.error('📊 [MONITORING] Element #monitoring-routers-tbody not found in DOM!');
            return;
        }

        const btn = document.getElementById('btn-refresh-routers-status');
        let svg = null;
        if (btn) {
            svg = btn.querySelector('svg');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            if (svg) svg.style.animation = 'spin 0.8s linear infinite';
        }

        try {
            console.log('📊 [MONITORING] Fetching routers, sequential mode:', isSequential);
            if (isSequential) {
                // Step 1: Fetch raw list of routers without pings
                const res = await apiClient.get(`/monitoring/routers?ping=false&refresh=${forceRefresh}&t=${Date.now()}`);
                if (res && res.success && Array.isArray(res.routers)) {
                    // Render the table with all routers in pending/previous state
                    this.renderRoutersTable(res.routers);

                    // Step 2: Show sync icon on all rows
                    res.routers.forEach(rt => {
                        const row = document.getElementById(`router-row-${rt.id}`);
                        if (row) {
                            const indicator = row.querySelector('.router-sync-indicator');
                            if (indicator) {
                                indicator.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `;
                            }
                        }
                    });

                    // Step 3: Sequential pinging
                    isPingingSequentially = true;
                    for (const rt of res.routers) {
                        // If user changed tab or subtab, we stop
                        if (activeTab !== 'infra' || activeInfraTab !== 'routers') break;

                        const row = document.getElementById(`router-row-${rt.id}`);
                        if (row) {
                            // Make this router spinner spin
                            const indicator = row.querySelector('.router-sync-indicator');
                            if (indicator) {
                                indicator.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `;
                            }
                        }

                        try {
                            const pingRes = await apiClient.get(`/monitoring/routers/${rt.id}/ping?t=${Date.now()}`);
                            if (pingRes && pingRes.success && pingRes.router) {
                                // Update this row
                                const updatedRt = pingRes.router;
                                const rtRow = document.getElementById(`router-row-${updatedRt.id}`);
                                if (rtRow) {
                                    let badgeBg = 'rgba(16, 185, 129, 0.12)';
                                    let badgeColor = '#6ee7b7';
                                    let badgeBorder = 'rgba(16, 185, 129, 0.3)';
                                    let statusLabel = 'Online';

                                    if (!updatedRt.online) {
                                        badgeBg = 'rgba(239, 68, 68, 0.12)';
                                        badgeColor = '#fca5a5';
                                        badgeBorder = 'rgba(239, 68, 68, 0.3)';
                                        statusLabel = 'Offline';
                                    }

                                    const latencyColor = updatedRt.latency < 50 ? '#6ee7b7' : updatedRt.latency < 150 ? '#fde047' : '#fca5a5';
                                    const latencyText = updatedRt.online ? `${updatedRt.latency}ms` : '-';

                                    const badgeContainer = rtRow.querySelector('.monitor-badge');
                                    if (badgeContainer) {
                                        badgeContainer.style.background = badgeBg;
                                        badgeContainer.style.color = badgeColor;
                                        badgeContainer.style.borderColor = badgeBorder;
                                        badgeContainer.textContent = statusLabel;
                                    }

                                    const latencyContainer = rtRow.querySelector('.router-latency');
                                    if (latencyContainer) {
                                        latencyContainer.style.color = latencyColor;
                                        latencyContainer.textContent = latencyText;
                                    }

                                    // Clear sync icon with visual confirmation tick
                                    const indicator = rtRow.querySelector('.router-sync-indicator');
                                    if (indicator) {
                                        indicator.innerHTML = `
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `;
                                        setTimeout(() => {
                                            if (indicator.querySelector('polyline')) {
                                                indicator.innerHTML = '';
                                            }
                                        }, 3000);
                                    }
                                }
                            }
                        } catch (pingErr) {
                            console.error(`Erro ao pingar roteador ${rt.name}:`, pingErr);
                            const rtRow = document.getElementById(`router-row-${rt.id}`);
                            if (rtRow) {
                                const badgeContainer = rtRow.querySelector('.monitor-badge');
                                if (badgeContainer) {
                                    badgeContainer.style.background = 'rgba(239, 68, 68, 0.12)';
                                    badgeContainer.style.color = '#fca5a5';
                                    badgeContainer.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    badgeContainer.textContent = 'Erro';
                                }
                                const indicator = rtRow.querySelector('.router-sync-indicator');
                                if (indicator) indicator.innerHTML = '';
                            }
                        }
                    }
                    isPingingSequentially = false;
                } else {
                    throw new Error("Resposta inválida do servidor.");
                }
            } else {
                // Load all at once on backend
                const url = `/monitoring/routers?refresh=${forceRefresh}&t=${Date.now()}`;
                const res = await apiClient.get(url);
                if (res && res.success && Array.isArray(res.routers)) {
                    this.renderRoutersTable(res.routers);
                } else {
                    throw new Error("Resposta inválida do servidor.");
                }
            }
        } catch (err) {
            console.error('Erro ao buscar status dos roteadores:', err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos roteadores</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${err.message}</p>
                    </td>
                </tr>
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

    renderRoutersTable(routers) {
        const tbody = document.getElementById('monitoring-routers-tbody');
        if (!tbody) return;

        if (routers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum roteador encontrado.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = routers.map(rt => {
            let badgeBg = 'rgba(16, 185, 129, 0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';
            let statusLabel = 'Online';

            if (rt.online === null) {
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
                statusLabel = 'Aguardando...';
            } else if (!rt.online) {
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239, 68, 68, 0.3)';
                statusLabel = 'Offline';
            }

            const latencyColor = rt.online ? (rt.latency < 50 ? '#6ee7b7' : rt.latency < 150 ? '#fde047' : '#fca5a5') : 'var(--text-muted)';
            const latencyText = rt.online ? `${rt.latency}ms` : '-';

            return `
                <tr id="router-row-${rt.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${rt.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">
                        ${rt.ip}
                        <span title="Dados cadastrais importados do Lansweeper" style="background: rgba(59, 130, 246, 0.08); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; margin-left: 6px; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📦 Lansweeper</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${rt.model || '-'}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${rt.location || '-'}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                            <span title="Status verificado via Ping ICMP Real" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📡 Ping ICMP</span>
                            <span class="router-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="router-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${latencyColor};">${latencyText}</td>
                </tr>
            `;
        }).join('');
    },

    async fetchAndRenderNasStatus(forceRefresh = false, sequential = false) {
        console.log('📊 [MONITORING] fetchAndRenderNasStatus called. forceRefresh:', forceRefresh, 'sequential:', sequential);
        const nasAutoRefreshChk = document.getElementById('nas-auto-refresh');
        const isSequential = sequential || (nasAutoRefreshChk && nasAutoRefreshChk.checked);

        const tbody = document.getElementById('monitoring-nas-tbody');
        if (!tbody) {
            console.error('📊 [MONITORING] Element #monitoring-nas-tbody not found in DOM!');
            return;
        }

        const btn = document.getElementById('btn-refresh-nas-status');
        let svg = null;
        if (btn) {
            svg = btn.querySelector('svg');
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            if (svg) svg.style.animation = 'spin 0.8s linear infinite';
        }

        try {
            console.log('📊 [MONITORING] Fetching NAS devices, sequential mode:', isSequential);
            if (isSequential) {
                // Step 1: Fetch raw list of NAS without pings
                const res = await apiClient.get(`/monitoring/nas?ping=false&refresh=${forceRefresh}&t=${Date.now()}`);
                if (res && res.success && Array.isArray(res.nas)) {
                    // Render the table with all NAS in pending/previous state
                    this.renderNasTable(res.nas);

                    // Step 2: Show sync icon on all rows
                    res.nas.forEach(nas => {
                        const row = document.getElementById(`nas-row-${nas.id}`);
                        if (row) {
                            const indicator = row.querySelector('.nas-sync-indicator');
                            if (indicator) {
                                indicator.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `;
                            }
                        }
                    });

                    // Step 3: Sequential pinging
                    isPingingSequentially = true;
                    for (const nas of res.nas) {
                        // If user changed tab or subtab, we stop
                        if (activeTab !== 'infra' || activeInfraTab !== 'nas') break;

                        const row = document.getElementById(`nas-row-${nas.id}`);
                        if (row) {
                            // Make this NAS spinner spin
                            const indicator = row.querySelector('.nas-sync-indicator');
                            if (indicator) {
                                indicator.innerHTML = `
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `;
                            }
                        }

                        try {
                            const pingRes = await apiClient.get(`/monitoring/nas/${nas.id}/ping?t=${Date.now()}`);
                            if (pingRes && pingRes.success && pingRes.nas) {
                                // Update this row
                                const updatedNas = pingRes.nas;
                                const nasRow = document.getElementById(`nas-row-${updatedNas.id}`);
                                if (nasRow) {
                                    let badgeBg = 'rgba(16, 185, 129, 0.12)';
                                    let badgeColor = '#6ee7b7';
                                    let badgeBorder = 'rgba(16, 185, 129, 0.3)';
                                    let statusLabel = 'Online';

                                    if (!updatedNas.online) {
                                        badgeBg = 'rgba(239, 68, 68, 0.12)';
                                        badgeColor = '#fca5a5';
                                        badgeBorder = 'rgba(239, 68, 68, 0.3)';
                                        statusLabel = 'Offline';
                                    }

                                    const latencyColor = updatedNas.latency < 50 ? '#6ee7b7' : updatedNas.latency < 150 ? '#fde047' : '#fca5a5';
                                    const latencyText = updatedNas.online ? `${updatedNas.latency}ms` : '-';

                                    const badgeContainer = nasRow.querySelector('.monitor-badge');
                                    if (badgeContainer) {
                                        badgeContainer.style.background = badgeBg;
                                        badgeContainer.style.color = badgeColor;
                                        badgeContainer.style.borderColor = badgeBorder;
                                        badgeContainer.textContent = statusLabel;
                                    }

                                    const latencyContainer = nasRow.querySelector('.nas-latency');
                                    if (latencyContainer) {
                                        latencyContainer.style.color = latencyColor;
                                        latencyContainer.textContent = latencyText;
                                    }

                                    // Clear sync icon with visual confirmation tick
                                    const indicator = nasRow.querySelector('.nas-sync-indicator');
                                    if (indicator) {
                                        indicator.innerHTML = `
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `;
                                        setTimeout(() => {
                                            if (indicator.querySelector('polyline')) {
                                                indicator.innerHTML = '';
                                            }
                                        }, 3000);
                                    }
                                }
                            }
                        } catch (pingErr) {
                            console.error(`Erro ao pingar NAS ${nas.name}:`, pingErr);
                            const nasRow = document.getElementById(`nas-row-${nas.id}`);
                            if (nasRow) {
                                const badgeContainer = nasRow.querySelector('.monitor-badge');
                                if (badgeContainer) {
                                    badgeContainer.style.background = 'rgba(239, 68, 68, 0.12)';
                                    badgeContainer.style.color = '#fca5a5';
                                    badgeContainer.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    badgeContainer.textContent = 'Erro';
                                }
                                const indicator = nasRow.querySelector('.nas-sync-indicator');
                                if (indicator) indicator.innerHTML = '';
                            }
                        }
                    }
                    isPingingSequentially = false;
                } else {
                    throw new Error("Resposta inválida do servidor.");
                }
            } else {
                // Load all at once on backend
                const url = `/monitoring/nas?refresh=${forceRefresh}&t=${Date.now()}`;
                const res = await apiClient.get(url);
                if (res && res.success && Array.isArray(res.nas)) {
                    this.renderNasTable(res.nas);
                } else {
                    throw new Error("Resposta inválida do servidor.");
                }
            }
        } catch (err) {
            console.error('Erro ao buscar status dos dispositivos NAS:', err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos dispositivos NAS</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${err.message}</p>
                    </td>
                </tr>
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

    renderNasTable(nas) {
        const tbody = document.getElementById('monitoring-nas-tbody');
        if (!tbody) return;

        if (nas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum dispositivo NAS encontrado.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = nas.map(n => {
            let badgeBg = 'rgba(16, 185, 129, 0.12)';
            let badgeColor = '#6ee7b7';
            let badgeBorder = 'rgba(16, 185, 129, 0.3)';
            let statusLabel = 'Online';

            if (n.online === null) {
                badgeBg = 'rgba(255, 255, 255, 0.05)';
                badgeColor = 'var(--text-muted)';
                badgeBorder = 'rgba(255, 255, 255, 0.1)';
                statusLabel = 'Aguardando...';
            } else if (!n.online) {
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#fca5a5';
                badgeBorder = 'rgba(239, 68, 68, 0.3)';
                statusLabel = 'Offline';
            }

            const latencyColor = n.online ? (n.latency < 50 ? '#6ee7b7' : n.latency < 150 ? '#fde047' : '#fca5a5') : 'var(--text-muted)';
            const latencyText = n.online ? `${n.latency}ms` : '-';

            return `
                <tr id="nas-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s; cursor: pointer;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">
                        ${n.ip}
                        <span title="Dados cadastrais importados do Lansweeper" style="background: rgba(59, 130, 246, 0.08); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; margin-left: 6px; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📦 Lansweeper</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.manufacturer || '-'}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model || '-'}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted); font-size: 0.8rem;">${n.mac || '-'}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location || '-'}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${badgeBg}; color:${badgeColor}; border-color:${badgeBorder};">${statusLabel}</span>
                            <span title="Status verificado via Ping ICMP Real" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📡 Ping ICMP</span>
                            <span class="nas-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="nas-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${latencyColor};">${latencyText}</td>
                </tr>
            `;
        }).join('');

        // Vincular cliques nas linhas
        nas.forEach(n => {
            const row = document.getElementById(`nas-row-${n.id}`);
            if (row) {
                row.addEventListener('click', (e) => {
                    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
                    this.toggleNasDetails(n.id);
                });
            }
        });
    },

    async toggleNasDetails(nasId) {
        console.log('📊 [MONITORING] Toggling details for NAS ID:', nasId);
        const existingRow = document.getElementById(`nas-details-row-${nasId}`);
        if (existingRow) {
            existingRow.remove();
            return;
        }

        // Fecha outros painéis abertos de detalhes de NAS
        const openRows = document.querySelectorAll('.nas-details-row');
        openRows.forEach(r => r.remove());

        const parentRow = document.getElementById(`nas-row-${nasId}`);
        if (!parentRow) return;

        // Linha temporária de carregamento
        const detailsRow = document.createElement('tr');
        detailsRow.id = `nas-details-row-${nasId}`;
        detailsRow.className = 'nas-details-row';
        detailsRow.innerHTML = `
            <td colspan="8" style="padding: 24px; text-align: center; background: rgba(255,255,255,0.01); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--accent);">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    <span style="font-weight: 500; font-size: 0.9rem;">Buscando detalhes de storage e compartilhamentos...</span>
                </div>
            </td>
        `;

        parentRow.parentNode.insertBefore(detailsRow, parentRow.nextSibling);

        try {
            const res = await apiClient.get(`/monitoring/nas/${nasId}/storage?t=${Date.now()}`);
            if (res && res.success && res.storage) {
                const storage = res.storage;
                const volume = storage.volume;

                // Badge de fonte dos dados de storage
                const storageDataSource = storage.dataSource || 'estimated';
                const storageBadgeHtml = storageDataSource === 'lansweeper'
                    ? `<span title="Dados reais via Lansweeper" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">🟢 Lansweeper</span>`
                    : storageDataSource === 'synology_dsm'
                        ? `<span title="Dados reais via Synology DSM API" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">🟢 Synology DSM</span>`
                        : storageDataSource === 'wd_nas_ssh'
                            ? `<span title="Dados reais via SSH (Apenas Leitura)" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">🟢 WD My Cloud</span>`
                            : `<span title="Dados estimados (não configurado)" style="display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,0.08);color:#fde047;border:1px solid rgba(245,158,11,0.2);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">⚡ Estimado</span>`;

                const pctUsed = Math.round((volume.used_gb / volume.total_gb) * 100);
                const totalText = (volume.total_gb / 1000).toFixed(1) + ' TB';
                const usedText = (volume.used_gb / 1000).toFixed(1) + ' TB';
                const freeText = (volume.free_gb / 1000).toFixed(1) + ' TB';

                // Real-time specs (RAM, CPU, Network)
                const cpuUsage = storage.cpu_usage;
                const ramTotal = storage.ram_total_gb;
                const ramUsed = storage.ram_used_gb;
                const ramPct = storage.ram_usage_pct;
                const rxKbs = storage.network_rx_kbs;
                const txKbs = storage.network_tx_kbs;

                const hasRealtime = (cpuUsage !== null && cpuUsage !== undefined) || (ramPct !== null && ramPct !== undefined);
                
                let performanceHtml = '';
                if (hasRealtime) {
                    const cpuColor = cpuUsage < 60 ? '#10b981' : cpuUsage < 85 ? '#f59e0b' : '#ef4444';
                    const cpuTextColor = cpuUsage < 60 ? '#6ee7b7' : cpuUsage < 85 ? '#fde047' : '#fca5a5';
                    
                    const ramColor = ramPct < 60 ? '#10b981' : ramPct < 85 ? '#f59e0b' : '#ef4444';
                    const ramTextColor = ramPct < 60 ? '#6ee7b7' : ramPct < 85 ? '#fde047' : '#fca5a5';
                    
                    const formatSpeed = (kbs) => {
                        if (kbs == null) return '0 KB/s';
                        if (kbs >= 1024) return `${(kbs / 1024).toFixed(1)} MB/s`;
                        return `${kbs} KB/s`;
                    };

                    performanceHtml = `
                        <!-- PERFORMANCE SECTION: CPU, RAM and Network Activity -->
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Desempenho em Tempo Real</span>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                                
                                <!-- CPU Card -->
                                <div style="background: rgba(168, 85, 247, 0.04); border: 1px solid rgba(168, 85, 247, 0.12); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#a78bfa" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">CPU</span>
                                        </div>
                                        <span style="font-size: 0.85rem; font-weight: 700; color: ${cpuTextColor};">${cpuUsage}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${cpuUsage}%; height: 100%; background: ${cpuColor}; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">Uso do Processador</span>
                                </div>

                                <!-- RAM Card -->
                                <div style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.12); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#6ee7b7" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #6ee7b7; text-transform: uppercase; letter-spacing: 0.05em;">Memória RAM</span>
                                        </div>
                                        <span style="font-size: 0.85rem; font-weight: 700; color: ${ramTextColor};">${ramPct}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${ramPct}%; height: 100%; background: ${ramColor}; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">${ramUsed ? `${ramUsed} GB` : '-'} de ${ramTotal ? `${ramTotal} GB` : '-'} em uso</span>
                                </div>

                                <!-- Network Card -->
                                <div style="background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.12); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; gap: 7px;">
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="#93c5fd" stroke-width="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                        <span style="font-size: 0.75rem; font-weight: 600; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em;">Atividade de Rede</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px; height: 16px;">
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="#6ee7b7" stroke-width="2.5" fill="none" style="transform: rotate(45deg);"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                            <span style="font-size: 0.72rem; color: var(--text-muted);">Down:</span>
                                            <span style="font-size: 0.8rem; font-weight: 700; color: #6ee7b7; font-family: monospace;">${formatSpeed(rxKbs)}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="#fca5a5" stroke-width="2.5" fill="none" style="transform: rotate(225deg);"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                            <span style="font-size: 0.72rem; color: var(--text-muted);">Up:</span>
                                            <span style="font-size: 0.8rem; font-weight: 700; color: #fca5a5; font-family: monospace;">${formatSpeed(txKbs)}</span>
                                        </div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">Tráfego ativo de rede</span>
                                </div>

                            </div>
                        </div>
                    `;
                } else {
                    performanceHtml = `
                        <!-- PERFORMANCE SECTION: Indisponível -->
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Desempenho em Tempo Real</span>
                            <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
                                ⚠️ Métricas de CPU, RAM e Rede em tempo real não estão disponíveis para esta origem de dados.
                            </div>
                        </div>
                    `;
                }

                // Render HDD Bays
                const baysHtml = storage.bays.map(bay => {
                    const ledColor = bay.led === 'green' ? '#10b981' : '#ef4444';
                    const ledShadow = bay.led === 'green' ? '0 0 8px #10b981' : '0 0 8px #ef4444';
                    return `
                        <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                            <!-- HDD Icon with LED -->
                            <div style="position: relative; width: 32px; height: 44px; background: #2a2b2f; border: 2px solid #3d3e42; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 4px 2px; flex-shrink: 0;">
                                <div style="width: 5px; height: 5px; background: ${ledColor}; border-radius: 50%; box-shadow: ${ledShadow};"></div>
                                <div style="display: flex; flex-direction: column; gap: 2px; width: 80%;">
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                </div>
                                <span style="font-size: 0.52rem; color: var(--text-muted); font-weight: 700; text-align: center;">BAY ${bay.slot}</span>
                            </div>
                            <!-- HDD Details -->
                            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
                                <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${bay.disk_model}">${bay.disk_model}</span>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">S/N: ${bay.serial}</span>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
                                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent);">${bay.capacity}</span>
                                    <span style="font-size: 0.68rem; color: var(--text-muted); background: rgba(255,255,255,0.03); padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.05);">${bay.temp}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // Render Shares
                const sharesHtml = storage.shares.map(share => {
                    const pctShareUsed = Math.round((share.used_gb / share.total_gb) * 100);
                    const shareTotalText = (share.total_gb / 1000).toFixed(1) + ' TB';
                    const shareUsedText = (share.used_gb / 1000).toFixed(1) + ' TB';
                    return `
                        <div class="nas-share-item" style="display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); font-size: 0.82rem; transition: background 0.2s;">
                            <!-- Folder Icon and Name -->
                            <div style="flex: 2; display: flex; align-items: center; gap: 12px; min-width: 0; padding-right: 10px;">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#f59e0b" stroke-width="2" fill="#f59e0b" fill-opacity="0.2" style="flex-shrink: 0;">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <div style="display: flex; flex-direction: column; min-width: 0;">
                                    <span style="font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${share.name}</span>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${share.description}">${share.description}</span>
                                </div>
                            </div>
                            
                            <!-- Path -->
                            <div style="flex: 3; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; word-break: break-all; padding-right: 15px;">
                                ${share.path}
                            </div>
                            
                            <!-- Usage -->
                            <div style="flex: 2; display: flex; flex-direction: column; gap: 4px; padding-right: 20px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted);">
                                    <span>${shareUsedText} / ${shareTotalText}</span>
                                    <span>${pctShareUsed}%</span>
                                </div>
                                <div style="width: 100%; height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${pctShareUsed}%; height: 100%; background: #f59e0b; border-radius: 2px;"></div>
                                </div>
                            </div>
                            
                            <!-- Permissions -->
                            <div style="flex: 2; min-width: 0;">
                                <span style="background: rgba(245, 158, 11, 0.08); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.2); padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${share.user_group}">
                                    ${share.user_group}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('');

                // Render Dashboard HTML
                detailsRow.innerHTML = `
                    <td colspan="8" style="padding: 24px 28px; background: rgba(255, 255, 255, 0.015); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <div style="display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.25s ease-out; text-align: left;">
                            
                            <!-- TOP: RAID and Volume Capacity Overview -->
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Volume de Armazenamento</span>
                                        ${storageBadgeHtml}
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 1.3rem; font-weight: 700; color: var(--text-main);">${volume.raid_level}</span>
                                        <span class="monitor-badge" style="background: rgba(16, 185, 129, 0.12); color: #6ee7b7; border-color: rgba(16, 185, 129, 0.3); padding: 2px 8px; font-size: 0.75rem;">Status: ${volume.status}</span>
                                    </div>
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">Sistema de arquivos: <strong style="color: var(--text-main); font-family: monospace;">${volume.filesystem}</strong></span>
                                </div>
                                
                                <!-- Overall Space Gauge -->
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; min-width: 250px; flex-grow: 1; max-width: 400px;">
                                    <div style="display: flex; justify-content: space-between; width: 100%; font-size: 0.82rem;">
                                        <span style="color: var(--text-muted);">Espaço Utilizado: <strong style="color: var(--text-main);">${usedText}</strong></span>
                                        <span style="color: var(--text-muted);">Disponível: <strong style="color: var(--text-main);">${freeText}</strong></span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); display: flex;">
                                        <div style="width: ${pctUsed}%; height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 4px;"></div>
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Capacidade Total: <strong>${totalText}</strong> (Ocupação: ${pctUsed}%)</span>
                                </div>
                            </div>

                            <!-- REAL-TIME PERFORMANCE STATS -->
                            ${performanceHtml}

                            <!-- MIDDLE: Physical Hard Drive Bays (WD Style) -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Gavetas de Discos Físicos (Bays)</span>
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
                                    ${baysHtml}
                                </div>
                            </div>

                            <!-- BOTTOM: Shared Folders -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Pastas Compartilhadas (Pastas de Rede)</span>
                                <div style="display: flex; flex-direction: column; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; overflow: hidden; background: rgba(0, 0, 0, 0.15);">
                                    <!-- Header -->
                                    <div style="display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02); font-weight: 600; font-size: 0.78rem; color: var(--text-muted);">
                                        <div style="flex: 2;">Nome da Pasta</div>
                                        <div style="flex: 3;">Caminho de Rede</div>
                                        <div style="flex: 2;">Ocupação</div>
                                        <div style="flex: 2;">Grupo de Acesso</div>
                                    </div>
                                    <!-- Rows -->
                                    <div style="display: flex; flex-direction: column;">
                                        ${sharesHtml}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </td>
                `;
            } else {
                throw new Error(res.error || res.message || "Dados inválidos recebidos do servidor.");
            }
        } catch (err) {
            console.error("Erro ao expandir NAS storage:", err);
            detailsRow.innerHTML = `
                <td colspan="8" style="padding: 16px; text-align: center; color: #fca5a5; background: rgba(239, 68, 68, 0.07); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    Erro ao carregar detalhes de storage: ${err.message}
                </td>
            `;
        }
    },

    async fetchAndRenderCamerasStatus(forceRefresh = false, sequential = false) {
        console.log('📹 [MONITORING] Cameras tab is disabled ("Em breve")');
        this.renderCamerasTable([]);
    },

    renderCamerasTable(cameras) {
        const container = document.getElementById('infra-tab-content-cameras');
        if (container) {
            container.innerHTML = `
                <div class="glass" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; text-align: center; border-radius: var(--border-radius); border: 1px solid var(--glass-border); background: var(--card-bg); margin-top: 1rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.4)); animation: pulse 2s infinite;">📹</div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 600; color: var(--text-main);">Monitoramento de Câmeras</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 400px; margin: 0 auto 1.5rem auto;">O monitoramento e verificação de status das câmeras de segurança está sendo reformulado e estará disponível em breve.</p>
                    <span class="server-virt-badge virtual" style="font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;">⚡ Em Breve</span>
                </div>
            `;
        }
    },

    async fetchAndRenderServersStatus(forceRefresh = false, sequential = false) {
        console.log('⚡ [MONITORING] fetchAndRenderServersStatus called. forceRefresh:', forceRefresh, 'sequential:', sequential);
        const serversAutoRefreshChk = document.getElementById('servers-auto-refresh');
        const isSequential = sequential || (serversAutoRefreshChk && serversAutoRefreshChk.checked);

        const container = document.getElementById('monitoring-servers-accordion');
        if (!container) {
            console.error('❌ [MONITORING] Element #monitoring-servers-accordion not found in DOM!');
            return;
        }

        const btn = document.getElementById('btn-refresh-servers-status');
        if (btn) {
            btn.disabled = true;
            const icon = btn.querySelector('.refresh-icon');
            if (icon) icon.style.animation = 'spin 1s linear infinite';
        }

        try {
            if (isSequential) {
                console.log('⚡ [MONITORING] Fetching servers, sequential mode:', isSequential);
                const res = await apiClient.get(`/monitoring/servers?ping=false&refresh=${forceRefresh}&t=${Date.now()}`);
                if (res && res.success && Array.isArray(res.servers)) {
                    serversStatusData = res.servers;
                    this.renderServersAccordion(res.servers);

                    for (const srv of res.servers) {
                        if (activeTab !== 'infra' || activeInfraTab !== 'servers') break;

                        const itemHeader = container.querySelector(`[data-server-id="${srv.id}"]`);
                        if (itemHeader) {
                            const indicator = itemHeader.querySelector('.server-status-dot');
                            if (indicator) {
                                indicator.style.color = '#94a3b8';
                                indicator.style.backgroundColor = '#94a3b8';
                                indicator.style.boxShadow = '0 0 8px #94a3b8';
                                indicator.style.animation = 'pulse-gray 1.5s infinite';
                            }
                        }

                        try {
                            const pingRes = await apiClient.get(`/monitoring/servers/${srv.id}/ping?t=${Date.now()}`);
                            if (pingRes && pingRes.success && pingRes.server) {
                                const idx = serversStatusData.findIndex(s => s.id === srv.id);
                                if (idx !== -1) {
                                    serversStatusData[idx] = pingRes.server;
                                }
                                this.renderServersAccordion(serversStatusData);
                            }
                        } catch (pingErr) {
                            console.error(`Erro ao pingar servidor individual ${srv.name}:`, pingErr);
                        }
                    }
                }
            } else {
                console.log('⚡ [MONITORING] Fetching all servers with parallel pings...');
                const url = `/monitoring/servers?refresh=${forceRefresh}&t=${Date.now()}`;
                const res = await apiClient.get(url);
                if (res && res.success && Array.isArray(res.servers)) {
                    serversStatusData = res.servers;
                    this.renderServersAccordion(res.servers);
                }
            }
        } catch (err) {
            console.error('Erro ao buscar status dos servidores:', err);
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: var(--border-radius);">
                    Erro ao carregar dados dos servidores: ${err.message || err}
                </div>
            `;
        } finally {
            if (btn) {
                btn.disabled = false;
                const icon = btn.querySelector('.refresh-icon');
                if (icon) icon.style.animation = '';
            }
        }
    },

    renderServersAccordion(servers) {
        const container = document.getElementById('monitoring-servers-accordion');
        if (!container) return;

        const searchInput = document.getElementById('servers-search');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        // Atualiza o contador de filtros ativos (sanfona)
        const filterCheckboxIds = [
            'filter-type-physical',
            'filter-type-virtual',
            'filter-platform-win2019',
            'filter-platform-win2025',
            'filter-platform-linux',
            'filter-activity-online',
            'filter-activity-offline'
        ];
        let activeFiltersCount = 0;
        filterCheckboxIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.checked) activeFiltersCount++;
        });
        const activeCountBadge = document.getElementById('server-filters-active-count');
        if (activeCountBadge) {
            if (activeFiltersCount > 0) {
                activeCountBadge.textContent = activeFiltersCount;
                activeCountBadge.style.display = 'inline-flex';
            } else {
                activeCountBadge.style.display = 'none';
            }
        }

        const filtered = servers.filter(srv => {
            // 1. Text Search Filter
            if (query) {
                const matchesQuery = srv.name.toLowerCase().includes(query) ||
                                     srv.ip.toLowerCase().includes(query) ||
                                     (srv.os || '').toLowerCase().includes(query) ||
                                     (srv.model || '').toLowerCase().includes(query);
                if (!matchesQuery) return false;
            }

            // 2. Tipo Filter (Físico / Virtual)
            const typePhys = document.getElementById('filter-type-physical');
            const typeVirt = document.getElementById('filter-type-virtual');
            const selectedTypes = [];
            if (typePhys && typePhys.checked) selectedTypes.push('physical');
            if (typeVirt && typeVirt.checked) selectedTypes.push('virtual');

            if (selectedTypes.length > 0) {
                const isVirt = !!srv.is_virtualized;
                if (selectedTypes.includes('physical') && isVirt) return false;
                if (selectedTypes.includes('virtual') && !isVirt) return false;
            }

            // 3. Plataforma Filter (Win 2019 / Win 2025/2022 / Linux)
            const platWin2019 = document.getElementById('filter-platform-win2019');
            const platWin2025 = document.getElementById('filter-platform-win2025');
            const platLinux = document.getElementById('filter-platform-linux');
            const selectedPlatforms = [];
            if (platWin2019 && platWin2019.checked) selectedPlatforms.push('win2019');
            if (platWin2025 && platWin2025.checked) selectedPlatforms.push('win2025');
            if (platLinux && platLinux.checked) selectedPlatforms.push('linux');

            if (selectedPlatforms.length > 0) {
                const osLower = (srv.os || '').toLowerCase();
                let matchesPlatform = false;

                if (selectedPlatforms.includes('win2019') && osLower.includes('win') && osLower.includes('2019')) {
                    matchesPlatform = true;
                }
                if (selectedPlatforms.includes('win2025') && osLower.includes('win') && (osLower.includes('2025') || osLower.includes('2022'))) {
                    matchesPlatform = true;
                }
                if (selectedPlatforms.includes('linux') && (
                    osLower.includes('linux') ||
                    osLower.includes('ubuntu') ||
                    osLower.includes('debian') ||
                    osLower.includes('centos') ||
                    osLower.includes('redhat')
                )) {
                    matchesPlatform = true;
                }

                if (!matchesPlatform) return false;
            }

            // 4. Atividade Filter (On / Off)
            const actOnline = document.getElementById('filter-activity-online');
            const actOffline = document.getElementById('filter-activity-offline');
            const selectedActivity = [];
            if (actOnline && actOnline.checked) selectedActivity.push('online');
            if (actOffline && actOffline.checked) selectedActivity.push('offline');

            if (selectedActivity.length > 0) {
                const isOnline = srv.online === true;
                if (selectedActivity.includes('online') && !isOnline) return false;
                if (selectedActivity.includes('offline') && isOnline) return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: var(--border-radius);">
                    ${query ? 'Nenhum servidor corresponde à busca.' : 'Nenhum servidor cadastrado.'}
                </div>
            `;
            return;
        }

        const expandedIds = Array.from(container.querySelectorAll('.server-accordion-item.active'))
            .map(item => item.getAttribute('data-item-id'));

        container.innerHTML = filtered.map(srv => {

            const isExpanded = expandedIds.includes(srv.id.toString());
            const activeClass = isExpanded ? 'active' : '';

            let dotColorClass = 'online';
            let statusText = 'Online';
            if (srv.online === null) {
                dotColorClass = 'offline';
                statusText = 'Aguardando verificação...';
            } else if (!srv.online) {
                dotColorClass = 'offline';
                statusText = 'Offline (Sem resposta)';
            } else {
                statusText = 'Operando normalmente';
            }

            const osLower = srv.os.toLowerCase();
            let osClass = 'other';
            let osIcon = '💻';
            if (osLower.includes('win')) {
                osClass = 'windows';
                osIcon = '🪟';
            } else if (osLower.includes('linux') || osLower.includes('ubuntu') || osLower.includes('debian') || osLower.includes('centos') || osLower.includes('redhat')) {
                osClass = 'linux';
                osIcon = '🐧';
            }

            const latencyText = srv.online ? `${srv.latency}ms` : '-';
            const latencyColor = srv.online ? (srv.latency < 20 ? '#6ee7b7' : srv.latency < 80 ? '#fde047' : '#fca5a5') : 'var(--text-muted)';

            // ── Hardware metric helpers ──────────────────────────────────────
            const metricBar = (pct) => {
                const color = pct < 60 ? '#10b981' : pct < 85 ? '#f59e0b' : '#ef4444';
                const textColor = pct < 60 ? '#6ee7b7' : pct < 85 ? '#fde047' : '#fca5a5';
                return { color, textColor };
            };

            const cpuPct   = srv.cpu_usage  != null ? srv.cpu_usage  : null;
            const ramPct   = srv.ram_usage  != null ? srv.ram_usage  : null;
            const diskPct  = srv.disk_usage != null ? srv.disk_usage : null;
            const cpuBar   = cpuPct != null ? metricBar(cpuPct) : { color: 'rgba(255,255,255,0.1)', textColor: 'var(--text-muted)' };
            const ramBar   = ramPct != null ? metricBar(ramPct) : { color: 'rgba(255,255,255,0.1)', textColor: 'var(--text-muted)' };
            const diskBar  = diskPct != null ? metricBar(diskPct) : { color: 'rgba(255,255,255,0.1)', textColor: 'var(--text-muted)' };

            const hasMetrics = srv.cpu || srv.memory || srv.storage;

            // Badge de fonte das métricas
            const metricsSource = srv.metricsSource || 'none';
            const sourceBadgeHtml = metricsSource === 'zabbix'
                ? `<span title="Métricas em tempo real via Zabbix" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">📊 Zabbix</span>`
                : `<span title="Dispositivo sem monitoramento Zabbix ativo" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.05);color:var(--text-muted);border:1px solid rgba(255,255,255,0.1);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">⚪ Sem dados</span>`;
            
            const pingSourceBadge = srv.online
                ? `<span title="Conectividade verificada via Ping ICMP Real" style="display:inline-flex;align-items:center;gap:4px;background:rgba(59,130,246,0.08);color:#93c5fd;border:1px solid rgba(59,130,246,0.2);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">📡 Ping ICMP</span>`
                : `<span title="Sem resposta de Ping ICMP" style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.08);color:#fca5a5;border:1px solid rgba(239,68,68,0.2);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">📡 ICMP Offline</span>`;

            const hasRealMetrics = hasMetrics && metricsSource === 'zabbix' && srv.online;

            return `
                <div class="server-accordion-item ${activeClass}" data-item-id="${srv.id}">
                    <div class="server-accordion-header" data-server-id="${srv.id}">
                        <div class="server-header-left">
                            <span class="server-status-dot ${dotColorClass}" title="${statusText}"></span>
                            <span class="server-title">${srv.name}</span>
                            <span class="server-ip-badge">${srv.ip}</span>
                            <span class="server-os-badge ${osClass}">${osIcon} ${srv.os}</span>
                            ${srv.is_virtualized != null ? (srv.is_virtualized
                                ? `<span title="${srv.virtualization_type || 'Máquina Virtual'}" style="display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,0.12);color:#d8b4fe;border:1px solid rgba(168,85,247,0.3);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;white-space:nowrap;flex-shrink:0;">
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="8" height="8" rx="1"></rect><rect x="14" y="2" width="8" height="8" rx="1"></rect><rect x="2" y="14" width="8" height="8" rx="1"></rect><rect x="14" y="14" width="8" height="8" rx="1"></rect></svg>
                                    ${srv.virtualization_type || 'Virtual'}
                                  </span>`
                                : `<span title="Servidor Físico" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.09);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;white-space:nowrap;flex-shrink:0;">
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                    Físico
                                  </span>`)
                            : ''}
                            ${hasMetrics ? sourceBadgeHtml : ''}
                            ${pingSourceBadge}
                        </div>
                        <div class="server-header-right">
                            ${hasRealMetrics ? `
                            <div style="display: flex; align-items: center; gap: 10px; margin-right: 10px;">
                                <div title="CPU: ${cpuPct}% (via Zabbix)" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${cpuBar.textColor}" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${cpuBar.textColor};">${cpuPct}%</span>
                                </div>
                                <div title="RAM: ${ramPct}% (via Zabbix)" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${ramBar.textColor}" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line><line x1="6" y1="4" x2="6" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line><line x1="14" y1="4" x2="14" y2="7"></line><line x1="18" y1="4" x2="18" y2="7"></line></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${ramBar.textColor};">${ramPct}%</span>
                                </div>
                                <div title="Disco: ${diskPct}% (via Zabbix)" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${diskBar.textColor}" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${diskBar.textColor};">${diskPct}%</span>
                                </div>
                            </div>` : ''}
                            <span class="server-latency" style="color: ${latencyColor}; font-weight: 500;">${latencyText}</span>
                            <svg class="server-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="server-accordion-body">
                        <div class="server-accordion-content">

                            ${hasMetrics ? `
                            <!-- ── Hardware Metrics ─────────────────────────────── -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">

                                <!-- CPU -->
                                ${srv.cpu ? `
                                <div title="Fonte: ${metricsSource === 'zabbix' ? 'Zabbix' : 'Sem Monitoramento'}" style="background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#a78bfa" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">CPU</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${cpuBar.textColor};">${cpuPct != null ? `${cpuPct}%` : '-'}</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${cpuPct != null ? cpuPct : 0}%; height: 100%; background: ${cpuBar.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${srv.cpu}">${srv.cpu}</span>
                                </div>` : ''}

                                <!-- RAM -->
                                ${srv.memory ? `
                                <div title="Fonte: ${metricsSource === 'zabbix' ? 'Zabbix' : 'Sem Monitoramento'}" style="background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#38bdf8" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line><line x1="6" y1="4" x2="6" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line><line x1="14" y1="4" x2="14" y2="7"></line><line x1="18" y1="4" x2="18" y2="7"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">Memória</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${ramBar.textColor};">${ramPct != null ? `${ramPct}%` : '-'}</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${ramPct != null ? ramPct : 0}%; height: 100%; background: ${ramBar.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${srv.memory}</span>
                                </div>` : ''}

                                <!-- Storage -->
                                ${srv.storage ? `
                                <div title="Fonte: ${metricsSource === 'zabbix' ? 'Zabbix' : 'Sem Monitoramento'}" style="background: rgba(251,146,60,0.06); border: 1px solid rgba(251,146,60,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fb923c" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #fb923c; text-transform: uppercase; letter-spacing: 0.05em;">Armazenamento</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${diskBar.textColor};">${diskPct != null ? `${diskPct}%` : '-'}</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${diskPct != null ? diskPct : 0}%; height: 100%; background: ${diskBar.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${srv.storage}">${srv.storage}</span>
                                </div>` : ''}

                            </div>
                            ` : ''}

                            <!-- Virtualization Badge -->
                            ${srv.is_virtualized != null ? `
                            <div style="margin-bottom: 16px;">
                                ${srv.is_virtualized
                                    ? `<span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(168,85,247,0.1); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="8" height="8" rx="1"></rect><rect x="14" y="2" width="8" height="8" rx="1"></rect><rect x="2" y="14" width="8" height="8" rx="1"></rect><rect x="14" y="14" width="8" height="8" rx="1"></rect></svg>
                                        ${srv.virtualization_type || 'Máquina Virtual'}
                                      </span>`
                                    : `<span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.08); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                        Servidor Físico
                                      </span>`
                                }
                            </div>
                            ` : ''}

                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Especificações do Equipamento</span>
                                <span title="Dados cadastrais importados do Lansweeper" style="display:inline-flex;align-items:center;gap:4px;background:rgba(59,130,246,0.08);color:#93c5fd;border:1px solid rgba(59,130,246,0.2);padding:2px 8px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;">📦 Lansweeper</span>
                            </div>

                            <div class="server-details-grid">
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Descrição</span>
                                    <span class="server-detail-value">${srv.description || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Domínio</span>
                                    <span class="server-detail-value">${srv.domain || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Usuário Contato</span>
                                    <span class="server-detail-value">${srv.user} (${srv.userDomain})</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Fabricante</span>
                                    <span class="server-detail-value">${srv.manufacturer || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Modelo</span>
                                    <span class="server-detail-value">${srv.model || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Número de Série</span>
                                    <span class="server-detail-value code-font">${srv.serialNumber || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Localização</span>
                                    <span class="server-detail-value">${srv.location || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Primeiro Visto</span>
                                    <span class="server-detail-value">${srv.firstSeen || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Último Visto</span>
                                    <span class="server-detail-value">${srv.lastSeen || '-'}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Último Ativo</span>
                                    <span class="server-detail-value">${srv.lastActive || '-'}</span>
                                </div>
                            </div>
                            <div class="server-actions-row">
                                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.monitoringHandler.pingSingleServer('${srv.id}', this)" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; padding: 4px 10px; height: 28px;">
                                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="ping-icon">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <path d="M20.49 15a9 9 0 0 1-12.42-3.36L1 14"></path>
                                    </svg>
                                    <span>Pingar agora</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.server-accordion-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const item = header.closest('.server-accordion-item');
                const isOpen = item.classList.contains('active');
                item.classList.toggle('active', !isOpen);
            });
        });
    },

    async pingSingleServer(id, button) {
        console.log(`⚡ [MONITORING] pingSingleServer called for server ${id}`);
        if (!button) return;

        button.disabled = true;
        const span = button.querySelector('span');
        const originalText = span.textContent;
        span.textContent = 'Verificando...';
        
        const icon = button.querySelector('.ping-icon');
        if (icon) icon.style.animation = 'spin 1s linear infinite';

        try {
            const res = await apiClient.get(`/monitoring/servers/${id}/ping?t=${Date.now()}`);
            if (res && res.success && res.server) {
                const idx = serversStatusData.findIndex(s => s.id === id);
                if (idx !== -1) {
                    serversStatusData[idx] = res.server;
                }
                this.renderServersAccordion(serversStatusData);
            }
        } catch (err) {
            console.error('Erro ao pingar servidor individual:', err);
        } finally {
            if (button) {
                button.disabled = false;
                if (span) span.textContent = originalText;
                if (icon) icon.style.animation = '';
            }
        }
    },

    _startTrafficPolling() {
        this._stopTrafficPolling();
        
        const chk = document.getElementById('network-traffic-enable');
        const chartsContainer = document.getElementById('network-charts-container');
        if (chk && !chk.checked) {
            if (chartsContainer) {
                chartsContainer.style.opacity = '0.35';
                chartsContainer.style.pointerEvents = 'none';
            }
            const interfaces = ['lan', 'wan', 'opt1', 'opt2'];
            interfaces.forEach(iface => {
                const textEl = document.getElementById(`traffic-text-${iface}`);
                if (textEl) textEl.textContent = 'Tráfego pausado';
            });
            return;
        }

        if (activeTab !== 'network') return;

        if (chartsContainer) {
            chartsContainer.style.opacity = '1';
            chartsContainer.style.pointerEvents = 'auto';
        }

        this.initTrafficCharts();

        console.log('📈 [MONITORING] Iniciando polling de tráfego do pfSense...');
        lastTrafficData = null;

        this.fetchAndRenderTraffic();

        trafficPollingInterval = setInterval(() => {
            const currentChk = document.getElementById('network-traffic-enable');
            if (activeTab === 'network' && (!currentChk || currentChk.checked)) {
                this.fetchAndRenderTraffic();
            } else {
                this._stopTrafficPolling();
            }
        }, 3000);
    },

    _stopTrafficPolling() {
        if (trafficPollingInterval) {
            clearInterval(trafficPollingInterval);
            trafficPollingInterval = null;
            console.log('📈 [MONITORING] Polling de tráfego parado.');
        }
        
        const chk = document.getElementById('network-traffic-enable');
        if (!chk || !chk.checked) {
            const chartsContainer = document.getElementById('network-charts-container');
            if (chartsContainer) {
                chartsContainer.style.opacity = '0.35';
                chartsContainer.style.pointerEvents = 'none';
            }
            const interfaces = ['lan', 'wan', 'opt1', 'opt2'];
            interfaces.forEach(iface => {
                const textEl = document.getElementById(`traffic-text-${iface}`);
                if (textEl) textEl.textContent = 'Tráfego pausado';
            });
        }
    },

    initTrafficCharts() {
        if (!window.Chart) {
            console.warn('Chart.js is not loaded.');
            return;
        }

        const interfaces = ['lan', 'wan', 'opt1', 'opt2'];
        interfaces.forEach(iface => {
            const canvas = document.getElementById(`chart-traffic-${iface}`);
            if (!canvas) return;

            if (trafficCharts[iface]) return;

            const ctx = canvas.getContext('2d');
            const maxPoints = 20;
            const labels = Array(maxPoints).fill('');
            const initialData = Array(maxPoints).fill(0);

            trafficCharts[iface] = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Download (In)',
                            data: [...initialData],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 0
                        },
                        {
                            label: 'Upload (Out)',
                            data: [...initialData],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    if (context.parsed.y !== null) {
                                        label += formatTrafficSpeed(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.5)',
                                font: {
                                    size: 9,
                                    family: 'monospace'
                                },
                                callback: function(value) {
                                    return formatTrafficSpeed(value);
                                }
                            }
                        }
                    }
                }
            });
        });

        function formatTrafficSpeed(bps) {
            if (bps >= 1000000) {
                return (bps / 1000000).toFixed(1) + ' Mbps';
            }
            if (bps >= 1000) {
                return (bps / 1000).toFixed(1) + ' Kbps';
            }
            return bps.toFixed(0) + ' bps';
        }
    },

    async fetchAndRenderTraffic() {
        try {
            const res = await apiClient.get('/monitoring/pfsense/traffic');
            if (res && res.success && res.traffic) {
                const current = res.traffic;
                
                // Toggle simulation badge
                const badge = document.getElementById('traffic-simulation-badge');
                if (badge) {
                    badge.style.display = current.isSimulated ? 'inline-block' : 'none';
                }
                
                if (lastTrafficData) {
                    const dt = current.wan.timestamp - lastTrafficData.wan.timestamp;
                    
                    if (dt > 0) {
                        const interfaces = ['lan', 'wan', 'opt1', 'opt2'];
                        
                        interfaces.forEach(iface => {
                            const curData = current[iface];
                            const lastData = lastTrafficData[iface];
                            
                            if (curData && lastData) {
                                const diffIn = curData.inBytes - lastData.inBytes;
                                const diffOut = curData.outBytes - lastData.outBytes;
                                
                                const bpsIn = diffIn >= 0 ? Math.floor((diffIn * 8) / dt) : 0;
                                const bpsOut = diffOut >= 0 ? Math.floor((diffOut * 8) / dt) : 0;
                                
                                const textEl = document.getElementById(`traffic-text-${iface}`);
                                if (textEl) {
                                    textEl.textContent = `In: ${formatBps(bpsIn)} | Out: ${formatBps(bpsOut)}`;
                                }
                                
                                const chart = trafficCharts[iface];
                                if (chart) {
                                    const inDataset = chart.data.datasets[0].data;
                                    const outDataset = chart.data.datasets[1].data;
                                    
                                    inDataset.shift();
                                    inDataset.push(bpsIn);
                                    
                                    outDataset.shift();
                                    outDataset.push(bpsOut);
                                    
                                    chart.update('none');
                                }
                            }
                        });
                    }
                }
                
                lastTrafficData = current;
            }
        } catch (err) {
            console.error('Erro ao buscar tráfego de rede pfSense:', err);
        }

        function formatBps(bps) {
            if (bps >= 1000000) {
                return (bps / 1000000).toFixed(2) + ' Mbps';
            }
            if (bps >= 1000) {
                return (bps / 1000).toFixed(1) + ' Kbps';
            }
            return bps + ' bps';
        }
    }
};
