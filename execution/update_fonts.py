import os
import glob

files = glob.glob('*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    modified = False
    
    # Adicionar fonte Playfair Display ao link de webfonts
    if 'Playfair+Display' not in content:
        content = content.replace('&display=swap', '&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap')
        content = content.replace('&amp;display=swap', '&amp;family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;display=swap')
        modified = True
        
    # Mudar a classe font-headline para usar Playfair Display
    target_str = ".font-headline { font-family: 'Manrope', sans-serif; }"
    replacement_str = ".font-headline { font-family: 'Playfair Display', serif; }"
    if target_str in content:
        content = content.replace(target_str, replacement_str)
        modified = True
        
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
