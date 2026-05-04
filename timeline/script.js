// Storage Key
const STORAGE_KEY = 'timeline_app_events';

// State
let events = [];
let users = [];
let currentUser = null;
let filters = {}; // { topic: { start: number, end: number, subTopic: string } }
let autoRefreshInterval = null; // State for auto-refresh

// DOM Elements
const form = document.getElementById('event-form');
const navTimeline = document.getElementById('nav-timeline');
const navAttention = document.getElementById('nav-attention');
const navForm = document.getElementById('nav-form');
const navUsers = document.getElementById('nav-users');
const sectionVisualizacao = document.getElementById('view-visualizacao');
const sectionAttention = document.getElementById('view-attention');
const sectionAnexo = document.getElementById('view-anexo');
const sectionUsers = document.getElementById('view-users');

// Map topics to CSS variables or hex colors for JS usage if needed
const topicColors = {
    'atendimento': 'var(--topic-atendimento)',
    'internet': 'var(--topic-internet)',
    'infraestrutura': 'var(--topic-infra)',
    'sistema': 'var(--topic-sistema)',
    'integracoes': 'var(--topic-integracoes)'
};

const topicOptions = {
    'atendimento': ['Gnew', 'Opa', 'Chat Neo', 'Rota 0', 'Rota 08'],
    'internet': ['Americanet', 'Vivo', 'Imaxima', 'Claro', 'Starlink'],
    'infraestrutura': ['Eletrica', 'Gerador', 'Nobreak', 'Rede', 'Servidores'],
    'sistema': ['Neo', 'AWS', 'GCP', 'Apps', 'Comunicadores'],
    'integracoes': ['Infocar', 'Bradesco', 'Autentique', 'Sinch', 'Pluga']
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Event Listener for Topic Change
    const topicSelect = document.getElementById('topico');
    topicSelect.addEventListener('change', (e) => {
        updateSubTopics(e.target.value);
    });

    // Event Listener for 'Em Ocorrência' Toggle
    const emOcorrenciaToggle = document.getElementById('em-ocorrencia');
    emOcorrenciaToggle.addEventListener('change', (e) => {
        const fimInput = document.getElementById('fim');
        const inicioInput = document.getElementById('inicio');

        if (e.target.checked) {
            // Auto-fill start date with current local time if empty
            if (!inicioInput.value) {
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                inicioInput.value = now.toISOString().slice(0, 16);
            }
            // Make end date optional
            fimInput.required = false;
        } else {
            // Make end date required again
            fimInput.required = true;

            // Auto-complete end date with current local time if empty when disabling
            if (!fimInput.value) {
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                fimInput.value = now.toISOString().slice(0, 16);
            }
        }
    });

    // Populate Filters
    populateFilterOptions();

    // Check for existing session
    checkSession();

    // User Filter Events
    const userRoleFilter = document.getElementById('user-role-filter');
    if (userRoleFilter) {
        userRoleFilter.addEventListener('change', renderUsersList);
    }
    const userSearchInput = document.getElementById('user-search');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', renderUsersList);
    }

    // Sidebar Toggle Logic
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainSidebar = document.getElementById('main-sidebar');

    if (sidebarToggle && mainSidebar) {
        sidebarToggle.addEventListener('click', () => {
            mainSidebar.classList.toggle('collapsed');
        });
    }

    // Auto-Refresh Toggle Logic
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', (e) => {
            toggleAutoRefresh(e.target.checked);
        });
    }
});

// Auto-refresh when window regains focus to ensure data is up-to-date
window.addEventListener('focus', loadEvents);

// --- Helper Functions ---
function updateSubTopics(topic, selectedSubTopic = null) {
    const subTopicSelect = document.getElementById('sub-topico');
    subTopicSelect.innerHTML = '<option value="">Selecione...</option>';

    const normalizedTopic = topic ? topic.toLowerCase().trim() : '';

    if (!normalizedTopic || !topicOptions[normalizedTopic]) {
        subTopicSelect.innerHTML = '<option value="">Selecione o tópico primeiro...</option>';
        return;
    }

    topicOptions[normalizedTopic].forEach(option => {
        const opt = document.createElement('option');
        // Simple normalization for value (lowercase)
        opt.value = option.toLowerCase();
        opt.textContent = option;
        if (selectedSubTopic && opt.value === selectedSubTopic.toLowerCase()) {
            opt.selected = true;
        }
        subTopicSelect.appendChild(opt);
    });
}

