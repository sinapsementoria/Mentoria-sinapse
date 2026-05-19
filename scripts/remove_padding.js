const fs = require('fs');
const path = require('path');
const filePath = path.join('c:', 'Users', 'Pedro', 'Downloads', 'John', 'Pasta plataforma', 'src', 'pages', 'nexus_provas.html');

let content = fs.readFileSync(filePath, 'utf8');

// Target string with the precise padding to remove
const target1 = '<div class="px-10 pt-8 pb-4 bg-white relative w-full overflow-hidden">';
const replacement1 = '<div class="bg-white relative w-full overflow-hidden">';

if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
    console.log('Successfully replaced double padding.');
} else {
    console.log('Could not find the target string for double padding.');
}

// Remove empty sections or fix spacing if there are any other issues
// Example: if the block is styled directly
// Make sure "bloco-pontuacao-obtida" is perfectly adapted
// We will just do this first replacement.

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated.');
