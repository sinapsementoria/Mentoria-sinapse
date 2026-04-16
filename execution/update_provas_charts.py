import re

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. CLEAN THE HTML CONTAINER
new_charts_container = """<div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="chartsContainer">
                    <div id="boxLin" class="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative h-[260px] shadow-sm">
                        <h3 id="titleLin" class="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">menu_book</span> Linguagens</h3>
                        <div class="w-full h-[180px]"><canvas id="chartLin"></canvas></div>
                    </div>
                    <div id="boxHum" class="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative h-[260px] shadow-sm">
                        <h3 id="titleHum" class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">public</span> Humanas</h3>
                        <div class="w-full h-[180px]"><canvas id="chartHum"></canvas></div>
                    </div>
                    <div id="boxNat" class="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative h-[260px] shadow-sm">
                        <h3 id="titleNat" class="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">biotech</span> Natureza</h3>
                        <div class="w-full h-[180px]"><canvas id="chartNat"></canvas></div>
                    </div>
                    <div id="boxMat" class="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative h-[260px] shadow-sm">
                        <h3 id="titleMat" class="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">calculate</span> Matemática</h3>
                        <div class="w-full h-[180px]"><canvas id="chartMat"></canvas></div>
                    </div>
                    
                    <div id="boxGeral" class="hidden bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative h-[260px] shadow-sm md:col-span-2">
                        <h3 id="titleGeral" class="text-[10px] font-extrabold text-sinapse-primary uppercase tracking-widest mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">school</span> Desempenho Geral</h3>
                        <div class="w-full h-[180px]"><canvas id="chartGeral"></canvas></div>
                    </div>
                </div>"""

# Find chartsContainer start to its end (assumes closing div is before <!-- Filtro por Categoria --> or similar logic)
html = re.sub(r'<div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="chartsContainer">.*?<!-- FIM GRÁFICOS -->', new_charts_container + '\n                <!-- FIM GRÁFICOS -->', html, flags=re.DOTALL)
# Fallback if <!-- FIM GRÁFICOS --> is not there:
if "<!-- FIM GRÁFICOS -->" not in html:
    html = re.sub(r'<div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="chartsContainer">.*?(?=                </div>\n            </div>\n        </div>\n    </main>)', new_charts_container + '\n', html, flags=re.DOTALL)


# 2. REPLACE renderMultipleCharts completely
new_render_multiple_charts = """
        function renderMultipleCharts() {
            const chartFilter = document.getElementById('chartTypeFilter') ? document.getElementById('chartTypeFilter').value : 'ENEM';
            const examsList = window.db.get('exams') || [];
            
            // Filter elements
            let dataToPlot = examsList.filter(e => {
                if (chartFilter === 'SIMULADO') return e.banca === 'SIMULADO';
                if (chartFilter === 'PAS-UNB-1') return e.banca === 'PAS-UNB' && e.tipo_pas === '1';
                if (chartFilter === 'PAS-UNB-2') return e.banca === 'PAS-UNB' && e.tipo_pas === '2';
                if (chartFilter === 'PAS-UNB-3') return e.banca === 'PAS-UNB' && e.tipo_pas === '3';
                return e.banca === chartFilter;
            });
            
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
                valGeral = dataToPlot.map(e => parseInt(e.notaCertos)||0); // simple mapping
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
            } else if (chartFilter.startsWith('PAS-UNB')) {
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
                    if(showCols.includes(b)) boxElem.classList.remove('hidden');
                    else boxElem.classList.add('hidden');
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
html = re.sub(r'function renderMultipleCharts\(\) \{.*?\n        \}(?=\n\n        function buildMiniChart)', new_render_multiple_charts, html, flags=re.DOTALL)

with open('provas_updated.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Provas chart refactor complete.')
