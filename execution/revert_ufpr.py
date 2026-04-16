import re
import sys

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove from grid
html = re.sub(r'\s*<!-- UFU -->.*?<!-- UFT -->', '\n                            <!-- UFT -->', html, flags=re.DOTALL)
html = re.sub(r'\s*<!-- UFPR -->.*?</label>', '', html, flags=re.DOTALL)

# 2. Add UFU and UFPR removal from toggleAvaliacaoCampos
html = re.sub(r"\s*if\(document\.getElementById\('notasUfu'\)\) \{ document\.getElementById\('notasUfu'\)\.classList\.add\('hidden'\); document\.getElementById\('notasUfu'\)\.classList\.remove\('grid'\); \}", "", html)
html = re.sub(r"\s*if\(document\.getElementById\('notasUfpr'\)\) \{ document\.getElementById\('notasUfpr'\)\.classList\.add\('hidden'\); document\.getElementById\('notasUfpr'\)\.classList\.remove\('grid'\); \}", "", html)

html = re.sub(r"\s*\} else if\(banca === 'UFPR'\) \{.*?(?=\} else if|\} else \{)", " ", html, flags=re.DOTALL)
html = re.sub(r"\s*\} else if\(banca === 'UFU'\) \{.*?(?=\} else if|\} else \{)", " ", html, flags=re.DOTALL)

# Remove input forms for UFU and UFPR
html = re.sub(r"\s*<!-- ROW: UFU -->.*?</div>", "", html, flags=re.DOTALL)
html = re.sub(r"\s*<!-- ROW: UFPR -->.*?</div>", "", html, flags=re.DOTALL)
html = re.sub(r"\s*<div id=\"notasUfu\".*?</div>\s*</div>\s*</div>", "", html, flags=re.DOTALL)
html = re.sub(r"\s*<div id=\"notasUfpr\".*?</div>\s*</div>\s*</div>", "", html, flags=re.DOTALL)

# Remove select options
html = html.replace('<option value="UFU">Evolução da UFU</option>', "")
html = html.replace('<option value="UFPR">Evolução da UFPR</option>', "")

# Remove charts boxes
html = re.sub(r"\s*<!-- Gráficos UFU -->.*?</div>\s*</div>\s*(?=<!-- Gráficos|\Z)", "", html, flags=re.DOTALL)
html = re.sub(r"\s*<!-- Gráficos UFPR -->.*?</div>\s*</div>\s*(?=<!-- Gráficos|\Z)", "", html, flags=re.DOTALL)

# JS cleaning in includes validation
html = html.replace(", 'UFU'", "").replace(", 'UFPR'", "").replace("'UFU', ", "").replace("'UFPR', ", "")
# Clean up ['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFT'].includes(banca) 
# The arrays will automatically have UFU and UFPR removed due to the replace above.

# Remove from renderInterface logic
html = re.sub(r"\s*let isUfu = p\.banca === 'UFU';", "", html)
html = re.sub(r"\s*let isUfpr = p\.banca === 'UFPR';", "", html)

html = re.sub(r"\s*\} else if\(isUfu\) \{.*?(?=\} else if)", " ", html, flags=re.DOTALL)
html = re.sub(r"\s*\} else if\(isUfpr\) \{.*?(?=\} else if)", " ", html, flags=re.DOTALL)

# Remove from JS constants
html = re.sub(r"\s*const bUfu.*?getElementById\('boxUFU.*?;\n", "\n", html)
html = re.sub(r"\s*const bUfpr.*?getElementById\('boxUFPR.*?;\n", "\n", html)
html = re.sub(r"\s*bUfu[A-Za-z]+, |bUfpr[A-Za-z]+, ", "", html)

# Remove from renderMultipleCharts
html = re.sub(r"\s*\} else if \(chartFilter === 'UFU'\) \{.*?(?=\} else if)", " ", html, flags=re.DOTALL)
html = re.sub(r"\s*\} else if \(chartFilter === 'UFPR'\) \{.*?(?=\} else if)", " ", html, flags=re.DOTALL)

# Remove from salvarProva validation
html = re.sub(r"\s*\} else if\(banca === 'UFU'\) \{.*?(?=\} else if)", " ", html, flags=re.DOTALL)
html = re.sub(r"\s*\} else if\(banca === 'UFPR'\) \{.*?(?=\} else if|\} else \{)", " ", html, flags=re.DOTALL)

html = re.sub(r"\s*if\(banca === 'UFU'\) \{ document\.querySelectorAll\('#notasUfu input'\)\.forEach\(i => i\.value=''\); \}", "", html)
html = re.sub(r"\s*if\(banca === 'UFPR'\) \{ document\.querySelectorAll\('#notasUfpr input'\)\.forEach\(i => i\.value=''\); \}", "", html)

html = re.sub(r"\s*anoInput\.addEventListener\('input', atualizarLimitesUfu\);", "", html)

# Extra safe cleanup of charts that might span differently
html = re.sub(r"\s*<div id=\"boxUFPR_.*?</canvas></div>\s*</div>", "", html, flags=re.DOTALL)
html = re.sub(r"\s*<div id=\"boxUFU_.*?</canvas></div>\s*</div>", "", html, flags=re.DOTALL)

with open('provas_reverted.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Script finished')
