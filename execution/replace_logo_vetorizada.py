import os
import glob
import re

files = glob.glob('*.html')
pattern = re.compile(r'LOGO SINAPSE FINAL\.jpeg', re.IGNORECASE)

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if pattern.search(content):
        # Substitui por LOGO VETORIZADA.png
        new_content = pattern.sub('LOGO VETORIZADA.png', content)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
