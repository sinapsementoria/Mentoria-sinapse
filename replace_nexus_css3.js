const fs = require('fs');
const path = 'c:\\Users\\Pedro\\Downloads\\John\\Pasta plataforma\\src\\pages\\nexus_provas.html';
let content = fs.readFileSync(path, 'utf8');

// Replace CSS block
const oldCssRegex = /\.boletim-a4-page\s*\{[\s\S]*?(?=<\/style>)/;

const newCss = `.boletim-a4-page {
  width: 210mm;
  height: 297mm;
  background: #ffffff;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  transform: none !important;
  zoom: 1 !important;
}

.boletim-a4-page[data-page="1"] {
  width: 210mm;
  height: 297mm;
  background: #ffffff;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.boletim-a4-page[data-page="1"] .boletim-a4-inner {
  width: 100%;
  height: 100%;
  padding: 7mm 8mm;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto auto auto auto 1fr;
  row-gap: 4mm;
  overflow: visible;
}

.boletim-a4-inner {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 7mm 8mm;
  display: flex;
  flex-direction: column;
  gap: 4mm;
  overflow: visible;
}

.bloco-identificacao, 
.bloco-cabecalho, 
.bloco-cards-principais {
  overflow: visible !important;
}

.titulo-boletim {
  font-size: 26px;
  line-height: 1.08;
  font-weight: 900;
  margin: 2mm 0 1mm 0;
  letter-spacing: 0.3px;
}

.subtitulo-boletim {
  font-size: 11px;
  font-weight: 800;
}

.bloco-cabecalho img {
  max-height: 16mm;
}

.card-area-desempenho {
  min-height: 26mm;
  height: auto;
  border-radius: 8px;
  overflow: visible !important;
}

.card-area-desempenho .nota-principal,
.card-area-desempenho .area-score,
.card-area-desempenho .score {
  font-size: 28px;
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
  min-height: 12mm;
  height: auto;
  overflow: visible !important;
}

.bloco-pontuacao-obtida {
  min-height: 65mm;
  height: auto;
  overflow: visible !important;
}

.bloco-pontuacao-obtida table {
  font-size: 9px;
}

.bloco-pontuacao-obtida canvas {
  width: 100% !important;
  height: 48mm !important;
  max-height: 48mm !important;
}

.bloco-radar-tri {
  min-height: 42mm;
  height: auto;
  overflow: visible !important;
}

.bloco-radar-tri canvas {
  width: 100% !important;
  height: 40mm !important;
  max-height: 40mm !important;
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
if (exportStart !== -1) {
    let beforeExport = content.substring(0, exportStart);
    let exportBlock = content.substring(exportStart);
    
    // Remove inline style limits that may cause scaling
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

    // Add console logs before PDF generation
    const generatePdfRegex = /(const exportToPDF = async \(\) => \{|async function exportToPDF\(\) \{|window\.exportToPDF = async function\(\) \{|function exportToPDF\(\) \{)/;
    let match = exportBlock.match(generatePdfRegex);
    if (match && !exportBlock.includes("console.log('PAGE 1 clientHeight:'")) {
        const logsToInject = `
    const page1 = document.querySelector('.boletim-a4-page[data-page="1"]');
    const inner1 = page1?.querySelector('.boletim-a4-inner');

    console.log('--- RELATORIO EXPORTACAO ---');
    console.log('PAGE 1 clientHeight:', page1?.clientHeight);
    console.log('PAGE 1 scrollHeight:', page1?.scrollHeight);
    console.log('INNER 1 clientHeight:', inner1?.clientHeight);
    console.log('INNER 1 scrollHeight:', inner1?.scrollHeight);
    console.log('PAGE 1 transborda?', page1 ? page1.scrollHeight > page1.clientHeight : null);
    console.log('INNER 1 transborda?', inner1 ? inner1.scrollHeight > inner1.clientHeight : null);

    console.log('Radar existe:', !!document.querySelector('.bloco-radar-tri'));
    console.log('Pontuação existe:', !!document.querySelector('.bloco-pontuacao-obtida'));
    console.log('Radar visível:', document.querySelector('.bloco-radar-tri')?.getBoundingClientRect());
    console.log('Pontuação visível:', document.querySelector('.bloco-pontuacao-obtida')?.getBoundingClientRect());
    console.log('----------------------------');
`;
        exportBlock = exportBlock.replace(match[0], match[0] + logsToInject);
    }
    
    content = beforeExport + exportBlock;
}

fs.writeFileSync(path, content);
console.log('CSS updated successfully with visible overflow and grid for page 1');