function populateFilterOptions() {
    ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'].forEach(topic => {
        const select = document.getElementById(`filter-sub-topic-${topic}`);
        if (!select || !topicOptions[topic]) return;

        topicOptions[topic].forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.toLowerCase();
            opt.textContent = option;
            select.appendChild(opt);
        });
    });
}

// --- Data Fetching ---
function loadEvents() {
    fetch('/api/timeline/events')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        })
        .then(data => {
            events = data;
            renderTimelines();
            // Also update Attention panel if we are in that view (or always, since it's cheap and state might change)
            if (document.getElementById('view-attention').classList.contains('active')) {
                renderAttentionPanel();
            }
        })
        .catch(err => {
            console.error('Error loading events:', err);
        });
}

// --- User Management ---
function loadUsers() {
    fetch('/api/timeline/users')
        .then(response => response.json())
        .then(data => {
            users = data;
            renderUsersList();
        })
        .catch(err => console.error('Error loading users:', err));
}

// --- Authentication ---
function checkSession() {
    const savedUser = localStorage.getItem('timeline_logged_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        unlockApp();
    } else {
        lockApp();
    }
}

function lockApp() {
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('header-user-info').style.display = 'none';
}

function unlockApp() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('header-user-info').style.display = 'flex';

    // Custom display for Monitoring user
    if (currentUser.id === 'monitor-session') {
        document.getElementById('display-user-name').textContent = 'Monitoramento';
    } else {
        document.getElementById('display-user-name').textContent = `Olá, ${currentUser.nome}`;
    }

    applyRoleAccess();
    loadEvents();
    loadUsers(); // Load users list for management

    // Ensure refresh control visibility based on initial active view
    const activeSection = document.querySelector('.view-section.active');
    if (activeSection && (activeSection.id === 'view-visualizacao' || activeSection.id === 'view-attention')) {
        updateAutoRefreshVisibility(true);
    } else {
        updateAutoRefreshVisibility(false);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    fetch('/api/timeline/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
        .then(response => {
            if (!response.ok) throw new Error('E-mail ou senha incorretos');
            return response.json();
        })
        .then(data => {
            currentUser = data.user;
            localStorage.setItem('timeline_logged_user', JSON.stringify(currentUser));
            unlockApp();
        })
        .catch(err => alert(err.message));
}

function handleMonitorLogin() {
    fetch('/api/timeline/login/monitor', {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao entrar no modo monitoramento');
            return response.json();
        })
        .then(data => {
            currentUser = data.user;
            // distinct storage key or same? If same, user will stay logged in as monitor. 
            // That's standard behavior.
            localStorage.setItem('timeline_logged_user', JSON.stringify(currentUser));
            unlockApp();
        })
        .catch(err => alert(err.message));
}

function logout() {
    currentUser = null;
    localStorage.removeItem('timeline_logged_user');
    lockApp();
}

function applyRoleAccess() {
    if (!currentUser) return;

    if (currentUser.perfil === 'administrativo') {
        navForm.style.display = 'flex';
        navUsers.style.display = 'flex';
    } else {
        navForm.style.display = 'none';
        navUsers.style.display = 'none';
        // If current view is restricted, switch to visualizacao
        const activeSection = document.querySelector('.view-section.active');
        if (activeSection && (activeSection.id === 'view-anexo' || activeSection.id === 'view-users')) {
            switchView('visualizacao');
        }
    }
}

function handleUserFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const nome = document.getElementById('user-nome').value;
    const email = document.getElementById('user-email').value;
    const senha = document.getElementById('user-password').value;
    const perfil = document.getElementById('user-perfil').value;

    const userData = {
        id: id || Date.now().toString(),
        nome,
        email,
        senha,
        perfil
    };

    // Use POST for both Create and Update (Backend uses INSERT OR REPLACE)
    const method = 'POST';
    const url = '/api/timeline/users';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar usuário');
            }
            return data;
        })
        .then(() => {
            alert(id ? 'Usuário atualizado!' : 'Usuário criado!');
            resetUserForm();
            loadUsers();
        })
        .catch(err => alert(err.message));
}

