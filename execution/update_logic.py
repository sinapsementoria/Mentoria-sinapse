import re

with open('provas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# JS Togggles
html = html.replace("if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP' || banca === 'UNESP')", "if(banca === 'ENEM' || banca === 'SIMULADO' || banca === 'FUVEST' || banca === 'UNICAMP' || ['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(banca))")
html = html.replace("} else if(banca === 'UNESP') {", "} else if(['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(banca)) {")

# Salvar Prova (notaUnesp reading)
html = html.replace("} else if(banca === 'UNESP') {\n                        record.notaUnesp = document.getElementById('notaUnesp').value;", "} else if(['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(banca)) {\n                        record.notaUnesp = document.getElementById('notaUnesp').value;")

# Table Rendering string 
html = html.replace("let isUnesp = p.banca === 'UNESP';", "let isUnesp = ['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(p.banca);")

# Graph Select Options
new_options = '''    <option value="UNESP">Evolução da UNESP</option>
                                        <option value="VEST-UNB">Evolução da VEST-UNB</option>
                                        <option value="PAS-UNB">Evolução do PAS-UNB</option>
                                        <option value="UFG">Evolução da UFG</option>
                                        <option value="UEG">Evolução da UEG</option>
                                        <option value="UFU">Evolução da UFU</option>
                                        <option value="UFT">Evolução da UFT</option>
                                        <option value="UFPR">Evolução da UFPR</option>'''
html = html.replace('<option value="UNESP">Evolução da UNESP</option>', new_options)

# Graph JS Filtering blocks
html = html.replace("} else if(chartFilter === 'UNESP') {", "} else if(['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(chartFilter)) {")

html = html.replace("if(e.banca === 'UNESP') return UNESP ;", "if(['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(e.banca)) return ${e.banca} ;")

html = html.replace("} else if (chartFilter === 'UNESP') {\n                const dsUnesp = dataToPlot.map(e => parseInt(e.notaUnesp) || 0);", "} else if (['UNESP', 'VEST-UNB', 'PAS-UNB', 'UFG', 'UEG', 'UFU', 'UFT', 'UFPR'].includes(chartFilter)) {\n                const dsUnesp = dataToPlot.map(e => parseInt(e.notaUnesp) || 0);")

with open('provas.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Logic script complete!')
