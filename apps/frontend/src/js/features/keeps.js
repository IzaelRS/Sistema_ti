import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';

let allNotes = [];
let searchQuery = '';
let activeDraggedCard = null;

const COLOR_PALETTE = [
    { name: 'Padrão', value: '#1e293b', border: '#334155' },
    { name: 'Âmbar', value: '#78350f', border: '#92400e' },
    { name: 'Esmeralda', value: '#064e3b', border: '#065f46' },
    { name: 'Ciano', value: '#164e63', border: '#155e75' },
    { name: 'Azul', value: '#1e3a8a', border: '#1e40af' },
    { name: 'Roxo', value: '#4c1d95', border: '#5b21b6' },
    { name: 'Rosa', value: '#831843', border: '#9d174d' },
    { name: 'Vermelho', value: '#7f1d1d', border: '#991b1b' },
    { name: 'Grafite', value: '#374151', border: '#4b5563' }
];

const FONT_FAMILIES = {
    'Poppins': "'Poppins', sans-serif",
    'Space Mono': "'Space Mono', monospace",
    'Georgia': "'Georgia', serif",
    'Roboto': "'Roboto', sans-serif",
    'Caveat': "'Caveat', cursive, sans-serif"
};

const FONT_SIZES = {
    'small': '0.85rem',
    'medium': '1rem',
    'large': '1.2rem',
    'xlarge': '1.4rem'
};

