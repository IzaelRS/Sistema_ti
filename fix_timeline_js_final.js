const fs = require('fs');

const timelineJsPath = './src/js/features/timeline.js';

// 1. Read timeline.js
let timelineJs = fs.readFileSync(timelineJsPath, 'utf8');

// 2. Remove the duplicated lines 34-61 that got inserted
// Specifically, everything from "// Storage Key" up to "const topicOptions = {" BUT keep the FIRST occurrence.
// Since the file has duplicates, we can just split it or recreate from the original script.js.
// Actually, let's just recreate from timeline/script.js to be absolutely 100% bug-free.

const originalJsPath = './timeline/script.js';
let content = fs.readFileSync(originalJsPath, 'utf8');

// The exact cleanup rules we know work
content = content.replace(/\/\/ --- Initialization ---\r?\ndocument.addEventListener\('DOMContentLoaded', \(\) => \{/, 
`export const timelineHandler = {
    init() {
    // Expose inline functions to window for HTML onclick/onchange handlers
    window.applyFilters = applyFilters;
    window.clearFilters = clearFilters;
    window.toggleFilters = toggleFilters;
    window.handleDelete = handleDelete;
    window.resetForm = resetForm;
    window.toggleAccordion = toggleAccordion;
`);

// Close init function at the end of the DOMContentLoaded block
content = content.replace(/    if \(autoRefreshToggle\) \{\r?\n        autoRefreshToggle.addEventListener\('change', \(e\) => \{\r?\n            toggleAutoRefresh\(e.target.checked\);\r?\n        \}\);\r?\n    \}\r?\n\}\);/,
`    if (autoRefreshToggle) {
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
    
    // Attach listener for Auth User to get admin role correctly
    window.addEventListener('SectionChange', (e) => {
         if(e.detail.section === 'timeline') {
             loadEvents();
             applyRoleAccess();
         }
    });

    // Auto load on init
    loadEvents();
    applyRoleAccess();
}
};
`);

// 2. Adjust DOM Elements
content = content.replace(/const form = document.getElementById\('event-form'\);/, `const form = document.getElementById('timeline-event-form');`);
content = content.replace(/const navTimeline = document.getElementById\('nav-timeline'\);/, `// const navTimeline = ...`);
content = content.replace(/const navAttention = document.getElementById\('nav-attention'\);/, `// const navAttention = ...`);
content = content.replace(/const navForm = document.getElementById\('nav-form'\);/, `// const navForm = ...`);
content = content.replace(/const navUsers = document.getElementById\('nav-users'\);/, `// const navUsers = ...`);

// 3. Remove CheckSession and LockApp logic calls
content = content.replace(/\/\/ Check for existing session\r?\n    checkSession\(\);/, `// Authentication handled by app.js global auth`);

// 4. Update switchView
content = content.replace(/function switchView\(viewName\) \{([\s\S]*?)\} else \{/, 
`function switchView(viewName) {
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
    } else {`);

// 5. Update applyRoleAccess to use window.auth
content = content.replace(/function applyRoleAccess\(\)\s*\{[\s\S]*?\n\}/, 
`function applyRoleAccess() {
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
}`);

// 6. Fix admin logic inside renderTimelines and renderAttentionPanel
content = content.replace(/currentUser\s*&&\s*currentUser\.perfil === 'administrativo'/g, `window.auth && window.auth.isAdmin()`);

// 7. Delete old User rendering and edit user
content = content.replace(/function loadUsers\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function handleUserFormSubmit\(e\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function renderUsersList\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function editUser\(user\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function handleDeleteUser\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function resetUserForm\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function checkSession\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function lockApp\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function unlockApp\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function handleLogin\(e\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function handleMonitorLogin\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');
content = content.replace(/function logout\(\)\s*\{[\s\S]*?\n\}\r?\n/g, '');

fs.writeFileSync(timelineJsPath, content, 'utf8');

console.log('Fixed JS fully');
