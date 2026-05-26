import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';

let allDocs = [];
let activeTab = 'Geral';

export const docsHandler = {
    async fetch() {
        try {
            allDocs = await apiClient.get('/documents');
            this.filterAndRender();
        } catch (err) {
            console.error('Error fetching Documents:', err);
        }
    },

    setActiveTab(tabName) {
        activeTab = tabName;
        document.querySelectorAll('.docs-tabs-nav .acc-tab-btn').forEach(btn => {
            const btnText = btn.textContent.trim().toLowerCase();
            btn.classList.toggle('active', btnText === tabName.toLowerCase());
        });
        this.filterAndRender();
    },

    filterAndRender() {
        const filtered = allDocs.filter(d => {
            const docCat = d.category || 'Geral';
            return docCat.toLowerCase() === activeTab.toLowerCase();
        });
        this.render(filtered);
    },

    render(items) {
        const docListBody = document.getElementById('doc-list-body');
        if (!docListBody) return;

        if (items.length === 0) {
            docListBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `;
            return;
        }

        const isAdmin = window.auth && window.auth.isAdmin();

        docListBody.innerHTML = items.map(doc => {
            const icon = doc.mimetype === 'application/pdf' ? '📕' : '🖼️';
            const sizeKB = (doc.size / 1024).toFixed(1) + ' KB';
            const formattedDate = doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : '-';
            const displayType = doc.mimetype === 'application/pdf' ? 'PDF' : 'Imagem';
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
        }).join('');
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
        formData.append('category', categoryInput ? categoryInput.value : 'Geral');
        formData.append('customName', nameInput ? nameInput.value : '');
        formData.append('document', docInput.files[0]);

        try {
            await apiClient.upload('/documents', formData);
            dom.hide('modal-upload');
            document.getElementById('doc-form').reset();
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
        const filtered = allDocs.filter(d => {
            const docCat = d.category || 'Geral';
            return docCat.toLowerCase() === activeTab.toLowerCase() && d.original_name.toLowerCase().includes(term);
        });
        this.render(filtered);
    }
};
