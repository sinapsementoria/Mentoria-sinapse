import os
import re

scores = {
    "WhatsApp Image 2026-04-11 at 19.00.52 (1).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.52 (2).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.52.jpeg": 960,
    "WhatsApp Image 2026-04-11 at 19.00.53 (1).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.53 (2).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.53 (3).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.53.jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.54 (1).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.54 (2).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.54 (3).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.54.jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.55 (1).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.55 (2).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.55 (3).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.55.jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.56 (1).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.56 (2).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.56 (3).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.56.jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.57 (1).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.57 (2).jpeg": 960,
    "WhatsApp Image 2026-04-11 at 19.00.57 (3).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.57.jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.58 (1).jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.58 (2).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.58 (3).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.00.58.jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.00.59 (1).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.00.59 (2).jpeg": 960,
    "WhatsApp Image 2026-04-11 at 19.00.59.jpeg": 960,
    "WhatsApp Image 2026-04-11 at 19.01.00 (1).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.01.00 (2).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.01.00.jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.01.01 (1).jpeg": 920,
    "WhatsApp Image 2026-04-11 at 19.01.01 (2).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.01.01 (3).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.01.01 (4).jpeg": 900,
    "WhatsApp Image 2026-04-11 at 19.01.01.jpeg": 940,
    "WhatsApp Image 2026-04-11 at 19.01.02.jpeg": 920
}

folder = 'FOTO REDACOES'
img_list = []
if os.path.exists(folder):
    for f in os.listdir(folder):
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            score = scores.get(f, 900)
            img_list.append((f, score))

img_list.sort(key=lambda x: x[1], reverse=True)

html_marquee = ""
for img, score in img_list:
    src = f"FOTO REDACOES/{img}"
    html_marquee += f'''        <div class="w-[180px] h-[180px] rounded-[2rem] overflow-hidden shadow-lg shrink-0 relative group">
            <img src="{src}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Aluno {score}">
        </div>\n'''

try:
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    new_marquee_section = f'''<!-- Marquee de fotos Redação (abaixo das turmas) -->
<div class="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden h-[220px] flex items-center mt-2 group/marquee">
    <!-- Gradient Masks -->
    <div class="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none"></div>
    <div class="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none"></div>
    
    <!-- First Scrolling Strip -->
    <div class="animate-marquee gap-8 px-4 flex group-hover/marquee:pause items-center h-full">
{html_marquee}
    </div>
    
    <!-- Second Scrolling Strip (Duplicata) -->
    <div class="animate-marquee2 absolute gap-8 px-4 flex items-center h-full group-hover/marquee:pause top-0 min-h-full">
{html_marquee}
    </div>
</div>
'''

    # Encontrar do comeco do marquee de redação até o final dele (<!-- Footer Section --> ou um script que venha logo apos)
    pattern = r'<!-- Marquee de fotos Red.*?-->.*?</section>'
    
    match = re.search(pattern, content, flags=re.DOTALL)
    if match:
        new_content = content[:match.start()] + new_marquee_section + "</section>\n" + content[match.end():]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Fotos ordenadas e renderizadas! Tamanho ampliado mantido com Flex reativado.")
    else:
        # Tenta buscar por outro delimitador em vez de section q eu talvez tenha deletado sem querer.
        pattern2 = r'(<div class="w-\[100vw\] relative left-1\/2 right-1\/2.*?)(<footer|\s*<script>|\s*<!--)'
        m2 = re.search(pattern2, content, flags=re.DOTALL)
        if m2:
            print("Encontrado padrao 2.")
            new_content = content[:m2.start()] + new_marquee_section + content[m2.end(2)-len(m2.group(2)):]
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Sucesso!")
        else:
            print("Nenhum padrão detectado!")
except Exception as e:
    print(f"Erro {e}")
