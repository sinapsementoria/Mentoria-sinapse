import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Substituir o tamanho dos containers (para todas as 40 fotos geradas de w-120/h-120 para w-180/h-180)
# Aumentando de 120px para 180px
new_html = html.replace('w-[120px] h-[120px]', 'w-[180px] h-[180px]')

# Aumentar a altura do invólucro do Carrossel Marquee para abrigar o novo tamanho
# Original: overflow-hidden h-[150px] flex items-center
new_html = new_html.replace('h-[150px] flex items-center', 'h-[220px] flex items-center')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Tamanhos atualizados com sucesso de 120 para 180 pixels.")
