const fs = require('fs');
const path = 'c:\\Users\\Pedro\\Downloads\\John\\Pasta plataforma\\src\\pages\\nexus_provas.html';
let content = fs.readFileSync(path, 'utf8');

// Replace CSS block
const oldCssRegex = /\.boletim-a4-page\s*\{[\s\S]*?(?=<\/style>)/;

const newCss = `.boletim-a4-page {
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  background: #ffffff;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  transform: none !important;
  zoom: 1 !important;
}

.boletim-a4-inner {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 7mm 8mm;
  display: flex;
  flex-direction: column;
  gap: 4mm;
  overflow: hidden;
}

.titulo-boletim {
  font-size: 26px;
  line-height: 1.08;
  font-weight: 900;
  margin: 3mm 0 1mm 0;
  letter-spacing: 0.3px;
}

.subtitulo-boletim {
  font-size: 11px;
  font-weight: 800;
}

.bloco-cabecalho img {
  max-height: 18mm;
}

.card-area-desempenho {
  height: 28mm;
  min-height: 28mm;
  border-radius: 8px;
}

.card-area-desempenho .nota-principal,
.card-area-desempenho .area-score,
.card-area-desempenho .score {
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
}

.card-area-desempenho .nome-area {
  font-size: 12px;
  font-weight: 800;
}

.card-area-desempenho .acertos,
.card-area-desempenho .faixa-estimada {
  font-size: 8px;
}

.card-redacao {
  height: 14mm;
  min-height: 14mm;
}

.bloco-pontuacao-obtida {
  height: 67mm;
  min-height: 67mm;
  max-height: 67mm;
  overflow: hidden;
}

.bloco-pontuacao-obtida table {
  font-size: 9px;
}

.bloco-pontuacao-obtida canvas {
  width: 100% !important;
  height: 50mm !important;
  max-height: 50mm !important;
}

.bloco-radar-tri {
  height: 46mm;
  min-height: 46mm;
  max-height: 46mm;
  overflow: hidden;
}

.bloco-radar-tri .radar-score,
.bloco-radar-tri .nota-area {
  font-size: 18px;
  font-weight: 900;
}

.bloco-radar-tri p,
.bloco-radar-tri span {
  font-size: 8px;
  line-height: 1.15;
}
`;

content = content.replace(oldCssRegex, newCss);

const exportStart = content.indexOf('<div id="boletim-pdf-export"');
if (exportStart === -1) {
    console.error("Could not find exportStart");
    process.exit(1);
}

let beforeExport = content.substring(0, exportStart);
let exportBlock = content.substring(exportStart);

// Remove scaling, zooming and adjust tiny texts
exportBlock = exportBlock.replace(/text-\[6px\]/g, 'text-[8px]');
exportBlock = exportBlock.replace(/text-\[7px\]/g, 'text-[9px]');
exportBlock = exportBlock.replace(/scale-\[\d+\.\d+\]/g, '');
exportBlock = exportBlock.replace(/scale-x-\[\d+\.\d+\]/g, '');
exportBlock = exportBlock.replace(/scale-y-\[\d+\.\d+\]/g, '');
exportBlock = exportBlock.replace(/zoom-\[\d+\.\d+\]/g, '');
exportBlock = exportBlock.replace(/transform scale-[^"'\s]+/g, '');
exportBlock = exportBlock.replace(/scale-95/g, '');
exportBlock = exportBlock.replace(/scale-90/g, '');
exportBlock = exportBlock.replace(/origin-top-left/g, '');
exportBlock = exportBlock.replace(/origin-top/g, '');
exportBlock = exportBlock.replace(/origin-left/g, '');

content = beforeExport + exportBlock;

fs.writeFileSync(path, content);
console.log('CSS and classes replaced successfully');
