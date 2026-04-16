import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '<!-- Marquee de fotos Redação (abaixo das turmas) -->\n<div class="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden h-[150px] flex items-center mt-12">'

new_content = """<!-- Title for Redacao -->
<div class="text-center w-full mx-auto mt-20 mb-6 flex flex-col items-center">
<h2 class="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary-container lg:whitespace-nowrap">7 em cada 10 alunos matriculados tiraram 900+ na Redação do ENEM</h2>
</div>
<!-- Marquee de fotos Redação (abaixo das turmas) -->
<div class="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden h-[150px] flex items-center mt-2">"""

if target in html:
    html = html.replace(target, new_content)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Atualizado sucesso exato")
else:
    print("Nao bateu com target 1, tentando um fallback...")
    target2 = '<!-- Marquee de fotos Redação (abaixo das turmas) -->\n<div class="'
    if '<!-- Marquee de fotos Redação (abaixo das turmas) -->' in html:
        html = html.replace('<!-- Marquee de fotos Redação (abaixo das turmas) -->', """<!-- Title for Redacao -->
<div class="text-center w-full mx-auto mt-20 mb-6 flex flex-col items-center px-4">
<h2 class="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary-container lg:whitespace-nowrap">7 em cada 10 alunos matriculados tiraram 900+ na Redação do ENEM</h2>
</div>
<!-- Marquee de fotos Redação (abaixo das turmas) -->""")
        # vamos arrumar a margem 'mt-12' para não distanciar muito do novo subtitulo
        html = html.replace('flex items-center mt-12', 'flex items-center mt-2')
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Atualizado com fallback misto")
    else:
        print("nao tem rastro dessa string no index html")
