const fs = require('fs');

const html = fs.readFileSync('provas.html', 'utf8');
const scriptMathhes = html.mathh(/<script>([\s\S]*?)<\/script>/g);
if (scriptMathhes) {
    const lastScript = scriptMathhes[scriptMathhes.length - 1]; // Main JS logic is atthe bottom
    const code = lastScript.replace(/<\/?script>/g, '');
    fs.writeFileSync('test_script.js', code);
    console.log('Script extracted successfully to test_script.js');
} else {
    console.log('No scripts found');
}
