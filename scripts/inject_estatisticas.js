window.renderizarPaginasAdicionaisA4 = function(espelhoAluno) {
    if (!window.gabaritosArray || !espelhoAluno || !espelhoAluno.questoesCorrigidas) return;

    // 1. Correção de Geopolítica para Geografia
    window.gabaritosArray.forEach(q => {
        if (q.disciplina && (q.disciplina.toUpperCase() === 'GEOPOLÍTICA' || q.disciplina.toUpperCase() === 'GEOPOLITICA')) {
            q.disciplina = 'Geografia';
        }
    });

    // 2. Análise do Escore por Disciplinas (Gráficos)
    let statsD1 = {};
    let statsD2 = {};
    
    window.gabaritosArray.forEach(q => {
        let dia = parseInt(q.questao) <= 90 ? 1 : 2;
        let disciplina = q.disciplina || 'Outros';
        disciplina = disciplina.charAt(0).toUpperCase() + disciplina.slice(1).toLowerCase();
        
        let target = dia === 1 ? statsD1 : statsD2;
        if (!target[disciplina]) {
            target[disciplina] = { acertosAluno: 0, total: 0, acertosTurma: 0, respondidasTurma: 0 };
        }
        target[disciplina].total++;
        
        // Aluno acertou?
        let cq = espelhoAluno.questoesCorrigidas.find(x => x.questao == q.questao);
        if (cq && cq.acerto === 1) {
            target[disciplina].acertosAluno++;
        }
        
        // Turma acertou?
        if (window.espelhosGerados) {
            window.espelhosGerados.forEach(e => {
                let e_cq = e.questoesCorrigidas.find(x => x.questao == q.questao);
                if (e_cq && e_cq.respostaAluno && e_cq.respostaAluno.trim() !== '') {
                    target[disciplina].respondidasTurma++;
                    if (e_cq.acerto === 1) {
                        target[disciplina].acertosTurma++;
                    }
                }
            });
        }
    });

    function renderAnaliseHtml(statsObj) {
        if (Object.keys(statsObj).length === 0) return '';
        let html = `
        <div class="flex w-full">
            <div class="w-[35%] border-r border-slate-300 flex flex-col">
                <div class="flex text-[10px] font-bold bg-teal-600/20 text-[#0B193C] text-center border-b border-slate-300">
                    <div class="flex-1 py-1 border-r border-slate-300">DISCIPLINA</div>
                    <div class="w-12 py-1 border-r border-slate-300">ALUNO</div>
                    <div class="w-12 py-1">MÉDIA</div>
                </div>`;
        
        let maxPercent = 0;
        let discNames = [];
        let alunoPercents = [];
        let turmaPercents = [];
        
        Object.keys(statsObj).forEach((disc, idx) => {
            let s = statsObj[disc];
            let bgClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50';
            let alunoPct = s.total > 0 ? Math.round((s.acertosAluno / s.total) * 100) : 0;
            let turmaPct = s.respondidasTurma > 0 ? Math.round((s.acertosTurma / s.respondidasTurma) * 100) : 0;
            
            discNames.push(disc);
            alunoPercents.push(alunoPct);
            turmaPercents.push(turmaPct);
            if (alunoPct > maxPercent) maxPercent = alunoPct;
            if (turmaPct > maxPercent) maxPercent = turmaPct;
            
            html += `
                <div class="flex text-[11px] font-bold text-center ${bgClass} border-b border-slate-200">
                    <div class="flex-1 py-2 border-r border-slate-200 text-[#0B193C] font-black">${disc}</div>
                    <div class="w-12 py-2 border-r border-slate-200 ${alunoPct >= 50 ? 'bg-amber-100 text-amber-700' : 'text-slate-600'}">${s.acertosAluno}/${s.total}</div>
                    <div class="w-12 py-2 text-slate-500 font-bold">${turmaPct}%</div>
                </div>`;
        });
        
        html += `</div>
            <div class="flex-1 p-4 relative flex flex-col justify-end bg-slate-50/50" style="min-height: 180px;">`;
            
        // Gerar barras
        html += `<div class="flex justify-around items-end h-[120px] w-full border-b border-slate-300 relative">
                 <div class="absolute w-full border-t border-slate-200 top-[25%] -z-10"></div>
                 <div class="absolute w-full border-t border-slate-200 top-[50%] -z-10"></div>
                 <div class="absolute w-full border-t border-slate-200 top-[75%] -z-10"></div>`;
        
        discNames.forEach((disc, i) => {
            let height = alunoPercents[i] > 0 ? Math.max(alunoPercents[i], 5) : 0;
            html += `<div class="flex flex-col items-center justify-end h-full gap-1 z-10 w-8 group">
                <span class="text-[9px] font-bold text-slate-500">${alunoPercents[i]}%</span>
                <div class="w-full bg-[#0B193C] rounded-t-sm transition-all duration-300 shadow-sm" style="height: ${height}%"></div>
                <span class="text-[8px] mt-1 text-slate-500 font-bold truncate w-14 text-center">${disc}</span>
            </div>`;
        });
        
        html += `</div>
                 <div class="flex justify-center items-center gap-4 mt-6">
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-[#0B193C]"></div><span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Aluno</span></div>
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-[#A7F3D0]"></div><span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Média da Turma</span></div>
                 </div>
            </div>
        </div>`;
        return html;
    }
    
    let containerD1 = document.getElementById('container-analise-d1');
    if(containerD1) containerD1.innerHTML = renderAnaliseHtml(statsD1);
    
    let containerD2 = document.getElementById('container-analise-d2');
    if(containerD2) containerD2.innerHTML = renderAnaliseHtml(statsD2);

    function generateMarcaoesTable(dia) {
        let startQ = dia === 1 ? 1 : 91;
        let endQ = dia === 1 ? 90 : 180;
        let html = '';
        
        for (let row = 0; row < 6; row++) {
            let rowStart = startQ + (row * 15);
            if (rowStart > endQ) break;
            
            html += `<div class="border border-slate-300 rounded-lg overflow-hidden shadow-sm mb-4">
                <div class="flex text-[11px] font-bold text-center bg-teal-600/20 text-[#0B193C]">
                    <div class="w-[85px] py-1 border-r border-slate-300 flex items-center justify-center">Questão</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                html += `<div class="flex-1 border-r border-slate-300 py-1 flex items-center justify-center">${qNum}</div>`;
            }
            html += `</div>`;
            
            // Gabarito
            html += `<div class="flex text-[11px] font-bold text-center bg-white border-b border-slate-200">
                    <div class="w-[85px] py-1 border-r border-slate-200 text-slate-700 flex items-center justify-center">Gabarito</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                let q = window.gabaritosArray.find(x => x.questao == qNum);
                let gab = q ? q.resposta : '-';
                if(q && q.anulada) gab = 'ANU.';
                let textClass = gab === 'ANU.' ? 'text-emerald-500 text-[9px]' : '';
                html += `<div class="flex-1 border-r border-slate-200 py-1 flex items-center justify-center ${textClass}">${gab}</div>`;
            }
            html += `</div>`;
            
            // Marcação Aluno
            html += `<div class="flex text-[11px] font-bold text-center bg-[#FDE68A] border-b border-slate-200 text-[#0B193C]">
                    <div class="w-[85px] py-1 border-r border-amber-300 text-slate-700 bg-amber-100 leading-tight flex items-center justify-center">Marcação do Aluno</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                let q = window.gabaritosArray.find(x => x.questao == qNum);
                let gab = q ? q.resposta : '-';
                if(q && q.anulada) gab = 'ANU.';
                
                let cq = espelhoAluno.questoesCorrigidas.find(x => x.questao == qNum);
                let marc = cq && cq.respostaAluno ? cq.respostaAluno : '-';
                
                let color = (cq && cq.acerto === 1) ? 'text-emerald-700' : (marc !== '-' ? 'text-rose-600' : 'text-slate-400');
                html += `<div class="flex-1 border-r border-amber-300 py-1 flex items-center justify-center ${color}">${marc}</div>`;
            }
            html += `</div>`;
            
            // Área / Matéria
            html += `<div class="flex text-[9px] font-bold text-center bg-white">
                    <div class="w-[85px] py-1 border-r border-slate-200 text-slate-700 flex items-center justify-center">Área</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                let q = window.gabaritosArray.find(x => x.questao == qNum);
                let mat = q ? (q.disciplina || q.area || '-').substring(0,6).toUpperCase() : '-';
                html += `<div class="flex-1 border-r border-slate-200 py-1 flex items-center justify-center">${mat}</div>`;
            }
            html += `</div></div>`;
        }
        return html;
    }
    
    function generateEstatisticasTable(dia) {
        let startQ = dia === 1 ? 1 : 91;
        let endQ = dia === 1 ? 90 : 180;
        let html = `<div class="border border-[#0B193C] rounded-lg overflow-hidden shadow-sm mt-4">
            <div class="flex bg-[#0B193C] text-white text-[10px] font-bold text-center">
                <div class="w-8 py-2">Q</div>
                <div class="w-24 py-2 border-l border-slate-600">Material</div>
                <div class="flex-1 py-2 border-l border-slate-600 text-left pl-2">Assunto</div>
                <div class="w-12 py-2 border-l border-slate-600">Nível</div>
                <div class="w-16 py-2 border-l border-slate-600">Acertos</div>
                <div class="w-12 py-2 border-l border-slate-600">%</div>
            </div>`;
            
        for (let qNum = startQ; qNum <= endQ; qNum++) {
            let q = window.gabaritosArray.find(x => x.questao == qNum);
            if (!q) continue;
            
            let mat = q.disciplina || '-';
            let ass = q.assunto || '-';
            let dif = q.dificuldade ? q.dificuldade.substring(0,3).toUpperCase() : '-';
            
            let totalResp = 0;
            let totalAcertos = 0;
            if (window.espelhosGerados) {
                window.espelhosGerados.forEach(e => {
                    let e_cq = e.questoesCorrigidas.find(x => x.questao == qNum);
                    if (e_cq && e_cq.respostaAluno && e_cq.respostaAluno.trim() !== '') {
                        totalResp++;
                        if (e_cq.acerto === 1) {
                            totalAcertos++;
                        }
                    }
                });
            }
            let pct = totalResp > 0 ? Math.round((totalAcertos / totalResp) * 100) : 0;
            
            let bgClass = qNum % 2 === 0 ? 'bg-slate-50' : 'bg-white';
            let pctColor = pct < 30 ? 'text-rose-600' : (pct > 70 ? 'text-emerald-600' : 'text-teal-600');
            
            html += `<div class="flex text-[10px] text-center ${bgClass} border-b border-slate-200 py-1">
                <div class="w-8 font-bold text-[#0B193C]">${qNum}</div>
                <div class="w-24 border-l border-slate-200 text-slate-600 truncate px-1">${mat}</div>
                <div class="flex-1 border-l border-slate-200 text-left pl-2 text-slate-500 truncate pr-2" title="${ass}">${ass}</div>
                <div class="w-12 border-l border-slate-200 text-slate-500">${dif}</div>
                <div class="w-16 border-l border-slate-200 text-slate-600">${totalAcertos}/${totalResp}</div>
                <div class="w-12 border-l border-slate-200 font-bold ${pctColor}">${pct}%</div>
            </div>`;
        }
        html += `</div>`;
        return html;
    }

    let panelBoletim = document.getElementById('panel-boletim');
    if (!panelBoletim) return;
    let pagesWrapper = panelBoletim.querySelector('.flex.flex-col.items-center') || panelBoletim;
    
    // Remove existing pag2, pag3 etc so we can rebuild cleanly
    let existingPages = Array.from(pagesWrapper.querySelectorAll('.print-page'));
    existingPages.forEach((p, i) => {
        if(p.id !== 'pdf-espelho-pag1') p.remove();
    });

    function buildPage(id, title, contentHtml, pageNum) {
        let div = document.createElement('div');
        div.id = id;
        div.className = "bg-white shadow-2xl relative shrink-0 flex flex-col mb-8 print-page";
        div.style.cssText = "width: 794px; min-height: 1123px; font-family: 'Inter', sans-serif;";
        div.innerHTML = `
            <div class="bg-[#0B193C] text-white py-4 px-10 flex justify-center items-center rounded-t-lg">
                <h2 class="text-lg font-black uppercase tracking-widest">${title}</h2>
            </div>
            <div class="px-10 py-6 flex-1 flex flex-col">
                ${contentHtml}
            </div>
            <div class="mt-auto w-full p-4 border-t border-slate-200 bg-white flex justify-between items-center text-[9px] text-slate-400 font-medium rounded-b-lg">
                <div>NEXUS PROVAS | Tecnologia de Avaliação Educacional</div>
                <div>Página ${pageNum} de 5</div>
            </div>`;
        return div;
    }

    let pag2 = buildPage('pdf-espelho-pag2', 'Espelho de Marcações - 1º Dia', generateMarcaoesTable(1), 2);
    let pag3 = buildPage('pdf-espelho-pag3', 'Espelho de Marcações - 2º Dia', generateMarcaoesTable(2), 3);
    let pag4 = buildPage('pdf-espelho-pag4', 'Estatísticas da Turma - 1º Dia', generateEstatisticasTable(1), 4);
    let pag5 = buildPage('pdf-espelho-pag5', 'Estatísticas da Turma - 2º Dia', generateEstatisticasTable(2), 5);

    pagesWrapper.appendChild(pag2);
    pagesWrapper.appendChild(pag3);
    pagesWrapper.appendChild(pag4);
    pagesWrapper.appendChild(pag5);
};
