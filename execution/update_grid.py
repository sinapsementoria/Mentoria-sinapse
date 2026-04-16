import re

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Clean up garbage notasUnesp from line 143
html = re.sub(r'<!-- UNESP -->\s*<div id=\"notasUnesp\".*?</div>\s*</div>', '<!-- UNESP -->', html, flags=re.DOTALL)

# 2. Add PAS-UNB, UFG, UEG, etc. to the grid
grid_replacement = '''                            <!-- VEST-UNB -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"VEST-UNB\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('VEST-UNB')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UNB.png\" alt=\"VEST-UNB\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">VEST-UNB</span>
                                </div>
                            </label>
                            <!-- PAS-UNB -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"PAS-UNB\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('PAS-UNB')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/PAS-UNB.png\" alt=\"PAS-UNB\" onerror=\"this.src='VESTIBULARES/LOGO VETORIZADA/UNB.png'\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide text-[10px]\">PAS-UNB</span>
                                </div>
                            </label>
                            <!-- UNESP -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"UNESP\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('UNESP')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UNESP.png\" alt=\"UNESP\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">UNESP</span>
                                </div>
                            </label>
                            <!-- UFG -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"UFG\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('UFG')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UFG.png\" alt=\"UFG\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">UFG</span>
                                </div>
                            </label>
                            <!-- UEG -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"UEG\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('UEG')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UEG.png\" alt=\"UEG\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">UEG</span>
                                </div>
                            </label>
                            <!-- UFU -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"UFU\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('UFU')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UFU.png\" alt=\"UFU\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">UFU</span>
                                </div>
                            </label>
                            <!-- UFT -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"UFT\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('UFT')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UFT.png\" alt=\"UFT\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">UFT</span>
                                </div>
                            </label>
                            <!-- UFPR -->
                            <label class=\"relative cursor-pointer group\">
                                <input type=\"radio\" name=\"banca\" value=\"UFPR\" class=\"peer sr-only\" onchange=\"toggleAvaliacaoCampos('UFPR')\">
                                <div class=\"p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500\">
                                    <img src=\"VESTIBULARES/LOGO VETORIZADA/UFPR.png\" alt=\"UFPR\" class=\"h-9 object-contain mb-1\">
                                    <span class=\"font-bold font-headline tracking-wide\">UFPR</span>
                                </div>
                            </label>'''

html = re.sub(r'<!-- UNB -->.*?<!-- UNESP -->.*?</label>', grid_replacement, html, flags=re.DOTALL)

with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Grid updated!')
