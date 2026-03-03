/**
 * Generates docs/examples.md from the example list.
 *
 * Each example appears as a thumbnail cell in a 3-column markdown table,
 * sorted alphabetically by display title.  The PNG filename matches
 * the example name (e.g. bump-map.html → bump-map.png).
 */
const path = require('path');
const fs = require('fs');
const examples = require('../webpack.example-list');

const baseUrl = 'https://jdiemke.github.io/aisa';
const cols = 3;

const sorted = [...examples].sort((a, b) =>
    a.getTitle().localeCompare(b.getTitle())
);

const lines = ['# Examples', ''];

for (let i = 0; i < sorted.length; i += cols) {
    const row = sorted.slice(i, i + cols);
    const cells = row.map(ex => {
        const title = ex.getTitle();
        const png = `examples/${ex.name}.png`;
        const url = `${baseUrl}/${ex.name}.html`;
        return `[![${title}](${png})](${url})<br>[${title}](${url})`;
    });
    while (cells.length < cols) cells.push('');
    lines.push(`| ${cells.join(' | ')} |`);
    if (i === 0) lines.push('|:---:|:---:|:---:|');
}

lines.push('');
const outPath = path.resolve(__dirname, '../docs/examples.md');
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Generated ${outPath}`);
