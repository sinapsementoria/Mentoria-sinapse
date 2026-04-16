import re

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

header_logic = '''const chartFilter = document.getElementById('chartTypeFilter') ? document.getElementById('chartTypeFilter').value : 'ENEM';
            
            const headContainer = document.querySelector('#provasTable thead');
            if(headContainer) {
                if(chartFilter === 'ENEM' || chartFilter === 'SIMULADO') {
                    headContainer.innerHTML = `
                        <tr class="text-[10px] text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th class="pb-5 font-bold px-4">Avaliação</th>
                            <th class="pb-5 font-bold px-4 text-center">Ano/PPL</th>
                            <th class="pb-5 font-bold px-4 text-center">Cor</th>
                            <th class="pb-5 font-bold px-4 text-center">Linguagens</th>
                            <th class="pb-5 font-bold px-4 text-center">Humanas</th>
                            <th class="pb-5 font-bold px-4 text-center">Natureza</th>
                            <th class="pb-5 font-bold px-4 text-center">Matemática</th>
                            <th class="pb-5 font-bold px-4 text-right">Rendimento</th>
                        </tr>
                    `;
                } else {
                    headContainer.innerHTML = `
                        <tr class="text-[10px] text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th class="pb-5 font-bold px-4">Avaliação</th>
                            <th class="pb-5 font-bold px-4 text-center">Ano</th>
                            <th class="pb-5 font-bold px-4 text-right">Rendimento</th>
                        </tr>
                    `;
                }
            }
'''
html = html.replace("const chartFilter = document.getElementById('chartTypeFilter') ? document.getElementById('chartTypeFilter').value : 'ENEM';", header_logic)

html = html.replace('tableOutput.innerHTML = `<tr><td colspan="9"', 'let colspanTotal = (chartFilter === \\'ENEM\\' || chartFilter === \\'SIMULADO\\') ? 8 : 3;\n                tableOutput.innerHTML = `<tr><td colspan="${colspanTotal}"')

row_replace = """
                    if(chartFilter === 'ENEM' || chartFilter === 'SIMULADO') {
                        html += `
                            <tr onclick="abrirOpcoesProva(${p.id}, '${isSimulado ? `Simulado ${p.instituicao||''}` : p.banca}')" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer active:bg-slate-100 group">
                                <td class="py-5 px-4 font-bold text-[#0B193C] flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-sinapse-primary flex items-center justify-center font-extrabold shadow-sm">
                                        <span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                                    </div>
                                    <div>
                                        <p class="font-headline font-bold text-sm text-[#0B193C] tracking-wide">${isSimulado ? `Simulado ${p.instituicao||''}` : p.banca}</p>
                                        <p class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">${p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Desconhecido'}</p>
                                    </div>
                                </td>
                                <td class="py-5 px-4 text-center font-semibold text-slate-600">
                                    ${isEnem ? (p.ano ? p.ano + (p.ppl === 'Sim' ? ' (PPL)' : '') : '--') : (isSimulado ? `${p.ano} (Exame Nº ${p.numero||'-'})` : '--')}
                                </td>
                                <td class="py-5 px-4 text-center font-semibold text-slate-600">
                                    ${isEnem && p.cor ? p.cor : '--'}
                                </td>
                                <td class="py-5 px-4 text-center font-extrabold font-headline text-rose-600">${isValidoMetrics ? formataNota(p.notaLin) : '--'}</td>
                                <td class="py-5 px-4 text-center font-extrabold font-headline text-amber-600">${isValidoMetrics ? formataNota(p.notaHum) : '--'}</td>
                                <td class="py-5 px-4 text-center font-extrabold font-headline text-emerald-600">${isValidoMetrics ? formataNota(p.notaNat) : '--'}</td>
                                <td class="py-5 px-4 text-center font-extrabold font-headline text-blue-600">${isValidoMetrics ? formataNota(p.notaMat) : '--'}</td>
                                <td class="py-5 px-4 text-right">
                                    <span class="bg-[#0B193C] text-white px-4 py-2 rounded-xl font-headline font-semibold text-xs shadow-md shadow-[#0B193C]/20 whitespace-nowrap overflow-hidden">${acertosTotaisText}</span>
                                </td>
                            </tr>
                        `;
                    } else {
                        html += `
                            <tr onclick="abrirOpcoesProva(${p.id}, '${p.banca}')" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer active:bg-slate-100 group">
                                <td class="py-5 px-4 font-bold text-[#0B193C] flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-sinapse-primary flex items-center justify-center font-extrabold shadow-sm">
                                        <span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                                    </div>
                                    <div>
                                        <p class="font-headline font-bold text-sm text-[#0B193C] tracking-wide">${p.banca}</p>
                                        <p class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">${p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Desconhecido'}</p>
                                    </div>
                                </td>
                                <td class="py-5 px-4 text-center font-semibold text-slate-600">${p.ano || '--'}</td>
                                <td class="py-5 px-4 text-right">
                                    <span class="bg-[#0B193C] text-white px-4 py-2 rounded-xl font-headline font-semibold text-xs shadow-md shadow-[#0B193C]/20 whitespace-nowrap overflow-hidden">${acertosTotaisText}</span>
                                </td>
                            </tr>
                        `;
                    }
"""

html = re.sub(r'html \+= `\n\s*<tr onclick="abrirOpcoesProva.*?</tr>\n\s*`;', row_replace, html, flags=re.DOTALL)

with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Dynamic table updated!')
