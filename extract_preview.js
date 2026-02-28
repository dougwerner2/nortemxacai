const fs = require('fs');
const path = require('path');

try {
    const indexPath = path.join(__dirname, 'index.js');
    console.log('Reading:', indexPath);
    const content = fs.readFileSync(indexPath, 'utf8');

    // Find the backtick delimiters
    const startIdx = content.indexOf('`');
    const endIdx = content.lastIndexOf('`');

    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
        console.error('Error: Could not find valid template literal boundaries in index.js');
        process.exit(1);
    }

    // Extract content inside backticks
    let html = content.substring(startIdx + 1, endIdx);

    // FIX: Unescape characters that were escaped for the JS string in index.js
    // Replace \` with `
    html = html.replace(/\\`/g, '`');
    // Replace \${ with ${
    html = html.replace(/\\\$\{/g, '${');

    const outPath = path.join(__dirname, 'index.html');
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Successfully extracted and fixed HTML to:', outPath);

} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}
