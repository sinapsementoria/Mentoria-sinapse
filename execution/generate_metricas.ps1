$html = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mentoria Sinapse - Meu Desempenho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        sinapse: { blue: '#0B193C', primary: '#6366F1', accent: '#10B981', light: '#FAFAFB'}
                    },
                    fontFamily: { sans: ['Inter', 'sans-serif'], headline: ['Manrope', 'sans-serif'] },
                    boxShadow: { 'premium': '0 10px 40px -10px rgba(11,25,60,0.06)' }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <style>
        .font-headline { font-family: 'Manrope', sans-serif; }
        body { font-family: 'Inter', sans-serif; background-color: #FAFAFB; color: #1E293B; }
        .glass-panel { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,1); }
        .icon-fill { font-variation-settings: 'FILL' 1; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
    </style>
    <script src="database.js"></script>
</head>
<body class="flex h-screen overflow-hidden text-slate-800 antialiased selection:bg-sinapse-primary selection:text-white">

    <!-- SIDEBAR ELITE -->
    <aside class="w-[280px] bg-white border-r border-[#F1F5F9] flex flex-col z-30 flex-shrink-0 relative shadow-[2px_0_24px_rgba(0,0,0,0.02)] hidden md:flex">
        <div class="h-24 flex items-center px-8 border-b border-slate-50/50">
            <span class="material-symbols-outlined text-[#0B193C] text-[32px] mr-3 icon-fill">neurology</span>
            <span class="font-headline font-extrabold text-[19px] text-[#0B193C] tracking-tight">MENTORIA <span class="font-light opacity-70">SINAPSE</span></span>
        </div>
        
        <nav class="flex-1 overflow-y-auto py-8 px-6 space-y-2">
            <p class="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-4 pl-3">Acompanhamento</p>
            <a href="mentoria.html" class="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group">
                <span class="material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity">home</span> Metas Diárias
            </a>
            <a href="metricas.html" class="flex items-center gap-4 px-4 py-3 bg-[#0B193C] text-white rounded-xl font-semibold shadow-lg shadow-[#0B193C]/20 transition-all hover:scale-[1.02]">
                <span class="material-symbols-outlined icon-fill opacity-90 text-[22px]">trending_up</span> Meu Desempenho
            </a>
            <a href="provas.html" class="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group">
                <span class="material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity">history_edu</span> Revisões Estratégicas
            </a>
            <a href="calendario.html" class="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group">
                <span class="material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity">calendar_month</span> Calendário
            </a>
            <a href="simulador.html" class="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group">
                <span class="material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity">calculate</span> Simulador SISU
            </a>
            <a href="banco-questoes.html" class="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group">
                <span class="material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity">checklist</span> Banco de Questões
            </a>
        </nav>
    </aside>

    <main class="flex-1 flex flex-col h-full bg-[#FAFAFB] relative overflow-y-auto">
        
        <!-- Header -->
        <header class="h-24 bg-white/70 backdrop-blur-xl border-b border-white/50 px-10 flex items-center justify-between sticky top-0 z-20">
            <nav class="flex text-[11px] font-semibold text-slate-400 uppercase tracking-widest space-x-3 items-center">
                <a href="plataforma.html" class="hover:text-[#0B193C] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">arrow_back</span> Hub Institucional</a>
                <span class="opacity-40">|</span><span class="text-sinapse-primary">Dashboard de Performance</span>
            </nav>
        </header>

        <div class="p-10 max-w-[1500px] mx-auto w-full space-y-10 relative z-10 pb-20 fade-in-up">
            
            <!-- Hero Superior -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
                <div>
                    <div class="w-12 h-12 bg-[#0B193C] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0B193C]/20 mb-4 mix-blend-multiply">
                        <span class="material-symbols-outlined text-[28px] icon-fill">query_stats</span>
                    </div>
                    <h1 class="font-headline text-4xl font-extrabold text-[#0B193C] tracking-tight">Meu Desempenho</h1>
                    <p class="text-slate-500 font-medium mt-2 max-w-2xl text-[15px] leading-relaxed">
                        Acompanhe sua evolução, identifique seus pontos fortes e corrija suas fragilidades com precisão clínica.
                    </p>
                </div>
                
                <button onclick="abrirModalAtividade()" class="bg-gradient-to-r from-sinapse-primary to-indigo-600 hover:shadow-lg hover:shadow-sinapse-primary/30 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 text-[14px] uppercase tracking-wide group shrink-0 active:scale-95">
                    <span class="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add_circle</span>
                    Lançar Nova Atividade
                </button>
            </div>

            <!-- Panorama Geral (Cards Elite) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform group relative overflow-hidden">
                    <div class="absolute -right-6 -top-6 text-slate-50 opacity-50 material-symbols-outlined text-[120px] pointer-events-none group-hover:scale-110 transition-transform">functions</div>
                    <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1 relative z-10">Total de Questões</p>
                    <h3 class="text-[44px] font-headline font-extrabold text-[#0B193C] leading-none tracking-tight relative z-10" id="kpiTotalQ">0</h3>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform group relative overflow-hidden">
                    <div class="absolute -right-6 -top-6 text-emerald-50 opacity-40 material-symbols-outlined text-[120px] pointer-events-none group-hover:scale-110 transition-transform">check_circle</div>
                    <p class="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mb-1 relative z-10">Total de Acertos</p>
                    <h3 class="text-[44px] font-headline font-extrabold text-emerald-600 leading-none tracking-tight relative z-10" id="kpiTotalA">0</h3>
                </div>

                <div class="bg-gradient-to-br from-[#0B193C] to-[#1a2b5e] rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(11,25,60,0.3)] hover:-translate-y-1 transition-transform group relative overflow-hidden">
                    <div class="absolute -right-6 -top-6 text-white opacity-[0.03] material-symbols-outlined text-[120px] pointer-events-none group-hover:scale-110 transition-transform">percent</div>
                    <p class="text-[10px] text-blue-200 font-extrabold uppercase tracking-widest mb-1 relative z-10">Percentual Geral</p>
                    <div class="flex items-baseline gap-1 relative z-10">
                        <h3 class="text-[44px] font-headline font-extrabold text-white leading-none tracking-tight" id="kpiPercent">0.0</h3>
                        <span class="text-2xl text-white/50 font-medium">%</span>
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform group relative overflow-hidden">
                    <div class="absolute -right-6 -top-6 text-slate-50 opacity-50 material-symbols-outlined text-[120px] pointer-events-none group-hover:scale-110 transition-transform">history_edu</div>
                    <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1 relative z-10">Atividades Registradas</p>
                    <h3 class="text-[44px] font-headline font-extrabold text-[#0B193C] leading-none tracking-tight relative z-10" id="kpiActivities">0</h3>
                </div>
            </div>

            <!-- Insights Automáticos Stratégicos -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" id="insightsContainer">
                <!-- Injetados por JS -->
            </div>

            <!-- Seção Analítica: Gráficos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- Desempenho por Disciplina -->
                <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium flex flex-col">
                    <h2 class="font-headline text-2xl font-extrabold text-[#0B193C] mb-2">Aproveitamento (%) por Disciplina</h2>
                    <p class="text-[13px] text-slate-500 font-medium mb-8">Taxa de acerto global separada por matéria</p>
                    <div class="flex-1 w-full min-h-[300px] relative">
                        <canvas id="chartDisciplines"></canvas>
                    </div>
                </div>

                <!-- Evolução ao longo do tempo -->
                <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium flex flex-col">
                    <h2 class="font-headline text-2xl font-extrabold text-[#0B193C] mb-2">Evolução de Acertos no Tempo</h2>
                    <p class="text-[13px] text-slate-500 font-medium mb-8">Tendência visual da taxa de acerto nas últimas atividades</p>
                    <div class="flex-1 w-full min-h-[300px] relative">
                        <canvas id="chartEvolution"></canvas>
                    </div>
                </div>
            </div>

            <!-- Melhores e Piores Disciplinas -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- Top 3 -->
                <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium">
                    <h2 class="font-headline text-xl font-extrabold text-[#0B193C] mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-emerald-500 icon-fill">arrow_upward</span>
                        Melhores Disciplinas
                    </h2>
                    <div class="space-y-4" id="topDisciplinesContainer">
                       <!-- JS -->
                    </div>
                </div>
                <!-- Bottom 3 -->
                <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium">
                    <h2 class="font-headline text-xl font-extrabold text-[#0B193C] mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-rose-500 icon-fill">arrow_downward</span>
                        Atenção Prioritária
                    </h2>
                    <div class="space-y-4" id="bottomDisciplinesContainer">
                        <!-- JS -->
                    </div>
                </div>
            </div>

            <!-- PERFORMANCE POR ASSUNTO -->
            <div class="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-premium relative">
                <div class="p-8 border-b border-slate-50 bg-white/50 backdrop-blur-md sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 class="font-headline text-2xl font-extrabold text-[#0B193C]">Performance por Assunto</h2>
                        <p class="text-[13px] text-slate-500 font-medium mt-1">Nível de domínio nos tópicos estudados</p>
                    </div>
                    <div class="flex gap-2">
                        <span class="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded uppercase">Excelente (+90)</span>
                        <span class="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase">Bom (80-89)</span>
                        <span class="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded uppercase">Atenção (70-79)</span>
                        <span class="text-[9px] font-extrabold text-rose-700 bg-rose-50 px-2 py-1 rounded uppercase">Revisar (<70)</span>
                    </div>
                </div>
                <div class="overflow-x-auto w-full">
                    <table class="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                        <thead>
                            <tr class="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <th class="py-4 px-8 font-bold">Disciplina</th>
                                <th class="py-4 px-8 font-bold w-1/3">Conteúdo / Assunto</th>
                                <th class="py-4 px-8 font-bold text-center">Questões</th>
                                <th class="py-4 px-8 font-bold text-center">Acertos</th>
                                <th class="py-4 px-8 font-bold text-right">Taxa de Acerto</th>
                            </tr>
                        </thead>
                        <tbody class="text-[14px]" id="subjectPerformanceTable">
                            <!-- JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Histórico Recente -->
            <div class="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-premium mt-10">
                 <div class="p-8 border-b border-slate-50">
                    <h2 class="font-headline text-xl font-extrabold text-[#0B193C]">Atividades Recentes</h2>
                    <p class="text-[13px] text-slate-500 font-medium mt-1">Últimos registros computados na plataforma</p>
                </div>
                <div class="overflow-x-auto w-full">
                    <table class="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr class="text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th class="py-4 px-8 font-bold">Data</th>
                                <th class="py-4 px-8 font-bold">Matéria & Assunto</th>
                                <th class="py-4 px-8 font-bold text-center">Desempenho</th>
                                <th class="py-4 px-8 font-bold text-right">Percentual</th>
                            </tr>
                        </thead>
                        <tbody id="recentHistoryTable" class="text-[13px]">
                            <!-- JS -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="h-10"></div>
        </div>
    </main>

    <!-- MODAL DE LANÇAMENTO -->
    <div id="modalAtividade" class="fixed inset-0 z-50 hidden opacity-0 transition-opacity duration-300">
        <div class="absolute inset-0 bg-[#0B193C]/40 backdrop-blur-sm" onclick="fecharModalAtividade()"></div>
        
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col" id="modalAtividadeContent" style="max-height: 90vh;">
            
            <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
                <h3 class="font-headline text-xl font-extrabold text-[#0B193C] flex items-center gap-3">
                    <span class="material-symbols-outlined text-sinapse-primary icon-fill">assignment_add</span>
                    Registrar Atividade
                </h3>
                <button onclick="fecharModalAtividade()" class="text-slate-400 hover:text-rose-500 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <form id="formAtividade" class="p-8 space-y-6 overflow-y-auto" onsubmit="event.preventDefault(); handleSaveActivity(event)">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Matéria</label>
                        <select id="modalMat" required class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-medium appearance-none">
                            <option value="Biologia">Biologia</option>
                            <option value="Física">Física</option>
                            <option value="Matemática">Matemática</option>
                            <option value="Química">Química</option>
                            <option value="História">História</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Linguagens">Linguagens</option>
                            <option value="Redação">Redação</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Assunto</label>
                        <input id="modalAss" required type="text" placeholder="Ex: Citologia" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-medium placeholder:text-slate-400">
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Data Base</label>
                    <input id="modalData" required type="date" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-medium">
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block relative">Total de Questões</label>
                        <input id="modalTot" required type="number" min="1" placeholder="Ex: 30" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-bold text-lg text-center">
                    </div>
                    <div class="space-y-2">
                        <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block text-emerald-600">Total de Acertos</label>
                        <input id="modalCert" required type="number" min="0" placeholder="Ex: 25" class="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-bold text-lg text-center placeholder:text-emerald-300">
                    </div>
                </div>
                
                <div id="modalError" class="text-rose-500 text-xs font-bold hidden text-center">Os acertos não podem ultrapassar o total de questões.</div>

                <div class="pt-4 mt-8 border-t border-slate-100 flex justify-end">
                    <button type="submit" class="bg-[#0B193C] hover:bg-[#112350] text-white px-8 py-3.5 rounded-xl font-bold shadow-premium-hover transition-all text-[13px] uppercase tracking-wider w-full md:w-auto">
                        Salvar Registro
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- LOGIC SCRIPT INTEGRATION -->
    <script>
        // Set today on date picker
        document.getElementById('modalData').valueAsDate = new Date();

        function abrirModalAtividade() {
            const modal = document.getElementById('modalAtividade');
            const content = document.getElementById('modalAtividadeContent');
            document.getElementById('modalError').classList.add('hidden');
            modal.classList.remove('hidden');
            
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95');
            }, 10);
        }

        function fecharModalAtividade() {
            const modal = document.getElementById('modalAtividade');
            const content = document.getElementById('modalAtividadeContent');
            
            modal.classList.add('opacity-0');
            content.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        function handleSaveActivity(e) {
            const mat = document.getElementById('modalMat').value;
            const ass = document.getElementById('modalAss').value;
            const data = document.getElementById('modalData').value;
            const tot = parseInt(document.getElementById('modalTot').value) || 0;
            const cert = parseInt(document.getElementById('modalCert').value) || 0;

            if (tot === 0) return alert("Insira pelo menos 1 questão.");
            if (cert > tot) {
                document.getElementById('modalError').classList.remove('hidden');
                return;
            }

            const perc = (cert / tot) * 100;

            // Using window.db provided by database.js
            window.db.insert('metrics_entries', {
                user_id: 1,
                discipline: mat,
                subject: ass,
                created_at: data, // overriding standard ISO
                questions_total: tot,
                correct_answers: cert,
                wrong_answers: tot - cert,
                accuracy_percentage: perc,
                study_time_minutes: 0 // Default 0 for this simplified entry
            });

            document.getElementById('formAtividade').reset();
            document.getElementById('modalData').valueAsDate = new Date();
            fecharModalAtividade();
            
            // Re-render whole dashboard!
            processAndRenderDashboard();
        }

        // Global Chart instances to destroy before rendering again
        let chartDiscInstance = null;
        let chartEvolInstance = null;

        function processAndRenderDashboard() {
            const entries = window.db.get('metrics_entries') || [];
            
            // KPI Variables
            let globalTotal = 0;
            let globalCorrects = 0;
            
            // Discipline Aggregation
            let discData = {};
            let subjectData = {};
            
            // Evolution Aggregation (by date)
            let dateData = {};

            entries.forEach(e => {
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
                const dateKey = e.created_at.split('T')[0]; 
                if (!dateData[dateKey]) dateData[dateKey] = { total: 0, corretas: 0 };
                dateData[dateKey].total += total;
                dateData[dateKey].corretas += acertos;
            });

            // UPDATE KPIs
            document.getElementById('kpiTotalQ').innerText = globalTotal.toLocaleString();
            document.getElementById('kpiTotalA').innerText = globalCorrects.toLocaleString();
            document.getElementById('kpiPercent').innerText = globalTotal > 0 ? ((globalCorrects/globalTotal)*100).toFixed(1) : "0.0";
            document.getElementById('kpiActivities').innerText = entries.length.toLocaleString();

            // Discipline Stats (Array)
            let discArr = [];
            for (let d in discData) {
                if (discData[d].total > 0) {
                    discArr.push({
                        name: d,
                        total: discData[d].total,
                        acertos: discData[d].corretas,
                        perc: (discData[d].corretas / discData[d].total) * 100
                    });
                }
            }
            // Sort Descending by perc
            discArr.sort((a,b) => b.perc - a.perc);

            // INSIGHTS AUTOMÁTICOS
            const insightsC = document.getElementById('insightsContainer');
            insightsC.innerHTML = '';
            
            const createInsight = (ico, color, title, desc) => {
                return `<div class="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: \${color}20; color: \${color};">
                        <span class="material-symbols-outlined text-[20px] icon-fill">\${ico}</span>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-extrabold uppercase tracking-widest text-[#0B193C] mb-0.5">\${title}</h4>
                        <p class="text-xs font-semibold text-slate-500 leading-snug">\${desc}</p>
                    </div>
                </div>`;
            };

            if (discArr.length > 0) {
                const best = discArr[0];
                const worst = discArr[discArr.length - 1]; // can be tricky if they are all 100%
                insightsC.innerHTML += createInsight('lightbulb', '#6366F1', 'Seu Domínio Ouro', `Seu melhor desempenho atual está em <b>\${best.name}</b> (\${best.perc.toFixed(1)}%).`);
                if(worst.perc < 70) {
                     insightsC.innerHTML += createInsight('warning', '#F43F5E', 'Alerta Estratégico', `Atenção: <b>\${worst.name}</b> exige reforço imediato devido ao aproveitamento baixo (\${worst.perc.toFixed(1)}%).`);
                } else if(worst.name !== best.name) {
                     insightsC.innerHTML += createInsight('info', '#3B82F6', 'Constância', `O desempenho base em <b>\${worst.name}</b> está seguro, mas pode crescer.`);
                }
            } else {
                 insightsC.innerHTML = `<div class="col-span-full p-4 bg-slate-50 rounded-xl text-center text-sm font-medium text-slate-400">Registre atividades para visualizar inteligência artificial avançada.</div>`;
            }

            // TOP 3 & BOTTOM 3 
            const topC = document.getElementById('topDisciplinesContainer');
            const botC = document.getElementById('bottomDisciplinesContainer');
            topC.innerHTML = ''; botC.innerHTML = '';

            const createDiscRow = (item, colorClass) => {
                return `<div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span class="font-bold text-[#0B193C]">\${item.name}</span>
                    <div class="flex items-center gap-5">
                        <div class="text-right">
                            <p class="text-[10px] font-extrabold text-slate-400 uppercase">Acertos</p>
                            <p class="text-xs font-bold">\${item.acertos}/\${item.total}</p>
                        </div>
                        <span class="text-sm font-extrabold \${colorClass} bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">\${item.perc.toFixed(1)}%</span>
                    </div>
                </div>`;
            };

            const tops = discArr.slice(0, 3);
            const bots = [...discArr].reverse().slice(0, 3).filter(x => !tops.find(t=>t.name === x.name) || discArr.length < 2);
            
            tops.forEach(t => topC.innerHTML += createDiscRow(t, 'text-emerald-600'));
            if(bots.length > 0) bots.forEach(b => botC.innerHTML += createDiscRow(b, 'text-rose-600'));
            else botC.innerHTML = '<p class="text-sm text-slate-400 font-medium">Não há matérias críticas mapeadas.</p>';

            // SUBJECT PERFORMANCE
            let subArr = [];
            for (let k in subjectData) {
                if (subjectData[k].total > 0) {
                    subArr.push({
                        ...subjectData[k],
                        perc: (subjectData[k].corretas / subjectData[k].total) * 100
                    });
                }
            }
            subArr.sort((a,b) => b.perc - a.perc);
            
            const subTB = document.getElementById('subjectPerformanceTable');
            subTB.innerHTML = '';
            
            subArr.forEach(s => {
                let badge = '';
                if(s.perc >= 90) badge = '<span class="text-[10px] font-extrabold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md uppercase border border-emerald-100">Excelente</span>';
                else if(s.perc >= 80) badge = '<span class="text-[10px] font-extrabold px-3 py-1 bg-blue-50 text-blue-700 rounded-md uppercase border border-blue-100">Bom</span>';
                else if(s.perc >= 70) badge = '<span class="text-[10px] font-extrabold px-3 py-1 bg-amber-50 text-amber-700 rounded-md uppercase border border-amber-100">Atenção</span>';
                else badge = '<span class="text-[10px] font-extrabold px-3 py-1 bg-rose-50 text-rose-700 rounded-md uppercase border border-rose-100">Revisar</span>';

                subTB.innerHTML += `
                <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td class="py-4 px-8 font-extrabold text-[#0B193C]">\${s.discipline}</td>
                    <td class="py-4 px-8 font-semibold text-slate-500">\${s.subject}</td>
                    <td class="py-4 px-8 font-bold text-center text-slate-600">\${s.total}</td>
                    <td class="py-4 px-8 font-bold text-center text-emerald-600">\${s.corretas}</td>
                    <td class="py-4 px-8 text-right">
                        <div class="flex items-center justify-end gap-3">
                            <span class="font-headline font-extrabold">\${s.perc.toFixed(1)}%</span>
                            \${badge}
                        </div>
                    </td>
                </tr>`;
            });

            // RECENT HISTORY (Last 5)
            const recTB = document.getElementById('recentHistoryTable');
            recTB.innerHTML = '';
            const recent = [...entries].reverse().slice(0, 10); // get last 10
            
            recent.forEach(r => {
                const dateParts = r.created_at.split('T')[0].split('-');
                const fmtDate = dateParts.length === 3 ? \`\${dateParts[2]}/\${dateParts[1]}\` : r.created_at;
                const perc = r.questions_total > 0 ? ((r.correct_answers / r.questions_total)*100).toFixed(1) : "0.0";
                
                recTB.innerHTML += `
                <tr class="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td class="py-4 px-8 text-xs font-bold text-slate-400">\${fmtDate}</td>
                    <td class="py-4 px-8">
                        <span class="block font-bold text-[#0B193C] text-[13px]">\${r.discipline}</span>
                        <span class="block text-xs text-slate-400 font-medium">\${r.subject}</span>
                    </td>
                    <td class="py-4 px-8 text-center text-[13px] font-semibold text-slate-500">
                        \${r.correct_answers} / \${r.questions_total} 
                    </td>
                    <td class="py-4 px-8 text-right">
                        <span class="text-sm font-extrabold text-slate-700 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm w-16 inline-block text-center">\${perc}%</span>
                    </td>
                </tr>`;
            });


            // CHARTS SECTION
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = "#94A3B8";

            // Bar Chart (Disciplinas)
            const labelsDisc = discArr.map(d => d.name);
            const dataDisc = discArr.map(d => parseFloat(d.perc.toFixed(1)));
            
            if(chartDiscInstance) chartDiscInstance.destroy();
            const ctxDisc = document.getElementById('chartDisciplines').getContext('2d');
            chartDiscInstance = new Chart(ctxDisc, {
                type: 'bar',
                data: {
                    labels: labelsDisc.length ? labelsDisc : ['Nenhum dado'],
                    datasets: [{
                        label: 'Taxa de Acerto (%)',
                        data: dataDisc.length ? dataDisc : [0],
                        backgroundColor: '#6366F1',
                        borderRadius: 6,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { borderDash: [4,4], color: '#F1F5F9' } },
                        x: { grid: { display: false } }
                    }
                }
            });

            // Line Chart (Evolução)
            // Sort dates chronologically
            const sortedDates = Object.keys(dateData).sort();
            const evoLabels = sortedDates.map(d => {
                const p = d.split('-');
                return p.length===3 ? \`\${p[2]}/\${p[1]}\` : d;
            });
            const evoPercents = sortedDates.map(d => {
                const obj = dateData[d];
                return parseFloat(((obj.corretas / obj.total) * 100).toFixed(1));
            });

            if(chartEvolInstance) chartEvolInstance.destroy();
            const ctxEvol = document.getElementById('chartEvolution').getContext('2d');
            chartEvolInstance = new Chart(ctxEvol, {
                type: 'line',
                data: {
                    labels: evoLabels.length ? evoLabels : ['S1', 'S2', 'S3'],
                    datasets: [{
                        label: 'Acertos Diários (%)',
                        data: evoPercents.length ? evoPercents : [0,0,0],
                        borderColor: '#0B193C',
                        backgroundColor: 'rgba(11, 25, 60, 0.05)',
                        tension: 0.4,
                        borderWidth: 3,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#0B193C',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display:false } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { borderDash:[4,4], color:'#F1F5F9' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        // INIT
        document.addEventListener('DOMContentLoaded', processAndRenderDashboard);

    </script>
</body>
</html>
"@

$file = "$pwd\metricas.html"

# Escrever de forma pura para não quebrar UTF-8
[System.IO.File]::WriteAllText($file, $html, [System.Text.Encoding]::UTF8)
Write-Output "Layout inserido."
