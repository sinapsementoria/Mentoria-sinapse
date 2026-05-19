const fs = require('fs');
const path = 'c:\\Users\\Pedro\\Downloads\\John\\Pasta plataforma\\src\\pages\\nexus_provas.html';
let content = fs.readFileSync(path, 'utf8');

const search = `<div class="px-10 pt-8 pb-4 bg-white relative w-full overflow-hidden" style="min-height: 480px;">`;
const replace = `<div class="px-10 pt-8 pb-4 bg-white relative w-full overflow-hidden">`;

content = content.replace(search, replace);
fs.writeFileSync(path, content, 'utf8');
console.log('Removed min-height');
