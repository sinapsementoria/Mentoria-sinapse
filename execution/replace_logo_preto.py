import os
import glob
import re

files = glob.glob('*.html')
pattern = re.compile(r'LOGO VETORIZADA\.png', re.IGNORECASE)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if pattern.search(content):
        # Substitui por LOGO SINAPSE FUNDO PRETO FINAL.png
        new_content = pattern.sub('LOGO SINAPSE FUNDO PRETO FINAL.png', content)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