export const keepsHandler = {
    async fetch() {
        try {
            const data = await apiClient.get('/keep-notes');
            allNotes = Array.isArray(data) ? data : [];
        } catch (err) {
            console.error('Erro ao buscar notas Keep:', err);
            allNotes = [];
        }
        this.render();
    },

    getSearchQuery() {
        return searchQuery;
    },

    search(query) {
        searchQuery = (query || '').toLowerCase().trim();
        const searchInput = document.getElementById('doc-search');
        if (searchInput && searchInput.value !== query) {
            searchInput.value = query;
        }
        this.render();
    },

    getFilteredNotes() {
        let notes = searchQuery ? allNotes.filter(n => 
            (n.title && n.title.toLowerCase().includes(searchQuery)) ||
            (n.content && n.content.toLowerCase().includes(searchQuery))
        ) : [...allNotes];

        return notes.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    },

    render() {
        const pinnedContainer = document.getElementById('keep-pinned-grid');
        const otherContainer = document.getElementById('keep-other-grid');
        const pinnedSection = document.getElementById('keep-pinned-section');
        const otherTitle = document.getElementById('keep-other-title');
        const emptyState = document.getElementById('keep-empty-state');
        const countBadge = document.getElementById('keep-count-badge');

        if (!pinnedContainer || !otherContainer) return;

        const filtered = this.getFilteredNotes();

        if (countBadge) {
            countBadge.innerText = allNotes.length;
        }

        if (filtered.length === 0) {
            if (pinnedSection) pinnedSection.style.display = 'none';
            pinnedContainer.innerHTML = '';
            otherContainer.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
                const msgEl = emptyState.querySelector('p');
                if (msgEl) {
                    msgEl.innerText = searchQuery ? `Nenhuma nota encontrada para "${searchQuery}".` : 'Nenhuma nota cadastrada.';
                }
            }
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        const pinnedNotes = filtered.filter(n => n.is_pinned);
        const otherNotes = filtered.filter(n => !n.is_pinned);

        if (pinnedNotes.length > 0) {
            if (pinnedSection) pinnedSection.style.display = 'block';
            pinnedContainer.innerHTML = pinnedNotes.map(n => this.renderNoteCard(n)).join('');
            if (otherTitle) otherTitle.innerText = 'OUTRAS NOTAS';
        } else {
            if (pinnedSection) pinnedSection.style.display = 'none';
            pinnedContainer.innerHTML = '';
            if (otherTitle) otherTitle.innerText = 'TODAS AS NOTAS';
        }

        otherContainer.innerHTML = otherNotes.map(n => this.renderNoteCard(n)).join('');
        this.initDragAndDrop();
    },

    renderNoteCard(note) {
        const fontFamilyCss = FONT_FAMILIES[note.font_family] || FONT_FAMILIES['Poppins'];
        const fontSizeCss = FONT_SIZES[note.font_size] || FONT_SIZES['medium'];
        const bgColor = note.color || '#1e293b';

        const pinIconColor = note.is_pinned ? '#f59e0b' : 'rgba(255,255,255,0.4)';
        const pinTitle = note.is_pinned ? 'Desafixar Nota' : 'Fixar Nota';

        return `
            <div class="keep-card keep-card-enhanced keep-draggable-card"
                 draggable="true"
                 data-id="${note.id}"
                 data-pinned="${note.is_pinned ? 'true' : 'false'}"
                 style="background: ${bgColor}; font-family: ${fontFamilyCss}; border: 1px solid rgba(255,255,255,0.15); padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0,0,0,0.25);"
                 onclick="if(!event.target.closest('button') && !event.target.closest('.keep-drag-handle')){ window.keepsHandler.openEditModal(${note.id}); }">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                            <span class="keep-drag-handle" title="Arrastar para reordenar" style="cursor: grab; display: inline-flex; align-items: center; padding: 2px;">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="opacity: 0.5;">
                                    <circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/>
                                    <circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
                                </svg>
                            </span>
                            ${note.title ? `<h4 style="margin: 0; font-size: 1.15rem; font-weight: 600; color: #ffffff; word-break: break-word; line-height: 1.3;">${note.title}</h4>` : '<span style="flex:1;"></span>'}
                        </div>
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.togglePin(${note.id})" title="${pinTitle}" style="padding: 6px; color: ${pinIconColor}; opacity: 0.9; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="${note.is_pinned ? '#f59e0b' : 'none'}" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
                                <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
                            </svg>
                        </button>
                    </div>
                    <div style="font-size: ${fontSizeCss}; color: rgba(255,255,255,0.92); line-height: 1.55; white-space: pre-wrap; word-break: break-word; margin-bottom: 16px;">
                        ${note.content}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 10px; margin-top: 8px;">
                    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <span class="badge" style="background: rgba(0,0,0,0.3); color: #e2e8f0; font-size: 0.7rem; padding: 3px 8px; border-radius: 6px;">${note.font_family || 'Poppins'}</span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.openEditModal(${note.id})" title="Editar Nota" style="padding: 6px; color: #60a5fa;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.deleteNote(${note.id})" title="Excluir Nota" style="padding: 6px; color: #f87171;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    initDragAndDrop() {
        const containers = [
            document.getElementById('keep-pinned-grid'),
            document.getElementById('keep-other-grid')
        ].filter(Boolean);

        containers.forEach(container => {
            if (container.dataset.dragInitialized) return;
            container.dataset.dragInitialized = 'true';

            container.addEventListener('dragstart', (e) => {
                const card = e.target.closest('.keep-draggable-card');
                if (!card) return;
                activeDraggedCard = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.id);
            });

            container.addEventListener('dragend', async (e) => {
                const card = e.target.closest('.keep-draggable-card') || activeDraggedCard;
                if (card) card.classList.remove('dragging');
                activeDraggedCard = null;
                await this.saveCardOrder();
            });

            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (!activeDraggedCard) return;

                const afterElement = this.getDragAfterElement(container, e.clientX, e.clientY);
                if (afterElement === activeDraggedCard) return;

                if (afterElement) {
                    container.insertBefore(activeDraggedCard, afterElement);
                } else {
                    container.appendChild(activeDraggedCard);
                }
            });
        });
    },

    getDragAfterElement(container, x, y) {
        const cards = [...container.querySelectorAll('.keep-draggable-card:not(.dragging)')];
        if (cards.length === 0) return null;

        let closestCard = null;
        let minDistance = Number.POSITIVE_INFINITY;

        for (const card of cards) {
            const box = card.getBoundingClientRect();
            const centerX = box.left + box.width / 2;
            const centerY = box.top + box.height / 2;
            const distance = Math.hypot(x - centerX, y - centerY);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        }

        if (!closestCard) return null;

        const box = closestCard.getBoundingClientRect();
        const centerX = box.left + box.width / 2;

        if (x < centerX) {
            return closestCard;
        } else {
            return closestCard.nextElementSibling;
        }
    },

    async saveCardOrder() {
        const pinnedGrid = document.getElementById('keep-pinned-grid');
        const otherGrid = document.getElementById('keep-other-grid');

        const items = [];

        if (pinnedGrid) {
            const pinnedCards = [...pinnedGrid.querySelectorAll('.keep-draggable-card')];
            pinnedCards.forEach((card, index) => {
                const id = Number(card.dataset.id);
                if (id) {
                    items.push({ id, position: index, is_pinned: true });
                }
            });
        }

        if (otherGrid) {
            const otherCards = [...otherGrid.querySelectorAll('.keep-draggable-card')];
            otherCards.forEach((card, index) => {
                const id = Number(card.dataset.id);
                if (id) {
                    items.push({ id, position: index, is_pinned: false });
                }
            });
        }

        items.forEach(item => {
            const note = allNotes.find(n => n.id === item.id);
            if (note) {
                note.position = item.position;
                note.is_pinned = item.is_pinned;
            }
        });

        try {
            await apiClient.put('/keep-notes-reorder', { items });
        } catch (err) {
            console.error('Erro ao salvar nova ordem das notas:', err);
        }
    },

    renderColorSwatches(selectedColor = '#1e293b') {
        const container = document.getElementById('keep-modal-swatches');
        if (!container) return;

        container.innerHTML = COLOR_PALETTE.map(c => `
            <div class="keep-swatch-item ${c.value === selectedColor ? 'selected' : ''}"
                 style="background: ${c.value}; border-color: ${c.value === selectedColor ? '#ffffff' : c.border};"
                 title="${c.name}"
                 onclick="window.keepsHandler.selectColor('${c.value}')">
            </div>
        `).join('');
    },

    selectColor(colorHex) {
        dom.setValue('keep-edit-color', colorHex);
        this.renderColorSwatches(colorHex);
    },

    openNewModal() {
        dom.setValue('keep-edit-id', '');
        dom.setValue('keep-edit-title', '');
        dom.setValue('keep-edit-content', '');
        dom.setValue('keep-edit-color', '#1e293b');
        dom.setValue('keep-edit-font', 'Poppins');
        dom.setValue('keep-edit-size', 'medium');

        const pinInput = document.getElementById('keep-edit-pin');
        if (pinInput) pinInput.checked = false;

        dom.setText('modal-keep-title', 'Nova Nota Keep');
        dom.setText('btn-save-keep', 'Criar Nota');

        this.renderColorSwatches('#1e293b');
        dom.show('modal-edit-keep');
    },

    openEditModal(id) {
        const note = allNotes.find(n => n.id === id || String(n.id) === String(id));
        if (!note) return;

        dom.setValue('keep-edit-id', note.id);
        dom.setValue('keep-edit-title', note.title || '');
        dom.setValue('keep-edit-content', note.content || '');
        const colorHex = note.color || '#1e293b';
        dom.setValue('keep-edit-color', colorHex);
        dom.setValue('keep-edit-font', note.font_family || 'Poppins');
        dom.setValue('keep-edit-size', note.font_size || 'medium');

        const pinInput = document.getElementById('keep-edit-pin');
        if (pinInput) pinInput.checked = Boolean(note.is_pinned);

        dom.setText('modal-keep-title', 'Editar Nota Keep');
        dom.setText('btn-save-keep', 'Salvar Alterações');

        this.renderColorSwatches(colorHex);
        dom.show('modal-edit-keep');
    },

    async saveEditModal(e) {
        if (e) e.preventDefault();
        const id = dom.getValue('keep-edit-id');
        const content = dom.getValue('keep-edit-content');

        if (!content || !content.trim()) {
            alert('O conteúdo da nota é obrigatório.');
            return;
        }

        const title = dom.getValue('keep-edit-title');
        const color = dom.getValue('keep-edit-color');
        const font_family = dom.getValue('keep-edit-font');
        const font_size = dom.getValue('keep-edit-size');
        const pinInput = document.getElementById('keep-edit-pin');

        const payload = {
            title: title ? title.trim() : '',
            content: content.trim(),
            color: color || '#1e293b',
            font_family: font_family || 'Poppins',
            font_size: font_size || 'medium',
            is_pinned: pinInput ? pinInput.checked : false
        };

        try {
            if (id) {
                await apiClient.put(`/keep-notes/${id}`, payload);
            } else {
                await apiClient.post('/keep-notes', payload);
            }
            dom.hide('modal-edit-keep');
            await this.fetch();
        } catch (err) {
            alert('Erro ao salvar nota: ' + (err.message || 'Erro desconhecido.'));
        }
    },

    async togglePin(id) {
        const note = allNotes.find(n => n.id === id || String(n.id) === String(id));
        if (!note) return;

        try {
            await apiClient.put(`/keep-notes/${id}`, { is_pinned: !note.is_pinned });
            await this.fetch();
        } catch (err) {
            alert('Erro ao atualizar status da nota: ' + (err.message || 'Erro desconhecido.'));
        }
    },

    async deleteNote(id) {
        if (!confirm('Deseja realmente excluir esta nota?')) return;

        try {
            await apiClient.delete(`/keep-notes/${id}`);
            await this.fetch();
        } catch (err) {
            alert('Erro ao excluir nota: ' + (err.message || 'Erro desconhecido.'));
        }
    }
};

window.keepsHandler = keepsHandler;
