// ============================================================
// Timeline Module - Integrated into Intranet TI
// Auth is handled by window.auth (Intranet's auth.js)
// ============================================================

// State
let events = [];
let filters = {};
let autoRefreshInterval = null;

// DOM references (initialized on init())
let timelineForm;
let sectionVisualizacao;
let sectionAttention;
let sectionAnexo;

// Topic config
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

export const timelineHandler = {
    init() {
        // Cache DOM refs
        timelineForm = document.getElementById('timeline-event-form');
        sectionVisualizacao = document.getElementById('view-visualizacao');
        sectionAttention = document.getElementById('view-attention');
        sectionAnexo = document.getElementById('view-anexo');

        // Expose functions for HTML inline handlers
        window.applyFilters = applyFilters;
        window.clearFilters = clearFilters;
        window.toggleFilters = toggleFilters;
        window.handleDelete = handleDelete;
        window.resetForm = resetForm;
        window.toggleAccordion = toggleAccordion;
        window.handleFormSubmit = handleFormSubmit;
        window.editEvent = editEvent;

        // Topic select change
        const topicSelect = document.getElementById('topico');
        if (topicSelect) {
            topicSelect.addEventListener('change', (e) => {
                updateSubTopics(e.target.value);
            });
        }

        // Em Ocorrência toggle
        const emOcorrenciaToggle = document.getElementById('em-ocorrencia');
        if (emOcorrenciaToggle) {
            emOcorrenciaToggle.addEventListener('change', (e) => {
                const fimInput = document.getElementById('fim');
                const inicioInput = document.getElementById('inicio');
                if (e.target.checked) {
                    if (!inicioInput.value) {
                        const now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                        inicioInput.value = now.toISOString().slice(0, 16);
                    }
                    fimInput.required = false;
                } else {
                    // Ao desligar "Em Ocorrência", sempre preenche 'fim' com data/hora atual
                    const now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                    fimInput.value = now.toISOString().slice(0, 16);
                    fimInput.required = true;
                }
            });
        }

        // Populate filter dropdowns
        populateFilterOptions();

        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                toggleAutoRefresh(e.target.checked);
            });
        }

        // Tab navigation
        document.querySelectorAll('[data-timeline-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-timeline-tab');
                switchView(tabName);
            });
        });

        // Form submit
        if (timelineForm) {
            timelineForm.addEventListener('submit', handleFormSubmit);
        }

        // Re-apply when section changes
        window.addEventListener('SectionChange', (e) => {
            if (e.detail && e.detail.section === 'timeline') {
                loadEvents();
                applyRoleAccess();
            }
        });

        // Load data
        loadEvents();
        applyRoleAccess();
    }
};

// Auto-refresh when window regains focus
window.addEventListener('focus', () => {
    if (sectionVisualizacao) loadEvents();
});

// ============================================================
// Helper Functions
// ============================================================
function updateSubTopics(topic, selectedSubTopic = null) {
    const subTopicSelect = document.getElementById('sub-topico');
    if (!subTopicSelect) return;

    const normalizedTopic = topic ? topic.toLowerCase().trim() : '';
    if (!normalizedTopic || !topicOptions[normalizedTopic]) {
        subTopicSelect.innerHTML = '<option value="">Selecione o tópico primeiro...</option>';
        subTopicSelect.classList.remove('has-options');
        return;
    }

    // Placeholder para quando há opções disponíveis
    subTopicSelect.innerHTML = '<option value="" disabled selected>Escolha o evento...</option>';

    topicOptions[normalizedTopic].forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.toLowerCase();
        opt.textContent = option;
        if (selectedSubTopic && opt.value === selectedSubTopic.toLowerCase()) {
            opt.selected = true;
        }
        subTopicSelect.appendChild(opt);
    });

    // Se não há seleção fornecida, auto-selecionar o primeiro item
    if (!selectedSubTopic) {
        subTopicSelect.selectedIndex = 1; // pula o placeholder e seleciona o primeiro real
    }

    // Feedback visual: destaca o campo como populado
    subTopicSelect.classList.add('has-options');
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

// ============================================================
// Data Fetching
// ============================================================
function loadEvents() {
    fetch('/api/timeline/events')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        })
        .then(data => {
            events = data;
            renderTimelines();
            if (sectionAttention && sectionAttention.classList.contains('active')) {
                renderAttentionPanel();
            }
        })
        .catch(err => {
            console.error('Error loading events:', err);
        });
}

