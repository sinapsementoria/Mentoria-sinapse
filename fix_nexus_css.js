const fs = require('fs');
const path = 'c:/Users/Pedro/Downloads/John/Pasta plataforma/src/pages/nexus_provas.html';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
    {
        regex: /\.boletim-a4-page\[data-page="1"\] \.boletim-a4-inner \{[\s\S]*?\}/g,
        replacement: `.boletim-a4-page[data-page="1"] .boletim-a4-inner {
  width: 100%;
  height: 100%;
  padding: 7mm 8mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4mm;
  overflow: visible;
}`
    },
    {
        regex: /\.bloco-pontuacao-obtida \{[\s\S]*?\}/g,
        replacement: `.bloco-pontuacao-obtida {
  height: auto;
  flex: 1 1 auto;
  overflow: visible !important;
  display: flex;
  flex-direction: column;
  min-height: 60mm;
}`
    },
    {
        regex: /\.bloco-pontuacao-obtida canvas \{[\s\S]*?\}/g,
        replacement: `.bloco-pontuacao-obtida canvas {
  width: 100% !important;
  height: auto !important;
  flex: 1 1 auto;
  min-height: 45mm;
  max-height: none !important;
}`
    },
    {
        regex: /\.bloco-radar-tri \{[\s\S]*?\}/g,
        replacement: `.bloco-radar-tri {
  height: auto;
  flex: 1 1 auto;
  overflow: visible !important;
  display: flex;
  flex-direction: column;
  min-height: 40mm;
}`
    },
    {
        regex: /\.bloco-radar-tri canvas \{[\s\S]*?\}/g,
        replacement: `.bloco-radar-tri canvas {
  width: 100% !important;
  height: auto !important;
  flex: 1 1 auto;
  min-height: 38mm;
  max-height: none !important;
}`
    }
];

replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
});

fs.writeFileSync(path, content, 'utf8');
console.log('CSS Update complete.');
