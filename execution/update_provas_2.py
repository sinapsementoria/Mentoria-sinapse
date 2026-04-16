import re

with open('provas.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. HTML Radio Buttons Replacement
bancas = [
    ("ENEM", "ENEM", "import_contacts"),
    ("SIMULADO", "Simulado", "edit_document"),
    ("VEST-UNB", "Vest UnB", "school"),
    ("PAS-UNB", "PAS UnB", "looks_one"),
    ("FUVEST", "FUVEST", "account_balance"),
    ("UNICAMP", "UNICAMP", "science"),
    ("UNESP", "UNESP", "architecture"),
    ("UFG", "UFG", "forest"),
    ("UEG", "UEG", "public"),
    ("UFU", "UFU", "biotech"),
    ("UFJF", "UFJF", "menu_book"),
    ("UFMS", "UFMS", "eco"),
    ("UFGD", "UFGD", "agriculture"),
    ("UFPR", "UFPR", "park"),
    ("UFSC", "UFSC", "water"),
    ("UFRGS", "UFRGS", "landscape"),
    ("UFT", "UFT", "psychology"),
    ("UNIOESTE", "UNIOESTE", "computer"),
    ("UNIMONTES", "UNIMONTES", "health_and_safety"),
    ("UEMG", "UEMG", "engineering"),
    ("UCB", "UCB", "local_hospital"),
    ("UNIRV", "UNIRV", "medical_services"),
    ("CEUB", "CEUB", "healing"),
    ("UNIEURO", "UNIEURO", "medication"),
    ("MAUÁ", "MAUÁ", "biotech")
]

radios_html = ""
for val, label, icon in bancas:
    chk = "checked" if val == "ENEM" else ""
    radios_html += f'''                                <label class="group relative cursor-pointer">
                                    <input type="radio" name="banca" value="{val}" class="peer sr-only" {chk} onchange="toggleAvaliacaoCampos(this.value)">
                                    <div class="p-5 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover:border-sinapse-primary/50 peer-checked:bg-[#0B193C] peer-checked:border-[#0B193C] peer-checked:text-white peer-checked:shadow-xl text-slate-500">
                                        <span class="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform peer-checked:text-white">{icon}</span>
                                        <span class="font-headline font-extrabold text-sm tracking-wide text-center">{label}</span>
                                    </div>
                                </label>\n'''

# Replace from <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
pattern = r'(<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"\s*>).*?(                                </div>\s*</div>\s*<!-- AVALIAÇÃO ONDE OS CAMPOS MUDAM -->)'
content = re.sub(pattern, r'\1\n' + radios_html + r'\2', content, flags=re.DOTALL)


# 2. toggleAvaliacaoCampos update
all_bancas = [b[0] for b in bancas]
includes_str = "['" + "', '".join(all_bancas) + "'].includes(banca)"

content = re.sub(r'if \(banca === \'ENEM\'[^)]+includes\([^)]+\)\) \{(\s*container\.style\.opacity = \'1\';)', f'if ({includes_str}) {{\\1', content)

content = re.sub(r'else if \(banca === \'UFT\'\) \{[\s\S]*?\} else \{', r"else if (banca === 'UFT') {\n                    notasUft.classList.remove('hidden');\n                    notasUft.classList.add('grid');\n                    container.style.maxHeight = '2000px';\n                } else {\n", content)


# 3. salvarProva logic update
content = re.sub(r'if \(banca === \'ENEM\'[^)]+includes\(banca\)\) \{(\s*record\.ano = document\.getElementById)', f'if ({includes_str}) {{\\1', content)

content = re.sub(r'if \(banca === \'ENEM\'[^)]+includes\(banca\)\) \{(\s*document\.getElementById\(\'notaLin\'\)\.value = \'\';)', f'if ({includes_str}) {{\\1', content)


# 4. renderMultipleCharts Rendimento update
# find: let isValidoMetrics = isEnem || isSimulado;
is_valido_str = "let isValidoMetrics = isEnem || isSimulado || !(['FUVEST', 'UNESP', 'UFG', 'UEG', 'UFT', 'UNICAMP', 'VEST-UNB', 'PAS-UNB'].includes(p.banca));"
content = content.replace("let isValidoMetrics = isEnem || isSimulado;", is_valido_str)

# find: acertosTotaisText = `${somador_acertos}/180 acertos`
# replace with: acertosTotaisText = p.banca === 'ENEM' ? `${somador_acertos}/180 acertos` : `${somador_acertos} acertos`;
content = content.replace("acertosTotaisText = `${somador_acertos}/180 acertos`;", "acertosTotaisText = p.banca === 'ENEM' ? `${somador_acertos}/180 acertos` : `${somador_acertos} acertos`;")


with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Script executado")