// ============================================================
// Role Access
// ============================================================
function applyRoleAccess() {
    const btnForm = document.getElementById('timeline-tab-anexo');
    const isAdmin = window.auth && window.auth.isAdmin();
    if (isAdmin) {
        if (btnForm) btnForm.classList.remove('role-hidden');
    } else {
        if (btnForm) btnForm.classList.add('role-hidden');
        if (sectionAnexo && sectionAnexo.classList.contains('active')) {
            switchView('visualizacao');
        }
    }
}

// ============================================================
// View Switching
// ============================================================
function switchView(viewName) {
    const views = {
        'visualizacao': { section: sectionVisualizacao, button: document.querySelector('[data-timeline-tab="visualizacao"]') },
        'attention': { section: sectionAttention, button: document.querySelector('[data-timeline-tab="attention"]') },
        'anexo': { section: sectionAnexo, button: document.querySelector('[data-timeline-tab="anexo"]') },
    };

    Object.values(views).forEach(v => {
        if (v.section) v.section.classList.remove('active');
        if (v.button) v.button.classList.remove('active');
    });

    if (views[viewName]) {
        if (views[viewName].section) views[viewName].section.classList.add('active');
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
    if (!control) return;
    if (isVisible) {
        control.classList.remove('hidden');
        const toggle = document.getElementById('auto-refresh-toggle');
        if (toggle && toggle.checked && !autoRefreshInterval) {
            toggleAutoRefresh(true);
        }
    } else {
        control.classList.add('hidden');
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
    }
}

function toggleAutoRefresh(enable) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
    if (enable) {
        loadEvents();
        autoRefreshInterval = setInterval(loadEvents, 60000);
    }
}

// ============================================================
// Form Handling
// ============================================================
function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = timelineForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.textContent = 'Salvando...'; submitBtn.disabled = true; }

    const id = document.getElementById('event-id').value;
    const eventData = {
        id: id || Date.now().toString(),
        nome: document.getElementById('nome').value,
        topico: document.getElementById('topico').value,
        sub_topico: document.getElementById('sub-topico').value,
        em_ocorrencia: document.getElementById('em-ocorrencia').checked ? 1 : 0,
        inicio: document.getElementById('inicio').value,
        fim: document.getElementById('fim').value,
        descricao: document.getElementById('descricao').value,
        anotacao: document.getElementById('anotacao').value,
        cor: document.getElementById('cor').value
    };

    fetch('/api/timeline/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    })
        .then(async response => {
            const text = await response.text();
            if (!response.ok) throw new Error(`Server error (${response.status}): ${text}`);
            return JSON.parse(text);
        })
        .then(() => {
            alert('Evento salvo com sucesso!');
            resetForm();
            switchView('visualizacao');
        })
        .catch(err => {
            console.error('Error saving event:', err);
            alert('Erro ao salvar evento: ' + err.message);
        })
        .finally(() => {
            if (submitBtn) { submitBtn.textContent = 'Salvar Evento'; submitBtn.disabled = false; }
        });
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('event-id').value = event.id;
    document.getElementById('nome').value = event.nome;
    const normalizedTopic = normalizeTopic(event.topico);
    document.getElementById('topico').value = normalizedTopic;
    updateSubTopics(normalizedTopic, event.sub_topico);

    const emOcorrenciaCheckbox = document.getElementById('em-ocorrencia');
    emOcorrenciaCheckbox.checked = event.em_ocorrencia == 1 || event.em_ocorrencia === 'true' || !event.fim;
    emOcorrenciaCheckbox.dispatchEvent(new Event('change'));

    document.getElementById('inicio').value = event.inicio;
    document.getElementById('fim').value = event.fim || '';
    document.getElementById('descricao').value = event.descricao || '';
    document.getElementById('anotacao').value = event.anotacao || '';
    document.getElementById('cor').value = event.cor || '#000000';

    switchView('anexo');
    const btnDelete = document.getElementById('btn-delete');
    if (btnDelete) btnDelete.style.display = 'block';
}

function resetForm() {
    if (timelineForm) timelineForm.reset();
    const eventId = document.getElementById('event-id');
    if (eventId) eventId.value = '';
    updateSubTopics('');
    const fim = document.getElementById('fim');
    if (fim) fim.required = true;
    const cor = document.getElementById('cor');
    if (cor) cor.value = '#000000';
    const btnDelete = document.getElementById('btn-delete');
    if (btnDelete) btnDelete.style.display = 'none';
}

