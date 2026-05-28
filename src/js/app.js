import { auth } from './api/auth.js';
import { dom } from './utils/dom.js';
import { networkBg } from './utils/networkBg.js';
import { usersHandler } from './features/users.js';
import { docsHandler } from './features/documents.js';
import { proceduresHandler } from './features/procedures.js';
import { accountsHandler } from './features/accounts.js';
import { timelineHandler } from './features/timeline.js';
import { telephonyHandler } from './features/telephony.js';

let currentSection = 'list';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ', 'background: #4f46e5; color: white; font-weight: bold;');

    window.auth = auth; // Global auth object for timeline to use
    
    setupDOM();
    populateDateFilters();
    setupEventListeners();
    timelineHandler.init();

    if (auth.init()) {
        console.log('Sessão restaurada:', auth.getUser().email);
        showApp();
    } else {
        showLogin();
    }
});

let navBtns, btnNewItem, loginSection, appContainer;

function setupDOM() {
    navBtns = document.querySelectorAll('.nav-btn');
    btnNewItem = document.getElementById('btn-new-item');
    loginSection = document.getElementById('login-section');
    appContainer = document.getElementById('app-container');
}

function showLogin() {
    if (loginSection) loginSection.classList.remove('hidden');
    if (appContainer) appContainer.classList.add('hidden');
    document.body.style.overflow = 'hidden';
}

function populateDateFilters() {
    const currentYear = new Date().getFullYear();
    const yearSelects = [document.getElementById('filter-cal-year')];
    yearSelects.forEach(yElem => {
        if (yElem && yElem.options.length <= 1) {
            for (let i = currentYear - 5; i <= currentYear + 5; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                if (i === currentYear) opt.selected = true;
                yElem.appendChild(opt);
            }
        }
    });
}

function showApp() {
    if (loginSection) loginSection.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');
    document.body.style.overflow = '';
    currentSection = 'list';
    updateUI();

    // Load data
    proceduresHandler.fetch();
    docsHandler.fetch();
    usersHandler.fetch();
    accountsHandler.fetch();

    // Re-apply timeline role access now that auth is ready
    if (window.auth) {
        const btnForm = document.getElementById('timeline-tab-anexo');
        if (btnForm) {
            if (window.auth.isAdmin()) {
                btnForm.classList.remove('role-hidden');
            } else {
                btnForm.classList.add('role-hidden');
            }
        }
        const btnConfig = document.getElementById('timeline-tab-config');
        if (btnConfig) {
            if (window.auth.isAdmin()) {
                btnConfig.classList.remove('role-hidden');
            } else {
                btnConfig.classList.add('role-hidden');
            }
        }
    }
}

function updateUI() {
    ['account-section', 'docs-section', 'list-section', 'detail-section', 'users-section', 'accounts-section', 'timeline-section', 'dedicated-account-page', 'telephony-section'].forEach(id => {
        dom.hide(id);
    });

    if (btnNewItem) btnNewItem.classList.add('hidden');
    networkBg.stop();

    switch (currentSection) {
        case 'account':
        case 'profile':
            dom.show('account-section');
            dom.setText('section-title', 'Minha Conta');
            setTimeout(() => networkBg.start(), 100);
            break;
        case 'list':
            dom.show('list-section');
            dom.setText('section-title', 'Listagem Geral');
            if (auth.isAdmin() && btnNewItem) btnNewItem.classList.remove('hidden');
            break;
        case 'docs':
            dom.show('docs-section');
            dom.setText('section-title', 'Documentação');
            break;
        case 'detail':
            dom.show('detail-section');
            dom.setText('section-title', 'Procedimento');
            break;
        case 'users':
            dom.show('users-section');
            dom.setText('section-title', 'Gestão de Usuários');
            break;
        case 'accounts':
            dom.show('accounts-section');
            dom.setText('section-title', 'Gestão de Contas');
            accountsHandler.handleSearch();
            break;
        case 'timeline':
            dom.show('timeline-section');
            dom.setText('section-title', 'Timeline');
            break;
        case 'telephony':
            dom.show('telephony-section');
            dom.setText('section-title', 'Telefonia');
            break;
    }
    applyRolePermissions();
}

