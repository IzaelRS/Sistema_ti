import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';

let allExtensions = [];
let allQueues = [];
let allBlfs = [];
let allUsers = [];

let activeTab = 'extensions'; // 'extensions', 'queues', 'blf', 'users'
let currentPage = 1;
let itemsPerPage = 100;
let currentFilteredItems = [];

export const telephonyHandler = {
    setActiveTab(tab) {
        activeTab = tab;
        currentPage = 1;

        // Reset search input
        const searchInput = document.getElementById('telephony-search');
        if (searchInput) {
            searchInput.value = '';
            if (tab === 'extensions') {
                searchInput.placeholder = 'Pesquisar ramais por número, nome ou usuário...';
            } else if (tab === 'queues') {
                searchInput.placeholder = 'Pesquisar filas por número ou nome...';
            } else if (tab === 'blf') {
                searchInput.placeholder = 'Pesquisar BLF por nome...';
            } else if (tab === 'users') {
                searchInput.placeholder = 'Pesquisar usuários por nome ou perfil...';
            }
        }

        // Toggle Active Classes in navigation buttons
        const navButtons = document.querySelectorAll('.telephony-tabs-nav .acc-tab-btn');
        navButtons.forEach(btn => {
            if (btn.id === `tab-telephony-${tab}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show/Hide relevant view divs
        const tabContents = document.querySelectorAll('.telephony-tab-content');
        tabContents.forEach(content => {
            if (content.id === `telephony-view-${tab}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        // Hide main search bar and pagination in history tab
        const searchBar = document.querySelector('#telephony-section .search-bar');
        const pagination = document.getElementById('telephony-pagination');
        if (searchBar) searchBar.style.display = tab === 'history' ? 'none' : 'flex';
        if (pagination) pagination.style.display = tab === 'history' ? 'none' : 'block';

        if (tab === 'history') {
            this.fetchAndRenderHistory();
        } else {
            // Render appropriate data
            const currentData = this.getActiveDataList();
            this.render(currentData);
        }
    },

    getActiveDataList() {
        if (activeTab === 'extensions') return allExtensions;
        if (activeTab === 'queues') return allQueues;
        if (activeTab === 'blf') return allBlfs;
        if (activeTab === 'users') return allUsers;
        return [];
    },

    async fetch() {
        const tbody = this.getActiveTableBody();
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>`;
        }

        try {
            currentPage = 1;

            if (activeTab === 'extensions') {
                allExtensions = await apiClient.get('/telephony/extensions');
                this.render(allExtensions);
            } else if (activeTab === 'queues') {
                allQueues = await apiClient.get('/telephony/queues');
                this.render(allQueues);
            } else if (activeTab === 'blf') {
                // If extensions are not loaded, fetch them in background so we can resolve names
                if (allExtensions.length === 0) {
                    try {
                        allExtensions = await apiClient.get('/telephony/extensions');
                    } catch (e) {
                        console.warn("Could not pre-fetch extensions for BLF mapping:", e);
                    }
                }
                allBlfs = await apiClient.get('/telephony/blfs');
                this.render(allBlfs);
            } else if (activeTab === 'users') {
                allUsers = await apiClient.get('/telephony/users');
                this.render(allUsers);
            } else if (activeTab === 'history') {
                await this.fetchAndRenderHistory();
            }
        } catch (err) {
            console.error(`Error fetching telephony ${activeTab}:`, err);
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${err.message || 'Erro de rede'}</td></tr>`;
            }
        }
    },

    getActiveTableBody() {
        if (activeTab === 'extensions') return document.getElementById('telephony-table-body');
        if (activeTab === 'queues') return document.getElementById('telephony-queues-table-body');
        if (activeTab === 'blf') return document.getElementById('telephony-blf-table-body');
        if (activeTab === 'users') return document.getElementById('telephony-users-table-body');
        return null;
    },

    render(items) {
        const tbody = this.getActiveTableBody();
        if (!tbody) return;

        currentFilteredItems = items;
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Adjust currentPage if it's out of bounds
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

        if (paginatedItems.length === 0) {
            const colspan = activeTab === 'extensions' ? 8 : activeTab === 'queues' ? 6 : activeTab === 'blf' ? 4 : 5;
            tbody.innerHTML = `
                <tr>
                    <td colspan="${colspan}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `;
            this.renderPaginationControls('telephony-pagination', 0, 0);
            return;
        }

        if (activeTab === 'extensions') {
            this.renderExtensionsList(tbody, paginatedItems);
        } else if (activeTab === 'queues') {
            this.renderQueuesList(tbody, paginatedItems);
        } else if (activeTab === 'blf') {
            this.renderBlfsList(tbody, paginatedItems);
        } else if (activeTab === 'users') {
            this.renderUsersList(tbody, paginatedItems);
        }

        this.renderPaginationControls('telephony-pagination', totalPages, totalItems);
    },

    renderExtensionsList(tbody, items) {
        tbody.innerHTML = items.map(sip => {
            const exten = sip.exten || '-';
            const nome = sip.nome || '-';
            const localUsername = sip.local_username || '';
            const ddr = sip.ddr || '-';
            const username = sip.Username || '-';
            const secret = sip.Secret || '';
            const outputRoute = sip.regra_saida_nome 
                ? `<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${sip.regra_saida_nome}</span>` 
                : '-';
            const observacao = sip.observacao || '-';

            const escapedSecret = secret.replace(/'/g, "\\'");

            return `
                <tr>
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${exten}</span>
                        </span>
                    </td>
                    <td>${nome}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" class="form-control glass" 
                                   style="width: 130px; padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-main);" 
                                   value="${localUsername}" 
                                   placeholder="Usuário..." 
                                   onchange="window.TelephonyHandler.updateLocalUsername('${exten}', this.value)">
                            <button class="btn-icon" 
                                    style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-muted); cursor: pointer;"
                                    onclick="window.TelephonyHandler.showExtensionHistory('${exten}')"
                                    title="Ver histórico de alterações do ramal ${exten}">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${ddr}</td>
                    <td><strong style="color: var(--accent);">${username}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px;">
                            <span id="secret-txt-${sip.id}" style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${sip.id}, '${escapedSecret}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${sip.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${outputRoute}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${observacao}">${observacao}</td>
                </tr>
            `;
        }).join('');
    },

    renderQueuesList(tbody, items) {
        tbody.innerHTML = items.map(q => {
            const exten = q.exten || '-';
            const nome = q.nome || '-';
            const estrategia = q.Estrategia || '-';
            const timeout = q.TimeoutAgente ? `${q.TimeoutAgente}s` : '-';
            const gravacao = q.Gravacao 
                ? `<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>` 
                : `<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>`;
            const membersCount = q.membros ? q.membros.length : 0;

            const membersHtml = q.membros && q.membros.length > 0
                ? q.membros.map(m => `
                    <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style="font-size: 0.85rem; font-weight: 500;">${m.extensao_numero} - ${m.extensao_nome}</span>
                    </div>
                  `).join('')
                : '<div style="color: var(--text-muted); font-size: 0.85rem;">Nenhum ramal membro nesta fila.</div>';

            return `
                <tr onclick="window.TelephonyHandler.toggleQueueRow(${q.id})" style="cursor: pointer;" title="Clique para ver os ramais membros">
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--primary);">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>${exten}</span>
                        </span>
                    </td>
                    <td><strong>${nome}</strong></td>
                    <td style="text-transform: capitalize;">${estrategia}</td>
                    <td>${timeout}</td>
                    <td>${gravacao}</td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${membersCount} membros</span>
                            <svg id="queue-arrow-${q.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                </tr>
                <tr id="queue-details-${q.id}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="6" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Membros Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${membersHtml}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderBlfsList(tbody, items) {
        tbody.innerHTML = items.map(blf => {
            const id = blf.id;
            const nome = blf.Nome || '-';
            const count = blf.quantidade_extensoes || 0;
            const dataCriacao = blf.DataCriacao 
                ? new Date(blf.DataCriacao).toLocaleString('pt-BR') 
                : '-';

            const extensionsHtml = blf.extensoes_ids && blf.extensoes_ids.length > 0
                ? blf.extensoes_ids.map(extId => {
                    const extObj = allExtensions.find(e => e.id === extId || e.extensao_id === extId);
                    const extNum = extObj ? extObj.exten : `ID ${extId}`;
                    const extNome = extObj ? extObj.nome : 'Não encontrado';
                    return `
                        <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span style="font-size: 0.85rem; font-weight: 500;">${extNum} - ${extNome}</span>
                        </div>
                    `;
                  }).join('')
                : '<div style="color: var(--text-muted); font-size: 0.85rem;">Nenhum ramal vinculado neste BLF.</div>';

            return `
                <tr onclick="window.TelephonyHandler.toggleBlfRow(${id})" style="cursor: pointer;" title="Clique para ver os ramais vinculados">
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--primary);">
                                <rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect>
                                <circle cx="8" cy="8" r="2"></circle>
                                <circle cx="16" cy="8" r="2"></circle>
                                <circle cx="8" cy="16" r="2"></circle>
                                <circle cx="16" cy="16" r="2"></circle>
                            </svg>
                            <span>${id}</span>
                        </span>
                    </td>
                    <td><strong>${nome}</strong></td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${count} ramais</span>
                            <svg id="blf-arrow-${id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                    <td style="color: var(--text-muted);">${dataCriacao}</td>
                </tr>
                <tr id="blf-details-${id}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="4" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${extensionsHtml}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderUsersList(tbody, items) {
        tbody.innerHTML = items.map(u => {
            const username = u.username || '-';
            const email = u.email || '-';
            const tipo = u.Tipo || '-';
            const status = u.is_active 
                ? `<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>` 
                : `<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>`;

            return `
                <tr>
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--primary);">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>${username}</span>
                        </span>
                    </td>
                    <td>${email}</td>
                    <td style="text-transform: capitalize; font-weight: 600; color: var(--accent);">${tipo}</td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; max-width: 140px;">
                            <span style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleUserSecret(${u.id})" title="Mostrar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${status}</td>
                </tr>
            `;
        }).join('');
    },

    toggleQueueRow(id) {
        const detailRow = document.getElementById(`queue-details-${id}`);
        const arrow = document.getElementById(`queue-arrow-${id}`);
        if (detailRow) {
            detailRow.classList.toggle('hidden');
            if (arrow) {
                if (detailRow.classList.contains('hidden')) {
                    arrow.style.transform = 'rotate(0deg)';
                } else {
                    arrow.style.transform = 'rotate(180deg)';
                }
            }
        }
    },

    toggleBlfRow(id) {
        const detailRow = document.getElementById(`blf-details-${id}`);
        const arrow = document.getElementById(`blf-arrow-${id}`);
        if (detailRow) {
            detailRow.classList.toggle('hidden');
            if (arrow) {
                if (detailRow.classList.contains('hidden')) {
                    arrow.style.transform = 'rotate(0deg)';
                } else {
                    arrow.style.transform = 'rotate(180deg)';
                }
            }
        }
    },

    toggleUserSecret(id) {
        alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.");
    },

    search(term) {
        currentPage = 1;
        const currentData = this.getActiveDataList();
        
        const filtered = currentData.filter(item => {
            if (activeTab === 'extensions') {
                return (item.exten || '').toLowerCase().includes(term) ||
                    (item.nome || '').toLowerCase().includes(term) ||
                    (item.local_username || '').toLowerCase().includes(term) ||
                    (item.Username || '').toLowerCase().includes(term) ||
                    (item.ddr || '').toLowerCase().includes(term) ||
                    (item.observacao || '').toLowerCase().includes(term);
            } else if (activeTab === 'queues') {
                return (item.exten || '').toLowerCase().includes(term) ||
                    (item.nome || '').toLowerCase().includes(term) ||
                    (item.Estrategia || '').toLowerCase().includes(term);
            } else if (activeTab === 'blf') {
                return (item.Nome || '').toLowerCase().includes(term);
            } else if (activeTab === 'users') {
                return (item.username || '').toLowerCase().includes(term) ||
                    (item.email || '').toLowerCase().includes(term) ||
                    (item.Tipo || '').toLowerCase().includes(term);
            }
            return false;
        });

        this.render(filtered);
    },

    changePage(page) {
        currentPage = page;
        this.render(currentFilteredItems);
    },

    setPageSize(size) {
        itemsPerPage = parseInt(size, 10);
        currentPage = 1;
        this.render(currentFilteredItems);
    },

    async updateLocalUsername(exten, newUsername) {
        try {
            console.log(`[TELEFONIA] Atualizando nome de usuário local do ramal ${exten} para: ${newUsername}`);
            const changedBy = window.auth && window.auth.getUser() ? window.auth.getUser().name : "Sistema";
            const response = await apiClient.post('/telephony/extensions/username', {
                exten: exten,
                username: newUsername,
                changed_by: changedBy
            });
            
            if (response.success) {
                // Atualizar o array local em memória para manter até o próximo fetch
                const ext = allExtensions.find(e => e.exten === exten);
                if (ext) {
                    ext.local_username = newUsername;
                }
                console.log(`[TELEFONIA] Nome de usuário local atualizado para ${exten}`);
            } else {
                alert("Erro ao salvar nome de usuário: " + (response.error || "Erro desconhecido"));
            }
        } catch (e) {
            console.error("Erro ao atualizar nome de usuário local:", e);
            alert("Erro de rede ao salvar nome de usuário: " + e.message);
        }
    },

    showExtensionHistory(exten) {
        // Limpar inputs de data para exibir todo o histórico
        const startInput = document.getElementById('telephony-history-start');
        const endInput = document.getElementById('telephony-history-end');
        if (startInput) startInput.value = '';
        if (endInput) endInput.value = '';

        // Definir o filtro de ramal
        const extenInput = document.getElementById('telephony-history-exten');
        if (extenInput) extenInput.value = exten;

        // Limpar filtro de usuário
        const usernameInput = document.getElementById('telephony-history-username');
        if (usernameInput) usernameInput.value = '';

        // Mudar para a aba de histórico e buscar dados
        this.setActiveTab('history');
    },

    toggleSecret(id, secret) {
        const textSpan = document.getElementById(`secret-txt-${id}`);
        const iconSvg = document.getElementById(`secret-icon-${id}`);
        if (!textSpan || !iconSvg) return;

        if (textSpan.textContent === '••••••••') {
            textSpan.textContent = secret;
            iconSvg.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            textSpan.textContent = '••••••••';
            iconSvg.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    },

    renderPaginationControls(containerId, totalPages, totalItems) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (totalPages === 0) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        
        // Prev Button
        html += `
            <button class="pagination-btn" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="window.TelephonyHandler.changePage(${currentPage - 1})"
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
                            onclick="window.TelephonyHandler.changePage(${i})">
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
                    onclick="window.TelephonyHandler.changePage(${currentPage + 1})"
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

    init() {
        console.log('📞 [TELEFONIA] Inicializando telephonyHandler...');
        
        // Deixar os inputs de data vazios por padrão para carregar todo o histórico
        const startInput = document.getElementById('telephony-history-start');
        const endInput = document.getElementById('telephony-history-end');
        if (startInput) startInput.value = '';
        if (endInput) endInput.value = '';

        // Adiciona listeners para os filtros
        ['telephony-history-start', 'telephony-history-end'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => this.fetchAndRenderHistory());
        });

        ['telephony-history-exten', 'telephony-history-username'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.fetchAndRenderHistory());
        });

        const clearFiltersBtn = document.getElementById('btn-clear-telephony-history-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                if (startInput) startInput.value = '';
                if (endInput) endInput.value = '';
                const extenInput = document.getElementById('telephony-history-exten');
                const usernameInput = document.getElementById('telephony-history-username');
                if (extenInput) extenInput.value = '';
                if (usernameInput) usernameInput.value = '';
                this.fetchAndRenderHistory();
            });
        }
    },

    async fetchAndRenderHistory() {
        const container = document.getElementById('telephony-history-timeline-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Carregando histórico...
                </div>
            `;
        }

        try {
            const startDate = document.getElementById('telephony-history-start')?.value || '';
            const endDate = document.getElementById('telephony-history-end')?.value || '';
            const exten = document.getElementById('telephony-history-exten')?.value || '';
            const username = document.getElementById('telephony-history-username')?.value || '';

            const params = new URLSearchParams({ startDate, endDate, exten, username });
            const history = await apiClient.get('/telephony/extensions/history?' + params.toString());

            this.renderHistoryTimeline(history);
        } catch (e) {
            console.error("Error fetching extension history:", e);
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #ef4444; width: 100%;">
                        Erro ao carregar histórico: ${e.message || 'Erro desconhecido'}
                    </div>
                `;
            }
        }
    },

    renderHistoryTimeline(items) {
        const container = document.getElementById('telephony-history-timeline-container');
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Nenhum registro de histórico encontrado para os filtros selecionados.
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => {
            const date = new Date(item.changed_at).toLocaleString('pt-BR');
            const exten = item.exten || '-';
            const oldUser = item.old_username || '<i>(Vazio)</i>';
            const newUser = item.new_username || '<i>(Removido)</i>';
            const changedBy = item.changed_by || 'Sistema';

            return `
                <div class="timeline-item" style="position: relative; padding-bottom: 10px;">
                    <!-- Bullet point indicating event -->
                    <span style="position: absolute; left: -26px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent, #4F46E5); border: 2px solid var(--text-main, #ffffff); box-shadow: 0 0 8px var(--accent);"></span>
                    
                    <div class="glass" style="padding: 15px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.02);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
                            <span style="font-weight: bold; color: var(--accent); font-size: 0.95rem;">
                                Ramal ${exten}
                            </span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">
                                ${date}
                            </span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 8px;">
                             Nome de usuário alterado:
                             <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${oldUser}</span>
                             <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                             <strong style="color: var(--success, #10b981);">${newUser}</strong>
                         </div>
                         <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
                             <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                             <span>Alterado por: <strong>${changedBy}</strong></span>
                         </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
