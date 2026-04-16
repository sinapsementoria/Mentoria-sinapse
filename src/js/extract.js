const fs = require('fs');

const html = fs.readFileSync('provas.html', 'utf8');
const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scriptMatches) {
    const lastScript = scriptMatches[scriptMatches.length - 1]; // Main JS logic is at the bottom
    const code = lastScript.replace(/<\/?script>/g, '');
    fs.writeFileSync('test_script.js', code);
    console.log('Script extracted successfully to test_script.js');
} else {
    console.log('No scripts found');
}
