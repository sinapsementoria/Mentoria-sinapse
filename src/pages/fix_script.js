const fs = require('fs');
let content = fs.readFileSync('nexus_provas.html', 'utf-8');
content = content.replace('window.baixarTodosBoletinsEmZIP = async function() {', '<script>\nwindow.baixarTodosBoletinsEmZIP = async function() {');
content = content.replace('a.click();\n};', 'a.click();\n};\n</script>');
fs.writeFileSync('nexus_provas.html', content, 'utf-8');
console.log('Fixed script tags.');
