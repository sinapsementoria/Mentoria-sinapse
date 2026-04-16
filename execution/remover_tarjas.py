import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Usa regex para deletar todas as divs de tarja de notas na área de REDAÇÕES.
# O padrão bate com a linha introduzida: 
# <div class="absolute bottom-0 w-full bg-black/60 text-center py-1 backdrop-blur-sm"><span class="text-[10px]... Redação</span></div>
pattern = r'<div class="absolute bottom-0 w-full bg-black/60 text-center py-1 backdrop-blur-sm">.*?Redação</span></div>\s*'

new_html = re.sub(pattern, '', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Tarjas de redação removidas com sucesso.")
