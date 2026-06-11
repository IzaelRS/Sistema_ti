// ============================================================
// Timeline Module - Integrated into Intranet TI
// Auth is handled by window.auth (Intranet's auth.js)
// ============================================================

// State
let events = [];
let filters = {};
let autoRefreshInterval = null;
let chartSlaInstance = null;
let chartQtyInstance = null;

// Submit guards to prevent duplication
let isSavingEvent = false;
let isSavingTopic = false;
let isSavingSubtopic = false;

// Dynamic Config State
let topics = [];
let subtopics = [];
let topicColors = {};
let topicOptions = {};

// DOM references (initialized on init())
let timelineForm;
let sectionVisualizacao;
let sectionAttention;
let sectionAnexo;
let sectionRelatorio;
let sectionConfig;

export const timelineHandler = {
    init() {
        // Cache DOM refs
        timelineForm = document.getElementById('timeline-event-form');
        sectionVisualizacao = document.getElementById('view-visualizacao');
        sectionAttention = document.getElementById('view-attention');
        sectionAnexo = document.getElementById('view-anexo');
        sectionRelatorio = document.getElementById('view-relatorio');
        sectionConfig = document.getElementById('view-config');

        // Expose timelineHandler globally so inline html event handlers (like onclick) can access it
        window.timelineHandler = timelineHandler;

        // Expose functions for HTML inline handlers
        window.applyFilters = applyFilters;
        window.clearFilters = clearFilters;
        window.toggleFilters = toggleFilters;
        window.handleDelete = handleDelete;
        window.resetForm = resetForm;
        window.toggleAccordion = toggleAccordion;
        window.handleFormSubmit = handleFormSubmit;
        window.editEvent = editEvent;
        window.deleteTopic = deleteTopic;
        window.deleteSubtopic = deleteSubtopic;
        window.handleTrackDragStart = handleTrackDragStart;
        window.handleTrackDragOver = handleTrackDragOver;
        window.handleTrackDragEnd = handleTrackDragEnd;

        // Bind Config Forms
        const topicForm = document.getElementById('timeline-topic-form');
        if (topicForm) {
            topicForm.onsubmit = handleTopicSubmit;
        }
        const subtopicForm = document.getElementById('timeline-subtopic-form');
        if (subtopicForm) {
            subtopicForm.onsubmit = handleSubtopicSubmit;
        }

        // Topic select change
        const topicSelect = document.getElementById('topico');
        if (topicSelect) {
            topicSelect.onchange = (e) => {
                updateSubTopics(e.target.value);
            };
        }

        // Em Ocorrência toggle
        const emOcorrenciaToggle = document.getElementById('em-ocorrencia');
        if (emOcorrenciaToggle) {
            emOcorrenciaToggle.onchange = (e) => {
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
            };
        }

        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.onchange = (e) => {
                toggleAutoRefresh(e.target.checked);
            };
        }

        // Tab navigation
        document.querySelectorAll('[data-timeline-tab]').forEach(btn => {
            btn.onclick = (e) => {
                const tabName = e.currentTarget.getAttribute('data-timeline-tab');
                switchView(tabName);
            };
        });

        // Form submit
        if (timelineForm) {
            timelineForm.onsubmit = handleFormSubmit;
        }

        // Report Filters event listeners
        const repFilterStart = document.getElementById('rep-filter-start');
        const repFilterEnd = document.getElementById('rep-filter-end');
        const repFilterTopic = document.getElementById('rep-filter-topic');
        const repFilterSubtopic = document.getElementById('rep-filter-subtopic');

        if (repFilterStart) repFilterStart.onchange = () => renderReport();
        if (repFilterEnd) repFilterEnd.onchange = () => renderReport();
        if (repFilterTopic) {
            repFilterTopic.onchange = (e) => {
                updateReportSubtopics(e.target.value);
                renderReport();
            };
        }
        if (repFilterSubtopic) repFilterSubtopic.onchange = () => renderReport();

        // Re-apply when section changes (prevent double binding under HMR)
        if (window._timelineSectionChangeHandler) {
            window.removeEventListener('SectionChange', window._timelineSectionChangeHandler);
        }
        window._timelineSectionChangeHandler = (e) => {
            if (e.detail && e.detail.section === 'timeline') {
                loadConfig().then(() => {
                    loadEvents();
                    applyRoleAccess();
                });
            }
        };
        window.addEventListener('SectionChange', window._timelineSectionChangeHandler);

        // Load data
        loadConfig().then(() => {
            loadEvents();
            applyRoleAccess();
        });
    }
};

