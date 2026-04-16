import os
import glob
import re

html_files = glob.glob('*.html')

new_logo_block = """
        <!-- Logo Area -->
        <div class="h-[175px] pt-4 flex flex-col items-center justify-center border-b border-slate-50/50 shrink-0 gap-0">
            <img src="LEÃO VETORIZADO.png" alt="Logo Leão" class="w-24 h-24 md:w-28 md:h-28 object-contain mix-blend-multiply drop-shadow-sm transition-transform duration-500 hover:scale-[1.03]" />
            <span class="font-headline font-extrabold text-[20px] md:text-[22px] text-[#0B193C] tracking-tight whitespace-nowrap -mt-3">LION <span class="font-light opacity-70">MENTORIA</span></span>
        </div>
        
        <!-- Menu Principal -->
        <nav"""

pattern = re.compile(r'(<aside[^>]*>).*?(<nav)', re.DOTALL | re.IGNORECASE)

for f in html_files:
    if f.lower() == 'mentoria.html':
        continue
        
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        def repl(match):
            return match.group(1) + new_logo_block
            
        if '<aside' in content.lower() and '<nav' in content.lower():
            new_content = pattern.sub(repl, content)
            
            if new_content != content:
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated Logo in {f}")
            else:
                print(f"No changes needed for {f}")
        else:
            print(f"Skipped {f} - <aside> or <nav> not found.")
            
    except Exception as e:
        print(f"Error processing {f}: {e}")
