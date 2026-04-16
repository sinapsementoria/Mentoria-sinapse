import re
import sys

with open('metricas.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add Filter dropdown
filter_html = """
            <!-- Filtro de Banca (Injetado) -->
            <div class="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6 gap-4">
                <div>
                    <h3 class="font-headline font-extrabold text-[#0B193C] text-lg">Visão Analítica</h3>
                    <p class="text-[12px] text-slate-400 font-medium">Filtre os dados por tipo de avaliação</p>
                </div>
                <select id="bancaFilterMetricas" onchange="processAndRenderDashboard()" class="bg-slate-50 border border-slate-200 text-[#0B193C] font-bold rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all text-sm cursor-pointer shadow-sm min-w-[200px] appearance-none">
                    <option value="ALL">Todas as Atividades (Geral)</option>
                    <option value="ENEM">Apenas ENEM</option>
                    <option value="SIMULADO">Apenas Simulados (Estilo ENEM)</option>
                    <option value="FUVEST">Apenas FUVEST</option>
                    <option value="UNICAMP">Apenas Unicamp</option>
                    <option value="UNESP">Apenas UNESP</option>
                    <option value="VEST-UNB">Apenas Vestibular UnB</option>
                    <option value="PAS-UNB">Apenas PAS UnB</option>
                    <option value="UFG">Apenas UFG</option>
                    <option value="UEG">Apenas UEG</option>
                    <option value="UFT">Apenas UFT</option>
                </select>
            </div>

            <!-- Seção Analítica: Gráficos -->
"""
html = html.replace('<!-- Seção Analítica: Gráficos -->', filter_html)


# 2. Update JS logic to use the filter and map all exam boards
js_logic = """
            const bancaFiltro = document.getElementById('bancaFilterMetricas') ? document.getElementById('bancaFilterMetricas').value : 'ALL';
            
            // Filter metrics_entries (only apply filter if it's ALL, else we ignore avulse questions unless appropriate)
            const filteredEntries = bancaFiltro === 'ALL' ? entries : [];

            filteredEntries.forEach(e => {
                const total = Number(e.questions_total || 0);
                const acertos = Number(e.correct_answers || 0);
                
                globalTotal += total;
                globalCorrects += acertos;

                // Discipline
                if (!discData[e.discipline]) discData[e.discipline] = { total: 0, corretas: 0 };
                discData[e.discipline].total += total;
                discData[e.discipline].corretas += acertos;

                // Subject
                const subKey = e.discipline + '::' + e.subject;
                if (!subjectData[subKey]) subjectData[subKey] = { discipline: e.discipline, subject: e.subject, total: 0, corretas: 0 };
                subjectData[subKey].total += total;
                subjectData[subKey].corretas += acertos;

                // Evolution (by unique date)
                if(e.created_at) {
                    const dateKey = e.created_at.split('T')[0]; 
                    if (!dateData[dateKey]) dateData[dateKey] = { total: 0, corretas: 0 };
                    dateData[dateKey].total += total;
                    dateData[dateKey].corretas += acertos;
                }
            });

            // INTEGRAÇÃO: PROVAS (TODAS AS BANCAS MAPPED)
            const exams = window.db.get('exams') || [];
            
            exams.forEach(ex => {
                // Remove PAS postfixes for filtering
                let exBanca = ex.banca;
                if(exBanca && exBanca.startsWith('PAS-UNB')) exBanca = 'PAS-UNB';
                
                if(bancaFiltro !== 'ALL' && exBanca !== bancaFiltro) return;
                
                const processArea = (materia, notaVal, maxQtd) => {
                    if (notaVal !== undefined && notaVal !== null && notaVal !== '') {
                        const nota = parseInt(notaVal);
                        if(isNaN(nota)) return;
                        
                        globalTotal += maxQtd;
                        globalCorrects += nota;

                        if (!discData[materia]) discData[materia] = { total: 0, corretas: 0 };
                        discData[materia].total += maxQtd;
                        discData[materia].corretas += nota;

                        if (ex.created_at) {
                            const dateKey = ex.created_at.split('T')[0];
                            if (!dateData[dateKey]) dateData[dateKey] = { total: 0, corretas: 0 };
                            dateData[dateKey].total += maxQtd;
                            dateData[dateKey].corretas += nota;
                        }
                    }
                };

                // Routing By Exam Board
                if(exBanca === 'ENEM' || exBanca === 'SIMULADO') {
                    processArea('Linguagens', ex.notaLin, 45);
                    processArea('Humanas', ex.notaHum, 45);
                    processArea('Natureza', ex.notaNat, 45);
                    processArea('Matemática', ex.notaMat, 45);
                } 
                else if(exBanca === 'UNICAMP') {
                    processArea('Matemática', ex.notaU_Mat, 12);
                    processArea('Linguagens', (parseInt(ex.notaU_Port)||0) + (parseInt(ex.notaU_Ing)||0), 20); // 13 pt + 7 ing
                    processArea('Humanas', ex.notaU_Hum, 23);
                    processArea('Natureza', ex.notaU_Nat, 22);
                }
                else if(exBanca === 'FUVEST') {
                    processArea('Gerais (FUVEST)', ex.notaFuvest, 90);
                }
                else if(exBanca === 'UNESP') {
                    processArea('Gerais (UNESP)', ex.notaUnesp, 90);
                }
                else if(exBanca === 'VEST-UNB') {
                    processArea('Linguagens', ex.notaV_LE, 30); // aprox
                    processArea('Humanas', ex.notaV_Hum, 120);
                    processArea('Ciências e Exatas', ex.notaV_Exa, 150);
                }
                else if(exBanca === 'PAS-UNB') {
                    processArea('Línguas', ex.notaP_LE, 10);
                    processArea('Exatas e Humanas', ex.notaP_ExaHum, 110);
                }
                else if(exBanca === 'UFG') {
                    processArea('Linguagens', ex.notaUFG_Lin, 30);
                    processArea('Natureza', ex.notaUFG_Nat, 30);
                    processArea('Matemática', ex.notaUFG_Mat, 30);
                }
                else if(exBanca === 'UEG') {
                    processArea('Gerais (UEG)', ex.notaUEG, 52);
                }
                else if(exBanca === 'UFT') {
                    processArea('Linguagens', ex.notaUFT_Lin, 24);
                    processArea('Matemática', ex.notaUFT_Mat, 8);
                    processArea('Humanas', ex.notaUFT_Hum, 16);
                    processArea('Natureza', ex.notaUFT_Nat, 16);
                }
            });

            // INTEGRAÇÃO GLOBAL: BANCO DE QUESTÕES AVULSAS
            if(bancaFiltro === 'ALL') {
"""

html = re.sub(r"            entries\.forEach\(e => \{.*?\n            \}\);\n\n            // INTEGRAÇÃO: PROVAS \(ENEM e SIMULADOS\).*?            \}\);\n\n            // INTEGRAÇÃO GLOBAL: BANCO DE QUESTÕES AVULSAS", js_logic, html, flags=re.DOTALL)

with open('metricas_updated.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Metricas regex complete.')
