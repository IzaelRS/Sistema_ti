import { apiClient } from '../api/client.js';
import { dom } from '../utils/dom.js';

let allDocs = [];

export const docsHandler = {
    async fetch() {
        try {
            allDocs = await apiClient.get('/documents');
            this.render(allDocs);
        } catch (err) {
            console.error('Error fetching Documents:', err);
        }
    },

    render(items) {
        const docList = document.getElementById('doc-list');
        if (!docList) return;

        docList.innerHTML = items.map(doc => {
            const icon = doc.mimetype === 'application/pdf' ? '📕' : '🖼️';
            return `
                <div class="card">
                    <div>
                        <h3>${icon} ${doc.original_name}</h3>
                        <p>Tipo: ${doc.mimetype}<br>Tamanho: ${(doc.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div class="card-footer">
                        <a href="${doc.path}" target="_blank" style="color: var(--accent); text-decoration: none;">Ver / Baixar</a>
                        <button class="btn-delete" onclick="window.DocsHandler.delete(${doc.id})">Deletar</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    async handleUpload(e) {
        e.preventDefault();
        const docInput = document.getElementById('doc-file');
        if (!docInput.files.length) {
            alert("Selecione um arquivo.");
            return;
        }

        const formData = new FormData();
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
        const filtered = allDocs.filter(d => d.original_name.toLowerCase().includes(term));
        this.render(filtered);
    }
};
