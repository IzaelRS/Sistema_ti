import { apiClient } from '../api/client.js';
import { auth } from '../api/auth.js';
import { dom } from '../utils/dom.js';

let allFaqs = [];
let currentProcedureData = { summaries: [] };
let pendingProcId = null;
let currentSummaryId = null; // Used in edit mode

let listingViewMode = 'list'; // 'list' or 'cards'
let draggedElementType = null; // 'summary' or 'container'
let draggedElementIndex = null;
let draggedElementParentId = null; // only for containers
export const proceduresHandler = {
    getPendingProcId() {
        return pendingProcId;
    },
    async fetch() {
        try {
            allFaqs = await apiClient.get('/procedures');
            this.renderTable(allFaqs);
        } catch (err) {
            console.error('Error fetching FAQs:', err);
        }
    },

    getFaqs() {
        return allFaqs;
    },

    setListingMode(mode) {
        listingViewMode = mode;
        this.renderTable(allFaqs);
    },

    renderTable(items) {
        const tableContainer = document.getElementById('list-table-container');
        const cardsContainer = document.getElementById('list-cards-container');
        const tableBody = document.getElementById('proc-table-body');

        if (!tableContainer || !cardsContainer || !tableBody) return;

        if (listingViewMode === 'list') {
            dom.show('list-table-container');
            dom.hide('list-cards-container');
            tableBody.innerHTML = items.map(faq => {
                const actionsHtml = auth.isAdmin() ? `
                    <td>
                        <div class="btn-actions-container">
                            <button class="btn-icon edit" data-action="edit" data-id="${faq.id}" title="Editar">
                                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            </button>
                            <button class="btn-icon delete" data-action="delete" data-id="${faq.id}" title="Deletar">
                                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>
                        </div>
                    </td>` : '';
                return `
                <tr data-action="open" data-id="${faq.id}" class="draggable-row">
                    <td style="border-left: 5px solid ${faq.color || '#4F46E5'}"><strong>${faq.name || faq.title || 'Sem título'}</strong></td>
                    <td>${faq.responsible || 'N/A'}</td>
                    <td><span class="badge" style="background: var(--accent); color: var(--bg-dark);">${faq.group_name || 'N/A'}</span></td>
                    <td>${faq.note || '-'}</td>
                    ${actionsHtml}
                </tr>`;
            }).join('');
        } else {
            dom.hide('list-table-container');
            dom.show('list-cards-container');
            cardsContainer.innerHTML = items.map(faq => {
                const actionsHtml = auth.isAdmin() ? `
                    <div class="card-footer">
                        <div class="btn-actions-container">
                            <button class="btn-icon edit" data-action="edit" data-id="${faq.id}" title="Editar">
                                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            </button>
                            <button class="btn-icon delete" data-action="delete" data-id="${faq.id}" title="Deletar">
                                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>
                        </div>
                    </div>` : '';
                return `
                <div class="card draggable-card" data-action="open" data-id="${faq.id}" style="border-top: 5px solid ${faq.color || '#4F46E5'}">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <span class="badge" style="background: var(--accent); color: var(--bg-dark);">${faq.group_name || 'N/A'}</span>
                        </div>
                        <h3>${faq.name || faq.title || 'Sem título'}</h3>
                        <div class="card-details" style="border: none; padding: 0;">
                            <div style="margin-bottom: 5px;"><strong>Responsável:</strong> ${faq.responsible || 'N/A'}</div>
                            ${faq.note ? `<div><strong>Nota:</strong> ${faq.note}</div>` : ''}
                        </div>
                    </div>
                    ${actionsHtml}
                </div>`;
            }).join('');
        }

        // Event delegation for all action buttons and row clicks
        const activeContainer = listingViewMode === 'list' ? tableBody : cardsContainer;
        activeContainer.addEventListener('click', function handler(e) {
            // Check if an action button (edit/delete) was clicked
            const actionBtn = e.target.closest('[data-action="edit"], [data-action="delete"]');
            if (actionBtn) {
                e.stopPropagation();
                e.preventDefault();
                const id = Number(actionBtn.dataset.id);
                if (actionBtn.dataset.action === 'edit') {
                    proceduresHandler.openEditModal(id);
                } else if (actionBtn.dataset.action === 'delete') {
                    proceduresHandler.deleteProcedure(id);
                }
                return;
            }

            // Check if a row/card was clicked (open detail)
            const row = e.target.closest('[data-action="open"]');
            if (row) {
                const id = Number(row.dataset.id);
                proceduresHandler.openDetail(id);
            }
        });
    },

    openDetail(id) {
        const faq = allFaqs.find(f => f.id === id);
        if (!faq) return;

        dom.setText('detail-title', faq.name || faq.title || 'Sem título');
        dom.setValue('proc-id', faq.id);

        try {
            let parsed = faq.content ? JSON.parse(faq.content) : [];
            // Migration logic: If it's an array (old format), wrap it in a default summary
            if (Array.isArray(parsed)) {
                currentProcedureData = {
                    summaries: [{
                        id: 'sum_' + Date.now(),
                        title: 'Sumário 1',
                        sections: parsed
                    }]
                };
            } else if (parsed && parsed.summaries && Array.isArray(parsed.summaries)) {
                currentProcedureData = parsed;
            } else {
                currentProcedureData = { summaries: [] };
            }
        } catch (e) {
            currentProcedureData = { summaries: [] };
        }

        // Default to the first summary if available
        if (currentProcedureData.summaries.length > 0) {
            currentSummaryId = currentProcedureData.summaries[0].id;
        } else {
            currentSummaryId = null;
        }

        this.toggleEditMode(false);
        this.renderProcedureView();

        const searchInput = document.getElementById('procedure-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Must trigger an event or call global to change section to 'detail'
        window.dispatchEvent(new CustomEvent('SectionChange', { detail: { section: 'detail' } }));
    },

    openEditModal(id) {
        const faq = allFaqs.find(f => f.id === id);
        if (!faq) return;

        dom.setText('modal-form-title', 'Editar Procedimento');
        dom.setValue('proc-id', faq.id);
        dom.setValue('proc-name', faq.name || faq.title || '');
        dom.setValue('proc-responsible', faq.responsible || '');
        dom.setValue('proc-group', faq.group_name || '');
        dom.setValue('proc-note', faq.note || '');
        dom.setValue('proc-content', faq.content || '');
        dom.setValue('proc-color', faq.color || '#4F46E5');

        // Custom color logic...

        dom.show('modal-form');
    },

    async saveMeta(e) {
        if (e) e.preventDefault();
        const id = dom.getValue('proc-id');
        const data = {
            name: dom.getValue('proc-name').toUpperCase(),
            responsible: dom.getValue('proc-responsible').toUpperCase(),
            group_name: dom.getValue('proc-group'),
            note: dom.getValue('proc-note'),
            content: dom.getValue('proc-content'),
            color: dom.getValue('proc-color'),
        };

        try {
            const url = id ? `/procedures/${id}` : `/procedures`;
            const result = id ? await apiClient.put(url, data) : await apiClient.post(url, data);

            pendingProcId = result.id;
            dom.hide('modal-form');
            document.getElementById('faq-form').reset();
            dom.setValue('proc-responsible', 'TI');
            dom.setValue('proc-group', 'Geral');

            await this.fetch();
            dom.show('modal-confirm');
        } catch (err) {
            alert('Erro ao salvar procedimento: ' + err.message);
        }
    },

    async deleteProcedure(id) {
        if (!confirm('Deseja excluir este procedimento?')) return;
        try {
            await apiClient.delete(`/procedures/${id}`);
            this.fetch();
        } catch (err) {
            alert('Erro ao excluir.');
        }
    },

    toggleEditMode(isEdit) {
        const sidebarWrapper = document.querySelector('.procedure-sidebar');
        if (isEdit) {
            dom.hide('procedure-view-container');
            dom.hide('procedure-view-sidebar');
            dom.show('procedure-edit-wrapper');
            dom.show('procedure-edit-sidebar');
            dom.hide('btn-floating-edit');

            if (sidebarWrapper) sidebarWrapper.classList.add('glass', 'has-border');

            // Set current summary explicitly
            if (currentProcedureData.summaries.length > 0) {
                if (!currentProcedureData.summaries.find(s => s.id === currentSummaryId)) {
                    currentSummaryId = currentProcedureData.summaries[0].id;
                }
            } else {
                currentSummaryId = null;
            }

            this.renderProcedureBuilderSidebar();
            this.renderProcedureBuilder();
        } else {
            dom.show('procedure-view-container');
            dom.show('procedure-view-sidebar');
            dom.hide('procedure-edit-wrapper');
            dom.hide('procedure-edit-sidebar');
            dom.show('btn-floating-edit');

            if (sidebarWrapper) sidebarWrapper.classList.remove('glass', 'has-border');
            this.renderProcedureView();
        }
    },

    renderProcedureView() {
        const container = document.getElementById('procedure-view-container');
        const sidebar = document.getElementById('procedure-view-index');

        if (!container || !sidebar) return;

        if (currentProcedureData.summaries.length === 0) {
            container.innerHTML = '<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>';
            sidebar.innerHTML = '<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';
            return;
        }

        let mainHtml = '';
        let sidebarHtml = '';

        currentProcedureData.summaries.forEach((summary, sumIndex) => {
            sidebarHtml += `<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${summary.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${summary.title}</li>`;

            mainHtml += `<div id="sum-view-${summary.id}" class="summary-group-view" style="margin-bottom: 40px;">`;

            // Render Title only if it's not simply "Sumário 1" when it's the only one 
            // (or always render to be explicit. Let's make it a nice header)
            if (currentProcedureData.summaries.length > 1 || summary.title !== 'Sumário 1') {
                mainHtml += `<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${summary.title}</h4>`;
            }

            if (summary.sections.length === 0) {
                mainHtml += '<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>';
            }

            const sectionsHtml = summary.sections.map((section, index) => {
                let contentHtml = '';
                if (section.type === 'TEXTO') {
                    contentHtml = `<div class="gh-content"><div class="gh-text-view">${section.data || 'Sem conteúdo.'}</div></div>`;
                } else if (section.type === 'FAQ') {
                    const faqs = section.data || [];
                    contentHtml = `<div class="gh-faq-list">` + faqs.map((f, fIdx) => `
                         <div class="gh-accordion" id="gh-faq-${summary.id}-${index}-${fIdx}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${summary.id}-${index}-${fIdx}')">
                                   <div class="gh-accordion-title">${f.q || 'Pergunta sem título'}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${f.a || 'Sem resposta.'}</div>
                         </div>
                     `).join('') + `</div>`;
                } else if (section.type === 'DOCUMENTO') {
                    if (section.data && section.data.path) {
                        const isImage = section.data.mimetype && section.data.mimetype.startsWith('image/');
                        const isPdf = section.data.mimetype === 'application/pdf';

                        let embedHtml = '';
                        if (isImage) {
                            embedHtml = `<div class="doc-embed-container"><img src="${section.data.path}" alt="${section.data.name}" class="doc-embed-image" /></div>`;
                        } else if (isPdf) {
                            embedHtml = `<div class="doc-embed-container" style="display: block;"><iframe src="${section.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${section.data.name}"></iframe></div>`;
                        } else {
                            embedHtml = `<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>`;
                        }

                        contentHtml = `
                        <div class="gh-doc-container">
                            ${embedHtml}
                            <div class="doc-actions" style="margin-top: 15px; text-align: center;">
                                <a href="${section.data.path}" target="_blank" class="btn-secondary-small" style="display: inline-block;">
                                    Abrir/Download Original (${section.data.name})
                                </a>
                            </div>
                        </div>`;
                    }
                }

                let dotColor = 'var(--text-muted)';
                if (section.type === 'DOCUMENTO') dotColor = '#10B981'; // Green
                else if (section.type === 'FAQ') dotColor = '#FBBF24'; // Yellow
                else if (section.type === 'TEXTO') dotColor = '#3B82F6'; // Blue

                return `
                     <div class="gh-box">
                         <div class="gh-header" style="display: flex; align-items: center; gap: 10px;">
                             <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${dotColor};"></span>
                             <h3>${section.title}</h3>
                         </div>
                         ${contentHtml}
                     </div>
                 `;
            }).join('');

            mainHtml += sectionsHtml;
            mainHtml += `</div>`; // Close summary group
        });

        sidebar.innerHTML = sidebarHtml;
        container.innerHTML = mainHtml;
    },

    filterProcedureContent(term) {
        term = term.toLowerCase();
        const container = document.getElementById('procedure-view-container');
        if (!container) return;

        const boxes = container.querySelectorAll('.gh-box');
        boxes.forEach(box => {
            const faqList = box.querySelector('.gh-faq-list');
            let boxHasMatch = false;

            const titleEl = box.querySelector('.gh-header');
            const titleMatch = titleEl ? titleEl.textContent.toLowerCase().includes(term) : false;

            if (faqList) {
                const accordions = faqList.querySelectorAll('.gh-accordion');
                accordions.forEach(acc => {
                    const text = acc.textContent.toLowerCase();
                    if (titleMatch || text.includes(term)) {
                        acc.classList.remove('hidden');
                        boxHasMatch = true;
                    } else {
                        acc.classList.add('hidden');
                    }
                });
            }

            const boxText = box.textContent.toLowerCase();
            if (titleMatch || boxText.includes(term) || boxHasMatch) {
                box.classList.remove('hidden');
            } else {
                box.classList.add('hidden');
            }
        });
    },

    renderProcedureBuilderSidebar() {
        const sidebar = document.getElementById('procedure-edit-index');
        const btnAddBlock = document.getElementById('btn-add-block');
        const summaryNameDisplay = document.getElementById('current-summary-name');

        if (!sidebar) return;

        sidebar.innerHTML = currentProcedureData.summaries.map((summary, index) => {
            const isActive = summary.id === currentSummaryId;
            return `
             <li class="sidebar-index-item ${isActive ? 'active' : ''} editable-section style-none"
                 draggable="true" 
                 ondragstart="window.ProceduresHandler.handleSumDragStart(event, ${index})"
                 ondragover="window.ProceduresHandler.handleDragOver(event)"
                 ondrop="window.ProceduresHandler.handleSumDrop(event, ${index})"
                 ondragend="window.ProceduresHandler.handleDragEnd(event)"
                 onclick="window.ProceduresHandler.selectSummary('${summary.id}')">
                 
                 <div style="display: flex; align-items: center; width: 100%;">
                     <span class="drag-handle" title="Arraste para mover" style="cursor: grab; margin-right: 8px;">
                         <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                     </span>
                     <input type="text" value="${summary.title}" 
                            onclick="event.stopPropagation()"
                            onblur="window.ProceduresHandler.updateSummaryTitle('${summary.id}', this.value)" 
                            placeholder="Nome do sumário">
                 </div>
                 <button class="btn-delete-section" style="margin-left: 5px; padding: 2px;"
                         onclick="event.stopPropagation(); window.ProceduresHandler.removeSummary('${summary.id}')" title="Remover Sumário">
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
             </li>
            `;
        }).join('');

        const currSum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (currSum) {
            summaryNameDisplay.textContent = currSum.title;
            summaryNameDisplay.style.color = 'var(--text-main)';
            btnAddBlock.classList.remove('hidden');
        } else {
            summaryNameDisplay.textContent = 'Nenhum sumário selecionado';
            summaryNameDisplay.style.color = 'var(--accent)';
            btnAddBlock.classList.add('hidden');
        }
    },

    selectSummary(id) {
        currentSummaryId = id;
        this.renderProcedureBuilderSidebar();
        this.renderProcedureBuilder();
    },

    updateSummaryTitle(id, val) {
        const sum = currentProcedureData.summaries.find(s => s.id === id);
        if (sum) sum.title = val || 'Sem título';
        this.renderProcedureBuilderSidebar();
        // optionally update display name
        const currSum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (currSum) document.getElementById('current-summary-name').textContent = currSum.title;
    },

    addSummary() {
        const newId = 'sum_' + Date.now();
        currentProcedureData.summaries.push({
            id: newId,
            title: `Sumário ${currentProcedureData.summaries.length + 1}`,
            sections: []
        });
        currentSummaryId = newId;
        this.renderProcedureBuilderSidebar();
        this.renderProcedureBuilder();
    },

    removeSummary(id) {
        if (!confirm('Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?')) return;
        currentProcedureData.summaries = currentProcedureData.summaries.filter(s => s.id !== id);
        if (currentSummaryId === id) {
            currentSummaryId = currentProcedureData.summaries.length > 0 ? currentProcedureData.summaries[0].id : null;
        }
        this.renderProcedureBuilderSidebar();
        this.renderProcedureBuilder();
    },

    renderProcedureBuilder() {
        const container = document.getElementById('procedure-edit-container');
        if (!container) return;

        if (!currentSummaryId) {
            container.innerHTML = '<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';
            return;
        }

        const summaryObj = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (!summaryObj) return;

        const sections = summaryObj.sections;

        if (sections.length === 0) {
            container.innerHTML = `<p class="empty-state">Nenhum campo em "${summaryObj.title}". Clique em "+ Novo Container" para começar.</p>`;
            return;
        }

        container.innerHTML = sections.map((section, index) => {
            return `
             <div class="section-container glass editable-section" 
                  draggable="false" 
                  ondragstart="window.ProceduresHandler.handleSecDragStart(event, ${index}, '${summaryObj.id}')"
                  ondragover="window.ProceduresHandler.handleDragOver(event)"
                  ondrop="window.ProceduresHandler.handleSecDrop(event, ${index}, '${summaryObj.id}')"
                  ondragend="window.ProceduresHandler.handleDragEnd(event)">
                 <div class="section-header">
                     <span class="drag-handle" title="Segure para arrastar" style="cursor: grab; margin-right: 15px; color: var(--text-muted); display: flex;"
                           onmousedown="this.closest('.editable-section').setAttribute('draggable', 'true')"
                           onmouseup="this.closest('.editable-section').setAttribute('draggable', 'false')"
                           onmouseleave="this.closest('.editable-section').setAttribute('draggable', 'false')">
                         <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                     </span>
                     <input type="text" class="section-title-input" value="${section.title}" onblur="window.ProceduresHandler.updateSectionTitle(${index}, this.value)" placeholder="Título da Seção">
                     <span class="badge-type">${section.type}</span>
                     <button class="btn-delete-icon" onclick="window.ProceduresHandler.removeSection(${index})">&times;</button>
                 </div>
                 <div class="section-content" style="padding: 15px;">
                      <!-- Editor simplified for extraction -->
                      ${section.type === 'TEXTO' ? `
                      <div class="rte-container">
                          ${window.ProceduresHandler.getRteToolbarHTML()}
                          <div class="proc-textarea-edit" contenteditable="true" placeholder="Comece a digitar o conteúdo da seção..." 
                               oninput="window.ProceduresHandler.updateSectionData(${index}, this.innerHTML)" 
                               onblur="window.ProceduresHandler.updateSectionData(${index}, this.innerHTML)">${section.data || ''}</div>
                      </div>
                      ` : ''}
                      ${section.type === 'DOCUMENTO' ? (section.data ?
                    `<div class="doc-uploaded-state">
                              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                              <a href="${section.data.path}" target="_blank" class="doc-link">${section.data.name}</a> 
                              <button class="btn-remove-doc" onclick="window.ProceduresHandler.updateSectionData(${index}, null)" title="Remover Documento">Remover</button>
                          </div>` :
                    `<div class="doc-dropzone" 
                                ondragover="event.preventDefault(); this.classList.add('dragover');" 
                                ondragleave="this.classList.remove('dragover');" 
                                ondrop="event.preventDefault(); this.classList.remove('dragover'); window.ProceduresHandler.handleSectionFileDrop(${index}, event);"
                                onclick="this.querySelector('input[type=file]').click();">
                              <input type="file" style="display: none;" onchange="window.ProceduresHandler.handleSectionFileUpload(${index}, this)">
                              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" style="margin-bottom: 15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <p><strong>Clique para selecionar</strong> ou arraste o arquivo aqui</p>
                              <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">Suporta PDF, Imagens (PNG, JPG)</span>
                          </div>`
                ) : ''}
                      ${section.type === 'FAQ' ? `
                      <div class="faq-items">
                          ${(section.data || []).map((faq, fIdx) => `
                              <div class="faq-pair">
                                  <button class="btn-remove-faq" onclick="window.ProceduresHandler.removeFaqItem(${index}, ${fIdx})" title="Remover Pergunta">&times;</button>
                                  <input type="text" placeholder="Pergunta" value="${faq.q}" onchange="window.ProceduresHandler.updateFaqItem(${index}, ${fIdx}, 'q', this.value)">
                                  
                                  <div class="rte-container" style="margin-top: 10px;">
                                      ${window.ProceduresHandler.getRteToolbarHTML()}
                                      <div class="proc-textarea-edit" style="min-height: 80px;" contenteditable="true" placeholder="Resposta da FAQ..."
                                           oninput="window.ProceduresHandler.updateFaqItem(${index}, ${fIdx}, 'a', this.innerHTML)" 
                                           onblur="window.ProceduresHandler.updateFaqItem(${index}, ${fIdx}, 'a', this.innerHTML)">${faq.a || ''}</div>
                                  </div>
                              </div>
                          `).join('')}
                          <button class="btn-secondary-small" style="align-self: flex-start; margin-top: 10px;" onclick="window.ProceduresHandler.addFaqItem(${index})">+ Adicionar Pergunta</button>
                      </div>
                      ` : ''}
                 </div>
             </div>`;
        }).join('');
    },

    handleSumDragStart(e, index) {
        draggedElementType = 'summary';
        draggedElementIndex = index;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { if (e.target) e.target.classList.add('dragging'); }, 0);
    },
    handleSumDrop(e, dstIndex) {
        e.preventDefault();
        if (draggedElementType !== 'summary' || draggedElementIndex === null || draggedElementIndex === dstIndex) return;
        const item = currentProcedureData.summaries.splice(draggedElementIndex, 1)[0];
        currentProcedureData.summaries.splice(dstIndex, 0, item);
        this.renderProcedureBuilderSidebar();
    },

    handleSecDragStart(e, index, parentId) {
        draggedElementType = 'container';
        draggedElementIndex = index;
        draggedElementParentId = parentId;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            const el = e.target.nodeType === 1 ? e.target.closest('.editable-section') : null;
            if (el) el.classList.add('dragging');
        }, 0);
    },
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    },
    handleSecDrop(e, dstIndex, dstParentId) {
        e.preventDefault();
        if (draggedElementType !== 'container' || draggedElementIndex === null) return;

        // At the moment, dragging between summaries isn't fully implemented in the UI since you only view one summary at a time in edit mode.
        // It operates within the current summary.
        if (draggedElementParentId !== dstParentId) return;

        const sumObj = currentProcedureData.summaries.find(s => s.id === dstParentId);
        if (!sumObj) return;

        if (draggedElementIndex === dstIndex) return;

        const item = sumObj.sections.splice(draggedElementIndex, 1)[0];
        sumObj.sections.splice(dstIndex, 0, item);
        this.renderProcedureBuilder();
    },
    handleDragEnd(e) {
        document.querySelectorAll('.editable-section.dragging').forEach(el => el.classList.remove('dragging'));
        if (e && e.target && e.target.setAttribute) e.target.setAttribute('draggable', 'false');
        draggedElementType = null;
        draggedElementIndex = null;
    },

    updateSectionTitle(idx, val) {
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (sum) sum.sections[idx].title = val;
    },
    updateSectionData(idx, val) {
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (sum) sum.sections[idx].data = val;
    },
    removeSection(idx) {
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (sum) sum.sections.splice(idx, 1);
        this.renderProcedureBuilder();
    },

    getRteToolbarHTML() {
        return `
            <div class="rte-toolbar" onmousedown="if(!['SELECT', 'OPTION', 'INPUT'].includes(event.target.tagName)) event.preventDefault();">
                <select class="rte-select" onchange="document.execCommand('formatBlock', false, this.value); this.selectedIndex=0;" title="Formato">
                    <option value="">Formato</option>
                    <option value="H1">Título 1</option>
                    <option value="H2">Título 2</option>
                    <option value="H3">Título 3</option>
                    <option value="P">Parágrafo</option>
                </select>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('bold', false, null)" title="Negrito">
                    <svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('italic', false, null)" title="Itálico">
                    <svg viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('underline', false, null)" title="Sublinhado">
                     <svg viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                </button>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('justifyLeft', false, null)" title="Alinhar à Esquerda">
                    <svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('justifyCenter', false, null)" title="Centralizar">
                    <svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="17" y1="18" x2="7" y2="18"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('justifyRight', false, null)" title="Alinhar à Direita">
                    <svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
                </button>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('insertUnorderedList', false, null)" title="Marcadores">
                    <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('insertOrderedList', false, null)" title="Numeração">
                    <svg viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                </button>
                <span class="rte-separator"></span>
                <div style="display: flex; align-items: center; gap: 4px;" title="Cor do Texto">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                    <input type="color" class="rte-color-picker" value="#ffffff" oninput="document.execCommand('foreColor', false, this.value)">
                </div>
                <div style="display: flex; align-items: center; gap: 4px;" title="Cor de Fundo">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <input type="color" class="rte-color-picker" value="#000000" oninput="document.execCommand('hiliteColor', false, this.value)">
                </div>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('insertHorizontalRule', false, null)" title="Espaçador">
                    <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/></svg>
                </button>
            </div>
        `;
    },

    addFaqItem(secIdx) {
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (!sum) return;
        sum.sections[secIdx].data = sum.sections[secIdx].data || [];
        sum.sections[secIdx].data.push({ q: '', a: '' });
        this.renderProcedureBuilder();
    },
    updateFaqItem(secIdx, faqIdx, field, val) {
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (sum) sum.sections[secIdx].data[faqIdx][field] = val;
    },
    removeFaqItem(secIdx, faqIdx) {
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (sum) sum.sections[secIdx].data.splice(faqIdx, 1);
        this.renderProcedureBuilder();
    },
    addSection(title, type) {
        if (!currentSummaryId) {
            alert('Selecione primeiro um sumário na barra lateral.');
            return;
        }
        const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
        if (sum) {
            sum.sections.push({ id: Date.now(), title, type, data: type === 'FAQ' ? [] : (type === 'TEXTO' ? '' : null) });
            this.renderProcedureBuilder();
        }
    },

    async handleSectionFileDrop(index, event) {
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            await this.uploadSectionFile(index, event.dataTransfer.files[0]);
        }
    },

    async handleSectionFileUpload(index, input) {
        const file = input.files[0];
        if (!file) return;
        await this.uploadSectionFile(index, file);
    },

    async uploadSectionFile(index, file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const result = await apiClient.upload('/upload', formData);
            const sum = currentProcedureData.summaries.find(s => s.id === currentSummaryId);
            if (sum) {
                sum.sections[index].data = { name: file.name, path: result.path, mimetype: file.type };
                this.renderProcedureBuilder();
            }
        } catch (err) { alert('Erro no upload'); }
    },

    async handleSaveProcedure() {
        const procId = parseInt(dom.getValue('proc-id'));
        if (!procId) return;

        const existing = allFaqs.find(f => f.id === procId);

        const data = {
            ...existing,
            content: JSON.stringify(currentProcedureData)
        };

        try {
            await apiClient.put(`/procedures/${procId}`, data);
            alert('Salvo com sucesso!');
            this.toggleEditMode(false);
            this.openDetail(procId);
            this.fetch();
        } catch (err) {
            alert('Erro ao salvar');
        }
    },

    search(term) {
        const filtered = allFaqs.filter(faq =>
            (faq.name || faq.title || '').toLowerCase().includes(term) ||
            (faq.responsible || '').toLowerCase().includes(term) ||
            (faq.group_name || '').toLowerCase().includes(term)
        );
        this.renderTable(filtered);
    }
};

// Global helper for opening/closing FAQs in view mode
window.toggleGhAccordion = function (id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('open');
    }
};
