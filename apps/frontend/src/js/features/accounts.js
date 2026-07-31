import { apiClient } from '../api/client.js';
import { auth } from '../api/auth.js';
import { dom } from '../utils/dom.js';

let allAccounts = [];
let allCategories = [];
let accountsViewMode = 'list';
let calendarSubView = 'month';
let currentCalendarDate = new Date();

let currentPage = 1;
let itemsPerPage = 10;
let currentFilteredItems = [];

export const accountsHandler = {
    async fetch() {
        try {
            currentPage = 1;
            allAccounts = await apiClient.get('/accounts');
            await this.fetchCategories();
            this.initDashboardMultiselects();
            this.populateCompanyFilter();
            this.handleSearch();
            this.checkAccountAlerts();
        } catch (err) {
            console.error('Falha ao obter contas', err);
        }
    },

    async fetchCategories() {
        try {
            allCategories = await apiClient.get('/account-categories');
            this.populateCategoryFilter();
            this.populateCategoryModalSelect();
            this.renderCategoriesList();
        } catch (err) {
            console.error('Falha ao obter categorias de contas', err);
        }
    },

    populateCategoryFilter() {
        const container = document.getElementById('dash-filter-category-dynamic-options');
        if (container) {
            const checkedCategories = new Set();
            container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                checkedCategories.add(cb.value);
            });

            const dbCategoryNames = (allCategories || []).map(c => c.name);
            const accountCategoryNames = (allAccounts || []).map(acc => acc.category).filter(Boolean);
            const categories = [...new Set([...dbCategoryNames, ...accountCategoryNames])].sort((a, b) => a.localeCompare(b));

            let html = '';
            categories.forEach(cat => {
                const isChecked = checkedCategories.has(cat) ? 'checked' : '';
                html += `<label class="multiselect-option"><input type="checkbox" value="${cat}" ${isChecked}> <span>${cat}</span></label>`;
            });
            container.innerHTML = html;

            this.setupMultiselectListeners('dash-filter-category');
        }
    },

    populateCategoryModalSelect() {
        const select = document.getElementById('account-category');
        if (select) {
            const currentValue = select.value;
            const dbCategoryNames = (allCategories || []).map(c => c.name);
            const accountCategoryNames = (allAccounts || []).map(acc => acc.category).filter(Boolean);
            const categories = [...new Set([...dbCategoryNames, ...accountCategoryNames])].sort((a, b) => a.localeCompare(b));

            let html = '';
            categories.forEach(cat => {
                const selected = cat === currentValue ? 'selected' : '';
                html += `<option value="${cat}" ${selected}>${cat}</option>`;
            });
            select.innerHTML = html;
        }
    },

    renderCategoriesList() {
        const tableBody = document.getElementById('account-categories-table-body');
        if (!tableBody) return;

        if (!allCategories || allCategories.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma categoria cadastrada.</td></tr>';
            return;
        }

        let html = '';
        allCategories.forEach(cat => {
            const isSystem = cat.is_system;
            const badgeBg = isSystem ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)';
            const badgeColor = isSystem ? '#60a5fa' : '#34d399';
            const badgeLabel = isSystem ? 'Sistema' : 'Personalizada';

            const deleteBtn = auth.isAdmin() ? `
                <button class="btn-icon" onclick="window.AccountsHandler.deleteCategory(${cat.id})" title="Excluir Categoria" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; color: #ef4444;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            ` : '-';

            html += `
                <tr>
                    <td><strong>${cat.name}</strong></td>
                    <td><span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; font-size: 0.75rem;">${badgeLabel}</span></td>
                    <td style="text-align: right; display: flex; justify-content: flex-end;">${deleteBtn}</td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    },

    async saveCategory(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('input-new-category-name');
        if (!input) return;

        const name = input.value.trim();
        if (!name) return;

        try {
            await apiClient.post('/account-categories', { name });
            input.value = '';
            await this.fetchCategories();
            this.handleSearch();
            alert('Categoria criada com sucesso!');
        } catch (err) {
            alert('Erro ao criar categoria: ' + (err.message || 'Erro desconhecido.'));
        }
    },

    deleteCategory(id) {
        const targetId = parseInt(id, 10);
        const cat = allCategories.find(c => c.id === targetId || String(c.id) === String(id));
        if (!cat) {
            console.error('Categoria não encontrada para exclusão:', id);
            return;
        }

        const linkedAccounts = allAccounts.filter(acc => acc.category === cat.name);
        const linkedCount = linkedAccounts.length;

        const otherCategories = allCategories.filter(c => String(c.id) !== String(cat.id));

        if (otherCategories.length === 0) {
            alert('Não é possível excluir esta categoria porque não existem outras categorias para as quais transferir as contas.');
            return;
        }

        const selectTarget = document.getElementById('select-transfer-category-target');
        if (selectTarget) {
            selectTarget.innerHTML = otherCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        }

        const warningText = document.getElementById('delete-category-warning-text');
        if (warningText) {
            if (linkedCount > 0) {
                warningText.innerHTML = `Existem <strong>${linkedCount}</strong> conta(s) vinculada(s) à categoria <strong>"${cat.name}"</strong>.<br>Selecione para qual categoria deseja transferi-las antes de prosseguir com a exclusão:`;
            } else {
                warningText.innerHTML = `Confirma a exclusão da categoria <strong>"${cat.name}"</strong>?`;
            }
        }

        dom.setValue('delete-category-id', cat.id);
        dom.show('modal-delete-category');
    },

    async confirmDeleteCategory() {
        const id = dom.getValue('delete-category-id');
        const transferTo = dom.getValue('select-transfer-category-target');
        if (!id) return;

        try {
            const url = `/account-categories/${id}${transferTo ? `?transferTo=${encodeURIComponent(transferTo)}` : ''}`;
            await apiClient.delete(url);
            dom.hide('modal-delete-category');
            alert('Categoria excluída e contas transferidas com sucesso!');
            await this.fetch();
            this.renderCategoriesList();
        } catch (err) {
            alert('Erro ao excluir categoria: ' + (err.message || 'Erro desconhecido.'));
        }
    },

    populateCompanyFilter() {
        const container = document.getElementById('dash-filter-company-dynamic-options');
        if (container) {
            // Keep track of currently checked companies
            const checkedCompanies = new Set();
            container.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                checkedCompanies.add(cb.value);
            });

            // Get unique company names
            const companies = [...new Set(allAccounts.map(acc => acc.company_name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
            
            let html = '';
            companies.forEach(company => {
                const isChecked = checkedCompanies.has(company) ? 'checked' : '';
                html += `<label class="multiselect-option"><input type="checkbox" value="${company}" ${isChecked}> <span>${company}</span></label>`;
            });
            container.innerHTML = html;

            // Re-setup checkbox change listeners for the company name dropdown
            this.setupMultiselectListeners('dash-filter-company');
        }
    },

    setupMultiselectListeners(prefix) {
        const container = document.getElementById(`${prefix}-container`);
        if (!container) return;

        const trigger = document.getElementById(`${prefix}-trigger`);
        const dropdown = document.getElementById(`${prefix}-dropdown`);
        if (!trigger || !dropdown) return;

        // Toggle dropdown on trigger click
        if (!trigger.dataset.listenerBound) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close all other multiselect dropdowns first
                document.querySelectorAll('.multiselect-dropdown').forEach(d => {
                    if (d !== dropdown) d.classList.add('hidden');
                });
                dropdown.classList.toggle('hidden');
            });
            trigger.dataset.listenerBound = 'true';
        }

        // Checkbox behaviors
        const todosCheckbox = dropdown.querySelector('input[value="Todos"]');
        const otherCheckboxes = Array.from(dropdown.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.value !== 'Todos');

        const updateTriggerLabel = () => {
            const checkedOptions = otherCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
            const labelSpan = trigger.querySelector('.trigger-label');
            if (todosCheckbox.checked || (otherCheckboxes.length > 0 && checkedOptions.length === otherCheckboxes.length)) {
                todosCheckbox.checked = true;
                if (labelSpan) labelSpan.innerText = 'Todos';
            } else if (checkedOptions.length === 0) {
                if (labelSpan) labelSpan.innerText = 'Nenhum';
            } else if (checkedOptions.length === 1) {
                if (labelSpan) labelSpan.innerText = checkedOptions[0];
            } else {
                if (labelSpan) labelSpan.innerText = `${checkedOptions.length} selecionados`;
            }
        };

        // When "Todos" is clicked
        if (todosCheckbox && !todosCheckbox.dataset.listenerBound) {
            todosCheckbox.addEventListener('change', () => {
                otherCheckboxes.forEach(cb => {
                    cb.checked = todosCheckbox.checked;
                });
                updateTriggerLabel();
                this.renderDashboard();
            });
            todosCheckbox.dataset.listenerBound = 'true';
        }

        // When any other checkbox is clicked
        otherCheckboxes.forEach(cb => {
            if (!cb.dataset.listenerBound) {
                cb.addEventListener('change', () => {
                    const allChecked = otherCheckboxes.every(c => c.checked);
                    if (allChecked) {
                        todosCheckbox.checked = true;
                    } else {
                        todosCheckbox.checked = false;
                    }
                    updateTriggerLabel();
                    this.renderDashboard();
                });
                cb.dataset.listenerBound = 'true';
            }
        });

        // Initialize label on load
        updateTriggerLabel();
    },

    initDashboardMultiselects() {
        this.setupMultiselectListeners('dash-filter-category');

        // Add document click listener to close dropdowns when clicking outside
        if (!window.multiselectOutsideClickListenerBound) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.custom-multiselect-container')) {
                    document.querySelectorAll('.multiselect-dropdown').forEach(d => {
                        d.classList.add('hidden');
                    });
                }
            });
            window.multiselectOutsideClickListenerBound = true;
        }
    },

    getMultiselectValues(prefix) {
        const dropdown = document.getElementById(`${prefix}-dropdown`);
        if (!dropdown) return ['Todos'];
        const todosCheckbox = dropdown.querySelector('input[value="Todos"]');
        if (todosCheckbox && todosCheckbox.checked) {
            return ['Todos'];
        }
        return Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value)
            .filter(val => val !== 'Todos');
    },

    resetMultiselects() {
        ['dash-filter-category', 'dash-filter-company'].forEach(prefix => {
            const dropdown = document.getElementById(`${prefix}-dropdown`);
            if (dropdown) {
                const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    cb.checked = (cb.value === 'Todos');
                });
                // Update trigger label
                const trigger = document.getElementById(`${prefix}-trigger`);
                if (trigger) {
                    const labelSpan = trigger.querySelector('.trigger-label');
                    if (labelSpan) labelSpan.innerText = 'Todos';
                }
            }
        });
    },

    getAccounts() {
        return allAccounts;
    },

    setAccountsViewMode(mode) {
        accountsViewMode = mode;
        this.handleSearch();
    },

    setCalendarSubView(subMode) {
        calendarSubView = subMode;
        this.handleSearch();
    },

    shiftCalendarDate(dir) {
        if (calendarSubView === 'day') {
            currentCalendarDate.setDate(currentCalendarDate.getDate() + dir);
        } else if (calendarSubView === 'month') {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + dir);
        } else if (calendarSubView === 'year') {
            currentCalendarDate.setFullYear(currentCalendarDate.getFullYear() + dir);
        }

        // Sync Dropdowns (Main Search Bar & Calendar Sidebar)
        dom.setValue('filter-day', currentCalendarDate.getDate());
        // Keep both sets of dropdowns in sync
        dom.setValue('filter-month', currentCalendarDate.getMonth());
        dom.setValue('filter-year', currentCalendarDate.getFullYear());

        this.handleSearch();
    },

    handleFilterChange(isFromCalendarSidebar = false) {
        if (isFromCalendarSidebar) {
            const dy = dom.getValue('filter-cal-year') ? parseInt(dom.getValue('filter-cal-year')) : currentCalendarDate.getFullYear();
            const dm = dom.getValue('filter-cal-month') ? parseInt(dom.getValue('filter-cal-month')) : currentCalendarDate.getMonth();
            currentCalendarDate = new Date(dy, dm, 1);
        } else {
            const dy = dom.getValue('filter-year') ? parseInt(dom.getValue('filter-year')) : currentCalendarDate.getFullYear();
            const dm = dom.getValue('filter-month') ? parseInt(dom.getValue('filter-month')) : currentCalendarDate.getMonth();
            const dd = dom.getValue('filter-day') ? parseInt(dom.getValue('filter-day')) : currentCalendarDate.getDate();
            currentCalendarDate = new Date(dy, dm, dd);
        }

        // Keep both sets of dropdowns in sync
        dom.setValue('filter-month', currentCalendarDate.getMonth());
        dom.setValue('filter-year', currentCalendarDate.getFullYear());

        this.handleSearch();
    },

    handleSearch() {
        const term = (dom.getValue('accounts-search') || '').toLowerCase();

        let filtered = allAccounts.filter(acc => {
            return acc.company_name.toLowerCase().includes(term) ||
                (acc.description && acc.description.toLowerCase().includes(term));
        });

        if (accountsViewMode === 'list') {
            currentPage = 1;
            const statusFilter = dom.getValue('filter-status') || '';
            const useDateToggle = document.getElementById('filter-date-toggle');
            const useDateFilter = useDateToggle ? useDateToggle.checked : false;

            const dYear = currentCalendarDate.getFullYear();
            // Calendar is 0-indexed for month, strings from forms/API might differ. Let's use 0-indexed.
            const dMonth = currentCalendarDate.getMonth();
            const dDay = currentCalendarDate.getDate();

            filtered = filtered.filter(acc => {
                // Status Filter
                if (statusFilter && acc.status !== statusFilter) {
                    return false;
                }

                if (!useDateFilter) return true;

                if (!acc.due_date) return true;
                const [y, m, d] = acc.due_date.split('-');
                const accYear = parseInt(y, 10);
                const accMonth = parseInt(m, 10) - 1; // 0-indexed
                const accDay = parseInt(d, 10);

                if (acc.type === 'Único') {
                    return accYear === dYear && accMonth === dMonth && accDay === dDay;
                } else if (acc.type === 'Recorrente') {
                    return accDay === dDay;
                }
                return true;
            });

            this.renderAccountsList(filtered);
        } else if (accountsViewMode === 'notificacoes') {
            this.renderNotifications();
        } else if (accountsViewMode === 'dashboard') {
            this.renderDashboard();
        } else if (accountsViewMode === 'configuracoes') {
            this.renderCategoriesList();
        } else {
            this.renderCalendarWrapper(filtered);
        }
    },

    checkAccountAlerts() {
        let hasAlerts = false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        allAccounts.forEach(acc => {
            const status = (acc.status || '').trim().toLowerCase();
            const pStatus = (acc.payment_status || '').trim().toLowerCase();
            if (status === 'on' && pStatus === 'pendente' && acc.due_date) {
                const [y, m, d] = acc.due_date.split('-');
                let due = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));

                due.setHours(0, 0, 0, 0);
                if (due.getTime() <= today.getTime()) {
                    hasAlerts = true;
                }
            }
        });

        const bell = document.getElementById('icon-alert-bell');
        if (bell) {
            if (hasAlerts) bell.classList.add('alert-pulse');
            else bell.classList.remove('alert-pulse');
        }
    },

    renderNotifications() {
        const listBody = document.getElementById('accounts-notifications-body');
        if (!listBody) return;
        listBody.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let urgentAccounts = allAccounts.filter(acc => {
            const status = (acc.status || '').trim().toLowerCase();
            const pStatus = (acc.payment_status || '').trim().toLowerCase();
            if (status !== 'on' || pStatus !== 'pendente' || !acc.due_date) return false;

            const [y, m, d] = acc.due_date.split('-');
            let due = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
            due.setHours(0, 0, 0, 0);
            return due.getTime() <= today.getTime();
        });

        if (urgentAccounts.length === 0) {
            listBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';
            return;
        }

        urgentAccounts.forEach(acc => {
            const tr = document.createElement('tr');
            let formattedDate = 'Sem Data';
            if (acc.due_date) {
                const parts = acc.due_date.split('-');
                if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            const actionsHtml = auth.isAdmin() ? `
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${acc.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            ` : '';

            tr.innerHTML = `
                <td>
                    <strong>${acc.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 0.7rem; padding: 2px 6px;">
                            URGENTE
                        </span>
                    </div>
                </td>
                <td><span class="badge" style="background:${acc.type === 'Recorrente' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(234, 179, 8, 0.2)'}; color:${acc.type === 'Recorrente' ? '#818cf8' : '#eab308'}">${acc.type}</span></td>
                <td style="color: #ef4444; font-weight: bold;">${formattedDate}</td>
                <td><strong>R$ ${parseFloat(acc.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                <td><span class="badge" style="background:rgba(234, 179, 8, 0.2); color:#eab308">${acc.payment_status}</span></td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${acc.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${actionsHtml}
                    </div>
                </td>
            `;
            listBody.appendChild(tr);
        });
    },
    renderAccountsList(accounts) {
        const listBody = document.getElementById('accounts-table-body');
        if (!listBody) return;
        listBody.innerHTML = '';

        // Ensure sidebar mini calendar is rendered even if not in Calendar tab
        this.renderSidebarMiniCalendar();

        currentFilteredItems = accounts;
        const totalItems = accounts.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Adjust currentPage if it's out of bounds
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);

        if (paginatedAccounts.length === 0) {
            listBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>';
            this.renderPaginationControls('accounts-list-pagination', 0, 0);
            this.renderDashboard();
            return;
        }

        paginatedAccounts.forEach(acc => {
            const tr = document.createElement('tr');
            let formattedDate = 'Sem Data';
            if (acc.due_date) {
                const parts = acc.due_date.split('-');
                if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            const isOff = acc.status === 'Off';

            const actionsHtml = auth.isAdmin() ? `
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${acc.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon" onclick="window.AccountsHandler.delete(${acc.id})" title="Excluir" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            ` : '';

            tr.innerHTML = `
                <td>
                    <strong>${acc.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; font-size: 0.7rem; padding: 2px 6px;">
                            ${acc.category || 'Outros'}
                        </span>
                    </div>
                </td>
                <td>
                    <span class="badge" style="background:${acc.type === 'Recorrente' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(234, 179, 8, 0.2)'}; color:${acc.type === 'Recorrente' ? '#818cf8' : '#eab308'}">
                        ${acc.type}
                    </span>
                </td>
                <td>${formattedDate}</td>
                <td>
                    <strong>R$ ${parseFloat(acc.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </td>
                <td>
                    <span class="badge" style="background:${isOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}; color:${isOff ? '#f87171' : '#4ade80'}">
                        ${acc.status}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:${acc.payment_status === 'Pago' ? 'rgba(34, 197, 94, 0.2)' : acc.payment_status === 'Pendente' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color:${acc.payment_status === 'Pago' ? '#4ade80' : acc.payment_status === 'Pendente' ? '#eab308' : '#f87171'}">
                        ${acc.payment_status || 'Pendente'}
                    </span>
                </td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${acc.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${actionsHtml}
                    </div>
                </td>
            `;
            listBody.appendChild(tr);
        });

        // Render pagination controls
        this.renderPaginationControls('accounts-list-pagination', totalPages, totalItems);

        // Always refresh dashboard when accounts filter changes
        this.renderDashboard();
    },

    renderDashboard() {
        if (accountsViewMode !== 'dashboard') return;

        this.initDashboardMultiselects();

        const fStartStr = dom.getValue('dash-filter-start');
        const fEndStr = dom.getValue('dash-filter-end');
        const fType = dom.getValue('dash-filter-type') || 'Todos';
        const fStatus = dom.getValue('dash-filter-status') || 'Todos';
        const fPayment = dom.getValue('dash-filter-payment') || 'Todos';
        const fCategories = this.getMultiselectValues('dash-filter-category');
        const fCompanies = this.getMultiselectValues('dash-filter-company');

        // Usar T00:00:00 e T23:59:59 para garantir que pegamos o dia todo pelo fuso local
        let fStart = fStartStr ? new Date(fStartStr + "T00:00:00") : null;
        let fEnd = fEndStr ? new Date(fEndStr + "T23:59:59") : null;

        // Se nenhuma data for fornecida, por padrao filtramos o mes atual
        if (!fStart && !fEnd) {
            const now = new Date();
            fStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
            fEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        } else if (!fStart) {
            fStart = new Date(2000, 0, 1);
        } else if (!fEnd) {
            fEnd = new Date(2100, 11, 31);
        }

        let totalValor = 0;
        let countContas = 0;
        let uniqueTipos = new Set();
        let uniqueEmpresas = new Set();

        // Novas Métricas
        let totalPago = 0;
        let totalPendente = 0;
        let maiorValor = 0;
        let maiorNome = '-';
        let totalFixo = 0;
        let totalVariavel = 0;

        let companiesSum = {};
        let categoriesSum = {};

        // Time Series Object for Chart (Key = "YYYY-MM")
        let timeSeriesData = {};

        allAccounts.forEach(acc => {
            if (!acc.due_date) return;

            // Filtros Estritos (Dropdowns)
            if (fType !== 'Todos' && acc.type !== fType) return;
            if (fStatus !== 'Todos' && acc.status !== fStatus) return;
            if (fPayment !== 'Todos' && acc.payment_status !== fPayment) return;
            
            // Filtros Multi-selecionáveis
            if (!fCategories.includes('Todos')) {
                if (fCategories.length === 0) return; // Nothing selected
                const cat = acc.category || 'Outros';
                if (!fCategories.includes(cat)) return;
            }
            if (!fCompanies.includes('Todos')) {
                if (fCompanies.length === 0) return; // Nothing selected
                if (!fCompanies.includes(acc.company_name)) return;
            }

            // Contabilizar ocorrencias no intervalo de datas usando a regra real das recorrentes ou unicas
            let occurrences = 0;
            let loopDate = new Date(fStart);
            loopDate.setHours(0, 0, 0, 0);

            let endLoopDate = new Date(fEnd);
            endLoopDate.setHours(0, 0, 0, 0);

            // Cap maximo de limitacao para prevenir freeze
            let maxDays = 3650;
            while (loopDate <= endLoopDate && maxDays > 0) {
                if (this.isEventOnDate(acc, loopDate.getFullYear(), loopDate.getMonth(), loopDate.getDate())) {
                    occurrences++;

                    // Accumulate Time Series Data for the specific month this occurrence happens
                    const monthKey = `${loopDate.getFullYear()}-${String(loopDate.getMonth() + 1).padStart(2, '0')}`;
                    if (!timeSeriesData[monthKey]) {
                        timeSeriesData[monthKey] = {
                            total: 0,
                            pago: 0,
                            pendente: 0,
                            fixo: 0,
                            variavel: 0
                        };
                    }

                    const accVal = parseFloat(acc.value || 0);
                    timeSeriesData[monthKey].total += accVal;
                    if (acc.payment_status === 'Pago') timeSeriesData[monthKey].pago += accVal;
                    if (acc.payment_status === 'Pendente') timeSeriesData[monthKey].pendente += accVal;
                    if (acc.type === 'Recorrente') timeSeriesData[monthKey].fixo += accVal;
                    if (acc.type === 'Único') timeSeriesData[monthKey].variavel += accVal;
                }
                loopDate.setDate(loopDate.getDate() + 1);
                maxDays--;
            }

            // Se a conta "aconteceu" nesse intervalo, soma nas metricas
            if (occurrences > 0) {
                const totalAccVal = parseFloat(acc.value || 0) * occurrences;
                totalValor += totalAccVal;
                countContas += occurrences;

                uniqueTipos.add(acc.category || 'Outros');
                uniqueEmpresas.add(acc.company_name);

                if (acc.payment_status === 'Pago') totalPago += totalAccVal;
                if (acc.payment_status === 'Pendente') totalPendente += totalAccVal;

                if (acc.type === 'Recorrente') totalFixo += totalAccVal;
                if (acc.type === 'Único') totalVariavel += totalAccVal;

                // Checando a maior despesa (comparando o valor *da parcela daquela conta* no intervalo ou o montante se quiser. Vou usar o total que ela gerou no período)
                if (totalAccVal > maiorValor) {
                    maiorValor = totalAccVal;
                    maiorNome = acc.company_name;
                }

                // Tier lists summations
                const cat = acc.category || 'Outros';
                categoriesSum[cat] = (categoriesSum[cat] || 0) + totalAccVal;

                const comp = acc.company_name || 'Sem Empresa';
                companiesSum[comp] = (companiesSum[comp] || 0) + totalAccVal;
            }
        });

        dom.setText('dash-metric-valor', 'R$ ' + totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        dom.setText('dash-metric-contas', countContas.toString());
        dom.setText('dash-metric-tipos', uniqueTipos.size.toString());
        dom.setText('dash-metric-empresas', uniqueEmpresas.size.toString());

        // Atualizando DOM das novas métricas
        dom.setText('dash-metric-pago', 'R$ ' + totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        dom.setText('dash-metric-pendente', 'R$ ' + totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        dom.setText('dash-metric-maior-valor', 'R$ ' + maiorValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        dom.setText('dash-metric-maior-nome', maiorNome);

        dom.setText('dash-metric-fixo', 'R$ ' + totalFixo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        dom.setText('dash-metric-variavel', 'R$ ' + totalVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        // Render Tier Lists
        const sortEmpresas = dom.getValue('dash-sort-empresas') || 'desc';
        const sortCategorias = dom.getValue('dash-sort-categorias') || 'desc';

        this.renderTierList('dash-list-empresas', companiesSum, sortEmpresas);
        this.renderTierList('dash-list-categorias', categoriesSum, sortCategorias);

        // Render Time Chart
        this.renderTimeChart(timeSeriesData);
    },

    renderTimeChart(timeSeriesData) {
        if (window.timeChartInstance) window.timeChartInstance.destroy();

        const ctxTime = document.getElementById('chart-dashboard-time');
        if (!ctxTime) return;

        // Sort keys chronologically
        const labels = Object.keys(timeSeriesData).sort();

        // Format labels to readable MM/YYYY
        const displayLabels = labels.map(key => {
            const [y, m] = key.split('-');
            return `${m}/${y}`;
        });

        const dataTotal = labels.map(key => timeSeriesData[key].total);
        const dataPago = labels.map(key => timeSeriesData[key].pago);
        const dataPendente = labels.map(key => timeSeriesData[key].pendente);
        const dataFixo = labels.map(key => timeSeriesData[key].fixo);
        const dataVariavel = labels.map(key => timeSeriesData[key].variavel);

        const chartConfig = {
            type: 'line',
            data: {
                labels: displayLabels,
                datasets: [
                    {
                        label: 'Valor Total (R$)',
                        data: dataTotal,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#3b82f6',
                        pointRadius: 4,
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Total Pago (R$)',
                        data: dataPago,
                        borderColor: '#4ade80',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: '#4ade80',
                        pointRadius: 4,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Total Pendente (R$)',
                        data: dataPendente,
                        borderColor: '#facc15',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: '#facc15',
                        pointRadius: 4,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Custo Fixo (R$)',
                        data: dataFixo,
                        borderColor: '#60a5fa',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: '#60a5fa',
                        pointRadius: 4,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Custo Variável (R$)',
                        data: dataVariavel,
                        borderColor: '#c084fc',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: '#c084fc',
                        pointRadius: 4,
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#e2e8f0',
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#94a3b8',
                            callback: function (value, index, values) {
                                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#94a3b8',
                        }
                    }
                }
            }
        };

        window.timeChartInstance = new Chart(ctxTime.getContext('2d'), chartConfig);
    },

    renderTierList(containerId, dataMap, sortOrder) {
        const listEl = document.getElementById(containerId);
        if (!listEl) return;

        const entries = Object.entries(dataMap);
        if (entries.length === 0) {
            listEl.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';
            return;
        }

        // Ordenar
        entries.sort((a, b) => {
            if (sortOrder === 'asc') return a[1] - b[1];
            return b[1] - a[1];
        });

        // Limitar a apenas os 10 primeiros
        const top10 = entries.slice(0, 10);

        let html = '';
        top10.forEach(([name, val], index) => {
            const isTop = (index === 0 && sortOrder === 'desc');
            const prefix = isTop ? '🏆 ' : (index + 1) + '. ';
            const color = isTop ? '#fbbf24' : 'var(--text-main)';
            const fw = isTop ? 'bold' : 'normal';

            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${fw}; color: ${color}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${name}">
                        ${prefix}${name}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            `;
        });

        listEl.innerHTML = html;
    },

    renderCharts(categoriesSum) {
        if (window.catChartInstance) window.catChartInstance.destroy();
        if (window.forecastChartInstance) window.forecastChartInstance.destroy();

        const ctxCat = document.getElementById('chart-category');
        if (ctxCat) {
            const dataCat = {
                labels: Object.keys(categoriesSum),
                datasets: [{
                    data: Object.values(categoriesSum),
                    backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
                    borderWidth: 0
                }]
            };
            window.catChartInstance = new Chart(ctxCat.getContext('2d'), {
                type: 'doughnut',
                data: dataCat,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } }
                }
            });
        }

        const ctxFore = document.getElementById('chart-forecast');
        if (ctxFore) {
            // Very simple forecast: generate past 6 and next 6 months total Recorrente
            const labels = [];
            const dataVal = [];
            let today = new Date();
            for (let i = -5; i <= 6; i++) {
                let d = new Date(today.getFullYear(), today.getMonth() + i, 1);
                labels.push(d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }));

                let mTotal = 0;
                allAccounts.forEach(acc => {
                    if (!acc.due_date || acc.status === 'Off') return;
                    const [cY, cM] = acc.due_date.split('-');
                    const cDate = new Date(parseInt(cY), parseInt(cM) - 1, 1);
                    if (acc.type === 'Recorrente' && d.getTime() >= cDate.getTime()) mTotal += parseFloat(acc.value || 0);
                    else if (acc.type === 'Único' && d.getFullYear() === parseInt(cY) && d.getMonth() === parseInt(cM) - 1) mTotal += parseFloat(acc.value || 0);
                });
                dataVal.push(mTotal);
            }

            window.forecastChartInstance = new Chart(ctxFore.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Despesa Prevista',
                        data: dataVal,
                        backgroundColor: '#4f46e5',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    },

    getLatestRecorrenteAccounts(accounts) {
        const latestRecorrentes = {};
        const unicos = [];
        accounts.forEach(acc => {
            if (acc.type === 'Único') {
                unicos.push(acc);
            } else {
                if (!latestRecorrentes[acc.company_name]) {
                    latestRecorrentes[acc.company_name] = acc;
                } else {
                    const existingDate = new Date(latestRecorrentes[acc.company_name].due_date || 0);
                    const currentDate = new Date(acc.due_date || 0);
                    if (currentDate > existingDate) {
                        latestRecorrentes[acc.company_name] = acc;
                    }
                }
            }
        });
        return [...unicos, ...Object.values(latestRecorrentes)];
    },

    isEventOnDate(acc, targetYear, targetMonth, targetDay) {
        if (!acc.due_date) return false;
        const [cYearStr, cMonthStr, cDayStr] = acc.due_date.split('-');
        const cYear = parseInt(cYearStr, 10);
        const cMonth = parseInt(cMonthStr, 10) - 1;
        const cDay = parseInt(cDayStr, 10);

        if (acc.type === 'Único') {
            return (targetYear === cYear && targetMonth === cMonth && targetDay === cDay);
        }

        if (acc.type === 'Recorrente') {
            const startObjNoTime = new Date(cYear, cMonth, cDay).setHours(0, 0, 0, 0);
            const targetObjNoTime = new Date(targetYear, targetMonth, targetDay).setHours(0, 0, 0, 0);

            if (targetObjNoTime < startObjNoTime) return false;

            const freq = acc.frequency || '1 mes';

            if (['1 mes', '3 meses', '6 meses', '1 ano'].includes(freq)) {
                const diffMonths = (targetYear - cYear) * 12 + (targetMonth - cMonth);
                const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
                const expectedDay = Math.min(cDay, daysInTargetMonth);

                if (targetDay !== expectedDay) return false;
                if (diffMonths < 0) return false;

                if (freq === '1 mes') return true;
                if (freq === '3 meses') return diffMonths % 3 === 0;
                if (freq === '6 meses') return diffMonths % 6 === 0;
                if (freq === '1 ano') return targetMonth === cMonth;
            } else {
                const utc1 = Date.UTC(cYear, cMonth, cDay);
                const utc2 = Date.UTC(targetYear, targetMonth, targetDay);
                const diffDays = Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));

                if (freq === '1 dia') return true;
                if (freq === '7 dias') return diffDays % 7 === 0;
                if (freq === '15 dias') return diffDays % 15 === 0;
            }
        }
        return false;
    },

    renderCalendarWrapper(filtered) {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const day = currentCalendarDate.getDate();

        if (calendarSubView === 'month') {
            this.renderCalendarMonth(filtered, year, month);
        } else if (calendarSubView === 'year') {
            this.renderCalendarYear(filtered, year);
        } else if (calendarSubView === 'day') {
            this.renderCalendarDay(filtered, year, month, day);
        }

        this.renderSidebarMiniCalendar();
    },

    renderSidebarMiniCalendar() {
        const containers = [
            document.getElementById('sidebar-mini-calendar'),
            document.getElementById('sidebar-mini-calendar-list')
        ];

        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const day = currentCalendarDate.getDate();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const todayObj = new Date();
        const tY = todayObj.getFullYear();
        const tM = todayObj.getMonth();
        const tD = todayObj.getDate();

        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        let monthOptions = '';
        monthNames.forEach((mName, i) => {
            monthOptions += `<option value="${i}" ${i === month ? 'selected' : ''}>${mName}</option>`;
        });

        let yearOptions = '';
        for (let i = tY - 5; i <= tY + 5; i++) {
            yearOptions += `<option value="${i}" ${i === year ? 'selected' : ''}>${i}</option>`;
        }

        let html = `
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${monthOptions}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${yearOptions}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${tY}, ${tM}, ${tD})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;

        // Empty padding
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="smc-day empty"></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            let classes = "smc-day";
            if (i === day && month === tM && year === tY) {
                // Not actually today but acts as the "selected" day
                classes += " active";
            } else if (i === day) {
                classes += " active";
            }
            html += `<div class="smc-day ${i === day ? 'active' : ''}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${year}, ${month}, ${i})">${i}</div>`;
        }

        html += `</div>`;

        containers.forEach(container => {
            if (container) container.innerHTML = html;
        });
    },

    changeMiniCalendarMonthYear(y, m) {
        let d = currentCalendarDate.getDate();
        const daysInNewMonth = new Date(y, parseInt(m) + 1, 0).getDate();
        if (d > daysInNewMonth) d = daysInNewMonth;

        currentCalendarDate = new Date(y, m, d);

        try {
            dom.setValue('filter-cal-year', y);
            dom.setValue('filter-cal-month', m);
        } catch (e) { }

        this.handleSearch();
        this.renderSidebarMiniCalendar();
    },

    selectDateFromMiniCalendar(y, m, d) {
        currentCalendarDate = new Date(y, m, d);
        try {
            dom.setValue('filter-cal-year', y);
            dom.setValue('filter-cal-month', m);
        } catch (e) { }

        if (accountsViewMode === 'calendar') {
            const dayBtn = document.getElementById('toggle-accounts-cal-day');
            if (dayBtn) dayBtn.click();
        } else {
            this.handleSearch();
            this.renderSidebarMiniCalendar();
        }
    },

    renderCalendarMonth(accounts, year, month) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        dom.setText('calendar-date-display', `${monthNames[month]} ${year}`);

        const grid = document.getElementById('calendar-month-grid');
        grid.innerHTML = '';

        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const isCurrentMonth = (today.getFullYear() === year && today.getMonth() === month);
        const viewMonthObj = new Date(year, month, 1);
        const actualMonthObj = new Date(today.getFullYear(), today.getMonth(), 1);

        for (let i = 0; i < firstDayIndex; i++) {
            grid.innerHTML += `<div class="calendar-day empty"></div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = isCurrentMonth && today.getDate() === d ? 'today' : '';
            grid.innerHTML += `<div class="calendar-day ${isToday}" id="cal-day-cell-${d}">
                <div class="calendar-date">${d}</div>
                <div class="calendar-events" id="cal-events-${d}"></div>
            </div>`;
        }

        const filteredAccounts = this.getLatestRecorrenteAccounts(accounts);

        filteredAccounts.forEach(acc => {
            if (!acc.due_date) return;
            const viewMonthObj = new Date(year, month, 1);
            const actualMonthObj = new Date(today.getFullYear(), today.getMonth(), 1);

            let isHistoricallyValid = true;
            if (acc.status === 'Off' && viewMonthObj.getTime() >= actualMonthObj.getTime()) {
                isHistoricallyValid = false;
            }
            if (!isHistoricallyValid) return;

            for (let d = 1; d <= daysInMonth; d++) {
                if (this.isEventOnDate(acc, year, month, d)) {
                    const dayContainer = document.getElementById(`cal-events-${d}`);
                    if (dayContainer) {
                        const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        let paymentClass = acc.payment_status === 'Pago' ? 'event-paid' : acc.payment_status === 'Pendente' ? 'event-pending' : 'event-canceled';
                        let pillAccId = acc.id;
                        if (acc.type === 'Recorrente' && targetDateStr !== acc.due_date) {
                            // Check if a real (materialized) record exists for this date
                            const realRecord = allAccounts.find(r => r.company_name === acc.company_name && r.due_date === targetDateStr);
                            if (realRecord) {
                                paymentClass = realRecord.payment_status === 'Pago' ? 'event-paid' : realRecord.payment_status === 'Pendente' ? 'event-pending' : 'event-canceled';
                                pillAccId = realRecord.id;
                            } else {
                                paymentClass = 'event-pending'; // Projections without real records are pending
                            }
                        }
                        const pill = document.createElement('div');
                        pill.className = `event-pill event-${acc.type.toLowerCase()} ${paymentClass}`;
                        pill.title = acc.company_name;
                        pill.innerText = acc.company_name;
                        pill.onclick = (e) => {
                            this.openDedicatedPage(pillAccId, targetDateStr);
                        };
                        dayContainer.appendChild(pill);
                    }
                }
            }
        });
    },

    renderCalendarDay(accounts, year, month, day) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        dom.setText('calendar-date-display', `${String(day).padStart(2, '0')} de ${monthNames[month]} de ${year}`);

        const container = document.getElementById('calendar-day-list');
        container.innerHTML = '';

        const viewDateObj = new Date(year, month, day);
        const todayObj = new Date();
        todayObj.setHours(0, 0, 0, 0);
        viewDateObj.setHours(0, 0, 0, 0);

        let itemsRendered = 0;

        const filteredAccounts = this.getLatestRecorrenteAccounts(accounts);

        filteredAccounts.forEach(acc => {
            let isHistoricallyValid = true;
            if (acc.status === 'Off' && viewDateObj.getTime() >= todayObj.getTime()) {
                isHistoricallyValid = false;
            }
            if (!isHistoricallyValid) return;

            if (this.isEventOnDate(acc, year, month, day)) {
                itemsRendered++;
                const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                let dotColor = acc.payment_status === 'Pago' ? '#4ade80' : acc.payment_status === 'Pendente' ? '#facc15' : '#ef4444';
                let dayAccId = acc.id;
                let displayPaymentStatus = acc.payment_status;
                if (acc.type === 'Recorrente' && targetDateStr !== acc.due_date) {
                    // Check if a real (materialized) record exists for this date
                    const realRecord = allAccounts.find(r => r.company_name === acc.company_name && r.due_date === targetDateStr);
                    if (realRecord) {
                        dotColor = realRecord.payment_status === 'Pago' ? '#4ade80' : realRecord.payment_status === 'Pendente' ? '#facc15' : '#ef4444';
                        dayAccId = realRecord.id;
                        displayPaymentStatus = realRecord.payment_status;
                    } else {
                        dotColor = '#facc15'; // Projections without real records are pending
                        displayPaymentStatus = 'Pendente';
                    }
                }
                container.innerHTML += `
                    <div class="day-event-row ${acc.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${acc.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${acc.type} - ${acc.category || 'Outros'})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(acc.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p>${acc.description || 'Nenhuma descrição detalhada.'}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${dayAccId}, '${targetDateStr}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `;
            }
        });

        if (itemsRendered === 0) {
            container.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>`;
        }
    },

    renderCalendarYear(accounts, year) {
        dom.setText('calendar-date-display', `Ano de ${year}`);
        const grid = document.getElementById('calendar-year-grid');
        grid.innerHTML = '';
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const actualMonthObj = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        for (let m = 0; m < 12; m++) {
            const viewMonthObj = new Date(year, m, 1);
            let eventCount = 0; let recorrenteCount = 0; let unicoCount = 0;

            const filteredAccounts = this.getLatestRecorrenteAccounts(accounts);

            filteredAccounts.forEach(acc => {
                let isHistoricallyValid = true;
                if (acc.status === 'Off' && viewMonthObj.getTime() >= actualMonthObj.getTime()) {
                    isHistoricallyValid = false;
                }
                if (!isHistoricallyValid) return;

                const daysInMonth = new Date(year, m + 1, 0).getDate();
                for (let d = 1; d <= daysInMonth; d++) {
                    if (this.isEventOnDate(acc, year, m, d)) {
                        eventCount++;
                        if (acc.type === 'Recorrente') recorrenteCount++;
                        else unicoCount++;
                    }
                }
            });

            const bgIndicator = eventCount > 0 ? 'background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);' : '';
            grid.innerHTML += `
               <div class="year-month-card" style="${bgIndicator}" onclick="window.AccountsHandler.jumpToMonthFromYear(${m})">
                   <div class="year-month-title">${monthNames[m]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${eventCount}</strong></p>
                       ${eventCount > 0 ? `<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${recorrenteCount}</p>` : ''}
                       ${eventCount > 0 ? `<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${unicoCount}</p>` : ''}
                   </div>
               </div>
            `;
        }
    },

    jumpToMonthFromYear(m) {
        currentCalendarDate.setMonth(m);
        dom.setValue('filter-month', m);
        document.getElementById('toggle-accounts-cal-month').click(); // trigger subview switch visually
    },

    openAccountModal(id = null) {
        document.getElementById('account-form').reset();
        this.populateCategoryModalSelect();

        const typeSelect = document.getElementById('account-type');
        typeSelect.onchange = () => {
            if (typeSelect.value === 'Recorrente') dom.show('account-frequency-group');
            else dom.hide('account-frequency-group');
        };

        if (id) {
            dom.setText('account-modal-title', 'Editar Conta');
            const acc = allAccounts.find(a => a.id === id);
            if (acc) {
                dom.setValue('account-id', acc.id);
                dom.setValue('account-company', acc.company_name);
                dom.setValue('account-type', acc.type);
                dom.setValue('account-category', acc.category || 'Outros');
                dom.setValue('account-frequency', acc.frequency || '1 mes'); // Load frequency
                dom.setValue('account-value', parseFloat(acc.value || 0).toFixed(2));
                dom.setValue('account-status', acc.status);
                dom.setValue('account-payment-status', acc.payment_status || 'Pendente');
                dom.setValue('account-due-date', acc.due_date || '');
                dom.setValue('account-description', acc.description || '');
                dom.setValue('account-observation', acc.observation || '');
                typeSelect.onchange(); // Trigger UI toggle
            }
        } else {
            dom.setText('account-modal-title', 'Nova Conta');
            dom.setValue('account-id', '');
            typeSelect.onchange(); // Default toggle
        }
        dom.show('account-modal-form');
    },

    openDedicatedPage(id, overrideDate = null) {
        const acc = allAccounts.find(a => a.id === id);
        if (!acc) return;

        // Group by company name
        let history = allAccounts.filter(a => a.company_name === acc.company_name);
        history = this.injectCurrentMonthProjections(history);
        this.currentCompanyHistory = history.sort((a, b) => new Date(b.due_date || 0) - new Date(a.due_date || 0)); // Newest first

        dom.hide('accounts-section');
        dom.show('dedicated-account-page');

        dom.setText('ded-acc-company', acc.company_name);

        // Calculate Totals
        let totalPaid = 0;
        let totalPending = 0;
        let countPaid = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.currentCompanyHistory.forEach(item => {
            const val = parseFloat(item.value || 0);
            if (item.payment_status === 'Pago') {
                totalPaid += val;
                countPaid++;
            } else if (item.payment_status === 'Pendente') {
                if (item.due_date) {
                    const [y, m, d] = item.due_date.split('-');
                    const due = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
                    due.setHours(0, 0, 0, 0);
                    if (due.getTime() < today.getTime()) {
                        totalPending += val;
                    }
                }
            }
        });

        const valPaidStr = totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const valPendStr = totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        dom.setText('ded-acc-total-paid', 'R$ ' + valPaidStr);
        dom.setText('ded-acc-total-pending', 'R$ ' + valPendStr);
        dom.setText('ded-acc-total-count', countPaid.toString());

        const statusBadge = document.getElementById('ded-acc-status-badge');
        if (acc.status === 'On') {
            statusBadge.innerHTML = `<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>`;
        } else {
            statusBadge.innerHTML = `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>`;
        }

        // Render History List
        this.renderDedicatedHistoryList();

        // Select the first item (newest) by default or the clicked one
        this.selectHistoryItem(acc.id, overrideDate);

        // Setup Add button
        const btnAddHistory = document.getElementById('btn-ded-add-history');
        if (btnAddHistory) {
            btnAddHistory.onclick = () => {
                // Open modal with pre-filled company name
                this.openAccountModal();
                setTimeout(() => {
                    dom.setValue('account-company', acc.company_name);
                    dom.setValue('account-type', acc.type);
                    dom.setValue('account-category', acc.category);
                }, 100);
            };
            if (!auth.isAdmin()) btnAddHistory.style.display = 'none';
        }
    },

    injectCurrentMonthProjections(historyArray) {
        const today = new Date();

        let latestRecorrente = null;
        historyArray.forEach(acc => {
            if (acc.type === 'Recorrente') {
                if (!latestRecorrente) latestRecorrente = acc;
                else if (new Date(acc.due_date || 0) > new Date(latestRecorrente.due_date || 0)) {
                    latestRecorrente = acc;
                }
            }
        });

        if (!latestRecorrente) return historyArray;

        const newList = [...historyArray];
        const existingDates = new Set(historyArray.map(a => a.due_date));

        // Inject projections for the current month and the next 2 months (3 total)
        for (let offset = 0; offset < 3; offset++) {
            const projDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
            const projYear = projDate.getFullYear();
            const projMonth = projDate.getMonth();
            const daysInMonth = new Date(projYear, projMonth + 1, 0).getDate();

            for (let d = 1; d <= daysInMonth; d++) {
                if (this.isEventOnDate(latestRecorrente, projYear, projMonth, d)) {
                    const targetDateStr = `${projYear}-${String(projMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    if (!existingDates.has(targetDateStr)) {
                        newList.push({
                            ...latestRecorrente,
                            is_projection: true,
                            due_date: targetDateStr,
                            payment_status: 'Pendente', // Projections without real records are pending
                            unique_key: latestRecorrente.id + '_' + targetDateStr
                        });
                        existingDates.add(targetDateStr); // Prevent duplicates across months
                    }
                }
            }
        }

        newList.forEach(item => {
            if (!item.unique_key) item.unique_key = item.id.toString();
        });

        return newList;
    },

    renderDedicatedHistoryList() {
        const listContainer = document.getElementById('ded-acc-history-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        if (!this.currentCompanyHistory || this.currentCompanyHistory.length === 0) {
            listContainer.innerHTML = '<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';
            return;
        }

        this.currentCompanyHistory.forEach(item => {
            let formattedDate = 'Sem Data';
            if (item.due_date) {
                const parts = item.due_date.split('-');
                if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }

            const valStr = parseFloat(item.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            let statusColor = '#eab308'; // Pendente
            if (item.payment_status === 'Pago') statusColor = '#4ade80';
            else if (item.payment_status === 'Cancelado') statusColor = '#f87171';

            const div = document.createElement('div');
            div.className = `glass history-item-card`;
            div.style.cssText = `padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;`;
            // Add hover effect via JS or class
            div.onmouseover = () => div.style.background = 'rgba(255,255,255,0.05)';
            div.onmouseout = () => {
                if (this.currentSelectedHistoryKey !== item.unique_key) div.style.background = 'var(--glass-bg)';
            }

            if (this.currentSelectedHistoryKey === item.unique_key) {
                div.style.background = 'rgba(255,255,255,0.1)';
                div.style.borderColor = 'var(--accent)';
            }

            div.onclick = () => this.selectHistoryItem(item.id, item.is_projection ? item.due_date : null);

            div.innerHTML = `
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${valStr}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${formattedDate}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${statusColor}22; color: ${statusColor}; font-size: 0.75rem;">${item.payment_status || 'Pendente'}</span>
                </div>
            `;
            listContainer.appendChild(div);
        });
    },

    selectHistoryItem(id, overrideDate = null) {
        this.currentSelectedHistoryKey = overrideDate ? id + '_' + overrideDate : id.toString();
        this.renderDedicatedHistoryList(); // Re-render to update selected styling

        let item = null;
        if (overrideDate) {
            item = this.currentCompanyHistory.find(a => a.id === id && a.due_date === overrideDate && a.is_projection);
        }
        if (!item) {
            item = this.currentCompanyHistory.find(a => a.id === id && !a.is_projection);
        }

        const emptyState = document.getElementById('ded-acc-details-empty');
        const contentState = document.getElementById('ded-acc-details-content');

        if (!item) {
            dom.show('ded-acc-details-empty');
            dom.hide('ded-acc-details-content');
            return;
        }

        dom.hide('ded-acc-details-empty');
        dom.show('ded-acc-details-content');

        let formattedDate = 'DD/MM/YYYY';
        const targetViewDate = overrideDate || item.due_date;
        if (targetViewDate) {
            const parts = targetViewDate.split('-');
            if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        dom.setText('ded-acc-det-date', formattedDate);

        // Populate Right Side Form
        dom.setValue('ded-acc-det-val-input', parseFloat(item.value || 0).toFixed(2));
        dom.setValue('ded-acc-det-date-input', targetViewDate || '');
        dom.setValue('ded-acc-det-status-input', item.payment_status || 'Pendente');
        dom.setValue('ded-acc-det-account-status-input', item.status || 'On');
        dom.setValue('ded-acc-det-obs-input', item.observation || '');

        if (item.type === 'Recorrente') {
            dom.show('ded-acc-det-freq-group');
            dom.setValue('ded-acc-det-freq-input', item.frequency || '1 mes');
        } else {
            dom.hide('ded-acc-det-freq-group');
        }

        // Setup Details Save
        const btnSave = document.getElementById('btn-ded-save-details');
        if (btnSave) {
            btnSave.onclick = async () => {
                const updatedPayload = {
                    company_name: item.company_name,
                    type: item.type,
                    category: item.category,
                    description: item.description,
                    value: dom.getValue('ded-acc-det-val-input'),
                    due_date: dom.getValue('ded-acc-det-date-input'),
                    payment_status: dom.getValue('ded-acc-det-status-input'),
                    status: dom.getValue('ded-acc-det-account-status-input'),
                    observation: dom.getValue('ded-acc-det-obs-input'),
                    frequency: item.type === 'Recorrente' ? dom.getValue('ded-acc-det-freq-input') : '1 mes'
                };

                try {
                    let savedId = item.id;
                    if (item.is_projection) {
                        // Materialize: create a new real record for this projected date
                        const result = await apiClient.post('/accounts', updatedPayload);
                        savedId = result.id;
                        alert('Fatura materializada e salva com sucesso!');
                    } else {
                        await apiClient.put(`/accounts/${item.id}`, updatedPayload);
                        alert('Fatura atualizada com sucesso!');
                    }
                    await this.fetch();
                    // Need to regrab the group since allAccounts is new
                    this.currentCompanyHistory = allAccounts.filter(a => a.company_name === item.company_name)
                        .sort((a, b) => new Date(b.due_date || 0) - new Date(a.due_date || 0));
                    this.openDedicatedPage(savedId); // Re-trigger the whole page refresh
                } catch (e) {
                    alert('Erro ao salvar fatura.');
                }
            };
            if (!auth.isAdmin()) btnSave.style.display = 'none';
        }

        // Setup Delete
        const btnDelete = document.getElementById('btn-ded-delete-account');
        if (btnDelete) {
            btnDelete.onclick = async () => {
                if (confirm('Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?')) {
                    try {
                        await apiClient.delete(`/accounts/${item.id}`);
                        await this.fetch();
                        // If no more items in history, go back to main list
                        const remaining = allAccounts.filter(a => a.company_name === item.company_name);
                        if (remaining.length > 0) {
                            this.openDedicatedPage(remaining[0].id);
                        } else {
                            document.getElementById('btn-back-to-accounts').click();
                        }
                    } catch (e) {
                        alert('Erro ao excluir fatura');
                    }
                }
            };
            if (!auth.isAdmin()) btnDelete.style.display = 'none';
        }

        // Render Attachment Area
        this.renderAttachmentArea(item);
    },

    renderAttachmentArea(item) {
        const fileInput = document.getElementById('ded-acc-file-input');
        const uploadArea = document.getElementById('ded-acc-upload-area');
        const previewArea = document.getElementById('ded-acc-preview-area');

        // Reset display
        if (item.attachment_path) {
            dom.hide('ded-acc-upload-area');
            dom.show('ded-acc-preview-area');

            const isImage = item.attachment_path.match(/\.(jpeg|jpg|gif|png)$/) != null;
            const thumb = document.getElementById('ded-acc-preview-thumb');
            const fileName = item.attachment_path.split('/').pop() || 'documento';

            dom.setText('ded-acc-preview-name', fileName);

            const previewLink = document.getElementById('ded-acc-preview-link');
            previewLink.href = 'javascript:void(0)';
            previewLink.onclick = async (e) => {
                e.preventDefault();
                const btnText = previewLink.innerText;
                previewLink.innerText = 'Carregando...';
                try {
                    const response = await fetch(item.attachment_path);
                    if (!response.ok) throw new Error('Doc não encontrado');
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                } catch (err) {
                    alert('Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou.');
                    console.error('Blob fetch error:', err);
                } finally {
                    previewLink.innerText = btnText;
                }
            };

            if (isImage) {
                thumb.innerHTML = '';
                thumb.style.backgroundImage = `url('${item.attachment_path}')`;
            } else {
                thumb.style.backgroundImage = 'none';
                thumb.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `;
            }

            // Remove logic
            const btnRemove = document.getElementById('btn-ded-remove-attachment');
            btnRemove.onclick = async () => {
                if (confirm('Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)')) {
                    try {
                        await apiClient.put(`/accounts/${item.id}`, { ...item, attachment_path: null });
                        await this.fetch();
                        this.currentCompanyHistory = allAccounts.filter(a => a.company_name === item.company_name)
                            .sort((a, b) => new Date(b.due_date || 0) - new Date(a.due_date || 0));
                        this.selectHistoryItem(item.id); // re-render
                    } catch (e) { alert('Erro ao remover anexo'); }
                }
            };
            if (!auth.isAdmin()) btnRemove.style.display = 'none';

        } else {
            dom.show('ded-acc-upload-area');
            dom.hide('ded-acc-preview-area');

            if (!auth.isAdmin()) {
                uploadArea.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>';
                uploadArea.style.cursor = 'default';
                return; // Standard users can't upload
            } else {
                // Restore default upload HTML just in case
                uploadArea.innerHTML = `
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `;
                uploadArea.style.cursor = 'pointer';
            }

            // Bind upload clicks
            uploadArea.onclick = (e) => {
                const fInput = document.getElementById('ded-acc-file-input');
                if (fInput && e.target !== fInput) {
                    fInput.click();
                }
            };

            // Drag and drop event listeners
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--accent)';
                uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
            });

            const resetUploadAreaStyle = () => {
                uploadArea.style.borderColor = 'rgba(255,255,255,0.2)';
                uploadArea.style.background = 'rgba(0,0,0,0.1)';
            };

            uploadArea.addEventListener('dragleave', () => {
                resetUploadAreaStyle();
            });

            const handleDirectUpload = async (file) => {
                if (!file) return;

                uploadArea.innerHTML = '<p style="color:var(--accent);">Fazendo upload...</p>';

                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();
                    if (response.ok) {
                        // Link file path to this account entry
                        await apiClient.put(`/accounts/${item.id}`, { ...item, attachment_path: data.path });
                        await this.fetch();
                        this.currentCompanyHistory = allAccounts.filter(a => a.company_name === item.company_name)
                            .sort((a, b) => new Date(b.due_date || 0) - new Date(a.due_date || 0));
                        this.selectHistoryItem(item.id); // trigger re-render
                    } else {
                        alert(data.error || 'Erro no upload');
                        this.selectHistoryItem(item.id); // restore original HTML
                    }
                } catch (err) {
                    alert('Falha na comunicação: ' + err.message);
                    console.error('Upload Error:', err);
                    this.selectHistoryItem(item.id);
                }
            };

            uploadArea.addEventListener('drop', async (e) => {
                e.preventDefault();
                resetUploadAreaStyle();
                
                if (e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    await handleDirectUpload(file);
                }
            });

            const fInput = document.getElementById('ded-acc-file-input');
            if (fInput) {
                fInput.onclick = (e) => {
                    e.stopPropagation();
                };
                fInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    await handleDirectUpload(file);
                };
            }
        }
    },

    async save(e) {
        e.preventDefault();
        const id = dom.getValue('account-id');
        const bodyObj = {
            company_name: dom.getValue('account-company'),
            type: dom.getValue('account-type'),
            category: dom.getValue('account-category'),
            value: dom.getValue('account-value'),
            status: dom.getValue('account-status'),
            payment_status: dom.getValue('account-payment-status'),
            due_date: dom.getValue('account-due-date'),
            description: dom.getValue('account-description'),
            observation: dom.getValue('account-observation'),
            frequency: dom.getValue('account-type') === 'Recorrente' ? dom.getValue('account-frequency') : '1 mes'
        };

        try {
            const url = id ? `/accounts/${id}` : `/accounts`;
            if (id) await apiClient.put(url, bodyObj);
            else await apiClient.post(url, bodyObj);

            dom.hide('account-modal-form');
            this.fetch();
            this.checkAccountAlerts();
        } catch (err) {
            alert('Erro ao salvar conta.');
        }
    },

    async delete(id) {
        if (!confirm('Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito.')) return;
        try {
            await apiClient.delete(`/accounts/${id}`);
            this.fetch();
            this.checkAccountAlerts();
        } catch (err) {
            alert('Erro ao excluir conta.');
        }
    },

    setPageSize(size) {
        itemsPerPage = size;
        currentPage = 1;
        this.renderAccountsList(currentFilteredItems);
    },

    changePage(page) {
        currentPage = page;
        this.renderAccountsList(currentFilteredItems);
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
                <select class="form-control glass" onchange="window.AccountsHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
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
                    onclick="window.AccountsHandler.changePage(${currentPage - 1})"
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
                            onclick="window.AccountsHandler.changePage(${i})">
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
                    onclick="window.AccountsHandler.changePage(${currentPage + 1})"
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