// Auto-refresh when window regains focus (prevent double binding under HMR)
if (window._timelineFocusHandler) {
    window.removeEventListener('focus', window._timelineFocusHandler);
}
window._timelineFocusHandler = () => {
    if (sectionVisualizacao) loadEvents();
};
window.addEventListener('focus', window._timelineFocusHandler);

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

async function loadConfig() {
    try {
        const response = await fetch('/api/timeline/config');
        if (!response.ok) throw new Error('Falha ao buscar configurações');
        const data = await response.json();
        
        topics = data.topics || [];
        subtopics = data.subtopics || [];

        // Rebuild topicColors and topicOptions
        topicColors = {};
        topicOptions = {};
        
        topics.forEach(t => {
            topicColors[t.id] = t.color;
            topicOptions[t.id] = [];
        });

        subtopics.forEach(st => {
            const topicId = st.topic_id;
            if (topicOptions[topicId]) {
                topicOptions[topicId].push(st.name);
            }
        });

        // Update select dropdowns in forms
        populateFormSelectors();
        
        // If we are currently in config view, render config lists
        const viewConfig = document.getElementById('view-config');
        if (viewConfig && viewConfig.classList.contains('active')) {
            renderConfigTab();
        }
    } catch (err) {
        console.error('Error loading config:', err);
    }
}