function renderUsersList() {
    const container = document.getElementById('users-list-container');
    container.innerHTML = '';

    // Filter users: Admins see all, others see only themselves
    let visibleUsers = currentUser.perfil === 'administrativo'
        ? users
        : users.filter(u => u.id === currentUser.id);

    // Apply secondary role filter for admins
    const roleFilter = document.getElementById('user-role-filter')?.value || 'todos';
    if (currentUser.perfil === 'administrativo' && roleFilter !== 'todos') {
        visibleUsers = visibleUsers.filter(u => u.perfil === roleFilter);
    }

    // Apply name search filter
    const searchFilter = document.getElementById('user-search')?.value.toLowerCase().trim() || '';
    if (searchFilter) {
        visibleUsers = visibleUsers.filter(u => u.nome.toLowerCase().includes(searchFilter));
    }

    if (visibleUsers.length === 0) {
        container.innerHTML = '<div class="empty-state">Nenhum usuário cadastrado.</div>';
        return;
    }

    visibleUsers.forEach(user => {
        const item = document.createElement('div');
        item.className = 'user-list-item';

        const info = document.createElement('div');
        info.className = 'user-info';

        const nameLabel = document.createElement('span');
        nameLabel.className = 'user-name';
        nameLabel.textContent = user.nome;

        const emailLabel = document.createElement('small');
        emailLabel.style.color = '#64748b';
        emailLabel.textContent = user.email || 'Sem e-mail';

        const badge = document.createElement('span');
        badge.className = `user-role-badge ${user.perfil === 'administrativo' ? 'badge-admin' : 'badge-standard'}`;
        badge.style.width = 'fit-content';
        badge.textContent = user.perfil;

        info.appendChild(nameLabel);
        info.appendChild(emailLabel);
        info.appendChild(badge);
        item.appendChild(info);

        const actions = document.createElement('div');
        actions.className = 'user-actions';

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-inline btn-inline-edit';
        btnEdit.innerHTML = '✏️ Ed';
        btnEdit.title = 'Editar';
        btnEdit.onclick = (e) => {
            e.stopPropagation();
            editUser(user);
        };

        const btnDel = document.createElement('button');
        btnDel.className = 'btn-inline btn-inline-delete';
        btnDel.innerHTML = '🗑️';
        btnDel.title = 'Excluir';
        btnDel.onclick = (e) => {
            e.stopPropagation();
            if (user.id === '1') return alert('Não é possível excluir o administrador padrão.');
            if (!confirm(`Excluir o usuário ${user.nome}?`)) return;

            fetch(`/api/timeline/users/${user.id}`, { method: 'DELETE' })
                .then(() => {
                    alert('Usuário excluído!');
                    if (document.getElementById('user-id').value === user.id) resetUserForm();
                    loadUsers();
                })
                .catch(err => alert('Erro ao excluir: ' + err.message));
        };

        actions.appendChild(btnEdit);

        // Only Admins can delete users
        if (currentUser.perfil === 'administrativo') {
            actions.appendChild(btnDel);
        }

        item.appendChild(actions);

        container.appendChild(item);
    });
}

function editUser(user) {
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-nome').value = user.nome;
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('user-password').value = user.senha || '';
    document.getElementById('user-perfil').value = user.perfil;
    document.getElementById('btn-delete-user').style.display = 'block';

    // Auto-open form accordion
    const formAcc = document.getElementById('acc-user-form');
    if (formAcc && !formAcc.classList.contains('active')) {
        formAcc.classList.add('active');
        // Optional: Close list accordion if you want strict focus
        // document.getElementById('acc-user-list')?.classList.remove('active');
    }
    document.getElementById('user-nome').focus();
}

