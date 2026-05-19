const fs = require('fs');
const path = require('path');
const filePath = path.join('c:', 'Users', 'Pedro', 'Downloads', 'John', 'Pasta plataforma', 'src', 'pages', 'nexus_provas.html');

let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /<div class="w-full flex flex-col">\s*<div class="border border-\[#0B193C\] rounded-lg overflow-hidden shadow-sm">\s*<div class="bg-teal-600\/10 text-\[#0B193C\] text-center py-2 border-b border-\[#0B193C\]">[\s\S]*?Radar TRI Sinapse[\s\S]*?A nota oficial pode variar conforme a TRI, a dificuldade dos itens e a coerência pedagógica do padrão de respostas\.\s*<\/div>\s*<\/div>\s*<\/div>/g;

if (targetRegex.test(content)) {
    content = content.replace(targetRegex, '');
    console.log('Successfully removed the Radar TRI Sinapse block.');
} else {
    console.log('Could not find the target string for Radar TRI.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated.');