function populateFormSelectors() {
    // 1. Topic dropdown in event form (#topico)
    const topicSelect = document.getElementById('topico');
    if (topicSelect) {
        const currentValue = topicSelect.value;
        topicSelect.innerHTML = '<option value="" disabled selected>Selecione um tópico...</option>';
        topics.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            topicSelect.appendChild(opt);
        });
        topicSelect.value = currentValue; // restore value if any
    }

    // 2. Topic dropdown in report filter (#rep-filter-topic)
    const repTopicSelect = document.getElementById('rep-filter-topic');
    if (repTopicSelect) {
        const currentValue = repTopicSelect.value;
        repTopicSelect.innerHTML = '<option value="Todos">Todos</option>';
        topics.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            repTopicSelect.appendChild(opt);
        });
        if (currentValue && [...repTopicSelect.options].some(o => o.value === currentValue)) {
            repTopicSelect.value = currentValue;
        } else {
            repTopicSelect.value = 'Todos';
        }
    }

    // 3. Topic association select in config panel (#subtopic-topic-id)
    const subtopicTopicSelect = document.getElementById('subtopic-topic-id');
    if (subtopicTopicSelect) {
        subtopicTopicSelect.innerHTML = '<option value="" disabled selected>Selecione um tópico...</option>';
        topics.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            subtopicTopicSelect.appendChild(opt);
        });
    }
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
    const btnConfig = document.getElementById('timeline-tab-config');
    const isAdmin = window.auth && window.auth.isAdmin();
    if (isAdmin) {
        if (btnForm) btnForm.classList.remove('role-hidden');
        if (btnConfig) btnConfig.classList.remove('role-hidden');
    } else {
        if (btnForm) btnForm.classList.add('role-hidden');
        if (btnConfig) btnConfig.classList.add('role-hidden');
        
        const isAnexoActive = sectionAnexo && sectionAnexo.classList.contains('active');
        const isConfigActive = sectionConfig && sectionConfig.classList.contains('active');
        if (isAnexoActive || isConfigActive) {
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
        'relatorio': { section: sectionRelatorio, button: document.querySelector('[data-timeline-tab="relatorio"]') },
        'config': { section: sectionConfig, button: document.querySelector('[data-timeline-tab="config"]') },
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
    } else if (viewName === 'relatorio') {
        renderReport();
        updateAutoRefreshVisibility(false);
    } else if (viewName === 'config') {
        renderConfigTab();
        updateAutoRefreshVisibility(false);
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
    if (isSavingEvent) {
        console.warn('[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.');
        return;
    }
    isSavingEvent = true;

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
            isSavingEvent = false;
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
    const container = document.getElementById('timeline-tracks-container');
    if (!container) return;

    // Check if we need to rebuild the track templates
    const existingIds = Array.from(container.querySelectorAll('.timeline-container')).map(el => el.dataset.topicId);
    const configIds = topics.map(t => t.id);
    
    const needsRebuild = existingIds.length !== configIds.length || !configIds.every(id => existingIds.includes(id));
    
    if (needsRebuild) {
        container.innerHTML = '';
        const isAdmin = window.auth && window.auth.isAdmin();
        const grabStyle = isAdmin ? 'style="cursor: grab;"' : '';
        topics.forEach(topic => {
            const trackHTML = `
                <div class="timeline-container" data-topic-id="${topic.id}" draggable="false"
                     ondragstart="window.handleTrackDragStart(event, '${topic.id}')"
                     ondragover="window.handleTrackDragOver(event)"
                     ondragend="window.handleTrackDragEnd(event)">
                    <div class="topic-header" ${grabStyle}
                         ${isAdmin ? `
                         onmousedown="this.closest('.timeline-container').setAttribute('draggable', 'true')"
                         onmouseup="this.closest('.timeline-container').setAttribute('draggable', 'false')"
                         onmouseleave="this.closest('.timeline-container').setAttribute('draggable', 'false')"` : ''}>
                        <div class="topic-indicator" style="background-color: ${topic.color};"></div>
                        <h2>${topic.name}</h2>
                        <div class="sla-container">SLA: <span id="sla-${topic.id}">100%</span></div>
                    </div>
                    <div class="timeline-filters-wrapper">
                        <button class="filters-toggle" onclick="toggleFilters('${topic.id}')" id="btn-toggle-${topic.id}">
                            <span class="hamburger-icon">☰</span>
                            <span>Filtros</span>
                            <span class="toggle-arrow">▼</span>
                        </button>
                        <div class="timeline-filters hidden" id="filters-panel-${topic.id}">
                            <div class="filter-group">
                                <label for="filter-start-${topic.id}">De:</label>
                                <input type="datetime-local" id="filter-start-${topic.id}" min="2026-01-01T00:00" onchange="applyFilters('${topic.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-end-${topic.id}">Até:</label>
                                <input type="datetime-local" id="filter-end-${topic.id}" min="2026-01-01T00:00" onchange="applyFilters('${topic.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-sub-topic-${topic.id}">Eventos:</label>
                                <select id="filter-sub-topic-${topic.id}" onchange="applyFilters('${topic.id}')">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                            <button class="btn-clear-filter" onclick="clearFilters('${topic.id}')" title="Limpar Filtro">×</button>
                        </div>
                    </div>
                    <div class="timeline-helper-dates">
                        <span id="min-date-${topic.id}"></span>
                        <span id="max-date-${topic.id}"></span>
                    </div>
                    <div class="timeline-track-container">
                        <div class="timeline-track" id="track-${topic.id}"></div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', trackHTML);

            // Populate the subtopic filter dropdown for this track
            const select = document.getElementById(`filter-sub-topic-${topic.id}`);
            if (select && topicOptions[topic.id]) {
                topicOptions[topic.id].forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.toLowerCase();
                    opt.textContent = option;
                    select.appendChild(opt);
                });
            }
        });
    }

    // Now clear the tracks and draw the bars
    topics.forEach(t => {
        const track = document.getElementById(`track-${t.id}`);
        const minDateEl = document.getElementById(`min-date-${t.id}`);
        const maxDateEl = document.getElementById(`max-date-${t.id}`);
        if (track) track.innerHTML = '';
        if (minDateEl) minDateEl.textContent = '';
        if (maxDateEl) maxDateEl.textContent = '';
    });

    if (events.length === 0) return;

    topics.forEach(t => {
        const topic = t.id;
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
            bar.style.color = ev.cor && ev.cor !== '#000000' ? ev.cor : (topicColors[topic] || '#6b7280');

            const visual = document.createElement('div');
            visual.className = 'timeline-bar-visual';
            bar.appendChild(visual);

            const point = document.createElement('div');
            point.className = 'timeline-identifier-point';

            const startStr = new Date(ev.inicio).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
            const endStr = ev.fim ? new Date(ev.fim).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Em andamento';
            
            const displayTopic = t.name;
            const displaySubTopic = ev.sub_topico ? ev.sub_topico.charAt(0).toUpperCase() + ev.sub_topico.slice(1) : '-';
            point.setAttribute('data-tooltip', `Tópico: ${displayTopic}\nEventos: ${displaySubTopic}\nInício: ${startStr} - Fim: ${endStr}\nDescrição: ${ev.descricao || '-'}`);

            const isInProgress = !ev.fim;
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

    const inProgressEvents = events.filter(e => !e.fim);

    topics.forEach(t => {
        const topic = t.id;
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
        indicator.style.backgroundColor = t.color;

        const h3 = document.createElement('h3');
        h3.textContent = t.name;

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
                card.style.borderLeftColor = ev.cor && ev.cor !== '#000000' ? ev.cor : t.color;

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
// Report Panel Logic
// ============================================================
function updateReportSubtopics(topic) {
    const subTopicSelect = document.getElementById('rep-filter-subtopic');
    if (!subTopicSelect) return;

    subTopicSelect.innerHTML = '<option value="Todos">Todos</option>';
    const normalizedTopic = topic ? topic.toLowerCase().trim() : '';
    if (normalizedTopic && topicOptions[normalizedTopic]) {
        topicOptions[normalizedTopic].forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.toLowerCase();
            opt.textContent = option;
            subTopicSelect.appendChild(opt);
        });
    }
}

function clearReportFilters() {
    const repFilterStart = document.getElementById('rep-filter-start');
    const repFilterEnd = document.getElementById('rep-filter-end');
    const repFilterTopic = document.getElementById('rep-filter-topic');
    const repFilterSubtopic = document.getElementById('rep-filter-subtopic');

    if (repFilterStart) repFilterStart.value = '';
    if (repFilterEnd) repFilterEnd.value = '';
    if (repFilterTopic) repFilterTopic.value = 'Todos';
    if (repFilterSubtopic) {
        repFilterSubtopic.innerHTML = '<option value="Todos">Todos</option>';
        repFilterSubtopic.value = 'Todos';
    }
    renderReport();
}

function renderReport() {
    let filtered = events;
    const startStr = document.getElementById('rep-filter-start')?.value;
    const endStr = document.getElementById('rep-filter-end')?.value;
    const topicVal = document.getElementById('rep-filter-topic')?.value;
    const subtopicVal = document.getElementById('rep-filter-subtopic')?.value;

    if (startStr) {
        const startTime = new Date(startStr + 'T00:00:00').getTime();
        filtered = filtered.filter(e => {
            const evStart = new Date(e.inicio).getTime();
            return evStart >= startTime;
        });
    }
    if (endStr) {
        const endTime = new Date(endStr + 'T23:59:59').getTime();
        filtered = filtered.filter(e => {
            const evStart = new Date(e.inicio).getTime();
            return evStart <= endTime;
        });
    }
    if (topicVal && topicVal !== 'Todos') {
        filtered = filtered.filter(e => normalizeTopic(e.topico) === topicVal.toLowerCase());
    }
    if (subtopicVal && subtopicVal !== 'Todos') {
        filtered = filtered.filter(e => e.sub_topico && e.sub_topico.toLowerCase() === subtopicVal.toLowerCase());
    }

    // Update KPI cards
    const totalEl = document.getElementById('rep-kpi-total');
    const activeEl = document.getElementById('rep-kpi-active');
    const avgTimeEl = document.getElementById('rep-kpi-avg-time');

    if (totalEl) totalEl.textContent = filtered.length;
    
    const activeEvents = filtered.filter(e => e.em_ocorrencia == 1 || e.em_ocorrencia === 'true' || !e.fim);
    if (activeEl) activeEl.textContent = activeEvents.length;

    const resolvedEvents = filtered.filter(e => e.fim);
    let avgTimeStr = '0h 0m';
    if (resolvedEvents.length > 0) {
        const totalMs = resolvedEvents.reduce((acc, e) => acc + (new Date(e.fim).getTime() - new Date(e.inicio).getTime()), 0);
        const avgMs = totalMs / resolvedEvents.length;
        const totalMinutes = Math.floor(avgMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        avgTimeStr = `${hours}h ${mins}m`;
    }
    if (avgTimeEl) avgTimeEl.textContent = avgTimeStr;

    // Charts rendering
    if (!window.Chart) {
        console.warn('Chart.js is not loaded.');
        return;
    }

    // 1. SLA Availability Chart
    const reportTopics = topics;
    const slaStart = startStr ? new Date(startStr + 'T00:00:00').getTime() : new Date(new Date().getFullYear() + '-01-01T00:00:00').getTime();
    const slaEnd = endStr ? new Date(endStr + 'T23:59:59').getTime() : Date.now();

    const slaLabels = reportTopics.map(t => t.name);
    const slaData = reportTopics.map(t => {
        const topic = t.id;
        const topicEvents = events.filter(e => normalizeTopic(e.topico) === topic);
        const totalDuration = slaEnd - slaStart;
        if (totalDuration <= 0) return 100;
        const relevantEvents = topicEvents.filter(e => {
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
        let downTime = MergedIntervals => {
            let d = 0;
            MergedIntervals.forEach(interval => { d += (interval.end - interval.start); });
            return d;
        };
        const downTimeVal = downTime(mergedIntervals);
        const availability = ((totalDuration - downTimeVal) / totalDuration) * 100;
        return parseFloat(availability.toFixed(4));
    });

    const backgroundColors = reportTopics.map(t => t.color || '#6b7280');

    const ctxSla = document.getElementById('chart-rep-sla');
    if (ctxSla) {
        if (chartSlaInstance) {
            chartSlaInstance.destroy();
        }
        chartSlaInstance = new window.Chart(ctxSla, {
            type: 'bar',
            data: {
                labels: slaLabels,
                datasets: [{
                    label: 'Disponibilidade %',
                    data: slaData,
                    backgroundColor: backgroundColors,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: Math.max(0, Math.min(...slaData) - 5),
                        max: 100,
                        ticks: {
                            callback: value => value + '%'
                        }
                    }
                }
            }
        });
    }

    // 2. Quantity count by Subtopic
    const qtyMap = {};
    filtered.forEach(e => {
        const sub = e.sub_topico ? e.sub_topico.charAt(0).toUpperCase() + e.sub_topico.slice(1).toLowerCase() : 'Não especificado';
        qtyMap[sub] = (qtyMap[sub] || 0) + 1;
    });
    const qtyLabels = Object.keys(qtyMap);
    const qtyData = Object.values(qtyMap);

    const ctxQty = document.getElementById('chart-rep-qty');
    if (ctxQty) {
        if (chartQtyInstance) {
            chartQtyInstance.destroy();
        }
        chartQtyInstance = new window.Chart(ctxQty, {
            type: 'doughnut',
            data: {
                labels: qtyLabels.length > 0 ? qtyLabels : ['Nenhum evento'],
                datasets: [{
                    data: qtyData.length > 0 ? qtyData : [0],
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
                        '#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#06b6d4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12
                        }
                    }
                }
            }
        });
    }
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

// ============================================================
// Configuration Data Tab Handlers
// ============================================================
function handleTopicSubmit(e) {
    e.preventDefault();
    if (isSavingTopic) return;
    isSavingTopic = true;

    const idInput = document.getElementById('topic-id');
    const nameInput = document.getElementById('topic-name');
    const colorInput = document.getElementById('topic-color');

    if (!idInput || !nameInput || !colorInput) {
        isSavingTopic = false;
        return;
    }

    const topicData = {
        id: idInput.value.trim().toLowerCase(),
        name: nameInput.value.trim(),
        color: colorInput.value
    };

    if (!topicData.id) {
        alert('Por favor, defina um ID para o tópico.');
        isSavingTopic = false;
        return;
    }

    fetch('/api/timeline/config/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topicData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar tópico');
        return response.json();
    })
    .then(() => {
        alert('Tópico salvo com sucesso!');
        idInput.value = '';
        nameInput.value = '';
        colorInput.value = '#3b82f6';
        return loadConfig().then(() => {
            loadEvents();
        });
    })
    .catch(err => {
        console.error(err);
        alert('Erro: ' + err.message);
    })
    .finally(() => {
        isSavingTopic = false;
    });
}

function handleSubtopicSubmit(e) {
    e.preventDefault();
    if (isSavingSubtopic) return;
    isSavingSubtopic = true;

    const topicIdSelect = document.getElementById('subtopic-topic-id');
    const nameInput = document.getElementById('subtopic-name');

    if (!topicIdSelect || !nameInput) {
        isSavingSubtopic = false;
        return;
    }

    const subtopicData = {
        topic_id: topicIdSelect.value,
        name: nameInput.value.trim()
    };

    if (!subtopicData.topic_id || !subtopicData.name) {
        alert('Preencha todos os campos do evento.');
        isSavingSubtopic = false;
        return;
    }

    fetch('/api/timeline/config/subtopics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtopicData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao adicionar evento');
        return response.json();
    })
    .then(() => {
        alert('Evento adicionado!');
        nameInput.value = '';
        return loadConfig();
    })
    .catch(err => {
        console.error(err);
        alert('Erro: ' + err.message);
    })
    .finally(() => {
        isSavingSubtopic = false;
    });
}

function deleteTopic(id) {
    if (!confirm('Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?')) return;

    fetch(`/api/timeline/config/topics/${id}`, { method: 'DELETE' })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir tópico');
        return response.json();
    })
    .then(() => {
        alert('Tópico excluído!');
        loadConfig().then(() => {
            loadEvents();
        });
    })
    .catch(err => {
        console.error(err);
        alert('Erro: ' + err.message);
    });
}

function deleteSubtopic(id) {
    if (!confirm('Deseja realmente excluir este evento?')) return;

    fetch(`/api/timeline/config/subtopics/${id}`, { method: 'DELETE' })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir evento');
        return response.json();
    })
    .then(() => {
        alert('Evento excluído!');
        loadConfig();
    })
    .catch(err => {
        console.error(err);
        alert('Erro: ' + err.message);
    });
}

function renderConfigTab() {
    // 1. Render topics list
    const topicsList = document.getElementById('config-topics-list');
    if (topicsList) {
        topicsList.innerHTML = '';
        if (topics.length === 0) {
            topicsList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>';
        } else {
            topics.forEach(t => {
                const div = document.createElement('div');
                div.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;';
                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${t.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${t.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${t.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${t.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `;
                topicsList.appendChild(div);
            });
        }
    }

    // 2. Render subtopics (events) list
    const subtopicsList = document.getElementById('config-subtopics-list');
    if (subtopicsList) {
        subtopicsList.innerHTML = '';
        if (subtopics.length === 0) {
            subtopicsList.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>';
        } else {
            subtopics.forEach(st => {
                const topicObj = topics.find(t => t.id === st.topic_id);
                const topicName = topicObj ? topicObj.name : st.topic_id;
                const topicColor = topicObj ? topicObj.color : '#6b7280';

                const div = document.createElement('div');
                div.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;';
                div.innerHTML = `
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${st.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${topicColor}22; color: ${topicColor}; font-weight: 600; border: 1px solid ${topicColor}44;">${topicName}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${st.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `;
                subtopicsList.appendChild(div);
            });
        }
    }
}

