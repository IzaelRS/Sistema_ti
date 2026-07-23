import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';

let allNotes = [];
let searchQuery = '';

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

    search(query) {
        searchQuery = (query || '').toLowerCase().trim();
        this.render();
    },

    getFilteredNotes() {
        if (!searchQuery) return allNotes;
        return allNotes.filter(n => 
            (n.title && n.title.toLowerCase().includes(searchQuery)) ||
            (n.content && n.content.toLowerCase().includes(searchQuery))
        );
    },

    render() {
        const pinnedContainer = document.getElementById('keep-pinned-grid');
        const otherContainer = document.getElementById('keep-other-grid');
        const pinnedSection = document.getElementById('keep-pinned-section');
        const emptyState = document.getElementById('keep-empty-state');

        if (!pinnedContainer || !otherContainer) return;

        const filtered = this.getFilteredNotes();

        if (filtered.length === 0) {
            if (pinnedSection) pinnedSection.style.display = 'none';
            pinnedContainer.innerHTML = '';
            otherContainer.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        const pinnedNotes = filtered.filter(n => n.is_pinned);
        const otherNotes = filtered.filter(n => !n.is_pinned);

        if (pinnedNotes.length > 0) {
            if (pinnedSection) pinnedSection.style.display = 'block';
            pinnedContainer.innerHTML = pinnedNotes.map(n => this.renderNoteCard(n)).join('');
        } else {
            if (pinnedSection) pinnedSection.style.display = 'none';
            pinnedContainer.innerHTML = '';
        }

        otherContainer.innerHTML = otherNotes.map(n => this.renderNoteCard(n)).join('');
    },

    renderNoteCard(note) {
        const fontFamilyCss = FONT_FAMILIES[note.font_family] || FONT_FAMILIES['Poppins'];
        const fontSizeCss = FONT_SIZES[note.font_size] || FONT_SIZES['medium'];
        const bgColor = note.color || '#1e293b';

        const pinIconColor = note.is_pinned ? '#f59e0b' : 'var(--text-muted)';
        const pinTitle = note.is_pinned ? 'Desafixar Nota' : 'Fixar Nota';

        return `
            <div class="keep-card" style="background: ${bgColor}; font-family: ${fontFamilyCss}; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; position: relative; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 8px;">
                        ${note.title ? `<h4 style="margin: 0; font-size: 1.1rem; font-weight: 600; color: #ffffff; word-break: break-word;">${note.title}</h4>` : '<span style="flex:1;"></span>'}
                        <button class="btn-icon" onclick="window.keepsHandler.togglePin(${note.id})" title="${pinTitle}" style="padding: 4px; color: ${pinIconColor}; opacity: 0.85;">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="${note.is_pinned ? '#f59e0b' : 'none'}" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
                                <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
                            </svg>
                        </button>
                    </div>
                    <div style="font-size: ${fontSizeCss}; color: rgba(255,255,255,0.9); line-height: 1.5; white-space: pre-wrap; word-break: break-word; margin-bottom: 15px;">
                        ${note.content}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 5px;">
                    <div style="display: flex; gap: 4px; align-items: center;">
                        <span class="badge" style="background: rgba(255,255,255,0.15); color: #e2e8f0; font-size: 0.7rem; padding: 2px 6px;">${note.font_family}</span>
                        <span class="badge" style="background: rgba(255,255,255,0.15); color: #cbd5e1; font-size: 0.7rem; padding: 2px 6px;">${note.font_size}</span>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-icon" onclick="window.keepsHandler.openEditModal(${note.id})" title="Editar Nota" style="padding: 4px; color: #60a5fa;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon" onclick="window.keepsHandler.deleteNote(${note.id})" title="Excluir Nota" style="padding: 4px; color: #f87171;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async saveQuickNote(e) {
        if (e) e.preventDefault();
        const contentInput = document.getElementById('keep-quick-content');
        if (!contentInput) return;

        const content = contentInput.value.trim();
        if (!content) {
            alert('Por favor, informe o conteúdo da nota.');
            return;
        }

        const titleInput = document.getElementById('keep-quick-title');
        const colorInput = document.getElementById('keep-quick-color');
        const fontInput = document.getElementById('keep-quick-font');
        const sizeInput = document.getElementById('keep-quick-size');
        const pinInput = document.getElementById('keep-quick-pin');

        const payload = {
            title: titleInput ? titleInput.value.trim() : '',
            content: content,
            color: colorInput ? colorInput.value : '#1e293b',
            font_family: fontInput ? fontInput.value : 'Poppins',
            font_size: sizeInput ? sizeInput.value : 'medium',
            is_pinned: pinInput ? pinInput.checked : false
        };

        try {
            await apiClient.post('/keep-notes', payload);
            if (titleInput) titleInput.value = '';
            contentInput.value = '';
            if (pinInput) pinInput.checked = false;
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
    },

    openEditModal(id) {
        const note = allNotes.find(n => n.id === id || String(n.id) === String(id));
        if (!note) return;

        dom.setValue('keep-edit-id', note.id);
        dom.setValue('keep-edit-title', note.title || '');
        dom.setValue('keep-edit-content', note.content || '');
        dom.setValue('keep-edit-color', note.color || '#1e293b');
        dom.setValue('keep-edit-font', note.font_family || 'Poppins');
        dom.setValue('keep-edit-size', note.font_size || 'medium');
        
        const pinInput = document.getElementById('keep-edit-pin');
        if (pinInput) pinInput.checked = Boolean(note.is_pinned);

        dom.show('modal-edit-keep');
    },

    async saveEditModal(e) {
        if (e) e.preventDefault();
        const id = dom.getValue('keep-edit-id');
        const content = dom.getValue('keep-edit-content');

        if (!id || !content || !content.trim()) {
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
            await apiClient.put(`/keep-notes/${id}`, payload);
            dom.hide('modal-edit-keep');
            await this.fetch();
        } catch (err) {
            alert('Erro ao atualizar nota: ' + (err.message || 'Erro desconhecido.'));
        }
    }
};

window.keepsHandler = keepsHandler;