function applyRolePermissions() {
    const isAdmin = auth.isAdmin();

    dom.toggle('nav-users', !isAdmin);
    dom.toggle('nav-accounts', !isAdmin);

    if (btnNewItem) btnNewItem.classList.toggle('role-hidden', !isAdmin);

    const fabEdit = document.getElementById('btn-floating-edit');
    if (fabEdit) fabEdit.classList.toggle('role-hidden', !isAdmin);

    document.querySelectorAll('.btn-actions-container').forEach(el => {
        el.classList.toggle('role-hidden', !isAdmin);
    });

    ['th-proc-actions', 'th-user-actions', 'th-account-actions', 'th-doc-actions'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('role-hidden', !isAdmin);
    });

    const btnNewUser = document.getElementById('btn-new-user');
    if (btnNewUser) btnNewUser.classList.toggle('role-hidden', !isAdmin);

    const btnNewAccount = document.getElementById('btn-new-account');
    if (btnNewAccount) btnNewAccount.classList.toggle('role-hidden', !isAdmin);

    const btnNewDoc = document.getElementById('btn-new-doc');
    if (btnNewDoc) btnNewDoc.classList.toggle('role-hidden', !isAdmin);

    const user = auth.getUser();
    if (user) {
        // Remove "Usuário " or "Usuario " prefix if present for a cleaner presentation
        let displayName = user.name;
        if (displayName.toLowerCase().startsWith('usuário ')) {
            displayName = displayName.substring(8);
        } else if (displayName.toLowerCase().startsWith('usuario ')) {
            displayName = displayName.substring(8);
        }

        dom.setText('profile-name-display', displayName);
        dom.setText('profile-role-display', user.role);

        // Smarter initials: first letter of first and last word, or first two letters
        let initials = displayName.substring(0, 2).toUpperCase();
        const parts = displayName.trim().split(/\s+/);
        if (parts.length > 1) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }

        dom.setText('profile-avatar-initials', initials);
    }
}

