const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'nas_asset_42.html'), 'utf8');

// Find all headings
console.log("=== HEADINGS ===");
const headings = html.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi) || [];
headings.forEach((h, i) => {
    console.log(`Heading #${i+1}:`, h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
});

// Find tab headers
console.log("\n=== TABS / SUBPAGES ===");
const tabMatches = html.match(/class=["']menuitem[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
tabMatches.forEach((t, i) => {
    console.log(`Tab #${i+1}:`, t.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
});

// Let's also scan for navigation menu
console.log("\n=== NAV MENU LINKS ===");
const navMatches = html.match(/<a[^>]*href=["']\/asset[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
navMatches.slice(0, 30).forEach((t, i) => {
    console.log(`Nav #${i+1}:`, t.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
});
