const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const topics = ['atendimento', 'internet', 'infraestrutura', 'sistema', 'integracoes'];
let changed = 0;
topics.forEach(topic => {
    const regex = new RegExp('(<div class="sla-container">SLA: <span id="sla-' + topic + '">100%</span></div>\\s*</div>)(\\s*<div class="timeline-helper-dates">)');
    const filterHtml = `
                                <div class="timeline-filters-wrapper">
                                    <button class="filters-toggle" onclick="toggleFilters('` + topic + `')" id="btn-toggle-` + topic + `">
                                        <span class="hamburger-icon">☰</span>
                                        <span>Filtros</span>
                                        <span class="toggle-arrow">▼</span>
                                    </button>
                                    <div class="timeline-filters hidden" id="filters-panel-` + topic + `">
                                        <div class="filter-group">
                                            <label for="filter-start-` + topic + `">De:</label>
                                            <input type="datetime-local" id="filter-start-` + topic + `" min="2026-01-01T00:00" onchange="applyFilters('` + topic + `')">
                                        </div>
                                        <div class="filter-group">
                                            <label for="filter-end-` + topic + `">Até:</label>
                                            <input type="datetime-local" id="filter-end-` + topic + `" min="2026-01-01T00:00" onchange="applyFilters('` + topic + `')">
                                        </div>
                                        <div class="filter-group">
                                            <label for="filter-sub-topic-` + topic + `">Eventos:</label>
                                            <select id="filter-sub-topic-` + topic + `" onchange="applyFilters('` + topic + `')">
                                                <option value="">Todos</option>
                                            </select>
                                        </div>
                                        <button class="btn-clear-filter" onclick="clearFilters('` + topic + `')" title="Limpar Filtro">×</button>
                                    </div>
                                </div>`;
    if (regex.test(html)) {
        html = html.replace(regex, '$1' + filterHtml + '$2');
        console.log('Replaced ' + topic);
        changed++;
    } else {
        console.log('Could not find ' + topic);
    }
});
if(changed > 0) {
    fs.writeFileSync('index.html', html);
    console.log('Done!');
}
