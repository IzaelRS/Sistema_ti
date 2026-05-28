import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';

let allExtensions = [];
let currentPage = 1;
let itemsPerPage = 100;
let currentFilteredItems = [];

export const telephonyHandler = {
    async fetch() {
        const tbody = document.getElementById('telephony-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando ramais...</td></tr>';
        }
        try {
            currentPage = 1;
            allExtensions = await apiClient.get('/telephony/extensions');
            this.render(allExtensions);
        } catch (err) {
            console.error('Error fetching telephony extensions:', err);
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar ramais: ${err.message || 'Erro de rede'}</td></tr>`;
            }
        }
    },

    render(items) {
        const tbody = document.getElementById('telephony-table-body');
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
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum ramal encontrado.
                    </td>
                </tr>
            `;
            this.renderPaginationControls('telephony-pagination', 0, 0);
            return;
        }

        tbody.innerHTML = paginatedItems.map(sip => {
            const exten = sip.exten || '-';
            const nome = sip.nome || '-';
            const ddr = sip.ddr || '-';
            const username = sip.Username || '-';
            const secret = sip.Secret || '';
            const outputRoute = sip.regra_saida_nome 
                ? `<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${sip.regra_saida_nome}</span>` 
                : '-';
            const observacao = sip.observacao || '-';

            // Escape secret to prevent breaking HTML string
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

        this.renderPaginationControls('telephony-pagination', totalPages, totalItems);
    },

    search(term) {
        currentPage = 1;
        const filtered = allExtensions.filter(sip => {
            return (sip.exten || '').toLowerCase().includes(term) ||
                (sip.nome || '').toLowerCase().includes(term) ||
                (sip.Username || '').toLowerCase().includes(term) ||
                (sip.ddr || '').toLowerCase().includes(term) ||
                (sip.observacao || '').toLowerCase().includes(term);
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

    toggleSecret(id, secret) {
        const textSpan = document.getElementById(`secret-txt-${id}`);
        const iconSvg = document.getElementById(`secret-icon-${id}`);
        if (!textSpan || !iconSvg) return;

        if (textSpan.textContent === '••••••••') {
            textSpan.textContent = secret;
            // Change SVG to "eye-off"
            iconSvg.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            textSpan.textContent = '••••••••';
            // Change SVG back to "eye"
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
    }
};
