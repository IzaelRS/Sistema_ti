const fs = require('fs');

const timelineHtmlPath = './timeline/index.html';
const mainHtmlPath = './index.html';

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

const visSection = extractSection(timelineHtml, /<div id="view-visualizacao" class="timeline-view-section( active)?">/);
const attnSection = extractSection(timelineHtml, /<div id="view-attention" class="timeline-view-section">/);
const anexoSection = extractSection(timelineHtml, /<div id="view-anexo" class="timeline-view-section">/);

const mainVisSection = extractSection(mainHtml, /<div id="view-visualizacao" class="timeline-view-section( active)?">/);
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
console.log('Fixed HTML scopes');
