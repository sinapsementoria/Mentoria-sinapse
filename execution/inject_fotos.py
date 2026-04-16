import os
import re
import math

folder = "FOTO REDACOES"
files = [f for f in os.listdir(folder) if f.endswith('.jpeg')]

# 1. Definir pool de notas decrescentes simuladas
notas = [980]*3 + [960]*8 + [940]*12 + [920]*10 + [900]*10
notas = sorted(notas, reverse=True)
notas = notas[:len(files)]

html_groups = ""
for i in range(0, len(files), 5):
    html_groups += f'        <!-- Grupo {i//5 + 1} -->\n'
    for j in range(i, min(i+5, len(files))):
        f = files[j]
        nota = notas[j]
        html_groups += f'''        <div class="w-[120px] h-[120px] rounded-[2rem] overflow-hidden shadow-lg shrink-0 relative group">
            <img src="{folder}/{f}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Aluno">
            <div class="absolute bottom-0 w-full bg-black/60 text-center py-1 backdrop-blur-sm"><span class="text-[10px] font-bold text-[#fed488] uppercase tracking-widest" style="color: #fed488;">+{nota}</span> <span class="text-[9px] font-bold text-white uppercase tracking-widest">Redação</span></div>
        </div>\n'''
        
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Substituir o conteúdo dentro do animate-marquee
pattern = r'(<div class="animate-marquee gap-8 px-4">).*?(</div>\s*</div>\s*</section>)'
match = re.search(pattern, html, flags=re.DOTALL)
if match:
    new_html = html[:match.start(1)] + match.group(1) + '\n\n' + html_groups + '\n    ' + match.group(2) + html[match.end(2):]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Sucesso! Fotos injetadas no marquee.")
else:
    print("Nao consegui dar o split final no HTML. Tente regex manual.")