function resetUserForm() {
    document.getElementById('user-id').value = '';
    document.getElementById('user-nome').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-perfil').value = 'padrao';
    document.getElementById('btn-delete-user').style.display = 'none';
}

function handleDeleteUser() {
    const id = document.getElementById('user-id').value;
    if (!id) return;
    if (id === '1') return alert('Não é possível excluir o administrador padrão.');
    if (!confirm('Excluir este usuário?')) return;

    fetch(`/api/timeline/users/${id}`, { method: 'DELETE' })
        .then(() => {
            alert('Usuário excluído!');
            resetUserForm();
            loadUsers();
        })
        .catch(err => alert('Erro ao excluir: ' + err.message));
}

// --- View Switching ---
function switchView(viewName) {
    // List of all sections and their nav buttons
    const views = {
        'visualizacao': { section: sectionVisualizacao, button: navTimeline },
        'attention': { section: sectionAttention, button: navAttention },
        'anexo': { section: sectionAnexo, button: navForm },
        'users': { section: sectionUsers, button: navUsers }
    };

    // Deactivate all
    Object.values(views).forEach(v => {
        v.section.classList.remove('active');
        if (v.button) v.button.classList.remove('active');
    });

    // Activate the requested one
    if (views[viewName]) {
        views[viewName].section.classList.add('active');
        if (views[viewName].button) views[viewName].button.classList.add('active');
    }

    if (viewName === 'visualizacao') {
        loadEvents();
        updateAutoRefreshVisibility(true);
    } else if (viewName === 'attention') {
        renderAttentionPanel();
        updateAutoRefreshVisibility(true);
    } else {
        updateAutoRefreshVisibility(false);
    }
}

function updateAutoRefreshVisibility(isVisible) {
    const control = document.getElementById('floating-refresh-control');
    if (control) {
        if (isVisible) {
            control.classList.remove('hidden');
            // If toggle is checked and we returned to view, ensure timer is running
            const toggle = document.getElementById('auto-refresh-toggle');
            if (toggle && toggle.checked && !autoRefreshInterval) {
                toggleAutoRefresh(true);
            }
        } else {
            control.classList.add('hidden');
            // Logic decision: Do we stop refresh when looking at other views? 
            // Probably yes to handle performance/UX.
            // But we keep the toggle checked conceptually.
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
                autoRefreshInterval = null;
            }
        }
    }
}

function toggleAutoRefresh(enable) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }

    if (enable) {
        console.log("Auto-refresh enabled (60s)");
        loadEvents(); // Immediate reload
        autoRefreshInterval = setInterval(() => {
            console.log("Auto-refresh triggering...");
            loadEvents();
        }, 60000); // 60 seconds
    } else {
        console.log("Auto-refresh disabled");
    }
}

// --- Form Handling ---
function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Salvando...';
    submitBtn.disabled = true;

    const id = document.getElementById('event-id').value;
    const nome = document.getElementById('nome').value;
    const topico = document.getElementById('topico').value;
    const sub_topico = document.getElementById('sub-topico').value;
    const em_ocorrencia = document.getElementById('em-ocorrencia').checked ? 1 : 0;
    const inicio = document.getElementById('inicio').value;
    const fim = document.getElementById('fim').value;
    const descricao = document.getElementById('descricao').value;
    const anotacao = document.getElementById('anotacao').value;
    const cor = document.getElementById('cor').value;

    const eventData = {
        id: id ? id : Date.now().toString(), // Generate String ID
        nome,
        topico,
        sub_topico,
        em_ocorrencia,
        inicio,
        fim,
        descricao,
        anotacao,
        cor
    };

    saveEvent(eventData);
}

