import re

with open("provas.html", "r", encoding="utf-8") as f:
    content = f.read()

bancas = [
    {"val": "ENEM", "label": "ENEM", "img": "ENEM.png"},
    {"val": "SIMULADO", "label": "SIMULADO", "img": "SIMULADO.png"},
    {"val": "VEST-UNB", "label": "VEST-UNB", "img": "UNB.png"},
    {"val": "PAS-UNB", "label": "PAS-UNB", "img": "PAS-UNB.png"},
    {"val": "FUVEST", "label": "FUVEST", "img": "FUVEST.png"},
    {"val": "UNICAMP", "label": "UNICAMP", "img": "UNICAMP.png"},
    {"val": "UNESP", "label": "UNESP", "img": "UNESP.png"},
    {"val": "FAMERP", "label": "FAMERP", "img": "FAMERP.png"},
    {"val": "UFG", "label": "UFG", "img": "UFG.png"},
    {"val": "UEG", "label": "UEG", "img": "UEG.png"},
    {"val": "UFU", "label": "UFU", "img": "UFU.png"},
    {"val": "UFJF", "label": "UFJF", "img": "UFJF.png"},
    {"val": "UFMS", "label": "UFMS", "img": "UFMS.png"},
    {"val": "UFGD", "label": "UFGD", "img": "UFGD.png"},
    {"val": "UFPR", "label": "UFPR", "img": "UFPR.png"},
    {"val": "UFSC", "label": "UFSC", "img": "UFSC.png"},
    {"val": "UFRGS", "label": "UFRGS", "img": "UFRGS.png"},
    {"val": "UFT", "label": "UFT", "img": "UFT.png"},
    {"val": "UNIOESTE", "label": "UNIOESTE", "img": "UNIOESTE.png"},
    {"val": "UNIMONTES", "label": "UNIMONTES", "img": "UNIMONTES.png"},
    {"val": "UEMG", "label": "UEMG", "img": "UEMG.png"},
    {"val": "UCB", "label": "UCB", "img": "UCB.png"},
    {"val": "UNIRV", "label": "UNIRV", "img": "UNIRV.png"},
    {"val": "CEUB", "label": "CEUB", "img": "CEUB.png"},
    {"val": "UNIEURO", "label": "UNIEURO", "img": "UNIEURO.png"},
    {"val": "MAUÁ", "label": "MAUÁ", "img": "MAUÁ.png"},
    {"val": "UNICEPLAC", "label": "UNICEPLAC", "img": "UNICEPLAC.png"}
]

html_blocks = []
html_blocks.append('                        <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">')
for b in bancas:
    chk = ' checked' if b['val'] == 'ENEM' else ''
    html = f'''                            <!-- {b['val']} -->
                            <label class="relative cursor-pointer group">
                                <input type="radio" name="banca" value="{b['val']}" class="peer sr-only"{chk}
                                    onchange="toggleAvaliacaoCampos('{b['val']}')">
                                <div class="p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500">
                                    <img src="VESTIBULARES/LOGO VETORIZADA/{b['img']}" alt="{b['label']}" class="h-9 object-contain mb-1">
                                    <span class="font-bold font-headline tracking-wide text-center">{b['label']}</span>
                                </div>
                            </label>'''
    html_blocks.append(html)
html_blocks.append('                        </div>')

replacement = "\n".join(html_blocks)

# The grid block starts with <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
# and ends right before <!-- Campos Específicos ENEM / SIMULADO --> 
pattern = r'(<div class="grid grid-cols-2 lg:grid-cols-6 gap-4">).*?(?=<!-- Campos Específicos ENEM / SIMULADO -->)'
content_new, count = re.subn(pattern, replacement + "\n                    </div>\n\n                    ", content, flags=re.DOTALL)

with open("provas.html", "w", encoding="utf-8") as f:
    f.write(content_new)

print("Count replaced:", count)
