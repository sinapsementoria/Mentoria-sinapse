import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Substituir o "<!-- Marquee TEMP -->" que pode ser "<!-- Marquee de fotos Redação -->" originalmente
# Vamos capturar todo o bloco do marquee
pattern = r'(<!-- Marquee TEMP -->.*?</div>\s*</div>\s*</div>\s*)<div class="grid md:grid-cols-3 gap-8">'

match = re.search(pattern, html, flags=re.DOTALL)
if match:
    marquee_code = match.group(1)
    
    # Remove the marquee from its current location
    html = html.replace(marquee_code, '')
    
    # The end of the Nossas Turmas section ends with replacing the last button
    target = 'SAIBA MAIS</button>\n</div>\n</div>\n</section>'
    
    if target in html:
        # Puxa o marquee devolta e joga o mt-24 pra afastar do card
        marquee_fixed = marquee_code.replace('mb-24', 'mt-12')
        # Também atualiza se existir o texto antigo TEMP
        marquee_fixed = marquee_fixed.replace('<!-- Marquee TEMP -->', '<!-- Marquee de fotos Redação (abaixo das turmas) -->')
        
        new_target = 'SAIBA MAIS</button>\n</div>\n</div>\n' + marquee_fixed + '</section>'
        html = html.replace(target, new_target)
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Movido com sucesso!")
    else:
        print("Target nao encontrado nas linhas finais do card.")
else:
    print("Pattern nao encontrou o marquee")

