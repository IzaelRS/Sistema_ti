import { apiClient } from '../api/client.js';
import { auth } from '../api/auth.js';
import { dom } from '../utils/dom.js';

let allUsers = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentFilteredUsers = [];

export const usersHandler = {
    async fetch() {
        try {
            allUsers = await apiClient.get('/users');
            this.render(allUsers);
        } catch (err) {
            console.error('Error fetching Users:', err);
        }
    },

    getUsers() {
        return allUsers;
    },

    setPageSize(size) {
        itemsPerPage = size;
        currentPage = 1;
        this.render(currentFilteredUsers);
    },

    changePage(page) {
        currentPage = page;
        this.render(currentFilteredUsers);
    },

    render(items) {
        currentFilteredUsers = items || [];
        const tableBody = document.getElementById('user-table-body');
        if (!tableBody) return;

        const totalItems = currentFilteredUsers.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = currentFilteredUsers.slice(startIndex, startIndex + itemsPerPage);

        if (paginatedUsers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted);">Nenhum usuário encontrado.</td></tr>';
            this.renderPaginationControls('users-pagination', 0, 0);
            return;
        }

        tableBody.innerHTML = paginatedUsers.map(user => {
            const isUserAdmin = user.role === 'Administrador';
            const actionsHtml = auth.isAdmin() ? `
                <td onclick="event.stopPropagation()">
                    <div class="btn-actions-container">
                        <button class="btn-icon" onclick="window.UsersHandler.openEditModal(${user.id})" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="btn-icon delete" onclick="window.UsersHandler.delete(${user.id})" title="Excluir" ${isUserAdmin ? 'disabled style="opacity:0.3;cursor:not-allowed"' : ''}>
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>` : '';
            return `
            <tr>
                <td><strong>${user.name}</strong></td>
                <td>${user.email}</td>
                <td><span class="badge" style="background: ${user.role === 'Administrador' ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}">${user.role}</span></td>
                ${actionsHtml}
            </tr>`;
        }).join('');

        this.renderPaginationControls('users-pagination', totalPages, totalItems);
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
                <select class="form-control glass" onchange="window.UsersHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
                    <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
                </select>
            </div>
        `;

        // Prev Button
        html += `
            <button class="pagination-btn" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="window.UsersHandler.changePage(${currentPage - 1})"
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
                            onclick="window.UsersHandler.changePage(${i})">
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
                    onclick="window.UsersHandler.changePage(${currentPage + 1})"
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

    openEditModal(id) {
        const user = allUsers.find(u => u.id === id);
        if (!user) return;

        dom.setText('modal-user-title', 'Editar Usuário');
        dom.setValue('user-id-form', user.id);
        dom.setValue('user-name-form', user.name);
        dom.setValue('user-email-form', user.email);
        dom.setValue('user-password-form', '');
        dom.setValue('user-role-form', user.role);

        dom.show('modal-user');
    },

    async save(e) {
        e.preventDefault();
        const id = dom.getValue('user-id-form');
        const data = {
            name: dom.getValue('user-name-form'),
            email: dom.getValue('user-email-form'),
            password: dom.getValue('user-password-form'),
            role: dom.getValue('user-role-form')
        };

        try {
            if (id) {
                await apiClient.put(`/users/${id}`, data);
            } else {
                await apiClient.post('/users', data);
            }
            dom.hide('modal-user');
            document.getElementById('user-form').reset();
            this.fetch();
            alert(id ? 'Usuário atualizado!' : 'Usuário criado!');
        } catch (err) {
            console.error('Erro ao salvar usuário:', err);
            alert('Erro: ' + err.message);
        }
    },

    async delete(id) {
        if (!confirm('Deseja excluir este usuário?')) return;
        try {
            await apiClient.delete(`/users/${id}`);
            this.fetch();
        } catch (err) {
            alert('Erro ao excluir: ' + err.message);
        }
    },

    search(term) {
        currentPage = 1;
        const filtered = allUsers.filter(u =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        );
        this.render(filtered);
    }
};