function handleDelete() {
    const id = document.getElementById('event-id').value;
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    fetch(`/api/timeline/events/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete');
            return response.json();
        })
        .then(() => {
            alert('Evento excluído!');
            resetForm();
            switchView('visualizacao');
        })
        .catch(err => {
            console.error('Error deleting:', err);
            alert('Erro ao excluir: ' + err.message);
        });
}

// ============================================================
// Filters
// ============================================================
function applyFilters(topic) {
    const startInput = document.getElementById(`filter-start-${topic}`);
    const endInput = document.getElementById(`filter-end-${topic}`);
    const subTopicInput = document.getElementById(`filter-sub-topic-${topic}`);

    const start = startInput && startInput.value ? new Date(startInput.value).getTime() : null;
    const end = endInput && endInput.value ? new Date(endInput.value).getTime() : null;
    const subTopic = subTopicInput ? subTopicInput.value : '';

    filters[topic] = { start, end, subTopic };
    renderTimelines();
}

function clearFilters(topic) {
    const startInput = document.getElementById(`filter-start-${topic}`);
    const endInput = document.getElementById(`filter-end-${topic}`);
    const subTopicInput = document.getElementById(`filter-sub-topic-${topic}`);

    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
    if (subTopicInput) subTopicInput.value = '';
    filters[topic] = null;
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
    if (item) item.classList.toggle('active');
}

// ============================================================
// Timeline Rendering
// ============================================================
function renderTimelines() {
    ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'].forEach(topic => {
        const track = document.getElementById(`track-${topic}`);
        const minDateEl = document.getElementById(`min-date-${topic}`);
        const maxDateEl = document.getElementById(`max-date-${topic}`);
        if (track) track.innerHTML = '';
        if (minDateEl) minDateEl.textContent = '';
        if (maxDateEl) maxDateEl.textContent = '';
    });

    if (events.length === 0) return;

    const topics = ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'];
    topics.forEach(topic => {
        const topicEvents = events.filter(e => normalizeTopic(e.topico) === topic);

        let filteredEvents = topicEvents;
        if (filters[topic] && filters[topic].subTopic) {
            filteredEvents = topicEvents.filter(e => {
                const st = e.sub_topico ? e.sub_topico.toLowerCase() : '';
                return st === filters[topic].subTopic.toLowerCase();
            });
        }

        const slaStart = (filters[topic] && filters[topic].start) ? filters[topic].start : new Date('2026-01-01T00:00:00').getTime();
        const slaEnd = (filters[topic] && filters[topic].end) ? filters[topic].end : Date.now();
        calculateTopicSLA(topic, filteredEvents, slaStart, slaEnd);

        const renderMin = slaStart;
        const renderMax = slaEnd;
        const renderRange = renderMax - renderMin;

        const minDateEl = document.getElementById(`min-date-${topic}`);
        const maxDateEl = document.getElementById(`max-date-${topic}`);
        if (minDateEl) minDateEl.textContent = new Date(renderMin).toLocaleDateString() + ' ' + new Date(renderMin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (maxDateEl) maxDateEl.textContent = new Date(renderMax).toLocaleDateString() + ' ' + new Date(renderMax).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const track = document.getElementById(`track-${topic}`);
        if (!track) return;

        filteredEvents.forEach(ev => {
            const evStart = new Date(ev.inicio).getTime();
            const evEnd = ev.fim ? new Date(ev.fim).getTime() : Date.now();

            if (evEnd < renderMin || evStart > renderMax) return;

            const visualStart = Math.max(evStart, renderMin);
            const visualEnd = Math.min(evEnd, renderMax);
            const leftPercent = ((visualStart - renderMin) / renderRange) * 100;
            const widthPercent = ((visualEnd - visualStart) / renderRange) * 100;
            if (widthPercent <= 0) return;

            const bar = document.createElement('div');
            bar.className = 'timeline-bar';
            bar.style.left = `${leftPercent}%`;
            bar.style.width = `${widthPercent}%`;
            bar.style.color = ev.cor && ev.cor !== '#000000' ? ev.cor : topicColors[topic];

            const visual = document.createElement('div');
            visual.className = 'timeline-bar-visual';
            bar.appendChild(visual);

            const point = document.createElement('div');
            point.className = 'timeline-identifier-point';

            const startStr = new Date(ev.inicio).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
            const endStr = ev.fim ? new Date(ev.fim).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Em andamento';
            const displayTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
            const displaySubTopic = ev.sub_topico ? ev.sub_topico.charAt(0).toUpperCase() + ev.sub_topico.slice(1) : '-';
            point.setAttribute('data-tooltip', `Tópico: ${displayTopic}\nEventos: ${displaySubTopic}\nInício: ${startStr} - Fim: ${endStr}\nDescrição: ${ev.descricao || '-'}`);

            const isInProgress = !ev.fim || ev.em_ocorrencia == 1 || ev.em_ocorrencia === 'true';
            if (isInProgress) point.classList.add('pulsing');

            if (window.auth && window.auth.isAdmin()) {
                point.style.cursor = 'pointer';
                point.onclick = (e) => {
                    e.stopPropagation();
                    editEvent(ev.id);
                };
            } else {
                point.style.cursor = 'default';
            }

            bar.appendChild(point);
            track.appendChild(bar);
        });
    });
}

function normalizeTopic(str) {
    if (!str) return '';
    return str.toLowerCase().trim();
}

function calculateTopicSLA(topic, evts, slaStart, slaEnd) {
    const slaElement = document.getElementById(`sla-${topic}`);
    if (!slaElement) return;

    const totalDuration = slaEnd - slaStart;
    if (totalDuration <= 0) { slaElement.textContent = 'N/A'; return; }

    const relevantEvents = evts.filter(e => {
        const start = new Date(e.inicio).getTime();
        const end = e.fim ? new Date(e.fim).getTime() : Date.now();
        return end > slaStart && start < slaEnd;
    });

    const intervals = relevantEvents.map(e => ({
        start: Math.max(new Date(e.inicio).getTime(), slaStart),
        end: Math.min(e.fim ? new Date(e.fim).getTime() : Date.now(), slaEnd)
    }));

    intervals.sort((a, b) => a.start - b.start);

    const mergedIntervals = [];
    if (intervals.length > 0) {
        let current = intervals[0];
        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i];
            if (next.start < current.end) {
                current.end = Math.max(current.end, next.end);
            } else {
                mergedIntervals.push(current);
                current = next;
            }
        }
        mergedIntervals.push(current);
    }

    let downTime = 0;
    mergedIntervals.forEach(interval => { downTime += (interval.end - interval.start); });

    const availability = ((totalDuration - downTime) / totalDuration) * 100;
    let color = '#10b981'; // Verde: Acima de 90
    if (availability < 50) {
        color = '#ef4444'; // Vermelho: Abaixo de 50
    } else if (availability < 90) {
        color = '#f97316'; // Laranja: Entre 50 e 89.99
    }

    slaElement.style.color = color;
    slaElement.textContent = availability.toFixed(4) + '%';
}

// ============================================================
// Attention Panel
// ============================================================
function renderAttentionPanel() {
    const container = document.getElementById('attention-topics-container');
    if (!container) return;
    container.innerHTML = '';

    const inProgressEvents = events.filter(e => !e.fim || e.em_ocorrencia == 1);
    const topics = ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'];

    topics.forEach(topic => {
        const topicEvents = inProgressEvents.filter(e => normalizeTopic(e.topico) === topic);

        const accordionItem = document.createElement('div');
        accordionItem.className = topicEvents.length > 0 ? 'accordion-item active' : 'accordion-item';
        accordionItem.id = `attn-acc-${topic}`;

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

        const badge = document.createElement('span');
        badge.style.cssText = 'background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;';
        badge.textContent = `${topicEvents.length}`;

        titleGroup.appendChild(indicator);
        titleGroup.appendChild(h3);
        titleGroup.appendChild(badge);

        const chevron = document.createElement('span');
        chevron.className = 'accordion-chevron';
        chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`;

        header.appendChild(titleGroup);
        header.appendChild(chevron);

        const content = document.createElement('div');
        content.className = 'accordion-content';
        const body = document.createElement('div');
        body.className = 'accordion-body';
        const grid = document.createElement('div');
        grid.className = 'attention-carousel';

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

                if (window.auth && window.auth.isAdmin()) {
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
    if (ms < 0) return '0s';
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

// ============================================================
// Team Modal
// ============================================================
function openTeamModal() {
    const modal = document.getElementById('team-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeTeamModal() {
    const modal = document.getElementById('team-modal');
    if (modal) modal.classList.add('hidden');
}

function closeTeamModalOnOutsideClick(event) {
    if (event.target.id === 'team-modal') closeTeamModal();
}