function saveEvent(eventData) {
    fetch('/api/timeline/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
        .then(async response => {
            const text = await response.text();
            console.log('Raw response:', text);

            if (!response.ok) {
                throw new Error(`Server error (${response.status}): ${text}`);
            }

            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error('Invalid JSON response: ' + text);
            }
        })
        .then(data => {
            console.log('Saved:', data);
            alert('Evento salvo com sucesso!');
            resetForm();
            switchView('visualizacao');
        })
        .catch(err => {
            console.error('Error saving event:', err);
            alert('Erro ao salvar evento: ' + err.message);
        })
        .finally(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Salvar Evento';
            submitBtn.disabled = false;
        });
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('event-id').value = event.id;
    document.getElementById('nome').value = event.nome;
    const normalizedTopic = normalizeTopic(event.topico);
    document.getElementById('topico').value = normalizedTopic;

    // Update sub-topic options and select value
    updateSubTopics(normalizedTopic, event.sub_topico);

    const emOcorrenciaCheckbox = document.getElementById('em-ocorrencia');
    // Loose equality, string check, OR heuristic: if no end date, it's 'Em Ocorrência'
    emOcorrenciaCheckbox.checked = event.em_ocorrencia == 1 || event.em_ocorrencia === 'true' || !event.fim;

    // Trigger change event to set required state
    emOcorrenciaCheckbox.dispatchEvent(new Event('change'));

    document.getElementById('inicio').value = event.inicio;

    // Careful not to overwrite if empty and not required, but logic in listener handles 'required'
    // If 'em_ocorrencia' is true, listener sets required=false. 
    // We should set value AFTER triggering change, which we do.
    document.getElementById('fim').value = event.fim;

    document.getElementById('descricao').value = event.descricao;
    document.getElementById('anotacao').value = event.anotacao;
    document.getElementById('cor').value = event.cor || '#000000';

    switchView('anexo');
    // Show delete button
    document.getElementById('btn-delete').style.display = 'block';
}

function resetForm() {
    form.reset();
    document.getElementById('event-id').value = '';
    // Reset sub-topics
    updateSubTopics('');

    // Reset required state
    document.getElementById('fim').required = true;

    // Reset color
    document.getElementById('cor').value = '#000000';

    // Hide delete button
    document.getElementById('btn-delete').style.display = 'none';
}

