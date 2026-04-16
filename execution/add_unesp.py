import sys

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add notasUnesp right after notasFuvest
if 'notasUnesp' not in html:
    html = html.replace('<!-- FUVEST -->', '''<!-- UNESP -->
                                <div id="notasUnesp" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-emerald-500 focus-within:shadow-emerald-500/10 transition-all">
                                        <div class="flex items-center gap-2 text-emerald-500">
                                            <span class="material-symbols-outlined text-[20px] group-focus-within:animate-bounce">menu_book</span>
                                            <span class="text-[10px] font-extrabold uppercase tracking-widest">Total de Acertos (1ª Fase)</span>
                                        </div>
                                        <input type="number" id="notaUnesp" step="1" min="0" max="90" placeholder="00" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center placeholder:text-slate-300 transition-colors">
                                    </div>
                                </div>
                                
                                <!-- FUVEST -->''')

# 2. Add boxUnesp for charts
if 'id="boxUnesp"' not in html:
    html = html.replace('<!-- Box FUVEST chart -->', '''<!-- Box UNESP chart -->
                    <div id="boxUnesp" class="hidden bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative h-[260px] shadow-sm md:col-span-2">
                        <h3 class="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">menu_book</span> Acertos Gerais - 1ª Fase UNESP</h3>
                        <div class="w-full h-[180px]"><canvas id="chartUnesp"></canvas></div>
                    </div>
                    
                    <!-- Box FUVEST chart -->''')

# 3. Update toggleAvaliacaoCampos to handle UNESP correctly
if "|| banca === 'UNESP'" not in html:
    html = html.replace("if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP')", "if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP' || banca === 'UNESP')")
    
    inject_unesp_toggle = '''} else if(banca === 'UNESP') {
                    enemMeta.classList.add('hidden'); simuladoMeta.classList.add('hidden');
                    notasComum.classList.add('hidden'); notasComum.classList.remove('grid');
                    notasFuvest.classList.add('hidden'); notasFuvest.classList.remove('grid');
                    if(document.getElementById('unicampMeta')) document.getElementById('unicampMeta').classList.add('hidden');
                    if(document.getElementById('notasUnicamp1')) { document.getElementById('notasUnicamp1').classList.add('hidden'); document.getElementById('notasUnicamp1').classList.remove('grid'); document.getElementById('notasUnicamp2').classList.add('hidden'); document.getElementById('notasUnicamp2').classList.remove('flex'); }
                    document.getElementById('notasUnesp').classList.remove('hidden'); document.getElementById('notasUnesp').classList.add('grid');
                } else if(banca === 'UNICAMP') {'''
    html = html.replace("} else if(banca === 'UNICAMP') {", inject_unesp_toggle)

    html = html.replace("notasFuvest.classList.remove('grid');", "notasFuvest.classList.remove('grid'); if(document.getElementById('notasUnesp')) { document.getElementById('notasUnesp').classList.add('hidden'); document.getElementById('notasUnesp').classList.remove('grid'); }")
    

# 4. Update table loops
if "let isUnesp = p.banca === 'UNESP';" not in html:
    html = html.replace("let isFuvest = p.banca === 'FUVEST';", "let isFuvest = p.banca === 'FUVEST';\n                    let isUnesp = p.banca === 'UNESP';")
    html = html.replace("} else if(isFuvest) {", "} else if(isFuvest) {\n                        let acertoF = parseInt(p.notaFuvest)||0;\n                        acertosTotaisText = `${acertoF}/90 acertos`;\n                    } else if(isUnesp) {\n                        let acertoU = parseInt(p.notaUnesp)||0;\n                        acertosTotaisText = `${acertoU}/90 acertos`;\n                    }")
    html = html.replace("(isFuvest ? p.ano : '--'))}", "(isFuvest || isUnesp ? p.ano : '--'))}")

# 5. Update renderInterface charts logic
if "const bUnesp" not in html:
    html = html.replace("const bFuv = document.getElementById('boxFuvest');", "const bFuv = document.getElementById('boxFuvest');\n            const bUnesp = document.getElementById('boxUnesp');")
    html = html.replace("bFuv.classList.add('hidden');", "bFuv.classList.add('hidden'); if(bUnesp) bUnesp.classList.add('hidden');")
    html = html.replace("bFuv.classList.remove('hidden');", "bFuv.classList.remove('hidden'); if(bUnesp) bUnesp.classList.add('hidden');")
    html = html.replace("} else if(chartFilter === 'UNICAMP') {", "} else if(chartFilter === 'UNESP') {\n                bLin.classList.add('hidden'); bHum.classList.add('hidden');\n                bNat.classList.add('hidden'); bMat.classList.add('hidden');\n                bFuv.classList.add('hidden'); if(bUnesp) bUnesp.classList.remove('hidden');\n            } else if(chartFilter === 'UNICAMP') {")

# 6. Update chart rendering
if "chartUnesp" not in html:
    html = html.replace("if(e.banca === 'FUVEST') return `FUVEST ${e.ano}`;", "if(e.banca === 'FUVEST') return `FUVEST ${e.ano}`;\n                if(e.banca === 'UNESP') return `UNESP ${e.ano}`;")
    
    inject_unesp_chart = '''} else if (chartFilter === 'UNESP') {
                const dsUnesp = dataToPlot.map(e => parseInt(e.notaUnesp) || 0);
                buildMiniChart('chartUnesp', labels, dsUnesp, 'rgba(16, 185, 129, 0.9)', 90);
            }'''
    html = html.replace("buildMiniChart('chartFuvest', labels, dsFuv, 'rgba(99, 102, 241, 0.9)', 90);\n            }", "buildMiniChart('chartFuvest', labels, dsFuv, 'rgba(99, 102, 241, 0.9)', 90);\n            " + inject_unesp_chart)

# 7. Update salvarProva
if "|| banca === 'UNESP'" not in html:
    html = html.replace("if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP')", "if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP' || banca === 'UNESP')", 2)
    html = html.replace("if(banca === 'FUVEST') {\n                        record.notaFuvest = document.getElementById('notaFuvest').value;\n                    } else {", "if(banca === 'FUVEST') {\n                        record.notaFuvest = document.getElementById('notaFuvest').value;\n                    } else if(banca === 'UNESP') {\n                        record.notaUnesp = document.getElementById('notaUnesp').value;\n                    } else {")
    html = html.replace("document.getElementById('notaFuvest').value = '';", "document.getElementById('notaFuvest').value = '';\n                    if(document.getElementById('notaUnesp')) document.getElementById('notaUnesp').value = '';")

with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('UNESP added to provas.html')
