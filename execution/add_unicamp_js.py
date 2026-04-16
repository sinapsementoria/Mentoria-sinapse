import re

with open('provas.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify toggleAvaliacaoCampos logic
toggle_replace = """
                } else if(banca === 'FUVEST') {
                    // FUVEST só usa O Ano que já é comum
                    enemMeta.classList.add('hidden');
                    simuladoMeta.classList.add('hidden');
                    notasComum.classList.add('hidden');
                    notasComum.classList.remove('grid');
                    notasFuvest.classList.remove('hidden');
                    notasFuvest.classList.add('grid');
                    if(document.getElementById('unicampMeta')) document.getElementById('unicampMeta').classList.add('hidden');
                    if(document.getElementById('notasUnicamp1')) {
                        document.getElementById('notasUnicamp1').classList.add('hidden');
                        document.getElementById('notasUnicamp1').classList.remove('grid');
                        document.getElementById('notasUnicamp2').classList.add('hidden');
                        document.getElementById('notasUnicamp2').classList.remove('flex');
                    }
                } else if(banca === 'UNICAMP') {
                    enemMeta.classList.add('hidden');
                    simuladoMeta.classList.add('hidden');
                    notasComum.classList.add('hidden');
                    notasComum.classList.remove('grid');
                    notasFuvest.classList.add('hidden');
                    notasFuvest.classList.remove('grid');
                    document.getElementById('unicampMeta').classList.remove('hidden');
                    toggleUnicampFase(); // call this to verify phase 1 or 2
                }
"""

if "if(document.getElementById('unicampMeta'))" not in content:
    content = re.sub(
        r"\} else if\(banca === 'FUVEST'\) \{.*?notasFuvest\.classList\.add\('grid'\);\s*\}",
        toggle_replace.strip(),
        content,
        flags=re.DOTALL
    )

# Add toggleUnicampFase and toggleUnicampArea right before toggleAvaliacaoCampos
js_functions = """
        function toggleUnicampFase() {
            const fase = document.getElementById('unicampFase').value;
            const u1 = document.getElementById('notasUnicamp1');
            const u2 = document.getElementById('notasUnicamp2');
            const unicampArea = document.getElementById('unicampAreaContainer');
            if(fase === '1') {
                u1.classList.remove('hidden');
                u1.classList.add('grid');
                u2.classList.add('hidden');
                u2.classList.remove('flex');
                unicampArea.classList.add('hidden');
            } else {
                u1.classList.add('hidden');
                u1.classList.remove('grid');
                u2.classList.remove('hidden');
                u2.classList.add('flex');
                unicampArea.classList.remove('hidden');
                
                const area = document.getElementById('unicampArea').value;
                const matSlot = document.getElementById('notaU2EspMat');
                
                // Hide all specific
                document.querySelectorAll('.uni2-bio, .uni2-qui, .uni2-fis, .uni2-geo, .uni2-hist, .uni2-filo, .uni2-socio').forEach(el => el.classList.add('hidden'));
                
                if(area === 'biologicas') {
                    matSlot.max = 4; matSlot.placeholder = "/4";
                    document.querySelector('.uni2-bio').classList.remove('hidden');
                    document.querySelector('.uni2-qui').classList.remove('hidden');
                } else if(area === 'exatas') {
                    matSlot.max = 6; matSlot.placeholder = "/6";
                    document.querySelector('.uni2-fis').classList.remove('hidden');
                    document.querySelector('.uni2-qui').classList.remove('hidden');
                } else if(area === 'humanas') {
                    matSlot.max = 4; matSlot.placeholder = "/4";
                    document.querySelector('.uni2-geo').classList.remove('hidden');
                    document.querySelector('.uni2-hist').classList.remove('hidden');
                    document.querySelector('.uni2-filo').classList.remove('hidden');
                    document.querySelector('.uni2-socio').classList.remove('hidden');
                }
            }
        }
"""
if "function toggleUnicampFase" not in content:
    content = content.replace("function toggleAvaliacaoCampos(banca) {", js_functions + "\n        function toggleAvaliacaoCampos(banca) {")


# Table render fix
render_js_replace = """
                    let isFuvest = p.banca === 'FUVEST';
                    let isUnicamp = p.banca === 'UNICAMP';
                    let isValidoMetrics = isEnem || isSimulado;
                    
                    let acertosTotaisText = '--';
                    if(isValidoMetrics) {
                        let somador_acertos = (parseInt(p.notaLin)||0) + (parseInt(p.notaHum)||0) + (parseInt(p.notaNat)||0) + (parseInt(p.notaMat)||0);
                        acertosTotaisText = `${somador_acertos}/180 acertos`;
                    } else if(isFuvest) {
                        let acertoF = parseInt(p.notaFuvest)||0;
                        acertosTotaisText = `${acertoF}/90 acertos`;
                    } else if(isUnicamp) {
                        if(p.unicamp_fase === '1') {
                            let pts = (parseInt(p.uni1_mat)||0) + (parseInt(p.uni1_port)||0) + (parseInt(p.uni1_ing)||0) + (parseInt(p.uni1_nat)||0) + (parseInt(p.uni1_hum)||0);
                            acertosTotaisText = `1ª F: ${pts}/72`;
                        } else {
                            acertosTotaisText = `2ª Fase`;
                        }
                    }

                    html += `
                        <tr onclick="abrirOpcoesProva(${p.id}, '${isSimulado ? `Simulado ${p.instituicao||''}` : p.banca}')" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer active:bg-slate-100 group">
                            <td class="py-5 px-4 font-bold text-[#0B193C] flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-sinapse-primary flex items-center justify-center font-extrabold shadow-sm">
                                    <span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                                </div>
                                <div>
                                    <p class="font-headline font-bold text-sm text-[#0B193C] tracking-wide">${isSimulado ? `Simulado ${p.instituicao||''}` : p.banca} ${isUnicamp ? (p.unicamp_fase + 'ª Fase') : ''}</p>
                                    <p class="text-[9px] uppercase font-bold text-slate-400 tracking-wider">${p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Desconhecido'}</p>
                                </div>
                            </td>
                            <td class="py-5 px-4 text-center font-semibold text-slate-600">
                                ${isEnem ? (p.ano ? p.ano + (p.ppl === 'Sim' ? ' (PPL)' : '') : '--') : (isSimulado ? `${p.ano} (Exame Nº ${p.numero||'-'})` : ((isFuvest || isUnicamp) ? p.ano : '--'))}
                            </td>
"""
content = re.sub(
    r"let isFuvest = p\.banca === 'FUVEST';.*?\$\{(isFuvest \? p\.ano : '--')\}\)",
    render_js_replace.strip(),
    content,
    flags=re.DOTALL
)

# Salvar Prova Logic
save_js_replace = """
                if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP') {
                    record.ano = document.getElementById('enemAno').value;
                    if(banca === 'ENEM') {
                        record.ppl = document.getElementById('enemPpl').value;
                        record.cor = document.getElementById('enemCor').value || '-';
                    } else if(banca === 'SIMULADO') {
                        record.instituicao = document.getElementById('simInst').value || '-';
                        record.numero = document.getElementById('simNum').value || '-';
                    } else if(banca === 'UNICAMP') {
                        record.unicamp_fase = document.getElementById('unicampFase').value;
                        if(record.unicamp_fase === '1') {
                            record.uni1_mat = document.getElementById('notaU1Mat').value;
                            record.uni1_port = document.getElementById('notaU1Port').value;
                            record.uni1_ing = document.getElementById('notaU1Ing').value;
                            record.uni1_nat = document.getElementById('notaU1Nat').value;
                            record.uni1_hum = document.getElementById('notaU1Hum').value;
                        } else {
                            record.unicamp_area = document.getElementById('unicampArea').value;
                            record.uni2_port = document.getElementById('notaU2Port').value;
                            record.uni2_ing = document.getElementById('notaU2Ing').value;
                            record.uni2_nat = document.getElementById('notaU2Nat').value;
                            record.uni2_red = document.getElementById('notaU2Red').value;
                            record.uni2_hum = document.getElementById('notaU2Hum').value;
                            record.uni2_esp_mat = document.getElementById('notaU2EspMat').value;
                            record.uni2_esp_bio = document.getElementById('notaU2EspBio').value;
                            record.uni2_esp_qui = document.getElementById('notaU2EspQui').value;
                            record.uni2_esp_fis = document.getElementById('notaU2EspFis').value;
                            record.uni2_esp_geo = document.getElementById('notaU2EspGeo').value;
                            record.uni2_esp_hist = document.getElementById('notaU2EspHist').value;
                            record.uni2_esp_filo = document.getElementById('notaU2EspFilo').value;
                            record.uni2_esp_socio = document.getElementById('notaU2EspSocio').value;
                        }
                    }
                    
                    if(banca === 'FUVEST') {
                        record.notaFuvest = document.getElementById('notaFuvest').value;
                    } else if(banca !== 'UNICAMP') {
"""

if "banca === 'UNICAMP'" not in content:
    content = re.sub(
        r"if\(banca === 'ENEM' \|\| banca === 'SIMULADO' \|\| banca === 'FUVEST'\) \{.*?if\(banca === 'FUVEST'\) \{",
        save_js_replace.strip() + "\n                        if(banca === 'FUVEST') {",
        content,
        flags=re.DOTALL
    )
if "document.getElementById('unicampFase').value = '1'" not in content:
    content = content.replace("document.getElementById('notaFuvest').value = '';", "document.getElementById('notaFuvest').value = '';\n                    if(banca === 'UNICAMP') { document.getElementById('unicampFase').value = '1'; document.querySelectorAll('#notasUnicamp1 input, #notasUnicamp2 input').forEach(i => i.value=''); toggleUnicampFase(); }")

with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(content)
