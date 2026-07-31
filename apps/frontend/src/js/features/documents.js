import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';
import { keepsHandler } from './keeps.js';

let allDocs = [];
let activeTab = 'Geral';

let currentPage = 1;
const ITEMS_PER_PAGE = 10;
let currentFilteredItems = [];

export const docsHandler = {
    async fetch() {
        try {
            currentPage = 1;
            allDocs = await apiClient.get('/documents');
            this.filterAndRender();
        } catch (err) {
            console.error('Error fetching Documents:', err);
        }
    },

    getActiveTab() {
        return activeTab;
    },

    setActiveTab(tabName) {
        activeTab = tabName;
        currentPage = 1;
        document.querySelectorAll('.docs-tabs-nav .acc-tab-btn').forEach(btn => {
            const btnText = btn.textContent.trim().toLowerCase();
            btn.classList.toggle('active', btnText === tabName.toLowerCase());
        });
        this.filterAndRender();
    },

    filterAndRender() {
        const docsHeader = document.querySelector('.docs-header');
        const searchInput = document.getElementById('doc-search');
        const btnNewDoc = document.getElementById('btn-new-doc');
        const btnNewKeep = document.getElementById('btn-new-keep');

        if (activeTab.toLowerCase() === 'dashboard') {
            if (docsHeader) docsHeader.style.display = 'none';
            dom.hide('doc-list-container');
            dom.hide('doc-keeps-container');
            dom.show('doc-dashboard-container');
            this.renderDashboard();
        } else if (activeTab.toLowerCase() === 'keeps') {
            if (docsHeader) docsHeader.style.display = 'flex';
            if (searchInput) {
                searchInput.placeholder = 'Pesquisar nas notas Keep...';
                searchInput.value = keepsHandler.getSearchQuery ? keepsHandler.getSearchQuery() : '';
            }
            if (btnNewDoc) btnNewDoc.classList.add('hidden');
            if (btnNewKeep) btnNewKeep.classList.remove('hidden');

            dom.hide('doc-list-container');
            dom.hide('doc-dashboard-container');
            dom.show('doc-keeps-container');
            keepsHandler.fetch();
        } else {
            if (docsHeader) docsHeader.style.display = 'flex';
            if (searchInput) {
                searchInput.placeholder = 'Pesquisar documentos...';
                searchInput.value = '';
            }
            if (btnNewDoc) {
                const isAdmin = window.auth && window.auth.isAdmin ? window.auth.isAdmin() : true;
                btnNewDoc.classList.toggle('role-hidden', !isAdmin);
                btnNewDoc.classList.remove('hidden');
            }
            if (btnNewKeep) btnNewKeep.classList.add('hidden');

            dom.show('doc-list-container');
            dom.hide('doc-dashboard-container');
            dom.hide('doc-keeps-container');
            const filtered = allDocs.filter(d => {
                const docCat = d.category || 'Geral';
                return docCat.toLowerCase() === activeTab.toLowerCase();
            });
            this.render(filtered);
        }
    },

    calculateRemainingTime(endDateStr) {
        if (!endDateStr || endDateStr === 'Indefinido') {
            return {
                text: 'Vigência Indeterminada',
                color: 'rgba(139, 92, 246, 0.2)',
                textColor: '#c4b5fd',
                status: 'indefinite',
                days: Infinity
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(endDateStr + 'T00:00:00');
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            const absDays = Math.abs(diffDays);
            let text = `Expirado há ${absDays} dia(s)`;
            if (absDays >= 30) {
                const months = Math.floor(absDays / 30);
                text = `Expirado há ${months} mês(es)`;
            }
            return {
                text: text,
                color: 'rgba(239, 68, 68, 0.2)',
                textColor: '#f87171',
                status: 'expired',
                days: diffDays
            };
        } else if (diffDays === 0) {
            return {
                text: 'Expira hoje!',
                color: 'rgba(249, 115, 22, 0.2)',
                textColor: '#fb923c',
                status: 'critical',
                days: diffDays
            };
        } else if (diffDays <= 30) {
            return {
                text: `Expira em ${diffDays} dia(s)`,
                color: 'rgba(245, 158, 11, 0.2)',
                textColor: '#facc15',
                status: 'critical',
                days: diffDays
            };
        } else {
            const months = Math.floor(diffDays / 30);
            let text = `Expira em ${months} mês(es)`;
            if (months >= 12) {
                const years = Math.floor(months / 12);
                const remMonths = months % 12;
                text = `Expira em ${years} ano(s)${remMonths > 0 ? ` e ${remMonths} mês(es)` : ''}`;
            }
            return {
                text: text,
                color: 'rgba(34, 197, 94, 0.2)',
                textColor: '#4ade80',
                status: 'active',
                days: diffDays
            };
        }
    },

    renderDashboard() {
        const tbody = document.getElementById('doc-dashboard-tbody');
        if (!tbody) return;

        const relevantDocs = allDocs.filter(d => {
            const cat = (d.category || '').toLowerCase();
            return cat === 'contratos' || cat === 'termo de uso';
        });

        let activeContracts = 0;
        let activeTerms = 0;
        let warningDocs = 0;
        let expiredDocs = 0;

        relevantDocs.forEach(d => {
            const cat = (d.category || '').toLowerCase();
            const timeInfo = this.calculateRemainingTime(d.end_date);

            if (timeInfo.status === 'expired') {
                expiredDocs++;
            } else if (timeInfo.status === 'critical') {
                warningDocs++;
                if (cat === 'contratos') activeContracts++;
                if (cat === 'termo de uso') activeTerms++;
            } else {
                if (cat === 'contratos') activeContracts++;
                if (cat === 'termo de uso') activeTerms++;
            }
        });

        dom.setText('doc-kpi-active-contracts', activeContracts);
        dom.setText('doc-kpi-active-terms', activeTerms);
        dom.setText('doc-kpi-warning-docs', warningDocs);
        dom.setText('doc-kpi-expired-docs', expiredDocs);

        const searchInput = document.getElementById('doc-dash-search');
        const categorySelect = document.getElementById('doc-dash-filter-category');
        const statusSelect = document.getElementById('doc-dash-filter-status');

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedCategory = categorySelect ? categorySelect.value : 'Todos';
        const selectedStatus = statusSelect ? statusSelect.value : 'Todos';

        let displayDocs = relevantDocs.filter(d => {
            if (searchTerm && !d.original_name.toLowerCase().includes(searchTerm)) {
                return false;
            }

            if (selectedCategory !== 'Todos') {
                const cat = d.category || '';
                if (cat.toLowerCase() !== selectedCategory.toLowerCase()) {
                    return false;
                }
            }

            const timeInfo = this.calculateRemainingTime(d.end_date);
            if (selectedStatus !== 'Todos') {
                if (selectedStatus === 'Ativos' && (timeInfo.status === 'expired' || timeInfo.status === 'critical')) {
                    return false;
                }
                if (selectedStatus === 'Expirando' && timeInfo.status !== 'critical') {
                    return false;
                }
                if (selectedStatus === 'Expirados' && timeInfo.status !== 'expired') {
                    return false;
                }
                if (selectedStatus === 'Indeterminado' && timeInfo.status !== 'indefinite') {
                    return false;
                }
            }

            return true;
        });

        displayDocs.sort((a, b) => {
            const timeA = this.calculateRemainingTime(a.end_date);
            const timeB = this.calculateRemainingTime(b.end_date);

            const weight = { 'expired': 1, 'critical': 2, 'active': 3, 'indefinite': 4 };
            const wA = weight[timeA.status] || 5;
            const wB = weight[timeB.status] || 5;

            if (wA !== wB) return wA - wB;
            return timeA.days - timeB.days;
        });

        if (displayDocs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;
            return;
        }

        const isAdmin = window.auth && window.auth.isAdmin();

        tbody.innerHTML = displayDocs.map(doc => {
            const icon = doc.mimetype === 'application/pdf' ? '📕' : '🖼️';
            const formattedStart = doc.start_date ? new Date(doc.start_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-';
            const formattedEnd = doc.end_date ? (doc.end_date === 'Indefinido' ? 'Indefinido' : new Date(doc.end_date + 'T00:00:00').toLocaleDateString('pt-BR')) : '-';
            const timeInfo = this.calculateRemainingTime(doc.end_date);

            const deleteBtn = isAdmin 
                ? `<button class="btn-delete" onclick="window.DocsHandler.delete(${doc.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>` 
                : '';

            return `
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${icon}</span>
                            <span title="${doc.original_name}">${doc.original_name}</span>
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.75rem;">
                            ${doc.category}
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">
                            ${doc.department || '-'}
                        </span>
                    </td>
                    <td>${formattedStart}</td>
                    <td>${formattedEnd}</td>
                    <td>
                        <span class="badge" style="background: ${timeInfo.color}; color: ${timeInfo.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${timeInfo.text}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <a href="${doc.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                Ver
                            </a>
                            ${deleteBtn}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    render(items) {
        const docListBody = document.getElementById('doc-list-body');
        if (!docListBody) return;

        const docListHead = document.getElementById('doc-list-thead');
        const showDates = activeTab.toLowerCase() === 'contratos' || activeTab.toLowerCase() === 'termo de uso';
        const isAdmin = window.auth && window.auth.isAdmin();
        const roleHiddenClass = isAdmin ? '' : 'class="role-hidden"';

        currentFilteredItems = items;
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        // Adjust currentPage if it's out of bounds
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        if (docListHead) {
            if (showDates) {
                docListHead.innerHTML = `
                    <tr>
                        <th>Nome</th>
                        <th>Setor / Depto</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Cadastro</th>
                        <th id="th-doc-actions" ${roleHiddenClass}>Ações</th>
                    </tr>
                `;
            } else {
                docListHead.innerHTML = `
                    <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th id="th-doc-actions" ${roleHiddenClass}>Ações</th>
                    </tr>
                `;
            }
        }

        if (paginatedItems.length === 0) {
            docListBody.innerHTML = `
                <tr>
                    <td colspan="${showDates ? 8 : 5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `;
            this.renderPaginationControls('doc-pagination', 0, 0);
            return;
        }

        docListBody.innerHTML = paginatedItems.map(doc => {
            const icon = doc.mimetype === 'application/pdf' ? '📕' : '🖼️';
            const sizeKB = (doc.size / 1024).toFixed(1) + ' KB';
            const formattedDate = doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : '-';
            const displayType = doc.mimetype === 'application/pdf' ? 'PDF' : 'Imagem';
            const deleteBtn = isAdmin 
                ? `<button class="btn-delete" onclick="window.DocsHandler.delete(${doc.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>` 
                : '';

            const formattedStart = doc.start_date ? new Date(doc.start_date + 'T00:00:00').toLocaleDateString('pt-BR') : '-';
            const formattedEnd = doc.end_date ? (doc.end_date === 'Indefinido' ? 'Indefinido' : new Date(doc.end_date + 'T00:00:00').toLocaleDateString('pt-BR')) : '-';
            const deptDisplay = doc.department 
                ? `<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">${doc.department}</span>`
                : `<span style="color: var(--text-muted); font-size: 0.85rem;">-</span>`;

            if (showDates) {
                return `
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${icon}</span>
                                <span title="${doc.original_name}">${doc.original_name}</span>
                            </span>
                        </td>
                        <td>${deptDisplay}</td>
                        <td>${sizeKB}</td>
                        <td>${displayType}</td>
                        <td>${formattedStart}</td>
                        <td>${formattedEnd}</td>
                        <td>${formattedDate}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${doc.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${deleteBtn}
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                return `
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${icon}</span>
                                <span title="${doc.original_name}">${doc.original_name}</span>
                            </span>
                        </td>
                        <td>${sizeKB}</td>
                        <td>${displayType}</td>
                        <td>${formattedDate}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${doc.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${deleteBtn}
                            </div>
                        </td>
                    </tr>
                `;
            }
        }).join('');

        this.renderPaginationControls('doc-pagination', totalPages, totalItems);
    },

    async handleUpload(e) {
        e.preventDefault();
        const docInput = document.getElementById('doc-file');
        const categoryInput = document.getElementById('doc-category');
        const nameInput = document.getElementById('doc-display-name');
        if (!docInput.files.length) {
            alert("Selecione um arquivo.");
            return;
        }

        const formData = new FormData();
        const category = categoryInput ? categoryInput.value : 'Geral';
        formData.append('category', category);
        formData.append('customName', nameInput ? nameInput.value : '');
        formData.append('document', docInput.files[0]);

        const categoryLower = category.toLowerCase();
        if (categoryLower === 'contratos' || categoryLower === 'termo de uso') {
            const startDateInput = document.getElementById('doc-start-date');
            const endDateInput = document.getElementById('doc-end-date');
            const indefiniteInput = document.getElementById('doc-indefinite');
            const departmentInput = document.getElementById('doc-department');

            if (startDateInput && startDateInput.value) {
                formData.append('startDate', startDateInput.value);
            }
            if (indefiniteInput && indefiniteInput.checked) {
                formData.append('endDate', 'Indefinido');
            } else if (endDateInput && endDateInput.value) {
                formData.append('endDate', endDateInput.value);
            }
            if (departmentInput && departmentInput.value.trim()) {
                formData.append('department', departmentInput.value.trim());
            }
        }

        try {
            await apiClient.upload('/documents', formData);
            dom.hide('modal-upload');
            document.getElementById('doc-form').reset();
            const datesContainer = document.getElementById('doc-dates-container');
            if (datesContainer) datesContainer.style.display = 'none';
            const endDateInput = document.getElementById('doc-end-date');
            if (endDateInput) endDateInput.disabled = false;
            const deptInput = document.getElementById('doc-department');
            if (deptInput) deptInput.value = '';
            dom.setText('file-name-display', 'Respeite o formato .png ou .pdf');
            this.fetch();
            alert('Documento adicionado com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao subir arquivo.');
        }
    },

    async delete(id) {
        if (!confirm('Deletar este documento?')) return;
        try {
            await apiClient.delete(`/documents/${id}`);
            this.fetch();
        } catch (error) {
            alert('Erro ao excluir documento.');
        }
    },

    search(term) {
        if (activeTab.toLowerCase() === 'dashboard') {
            this.renderDashboard();
        } else {
            currentPage = 1;
            const filtered = allDocs.filter(d => {
                const docCat = d.category || 'Geral';
                return docCat.toLowerCase() === activeTab.toLowerCase() && d.original_name.toLowerCase().includes(term);
            });
            this.render(filtered);
        }
    },

    changePage(page) {
        currentPage = page;
        this.render(currentFilteredItems);
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
                    onclick="window.DocsHandler.changePage(${currentPage - 1})"
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
                            onclick="window.DocsHandler.changePage(${i})">
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
                    onclick="window.DocsHandler.changePage(${currentPage + 1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;

        // Pagination Info
        const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
        html += `
            <span class="pagination-info">
                Exibindo ${start}-${end} de ${totalItems}
            </span>
        `;

        container.innerHTML = html;
    }
};