function handleDelete() {
    const id = document.getElementById('event-id').value;
    if (!id) return;

    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    fetch(`/api/timeline/events/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete');
            return response.json();
        })
        .then(data => {
            alert('Evento excluído!');
            resetForm();
            switchView('visualizacao');
        })
        .catch(err => {
            console.error('Error deleting:', err);
            alert('Erro ao excluir: ' + err.message);
        });
}

function applyFilters(topic) {
    const startInput = document.getElementById(`filter-start-${topic}`);
    const endInput = document.getElementById(`filter-end-${topic}`);
    const subTopicInput = document.getElementById(`filter-sub-topic-${topic}`);

    const start = startInput.value ? new Date(startInput.value).getTime() : null;
    const end = endInput.value ? new Date(endInput.value).getTime() : null;
    const subTopic = subTopicInput ? subTopicInput.value : '';

    if (!filters[topic]) filters[topic] = {};
    filters[topic] = { start, end, subTopic };
    renderTimelines();
}

function clearFilters(topic) {
    const startInput = document.getElementById(`filter-start-${topic}`);
    const endInput = document.getElementById(`filter-end-${topic}`);
    const subTopicInput = document.getElementById(`filter-sub-topic-${topic}`);

    startInput.value = '';
    endInput.value = '';
    if (subTopicInput) subTopicInput.value = '';

    if (filters[topic]) {
        filters[topic] = null;
    }
    renderTimelines();
}

function toggleFilters(topic) {
    const filtersPanel = document.getElementById(`filters-panel-${topic}`);
    const toggleBtn = document.getElementById(`btn-toggle-${topic}`);

    if (filtersPanel && toggleBtn) {
        filtersPanel.classList.toggle('hidden');
        toggleBtn.classList.toggle('active');
    }
}

function toggleAccordion(id) {
    const item = document.getElementById(id);
    if (item) {
        // Option 1: Independent toggling (Collapsible)
        item.classList.toggle('active');

        // Option 2: Accordion behavior (Close others)
        // If you want strict accordion, uncomment below:
        // const siblings = item.parentElement.querySelectorAll('.accordion-item');
        // siblings.forEach(sibling => {
        //     if (sibling !== item) sibling.classList.remove('active');
        // });
    }
}

// --- Timeline Rendering ---
function renderTimelines() {
    // Clear tracks
    ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'].forEach(topic => {
        document.getElementById(`track-${topic}`).innerHTML = '';
        document.getElementById(`min-date-${topic}`).textContent = '';
        document.getElementById(`max-date-${topic}`).textContent = '';
    });

    if (events.length === 0) return;

    const topics = ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'];

    topics.forEach(topic => {
        const topicEvents = events.filter(e => normalizeTopic(e.topico) === topic);
        console.log(`Rendering topic: ${topic}, events found: ${topicEvents.length}`);

        // Legacy call removed

        const hasSubTopicFilter = filters[topic] && filters[topic].subTopic;

        // Apply Sub-Topic Filter FIRST (if active)
        let filteredEvents = topicEvents;
        if (hasSubTopicFilter) {
            filteredEvents = topicEvents.filter(e => {
                const st = e.sub_topico ? e.sub_topico.toLowerCase() : '';
                return st === filters[topic].subTopic.toLowerCase();
            });
        }

        // --- SLA Calculation start ---
        // Determine SLA Window based on Filters or Default
        const slaStart = (filters[topic] && filters[topic].start)
            ? filters[topic].start
            : new Date('2026-01-01T00:00:00').getTime();

        const slaEnd = (filters[topic] && filters[topic].end)
            ? filters[topic].end
            : Date.now();

        // Pass FILTERED events to SLA calculation
        calculateTopicSLA(topic, filteredEvents, slaStart, slaEnd);
        // --- SLA Calculation end ---

        // --- Locked Window logic ---
        // Use filter range if available, otherwise default to full range
        const renderMin = (filters[topic] && filters[topic].start)
            ? filters[topic].start
            : new Date('2026-01-01T00:00:00').getTime();

        const renderMax = (filters[topic] && filters[topic].end)
            ? filters[topic].end
            : Date.now(); // Or some future max if preferred, but Date.now() keeps it current

        const renderRange = renderMax - renderMin;

        // Update helper text
        document.getElementById(`min-date-${topic}`).textContent = new Date(renderMin).toLocaleDateString() + ' ' + new Date(renderMin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById(`max-date-${topic}`).textContent = new Date(renderMax).toLocaleDateString() + ' ' + new Date(renderMax).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const track = document.getElementById(`track-${topic}`);

        filteredEvents.forEach(ev => {
            const evStart = new Date(ev.inicio).getTime();
            // Handle 'Em Ocorrência': if no end date, use NOW
            const evEnd = ev.fim ? new Date(ev.fim).getTime() : Date.now();

            // Check intersection with the render window
            // If the event ends before the window starts OR starts after the window ends, skip it
            if (evEnd < renderMin || evStart > renderMax) {
                return;
            }

            // Calculate clamping for visual display
            // We want the bar to visually start at the event start, clamped to renderMin
            const visualStart = Math.max(evStart, renderMin);
            // We want the bar to visually end at the event end, clamped to renderMax
            const visualEnd = Math.min(evEnd, renderMax);

            // Calculate percentages
            const leftPercent = ((visualStart - renderMin) / renderRange) * 100;
            const widthPercent = ((visualEnd - visualStart) / renderRange) * 100;

            // Safety clip
            if (widthPercent <= 0) return;

            console.log(`Event: ${ev.nome}, Start: ${ev.inicio}, End: ${evEnd}, Left: ${leftPercent}%, Width: ${widthPercent}%`);

            const bar = document.createElement('div');
            bar.className = 'timeline-bar';
            bar.style.left = `${leftPercent}%`;
            bar.style.width = `${widthPercent}%`;
            // Set color on the container, children will use currentColor
            bar.style.color = ev.cor && ev.cor !== '#000000' ? ev.cor : topicColors[topic];

            // Create Visual Segment (The semi-transparent line)
            const visual = document.createElement('div');
            visual.className = 'timeline-bar-visual';
            bar.appendChild(visual);

            // Create Identifier Point
            const point = document.createElement('div');
            point.className = 'timeline-identifier-point';

            // Tooltip content
            const startStr = new Date(ev.inicio).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
            // Handle missing end date
            const endStr = ev.fim ? new Date(ev.fim).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Em andamento';

            // Capitalize topic for display
            const displayTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
            const displaySubTopic = ev.sub_topico ? ev.sub_topico.charAt(0).toUpperCase() + ev.sub_topico.slice(1) : '-';

            const tooltipText = `Tópico: ${displayTopic}\nEventos: ${displaySubTopic}\nInício: ${startStr} - Fim: ${endStr}\nDescrição: ${ev.descricao || '-'}`;

            point.setAttribute('data-tooltip', tooltipText);

            // Pulse effect for in-progress events
            if (!ev.fim) {
                point.classList.add('pulsing');
            }


            // Click to edit - ONLY for admins
            if (currentUser && currentUser.perfil === 'administrativo') {
                point.style.cursor = 'pointer';
                point.onclick = (e) => {
                    e.stopPropagation();
                    editEvent(ev.id);
                };
            } else {
                point.style.cursor = 'default';
            }

            bar.appendChild(point);

            // bar.onclick removed

            track.appendChild(bar);
        });
    });
}

function normalizeTopic(str) {
    if (!str) return '';
    return str.toLowerCase().trim();
}

function calculateTopicSLA(topic, events, slaStart, slaEnd) {
    const slaElement = document.getElementById(`sla-${topic}`);
    if (!slaElement) return;

    // SLA Calculation Parameters
    // Use passed arguments
    const totalDuration = slaEnd - slaStart;

    if (totalDuration <= 0) {
        slaElement.textContent = 'N/A';
        return;
    }

    // 1. Filter events that overlap with the window [slaStart, slaEnd]
    const relevantEvents = events.filter(e => {
        const start = new Date(e.inicio).getTime();
        const end = e.fim ? new Date(e.fim).getTime() : Date.now();
        return end > slaStart && start < slaEnd;
    });

    // 2. Create intervals clipped to the window
    const intervals = relevantEvents.map(e => {
        const start = new Date(e.inicio).getTime();
        const end = e.fim ? new Date(e.fim).getTime() : Date.now();
        return {
            start: Math.max(start, slaStart),
            end: Math.min(end, slaEnd)
        };
    });

    // 3. Merge overlapping intervals
    intervals.sort((a, b) => a.start - b.start);

    const mergedIntervals = [];
    if (intervals.length > 0) {
        let current = intervals[0];
        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i];
            if (next.start < current.end) {
                // Overlap or adjacent, merge
                current.end = Math.max(current.end, next.end);
            } else {
                mergedIntervals.push(current);
                current = next;
            }
        }
        mergedIntervals.push(current);
    }

    // 4. Calculate total downtime
    let downTime = 0;
    mergedIntervals.forEach(interval => {
        downTime += (interval.end - interval.start);
    });

    // 5. Calculate Availability
    const availability = ((totalDuration - downTime) / totalDuration) * 100;

    // Display
    // Determine color based on SLA (Optional but nice)
    // > 99% Green, > 95% Orange, < 95% Red example
    let color = 'var(--primary-color)';
    if (availability < 99) color = '#f97316'; // Orange
    if (availability < 95) color = '#ef4444'; // Red
    if (availability >= 99.9) color = '#10b981'; // Green

    slaElement.style.color = color;
    // Format to 4 decimal places if very high, otherwise 2
    slaElement.textContent = availability.toFixed(4) + '%';
}

function renderAttentionPanel() {
    const container = document.getElementById('attention-topics-container');
    container.innerHTML = '';

    const inProgressEvents = events.filter(e => !e.fim || e.em_ocorrencia == 1);
    const topics = ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'];

    topics.forEach(topic => {
        const topicEvents = inProgressEvents.filter(e => normalizeTopic(e.topico) === topic);

        // Accordion Wrapper
        const accordionItem = document.createElement('div');
        // Only open if there are events
        accordionItem.className = topicEvents.length > 0 ? 'accordion-item active' : 'accordion-item';
        accordionItem.id = `attn-acc-${topic}`;

        // Accordion Header
        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.onclick = () => toggleAccordion(`attn-acc-${topic}`);

        const titleGroup = document.createElement('div');
        titleGroup.className = 'accordion-title-group';

        const indicator = document.createElement('div');
        indicator.className = 'topic-indicator';
        indicator.style.backgroundColor = topicColors[topic];

        const h3 = document.createElement('h3');
        h3.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);

        // Count badge
        const badge = document.createElement('span');
        badge.style.cssText = 'background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; color: #64748b; margin-left: 0.5rem;';
        badge.textContent = `${topicEvents.length}`;

        titleGroup.appendChild(indicator);
        titleGroup.appendChild(h3);
        titleGroup.appendChild(badge);

        const chevron = document.createElement('span');
        chevron.className = 'accordion-chevron';
        chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`;

        header.appendChild(titleGroup);
        header.appendChild(chevron);

        // Accordion Content
        const content = document.createElement('div');
        content.className = 'accordion-content';

        const body = document.createElement('div');
        body.className = 'accordion-body'; // Reusing wrapper for padding

        const grid = document.createElement('div');
        grid.className = 'attention-carousel'; // Changed to carousel

        if (topicEvents.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'Nenhum evento em andamento.';
            grid.appendChild(empty);
        } else {
            topicEvents.forEach(ev => {
                const card = document.createElement('div');
                card.className = 'attention-card';
                card.style.borderLeftColor = ev.cor && ev.cor !== '#000000' ? ev.cor : topicColors[topic];

                const name = document.createElement('h3');
                name.textContent = ev.nome;

                const subTopic = document.createElement('div');
                subTopic.className = 'sub-topic';
                subTopic.textContent = ev.sub_topico || '-';

                const start = document.createElement('div');
                start.className = 'card-detail';
                start.innerHTML = `<strong>Início:</strong> ${new Date(ev.inicio).toLocaleString()}`;

                // Calculate Duration
                const durationMs = Date.now() - new Date(ev.inicio).getTime();
                const duration = document.createElement('div');
                duration.className = 'card-duration';
                duration.innerHTML = `<strong>Tempo:</strong> <span>${formatDuration(durationMs)}</span>`;

                const desc = document.createElement('div');
                desc.className = 'card-description';
                desc.textContent = ev.descricao || '-';

                card.appendChild(name);
                card.appendChild(subTopic);
                card.appendChild(start);
                card.appendChild(duration);
                card.appendChild(desc);

                // Add click to edit for admins
                if (currentUser && currentUser.perfil === 'administrativo') {
                    card.style.cursor = 'pointer';
                    card.onclick = () => editEvent(ev.id);
                } else {
                    card.style.cursor = 'default';
                }

                grid.appendChild(card);
            });
        }

        body.appendChild(grid);
        content.appendChild(body);

        accordionItem.appendChild(header);
        accordionItem.appendChild(content);

        container.appendChild(accordionItem);
    });
}

function formatDuration(ms) {
    if (ms < 0) return "0s";

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours % 24 > 0 || days > 0) parts.push(`${hours % 24}h`);
    if (minutes % 60 > 0 || hours > 0) parts.push(`${minutes % 60}m`);
    parts.push(`${seconds % 60}s`);

    return parts.join(' ');
}


// --- Team Modal Logic ---
function openTeamModal() {
    const modal = document.getElementById('team-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeTeamModal() {
    const modal = document.getElementById('team-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function closeTeamModalOnOutsideClick(event) {
    if (event.target.id === 'team-modal') {
        closeTeamModal();
    }
}