function setupEventListeners() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSection = btn.dataset.section;
            updateUI();

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                const overlay = document.getElementById('sidebar-overlay');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });

    window.addEventListener('SectionChange', (e) => {
        currentSection = e.detail.section;
        updateUI();
    });

    // Login
    dom.on('login-form', 'submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const errEl = document.getElementById('login-error');
        if (btn) btn.disabled = true;

        const res = await auth.login(dom.getValue('login-email'), dom.getValue('login-password'));

        if (btn) btn.disabled = false;

        if (res.success) {
            showApp();
        } else {
            if (errEl) {
                errEl.innerText = res.error;
                errEl.classList.remove('hidden');
            }
        }
    });

    // Logout
    dom.on('btn-logout', 'click', () => {
        // Para o auto-refresh da timeline se estiver ativo
        const refreshToggle = document.getElementById('auto-refresh-toggle');
        if (refreshToggle && refreshToggle.checked) {
            refreshToggle.checked = false;
            refreshToggle.dispatchEvent(new Event('change'));
        }

        // Limpa dados e sessão
        auth.logout();

        // Volta para tela de login
        showLogin();
    });

    // Modals Close
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.classList.add('hidden');
        });
    });

    // Globals bindings for HTML onClick events
    window.UsersHandler = usersHandler;
    window.DocsHandler = docsHandler;
    window.ProceduresHandler = proceduresHandler;
    window.AccountsHandler = accountsHandler;
    window.TelephonyHandler = telephonyHandler;

    // Telephony search binding
    dom.on('telephony-search', 'input', (e) => telephonyHandler.search(e.target.value.toLowerCase()));
    dom.on('telephony-page-size', 'change', (e) => telephonyHandler.setPageSize(e.target.value));
    dom.on('telephony-reload-btn', 'click', () => {
        const searchInput = document.getElementById('telephony-search');
        if (searchInput) searchInput.value = '';
        telephonyHandler.fetch();
    });

    // Accounts Search & Filters bindings
    dom.on('accounts-search', 'input', () => accountsHandler.handleSearch());
    dom.on('filter-status', 'change', () => accountsHandler.handleSearch());
    dom.on('filter-date-toggle', 'change', (e) => {
        const minical = document.getElementById('sidebar-mini-calendar-list');
        if (minical) {
            minical.style.opacity = e.target.checked ? '1' : '0.4';
            minical.style.pointerEvents = e.target.checked ? 'auto' : 'none';
        }
        accountsHandler.handleSearch();
    });
    dom.on('filter-cal-month', 'change', () => accountsHandler.handleFilterChange(true));
    dom.on('filter-cal-year', 'change', () => accountsHandler.handleFilterChange(true));

    // Dashboard Filters bindings
    ['dash-filter-start', 'dash-filter-end', 'dash-filter-type', 'dash-filter-status', 'dash-filter-payment', 'dash-sort-empresas', 'dash-sort-categorias'].forEach(id => {
        dom.on(id, 'change', () => {
            if (currentSection === 'accounts') accountsHandler.renderDashboard();
        });
    });

    dom.on('btn-dash-clear-dates', 'click', () => {
        dom.setValue('dash-filter-start', '');
        dom.setValue('dash-filter-end', '');
        dom.setValue('dash-filter-type', 'Todos');
        dom.setValue('dash-filter-status', 'Todos');
        dom.setValue('dash-filter-payment', 'Todos');

        // Reset custom multiselects
        accountsHandler.resetMultiselects();

        // Reset sorting to default 'desc' if needed
        dom.setValue('dash-sort-empresas', 'desc');
        dom.setValue('dash-sort-categorias', 'desc');

        if (currentSection === 'accounts') accountsHandler.renderDashboard();
    });

    // Connect top level forms
    dom.on('user-form', 'submit', (e) => usersHandler.save(e));
    dom.on('doc-form', 'submit', (e) => docsHandler.handleUpload(e));
    dom.on('account-form', 'submit', (e) => accountsHandler.save(e));
    dom.on('faq-form', 'submit', (e) => proceduresHandler.saveMeta(e));

    // Color palette selection for procedure modal
    const palette = document.getElementById('proc-color-palette');
    const colorInput = document.getElementById('proc-color');
    if (palette && colorInput) {
        palette.addEventListener('click', (e) => {
            const swatch = e.target.closest('.color-swatch');
            if (!swatch) return;
            if (swatch.id === 'color-custom-swatch') {
                colorInput.click();
            } else {
                const color = swatch.dataset.color;
                if (color) {
                    colorInput.value = color;
                    palette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                }
            }
        });
        colorInput.addEventListener('input', (e) => {
            const customSwatch = document.getElementById('color-custom-swatch');
            if (customSwatch) {
                customSwatch.style.background = e.target.value;
                palette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                customSwatch.classList.add('active');
            }
        });
    }

    // Wire up some other loose buttons
    dom.on('btn-new-item', 'click', () => {
        dom.setText('modal-form-title', 'Novo Procedimento');
        dom.setValue('proc-id', '');
        dom.setValue('proc-content', '[]');
        // Reset color swatch to default
        if (palette) {
            palette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            const defaultSwatch = palette.querySelector('[data-color="#4F46E5"]');
            if (defaultSwatch) defaultSwatch.classList.add('active');
        }
        if (colorInput) colorInput.value = '#4F46E5';
        dom.show('modal-form');
    });

    dom.on('btn-new-account', 'click', () => accountsHandler.openAccountModal());
    dom.on('btn-new-account-cal', 'click', () => accountsHandler.openAccountModal());
    dom.on('btn-new-user', 'click', () => {
        document.getElementById('user-form').reset();
        dom.setValue('user-id-form', '');
        dom.show('modal-user');
    });

    // Listing Search
    dom.on('list-search', 'input', (e) => {
        proceduresHandler.search(e.target.value.toLowerCase());
    });

    // Documents Search
    dom.on('doc-search', 'input', (e) => {
        docsHandler.search(e.target.value.toLowerCase());
    });

    // Documents Dashboard Filters
    dom.on('doc-dash-search', 'input', () => {
        docsHandler.renderDashboard();
    });
    dom.on('doc-dash-filter-category', 'change', () => {
        docsHandler.renderDashboard();
    });
    dom.on('doc-dash-filter-status', 'change', () => {
        docsHandler.renderDashboard();
    });

    // Documents Toggles and Actions
    dom.on('btn-new-doc', 'click', () => {
        dom.show('modal-upload');
    });

    ['geral', 'contratos', 'termo-de-uso', 'dashboard'].forEach(tab => {
        dom.on(`tab-doc-${tab}`, 'click', () => {
            let categoryValue;
            if (tab === 'termo-de-uso') {
                categoryValue = 'Termo de Uso';
            } else if (tab === 'dashboard') {
                categoryValue = 'dashboard';
            } else {
                categoryValue = tab;
            }
            docsHandler.setActiveTab(categoryValue);
        });
    });

    dom.on('doc-category', 'change', (e) => {
        const cat = e.target.value.toLowerCase();
        const datesContainer = document.getElementById('doc-dates-container');
        if (datesContainer) {
            datesContainer.style.display = (cat === 'contratos' || cat === 'termo de uso') ? 'grid' : 'none';
        }
    });

    dom.on('doc-indefinite', 'change', (e) => {
        const endDateInput = document.getElementById('doc-end-date');
        if (endDateInput) {
            endDateInput.disabled = e.target.checked;
            if (e.target.checked) endDateInput.value = '';
        }
    });

    // Drop zone binding
    const dropZone = document.getElementById('drop-zone');
    const docFile = document.getElementById('doc-file');
    if (dropZone && docFile) {
        dropZone.addEventListener('click', (e) => {
            if (e.target !== docFile) {
                docFile.click();
            }
        });
        docFile.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        docFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                dom.setText('file-name-display', e.target.files[0].name);
            }
        });
        
        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                docFile.files = e.dataTransfer.files;
                dom.setText('file-name-display', e.dataTransfer.files[0].name);
            }
        });
    }

    // View Toggles
    dom.on('toggle-list', 'click', (e) => {
        e.currentTarget.classList.add('active');
        document.getElementById('toggle-cards').classList.remove('active');
        proceduresHandler.setListingMode('list');
    });

    dom.on('toggle-cards', 'click', (e) => {
        e.currentTarget.classList.add('active');
        document.getElementById('toggle-list').classList.remove('active');
        proceduresHandler.setListingMode('cards');
    });

    // Accounts Tabs
    ['lista', 'calendario', 'dashboard', 'notificacoes'].forEach(tab => {
        dom.on(`tab-acc-${tab}`, 'click', (e) => {
            document.querySelectorAll('.acc-tab-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            document.querySelectorAll('.acc-tab-content').forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('active');
            });
            const dashboardEl = document.getElementById('accounts-dashboard-view');
            if (dashboardEl) {
                dashboardEl.classList.add('hidden');
                dashboardEl.classList.remove('active');
            }

            const targetId = tab === 'dashboard' ? 'accounts-dashboard-view' : `acc-tab-content-${tab}`;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.remove('hidden');
                targetEl.classList.add('active');
            }

            // Show/Hide top calendar toggles
            const viewToggleEl = document.getElementById('calendar-view-toggle-container');
            if (viewToggleEl) {
                if (tab === 'calendario') {
                    viewToggleEl.classList.remove('hidden');
                    // Needs flexing if un-hidden
                    viewToggleEl.style.display = 'flex';
                } else {
                    viewToggleEl.classList.add('hidden');
                    viewToggleEl.style.display = 'none';
                }
            }

            accountsHandler.setAccountsViewMode(tab === 'calendario' ? 'calendar' : tab === 'dashboard' ? 'dashboard' : tab === 'notificacoes' ? 'notificacoes' : 'list');
        });
    });
    // Account Calendar Views
    ['day', 'month', 'year'].forEach(view => {
        dom.on(`toggle-accounts-cal-${view}`, 'click', (e) => {
            document.querySelectorAll('#calendar-view-toggle-container .toggle-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            ['day', 'month', 'year'].forEach(v => {
                document.getElementById(`cal-${v}-view-container`).classList.toggle('hidden-cal-view', v !== view);
            });

            accountsHandler.setCalendarSubView(view);
        });
    });

    dom.on('btn-prev-date-nav', 'click', () => accountsHandler.shiftCalendarDate(-1));
    dom.on('btn-next-date-nav', 'click', () => accountsHandler.shiftCalendarDate(1));

    // Return to list or accounts
    dom.on('btn-back-to-accounts', 'click', () => {
        dom.hide('dedicated-account-page');
        dom.show('accounts-section');
        applyRolePermissions();
    });

    dom.on('btn-back-to-list', 'click', () => {
        const wrap = document.getElementById('procedure-edit-wrapper');
        if (wrap && !wrap.classList.contains('hidden')) {
            proceduresHandler.toggleEditMode(false);
        } else {
            currentSection = 'list';
            updateUI();
        }
    });

    dom.on('btn-floating-edit', 'click', () => proceduresHandler.toggleEditMode(true));
    dom.on('btn-cancel-edit', 'click', () => proceduresHandler.toggleEditMode(false));
    dom.on('btn-save-procedure', 'click', () => proceduresHandler.handleSaveProcedure());

    // Post-save Confirmation Modal ("Deseja preencher o procedimento agora?")
    dom.on('confirm-yes', 'click', () => {
        dom.hide('modal-confirm');
        proceduresHandler.openDetail(proceduresHandler.getPendingProcId());
    });
    dom.on('confirm-no', 'click', () => {
        dom.hide('modal-confirm');
    });

    // Procedure View Search
    dom.on('procedure-search', 'input', (e) => {
        proceduresHandler.filterProcedureContent(e.target.value);
    });

    // Procedure Builder Actions
    dom.on('btn-add-block', 'click', () => {
        const titleInput = document.getElementById('section-title-input');
        const typeInput = document.getElementById('section-type-input');
        if (titleInput) titleInput.value = '';
        if (typeInput) typeInput.value = 'TEXTO';
        dom.show('modal-add-section');
    });

    dom.on('btn-confirm-add-section', 'click', () => {
        const title = dom.getValue('section-title-input');
        const type = dom.getValue('section-type-input');
        if (!title) return alert('Por favor, informe o título da seção.');

        proceduresHandler.addSection(title, type);
        dom.hide('modal-add-section');
    });
}