// ============================================================
// Drag and Drop reordering for timeline tracks
// ============================================================
let draggedTopicId = null;

function handleTrackDragStart(e, id) {
    draggedTopicId = id;
    const container = e.currentTarget;
    container.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleTrackDragOver(e) {
    e.preventDefault();
    const draggingEl = document.querySelector('.timeline-container.dragging');
    if (!draggingEl) return;

    const container = document.getElementById('timeline-tracks-container');
    if (!container) return;

    const siblings = [...container.querySelectorAll('.timeline-container:not(.dragging)')];

    const nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });

    if (nextSibling) {
        container.insertBefore(draggingEl, nextSibling);
    } else {
        container.appendChild(draggingEl);
    }
}

function handleTrackDragEnd(e) {
    const draggingEl = document.querySelector('.timeline-container.dragging');
    if (draggingEl) {
        draggingEl.classList.remove('dragging');
    }
    
    document.querySelectorAll('.timeline-container').forEach(el => {
        el.setAttribute('draggable', 'false');
    });

    // Get the new order from DOM
    const container = document.getElementById('timeline-tracks-container');
    if (!container) return;

    const newOrder = Array.from(container.querySelectorAll('.timeline-container')).map(el => el.dataset.topicId);
    
    // Call API to save new order
    saveTopicsOrder(newOrder);
}

function saveTopicsOrder(order) {
    fetch('/api/timeline/config/topics/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar nova ordenação');
        return response.json();
    })
    .then(() => {
        console.log('Ordem dos tópicos atualizada com sucesso.');
        // Reload config to sync state and trigger re-render
        loadConfig().then(() => {
            loadEvents();
        });
    })
    .catch(err => {
        console.error(err);
        alert('Erro ao salvar ordenação: ' + err.message);
    });
}
