const fs = require('fs');
const path = require('path');

try {
    const indexPath = path.join(__dirname, 'index.js');
    const htmlPath = path.join(__dirname, 'index.html');

    console.log(`Updating ${indexPath} with content from ${htmlPath}...`);

    let indexContent = fs.readFileSync(indexPath, 'utf8');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const startIdx = indexContent.indexOf('`');
    const endIdx = indexContent.lastIndexOf('`');

    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
        console.error('Error: Could not find valid template literal boundaries in index.js');
        process.exit(1);
    }

    // Escape backticks and ${ inside the HTML content
    // We only need to escape backticks if they are NOT already escaped
    // But since we are replacing the WHOLE content, we assume the HTML file has unescaped backticks
    // and we need to escape them for the JS string.

    // Note: The HTML file shouldn't have backticks unless it has inline JS templates.
    // However, we must be careful.

    // Simple approach: escape all backticks
    htmlContent = htmlContent.replace(/`/g, '\\`');

    // Escape ${
    htmlContent = htmlContent.replace(/\$\{/g, '\\${');

    const newIndexContent = indexContent.substring(0, startIdx + 1) +
        htmlContent +
        indexContent.substring(endIdx);

    fs.writeFileSync(indexPath, newIndexContent, 'utf8');
    console.log('Successfully updated index.js!');

} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}
