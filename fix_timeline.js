const fs = require('fs');

const timelineHtmlPath = './timeline/index.html';
const mainHtmlPath = './index.html';
const timelineJsPath = './src/js/features/timeline.js';

// 1. Fix HTML: Copy the exact sections from timeline/index.html
let timelineHtml = fs.readFileSync(timelineHtmlPath, 'utf8');
let mainHtml = fs.readFileSync(mainHtmlPath, 'utf8');

function extractSection(html, idRegex) {
    const startMatch = html.match(idRegex);
    if (!startMatch) return null;
    let startIdx = startMatch.index;
    
    // Find matching closing div
    let openCount = 0;
    let endIdx = -1;
    let i = startIdx;
    
    while (i < html.length) {
        if (html.substring(i, i + 4) === '<div') {
            openCount++;
        } else if (html.substring(i, i + 6) === '</div>') {
            openCount--;
            if (openCount === 0) {
                endIdx = i + 6;
                break;
            }
        }
        i++;
    }
    
    return html.substring(startIdx, endIdx);
}

const visSection = extractSection(timelineHtml, /<div id="view-visualizacao" class="timeline-view-section active">/);
const attnSection = extractSection(timelineHtml, /<div id="view-attention" class="timeline-view-section">/);
const anexoSection = extractSection(timelineHtml, /<div id="view-anexo" class="timeline-view-section">/);

const mainVisSection = extractSection(mainHtml, /<div id="view-visualizacao" class="timeline-view-section active">/);
const mainAttnSection = extractSection(mainHtml, /<div id="view-attention" class="timeline-view-section">/);
const mainAnexoSection = extractSection(mainHtml, /<div id="view-anexo" class="timeline-view-section( role-hidden)?">/);

if (visSection && mainVisSection) {
    mainHtml = mainHtml.replace(mainVisSection, visSection);
}
if (attnSection && mainAttnSection) {
    mainHtml = mainHtml.replace(mainAttnSection, attnSection);
}
if (anexoSection && mainAnexoSection) {
    mainHtml = mainHtml.replace(mainAnexoSection, anexoSection);
}

fs.writeFileSync(mainHtmlPath, mainHtml, 'utf8');

// 2. Fix timeline.js duplication that happened recently and apply correctly
// Since the file might be corrupted, I will restore it by reading `timeline/script.js` and running the cleaning steps again.

const originalJsPath = './timeline/script.js';
let content = fs.readFileSync(originalJsPath, 'utf8');

// 1. Export class TimelineHandler and convert DOM elements to getters or inside init
content = content.replace(/\\/\\/ --- Initialization ---\\r?\\ndocument.addEventListener\\('DOMContentLoaded', \\(\\) => \\{/, 
\`export const timelineHandler = {
    init() {
    // Expose inline functions to window for HTML onclick/onchange handlers
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;
    window.toggleFilters = toggleFilters;
    window.handleDelete = handleDelete;
    window.resetForm = resetForm;
    window.toggleAccordion = toggleAccordion;\`);

// Close init function at the end of the DOMContentLoaded block
content = content.replace(/    if \\(autoRefreshToggle\\) \\{\\r?\\n        autoRefreshToggle.addEventListener\\('change', \\(e\\) => \\{\\r?\\n            toggleAutoRefresh\\(e.target.checked\\);\\r?\\n        \\}\\);\\r?\\n    \\}\\r?\\n\\}\\);/,
\`    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', (e) => {
            toggleAutoRefresh(e.target.checked);
        });
    }

    // Add Internal Nav bindings
    document.querySelectorAll('[data-timeline-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-timeline-tab');
            switchView(tabName);
        });
    });

    // Override the form variable locally
    const cForm = document.getElementById('timeline-event-form');
    if(cForm) {
        cForm.removeEventListener('submit', handleFormSubmit);
        cForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Auto load on init
    loadEvents();
    if(window.auth) applyRoleAccess();
    
    // Attach listener for Auth User to get admin role correctly
    window.addEventListener('SectionChange', (e) => {
         if(e.detail.section === 'timeline') {
             loadEvents();
             if(window.auth) applyRoleAccess();
         }
    });
}
};\n\`);

// 2. Adjust DOM Elements
content = content.replace(/const form = document.getElementById\\('event-form'\\);/, \`const form = document.getElementById('timeline-event-form');\`);
content = content.replace(/const navTimeline = document.getElementById\\('nav-timeline'\\);/, \`// const navTimeline = ...\`);
content = content.replace(/const navAttention = document.getElementById\\('nav-attention'\\);/, \`// const navAttention = ...\`);
content = content.replace(/const navForm = document.getElementById\\('nav-form'\\);/, \`// const navForm = ...\`);
content = content.replace(/const navUsers = document.getElementById\\('nav-users'\\);/, \`// const navUsers = ...\`);

// 3. Remove CheckSession and LockApp logic calls
content = content.replace(/\\/\\/ Check for existing session\\r?\\n    checkSession\\(\\);/, \`// Authentication handled by app.js global auth\`);

// 4. Update switchView
content = content.replace(/function switchView\\(viewName\\) \\{([\\s\\S]*?)\\} else \\{/, 
\`function switchView(viewName) {
    const views = {
        'visualizacao': { section: sectionVisualizacao, button: document.querySelector('[data-timeline-tab="visualizacao"]') },
        'attention': { section: sectionAttention, button: document.querySelector('[data-timeline-tab="attention"]') },
        'anexo': { section: sectionAnexo, button: document.querySelector('[data-timeline-tab="anexo"]') },
    };
    
    Object.values(views).forEach(v => {
        if(v.section) v.section.classList.remove('active');
        if (v.button) v.button.classList.remove('active');
    });

    if (views[viewName]) {
        if(views[viewName].section) views[viewName].section.classList.add('active');
        if (views[viewName].button) views[viewName].button.classList.add('active');
    }

    if (viewName === 'visualizacao') {
        loadEvents();
        updateAutoRefreshVisibility(true);
    } else if (viewName === 'attention') {
        renderAttentionPanel();
        updateAutoRefreshVisibility(true);
    } else {\`);

// 5. Update applyRoleAccess to use window.auth
content = content.replace(/function applyRoleAccess\\(\\)\\s*\\{[\\s\\S]*?\\n\\}/, 
\`function applyRoleAccess() {
    const btnForm = document.getElementById('timeline-tab-anexo');
    if(window.auth && window.auth.isAdmin()) {
        if(btnForm) btnForm.classList.remove('role-hidden');
    } else {
        if(btnForm) btnForm.classList.add('role-hidden');
        const activeSection = document.querySelector('#timeline-panels-container .timeline-view-section.active');
        if (activeSection && activeSection.id === 'view-anexo') {
            switchView('visualizacao');
        }
    }
}\`);

// 6. Fix admin logic
content = content.replace(/currentUser && currentUser.perfil === 'administrativo'/g, \`window.auth && window.auth.isAdmin()\`);

// 7. Delete old User rendering and edit user
// We just remove the loadUsers calls and handleUserFormSubmit and renderUsersList to avoid bloat
content = content.replace(/function loadUsers\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function handleUserFormSubmit\\(e\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function renderUsersList\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function editUser\\(user\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function handleDeleteUser\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function resetUserForm\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function checkSession\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function lockApp\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function unlockApp\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function handleLogin\\(e\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function handleMonitorLogin\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');
content = content.replace(/function logout\\(\\)\\s*\\{[\\s\\S]*?\\n\\}\\r?\\n/g, '');

fs.writeFileSync(timelineJsPath, content, 'utf8');

console.log('Fixed HTML and JS scopes');
