const fs = require('fs');
let oldHtml = fs.readFileSync('timeline/index.html', 'utf8');
let newHtml = fs.readFileSync('index.html', 'utf8');

// The new HTML has: <div id="view-visualizacao" class="timeline-view-section active">
// We want to replace it entirely with the <section id="view-visualizacao">... from oldHtml, BUT change <section> back to <div class="timeline-view-section active"> to match SPA.

let oldVisStart = oldHtml.indexOf('<section id="view-visualizacao"');
let oldVisEnd = oldHtml.indexOf('</section>', oldVisStart);
if (oldVisStart === -1 || oldVisEnd === -1) { console.log('old vis not found'); process.exit(1); }
let oldVisContent = oldHtml.substring(oldVisStart, oldVisEnd + 10);
// change <section id="view-visualizacao" class="view-section active"> to <div id="view-visualizacao" class="timeline-view-section active"> and </section> to </div>
let replacement = oldVisContent.replace(/<section id="view-visualizacao"[^\>]*>/, '<div id="view-visualizacao" class="timeline-view-section active">');
replacement = replacement.replace(/<\/section>$/, '</div>');

let newVisStart = newHtml.indexOf('<div id="view-visualizacao"');
if (newVisStart === -1) { console.log('new vis not found'); process.exit(1); }

let openCount = 0;
let i = newVisStart;
let endIdx = -1;
while(i < newHtml.length) {
    if (newHtml.substr(i, 4) === '<div') openCount++;
    else if (newHtml.substr(i, 6) === '</div') {
        openCount--;
        if (openCount === 0) {
            endIdx = i + 6;
            break;
        }
    }
    i++;
}

if (endIdx === -1) { console.log('new vis end not found'); process.exit(1); }

let toReplace = newHtml.substring(newVisStart, endIdx);

if (newHtml.indexOf(toReplace) !== -1) {
    console.log('toReplace is perfectly matched, length:', toReplace.length);
    let finalHtml = newHtml.replace(toReplace, replacement);
    fs.writeFileSync('index.html', finalHtml);
    console.log('Wrote finalHtml, new length:', finalHtml.length);
} else {
    console.log('toReplace NOT found via indexOf!');
}
