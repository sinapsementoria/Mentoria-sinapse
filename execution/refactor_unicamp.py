import re

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. DELETE unicampMeta
html = re.sub(r'<!-- ROW: UNICAMP -->\s*<div id="unicampMeta".*?(<!-- Lançamento de Notas -->)', r'\1', html, flags=re.DOTALL)

# 2. REPLACE notasUnicamp1 and notasUnicamp2 with notasUnicamp
new_unicamp_html = """<div id="notasUnicamp" class="hidden grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-blue-500 transition-all">
                                        <div class="flex items-center gap-2 text-blue-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">Matemática</span></div>
                                        <input type="number" id="notaU_Mat" step="1" min="0" max="12" placeholder="Máx 12" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-rose-500 transition-all">
                                        <div class="flex items-center gap-2 text-rose-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">Português</span></div>
                                        <input type="number" id="notaU_Port" step="1" min="0" max="13" placeholder="Máx 13" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-indigo-500 transition-all">
                                        <div class="flex items-center gap-2 text-indigo-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">Inglês</span></div>
                                        <input type="number" id="notaU_Ing" step="1" min="0" max="7" placeholder="Máx 7" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-emerald-500 transition-all">
                                        <div class="flex items-center gap-2 text-emerald-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">C. Natureza</span></div>
                                        <input type="number" id="notaU_Nat" step="1" min="0" max="22" placeholder="Máx 22" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-amber-500 transition-all">
                                        <div class="flex items-center gap-2 text-amber-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">C. Humanas</span></div>
                                        <input type="number" id="notaU_Hum" step="1" min="0" max="23" placeholder="Máx 23" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                </div>"""

html = re.sub(r'<div id="notasUnicamp1".*?</div>\s*</div>\s*</div>', new_unicamp_html + '\n                            </div>', html, flags=re.DOTALL)

# 3. Update Javascript toggleUnicampFase (Delete it)
html = re.sub(r'function toggleUnicampFase.*?}\s*function toggleAvaliacaoCampos', 'function toggleAvaliacaoCampos', html, flags=re.DOTALL)

# 4. Update toggleAvaliacaoCampos Unicamp logic
toggle_unicamp = """} else if(banca === 'UNICAMP') {
                    enemMeta.classList.add('hidden'); simuladoMeta.classList.add('hidden');
                    if(lancamentoNotasContainer) lancamentoNotasContainer.classList.remove('hidden');
                    notasComum.classList.add('hidden');
                    notasComum.classList.remove('grid');
                    notasFuvest.classList.add('hidden');
                    notasFuvest.classList.remove('grid');
                    if(document.getElementById('notasUnesp')) { document.getElementById('notasUnesp').classList.add('hidden'); document.getElementById('notasUnesp').classList.remove('grid'); }
                    document.getElementById('notasUnicamp').classList.remove('hidden'); document.getElementById('notasUnicamp').classList.add('grid');
                } else"""
html = re.sub(r'} else if\(banca === \'UNICAMP\'\) \{.*?} else if\(\[\'UNESP\'', toggle_unicamp + " if(['UNESP'", html, flags=re.DOTALL)

# 5. Visual Rest
# In toggleAvaliacaoCampos, when showing ENEM etc., make sure notasUnicamp is hidden
html = html.replace("if(document.getElementById('notasUnicamp1')) document.getElementById('notasUnicamp1').classList.add('hidden');", "if(document.getElementById('notasUnicamp')) { document.getElementById('notasUnicamp').classList.add('hidden'); document.getElementById('notasUnicamp').classList.remove('grid'); }")
html = html.replace("if(document.getElementById('notasUnicamp2')) document.getElementById('notasUnicamp2').classList.add('hidden');", "")

# 6. Salvar Prova Unicamp Logics
salvar_unicamp = """} else if(banca === 'UNICAMP') {
                        record.notaU_Mat = document.getElementById('notaU_Mat').value;
                        record.notaU_Port = document.getElementById('notaU_Port').value;
                        record.notaU_Ing = document.getElementById('notaU_Ing').value;
                        record.notaU_Nat = document.getElementById('notaU_Nat').value;
                        record.notaU_Hum = document.getElementById('notaU_Hum').value;
                    } else if(['UNESP'"""
html = html.replace("} else if(['UNESP'", salvar_unicamp)

html = re.sub(r'} else if\(banca === \'UNICAMP\'\) \{.*?\}\s*\}\s*// Validação', '} // Validação', html, flags=re.DOTALL)
# ^ Wait! The unesp logic was BEFORE unicamp?
# In my previous replace, Unicamp notes saving was at the end or before UNESP?
# FUVEST -> UNESP -> else (ENEM)
# Let's verify carefully. I will not use blind replace here for salvarProva to not break it.
"""
print('Phase 1 done')
with open('provas_tmp.html', 'w', encoding='utf-8') as f:
    f.write(html)
