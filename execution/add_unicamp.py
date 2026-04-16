import re

with open('provas.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add UNICAMP Meta in avaliacaoFields
unicamp_meta_html = """
                            <!-- ROW: UNICAMP -->
                            <div id="unicampMeta" class="hidden col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300">
                                <div class="space-y-2 relative">
                                    <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Fase da Unicamp</label>
                                    <select id="unicampFase" onchange="toggleUnicampFase()" class="relative z-10 w-full bg-slate-50 border border-slate-200 text-[#0B193C] font-bold rounded-xl px-5 py-4 outline-none focus:border-sinapse-primary focus:ring-4 focus:ring-sinapse-primary/10 transition-all appearance-none cursor-pointer text-sm">
                                        <option value="1">1ª Fase</option>
                                        <option value="2">2ª Fase</option>
                                    </select>
                                    <span class="material-symbols-outlined absolute right-4 top-[40px] text-slate-400 pointer-events-none z-20">expand_more</span>
                                </div>
                                <div class="space-y-2 relative hidden" id="unicampAreaContainer">
                                    <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Área do Curso (2ª Fase)</label>
                                    <select id="unicampArea" onchange="toggleUnicampFase()" class="relative z-10 w-full bg-slate-50 border border-slate-200 text-[#0B193C] font-bold rounded-xl px-5 py-4 outline-none focus:border-sinapse-primary focus:ring-4 focus:ring-sinapse-primary/10 transition-all appearance-none cursor-pointer text-sm">
                                        <option value="biologicas">Ciências Biológicas/Saúde</option>
                                        <option value="exatas">Ciências Exatas/Tecnológicas</option>
                                        <option value="humanas">Ciências Humanas/Artes</option>
                                    </select>
                                    <span class="material-symbols-outlined absolute right-4 top-[40px] text-slate-400 pointer-events-none z-20">expand_more</span>
                                </div>
                            </div>
"""
if 'id="unicampMeta"' not in content:
    content = content.replace('<!-- Lançamento de Notas -->', unicamp_meta_html + '\n                        <!-- Lançamento de Notas -->')

# 2. Add UNICAMP Lançamento de Notas
unicamp_notas_html = """
                                <div id="notasUnicamp1" class="hidden grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-blue-500 transition-all">
                                        <div class="flex items-center gap-2 text-blue-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">Matemática</span></div>
                                        <input type="number" id="notaU1Mat" step="1" min="0" max="12" placeholder="/12" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-rose-500 transition-all">
                                        <div class="flex items-center gap-2 text-rose-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">Português</span></div>
                                        <input type="number" id="notaU1Port" step="1" min="0" max="12" placeholder="/12" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-indigo-500 transition-all">
                                        <div class="flex items-center gap-2 text-indigo-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">Inglês</span></div>
                                        <input type="number" id="notaU1Ing" step="1" min="0" max="7" placeholder="/7" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-emerald-500 transition-all">
                                        <div class="flex items-center gap-2 text-emerald-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">C. Natureza</span></div>
                                        <input type="number" id="notaU1Nat" step="1" min="0" max="21" placeholder="/21" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 group focus-within:border-amber-500 transition-all">
                                        <div class="flex items-center gap-2 text-amber-500"><span class="text-[10px] font-extrabold uppercase tracking-widest">C. Humanas</span></div>
                                        <input type="number" id="notaU1Hum" step="1" min="0" max="20" placeholder="/20" class="w-full bg-slate-50/50 border-none text-[#0B193C] text-2xl font-headline font-extrabold rounded-xl px-2 py-3 outline-none text-center">
                                    </div>
                                </div>

                                <div id="notasUnicamp2" class="hidden flex-col gap-6">
                                    <div><h4 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">2ª Fase - 1º Dia</h4>
                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all"><span class="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">Português</span><input type="number" id="notaU2Port" step="1" min="0" max="6" placeholder="/6" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all"><span class="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">Inglês</span><input type="number" id="notaU2Ing" step="1" min="0" max="2" placeholder="/2" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all"><span class="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">C. Natureza</span><input type="number" id="notaU2Nat" step="1" min="0" max="2" placeholder="/2" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all"><span class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Redação (Pts)</span><input type="number" id="notaU2Red" step="0.1" min="0" max="24" placeholder="/24" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                        </div>
                                    </div>
                                    <div><h4 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">2ª Fase - 2º Dia</h4>
                                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4" id="unicamp2Dia2Grid">
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all"><span class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">C. Humanas</span><input type="number" id="notaU2Hum" step="1" min="0" max="2" placeholder="/2" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-mat"><span class="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest">Matemática</span><input type="number" id="notaU2EspMat" step="1" min="0" max="6" placeholder="Max" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <!-- Dynamically toggled specific slots -->
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-bio"><span class="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">Biologia</span><input type="number" id="notaU2EspBio" step="1" min="0" max="7" placeholder="/7" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-qui"><span class="text-[10px] font-extrabold text-teal-500 uppercase tracking-widest">Química</span><input type="number" id="notaU2EspQui" step="1" min="0" max="5" placeholder="/5" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-fis"><span class="text-[10px] font-extrabold text-sky-500 uppercase tracking-widest">Física</span><input type="number" id="notaU2EspFis" step="1" min="0" max="5" placeholder="/5" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-geo"><span class="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest">Geografia</span><input type="number" id="notaU2EspGeo" step="1" min="0" max="5" placeholder="/5" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-hist"><span class="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">História</span><input type="number" id="notaU2EspHist" step="1" min="0" max="5" placeholder="/5" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-filo"><span class="text-[10px] font-extrabold text-purple-500 uppercase tracking-widest">Filosofia</span><input type="number" id="notaU2EspFilo" step="1" min="0" max="1" placeholder="/1" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 transition-all uni2-socio"><span class="text-[10px] font-extrabold text-fuchsia-500 uppercase tracking-widest">Sociologia</span><input type="number" id="notaU2EspSocio" step="1" min="0" max="1" placeholder="/1" class="w-full bg-slate-50/50 text-2xl font-bold rounded-xl text-center"></div>
                                        </div>
                                    </div>
                                </div>
"""
if 'id="notasUnicamp1"' not in content:
    content = content.replace('                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Botão de Ação -->', unicamp_notas_html + '\n                            </div>\n                        </div>\n                    </div>\n\n                    <!-- Botão de Ação -->')

# 3. Add to JS toggleAvaliacaoCampos
if "banca === 'UNICAMP'" not in content:
    content = content.replace("if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST')", "if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP')")
    content = content.replace("bFuv.classList.remove('hidden');\n            }", "bFuv.classList.remove('hidden');\n            } else if(chartFilter === 'UNICAMP') {\n                bLin.classList.add('hidden'); bHum.classList.add('hidden');\n                bNat.classList.add('hidden'); bMat.classList.add('hidden');\n                bFuv.classList.add('hidden');\n            }")
    content = content.replace('<option value="FUVEST">Evolução da FUVEST</option>', '<option value="FUVEST">Evolução da FUVEST</option>\n                        <option value="UNICAMP">Evolução da Unicamp</option>')

with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(content)
