import re
import sys

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# REPLACE original function renderMultipleCharts(chartDataGlob, chartFilter)
# Since the parameters are chartDataGlob, chartFilter, we match that!
new_render_multiple_charts = """
        function renderMultipleCharts(chartDataGlob, chartFilter) {
            let dataToPlot = chartDataGlob;
            
            dataToPlot.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
            
            const labels = dataToPlot.map(e => e.created_at ? e.created_at.split('T')[0] : 'N/A');

            // Arrays
            let valLin=[], valHum=[], valNat=[], valMat=[], valGeral=[];
            let titleLin="Linguagens", titleHum="Humanas", titleNat="Natureza", titleMat="Matemática", titleGeral="Geral";
            let maxLin=45, maxHum=45, maxNat=45, maxMat=45, maxGeral=90;
            let showCols = []; // 'Lin', 'Hum', 'Nat', 'Mat', 'Geral'

            // Data extraction & configuration
            if (chartFilter === 'ENEM' || chartFilter === 'SIMULADO') {
                showCols = ['Lin', 'Hum', 'Nat', 'Mat'];
                valLin = dataToPlot.map(e => parseInt(e.notaLin)||0);
                valHum = dataToPlot.map(e => parseInt(e.notaHum)||0);
                valNat = dataToPlot.map(e => parseInt(e.notaNat)||0);
                valMat = dataToPlot.map(e => parseInt(e.notaMat)||0);
                maxLin=maxHum=maxNat=maxMat=45;
            } else if (chartFilter === 'FUVEST') {
                showCols = ['Geral']; titleGeral = "Acertos 1ª Fase (FUVEST)"; maxGeral = 90;
                valGeral = dataToPlot.map(e => parseInt(e.notaFuvest)||0);
            } else if (chartFilter === 'UNESP') {
                showCols = ['Geral']; titleGeral = "Acertos 1ª Fase (UNESP)"; maxGeral = 90;
                valGeral = dataToPlot.map(e => parseInt(e.notaUnesp)||0);
            } else if (chartFilter === 'UEG') {
                showCols = ['Geral']; titleGeral = "Prova Objetiva (UEG)"; maxGeral = 52;
                valGeral = dataToPlot.map(e => parseInt(e.notaUEG)||0);
            } else if (chartFilter === 'UNB') {
                showCols = ['Geral']; titleGeral = "Certo x Errado (UNB)"; maxGeral = 120;
                valGeral = dataToPlot.map(e => parseInt(e.notaCertos)||0); 
            } else if (chartFilter === 'UNICAMP') {
                showCols = ['Lin', 'Hum', 'Nat', 'Mat'];
                titleLin = "Linguagens (Port + Ing)"; 
                valLin = dataToPlot.map(e => (parseInt(e.notaU_Port)||0) + (parseInt(e.notaU_Ing)||0));
                valHum = dataToPlot.map(e => parseInt(e.notaU_Hum)||0);
                valNat = dataToPlot.map(e => parseInt(e.notaU_Nat)||0);
                valMat = dataToPlot.map(e => parseInt(e.notaU_Mat)||0);
                maxLin=20; maxHum=23; maxNat=22; maxMat=12;
            } else if (chartFilter === 'VEST-UNB') {
                showCols = ['Lin', 'Hum', 'Nat'];
                titleLin = "Língua Estrangeira"; titleHum = "Humanas"; titleNat = "Exatas e Natureza";
                valLin = dataToPlot.map(e => parseInt(e.notaV_LE)||0);
                valHum = dataToPlot.map(e => parseInt(e.notaV_Hum)||0);
                valNat = dataToPlot.map(e => parseInt(e.notaV_Exa)||0);
                maxLin=30; maxHum=120; maxNat=150;
            } else if (chartFilter && chartFilter.startsWith('PAS-UNB')) {
                showCols = ['Lin', 'Nat'];
                titleLin = "Língua Estrangeira"; titleNat = "Exatas e Humanas";
                valLin = dataToPlot.map(e => parseInt(e.notaP_LE)||0);
                valNat = dataToPlot.map(e => parseInt(e.notaP_ExaHum)||0);
                maxLin=10; maxNat=110;
            } else if (chartFilter === 'UFG') {
                showCols = ['Lin', 'Nat', 'Mat'];
                titleLin = "Linguagens"; titleNat = "Ciências da Natureza"; titleMat = "Matemática";
                valLin = dataToPlot.map(e => parseInt(e.notaUFG_Lin)||0);
                valNat = dataToPlot.map(e => parseInt(e.notaUFG_Nat)||0);
                valMat = dataToPlot.map(e => parseInt(e.notaUFG_Mat)||0);
                maxLin=maxNat=maxMat=30;
            } else if (chartFilter === 'UFT') {
                showCols = ['Lin', 'Hum', 'Nat', 'Mat'];
                valLin = dataToPlot.map(e => parseInt(e.notaUFT_Lin)||0);
                valHum = dataToPlot.map(e => parseInt(e.notaUFT_Hum)||0);
                valNat = dataToPlot.map(e => parseInt(e.notaUFT_Nat)||0);
                valMat = dataToPlot.map(e => parseInt(e.notaUFT_Mat)||0);
                maxLin=24; maxMat=8; maxHum=maxNat=16;
            }

            // UI Manipulation
            document.getElementById('titleLin').innerText = titleLin;
            document.getElementById('titleHum').innerText = titleHum;
            document.getElementById('titleNat').innerText = titleNat;
            document.getElementById('titleMat').innerText = titleMat;
            document.getElementById('titleGeral').innerText = titleGeral;

            const boxes = ['Lin','Hum','Nat','Mat','Geral'];
            boxes.forEach(b => {
                const boxElem = document.getElementById('box'+b);
                if(boxElem) {
                    if(showCols.includes(b)) {
                        boxElem.classList.remove('hidden');
                    } else {
                        boxElem.classList.add('hidden');
                    }
                }
            });

            // Re-render required ones
            if(showCols.includes('Lin'))   buildMiniChart('chartLin', labels, valLin, 'rgba(244, 63, 94, 0.9)', maxLin);
            if(showCols.includes('Hum'))   buildMiniChart('chartHum', labels, valHum, 'rgba(245, 158, 11, 0.9)', maxHum);
            if(showCols.includes('Nat'))   buildMiniChart('chartNat', labels, valNat, 'rgba(16, 185, 129, 0.9)', maxNat);
            if(showCols.includes('Mat'))   buildMiniChart('chartMat', labels, valMat, 'rgba(59, 130, 246, 0.9)', maxMat);
            if(showCols.includes('Geral')) buildMiniChart('chartGeral', labels, valGeral, 'rgba(99, 102, 241, 0.9)', maxGeral);
        }
"""
html = re.sub(r'function renderMultipleCharts\(chartDataGlob, chartFilter\) \{.*?\n        \}(?=\n\n        let provaSelecionadaAcaoId)', new_render_multiple_charts, html, flags=re.DOTALL)

with open('provas_fixed.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Provas chart JS fix written.')
