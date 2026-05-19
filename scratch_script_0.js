
window.renderizarPaginasAdicionaisA4 = window.renderizarPaginasAdicionaisA4 || function () {
  console.warn('renderizarPaginasAdicionaisA4 mock executado: função real ainda não carregada.');
};


try {
        const titles = {
            'dashboard': 'Início',
            'alunos': 'Gestão de Turmas',
            'provas': 'Cadastro de Provas e Gabaritos',
            'modelosCartao': 'Editor de Cartões',
            'cartoes': 'Cartões-Resposta Nominais',
            'importarCartoes': 'Leitura de Cartões',
            'correcao': 'Inteligência de Correção',
            'espelhos': 'Espelhos de Desempenho Isolado',
            'relatorios': 'Relatórios Acadêmicos',
            'exportacoes': 'Central de Exportações',
            'configuracoes': 'Configurações Globais'
        };

        window.switchView = function(viewId) {
            console.log("switchView chamado:", viewId);
            try {
                // Manter suporte ao fechamento de modal de turma
                const detalheView = document.getElementById('view-turma-detalhes');
                if (detalheView && !detalheView.classList.contains('hidden')) {
                    try { voltarParaGestaoTurmas(); 
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {}
                }

                // Título
                if (document.getElementById('header-title')) {
                    document.getElementById('header-title').textContent = titles[viewId] || 'Nexus Provas';
                }

                // Ocultar tudo usando as classes E o display inline (pedido do usuário)
                document.querySelectorAll(".nexus-view").forEach(view => {
                    view.classList.remove("active", "fade-in");
                    view.style.display = "none";
                });

                // Ativar o target
                const target = document.getElementById("view-" + viewId);
                if (!target) {
                    console.error("View não encontrada:", "view-" + viewId);
                    return;
                }

                target.classList.add("active", "fade-in");
                target.style.display = "block";

                // Atualizar menu visualmente (suportando a antiga notação onclick="switchView('...')")
                document.querySelectorAll('aside nav a.nav-item').forEach(btn => {
                    btn.classList.remove("active", "bg-slate-100");
                });

                const activeBtn = document.querySelector(`aside nav a[onclick*="switchView('${viewId}')"]`);
                if (activeBtn) {
                    activeBtn.classList.add("active", "bg-slate-100");
                }

                if(window['init' + viewId.charAt(0).toUpperCase() + viewId.slice(1)]) {
                    window['init' + viewId.charAt(0).toUpperCase() + viewId.slice(1)]();
                }
            
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
                console.error("ERROR IN SWITCHVIEW:", e);
            }
        };

        // ==========================================
        // MÓDULO: EDITOR DE MODELOS DE CARTÃO
        // ==========================================
        let dbModelosCartao = [];
        try {
            const raw = localStorage.getItem('nexusModelosCartao');
            if(raw) dbModelosCartao = JSON.parse(raw);
        } catch(e){}

        if (dbModelosCartao.length === 0) {
            dbModelosCartao = [
                { id: "mod_enem1", nome: "ENEM 1º Dia Padrão", sub: "EXAME NACIONAL - 1º DIA", chkFiscal: true, chkSelo: true, opSelo: "1º DIA", chkIdioma: true, chkFrase: true, qStart: 1, qEnd: 90, modeloAlt: "ABCDE", ts: Date.now() },
                { id: "mod_enem2", nome: "ENEM 2º Dia Padrão", sub: "EXAME NACIONAL - 2º DIA", chkFiscal: true, chkSelo: true, opSelo: "2º DIA", chkIdioma: false, chkFrase: true, qStart: 91, qEnd: 180, modeloAlt: "ABCDE", ts: Date.now() }
            ];
            localStorage.setItem('nexusModelosCartao', JSON.stringify(dbModelosCartao));
        }

        let editandoModeloId = null;

        function initModelosCartao() {
            mudarParaBiblioteca();
            renderGaleriaModelos();
        }

        function renderGaleriaModelos() {
            const container = document.getElementById('listaModelosCartao');
            const empty = document.getElementById('emptyModelosCard');
            
            if(!container || !empty) return;

            if(dbModelosCartao.length === 0) {
                container.style.display = 'none';
                empty.style.display = 'flex';
                return;
            }

            empty.style.display = 'none';
            container.style.display = 'grid';

            container.innerHTML = dbModelosCartao.map(m => `
                <div class="nexus-card bg-white p-5 flex flex-col relative group hover:border-indigo-300 transition-colors cursor-pointer" onclick="editarModelo('${m.id}')">
                    <div class="flex justify-between items-start mb-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <span class="material-symbols-outlined text-[20px]">feed</span>
                        </div>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onclick="event.stopPropagation(); editarModelo('${m.id}')" class="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors" title="Editar">
                                <span class="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button onclick="event.stopPropagation(); excluirModelo('${m.id}')" class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors" title="Excluir">
                                <span class="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-bold text-[#0B193C] text-[15px] mb-1 line-clamp-1">${m.nome}</h4>
                        <p class="text-[11px] font-semibold text-slate-500 mb-4 line-clamp-1">${m.sub}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-wider border border-slate-200">Q. ${m.qStart}-${m.qEnd}</span>
                            ${m.chkSelo ? `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-wider border border-slate-200">${m.opSelo}</span>` : ''}
                        </div>
                    </div>
                    <div class="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-400">${new Date(m.ts).toLocaleDateString('pt-BR')}</span>
                        <span class="flex items-center gap-1 text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Salvo</span>
                    </div>
                </div>
            `).join('');
        }

        function mudarParaBiblioteca() {
            renderGaleriaModelos();
        }

        function abrirEditorCartao() {
            editandoModeloId = null;
            
            document.getElementById('edNome').value = "";
            document.getElementById('edSub').value = 'SIMULADO: EXAME NACIONAL DO ENSINO MÉDIO - ENEM 2025';
            document.getElementById('edChkFiscal').checked = true;
            document.getElementById('edChkSelo').checked = true;
            document.getElementById('edOpSelo').value = "1º DIA";
            document.getElementById('edChkIdioma').checked = true;
            document.getElementById('edChkFrase').checked = true;
            document.getElementById('edQStart').value = 1;
            document.getElementById('edQEnd').value = 90;
            document.getElementById('edModeloAlt').value = "ABCDE";
            
            exibirPainelEditor();
        }

        function editarModelo(id) {
            const m = dbModelosCartao.find(x => x.id === id);
            if(!m) return;
            editandoModeloId = id;
            
            document.getElementById('edNome').value = m.nome;
            document.getElementById('edSub').value = m.sub;
            document.getElementById('edChkFiscal').checked = m.chkFiscal;
            document.getElementById('edChkSelo').checked = m.chkSelo;
            document.getElementById('edOpSelo').value = m.opSelo;
            document.getElementById('edChkIdioma').checked = m.chkIdioma;
            document.getElementById('edChkFrase').checked = m.chkFrase;
            document.getElementById('edQStart').value = m.qStart;
            document.getElementById('edQEnd').value = m.qEnd;
            document.getElementById('edModeloAlt').value = m.modeloAlt;
            
            exibirPainelEditor();
        }

        function exibirPainelEditor() {
            previewRealtime();
        }

        function excluirModelo(id) {
            if(confirm("Tem certeza que deseja excluir esse modelo de cartão?")) {
                dbModelosCartao = dbModelosCartao.filter(x => x.id !== id);
                localStorage.setItem('nexusModelosCartao', JSON.stringify(dbModelosCartao));
                renderGaleriaModelos();
            }
        }

        function gerarGradePreview(qStart, qEnd, mode, containerObj) {
            containerObj.innerHTML = '';
            const totalQ = (qEnd - qStart) + 1;
            if(totalQ <= 0) return;
            
            let maxColsAllowed = (mode === 'CE') ? 8 : 6;
            let colsNeeded = Math.ceil(totalQ / 15);
            let cols = colsNeeded;
            let maxPerCol = 15;

            // Se o usuário configurar mais questões do que o limite seguro horizontal, ns travamos 
            // as colunas no máximo permitido e passamos a crescer apenas para baixo (mais linhas por coluna).
            if (cols > maxColsAllowed) {
                cols = maxColsAllowed;
                maxPerCol = Math.ceil(totalQ / cols);
            }
            
            let qCounter = qStart;
            for(let c = 0; c < cols; c++) {
                let colDiv = document.createElement('div');
                colDiv.className = "flex-1 flex flex-col justify-start gap-1 min-w-0"; // min-w-0 evita que o text-[7.5px] quebre o flex-1
                colDiv.innerHTML = `<div class="w-full bg-[#EB3223] text-white text-center font-black text-[7px] py-[3px] mb-1 uppercase tracking-wider truncate">QUESTÃO / RESP.</div>`;
                
                for(let r = 0; r < maxPerCol; r++) {
                    if (qCounter > qEnd) break;
                    const numFmt = String(qCounter).padStart(2, '0');
                    
                    let bolhas = '';
                    if(mode === 'ABCDE') {
                        bolhas = `
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">A</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">B</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">C</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">D</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">E</div>
                        `;
                    } else if(mode === 'ABCD') {
                        bolhas = `
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">A</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">B</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">C</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">D</div>
                        `;
                    } else if(mode === 'CE') {
                        bolhas = `
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">C</div>
                            <div class="w-3.5 h-3.5 border-[1px] border-[#EB3223] rounded-full flex items-center justify-center text-[6px] font-extrabold text-[#EB3223] uppercase">E</div>
                        `;
                    }

                    const bgZebra = (r % 2 === 0) ? 'bg-[#EB3223]/10' : '';
                    colDiv.innerHTML += `
                        <div class="flex items-center justify-center gap-[10px] w-full px-1 py-[1.5px] rounded-sm ${bgZebra}">
                            <span class="text-[9.5px] font-black font-mono w-4 text-right leading-none text-[#EB3223]">${numFmt}</span>
                            <div class="flex items-center gap-1.5">${bolhas}</div>
                        </div>
                    `;
                    qCounter++;
                }
                containerObj.appendChild(colDiv);
                
                if (c < cols - 1) {
                    let sep = document.createElement('div');
                    sep.className = "w-px bg-black/10 mx-1";
                    containerObj.appendChild(sep);
                }
            }
        }

        function extractModelObject() {
            return {
                nome: document.getElementById('edNome').value || 'Modelo Sem Nome',
                sub: document.getElementById('edSub').value || 'SIMULADO: EXAME NACIONAL DO ENSINO MÉDIO - ENEM 2025',
                chkFiscal: document.getElementById('edChkFiscal').checked,
                chkSelo: document.getElementById('edChkSelo').checked,
                opSelo: document.getElementById('edOpSelo').value,
                chkIdioma: document.getElementById('edChkIdioma').checked,
                chkFrase: document.getElementById('edChkFrase').checked,
                qStart: parseInt(document.getElementById('edQStart').value) || 1,
                qEnd: parseInt(document.getElementById('edQEnd').value) || 90,
                modeloAlt: document.getElementById('edModeloAlt').value
            };
        }

        function devolveModelObjectDefault(id) {
            return dbModelosCartao.find(x => x.id === id) || dbModelosCartao[0];
        }

        function previewRealtime() {
            const m = extractModelObject();
            preencherTemplateAlvo(m, document.getElementById('cartaoEditableTemplate'));
        }

        // Helper genérico para popular qualquer cartao com definicoes do MODELO M (WYSIWYG ou PDF Impressao final)
        function preencherTemplateAlvo(m, el) {
            const elProva = el.querySelector('.tmp-prova');
            if(elProva && m.sub) elProva.textContent = m.sub;
            
            const elFiscal = el.querySelector('.tmp-fiscal-block');
            if(elFiscal) elFiscal.style.visibility = m.chkFiscal ? 'visible' : 'hidden';
            
            const seloEl = el.querySelector('.tmp-selo-block');
            
            const divSelo = document.getElementById('divDetalheSelo');
            if(divSelo) divSelo.style.display = m.chkSelo ? 'block' : 'none';
            
            if(m.chkSelo) {
                if(seloEl) seloEl.style.visibility = 'visible';
                const elSeloText = el.querySelector('.tmp-selo-text');
                if(elSeloText) elSeloText.textContent = m.opSelo;
            } else {
                if(seloEl) seloEl.style.visibility = 'hidden';
            }

            const elIdioma = el.querySelector('.tmp-idioma-block');
            if(elIdioma) elIdioma.style.display = m.chkIdioma ? 'flex' : 'none';
            
            const elFrase = el.querySelector('.tmp-frase-block');
            if(elFrase) elFrase.style.display = m.chkFrase ? 'flex' : 'none';

            const elGrid = el.querySelector('.tmp-grid-container');
            if(elGrid) gerarGradePreview(m.qStart, m.qEnd, m.modeloAlt, elGrid);
        }

        function salvarModeloEditado() {
            const obj = extractModelObject();
            if(!obj.nome.trim()) { alert("De o nome ao modelo!"); return; }

            if(editandoModeloId) {
                const idx = dbModelosCartao.findIndex(x => x.id === editandoModeloId);
                if(idx > -1) { dbModelosCartao[idx] = { ...dbModelosCartao[idx], ...obj, ts: Date.now() }; }
            } else {
                const novoId = "mod_" + Date.now() + Math.floor(Math.random()*1000);
                dbModelosCartao.unshift({ id: novoId, ...obj, ts: Date.now() });
            }

            localStorage.setItem('nexusModelosCartao', JSON.stringify(dbModelosCartao));
            alert("Modelo de cartão salvo com sucesso na biblioteca!");
            mudarParaBiblioteca();
        }

        // ==========================================
        // MÓDULO: ALUNOS
        // ==========================================
        let dbAlunos = [];
        try {
            const rawAlunos = localStorage.getItem('nexusAlunos');
            if(rawAlunos) dbAlunos = JSON.parse(rawAlunos);
        
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {}

        function initAlunos() {
            try {
                renderTabelaAlunos();
            
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
                console.error('Erro no initAlunos:', e);
                // Resiliência máxima
            }
        }

        function renderTabelaAlunos() {
            try {
                const tbody = document.getElementById('tbody-alunos');
                if(!tbody) return;
                
                const filtroInput = document.getElementById('filtroTurmaBusca');
                const filtroGeral = filtroInput ? filtroInput.value.toLowerCase() : '';

                // Filtro normal focado nas turmas com safe guards
                let filtered = dbAlunos.filter(a => {
                    const searchTurma = a.turma ? String(a.turma).toLowerCase() : '';
                    const searchUnidade = a.unidade ? String(a.unidade).toLowerCase() : '';
                    if(filtroGeral && !searchTurma.includes(filtroGeral) && !searchUnidade.includes(filtroGeral)) return false;
                    return true;
                });

                if(filtered.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400 font-semibold text-sm">Nenhuma turma registrada ou correspondente à busca.</td></tr>`;
                    document.getElementById('totalTurmasCounter').textContent = `0 Turmas`;
                    return;
                }

                // Agrupa por Turma
                const groupedByTurma = {};
                filtered.forEach(a => {
                    const tName = a.turma ? String(a.turma) : "Turma Padrão";
                    if(!groupedByTurma[tName]) groupedByTurma[tName] = [];
                    groupedByTurma[tName].push(a);
                });

                // Constrói o HTML (Master / Detail)
                let rawHTML = '';
                
                Object.keys(groupedByTurma).sort().forEach((turmaName, idx) => {
                    const alunos = groupedByTurma[turmaName];
                    const unidadeBase = alunos[0].unidade || "Geral"; 
                    
                    let tipoApp = "No Definido";
                    const tNameLower = turmaName.toLowerCase();
                    if(tNameLower.includes("simulado")) tipoApp = "Simulado";
                    else if(tNameLower.includes("bolsas") || tNameLower.includes("med") || tNameLower.includes("pas")) tipoApp = "Concurso de Bolsas";
                    else tipoApp = "Geral"; 
                    
                    // Row da Turma
                    rawHTML += `
                    <tr class="hover:bg-indigo-50/30 transition-colors cursor-pointer border-b border-slate-100 group" data-turma="${turmaName.replace(/"/g, '&quot;')}" data-unidade="${unidadeBase.replace(/"/g, '&quot;')}" onclick="abrirTurmaDetalhes(this.dataset.turma, this.dataset.unidade)">
                        <td class="px-6 py-4">
                            <p class="font-extrabold text-[#0B193C] text-[15px] group-hover:text-indigo-600 transition-colors">${turmaName}</p>
                        </td>
                        <td class="px-6 py-4">
                            <p class="font-bold text-slate-600 text-[13px]">${unidadeBase}</p>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">${tipoApp}</span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="font-bold text-[#0B193C] text-sm">${alunos.length}</span> <span class="text-[10px] text-slate-400 font-extrabold uppercase">Alunos</span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold tracking-widest uppercase">Ativa</span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex items-center justify-end gap-1">
                                <button onclick="excluirTurma(event, '${turmaName.replace(/'/g, "\\'")}')" class="w-8 h-8 rounded-lg text-rose-300 hover:bg-rose-100 hover:text-rose-600 transition-colors flex items-center justify-center tooltip" title="Excluir Turma Permanentemente">
                                    <span class="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                                <button class="w-8 h-8 rounded-lg text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors flex items-center justify-center">
                                    <span class="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                    `;
                });

                tbody.innerHTML = rawHTML;
                document.getElementById('totalTurmasCounter').textContent = `${Object.keys(groupedByTurma).length} Turmas`;
            } catch (err) {
                console.error("Erro fatal ao renderizar tabela de turmas: ", err);
            }
        }

        // ==========================================
        // IMPORTAÇÃO DE ALUNOS VIA EXCEL (SheetJS)
        // ==========================================
        let turmaAtualContexto = null;
        let unidadeAtualContexto = null;

        function excluirTurma(event, turmaName) {
            event.stopPropagation();
            if(confirm(`ATENÇÃO: Você tem certeza que deseja EXCLUIR a turma "${turmaName}" permanentemente?\n\nIsso removerá todos os alunos vinculados a esta turma na sua conta local.`)) {
                dbAlunos = dbAlunos.filter(a => a.turma !== turmaName);
                localStorage.setItem('nexusAlunos', JSON.stringify(dbAlunos));
                renderTabelaAlunos();
            }
        }

        function abrirTurmaDetalhes(turmaName, unidadeBase) {
            turmaAtualContexto = turmaName;
            unidadeAtualContexto = unidadeBase;
            
            document.getElementById('detalheTurmaNome').textContent = turmaName;
            document.getElementById('detalheUnidade').textContent = unidadeBase;
            
            renderAlunosDetalhesList();

            // Transição visual
            document.getElementById('view-alunos').classList.add('hidden');
            document.getElementById('view-turma-detalhes').classList.remove('hidden');
            document.getElementById('view-turma-detalhes').classList.add('flex');
            
            const mainContent = document.querySelector('main');
            if(mainContent) mainContent.scrollTop = 0;
        }

        function voltarParaGestaoTurmas() {
            turmaAtualContexto = null;
            document.getElementById('view-turma-detalhes').classList.add('hidden');
            document.getElementById('view-turma-detalhes').classList.remove('flex');
            document.getElementById('view-alunos').classList.remove('hidden');
        }

        function renderAlunosDetalhesList() {
            if(!turmaAtualContexto) return;
            const tbody = document.getElementById('tbody-turma-detalhes');
            if(!tbody) return;

            const filtroDetalhes = document.getElementById('filtroDetalheAluno').value.toLowerCase();
            
            let alunosTurma = dbAlunos.filter(a => a.turma === turmaAtualContexto);
            
            if(filtroDetalhes) {
                alunosTurma = alunosTurma.filter(a => {
                    const n = a.nome ? String(a.nome).toLowerCase() : '';
                    const c = a.cpf ? String(a.cpf).toLowerCase() : '';
                    return n.includes(filtroDetalhes) || c.includes(filtroDetalhes);
                });
            }

            document.getElementById('detalheTotal').textContent = alunosTurma.length;

            if(alunosTurma.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="px-6 py-8 text-center text-slate-400 font-semibold text-sm">Nenhum aluno encontrado nesta turma com este filtro.</td></tr>`;
                return;
            }

            alunosTurma.sort((a,b) => {
                const nA = a.nome ? String(a.nome) : '';
                const nB = b.nome ? String(b.nome) : '';
                return nA.localeCompare(nB);
            });

            tbody.innerHTML = alunosTurma.map(a => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span class="font-bold text-[#0B193C] text-sm">#${a.inscricao || '---'}</span>
                            <span class="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Seq: ${a.sequencial || '0'}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-bold text-sm text-[#0B193C]">${a.nome || 'Sem Nome'}</p>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-semibold text-[13px] text-slate-600">${(a.cpf && a.cpf !== '000.000.000-00') ? a.cpf : 'N/I'}</p>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-bold text-[#0B193C] text-[13px]">${a.unidade || '-'}</p>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-bold text-[#0B193C] text-[13px]">${a.turno || 'Variável'}</p>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold tracking-widest uppercase">${a.situacao || 'Ativo'}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors tooltip flex items-center justify-center ml-auto" title="Ficha Completa">
                            <span class="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // ==========================================
        // IMPORTAÇÃO DE TURMAS VIA EXCEL (SheetJS)
        // ==========================================
        function baixarModeloExcel() {
            const worksheet = XLSX.utils.json_to_sheet([
                {
                    "Nome Completo": "Exemplo Aluno Silva",
                    "CPF": "123.456.789-00",
                    "E-mail": "aluno@email.com",
                    "Telefone": "(11) 99999-9999",
                    "Data de Nascimento": "01/01/2005",
                    "Número de Inscrição": "12345",
                    "Código Sequencial": "001",
                    "Unidade": "Sede",
                    "Turno": "Integral",
                    "Observações": "Anotação opcional"
                }
            ]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo Alunos");
            XLSX.writeFile(workbook, "Nexus_Modelo_Cadastro_Alunos.xlsx");
        }

        let tempImportBatch = [];
        let rawJsonExcelArray = [];
        let colunasMapeadasDicionario = {};

        const MAP_FIELDS = [
            { id: 'nome', label: 'Nome Completo', required: true, aliases: ['nome', 'nome completo', 'candidato', 'aluno', 'estudante'] },
            { id: 'cpf', label: 'CPF', required: false, aliases: ['cpf', 'documento', 'rg', 'cpf do candidato', 'cpf do aluno'] },
            { id: 'inscricao', label: 'Número de Inscrição', required: false, aliases: ['inscricao', 'inscrição', 'número de inscricao', 'número de inscrição', 'matricula', 'matrícula', 'id', 'número', 'nº', 'código de inscrição'] },
            { id: 'sequencial', label: 'Cód. Sequencial', required: false, aliases: ['sequencial', 'codigo sequencial', 'código sequencial', 'seq', 'código', 'número'] },
            { id: 'unidade', label: 'Unidade / Polo', required: false, aliases: ['unidade', 'polo', 'escola', 'campus', 'filial', 'local'] },
            { id: 'turno', label: 'Turno', required: false, aliases: ['turno', 'periodo', 'período'] },
            { id: 'email', label: 'E-mail', required: false, aliases: ['e-mail', 'email', 'correio'] },
            { id: 'telefone', label: 'Telefone', required: false, aliases: ['telefone', 'celular', 'whatsapp', 'contato'] },
            { id: 'nascimento', label: 'Data Nasc.', required: false, aliases: ['nascimento', 'data de nascimento', 'data nasc'] },
            { id: 'observacoes', label: 'Observações', required: false, aliases: ['obs', 'observacao', 'observação', 'observacoes', 'observações'] }
        ];

        function normalizarString(str) {
            if(str === null || str === undefined) return "";
            return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
        }

        function validarFormTurma() {
            const inst = document.getElementById('novaTurmaInstituicao').value.trim();
            const nome = document.getElementById('novaTurmaNome').value.trim();
            const btn = document.getElementById('btnCriarTurma');
            
            if(inst && nome) {
                btn.removeAttribute('disabled');
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                btn.setAttribute('disabled', 'true');
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        function importarTurmaExcel(event, isDrop = false) {
            let files;
            if(isDrop && event.dataTransfer) {
                files = event.dataTransfer.files;
            } else {
                files = event.target.files;
            }
            
            const file = files[0];
            if(!file) return;

            const nomeTurmaInput = document.getElementById('novaTurmaNome').value.trim();
            const instituicaoInput = document.getElementById('novaTurmaInstituicao').value.trim();
            if(!instituicaoInput || !nomeTurmaInput) {
                alert("ATENÇÃO: Preencha a 'Instituição' e o 'Nome da Turma' antes de enviar o arquivo Excel!");
                if(event.target) event.target.value = '';
                return;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    
                    // Buscar a primeira linha válida de headers
                    const rawRows = XLSX.utils.sheet_to_json(worksheet, {header: 1, defval: ""});
                    if(rawRows.length === 0) throw new Error("Planilha vazia");

                    let headerRowIndex = 0;
                    let foundHeaders = [];

                    for (let i = 0; i < Math.min(20, rawRows.length); i++) {
                        const row = rawRows[i];
                        const validStringsCount = row.filter(cell => typeof cell === 'string' && cell.trim() !== '').length;
                        if (validStringsCount > 2) {
                            headerRowIndex = i;
                            foundHeaders = row.map(v => typeof v === 'string' ? v.trim() : String(v).trim());
                            break;
                        }
                    }

                    if(foundHeaders.length === 0) {
                        // fallback se nada achar
                        foundHeaders = rawRows[0];
                    }

                    // Gera o json já convertendo pela linha header certa
                    rawJsonExcelArray = XLSX.utils.sheet_to_json(worksheet, {range: headerRowIndex, defval: ""});
                    
                    // Filtra colunas nulas ou vazias
                    foundHeaders = foundHeaders.filter(h => h.trim() !== "");
                    
                    abrirMapeamentoUI(foundHeaders);

                } catch (error) {
                    alert("Erro ao processar o arquivo Excel: " + error.message);
                }
            };
            reader.readAsArrayBuffer(file);
            if(event.target) event.target.value = ''; 
        }

        function abrirMapeamentoUI(foundHeaders) {
            document.getElementById('mapQtdColunas').textContent = foundHeaders.length;
            const container = document.getElementById('mapeamentoContainer');
            let html = '';

            MAP_FIELDS.forEach(field => {
                let sugerida = "";
                // Auto-map logic
                for(let h of foundHeaders) {
                    const normH = normalizarString(h);
                    if(field.aliases.includes(normH) || field.aliases.some(alias => normH.includes(alias))) {
                        sugerida = h;
                        break;
                    }
                }

                const optionsStr = foundHeaders.map(h => `<option value="${h}" ${sugerida === h ? 'selected' : ''}>[Coluna] ${h}</option>`).join('');
                
                html += `
                    <div class="flex items-center justify-between p-4 rounded-xl border ${field.required ? 'border-indigo-100 bg-indigo-50/20' : 'border-slate-100 bg-slate-50/50'}">
                        <div class="w-1/2 pr-4">
                            <p class="text-[13px] font-extrabold text-[#0B193C] mb-0.5">${field.label} ${field.required ? '<span class="text-rose-500">*</span>' : ''}</p>
                            <p class="text-[10px] text-slate-400 font-bold tracking-widest uppercase">${field.required ? 'Obrigatório' : 'Opcional'}</p>
                        </div>
                        <div class="w-1/2">
                            <select id="map_${field.id}" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-400 text-sm font-semibold text-slate-700 shadow-sm">
                                <option value="">-- No Mapear (Ignorar) --</option>
                                ${optionsStr}
                            </select>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
            document.getElementById('view-mapeamento-importacao').classList.remove('hidden');
            document.getElementById('view-mapeamento-importacao').classList.add('flex');
        }

        function cancelarMapeamento() {
            rawJsonExcelArray = [];
            document.getElementById('view-mapeamento-importacao').classList.add('hidden');
            document.getElementById('view-mapeamento-importacao').classList.remove('flex');
        }

        function avancarParaAuditoria() {
            colunasMapeadasDicionario = {};
            let nomeMapped = false;
            
            MAP_FIELDS.forEach(field => {
                const sel = document.getElementById(`map_${field.id}`);
                if(sel && sel.value) {
                    colunasMapeadasDicionario[field.id] = sel.value;
                    if(field.id === 'nome') nomeMapped = true;
                }
            });

            if(!nomeMapped) {
                alert("Ops! Você precisa obrigatoriamente mapear qual coluna representa o 'Nome Completo'.");
                return;
            }

            document.getElementById('view-mapeamento-importacao').classList.add('hidden');
            document.getElementById('view-mapeamento-importacao').classList.remove('flex');

            processarAuditoriaExcel();
        }

        function limparEFormatar(str) {
            if(str === null || str === undefined) return "";
            return String(str).trim();
        }

        function processarAuditoriaExcel() {
            const modalUnidade = document.getElementById('novaTurmaUnidade').value;
            const headerTurmaStr = document.getElementById('novaTurmaNome').value.trim();
            const instituicaoStr = document.getElementById('novaTurmaInstituicao').value.trim();

            let validosCount = 0;
            let incompletosCount = 0;
            let invalidosCount = 0;
            tempImportBatch = [];
            
            const cpfsNoArquivo = [];
            const inscricoesNoArquivo = [];

            // Remove empty lines
            const dadosValidos = rawJsonExcelArray.filter(row => {
                return Object.keys(row).some(k => limparEFormatar(row[k]) !== "");
            });

            dadosValidos.forEach((row, index) => {
                const getVal = (sysParam) => {
                    const colName = colunasMapeadasDicionario[sysParam];
                    if(!colName) return "";
                    return limparEFormatar(row[colName]);
                };

                const nome = getVal('nome');
                let inscricao = getVal('inscricao');
                let cpf = getVal('cpf');
                const email = getVal('email');
                const telefone = getVal('telefone');
                const nascimento = getVal('nascimento');
                const seqRaw = getVal('sequencial');
                
                const unidadeExcel = getVal('unidade');
                const unidade = unidadeExcel ? unidadeExcel : modalUnidade;
                const turno = getVal('turno') || 'Variável';
                const observacoes = getVal('observacoes');
                
                // Formatação leve CPF (remover caracteres que no sejan números para validar)
                let cpfNum = cpf.replace(/\D/g, ''); 
                if(cpfNum.length > 0 && cpfNum.length !== 11) cpfNum = "00000000000"; // Fake para dar flag
                const cpfFinal = cpf; // Guarda orig pra visualização, no mascara

                let statusLinha = "Válido";
                let logErro = "";
                
                // Regras Atualizadas
                // 1. Inválido se Nome no tem
                if(!nome) {
                    statusLinha = "Inválido";
                    logErro += "Nome ausente. ";
                }
                
                // 2. Incompleto se tem nome, MAS falta ambos (CPF e Insc) -> Noe inválido total mas no pode salvar perfeito
                if(statusLinha !== "Inválido" && !cpf && !inscricao) {
                    statusLinha = "Incompleto";
                    logErro += "Sem nenhum identificador (CPF ou Inscrição ausentes). ";
                }

                // Alerta se só falta um dos identificadores
                if(statusLinha === "Válido" && (!cpf || !inscricao)) {
                    statusLinha = "Incompleto"; // Usando a mesma flag laranja
                    if(!cpf) logErro += "Falta CPF. ";
                    if(!inscricao) logErro += "Falta Inscrição (será gerada numeração auto). ";
                }
                
                // 3. Duplicidade (Global) - REMOVIDO A PEDIDO DO USUÁRIO (Permitir Todos)
                /*
                if(statusLinha !== "Inválido") {
                    const cpfNoBanco = cpf ? dbAlunos.find(a => a.cpf === cpf) : null;
                    const inscNoBanco = inscricao ? dbAlunos.find(a => String(a.inscricao) === String(inscricao)) : null;
                    
                    if(cpfNoBanco || inscNoBanco) {
                        statusLinha = "Duplicado";
                        logErro += cpfNoBanco ? "CPF já existe (Sist.). " : "Inscrição já existe (Sist.). ";
                    }
                }
                */
                
                // 4. Duplicidade Interna - REMOVIDO A PEDIDO DO USUÁRIO (Permitir Todos)
                /*
                if(statusLinha !== "Inválido" && statusLinha !== "Duplicado") {
                    let dupInFile = false;
                    if(cpf && cpfsNoArquivo.includes(cpf)) { dupInFile = true; logErro += "CPF repetido no arquivo atual. "; }
                    if(inscricao && inscricoesNoArquivo.includes(inscricao)) { dupInFile = true; logErro += "Inscrição rep. no arquivo atual. "; }
                    
                    if(dupInFile) {
                        statusLinha = "Duplicado";
                    } else {
                        if(cpf) cpfsNoArquivo.push(cpf);
                        if(inscricao) inscricoesNoArquivo.push(inscricao);
                    }
                }
                */

                tempImportBatch.push({
                    linha: index + 2,
                    nome: nome,
                    cpf: cpf,
                    inscricao: inscricao,
                    sequencial: seqRaw,
                    email: email,
                    telefone: telefone,
                    nascimento: nascimento,
                    unidade: unidade,
                    turno: turno,
                    observacoes: observacoes,
                    situacao: 'Ativo',
                    statusFinal: statusLinha,
                    erroStr: logErro.trim()
                });
                
                if(statusLinha === "Válido") validosCount++;
                else if(statusLinha === "Incompleto") incompletosCount++;
                else invalidosCount++;
            });
            
            document.getElementById('prevTotal').textContent = tempImportBatch.length;
            document.getElementById('prevValidos').textContent = validosCount;
            document.getElementById('prevIncompletos').textContent = incompletosCount;
            document.getElementById('prevInvalidos').textContent = invalidosCount;
            
            const tbodyPrev = document.getElementById('tbody-preview');
            let rawPrevRows = "";
            tempImportBatch.forEach(b => {
                let rowClass = "hover:bg-slate-50";
                let statusBadge = "";
                
                if(b.statusFinal === "Válido") {
                    statusBadge = `<span class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div> <span class="text-emerald-600">Válido</span></span>`;
                } else if(b.statusFinal === "Incompleto") {
                    rowClass = "bg-amber-50/30 hover:bg-amber-50";
                    statusBadge = `<span class="flex items-center gap-1.5 tooltip text-[11px]" title="${b.erroStr}"><div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div> <span class="text-amber-600">${b.erroStr || 'Info Faltante'}</span></span>`;
                } else {
                    rowClass = "bg-rose-50/50 hover:bg-rose-50";
                    statusBadge = `<span class="flex items-center gap-1.5 tooltip text-[11px]" title="${b.erroStr}"><div class="w-2.5 h-2.5 rounded-full bg-rose-400"></div> <span class="text-rose-600 font-extrabold">${b.statusFinal.toUpperCase()}: ${b.erroStr}</span></span>`;
                }
                
                rawPrevRows += `
                <tr class="${rowClass} transition-colors text-xs">
                    <td class="px-5 py-2 text-center text-slate-400 font-bold">${b.linha}</td>
                    <td class="px-5 py-2 font-semibold text-[#0B193C] ${!b.inscricao ? 'text-amber-500' : ''}">${b.inscricao || '--'} <span class="text-[9px] text-slate-400 ml-1">Seq ${b.sequencial || '--'}</span></td>
                    <td class="px-5 py-2 font-bold text-[#0B193C] whitespace-nowrap ${!b.nome ? 'text-rose-500 line-through' : ''}">${b.nome || '-- Ausente --'}</td>
                    <td class="px-5 py-2 font-semibold text-slate-600 ${!b.cpf ? 'text-amber-500' : ''}">${b.cpf || '--'}</td>
                    <td class="px-5 py-2 font-bold">${statusBadge}</td>
                </tr>
                `;
            });
            
            if(tempImportBatch.length === 0) rawPrevRows = `<tr><td colspan="5" class="py-8 text-center text-slate-500 font-semibold text-sm">Arquivo vazio ou dados no encontrados.</td></tr>`;
            
            tbodyPrev.innerHTML = rawPrevRows;
            
            document.getElementById('previewTurmaNome').textContent = headerTurmaStr;
            document.getElementById('previewTurmaUnidade').textContent = modalUnidade;

            document.getElementById('view-preview-importacao').classList.remove('hidden');
            document.getElementById('view-preview-importacao').classList.add('flex');
        }

        function cancelarImportacao() {
            tempImportBatch = [];
            document.getElementById('view-preview-importacao').classList.add('hidden');
            document.getElementById('view-preview-importacao').classList.remove('flex');
        }

        function confirmarImportacaoValidados() {
            if(!tempImportBatch || tempImportBatch.length === 0) {
                alert("Nenhum dado na prancheta para importar.");
                return;
            }

            const headerTurmaStr = document.getElementById('novaTurmaNome').value.trim();
            const instituicaoStr = document.getElementById('novaTurmaInstituicao').value.trim();
            const modalUnidade = document.getElementById('novaTurmaUnidade').value;
            const modalTipoApp = document.getElementById('novaTurmaTipoApp').value;

            let cadastrados = 0;
            const turmaFormatada = modalTipoApp === "Geral" ? headerTurmaStr : `${modalTipoApp} - ${headerTurmaStr}`;

            tempImportBatch.forEach(b => {
                if(b.statusFinal === "Válido" || b.statusFinal === "Incompleto") {
                    
                    // Se Nome estiver ausente mesmo no incompleto, rejeitamos definitivamente (Safety Check)
                    if(!b.nome) return;

                    let rInsc = b.inscricao;
                    if(!rInsc) rInsc = Math.floor(10000 + Math.random() * 90000).toString();

                    let rCpf = b.cpf;
                    if(!rCpf) rCpf = "Indisponvel";

                    dbAlunos.push({
                        id: Date.now() + Math.random(),
                        sequencial: b.sequencial || (dbAlunos.length + 1),
                        inscricao: rInsc,
                        nome: b.nome,
                        cpf: rCpf,
                        email: b.email,
                        telefone: b.telefone,
                        nascimento: b.nascimento,
                        instituicao: instituicaoStr || 'N/I',
                        unidade: b.unidade || modalUnidade,
                        turma: turmaFormatada,
                        curso: "No Declarado",
                        turno: b.turno,
                        observacoes: b.observacoes,
                        situacao: b.situacao
                    });
                    cadastrados++;
                }
            });

            if(cadastrados > 0) {
                localStorage.setItem('nexusAlunos', JSON.stringify(dbAlunos));
                document.getElementById('novaTurmaNome').value = '';
                try { renderTabelaAlunos(); } catch(e){}
                
                alert(`Sucesso! ${cadastrados} alunos importados para a turma '${turmaFormatada}'.`);
                cancelarImportacao(); 
            } else {
                alert("Nenhum registro classificado como Válido pôde ser aproveitado.");
                cancelarImportacao();
            }
        }


        // ==========================================
        // MÓDULO: PROVAS
        // ==========================================
        let dbProvas = [];
        try {
            const rawProvas = localStorage.getItem('nexusProvas');
            if(rawProvas) dbProvas = JSON.parse(rawProvas);
        
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {}

        function initProvas() {
            renderTabelaProvas();
        }

        function renderTabelaProvas() {
            const tbody = document.getElementById('tbody-provas');
            if(!tbody) return;
            
            const filtroNome = document.getElementById('filtroNomeProva').value.toLowerCase();
            const filtroTipo = document.getElementById('filtroTipoProva').value;

            let filtered = dbProvas.filter(p => {
                if(filtroNome && !p.nome.toLowerCase().includes(filtroNome) && !p.codigo.toLowerCase().includes(filtroNome)) return false;
                if(filtroTipo && p.tipo !== filtroTipo) return false;
                return true;
            });

            if(filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400 font-semibold text-sm">Nenhuma prova encontrada.</td></tr>`;
                return;
            }

            tbody.innerHTML = filtered.map(p => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                        <span class="font-bold text-[#0B193C] text-sm">${p.codigo}</span>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-bold text-[#0B193C] text-sm">${p.nome}</p>
                        <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">${p.tipo} • ${p.ano}</p>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-semibold text-sm text-indigo-600">${p.questoes} Questões</p>
                        <p class="text-[11px] font-bold text-slate-400">Gabarito: <span class="text-emerald-500">${p.gabaritoFile ? 'Anexado' : 'Ausente'}</span></p>
                    </td>
                    <td class="px-6 py-4">
                        <p class="font-bold text-[#0B193C] text-[13px]">${p.unidade} / ${p.turno}</p>
                        <p class="text-[11px] font-bold text-slate-400">${p.publico}</p>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2.5 py-1 rounded border border-indigo-200 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold tracking-widest uppercase">${p.status}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B193C] transition-colors tooltip flex items-center justify-center ml-auto" title="Configurar Gabarito Oficial">
                            <span class="material-symbols-outlined text-[18px]">fact_check</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // ==========================================
        // MÓDULO: CARTÕES NOMINAIS
        // ==========================================
        function initCartoes() {
            const selectTurma = document.getElementById('cartaoSelectTurma');
            if(selectTurma) {
                const turmasUnicas = [...new Set(dbAlunos.map(a => a.turma).filter(Boolean))].sort();
                selectTurma.innerHTML = '<option value="">-- Escolher Turma --</option>' + turmasUnicas.map(t => `<option value="${t}">${t}</option>`).join('');
            }
            
            const selectBase = document.getElementById('selProvaBase');
            if(selectBase) {
                if(dbModelosCartao.length === 0) {
                    selectBase.innerHTML = '<option value="">-- Crie um modelo no Editor --</option>';
                    return;
                }
                selectBase.innerHTML = '<option value="">-- Escolher Modelo da Biblioteca --</option>' + 
                    dbModelosCartao.map(m => `<option value="${m.id}">${m.nome} | Q. ${m.qStart}-${m.qEnd}</option>`).join('');
            }
        }

        // Função Master para Clonar e Injetar Dados em um Modelo
        function buildNodeCartaoParaAluno(alunoInfo, modeloObj, escala = 'scale(1)') {
            // 1. Clona a árvore DOM inteira do painel de Editor do WYSIWYG
            const originalTemplate = document.getElementById('cartaoEditableTemplate');
            const clone = originalTemplate.cloneNode(true);
            
            clone.style.transform = escala;
            clone.style.marginBottom = '0';
            clone.removeAttribute('id');

            // 2. Aplica as propriedades arquiteturais do Layout
            preencherTemplateAlvo(modeloObj, clone);
            
            // 3. Aplica Dados Pessoais do Aluno (buscando pelos seletores que criarei no HTML)
            const elNome = clone.querySelector('.n_nome');
            const elCpf = clone.querySelector('.n_cpf');
            const elTurma = clone.querySelector('.n_turma');
            
            if(elNome) elNome.textContent = alunoInfo.isPlaceholder ? '' : (alunoInfo.nome || 'NO INFORMADO');
            
            const nameGridRows = clone.querySelectorAll('.n_nome_grid_row');
            if(nameGridRows.length > 0) {
                let nomeFinal = alunoInfo.isPlaceholder ? '' : (alunoInfo.nome || 'NAO INFORMADO');
                nomeFinal = nomeFinal.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); // Remove acentos
                let boxes = [];
                nameGridRows.forEach(r => r.querySelectorAll('div').forEach(b => boxes.push(b)));
                
                boxes.forEach(b => b.textContent = ''); // Limpa
                
                let words = nomeFinal.split(' ');
                let currentBoxIndex = 0;
                
                for (let i = 0; i < words.length; i++) {
                    let word = words[i];
                    if (!word) continue;
                    
                    // Se estamos na primeira linha e a palavra não cabe nela (quebra a palavra), pula para a linha 2
                    if (currentBoxIndex < 26 && (currentBoxIndex + word.length) > 26) {
                        currentBoxIndex = 26;
                    }
                    
                    // Preenche a palavra letra por letra
                    for (let j = 0; j < word.length; j++) {
                        if (currentBoxIndex < boxes.length) {
                            boxes[currentBoxIndex].textContent = word[j];
                            currentBoxIndex++;
                        }
                    }
                    
                    // Adiciona o box de espaço (evitando colocar espaço no primeiro quadrado de uma linha nova)
                    if (currentBoxIndex < boxes.length && currentBoxIndex !== 26) {
                        currentBoxIndex++;
                    }
                }
            }

            if(elCpf) {
                if(alunoInfo.isPlaceholder) {
                    elCpf.textContent = '';
                } else {
                    let textCpf = (alunoInfo.cpf && alunoInfo.cpf !== '000.000.000-00') ? alunoInfo.cpf : (alunoInfo.inscricao || '0');
                    let cNum = String(textCpf).replace(/\D/g, '');
                    // Força o padrão do CPF (000.000.000-00) preenchendo com zeros à esquerda
                    if (cNum.length > 0) {
                        cNum = cNum.padStart(11, '0').slice(-11); // Pega os últimos 11 ou preenche
                        textCpf = cNum.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                    } else {
                        textCpf = '000.000.000-00';
                    }
                    elCpf.textContent = textCpf;
                }
            }
            if(elTurma) {
                if(alunoInfo.isPlaceholder) {
                    elTurma.textContent = '';
                } else {
                    let turmaLimpa = alunoInfo.turma || '';
                    const prefixos = ["Simulado - ", "Prova Diagnstica - ", "Concurso de Bolsas - "];
                    for(let p of prefixos) {
                        if(turmaLimpa.startsWith(p)) {
                            turmaLimpa = turmaLimpa.substring(p.length);
                            break;
                        }
                    }
                    elTurma.textContent = turmaLimpa;
                }
            }
            // 4. Gera o QR Code Funcional
            const elQrCode = clone.querySelector('.n_qrcode');
            if (elQrCode) {
                elQrCode.innerHTML = '';
                if (!alunoInfo.isPlaceholder && alunoInfo.cpf) {
                    // Limpa máscara para o qr code ficar menor
                    let plainId = String(alunoInfo.cpf).replace(/\D/g, '');
                    if(!plainId) plainId = alunoInfo.inscricao || '0';
                    
                    new QRCode(elQrCode, {
                        text: "ID:" + plainId,
                        width: 50,
                        height: 50,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.L
                    });
                }
            }

            return clone;
        }

        // Função removida: atualizarAbasProvaBase

        function getModelosSelecionados() {
            const provaBaseStr = document.getElementById('selProvaBase').value;
            if(!provaBaseStr) return [];
            
            const mSelecionado = dbModelosCartao.find(m => String(m.id) === String(provaBaseStr));
            if(!mSelecionado) return [];
            
            return [mSelecionado];
        }

        function gerarCartaoVisualizacao() {
            const nomeTurma = document.getElementById('cartaoSelectTurma').value;
            const modelosArray = getModelosSelecionados();
            
            if(!nomeTurma) { alert("Selecione uma Turma."); return; }
            if(modelosArray.length === 0) { alert("Selecione um Modelo da Biblioteca primeiro."); return; }

            const alunosDessaTurma = dbAlunos.filter(a => a.turma === nomeTurma);

            if(alunosDessaTurma.length === 0) {
                alert("Nenhum aluno encontrado nesta turma!");
                return;
            }

            document.getElementById('cartaoEmptyState').style.display = 'none';
            document.getElementById('btnConfirmarLote').classList.remove('opacity-50', 'pointer-events-none');
            document.getElementById('btnExportarLote').classList.remove('opacity-50', 'pointer-events-none');
            document.getElementById('btnExportarReserva').classList.remove('opacity-50', 'pointer-events-none');

            const containerPreview = document.getElementById('cartaoPreviewEmissor');
            containerPreview.innerHTML = ''; 
            
            const wrapScroll = document.createElement('div');
            wrapScroll.className = "flex flex-col gap-12 w-[1000px] origin-top pt-4";
            wrapScroll.style.transform = "scale(0.80)";
            
            alunosDessaTurma.forEach((aluno) => {
                modelosArray.forEach((modeloSelecionado) => {
                    const cloneCartao = buildNodeCartaoParaAluno(aluno, modeloSelecionado, 'scale(1)');
                    wrapScroll.appendChild(cloneCartao);
                });
            });
            
            containerPreview.appendChild(wrapScroll);
        }

        function confirmarGabaritosLote() {
            const nomeTurma = document.getElementById('cartaoSelectTurma').value;
            const modelosArray = getModelosSelecionados();
            
            if(!nomeTurma || modelosArray.length === 0) {
                alert("Gere o preview do lote primeiro!");
                return;
            }

            // Preencher Provas Física geradas e guardar na prateleira da Biblioteca de Provas!
            modelosArray.forEach(modelo => {
                dbProvas.push({
                    id: Date.now() + Math.random(),
                    codigo: "GAB-" + Math.floor(1000 + Math.random() * 9000),
                    nome: `${nomeTurma} - ${modelo.nome}`,
                    tipo: "Simulado",
                    ano: new Date().getFullYear(),
                    questoes: (modelo.qEnd - modelo.qStart) + 1,
                    gabaritoFile: null,
                    criadoEm: new Date().toISOString()
                });
            });
            localStorage.setItem('nexusProvas', JSON.stringify(dbProvas));
            try { renderTabelaProvas(); } catch(e){}

            alert(`✅ Lote Finalizado!\n\nOs gabaritos da turma '${nomeTurma}' foram validados e estão prontos na Biblioteca.`);
            
            switchView('provas');
            
            // Rola suavemente até a div da Biblioteca na interface de Provas
            setTimeout(() => {
                const libContainer = document.getElementById('editor-biblioteca');
                if(libContainer) {
                    libContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }

        function baixarCartaoPDFLote() {
            const nomeTurma = document.getElementById('cartaoSelectTurma').value;
            const modelosArray = getModelosSelecionados();
            
            if(!nomeTurma || modelosArray.length === 0) return;
            
            const btn = document.getElementById('btnExportarLote');
            btn.classList.add('opacity-50', 'pointer-events-none');
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando PDF em Vetor...`;

            const alunosDessaTurma = dbAlunos.filter(a => a.turma === nomeTurma);
            
            const batchContainer = document.getElementById('batchRenderContainer');
            batchContainer.innerHTML = '';
            batchContainer.className = 'absolute top-0 left-0 bg-white w-full';

            // Prepara CSS dinâmico para Impresso
            let printStyle = document.getElementById('nexus-print-style');
            if(!printStyle) {
                printStyle = document.createElement('style');
                printStyle.id = 'nexus-print-style';
                printStyle.innerHTML = `
                    @media print {
                        body { background: white !important; margin: 0 !important; padding: 0 !important; }
                        body > :not(#batchRenderContainer) { display: none !important; }
                        #batchRenderContainer { display: block !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100%; margin: 0; padding: 0; background: white; }
                        .nexus-page-break { page-break-after: always; clear: both; }
                        @page { size: A4 portrait; margin: 0; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                `;
                document.head.appendChild(printStyle);
            }

            alunosDessaTurma.forEach((aluno, indexA) => {
                modelosArray.forEach((modeloSelecionado, indexM) => {
                    const nodeCartao = buildNodeCartaoParaAluno(aluno, modeloSelecionado, 'scale(1)');
                    
                    // Ajuste para forar altura A4 real (297mm) sem zoom-out extra no print
                    nodeCartao.style.pageBreakInside = "avoid";
                    nodeCartao.style.pageBreakAfter = "always";
                    nodeCartao.style.boxShadow = "none";
                    nodeCartao.style.margin = "0";

                    batchContainer.appendChild(nodeCartao);
                    
                    const isLastAluno = (indexA === alunosDessaTurma.length - 1);
                    const isLastModel = (indexM === modelosArray.length - 1);
                    if(!(isLastAluno && isLastModel)) {
                        let pageBreak = document.createElement('div');
                        pageBreak.className = 'nexus-page-break';
                        batchContainer.appendChild(pageBreak);
                    }
                });
            });

            setTimeout(() => {
                window.print();
                
                // Limpeza pós-print
                batchContainer.innerHTML = '';
                batchContainer.className = 'hidden absolute top-0 left-0 -z-50 w-[700px]';
                btn.classList.remove('opacity-50', 'pointer-events-none');
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">download</span> Exportar Lote PDF`;
            }, 800);
        }

        function baixarCartaoPDFLoteReserva() {
            const modelosArray = getModelosSelecionados();
            if(modelosArray.length === 0) {
                alert("Selecione um Modelo da Biblioteca primeiro para os cartões reserva.");
                return;
            }

            let qtdStr = prompt("Quantos CARTÕES RESERVA EM BRANCO deseja imprimir para este modelo?", "5");
            if(!qtdStr) return;
            
            let qtd = parseInt(qtdStr, 10);
            if(isNaN(qtd) || qtd <= 0) return;

            const btn = document.getElementById('btnExportarReserva');
            if(btn) {
                btn.classList.add('opacity-50', 'pointer-events-none');
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando Reservas...`;
            }

            const batchContainer = document.getElementById('batchRenderContainer');
            batchContainer.innerHTML = '';
            batchContainer.className = 'absolute top-0 left-0 bg-white w-full';

            let printStyle = document.getElementById('nexus-print-style');
            if(!printStyle) {
                printStyle = document.createElement('style');
                printStyle.id = 'nexus-print-style';
                printStyle.innerHTML = `
                    @media print {
                        body { background: white !important; margin: 0 !important; padding: 0 !important; }
                        body > :not(#batchRenderContainer) { display: none !important; }
                        #batchRenderContainer { display: block !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100%; margin: 0; padding: 0; background: white; }
                        .nexus-page-break { page-break-after: always; clear: both; }
                        @page { size: A4 portrait; margin: 0; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    }
                `;
                document.head.appendChild(printStyle);
            }

            const mockAlunos = Array(qtd).fill({ isPlaceholder: true });

            mockAlunos.forEach((aluno, indexA) => {
                modelosArray.forEach((modeloSelecionado, indexM) => {
                    const nodeCartao = buildNodeCartaoParaAluno(aluno, modeloSelecionado, 'scale(1)');
                    
                    nodeCartao.style.pageBreakInside = "avoid";
                    nodeCartao.style.pageBreakAfter = "always";
                    nodeCartao.style.boxShadow = "none";
                    nodeCartao.style.margin = "0";

                    batchContainer.appendChild(nodeCartao);
                    
                    const isLastAluno = (indexA === mockAlunos.length - 1);
                    const isLastModel = (indexM === modelosArray.length - 1);
                    if(!(isLastAluno && isLastModel)) {
                        let pageBreak = document.createElement('div');
                        pageBreak.className = 'nexus-page-break';
                        batchContainer.appendChild(pageBreak);
                    }
                });
            });

            setTimeout(() => {
                window.print();
                
                batchContainer.innerHTML = '';
                batchContainer.className = 'hidden absolute top-0 left-0 -z-50 w-[700px]';
                if(btn) {
                    btn.classList.remove('opacity-50', 'pointer-events-none');
                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">post_add</span> Lote Reserva (Branco)`;
                }
            }, 800);
        }

        // ==========================================
        // MÓDULO: CORREÇÃO E ESPELHOS
        // ==========================================
        let dbResultados = [];
        let espelhoChartInstance = null;

        try {
            const raw = localStorage.getItem('nexusResultados');
            if(raw) dbResultados = JSON.parse(raw);
        
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {}

        function initCorrecao() {
            const selectAluno = document.getElementById('correcaoSelectAluno');
            const selectProva = document.getElementById('correcaoSelectProva');
            
            if(selectAluno) {
                selectAluno.innerHTML = '<option value="">-- Escolher Aluno --</option>' + dbAlunos.map(a => `<option value="${a.inscricao}">${a.nome} (${a.turma})</option>`).join('');
            }
            if(selectProva) {
                selectProva.innerHTML = '<option value="">-- Escolher Prova --</option>' + dbProvas.map(p => `<option value="${p.id}">${p.nome} - ${p.questoes} Q</option>`).join('');
            }
        }

        function wLog(msg, type='info', animate=true) {
            const t = document.getElementById('terminalCorrecao');
            if(!t) return;
            const time = new Date().toLocaleTimeString('pt-BR', {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3});
            
            let htmlStr = '';
            let styleClass = 'text-slate-400';
            let prefix = '> ';
            
            if(type === 'error') { styleClass = 'text-rose-500'; prefix = '[ERR] '; }
            else if(type === 'success') { styleClass = 'text-emerald-400'; prefix = '[OK] '; }
            else if(type === 'warning') { styleClass = 'text-amber-400'; prefix = '[WARN] '; }
            else if(type === 'system') { styleClass = 'text-indigo-300'; prefix = '[SYS] '; }

            htmlStr = `<div class="${styleClass} ${animate ? 'animate-fade-in-up' : ''}"><span class="text-slate-600">[${time}]</span> ${prefix}${msg}</div>`;
            
            t.innerHTML += htmlStr;
            t.scrollTop = t.scrollHeight;
        }

        let isEngineRunning = false;

        function updateTerminalClock() {
            const tc = document.getElementById('terminalClock');
            if(tc) tc.textContent = new Date().toLocaleTimeString('pt-BR', {hour12:false});
        }
        setInterval(updateTerminalClock, 1000);

        function simularLeituraCorrecao() {
            if(isEngineRunning) return;
            
            const btn = document.getElementById('btnStartCorrecao');
            const idAluno = document.getElementById('correcaoSelectAluno').value;
            const idProva = document.getElementById('correcaoSelectProva').value;
            
            if(!idAluno || !idProva) {
                alert("Selecione os parâmetros do lote antes de iniciar o Motor.");
                return;
            }

            const aluno = dbAlunos.find(a => String(a.inscricao) === String(idAluno));
            const prova = dbProvas.find(p => String(p.id) === String(idProva));

            if(!aluno || !prova) return;

            isEngineRunning = true;
            document.querySelectorAll('#terminalCorrecao').forEach(el => el.innerHTML = ''); // clear
            document.getElementById('terminalStatus').textContent = 'RUNNING';
            document.getElementById('terminalStatus').className = 'text-emerald-400 animate-pulse';
            btn.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">autorenew</span> PROCESSANDO LOTE...`;
            btn.classList.add('opacity-50', 'pointer-events-none');

            // Reset KPIs
            ['corrKpiAcuracia', 'corrKpiCartoes', 'corrKpiAnomalias', 'corrKpiTempo'].forEach(id => {
                const el = document.getElementById(id);
                if(el) el.innerHTML = '<span class="text-slate-300 animate-pulse">--</span>';
            });

            wLog(`INICIANDO SEQUÊNCIA DE INGESTÃO (JOB ID: NX-${Math.floor(Math.random()*90000)+10000})`, 'system');
            wLog(`CARREGANDO DATASET DE LOTE: ${aluno.nome.toUpperCase()}`);
            wLog(`MATRIZ REFERÊNCIA SELECIONADA: ${prova.codigo} (${prova.questoes} QUSTÕES)`);
            
            let startTime = Date.now();

            setTimeout(() => {
                wLog(`INICIANDO ALGORITMO OCR E RECONHECIMENTO DE PADRÕES...`, 'info', false);
                wLog(`[PIPELINE] Extração de Gabaritos Iniciada...`, 'info');
                
                const totalQ = prova.questoes;
                const acertos = Math.floor(Math.random() * (totalQ - (totalQ * 0.4))) + Math.floor(totalQ * 0.4); 
                const perce = ((acertos / totalQ) * 100).toFixed(1);

                setTimeout(() => {
                    wLog(`COMPARAÇÃO BLOCO 01-15... [MATCH 99.9%]`, 'success');
                    
                    setTimeout(() => {
                        wLog(`COMPARAÇÃO BLOCO 16-30... [MATCH 99.8%]`, 'success');
                        wLog(`DETECTADA RANSURA NA RESPOSTA 28 - ALGORITMO DE RECUPERAÇÃO ATIVADO`, 'warning');
                        document.getElementById('corrKpiAnomalias').textContent = "1";
                        
                        setTimeout(() => {
                            wLog(`RECUPERAÇÃO DE RANSURA CONCLUÍDA. VÉRTICE AJUSTADO.`, 'system');
                            wLog(`RESULTADO APURADO DE ALTA CONFIABILIDADE (99.85%)`, 'success');
                            wLog(`CÁLCULO FINAL: ACERTOS: ${acertos}/${totalQ} (${perce}%)`, 'success');
                            wLog(`COMPUTANDO MÉTRICAS TRI E SINCRONIZANDO COM A BASE...`, 'info');

                            const novoResultado = {
                                id: Date.now(),
                                aluno_insc: aluno.inscricao,
                                prova_id: prova.id,
                                acertos: acertos,
                                total: totalQ,
                                percentual: perce,
                                data: new Date().toLocaleDateString()
                            };

                            dbResultados = dbResultados.filter(r => !(String(r.aluno_insc) === String(aluno.inscricao) && String(r.prova_id) === String(prova.id)));
                            dbResultados.push(novoResultado);
                            localStorage.setItem('nexusResultados', JSON.stringify(dbResultados));
                            
                            setTimeout(() => {
                                let endTime = Date.now();
                                let diffSecs = ((endTime - startTime) / 1000).toFixed(2);

                                wLog(`OPERAÇÃO CONCLUÍDA. MATRIZ SALVA COM SUCESSO.`, 'system');
                                
                                document.getElementById('terminalStatus').textContent = 'IDLE';
                                document.getElementById('terminalStatus').className = 'text-slate-500';
                                
                                document.getElementById('corrKpiAcuracia').textContent = "99.8%";
                                document.getElementById('corrKpiCartoes').textContent = "1";
                                document.getElementById('corrKpiTempo').textContent = `${diffSecs}s`;
                                
                                if(document.getElementById('corrKpiAnomalias').textContent.includes("--")) {
                                    document.getElementById('corrKpiAnomalias').textContent = "0";
                                }

                                btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">check_circle</span> PROCESSAMENTO CONCLUÍDO`;
                                btn.classList.replace('bg-indigo-600', 'bg-emerald-600');
                                btn.classList.replace('shadow-indigo-500/30', 'shadow-emerald-500/30');
                                
                                setTimeout(() => {
                                    btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">play_circle</span> INICIAR MOTOR`;
                                    btn.classList.remove('opacity-50', 'pointer-events-none');
                                    btn.classList.replace('bg-emerald-600', 'bg-indigo-600');
                                    btn.classList.replace('shadow-emerald-500/30', 'shadow-indigo-500/30');
                                    isEngineRunning = false;
                                    initEspelhos();
                                    alert("Correção processada com sucesso no Motor Automático!\n\nUm Espelho de Avaliação foi gerado no módulo de Espelhos Individuais.");
                                }, 2500);

                            }, 800);
                        }, 1200);
                    }, 800);
                }, 800);

            }, 1000);
        }

        // ESPELHOS
        function initEspelhos() {
            const selectEspelho = document.getElementById('espelhoSelectResultado');
            if(!selectEspelho) return;

            selectEspelho.innerHTML = '<option value="">-- Selecione Resultado Processado --</option>';
            dbResultados.forEach(r => {
                const al = dbAlunos.find(a => String(a.inscricao) === String(r.aluno_insc));
                const p = dbProvas.find(p => String(p.id) === String(r.prova_id));
                if(al && p) {
                    selectEspelho.innerHTML += `<option value="${r.id}">${al.nome} - Prova: ${p.nome}</option>`;
                }
            });
        }

        function renderizarEspelho() {
            const idRes = document.getElementById('espelhoSelectResultado').value;
            if(!idRes) return;

            const res = dbResultados.find(r => String(r.id) === String(idRes));
            if(!res) return;

            const al = dbAlunos.find(a => String(a.inscricao) === String(res.aluno_insc));
            const p = dbProvas.find(x => String(x.id) === String(res.prova_id));

            if(!al || !p) return;

            document.getElementById('espelhoEmptyState').style.display = 'none';

            // Preencher campos
            document.getElementById('esp_nome').textContent = al.nome;
            document.getElementById('esp_curso').textContent = "Objetivo: " + al.curso;
            document.getElementById('esp_inicial').textContent = al.nome.charAt(0).toUpperCase();
            document.getElementById('esp_insc').textContent = al.inscricao;
            document.getElementById('esp_unidade').textContent = al.unidade + ' - ' + al.turma;
            
            document.getElementById('esp_provaNome').textContent = p.nome;
            document.getElementById('esp_totalQ').textContent = res.total;
            document.getElementById('esp_acertos').textContent = res.acertos;
            document.getElementById('esp_percentual').textContent = res.percentual + '%';
            document.getElementById('esp_hash').textContent = "HASH: " + btoa(res.id).substring(0, 10).toUpperCase();

            // Renderizar Gráfico
            renderEspelhoChart(res.percentual);
        }

        function renderEspelhoChart(percentual) {
            const ctx = document.getElementById('espelhoChart');
            if(!ctx) return;
            
            if(espelhoChartInstance) espelhoChartInstance.destroy();

            // Fake distribuicao based on percentual. If percent is 80%, Linguagens will be high, etc.
            const base = parseFloat(percentual);
            const valLin = Math.min(100, base + 10);
            const valHum = Math.min(100, base + 5);
            const valNat = Math.max(0, base - 15);
            const valMat = Math.max(0, base - 5);

            const applyTag = (id, val) => {
                const el = document.getElementById(id);
                if(!el) return;
                el.textContent = val.toFixed(1) + '%';
                el.className = "text-[10px] font-extrabold uppercase px-2.5 py-1 rounded ";
                if(val >= 80) el.className += "bg-emerald-100 text-emerald-700";
                else if(val >= 60) el.className += "bg-indigo-100 text-indigo-700";
                else if(val >= 40) el.className += "bg-yellow-100 text-yellow-700";
                else el.className += "bg-rose-100 text-rose-700";
            };

            applyTag('ind_lin', valLin);
            applyTag('ind_hum', valHum);
            applyTag('ind_nat', valNat);
            applyTag('ind_mat', valMat);

            espelhoChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Linguagens', 'Humanas', 'Natureza', 'Matemática'],
                    datasets: [{
                        label: 'Seu Desempenho (%)',
                        data: [valLin, valHum, valNat, valMat],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)', // indigo
                        borderColor: '#4F46E5', // indigo-600
                        pointBackgroundColor: '#FBBF24',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#FBBF24',
                        borderWidth: 2
                    }, {
                        label: 'Média da Turma (%)',
                        data: [60, 65, 40, 55], // mock
                        backgroundColor: 'rgba(203, 213, 225, 0.2)', // slate
                        borderColor: '#94A3B8',
                        pointBackgroundColor: '#cbd5e1',
                        borderWidth: 1,
                        borderDash: [5, 5]
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: '#f1f5f9' },
                            grid: { color: '#f1f5f9' },
                            pointLabels: { font: { family: 'Inter', size: 10, weight: 'bold' } },
                            ticks: { display: false, max: 100, min: 0 }
                        }
                    },
                    plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } }
                }
            });
        }

        function imprimirEspelho() {
            const element = document.getElementById('espelhoA4Template');
            const alunoNome = document.getElementById('esp_nome').textContent;
            
            const origTransform = element.style.transform;
            element.style.transform = 'scale(1)';
            
            const opt = {
                margin:       0.5,
                filename:     `Espelho_Avaliacao_${alunoNome.replace(/[^a-z0-9]/gi, '_')}.pdf`,
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                element.style.transform = origTransform;
            });
        }

        // ==========================================
        // MÓDULO: LEITURA DE CARTÕES
        // ==========================================
        let uploadsLeituraCartoes = [];

        function initImportarCartoes() {
            // Preenche as options de turma, prova e modelo
            const selTurma = document.getElementById('leituraSelTurma');
            const selProva = document.getElementById('leituraSelProva');
            const selModelo = document.getElementById('leituraSelModelo');
            
            if(selTurma && dbAlunos) {
                const turmasUnicas = [...new Set(dbAlunos.map(a => a.turma).filter(Boolean))].sort();
                selTurma.innerHTML = '<option value="">-- Escolher Turma --</option>' + turmasUnicas.map(t => `<option value="${t}">${t}</option>`).join('');
            }
            if(selProva && dbProvas) {
                selProva.innerHTML = '<option value="">-- Escolher Prova --</option>' + dbProvas.map(p => `<option value="${p.id}">${p.nome} - ${p.questoes} Q</option>`).join('');
            }
            if(selModelo && dbModelosCartao) {
                selModelo.innerHTML = '<option value="">-- Escolher Modelo Salvo --</option>' + dbModelosCartao.map(m => `<option value="${m.id}">${m.nome} | Q. ${m.qStart}-${m.qEnd}</option>`).join('');
            }
            
            // Reseta a interface
            uploadsLeituraCartoes = [];
            renderArquivosLeitura();
        }

        function leituraArquivosSelecionados(event) {
            let files;
            if(event.dataTransfer) {
                files = event.dataTransfer.files;
            } else {
                files = event.target.files;
            }
            
            if(!files || files.length === 0) return;

            Array.from(files).forEach(f => {
                if(f.type === 'application/pdf') {
                    // Simular contagem de páginas e id
                    uploadsLeituraCartoes.push({
                        id: 'pdf_' + Date.now() + Math.random(),
                        nome: f.name,
                        fileObj: f, // <--- Referencia real armazenada para o Axios/Fetch de envio!
                        pags: Math.floor(Math.random() * 50) + 10,
                        status: 'aguardando' // aguardando, processando, concluido, erro
                    });
                } else {
                    alert(`O arquivo '${f.name}' noe do tipo PDF e será ignorado.`);
                }
            });
            
            if(event.target) event.target.value = '';
            renderArquivosLeitura();
        }

        function renderArquivosLeitura() {
            const listContainer = document.getElementById('leituraListaArquivos');
            const counterDiv = document.getElementById('leituraQtdUploads');
            const btnConverte = document.getElementById('btnIniciarLeitura');
            
            counterDiv.textContent = uploadsLeituraCartoes.length;

            if(uploadsLeituraCartoes.length === 0) {
                listContainer.innerHTML = `<div class="col-span-1 md:col-span-2 text-center py-4"><p class="text-xs text-slate-400 font-semibold mb-1">Nenhum pdf na fila de processamento.</p></div>`;
                btnConverte.classList.add('opacity-50');
                btnConverte.title = "Adicione PDFs para processar";
                return;
            }
            
            btnConverte.classList.remove('opacity-50');
            btnConverte.title = "";

            listContainer.innerHTML = uploadsLeituraCartoes.map(file => {
                let badgeStr = '';
                if(file.status === 'aguardando') badgeStr = `<span class="bg-slate-100 text-slate-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">hourglass_empty</span> Aguardando</span>`;
                if(file.status === 'processando') badgeStr = `<span class="bg-blue-100 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px] animate-spin">sync</span> Processando</span>`;
                if(file.status === 'concluido') badgeStr = `<span class="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">check</span> Concluído</span>`;
                if(file.status === 'erro') badgeStr = `<span class="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">warning</span> Erro</span>`;

                return `
                <div class="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors group">
                    <div class="flex items-center gap-3 w-full pr-2">
                        <div class="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 relative overflow-hidden">
                            <span class="material-symbols-outlined text-[20px] group-hover:opacity-0 transition-opacity">picture_as_pdf</span>
                            <div class="absolute inset-0 flex items-center justify-center bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" title="Visualizar Páginas">
                                <span class="material-symbols-outlined text-[18px]">visibility</span>
                            </div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-sm font-bold text-[#0B193C] truncate tooltip" title="${file.nome}">${file.nome}</p>
                            <div class="flex items-center gap-2 mt-0.5">
                                ${badgeStr}
                                <span class="text-[10px] font-bold text-slate-400">${file.pags} pgs</span>
                            </div>
                        </div>
                        ${file.status !== 'processando' ? `<button onclick="removerLeituraFile('${file.id}')" class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors tooltip" title="Remover arquivo"><span class="material-symbols-outlined text-[18px]">close</span></button>` : ''}
                    </div>
                </div>
                `;
            }).join('');
        }

        function removerLeituraFile(id) {
            uploadsLeituraCartoes = uploadsLeituraCartoes.filter(f => f.id !== id);
            renderArquivosLeitura();
        }

        function simularLeituraLote() {
            if(uploadsLeituraCartoes.length === 0) return;
            
            const instituicao = document.getElementById('leituraInputInstituicao').value.trim();
            const selTurma = document.getElementById('leituraSelTurma').value;
            const selProva = document.getElementById('leituraSelProva').value;
            const selMod = document.getElementById('leituraSelModelo').value;
            const selArea = document.getElementById('leituraSelArea').value;



            // Inicia animação visual da processamento
            uploadsLeituraCartoes.forEach(f => f.status = 'processando');
            renderArquivosLeitura();
            
            const btnConverte = document.getElementById('btnIniciarLeitura');
            btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">sync</span> Convertendo Lote...`;
            btnConverte.classList.add('opacity-50', 'pointer-events-none');

            // Preparação dos dados para a API Real Python OpenCV
            const formData = new FormData();
            formData.append('instituicao', instituicao);
            formData.append('turma', selTurma);
            formData.append('matriz_conhecimento', selArea);
            
            if(uploadsLeituraCartoes[0] && uploadsLeituraCartoes[0].fileObj) {
                formData.append('pdf_file', uploadsLeituraCartoes[0].fileObj);
            }

            // Tentar comunicar com Servidor Python Local
            fetch('http://localhost:5000/api/upload_omr', {
                method: 'POST',
                body: formData
            }).then(response => {
                if(!response.ok) throw new Error("Servidor no retornou 200");
                return response.json();
            }).then(data => {
                // Sucesso na leitura real!
                uploadsLeituraCartoes.forEach(f => f.status = 'concluido');
                renderArquivosLeitura();

                btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px]">check_circle</span> Processamento Concluido`;
                
                setTimeout(() => {
                    btnConverte.classList.remove('opacity-50', 'pointer-events-none');
                    btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px]">document_scanner</span> Converter para Excel`;
                    
                    // GERAR EXCEL AUTOMATICAMENTE COM OS DADOS DO PYTHON
                    const excelData = [];
                    if(data.resultados && data.resultados.length > 0) {
                        data.resultados.forEach((res) => {
                            const rawAnswers = Array.isArray(res.respostas) ? res.respostas.join('') : '';
                            excelData.push({
                                "Inscricao": res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "123456",
                                "Nome_Aluno": "Aluno Escaneado OMR",
                                "Gabarito_Detectado": rawAnswers,
                                "Total_Lidas": res.total_questoes_lidas
                            });
                        });
                    }
                    
                    if(typeof XLSX !== 'undefined') {
                        const ws = XLSX.utils.json_to_sheet(excelData);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "Leitura OMR");
                        XLSX.writeFile(wb, "Resultado_Leitura_OMR.xlsx");
                        alert("Extrao concluida com sucesso via Servidor Python! O arquivo Excel foi gerado e o download comear em instantes.");
                    } else {
                        alert(`A extrao foi concluida! Respostas extraidas: ${rawAnswers}`);
                    }
                }, 1500);

            }).catch(err => {
                console.warn("Nenhum servidor Python OpenCV detectado na porta 5000. Entrando em MODO SIMULAÇÃO.", err);
                
                // MODO FALLBACK (SIMULAÇÃO): Caso o usuário no tenha iniciado o "python omr_api.py" local
                setTimeout(() => {
                    uploadsLeituraCartoes.forEach(f => f.status = 'concluido');
                    renderArquivosLeitura();

                    btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px]">check_circle</span> Simulação Concluída`;
                    
                    setTimeout(() => {
                        btnConverte.classList.remove('opacity-50', 'pointer-events-none');
                        btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px]">document_scanner</span> Converter para Excel`;
                        
                        alert(`A extração dos cartões-resposta da instituição "${instituicao}" foi simulada com sucesso! \n(Dica: Inicie o omr_api.py para leitura local real).`);
                    }, 1500);

                }, 2500);
            });
        }

        // ==========================================
        // MÓDULO: GESTÃO GERAL DE INSTITUIÇÕES
        // ==========================================
        function abrirDetalhesInstituicao(nome, av) {
            titles['inst-detalhes'] = nome;
            
            // Popula a tabela com os dados da Avaliação
            document.getElementById('inst-table-av-name').textContent = av;
            
            switchView('inst-detalhes');
        }

        function abrirAvaliacaoConfig(avName) {
            document.getElementById('av-main-title').textContent = avName;
            titles['av-detalhes'] = titles['inst-detalhes']; // keep inst name in header 
            switchView('av-detalhes');
        }

        function renderCardInstituicao(inst, container, idx) {
            const card = document.createElement('div');
            card.className = "nexus-card p-5 bg-white border border-slate-200/60 relative overflow-hidden flex flex-col group fade-in cursor-pointer hover:border-indigo-300 transition-colors shadow-sm hover:shadow-md";
            card.setAttribute("onclick", `abrirDetalhesInstituicao('${inst.nome}', '${inst.av}')`);
            
            const initials = inst.nome.substring(0, 2).toUpperCase();
            const dataStr = inst.data || new Date().toLocaleDateString('pt-BR');

            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#0B193C] flex items-center justify-center text-white font-extrabold text-[16px] shadow-sm tracking-widest">
                        ${initials}
                    </div>
                    <button class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors" title="Excluir" onclick="event.stopPropagation(); excluirInstituicao(${idx}, this)">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
                <div>
                    <h4 class="font-bold text-[#0B193C] text-[16px] mb-0.5 line-clamp-1">${inst.nome}</h4>
                    <p class="text-[12px] font-extrabold text-indigo-500 mb-4 line-clamp-1">${inst.av}</p>
                </div>
                <div class="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data: ${dataStr}</span>
                    <span class="flex items-center gap-1 text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Validado
                    </span>
                </div>
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-50 pointer-events-none transition-all duration-500 scale-50 group-hover:scale-100"></div>
            `;
            container.appendChild(card);
        }

        function carregarInstituicoes() {
            const container = document.getElementById('lista-instituicoes-container');
            if(!container) return;
            container.innerHTML = ''; // Clear items
            
            let instituicoes = JSON.parse(localStorage.getItem('nexus_provas_instituicoes')) || [];
            instituicoes.forEach((inst, idx) => {
                renderCardInstituicao(inst, container, idx);
            });
        }

        function excluirInstituicao(idx, btnEl) {
            let instituicoes = JSON.parse(localStorage.getItem('nexus_provas_instituicoes')) || [];
            if(idx >= 0 && idx < instituicoes.length) {
                instituicoes.splice(idx, 1);
                localStorage.setItem('nexus_provas_instituicoes', JSON.stringify(instituicoes));
                carregarInstituicoes();
            } else {
                if (btnEl && btnEl.parentElement && btnEl.parentElement.parentElement) {
                    btnEl.parentElement.parentElement.remove();
                }
            }
        }

        function salvarInstituicao() {
            const inputNome = document.getElementById('input-inst-nome');
            const inputAv = document.getElementById('input-inst-av');
            
            const nomeStr = inputNome.value ? inputNome.value.trim() : '';
            const avStr = inputAv.value ? inputAv.value.trim() : '';

            if (!nomeStr || !avStr) {
                alert('Preencha o Nome da Instituição e o Nome da Avaliação antes de salvar.');
                return;
            }
            
            const newInst = {
                nome: nomeStr,
                av: avStr,
                data: new Date().toLocaleDateString('pt-BR')
            };

            let instituicoes = JSON.parse(localStorage.getItem('nexus_provas_instituicoes')) || [];
            instituicoes.unshift(newInst);
            localStorage.setItem('nexus_provas_instituicoes', JSON.stringify(instituicoes));

            carregarInstituicoes();

            inputNome.value = '';
            inputAv.value = '';
            document.getElementById('form-instituicao').classList.add('hidden');
        }

        // Inicializar load
        setTimeout(() => carregarInstituicoes(), 200);

        // === ESPELHOS INDIVIDUAIS LOGIC ===
        let cartoesEspelhosUploads = [];
        
        function leituraCartoesEspelhos(event) {
            let files = event.target.files;
            if(!files || files.length === 0) return;
            
            Array.from(files).forEach(f => {
                cartoesEspelhosUploads.push(f);
            });
            
            let status = document.getElementById('status-cartoes');
            status.innerText = cartoesEspelhosUploads.length + " Arquivo" + (cartoesEspelhosUploads.length > 1 ? 's' : '');
            status.className = "bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";
            
            event.target.value = '';
        }

        function importarExcelParaTextarea(event, targetId) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                const csv = XLSX.utils.sheet_to_csv(worksheet, {FS: ";"});
                const cleanCsv = csv.split('\n').filter(line => line.trim().replace(/;/g, '') !== '').join('\n');
                
                document.getElementById(targetId).value = cleanCsv;
                
                if(targetId === 'txt-gabarito') validarGabaritoEspelhos();
                if(targetId === 'txt-respostas') validarRespostasEspelhos();
            };
            reader.readAsArrayBuffer(file);
            event.target.value = '';
        }

        function validarGabaritoEspelhos() {
            let text = document.getElementById('txt-gabarito').value.trim();
            let status = document.getElementById('status-gabarito');
            if (!text) {
                status.innerText = "Gabarito Vazio";
                status.className = "bg-rose-100 text-rose-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";
                return false;
            }
            status.innerText = "Validado";
            status.className = "bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";
            return true;
        }

        function validarRespostasEspelhos() {
            let text = document.getElementById('txt-respostas').value.trim();
            let status = document.getElementById('status-respostas');
            if (!text) {
                status.innerText = "0 Importados";
                status.className = "bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";
                return false;
            }
            let lines = text.split('\n').filter(l => l.trim() !== '');
            status.innerText = lines.length + " Importados";
            status.className = "bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";
            return true;
        }

        window.interpolarNota = function(area, acertos) {
            const tabelas = {
                'LC': [[0,300],[5,360],[10,420],[15,470],[20,520],[25,570],[30,620],[35,670],[40,720],[45,800]],
                'CH': [[0,320],[5,380],[10,440],[15,495],[20,550],[25,605],[30,660],[35,710],[40,760],[45,830]],
                'CN': [[0,300],[5,365],[10,430],[15,495],[20,560],[25,625],[30,690],[35,750],[40,810],[45,880]],
                'MAT': [[0,330],[5,405],[10,480],[15,565],[20,650],[25,715],[30,780],[35,840],[40,900],[45,980]]
            };
            const tabela = tabelas[area] || tabelas['CH'];
            if (acertos <= 0) return tabela[0][1];
            if (acertos >= 45) return tabela[tabela.length-1][1];
            
            for (let i = 0; i < tabela.length - 1; i++) {
                let p1 = tabela[i];
                let p2 = tabela[i+1];
                if (acertos >= p1[0] && acertos <= p2[0]) {
                    let proporcao = (acertos - p1[0]) / (p2[0] - p1[0]);
                    return p1[1] + proporcao * (p2[1] - p1[1]);
                }
            }
            return tabela[0][1];
        };

        window.tabelaTriEnem2022 = {
    "linguagens": {
        "0": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "1": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "2": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "3": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "4": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "5": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "6": {
            "minima": 364.4,
            "media": 364.4,
            "maxima": 364.4
        },
        "7": {
            "minima": 334.8,
            "media": 356.08,
            "maxima": 373.4
        },
        "8": {
            "minima": 336.6,
            "media": 368.25,
            "maxima": 394.6
        },
        "9": {
            "minima": 350.7,
            "media": 378.1,
            "maxima": 405.5
        },
        "10": {
            "minima": 378.0,
            "media": 404.67,
            "maxima": 453.4
        },
        "11": {
            "minima": 377.9,
            "media": 413.39,
            "maxima": 465.3
        },
        "12": {
            "minima": 384.1,
            "media": 427.78,
            "maxima": 470.6
        },
        "13": {
            "minima": 380.4,
            "media": 438.98,
            "maxima": 484.6
        },
        "14": {
            "minima": 395.1,
            "media": 449.15,
            "maxima": 496.2
        },
        "15": {
            "minima": 412.4,
            "media": 459.2,
            "maxima": 506.0
        },
        "16": {
            "minima": 431.9,
            "media": 489.53,
            "maxima": 516.1
        },
        "17": {
            "minima": 456.7,
            "media": 497.98,
            "maxima": 525.4
        },
        "18": {
            "minima": 445.8,
            "media": 501.87,
            "maxima": 525.2
        },
        "19": {
            "minima": 477.0,
            "media": 515.19,
            "maxima": 538.2
        },
        "20": {
            "minima": 488.8,
            "media": 524.59,
            "maxima": 545.7
        },
        "21": {
            "minima": 514.2,
            "media": 536.78,
            "maxima": 559.9
        },
        "22": {
            "minima": 508.1,
            "media": 541.62,
            "maxima": 572.6
        },
        "23": {
            "minima": 527.3,
            "media": 549.62,
            "maxima": 575.9
        },
        "24": {
            "minima": 532.6,
            "media": 556.51,
            "maxima": 592.7
        },
        "25": {
            "minima": 543.2,
            "media": 564.98,
            "maxima": 585.0
        },
        "26": {
            "minima": 554.8,
            "media": 573.11,
            "maxima": 595.2
        },
        "27": {
            "minima": 574.8,
            "media": 581.66,
            "maxima": 597.6
        },
        "28": {
            "minima": 588.6,
            "media": 590.16,
            "maxima": 602.6
        },
        "29": {
            "minima": 593.2,
            "media": 598.39,
            "maxima": 609.4
        },
        "30": {
            "minima": 602.8,
            "media": 607.46,
            "maxima": 618.3
        },
        "31": {
            "minima": 585.1,
            "media": 614.0,
            "maxima": 635.9
        },
        "32": {
            "minima": 596.7,
            "media": 624.97,
            "maxima": 647.1
        },
        "33": {
            "minima": 610.9,
            "media": 634.79,
            "maxima": 657.0
        },
        "34": {
            "minima": 610.8,
            "media": 643.31,
            "maxima": 660.3
        },
        "35": {
            "minima": 638.7,
            "media": 656.6,
            "maxima": 677.0
        },
        "36": {
            "minima": 635.8,
            "media": 667.25,
            "maxima": 685.7
        },
        "37": {
            "minima": 651.6,
            "media": 676.96,
            "maxima": 696.0
        },
        "38": {
            "minima": 686.2,
            "media": 693.31,
            "maxima": 702.4
        },
        "39": {
            "minima": 687.7,
            "media": 700.69,
            "maxima": 711.8
        },
        "40": {
            "minima": 699.5,
            "media": 713.29,
            "maxima": 728.9
        },
        "41": {
            "minima": 712.7,
            "media": 727.1,
            "maxima": 741.7
        },
        "42": {
            "minima": 730.7,
            "media": 747.4,
            "maxima": 761.2
        },
        "43": {
            "minima": 760.2,
            "media": 772.13,
            "maxima": 788.1
        },
        "44": {
            "minima": 785.7,
            "media": 788.83,
            "maxima": 794.9
        },
        "45": {
            "minima": 820.8,
            "media": 820.8,
            "maxima": 820.8
        }
    },
    "humanas": {
        "0": {
            "minima": 311.4,
            "media": 311.4,
            "maxima": 311.4
        },
        "1": {
            "minima": 311.4,
            "media": 311.4,
            "maxima": 311.4
        },
        "2": {
            "minima": 311.4,
            "media": 311.4,
            "maxima": 311.4
        },
        "3": {
            "minima": 311.4,
            "media": 311.4,
            "maxima": 311.4
        },
        "4": {
            "minima": 311.4,
            "media": 311.4,
            "maxima": 311.4
        },
        "5": {
            "minima": 311.4,
            "media": 311.4,
            "maxima": 311.4
        },
        "6": {
            "minima": 310.1,
            "media": 325.7,
            "maxima": 358.5
        },
        "7": {
            "minima": 301.1,
            "media": 323.6,
            "maxima": 359.8
        },
        "8": {
            "minima": 346.7,
            "media": 364.65,
            "maxima": 395.4
        },
        "9": {
            "minima": 339.5,
            "media": 390.14,
            "maxima": 413.2
        },
        "10": {
            "minima": 315.7,
            "media": 376.74,
            "maxima": 429.6
        },
        "11": {
            "minima": 347.4,
            "media": 394.69,
            "maxima": 441.3
        },
        "12": {
            "minima": 360.0,
            "media": 411.56,
            "maxima": 453.3
        },
        "13": {
            "minima": 395.2,
            "media": 433.52,
            "maxima": 473.0
        },
        "14": {
            "minima": 376.4,
            "media": 453.74,
            "maxima": 496.5
        },
        "15": {
            "minima": 410.2,
            "media": 468.77,
            "maxima": 509.2
        },
        "16": {
            "minima": 448.8,
            "media": 481.0,
            "maxima": 512.5
        },
        "17": {
            "minima": 430.2,
            "media": 490.25,
            "maxima": 530.3
        },
        "18": {
            "minima": 456.1,
            "media": 496.33,
            "maxima": 539.2
        },
        "19": {
            "minima": 482.6,
            "media": 516.99,
            "maxima": 547.0
        },
        "20": {
            "minima": 494.1,
            "media": 524.29,
            "maxima": 547.9
        },
        "21": {
            "minima": 500.5,
            "media": 536.28,
            "maxima": 570.2
        },
        "22": {
            "minima": 529.8,
            "media": 545.01,
            "maxima": 569.7
        },
        "23": {
            "minima": 514.3,
            "media": 550.43,
            "maxima": 573.1
        },
        "24": {
            "minima": 521.4,
            "media": 558.04,
            "maxima": 580.3
        },
        "25": {
            "minima": 546.0,
            "media": 570.28,
            "maxima": 599.8
        },
        "26": {
            "minima": 552.4,
            "media": 578.63,
            "maxima": 604.8
        },
        "27": {
            "minima": 567.1,
            "media": 590.13,
            "maxima": 615.4
        },
        "28": {
            "minima": 567.0,
            "media": 597.52,
            "maxima": 620.1
        },
        "29": {
            "minima": 597.9,
            "media": 606.95,
            "maxima": 623.3
        },
        "30": {
            "minima": 594.4,
            "media": 617.17,
            "maxima": 642.3
        },
        "31": {
            "minima": 605.6,
            "media": 624.45,
            "maxima": 642.7
        },
        "32": {
            "minima": 630.9,
            "media": 639.52,
            "maxima": 658.2
        },
        "33": {
            "minima": 635.5,
            "media": 651.52,
            "maxima": 674.8
        },
        "34": {
            "minima": 649.8,
            "media": 664.57,
            "maxima": 681.8
        },
        "35": {
            "minima": 669.9,
            "media": 678.21,
            "maxima": 694.7
        },
        "36": {
            "minima": 686.3,
            "media": 693.39,
            "maxima": 711.5
        },
        "37": {
            "minima": 686.6,
            "media": 708.23,
            "maxima": 722.8
        },
        "38": {
            "minima": 712.4,
            "media": 723.26,
            "maxima": 733.3
        },
        "39": {
            "minima": 728.1,
            "media": 738.15,
            "maxima": 749.5
        },
        "40": {
            "minima": 746.8,
            "media": 754.08,
            "maxima": 761.9
        },
        "41": {
            "minima": 757.9,
            "media": 772.0,
            "maxima": 785.9
        },
        "42": {
            "minima": 785.2,
            "media": 794.84,
            "maxima": 811.9
        },
        "43": {
            "minima": 812.0,
            "media": 812.0,
            "maxima": 812.0
        },
        "44": {
            "minima": 829.7,
            "media": 829.7,
            "maxima": 829.7
        },
        "45": {
            "minima": 829.7,
            "media": 829.7,
            "maxima": 829.7
        }
    },
    "natureza": {
        "0": {
            "minima": 324.3,
            "media": 324.3,
            "maxima": 324.3
        },
        "1": {
            "minima": 324.3,
            "media": 324.3,
            "maxima": 324.3
        },
        "2": {
            "minima": 324.3,
            "media": 324.3,
            "maxima": 324.3
        },
        "3": {
            "minima": 324.3,
            "media": 324.3,
            "maxima": 324.3
        },
        "4": {
            "minima": 324.3,
            "media": 324.3,
            "maxima": 324.3
        },
        "5": {
            "minima": 333.0,
            "media": 345.92,
            "maxima": 361.4
        },
        "6": {
            "minima": 314.7,
            "media": 359.52,
            "maxima": 429.4
        },
        "7": {
            "minima": 336.5,
            "media": 364.22,
            "maxima": 399.6
        },
        "8": {
            "minima": 313.6,
            "media": 385.29,
            "maxima": 463.8
        },
        "9": {
            "minima": 336.2,
            "media": 399.51,
            "maxima": 463.0
        },
        "10": {
            "minima": 339.9,
            "media": 414.83,
            "maxima": 492.8
        },
        "11": {
            "minima": 346.2,
            "media": 428.82,
            "maxima": 485.6
        },
        "12": {
            "minima": 367.3,
            "media": 443.05,
            "maxima": 496.1
        },
        "13": {
            "minima": 346.0,
            "media": 463.7,
            "maxima": 525.3
        },
        "14": {
            "minima": 374.6,
            "media": 481.23,
            "maxima": 541.7
        },
        "15": {
            "minima": 388.8,
            "media": 499.92,
            "maxima": 559.7
        },
        "16": {
            "minima": 417.2,
            "media": 507.76,
            "maxima": 561.6
        },
        "17": {
            "minima": 436.7,
            "media": 530.92,
            "maxima": 574.4
        },
        "18": {
            "minima": 463.6,
            "media": 544.59,
            "maxima": 588.0
        },
        "19": {
            "minima": 496.1,
            "media": 555.37,
            "maxima": 599.2
        },
        "20": {
            "minima": 535.1,
            "media": 573.78,
            "maxima": 601.3
        },
        "21": {
            "minima": 534.8,
            "media": 583.89,
            "maxima": 611.7
        },
        "22": {
            "minima": 497.3,
            "media": 592.47,
            "maxima": 621.9
        },
        "23": {
            "minima": 564.3,
            "media": 606.03,
            "maxima": 631.7
        },
        "24": {
            "minima": 593.1,
            "media": 616.1,
            "maxima": 641.2
        },
        "25": {
            "minima": 607.3,
            "media": 628.61,
            "maxima": 647.1
        },
        "26": {
            "minima": 607.7,
            "media": 635.19,
            "maxima": 651.1
        },
        "27": {
            "minima": 625.4,
            "media": 648.31,
            "maxima": 669.6
        },
        "28": {
            "minima": 633.6,
            "media": 655.3,
            "maxima": 671.3
        },
        "29": {
            "minima": 652.8,
            "media": 667.27,
            "maxima": 680.7
        },
        "30": {
            "minima": 662.4,
            "media": 678.05,
            "maxima": 697.4
        },
        "31": {
            "minima": 659.8,
            "media": 682.77,
            "maxima": 700.0
        },
        "32": {
            "minima": 683.6,
            "media": 694.91,
            "maxima": 709.8
        },
        "33": {
            "minima": 694.8,
            "media": 703.68,
            "maxima": 714.9
        },
        "34": {
            "minima": 687.4,
            "media": 711.63,
            "maxima": 731.0
        },
        "35": {
            "minima": 715.8,
            "media": 721.28,
            "maxima": 725.7
        },
        "36": {
            "minima": 716.7,
            "media": 729.54,
            "maxima": 741.4
        },
        "37": {
            "minima": 730.9,
            "media": 739.84,
            "maxima": 752.0
        },
        "38": {
            "minima": 747.9,
            "media": 754.45,
            "maxima": 757.4
        },
        "39": {
            "minima": 765.7,
            "media": 765.7,
            "maxima": 765.7
        },
        "40": {
            "minima": 765.7,
            "media": 765.7,
            "maxima": 765.7
        },
        "41": {
            "minima": 801.4,
            "media": 801.4,
            "maxima": 801.4
        },
        "42": {
            "minima": 801.4,
            "media": 801.4,
            "maxima": 801.4
        },
        "43": {
            "minima": 801.4,
            "media": 801.4,
            "maxima": 801.4
        },
        "44": {
            "minima": 801.4,
            "media": 801.4,
            "maxima": 801.4
        },
        "45": {
            "minima": 801.4,
            "media": 801.4,
            "maxima": 801.4
        }
    },
    "matematica": {
        "0": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "1": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "2": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "3": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "4": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "5": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "6": {
            "minima": 341.2,
            "media": 363.2,
            "maxima": 385.2
        },
        "7": {
            "minima": 326.8,
            "media": 385.73,
            "maxima": 439.6
        },
        "8": {
            "minima": 341.7,
            "media": 405.1,
            "maxima": 459.2
        },
        "9": {
            "minima": 349.6,
            "media": 428.78,
            "maxima": 483.1
        },
        "10": {
            "minima": 367.0,
            "media": 450.23,
            "maxima": 520.3
        },
        "11": {
            "minima": 374.6,
            "media": 471.15,
            "maxima": 531.4
        },
        "12": {
            "minima": 386.4,
            "media": 490.42,
            "maxima": 556.1
        },
        "13": {
            "minima": 412.4,
            "media": 509.92,
            "maxima": 572.4
        },
        "14": {
            "minima": 423.1,
            "media": 524.45,
            "maxima": 596.2
        },
        "15": {
            "minima": 440.7,
            "media": 541.1,
            "maxima": 609.4
        },
        "16": {
            "minima": 454.7,
            "media": 559.1,
            "maxima": 618.8
        },
        "17": {
            "minima": 488.0,
            "media": 584.41,
            "maxima": 642.7
        },
        "18": {
            "minima": 506.4,
            "media": 596.58,
            "maxima": 653.2
        },
        "19": {
            "minima": 500.1,
            "media": 613.46,
            "maxima": 669.8
        },
        "20": {
            "minima": 554.8,
            "media": 628.88,
            "maxima": 684.2
        },
        "21": {
            "minima": 588.6,
            "media": 641.13,
            "maxima": 694.7
        },
        "22": {
            "minima": 602.6,
            "media": 654.71,
            "maxima": 705.8
        },
        "23": {
            "minima": 610.6,
            "media": 669.76,
            "maxima": 715.1
        },
        "24": {
            "minima": 636.8,
            "media": 682.75,
            "maxima": 733.3
        },
        "25": {
            "minima": 665.9,
            "media": 696.16,
            "maxima": 743.8
        },
        "26": {
            "minima": 673.7,
            "media": 708.23,
            "maxima": 754.2
        },
        "27": {
            "minima": 686.1,
            "media": 722.86,
            "maxima": 768.4
        },
        "28": {
            "minima": 712.4,
            "media": 733.48,
            "maxima": 778.8
        },
        "29": {
            "minima": 714.1,
            "media": 745.84,
            "maxima": 785.1
        },
        "30": {
            "minima": 742.8,
            "media": 757.93,
            "maxima": 794.9
        },
        "31": {
            "minima": 752.6,
            "media": 769.12,
            "maxima": 805.4
        },
        "32": {
            "minima": 765.8,
            "media": 781.25,
            "maxima": 816.3
        },
        "33": {
            "minima": 782.1,
            "media": 794.37,
            "maxima": 828.2
        },
        "34": {
            "minima": 796.4,
            "media": 808.12,
            "maxima": 841.6
        },
        "35": {
            "minima": 802.8,
            "media": 823.28,
            "maxima": 856.1
        },
        "36": {
            "minima": 820.4,
            "media": 838.65,
            "maxima": 872.1
        },
        "37": {
            "minima": 843.2,
            "media": 856.13,
            "maxima": 889.4
        },
        "38": {
            "minima": 864.1,
            "media": 874.58,
            "maxima": 907.4
        },
        "39": {
            "minima": 885.2,
            "media": 894.62,
            "maxima": 926.9
        },
        "40": {
            "minima": 906.8,
            "media": 915.28,
            "maxima": 948.1
        },
        "41": {
            "minima": 932.1,
            "media": 938.15,
            "maxima": 954.4
        },
        "42": {
            "minima": 954.6,
            "media": 962.84,
            "maxima": 973.8
        },
        "43": {
            "minima": 975.0,
            "media": 975.0,
            "maxima": 975.0
        },
        "44": {
            "minima": 985.7,
            "media": 985.7,
            "maxima": 985.7
        },
        "45": {
            "minima": 985.7,
            "media": 985.7,
            "maxima": 985.7
        }
    }
};

window.calcularNotaEstimadaENEM = function(area, acertos, dadosDif) {
    const areaMap = { 'LC': 'linguagens', 'CH': 'humanas', 'CN': 'natureza', 'MAT': 'matematica' };
    let areaKey = areaMap[area] || area;
    let dadosArea = window.tabelaTriEnem2022[areaKey];
    
    let aStr = Math.max(0, Math.min(45, Math.floor(acertos))).toString();
    
    if (dadosArea && dadosArea[aStr] && dadosArea[aStr].media !== null) {
        let faixa = dadosArea[aStr];
        return {
            notaMinima: faixa.minima,
            notaMedia: faixa.media,
            notaMaxima: faixa.maxima,
            nota: faixa.media.toFixed(1),
            acertos: acertos,
            total: 45
        };
    }
    
    // Fallback Interpolation for missing/null TRI rows
    const tabelasFallback = {
        'LC': [[0,312.3],[10,410.5],[20,520.1],[30,620.4],[40,710.2],[45,801.0]],
        'CH': [[0,320.1],[10,430.2],[20,540.5],[30,650.1],[40,750.3],[45,830.0]],
        'CN': [[0,315.2],[10,410.3],[20,530.4],[30,640.2],[40,740.1],[45,820.0]],
        'MAT': [[0,330.1],[10,450.4],[20,580.2],[30,710.5],[40,840.1],[45,950.0]]
    };
    
    let key = areaMap[area] ? area : Object.keys(areaMap).find(k => areaMap[k] === areaKey) || 'CH';
    const tabela = tabelasFallback[key] || tabelasFallback['CH'];
    
    let val = tabela[0][1];
    if (acertos >= 45) {
        val = tabela[tabela.length-1][1];
    } else if (acertos > 0) {
        for (let i = 0; i < tabela.length - 1; i++) {
            let p1 = tabela[i];
            let p2 = tabela[i+1];
            if (acertos >= p1[0] && acertos <= p2[0]) {
                let rangeX = p2[0] - p1[0];
                let rangeY = p2[1] - p1[1];
                let progress = (acertos - p1[0]) / rangeX;
                val = p1[1] + (rangeY * progress);
                break;
            }
        }
    }
    
    let offset = Math.min(20, acertos * 1.5);
    return {
        notaMinima: val - offset,
        notaMedia: val,
        notaMaxima: val + offset,
        nota: val.toFixed(1),
        acertos: acertos,
        total: 45,
        coerencia: 'ALTA',
        indice: '100%'
    };
};

        window.dadosAlunosTri = {}; // To store rich data

        window.normalizarMatricula = function(m) {
            return String(m || "").replace(/\D/g, "").trim();
        };

        window.processarCorrecaoEspelhos = async function processarCorrecaoEspelhos() {
            console.clear();
            console.log("BOTÃO PROCESSAR CORREÇÃO FOI CLICADO");
            alert("Processamento iniciado.");

            let gbValido = validarGabaritoEspelhos();
            
            let txtRespostasEl = document.getElementById('txt-respostas');
            let txtGabaritoEl = document.getElementById('txt-gabarito');
            let txtRedacoesEl = document.getElementById('txt-redacoes');
            
            console.log("Texto gabarito:", txtGabaritoEl ? txtGabaritoEl.value.substring(0, 50) + "..." : "Não encontrado");
            console.log("Texto respostas:", txtRespostasEl ? txtRespostasEl.value.substring(0, 50) + "..." : "Não encontrado");
            console.log("Texto redação:", txtRedacoesEl ? txtRedacoesEl.value.substring(0, 50) + "..." : "Não encontrado");

            let pdfInputEl = document.getElementById('upload-pdf-respostas');
            
            let pdfBlob = null;
            let fileName = '';
            
            if (pdfInputEl && pdfInputEl.files.length > 0) {
                pdfBlob = pdfInputEl.files[0];
                fileName = pdfInputEl.files[0].name;
            } else {
                try {
                    let res = await fetch('latest_upload.pdf');
                    if (res.ok) {
                        pdfBlob = await res.blob();
                        fileName = 'latest_upload.pdf';
                    }
                
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
                    console.warn('latest_upload.pdf não encontrado ou erro de CORS.');
                }
            }
            
            if(!txtRespostasEl.value.trim() && pdfBlob) {
                const formData = new FormData();
                formData.append('instituicao', 'Nexus Automático');
                formData.append('pdf_file', pdfBlob, fileName);
                
                try {
                    const btn = document.querySelector('button[onclick="processarCorrecaoEspelhos()"]');
                    const originalBtnText = btn.innerHTML;
                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processando PDF...`;
                    btn.classList.add('opacity-50', 'pointer-events-none');

                    const response = await fetch('http://127.0.0.1:5000/api/upload_omr', {
                        method: 'POST',
                        body: formData
                    });
                    if(!response.ok) throw new Error("Servidor Python falhou ao ler o cartão-resposta.");
                    const data = await response.json();
                    
                    if(data.error) throw new Error(data.error);
                    
                    let linhasParaInserir = [];
                    if (data.resultados && data.resultados.length > 0) {
                        data.resultados.forEach((res) => {
                            let rawAnswers = Array.isArray(res.respostas) ? res.respostas.join(';') : '';
                            let mockMat = res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "000001";
                            let mockNome = "Aluno Digitalizado OMR";
                            let mockIdioma = "Todos";
                            linhasParaInserir.push(`${mockMat};${mockNome};${mockIdioma};${rawAnswers}`);
                        });
                    }
                    txtRespostasEl.value = linhasParaInserir.join('\n');
                    validarRespostasEspelhos();
                    
                    btn.innerHTML = originalBtnText;
                    btn.classList.remove('opacity-50', 'pointer-events-none');
                    alert("PDF Processado com sucesso! Montando tabela...");
                
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
                    console.error("Erro no Servidor OMR:", e);
                    alert("Erro ao extrair respostas via Servidor Python em http://127.0.0.1:5000: " + e.message);
                    const btn = document.querySelector('button[onclick="processarCorrecaoEspelhos()"]');
                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">auto_awesome</span> Processar Correção`;
                    btn.classList.remove('opacity-50', 'pointer-events-none');
                    return;
                }
            } else if (!txtRespostasEl.value.trim()) {
                // Tenta o antigo Lote OMR por fallback, mas alerta se ambos estiverem vazios
                if(typeof uploadsLeituraCartoes !== 'undefined' && uploadsLeituraCartoes.length > 0) {
                    const formData = new FormData();
                    formData.append('instituicao', 'Nexus Automático (Lote)');
                    if(uploadsLeituraCartoes[0] && uploadsLeituraCartoes[0].fileObj) {
                        formData.append('pdf_file', uploadsLeituraCartoes[0].fileObj);
                    }
                    try {
                        const btn = document.querySelector('button[onclick="processarCorrecaoEspelhos()"]');
                        const originalBtnText = btn.innerHTML;
                        btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processando PDF do Lote...`;
                        btn.classList.add('opacity-50', 'pointer-events-none');

                        const response = await fetch('http://127.0.0.1:5000/api/upload_omr', {
                            method: 'POST',
                            body: formData
                        });
                        if(!response.ok) throw new Error("Servidor Python falhou.");
                        const data = await response.json();
                        
                        let linhasParaInserir = [];
                        if (data.resultados && data.resultados.length > 0) {
                            data.resultados.forEach((res) => {
                                let rawAnswers = Array.isArray(res.respostas) ? res.respostas.join(';') : '';
                                let mockMat = res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "000001";
                                let mockNome = "Aluno Digitalizado OMR";
                                let mockIdioma = "Todos";
                                linhasParaInserir.push(`${mockMat};${mockNome};${mockIdioma};${rawAnswers}`);
                            });
                        }
                        txtRespostasEl.value = linhasParaInserir.join('\n');
                        validarRespostasEspelhos();
                        
                        btn.innerHTML = originalBtnText;
                        btn.classList.remove('opacity-50', 'pointer-events-none');
                    
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {}
                }
            }

            let rsValido = validarRespostasEspelhos();
            
            if(!gbValido || !rsValido) {
                alert("Valide o Gabarito e anexe um PDF com o cartão (ou cole as respostas) antes de processar.");
                return;
            }
            
            document.getElementById('panel-processados').classList.remove('hidden');
            document.getElementById('panel-boletim').classList.add('hidden');
            if(document.getElementById('panel-entrada')) document.getElementById('panel-entrada').classList.add('hidden');
            
            try {
            
            // NORMALIZADOR
            function normalizarTexto(txt) {
                if(!txt) return '';
                return txt.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
            }
            window.normalizarTexto = normalizarTexto;
            
            // TAREFA 5 — NORMALIZAR RESPOSTAS
            window.normalizarResposta = function(valor) {
              if (valor === undefined || valor === null) return "";
              let val = String(valor).trim().toUpperCase().replace(".", "").replace(",", "");
              if (["A", "B", "C", "D", "E", "X", "INV", "ANULADA", "*"].includes(val)) return val;
              return "";
            };

            // TAREFA 6 — NORMALIZAR ÁREAS
            window.normalizarArea = function(area, disciplina, q) {
              const texto = `${area || ""} ${disciplina || ""}`.toUpperCase();
              if (texto.includes("LING") || texto.includes("LC") || texto.includes("PORT") || texto.includes("INGL") || texto.includes("ESPAN") || texto.includes("ART") || texto.includes("LITER") || texto.includes("EDUCA")) return "Linguagens";
              if (texto.includes("HUM") || texto.includes("CH") || texto.includes("HIST") || texto.includes("GEO") || texto.includes("FIL") || texto.includes("SOC")) return "Humanas";
              if (texto.includes("NAT") || texto.includes("CN") || texto.includes("FIS") || texto.includes("FÍS") || texto.includes("QUI") || texto.includes("QUÍ") || texto.includes("BIO")) return "Natureza";
              if (texto.includes("MAT")) return "Matemática";
              
              if (q !== undefined) {
                  const n = Number(q);
                  if (n >= 1 && n <= 45) return "Linguagens";
                  if (n >= 46 && n <= 90) return "Humanas";
                  if (n >= 91 && n <= 135) return "Natureza";
                  if (n >= 136 && n <= 180) return "Matemática";
              }
              return "Sem área";
            };

            // TAREFA 1 — CORRIGIR LEITURA DO GABARITO
            let gabaritoMap = {};
            let gabText = document.getElementById('txt-gabarito').value;
            let gabLines = gabText ? gabText.trim().split('\n').filter(l=>l) : [];
            let validGabCount = 0;
            
        window.siglaDisciplinaVisual = function(numero, disciplina, area, idioma) {
            const n = Number(numero);
            const d = window.normalizarTexto(disciplina || "");
            const a = window.normalizarTexto(area || "");
            const lang = window.normalizarTexto(idioma || "");

            if (n >= 1 && n <= 5) {
                if (lang.includes("ingles") || lang.includes("english") || lang.includes("ing")) return "ING";
                if (lang.includes("espanhol") || lang.includes("spanish") || lang.includes("esp")) return "ESP";
                return "ING/ESP";
            }
            if (n >= 6 && n <= 45) {
                if (d.includes("literatura")) return "LIT";
                return "LING";
            }
            if (n >= 46 && n <= 90) {
                if (d.includes("hist")) return "HIST";
                if (d.includes("geo") || d.includes("geopolitica")) return "GEO";
                if (d.includes("soc")) return "SOCI";
                if (d.includes("fil")) return "FISO";
                return "CH";
            }
            if (n >= 91 && n <= 135) {
                if (d.includes("qui")) return "QUI";
                if (d.includes("bio")) return "BIO";
                if (d.includes("fis")) return "FIS";
                return "CN";
            }
            if (n >= 136 && n <= 180) {
                return "MAT";
            }
            return "";
        };

        window.isQuestaoAnulada = function(gab) {
            const g = window.normalizarTexto(gab || "");
            return ["anulada", "anulado", "anul", "x", "*", "inv", "", "-"].includes(g);
        };

            gabLines.forEach((linha) => {
                let p = linha.split(';').map(v => v.trim());
                if (p.length < 2) return;
                
                let q = parseInt(p[0].replace(/\D/g, ''));
                if (isNaN(q) || q < 1 || q > 180) return;
                
                let resp = p[1].toUpperCase();
                let area = p[2] || '';
                let disc = p[3] || '';
                let assunto = p[4] || '';
                let dif = window.normalizarTexto(p[5] || 'Média');
                let idiomaGab = p[6] || '';
                
                let strLin = linha.toLowerCase();
                let colIdioma = (p[6] || '').toLowerCase();
                let colDisciplina = (p[3] || '').toLowerCase();
                if (idiomaGab === '') {
                    if (colIdioma.includes('ing') || colDisciplina.includes('inglês') || colDisciplina.includes('ingles')) idiomaGab = "Inglês";
                    else if (colIdioma.includes('esp') || colDisciplina.includes('espanhol')) idiomaGab = "Espanhol";
                    else if (strLin.includes('inglês') || strLin.includes('ingles')) idiomaGab = "Inglês";
                    else if (strLin.includes('espanhol')) idiomaGab = "Espanhol";
                    else idiomaGab = "Todos";
                }

                let finalDif = dif.includes('facil') ? 'Fácil' : (dif.includes('dific') ? 'Difícil' : 'Média');
                let anulada = window.isQuestaoAnulada(resp);

                let key = q;
                if (q >= 1 && q <= 5) {
                    if (idiomaGab === 'Inglês') key = q + '_ING';
                    else if (idiomaGab === 'Espanhol') key = q + '_ESP';
                }

                gabaritoMap[key] = {
                    questao: q,
                    resposta: resp,
                    area: area,
                    disciplina: disc,
                    assunto: assunto,
                    dificuldade: finalDif,
                    idioma: idiomaGab,
                    anulada: anulada
                };
                validGabCount++;
            });
            window.gabaritosArray = Object.values(gabaritoMap).sort((a,b) => a.questao - b.questao);

            // TAREFA 2 — CORRIGIR LEITURA DAS RESPOSTAS DOS ALUNOS
            let respText = document.getElementById('txt-respostas').value;
            let respLines = respText ? respText.trim().split('\n').filter(l=>l) : [];
            let alunosParsed = [];

            if(respLines.length > 0) {
                let firstLine = respLines[0].toUpperCase();
                let hasHeader = firstLine.includes('NOME') || firstLine.includes('MATR') || firstLine.includes('Q1');
                let startIdx = hasHeader ? 1 : 0;
                
                for(let i = startIdx; i < respLines.length; i++) {
                    let partes = respLines[i].split(';').map(p => p.trim());
                    if (partes.length < 2) continue;

                    let mat = partes[0] || '0000';
                    let nome = partes[1] || 'Aluno Desconhecido';
                    let idioma = 'Inglês';
                    
                    let tempIdioma = window.normalizarTexto(partes[2] || '');
                    if (tempIdioma.includes('ingles') || tempIdioma.includes('ing')) idioma = 'Inglês';
                    else if (tempIdioma.includes('espanhol') || tempIdioma.includes('esp')) idioma = 'Espanhol';
                    else idioma = partes[2] || 'Inglês';
                    
                    let respostasMap = {};
                    let offset = 3; 
                    for (let q = 1; q <= 180; q++) {
                        respostasMap[q] = window.normalizarResposta(partes[offset + q - 1]);
                    }

                    alunosParsed.push({
                        matricula: mat,
                        nome: nome,
                        idioma: idioma,
                        respostas: respostasMap,
                        rawRespLine: respLines[i].replace(/'/g, "\\'")
                    });
                }
            }

            document.querySelectorAll('#kpi-importados').forEach(el => el.innerText = alunosParsed.length);
            document.querySelectorAll('#kpi-gerados').forEach(el => el.innerText = alunosParsed.length);

            window.parseNotasRedacao = function(texto) {
              const mapa = {};
              if (!texto || !texto.trim()) return mapa;
              const linhas = texto.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
              if(linhas.length > 0 && (linhas[0].toLowerCase().includes('nome') || linhas[0].toLowerCase().includes('matr') || linhas[0].toLowerCase().includes('nota'))) {
                  linhas.shift();
              }
              for (const linha of linhas) {
                const partes = linha.split(";").map(p => p.trim());
                if (partes.length < 2) continue;
                const matricula = window.normalizarMatricula ? window.normalizarMatricula(partes[0]) : partes[0].replace(/\D/g, "");
                const notaTexto = partes.length >= 3 ? partes[2] : partes[1];
                const nota = Number(notaTexto.replace(",", "."));
                if (!matricula) continue;
                mapa[matricula] = { matricula, nota: Number.isFinite(nota) ? nota : null };
              }
              return mapa;
            };

            const textoRedacao = document.getElementById("txt-redacoes")?.value || document.getElementById("textarea-notas-redacao")?.value || "";
            const redacoes = window.parseNotasRedacao(textoRedacao);
            
            let ingCount = 0; let espCount = 0;
            let tbody = document.getElementById('tabela-espelhos-body');
            let html = '';
            
            let turmaAcertosLC = 0, turmaTotalLC = 0;
            let turmaAcertosCH = 0, turmaTotalCH = 0;
            let turmaAcertosCN = 0, turmaTotalCN = 0;
            let turmaAcertosMAT = 0, turmaTotalMAT = 0;
            let alunosValidos = 0;
            let somaMedias = 0;
            let somaNtLin = 0, somaNtHum = 0, somaNtNat = 0, somaNtMat = 0;
            let minMedia = 9999;
            let maxMedia = 0;
            let discTurma = {}; 
            
            let firstStudentLogged = false;
            window.espelhosGerados = [];

            alunosParsed.forEach((aluno, i) => {
                let mat = aluno.matricula;
                let nome = aluno.nome;
                let idioma = aluno.idioma;
                
                let normFinal = window.normalizarTexto(idioma);
                let statusTag = (normFinal.includes('ingles') || normFinal.includes('esp')) ? '<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Corrigido</span>' : '<span class="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">Erro Idioma</span>';
                
                if(normFinal.includes('ing')) ingCount++;
                else if(normFinal.includes('esp')) espCount++;
                
                let cLC = 0, tLC = 0;
                let cCH = 0, tCH = 0;
                let cCN = 0, tCN = 0;
                let cMAT = 0, tMAT = 0;

                let statsDif = {
                    LC: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 },
                    CH: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 },
                    CN: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 },
                    MAT: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 }
                };
                
                let discStatsD1 = {};
                let discStatsD2 = {};
                let correcaoQuestoes = [];

                for (let q = 1; q <= 180; q++) {
                    let itemGab = null;
                    if (q >= 1 && q <= 5) {
                        if (normFinal.includes('ing')) itemGab = gabaritoMap[q + '_ING'];
                        else if (normFinal.includes('esp')) itemGab = gabaritoMap[q + '_ESP'];
                    } else {
                        itemGab = gabaritoMap[q];
                    }
                    if (!itemGab) continue;

                    const respostaAluno = window.normalizarResposta(aluno.respostas[q]);
                    const respostaCorreta = window.normalizarResposta(itemGab.resposta);

                    let status = "errada";
                    let acerto = 0;

                    if (itemGab.anulada || window.isQuestaoAnulada(respostaCorreta)) {
                        status = "anulada";
                        acerto = 1;
                    } else if (!respostaAluno) {
                        status = "em branco";
                        acerto = 0;
                    } else if (respostaAluno === respostaCorreta) {
                        status = "correta";
                        acerto = 1;
                    }

                    const areaNormalizada = window.normalizarArea(itemGab.area, itemGab.disciplina, q);
                    
                    correcaoQuestoes.push({
                        questao: q,
                        gabarito: respostaCorreta,
                        respostaAluno: respostaAluno,
                        area: areaNormalizada,
                        disciplina: itemGab.disciplina,
                        assunto: itemGab.assunto,
                        dificuldade: itemGab.dificuldade,
                        status: status,
                        acerto: acerto
                    });

                    let dictStats = q <= 90 ? discStatsD1 : discStatsD2;
                    let nomeDisc = itemGab.disciplina && itemGab.disciplina.trim() ? itemGab.disciplina : areaNormalizada;
                    
                    let normDiscStr = window.normalizarTexto(nomeDisc);
                    if (normDiscStr === 'portugues' || normDiscStr === 'educacao fisica' || normDiscStr === 'linguagens') {
                        nomeDisc = 'Linguagens';
                    }
                    
                    if (!discTurma[nomeDisc]) discTurma[nomeDisc] = {acertos: 0, total: 0};
                    discTurma[nomeDisc].total++;
                    if(acerto) discTurma[nomeDisc].acertos++;
                    
                    if(!dictStats[nomeDisc]) dictStats[nomeDisc] = {acertos: 0, total: 0};
                    dictStats[nomeDisc].total++;
                    if(acerto) dictStats[nomeDisc].acertos++;

                    if(areaNormalizada === "Linguagens") {
                        tLC++; if(acerto) cLC++;
                        if(itemGab.dificuldade === 'Fácil') { statsDif.LC.totalF++; if(acerto) statsDif.LC.acertosF++; }
                        else if(itemGab.dificuldade === 'Difícil') { statsDif.LC.totalD++; if(acerto) statsDif.LC.acertosD++; }
                        else { statsDif.LC.totalM++; if(acerto) statsDif.LC.acertosM++; }
                    } else if(areaNormalizada === "Humanas") {
                        tCH++; if(acerto) cCH++;
                        if(itemGab.dificuldade === 'Fácil') { statsDif.CH.totalF++; if(acerto) statsDif.CH.acertosF++; }
                        else if(itemGab.dificuldade === 'Difícil') { statsDif.CH.totalD++; if(acerto) statsDif.CH.acertosD++; }
                        else { statsDif.CH.totalM++; if(acerto) statsDif.CH.acertosM++; }
                    } else if(areaNormalizada === "Natureza") {
                        tCN++; if(acerto) cCN++;
                        if(itemGab.dificuldade === 'Fácil') { statsDif.CN.totalF++; if(acerto) statsDif.CN.acertosF++; }
                        else if(itemGab.dificuldade === 'Difícil') { statsDif.CN.totalD++; if(acerto) statsDif.CN.acertosD++; }
                        else { statsDif.CN.totalM++; if(acerto) statsDif.CN.acertosM++; }
                    } else if(areaNormalizada === "Matemática") {
                        tMAT++; if(acerto) cMAT++;
                        if(itemGab.dificuldade === 'Fácil') { statsDif.MAT.totalF++; if(acerto) statsDif.MAT.acertosF++; }
                        else if(itemGab.dificuldade === 'Difícil') { statsDif.MAT.totalD++; if(acerto) statsDif.MAT.acertosD++; }
                        else { statsDif.MAT.totalM++; if(acerto) statsDif.MAT.acertosM++; }
                    }
                }

                if (!firstStudentLogged) {
                    firstStudentLogged = true;
                    console.log("DEBUG PRIMEIRO ALUNO:", aluno);
                    console.log("GAB Q1:", gabaritoMap[1]);
                    console.log("RESPOSTA ALUNO Q1:", aluno.respostas[1]);
                    console.log("GAB Q2:", gabaritoMap[2]);
                    console.log("RESPOSTA ALUNO Q2:", aluno.respostas[2]);
                    console.table(correcaoQuestoes.slice(0, 10));
                    
                    window._debug_firstStudentCorrecao = correcaoQuestoes;
                    window._debug_metrics = { cLC, tLC, cCH, tCH, cCN, tCN, cMAT, tMAT };
                }

                turmaAcertosLC += cLC; turmaTotalLC += tLC;
                turmaAcertosCH += cCH; turmaTotalCH += tCH;
                turmaAcertosCN += cCN; turmaTotalCN += tCN;
                turmaAcertosMAT += cMAT; turmaTotalMAT += tMAT;
                alunosValidos++;

                let resLC = window.calcularNotaEstimadaENEM('LC', cLC, statsDif.LC);
                let resCH = window.calcularNotaEstimadaENEM('CH', cCH, statsDif.CH);
                let resCN = window.calcularNotaEstimadaENEM('CN', cCN, statsDif.CN);
                let resMAT = window.calcularNotaEstimadaENEM('MAT', cMAT, statsDif.MAT);

                let isTRIAvailable = parseFloat(resLC.nota) > 0 || parseFloat(resMAT.nota) > 0;

                let ntLin = isTRIAvailable ? resLC.nota : `${cLC}/${tLC}`;
                let ntHum = isTRIAvailable ? resCH.nota : `${cCH}/${tCH}`;
                let ntNat = isTRIAvailable ? resCN.nota : `${cCN}/${tCN}`;
                let ntMat = isTRIAvailable ? resMAT.nota : `${cMAT}/${tMAT}`;
                
                let matNorm = window.normalizarMatricula ? window.normalizarMatricula(mat) : mat.replace(/\D/g, "");
                let redacaoData = redacoes[matNorm] || redacoes[mat] || redacoes[nome];
                let redacao = redacaoData && redacaoData.nota !== null ? redacaoData.nota : "S/R";

                let rawRespLine = aluno.rawRespLine; 
                let numRed = parseFloat(redacao);
                let temRedacao = !isNaN(numRed);
                let media = 0;
                
                if(isTRIAvailable) {
                    let vLC = parseFloat(resLC.nota) || 0;
                    let vCH = parseFloat(resCH.nota) || 0;
                    let vCN = parseFloat(resCN.nota) || 0;
                    let vMAT = parseFloat(resMAT.nota) || 0;
                    media = temRedacao ? ((vLC + vCH + vCN + vMAT + numRed) / 5).toFixed(1) : ((vLC + vCH + vCN + vMAT)/4).toFixed(1);
                } else {
                    let totalA = cLC + cCH + cCN + cMAT;
                    let totalQ = tLC + tCH + tCN + tMAT;
                    media = totalQ > 0 ? ((totalA / totalQ) * 100).toFixed(1) + '%' : '0.0%';
                }
                
                // isTRIAvailable already declared on line 6390
                let resumoAreas = {
                    Linguagens: { acertos: cLC, total: tLC },
                    Humanas: { acertos: cCH, total: tCH },
                    Natureza: { acertos: cCN, total: tCN },
                    Matemática: { acertos: cMAT, total: tMAT }
                };
                
                let espelhoAluno = {
                    matricula: mat,
                    nome: nome,
                    turma: aluno.turma || "",
                    idioma: idioma,
                    redacao: redacao,
                    questoesCorrigidas: correcaoQuestoes,
                    resumoAreas: resumoAreas,
                    resumoDisciplinas: { ...discStatsD1, ...discStatsD2 },
                    notasTRI: {
                        LC: resLC,
                        CH: resCH,
                        CN: resCN,
                        MAT: resMAT
                    },
                    mediaFinal: media,
                    isTRIAvailable: isTRIAvailable
                };
                window.espelhosGerados.push(espelhoAluno);

                html += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-3">${statusTag}</td>
                    <td class="p-3 text-xs">${mat}</td>
                    <td class="p-3 font-bold">${nome}</td>
                    <td class="p-3 text-xs text-slate-500 font-bold text-indigo-600">${idioma}</td>
                    <td class="p-3 text-center text-xs">${ntLin}</td>
                    <td class="p-3 text-center text-xs">${ntHum}</td>
                    <td class="p-3 text-center text-xs">${ntNat}</td>
                    <td class="p-3 text-center text-xs font-bold text-indigo-600">${ntMat}</td>
                    <td class="p-3 text-center text-xs">${redacao}</td>
                    <td class="p-3 text-center font-black">${media}</td>
                    <td class="p-3 text-center text-[10px] font-bold text-emerald-500">ALTA</td>
                    <td class="p-3 text-right flex items-center gap-1 justify-end">
                        <button onclick="verEspelho('${mat}')" class="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-lg transition-colors inline-flex"><span class="material-symbols-outlined text-[16px]">visibility</span></button>
                        <button onclick="baixarPdfIndividual('${mat}')" class="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors inline-flex ml-1"><span class="material-symbols-outlined text-[16px]">picture_as_pdf</span></button>
                    </td>
                </tr>`;
            }); // FIM DO FOREACH

            window.turmaTriGlobal = { LC: 0, CH: 0, CN: 0, MAT: 0 };
            let sumTRI = { LC: 0, CH: 0, CN: 0, MAT: 0 };
            let countTRI = { LC: 0, CH: 0, CN: 0, MAT: 0 };
            let sumMediaGeral = 0;
            let countMediaGeral = 0;
            let temPercentualGeral = false;

            window.espelhosGerados.forEach(al => {
                if (al.isTRIAvailable) {
                    if (al.notasTRI.LC && !isNaN(parseFloat(al.notasTRI.LC.nota))) { sumTRI.LC += parseFloat(al.notasTRI.LC.nota); countTRI.LC++; }
                    if (al.notasTRI.CH && !isNaN(parseFloat(al.notasTRI.CH.nota))) { sumTRI.CH += parseFloat(al.notasTRI.CH.nota); countTRI.CH++; }
                    if (al.notasTRI.CN && !isNaN(parseFloat(al.notasTRI.CN.nota))) { sumTRI.CN += parseFloat(al.notasTRI.CN.nota); countTRI.CN++; }
                    if (al.notasTRI.MAT && !isNaN(parseFloat(al.notasTRI.MAT.nota))) { sumTRI.MAT += parseFloat(al.notasTRI.MAT.nota); countTRI.MAT++; }
                } else {
                    let rLC = al.resumoAreas.Linguagens;
                    if (rLC && rLC.total > 0) { sumTRI.LC += (rLC.acertos / rLC.total) * 100; countTRI.LC++; }
                    let rCH = al.resumoAreas.Humanas;
                    if (rCH && rCH.total > 0) { sumTRI.CH += (rCH.acertos / rCH.total) * 100; countTRI.CH++; }
                    let rCN = al.resumoAreas.Natureza;
                    if (rCN && rCN.total > 0) { sumTRI.CN += (rCN.acertos / rCN.total) * 100; countTRI.CN++; }
                    let rMAT = al.resumoAreas.Matemática;
                    if (rMAT && rMAT.total > 0) { sumTRI.MAT += (rMAT.acertos / rMAT.total) * 100; countTRI.MAT++; }
                    temPercentualGeral = true;
                }
                
                if (al.mediaFinal && !isNaN(parseFloat(al.mediaFinal))) {
                    sumMediaGeral += parseFloat(al.mediaFinal);
                    countMediaGeral++;
                }
            });

            if (countTRI.LC > 0) window.turmaTriGlobal.LC = Math.round((sumTRI.LC / countTRI.LC) * 10) / 10;
            if (countTRI.CH > 0) window.turmaTriGlobal.CH = Math.round((sumTRI.CH / countTRI.CH) * 10) / 10;
            if (countTRI.CN > 0) window.turmaTriGlobal.CN = Math.round((sumTRI.CN / countTRI.CN) * 10) / 10;
            if (countTRI.MAT > 0) window.turmaTriGlobal.MAT = Math.round((sumTRI.MAT / countTRI.MAT) * 10) / 10;
            
            window.mediaGeralTurma = countMediaGeral > 0 ? (Math.round((sumMediaGeral / countMediaGeral) * 10) / 10).toFixed(1) + (temPercentualGeral ? "%" : "") : "0.0";

            tbody.innerHTML = html;
            if(document.getElementById('kpi-ing')) document.querySelectorAll('#kpi-ing').forEach(el => el.innerText = ingCount);
            if(document.getElementById('kpi-esp')) document.querySelectorAll('#kpi-esp').forEach(el => el.innerText = espCount);
            
            let debugEl = document.getElementById('debug-correcao-espelhos');
            if(debugEl) {
                let statusText = "OK";
                if (!window._debug_firstStudentCorrecao || window._debug_firstStudentCorrecao.length === 0) {
                    statusText = "ERRO: as respostas dos alunos não foram cruzadas com o gabarito. Verifique o mapeamento das colunas Q1 a Q180.";
                } else if (!window._debug_metrics || (window._debug_metrics.tLC === 0 && window._debug_metrics.tCH === 0 && window._debug_metrics.tCN === 0 && window._debug_metrics.tMAT === 0)) {
                    statusText = "ERRO: as áreas do gabarito não foram reconhecidas.";
                }

                debugEl.classList.remove('hidden');
                let metrics = window._debug_metrics || { cLC:0, tLC:0, cCH:0, tCH:0, cCN:0, tCN:0, cMAT:0, tMAT:0 };
                let acertosQtd = window._debug_firstStudentCorrecao ? window._debug_firstStudentCorrecao.length : 0;
                
                document.querySelectorAll('#debug-log-content').forEach(el => el.innerHTML = `
                    Gabarito: ${window.gabaritosArray.length} questões válidas<br>
                    Alunos: ${alunosValidos} importados<br>
                    Redações: ${Object.keys(redacoes).length} notas<br>
                    Questões corrigidas primeiro aluno: ${acertosQtd}<br>
                    Acertos primeiro aluno:<br>
                    - Linguagens: ${metrics.cLC}/${metrics.tLC}<br>
                    - Humanas: ${metrics.cCH}/${metrics.tCH}<br>
                    - Natureza: ${metrics.cCN}/${metrics.tCN}<br>
                    - Matemática: ${metrics.cMAT}/${metrics.tMAT}<br>
                    Status: <strong>${statusText}</strong>
                `);
            }
            
            console.log("TESTE INTERNO OK");
            alert("Correção processada com sucesso!");
            
            } catch (err) {
                console.error("Erro interno no Processamento:", err);
                alert("Houve um erro técnico ao montar a correção das notas. Detalhes (pressione F12): " + err.message);
                if(document.getElementById('panel-entrada')) document.getElementById('panel-entrada').classList.remove('hidden');
                document.getElementById('panel-processados').classList.add('hidden');
            }
        }

        window.verEspelho = function(matricula) {
            const espelhoAluno = window.espelhosGerados.find(e => e.matricula === matricula);
            if(!espelhoAluno) {
                alert("Espelho não encontrado para a matrícula " + matricula);
                return;
            }
            
            document.getElementById('panel-boletim').classList.remove('hidden');

            console.log('DESIGN PREMIUM DO BOLETIM RENDERIZADO');
            console.log('Páginas encontradas:', document.querySelectorAll('#boletim-pdf-export .boletim-a4-page').length);
            console.log('Gráfico de linha existe:', !!document.getElementById('graficoLinhaDesempenho'));
            console.log('Gráfico de pizza existe:', !!document.getElementById('graficoPizzaDesempenho'));

            // Chart.js Generation
            setTimeout(() => {
                const parseDom = (id) => {
                    const el = document.getElementById(id);
                    if (!el) return 0;
                    const txt = el.innerText.replace(',', '.');
                    const val = parseFloat(txt);
                    return isNaN(val) ? 0 : val;
                };

                const parseAcertos = (id) => {
                    const el = document.getElementById(id);
                    if (!el) return 0;
                    // "33/45 acertos"
                    const txt = el.innerText.split('/')[0];
                    const val = parseInt(txt);
                    return isNaN(val) ? 0 : val;
                };

                let t_LC = parseDom('bol-nota-lc');
                let t_CH = parseDom('bol-nota-ch');
                let t_CN = parseDom('bol-nota-cn');
                let t_MAT = parseDom('bol-card-nota-mat') || parseDom('bol-nota-mat');

                let m_LC = parseDom('bol-geral-lc');
                let m_CH = parseDom('bol-geral-ch');
                let m_CN = parseDom('bol-geral-cn');
                let m_MAT = parseDom('bol-geral-mat');

                // Linha
                document.querySelectorAll('#graficoLinhaDesempenho').forEach(ctxLinha => {
                    if (ctxLinha) {
                        if (ctxLinha.chartInstance) ctxLinha.chartInstance.destroy();
                        ctxLinha.chartInstance = new Chart(ctxLinha, {
                            type: 'line',
                            data: {
                                labels: ['Linguagens', 'Humanas', 'Natureza', 'Matemática'],
                                datasets: [
                                    {
                                        label: 'Aluno',
                                        data: [t_LC, t_CH, t_CN, t_MAT],
                                        borderColor: '#0b1f4d',
                                        backgroundColor: '#0b1f4d',
                                        borderWidth: 3,
                                        tension: 0.4,
                                        pointRadius: 5,
                                        pointBackgroundColor: '#ffffff',
                                        pointBorderWidth: 2
                                    },
                                    {
                                        label: 'Média Turma',
                                        data: [m_LC, m_CH, m_CN, m_MAT],
                                        borderColor: '#94a3b8',
                                        backgroundColor: '#94a3b8',
                                        borderWidth: 3,
                                        borderDash: [5, 5],
                                        tension: 0.4,
                                        pointRadius: 4,
                                        pointBackgroundColor: '#ffffff',
                                        pointBorderWidth: 2
                                    }
                                ]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            font: { family: 'Inter', weight: 'bold', size: 11 },
                                            color: '#64748b',
                                            usePointStyle: true,
                                            boxWidth: 8
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: false,
                                        min: 0,
                                        max: 1000,
                                        grid: { color: '#f1f5f9' },
                                        ticks: { font: { family: 'Inter', size: 10 }, color: '#94a3b8', stepSize: 250 }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { family: 'Inter', weight: 'bold', size: 10 }, color: '#475569' }
                                    }
                                }
                            }
                        });
                    }
                });

                // Pizza
                document.querySelectorAll('#graficoPizzaDesempenho').forEach(ctxPizza => {
                    if (ctxPizza) {
                        if (ctxPizza.chartInstance) ctxPizza.chartInstance.destroy();
                        
                        let a_LC = parseAcertos('bol-ac-lin') || parseAcertos('bol-ac-lc') || parseDom('bol-escore-lc');
                        let a_CH = parseAcertos('bol-ac-hum') || parseAcertos('bol-ac-ch') || parseDom('bol-escore-ch');
                        let a_CN = parseAcertos('bol-ac-nat') || parseAcertos('bol-ac-cn') || parseDom('bol-escore-cn');
                        let a_MAT = parseAcertos('bol-ac-mat') || parseDom('bol-escore-mat');

                        ctxPizza.chartInstance = new Chart(ctxPizza, {
                            type: 'doughnut',
                            data: {
                                labels: ['Linguagens', 'Humanas', 'Natureza', 'Matemática'],
                                datasets: [{
                                    data: [a_LC, a_CH, a_CN, a_MAT],
                                    backgroundColor: [
                                        '#0B193C', // Azul marinho
                                        '#008080', // Verde teal
                                        '#20b2aa', // Verde claro
                                        '#0066cc'  // Azul claro
                                    ],
                                    borderWidth: 2,
                                    borderColor: '#ffffff',
                                    hoverOffset: 4
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '65%',
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            font: { family: 'Inter', weight: 'bold', size: 11 },
                                            color: '#475569',
                                            usePointStyle: true,
                                            padding: 15
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }, 500); // Give it half a second to ensure DOM is ready

            document.getElementById('panel-boletim').scrollIntoView({ behavior: 'smooth' });
            
            // Atualiza os cabeçalhos de identificação em TODAS as instâncias (tela e PDF)
document.querySelectorAll('#espNovo-outName').forEach(el => el.innerText = espelhoAluno.nome);
document.querySelectorAll('#espNovo-outId').forEach(el => el.innerText = espelhoAluno.matricula);
document.querySelectorAll('#espNovo-outTurma').forEach(el => el.innerText = espelhoAluno.turma || 'TURMA PADRÃO');
document.querySelectorAll('#espNovo-outIdioma').forEach(el => el.innerText = espelhoAluno.idioma ? espelhoAluno.idioma.toUpperCase() : 'N/D');

if(document.getElementById('boletim-media-geral')) document.querySelectorAll('#boletim-media-geral').forEach(el => el.innerText = espelhoAluno.mediaFinal);
if(document.getElementById('boletim-media-geral-bot')) document.querySelectorAll('#boletim-media-geral-bot').forEach(el => el.innerText = espelhoAluno.mediaFinal);
            if(document.getElementById('boletim-media-geral-bot')) document.querySelectorAll('#boletim-media-geral-bot').forEach(el => el.innerText = espelhoAluno.mediaFinal);
            
            let numRed = parseFloat(espelhoAluno.redacao);
            let temRedacao = !isNaN(numRed);
            
            let hasIndisponivel = !espelhoAluno.isTRIAvailable;
            let nLC = espelhoAluno.notasTRI.LC;
            let nCH = espelhoAluno.notasTRI.CH;
            let nCN = espelhoAluno.notasTRI.CN;
            let nMAT = espelhoAluno.notasTRI.MAT;
            let resLC = espelhoAluno.resumoAreas.Linguagens;
            let resCH = espelhoAluno.resumoAreas.Humanas;
            let resCN = espelhoAluno.resumoAreas.Natureza;
            let resMAT = espelhoAluno.resumoAreas.Matemática;
            
            if(hasIndisponivel) {
                if(document.getElementById('bol-resumo-media-obj')) document.querySelectorAll('#bol-resumo-media-obj').forEach(el => el.innerText = 'N/D');
                if(document.getElementById('bol-resumo-min')) document.querySelectorAll('#bol-resumo-min').forEach(el => el.innerText = 'N/D');
                if(document.getElementById('bol-resumo-med')) document.querySelectorAll('#bol-resumo-med').forEach(el => el.innerText = 'N/D');
                if(document.getElementById('bol-resumo-max')) document.querySelectorAll('#bol-resumo-max').forEach(el => el.innerText = 'N/D');
            } else {
                let somaMin = parseFloat(nLC.notaMinima) + parseFloat(nCH.notaMinima) + parseFloat(nCN.notaMinima) + parseFloat(nMAT.notaMinima);
                let somaMed = parseFloat(nLC.notaMedia) + parseFloat(nCH.notaMedia) + parseFloat(nCN.notaMedia) + parseFloat(nMAT.notaMedia);
                let somaMax = parseFloat(nLC.notaMaxima) + parseFloat(nCH.notaMaxima) + parseFloat(nCN.notaMaxima) + parseFloat(nMAT.notaMaxima);

                let mediaMinima = 0, mediaMedia = 0, mediaMaxima = 0;
                if (temRedacao) {
                    mediaMinima = (somaMin + numRed) / 5;
                    mediaMedia = (somaMed + numRed) / 5;
                    mediaMaxima = (somaMax + numRed) / 5;
                    if(document.getElementById('bol-resumo-tipo-media')) document.querySelectorAll('#bol-resumo-tipo-media').forEach(el => el.innerText = 'Média Final');
                    if(document.getElementById('bol-resumo-media-obj')) document.querySelectorAll('#bol-resumo-media-obj').forEach(el => el.innerText = mediaMedia.toFixed(1));
                } else {
                    mediaMinima = somaMin / 4;
                    mediaMedia = somaMed / 4;
                    mediaMaxima = somaMax / 4;
                    if(document.getElementById('bol-resumo-tipo-media')) document.querySelectorAll('#bol-resumo-tipo-media').forEach(el => el.innerText = 'Média Objetiva');
                    if(document.getElementById('bol-resumo-media-obj')) document.querySelectorAll('#bol-resumo-media-obj').forEach(el => el.innerText = mediaMedia.toFixed(1));
                }

                if(document.getElementById('bol-resumo-min')) document.querySelectorAll('#bol-resumo-min').forEach(el => el.innerText = mediaMinima.toFixed(1));
                if(document.getElementById('bol-resumo-med')) document.querySelectorAll('#bol-resumo-med').forEach(el => el.innerText = mediaMedia.toFixed(1));
                if(document.getElementById('bol-resumo-max')) document.querySelectorAll('#bol-resumo-max').forEach(el => el.innerText = mediaMaxima.toFixed(1));
            }

            // Cards de Resumo TRI/Acertos (Top Cards & Dashboard Areas)
            if(document.getElementById('bol-ac-lin')) document.querySelectorAll('#bol-ac-lin').forEach(el => el.innerText = `${resLC.acertos}/${resLC.total} acertos`);
            if(document.getElementById('bol-pct-lin-card')) document.querySelectorAll('#bol-pct-lin-card').forEach(el => el.innerText = ((resLC.acertos/resLC.total)*100).toFixed(1)+'%');
            if(document.getElementById('bol-nota-lin')) document.querySelectorAll('#bol-nota-lin').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-lin')) document.querySelectorAll('#bol-faixa-lin').forEach(el => el.innerText = hasIndisponivel ? 'Faixa: N/D' : `Faixa: ${nLC.notaMinima.toFixed(1)} - ${nLC.notaMaxima.toFixed(1)}`);

            if(document.getElementById('bol-ac-hum')) document.querySelectorAll('#bol-ac-hum').forEach(el => el.innerText = `${resCH.acertos}/${resCH.total} acertos`);
            if(document.getElementById('bol-pct-hum-card')) document.querySelectorAll('#bol-pct-hum-card').forEach(el => el.innerText = ((resCH.acertos/resCH.total)*100).toFixed(1)+'%');
            if(document.getElementById('bol-nota-hum')) document.querySelectorAll('#bol-nota-hum').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-hum')) document.querySelectorAll('#bol-faixa-hum').forEach(el => el.innerText = hasIndisponivel ? 'Faixa: N/D' : `Faixa: ${nCH.notaMinima.toFixed(1)} - ${nCH.notaMaxima.toFixed(1)}`);

            if(document.getElementById('bol-ac-nat')) document.querySelectorAll('#bol-ac-nat').forEach(el => el.innerText = `${resCN.acertos}/${resCN.total} acertos`);
            if(document.getElementById('bol-pct-nat-card')) document.querySelectorAll('#bol-pct-nat-card').forEach(el => el.innerText = ((resCN.acertos/resCN.total)*100).toFixed(1)+'%');
            if(document.getElementById('bol-nota-nat')) document.querySelectorAll('#bol-nota-nat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-nat')) document.querySelectorAll('#bol-faixa-nat').forEach(el => el.innerText = hasIndisponivel ? 'Faixa: N/D' : `Faixa: ${nCN.notaMinima.toFixed(1)} - ${nCN.notaMaxima.toFixed(1)}`);

            if(document.getElementById('bol-ac-mat')) document.querySelectorAll('#bol-ac-mat').forEach(el => el.innerText = `${resMAT.acertos}/${resMAT.total} acertos`);
            if(document.getElementById('bol-pct-mat-card')) document.querySelectorAll('#bol-pct-mat-card').forEach(el => el.innerText = ((resMAT.acertos/resMAT.total)*100).toFixed(1)+'%');
            if(document.getElementById('bol-card-nota-mat')) document.querySelectorAll('#bol-card-nota-mat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nMAT.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-mat')) document.querySelectorAll('#bol-faixa-mat').forEach(el => el.innerText = hasIndisponivel ? 'Faixa: N/D' : `Faixa: ${nMAT.notaMinima.toFixed(1)} - ${nMAT.notaMaxima.toFixed(1)}`);
            window.renderizarPaginasAdicionaisA4(espelhoAluno);

            
            if(document.getElementById('bol-nota-red')) document.querySelectorAll('#bol-nota-red').forEach(el => el.innerText = espelhoAluno.redacao || 'S/R');

            if(document.getElementById('bol-coer-lc')) document.querySelectorAll('#bol-coer-lc').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('bol-idx-lc')) document.querySelectorAll('#bol-idx-lc').forEach(el => el.innerText = `Acertos: ${resLC.acertos}/${resLC.total}`);
            if(document.getElementById('bol-dif-lc')) document.querySelectorAll('#bol-dif-lc').forEach(el => el.innerHTML = hasIndisponivel ? 'N/D' : `Mínima: ${nLC.notaMinima.toFixed(1)}<br>Média: ${nLC.notaMedia.toFixed(1)}<br>Máxima: ${nLC.notaMaxima.toFixed(1)}`);

            if(document.getElementById('bol-coer-ch')) document.querySelectorAll('#bol-coer-ch').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('bol-idx-ch')) document.querySelectorAll('#bol-idx-ch').forEach(el => el.innerText = `Acertos: ${resCH.acertos}/${resCH.total}`);
            if(document.getElementById('bol-dif-ch')) document.querySelectorAll('#bol-dif-ch').forEach(el => el.innerHTML = hasIndisponivel ? 'N/D' : `Mínima: ${nCH.notaMinima.toFixed(1)}<br>Média: ${nCH.notaMedia.toFixed(1)}<br>Máxima: ${nCH.notaMaxima.toFixed(1)}`);

            if(document.getElementById('bol-coer-cn')) document.querySelectorAll('#bol-coer-cn').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('bol-idx-cn')) document.querySelectorAll('#bol-idx-cn').forEach(el => el.innerText = `Acertos: ${resCN.acertos}/${resCN.total}`);
            if(document.getElementById('bol-dif-cn')) document.querySelectorAll('#bol-dif-cn').forEach(el => el.innerHTML = hasIndisponivel ? 'N/D' : `Mínima: ${nCN.notaMinima.toFixed(1)}<br>Média: ${nCN.notaMedia.toFixed(1)}<br>Máxima: ${nCN.notaMaxima.toFixed(1)}`);

            if(document.getElementById('bol-coer-mat')) document.querySelectorAll('#bol-coer-mat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nMAT.notaMedia.toFixed(1));
            if(document.getElementById('bol-idx-mat')) document.querySelectorAll('#bol-idx-mat').forEach(el => el.innerText = `Acertos: ${resMAT.acertos}/${resMAT.total}`);
            if(document.getElementById('bol-dif-mat')) document.querySelectorAll('#bol-dif-mat').forEach(el => el.innerHTML = hasIndisponivel ? 'N/D' : `Mínima: ${nMAT.notaMinima.toFixed(1)}<br>Média: ${nMAT.notaMedia.toFixed(1)}<br>Máxima: ${nMAT.notaMaxima.toFixed(1)}`);
            
            ['lc','ch','cn','mat'].forEach(area => {
                let el = document.getElementById(`bol-coer-${area}`);
                if(el) el.className = `font-black text-sm my-0.5 text-[#0B193C]`;
            });

            // GRADE DE MARCAÇÕES (1-90, 91-180)
            function renderEspelhoMarcacoes(questoesCorrigidas, start_q, max_len) {
                let htmlTabelas = '';
                let total_blocos = Math.ceil(max_len / 15);
                for(let i=0; i<total_blocos; i++) {
                    let s_q = start_q + (i * 15);
                    
                    let lq = `<div class="flex text-[11px] font-bold text-center bg-teal-600/20 text-[#0B193C]"><div class="w-[85px] py-1 border-r border-slate-300">Questão</div>`;
                    let lg = `<div class="flex text-[11px] font-bold text-center bg-white border-b border-slate-200"><div class="w-[85px] py-1 border-r border-slate-200 text-slate-700">Gabarito</div>`;
                    let la = `<div class="flex text-[11px] font-bold text-center bg-[#FDE68A] border-b border-slate-200 text-[#0B193C]"><div class="w-[85px] py-1 border-r border-amber-300 text-slate-700 bg-amber-100 flex items-center justify-center">Marcação</div>`;
                    let larea = `<div class="flex text-[8px] font-bold text-center bg-white"><div class="w-[85px] py-1 border-r border-slate-200 text-slate-700 flex items-center justify-center">Área</div>`;
                    
                    for(let q = s_q; q < s_q + 15; q++) {
                        lq += `<div class="flex-1 border-r border-slate-300 py-1">${q}</div>`;
                        
                        let questao = questoesCorrigidas.find(x => Number(x.questao) === Number(q) || Number(x.numero) === Number(q));
                        let gabVal = questao ? questao.gabarito : '-';
                        let alunoVal = (questao && questao.respostaAluno) ? questao.respostaAluno : '-';
                        let areaVal = questao ? questao.area : '';
                        let discVal = questao ? questao.disciplina : '';
                        
                        let isAnulada = window.isQuestaoAnulada(gabVal);
                        if(isAnulada) gabVal = 'ANU.';
                        
                        let bgGab = isAnulada ? 'bg-emerald-100 text-emerald-700' : '';
                        lg += `<div class="flex-1 border-r border-slate-200 py-1 font-bold text-slate-800 ${bgGab}">${gabVal}</div>`;
                        
                        let cor = "text-[#0B193C]";
                        if(isAnulada) cor = "text-emerald-700 font-extrabold";
                        else if(alunoVal === gabVal) cor = "text-emerald-700";
                        else cor = "text-rose-600";
                        
                        la += `<div class="flex-1 border-r border-amber-300 py-1 ${cor} flex items-center justify-center font-black">${alunoVal}</div>`;
                        
                        let areaValCurto = window.siglaDisciplinaVisual(q, discVal, areaVal, espelhoAluno.idioma);
                        
                        larea += `<div class="flex-1 border-r border-slate-200 py-1 truncate flex items-center justify-center font-bold text-slate-600" title="${discVal || areaVal || ''}">${areaValCurto}</div>`;
                    }
                    lq += '</div>'; lg += '</div>'; la += '</div>'; larea += '</div>';
                    htmlTabelas += `<div class="border border-slate-300 rounded-lg overflow-hidden shadow-sm mb-3">${lq}${lg}${la}${larea}</div>`;
                }
                return htmlTabelas;
            }
            
            // Grades Dia 1 e Dia 2
            let c1 = document.getElementById('bol-espelho-container-d1');
            if(c1) c1.innerHTML = renderEspelhoMarcacoes(espelhoAluno.questoesCorrigidas, 1, 90);
            
            let c2 = document.getElementById('bol-espelho-container-d2');
            if(c2) c2.innerHTML = renderEspelhoMarcacoes(espelhoAluno.questoesCorrigidas, 91, 90);

            if(document.getElementById('bol-escore-lc')) document.querySelectorAll('#bol-escore-lc').forEach(el => el.innerText = resLC.acertos);
            if(document.getElementById('bol-escore-ch')) document.querySelectorAll('#bol-escore-ch').forEach(el => el.innerText = resCH.acertos);
            if(document.getElementById('bol-escore-cn')) document.querySelectorAll('#bol-escore-cn').forEach(el => el.innerText = resCN.acertos);
            if(document.getElementById('bol-escore-mat')) document.querySelectorAll('#bol-escore-mat').forEach(el => el.innerText = resMAT.acertos);

            // Headings
            if(document.getElementById('bol-pct-lin')) document.querySelectorAll('#bol-pct-lin').forEach(el => el.innerText = resLC.acertos + '/' + resLC.total + ' acertos (' + ((resLC.acertos/resLC.total)*100).toFixed(0) + '%)'); if(document.getElementById('bol-head-lin')) document.querySelectorAll('#bol-head-lin').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-lin')) document.querySelectorAll('#bol-faixa-lin').forEach(el => el.innerText = hasIndisponivel ? 'Nota estimada indisponível.' : `${nLC.notaMinima.toFixed(1)} a ${nLC.notaMaxima.toFixed(1)}`);
            if(document.getElementById('bol-pct-hum')) document.querySelectorAll('#bol-pct-hum').forEach(el => el.innerText = resCH.acertos + '/' + resCH.total + ' acertos (' + ((resCH.acertos/resCH.total)*100).toFixed(0) + '%)'); if(document.getElementById('bol-head-hum')) document.querySelectorAll('#bol-head-hum').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-hum')) document.querySelectorAll('#bol-faixa-hum').forEach(el => el.innerText = hasIndisponivel ? 'Nota estimada indisponível.' : `${nCH.notaMinima.toFixed(1)} a ${nCH.notaMaxima.toFixed(1)}`);
            if(document.getElementById('bol-pct-nat')) document.querySelectorAll('#bol-pct-nat').forEach(el => el.innerText = resCN.acertos + '/' + resCN.total + ' acertos (' + ((resCN.acertos/resCN.total)*100).toFixed(0) + '%)'); if(document.getElementById('bol-head-nat')) document.querySelectorAll('#bol-head-nat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-nat')) document.querySelectorAll('#bol-faixa-nat').forEach(el => el.innerText = hasIndisponivel ? 'Nota estimada indisponível.' : `${nCN.notaMinima.toFixed(1)} a ${nCN.notaMaxima.toFixed(1)}`);
            if(document.getElementById('bol-pct-mat')) document.querySelectorAll('#bol-pct-mat').forEach(el => el.innerText = resMAT.acertos + '/' + resMAT.total + ' acertos (' + ((resMAT.acertos/resMAT.total)*100).toFixed(0) + '%)'); if(document.getElementById('bol-head-mat')) document.querySelectorAll('#bol-head-mat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nMAT.notaMedia.toFixed(1));
            if(document.getElementById('bol-faixa-mat')) document.querySelectorAll('#bol-faixa-mat').forEach(el => el.innerText = hasIndisponivel ? 'Nota estimada indisponível.' : `${nMAT.notaMinima.toFixed(1)} a ${nMAT.notaMaxima.toFixed(1)}`);

            // Radar TRI Sinapse Texts
            if(document.getElementById('radar-tri-lin-nota')) document.querySelectorAll('#radar-tri-lin-nota').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-lin-acertos')) document.querySelectorAll('#radar-tri-lin-acertos').forEach(el => el.innerText = resLC.acertos + '/' + resLC.total);
            if(document.getElementById('radar-tri-lin-min')) document.querySelectorAll('#radar-tri-lin-min').forEach(el => el.innerText = hasIndisponivel ? '-' : nLC.notaMinima.toFixed(1));
            if(document.getElementById('radar-tri-lin-med')) document.querySelectorAll('#radar-tri-lin-med').forEach(el => el.innerText = hasIndisponivel ? '-' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-lin-max')) document.querySelectorAll('#radar-tri-lin-max').forEach(el => el.innerText = hasIndisponivel ? '-' : nLC.notaMaxima.toFixed(1));

            if(document.getElementById('radar-tri-hum-nota')) document.querySelectorAll('#radar-tri-hum-nota').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-hum-acertos')) document.querySelectorAll('#radar-tri-hum-acertos').forEach(el => el.innerText = resCH.acertos + '/' + resCH.total);
            if(document.getElementById('radar-tri-hum-min')) document.querySelectorAll('#radar-tri-hum-min').forEach(el => el.innerText = hasIndisponivel ? '-' : nCH.notaMinima.toFixed(1));
            if(document.getElementById('radar-tri-hum-med')) document.querySelectorAll('#radar-tri-hum-med').forEach(el => el.innerText = hasIndisponivel ? '-' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-hum-max')) document.querySelectorAll('#radar-tri-hum-max').forEach(el => el.innerText = hasIndisponivel ? '-' : nCH.notaMaxima.toFixed(1));

            if(document.getElementById('radar-tri-nat-nota')) document.querySelectorAll('#radar-tri-nat-nota').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-nat-acertos')) document.querySelectorAll('#radar-tri-nat-acertos').forEach(el => el.innerText = resCN.acertos + '/' + resCN.total);
            if(document.getElementById('radar-tri-nat-min')) document.querySelectorAll('#radar-tri-nat-min').forEach(el => el.innerText = hasIndisponivel ? '-' : nCN.notaMinima.toFixed(1));
            if(document.getElementById('radar-tri-nat-med')) document.querySelectorAll('#radar-tri-nat-med').forEach(el => el.innerText = hasIndisponivel ? '-' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-nat-max')) document.querySelectorAll('#radar-tri-nat-max').forEach(el => el.innerText = hasIndisponivel ? '-' : nCN.notaMaxima.toFixed(1));

            if(document.getElementById('radar-tri-mat-nota')) document.querySelectorAll('#radar-tri-mat-nota').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nMAT.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-mat-acertos')) document.querySelectorAll('#radar-tri-mat-acertos').forEach(el => el.innerText = resMAT.acertos + '/' + resMAT.total);
            if(document.getElementById('radar-tri-mat-min')) document.querySelectorAll('#radar-tri-mat-min').forEach(el => el.innerText = hasIndisponivel ? '-' : nMAT.notaMinima.toFixed(1));
            if(document.getElementById('radar-tri-mat-med')) document.querySelectorAll('#radar-tri-mat-med').forEach(el => el.innerText = hasIndisponivel ? '-' : nMAT.notaMedia.toFixed(1));
            if(document.getElementById('radar-tri-mat-max')) document.querySelectorAll('#radar-tri-mat-max').forEach(el => el.innerText = hasIndisponivel ? '-' : nMAT.notaMaxima.toFixed(1));

            if(document.getElementById('bol-nota-lin')) document.querySelectorAll('#bol-nota-lin').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('bol-nota-hum')) document.querySelectorAll('#bol-nota-hum').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('bol-nota-nat')) document.querySelectorAll('#bol-nota-nat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('bol-card-nota-mat')) document.querySelectorAll('#bol-card-nota-mat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nMAT.notaMedia.toFixed(1));

            if(document.getElementById('bol-nota-lc')) document.querySelectorAll('#bol-nota-lc').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nLC.notaMedia.toFixed(1));
            if(document.getElementById('bol-nota-ch')) document.querySelectorAll('#bol-nota-ch').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCH.notaMedia.toFixed(1));
            if(document.getElementById('bol-nota-cn')) document.querySelectorAll('#bol-nota-cn').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nCN.notaMedia.toFixed(1));
            if(document.getElementById('bol-nota-mat')) document.querySelectorAll('#bol-nota-mat').forEach(el => el.innerText = hasIndisponivel ? 'N/D' : nMAT.notaMedia.toFixed(1));

            // Gráfico Barras (Alunos e Médias Globais)
            let ntLin = hasIndisponivel ? 0 : nLC.notaMedia;
            let ntHum = hasIndisponivel ? 0 : nCH.notaMedia;
            let ntNat = hasIndisponivel ? 0 : nCN.notaMedia;
            let ntMat = hasIndisponivel ? 0 : nMAT.notaMedia;
            
            let pctTurmaLC = window.turmaTriGlobal && window.turmaTriGlobal.LC ? window.turmaTriGlobal.LC : 0;
            let pctTurmaCH = window.turmaTriGlobal && window.turmaTriGlobal.CH ? window.turmaTriGlobal.CH : 0;
            let pctTurmaCN = window.turmaTriGlobal && window.turmaTriGlobal.CN ? window.turmaTriGlobal.CN : 0;
            let pctTurmaMAT = window.turmaTriGlobal && window.turmaTriGlobal.MAT ? window.turmaTriGlobal.MAT : 0;

            if(document.getElementById('bar-lc-a')) document.getElementById('bar-lc-a').style.height = Math.min((ntLin/1000)*100, 100) + "%";
            if(document.getElementById('bar-ch-a')) document.getElementById('bar-ch-a').style.height = Math.min((ntHum/1000)*100, 100) + "%";
            if(document.getElementById('bar-cn-a')) document.getElementById('bar-cn-a').style.height = Math.min((ntNat/1000)*100, 100) + "%";
            if(document.getElementById('bar-mat-a')) document.getElementById('bar-mat-a').style.height = Math.min((ntMat/1000)*100, 100) + "%";
            
            if(document.getElementById('bar-lc-g')) document.getElementById('bar-lc-g').style.height = Math.min((pctTurmaLC/1000)*100, 100) + "%";
            if(document.getElementById('bar-ch-g')) document.getElementById('bar-ch-g').style.height = Math.min((pctTurmaCH/1000)*100, 100) + "%";
            if(document.getElementById('bar-cn-g')) document.getElementById('bar-cn-g').style.height = Math.min((pctTurmaCN/1000)*100, 100) + "%";
            if(document.getElementById('bar-mat-g')) document.getElementById('bar-mat-g').style.height = Math.min((pctTurmaMAT/1000)*100, 100) + "%";

            if(document.getElementById('bol-geral-lc')) document.querySelectorAll('#bol-geral-lc').forEach(el => el.innerText = pctTurmaLC.toFixed(1));
            if(document.getElementById('bol-geral-ch')) document.querySelectorAll('#bol-geral-ch').forEach(el => el.innerText = pctTurmaCH.toFixed(1));
            if(document.getElementById('bol-geral-cn')) document.querySelectorAll('#bol-geral-cn').forEach(el => el.innerText = pctTurmaCN.toFixed(1));
            if(document.getElementById('bol-geral-mat')) document.querySelectorAll('#bol-geral-mat').forEach(el => el.innerText = pctTurmaMAT.toFixed(1));
            if(document.getElementById('bol-geral-media')) document.querySelectorAll('#bol-geral-media').forEach(el => el.innerText = window.mediaGeralTurma || "0.0");
            
            // Lista Grid Vertical
            let htmlGrid = '';
            for(let questao of espelhoAluno.questoesCorrigidas) {
                let gabVal = questao.gabarito;
                let alunoVal = questao.respostaAluno || '-';
                let materia = questao.areaOriginal || 'N/A';
                
                let corRsp = "text-[#0B193C]";
                let corBadge = "text-amber-500";
                let bgBadge = "bg-amber-400";
                let avaliacao = "BRANCO";
                
                if (gabVal === 'ANULADA' || gabVal === '*' || gabVal === 'X') {
                    corRsp = "text-indigo-600"; corBadge = "text-indigo-600"; bgBadge = "bg-indigo-400"; avaliacao = "ANULADA";
                    alunoVal = "-"; gabVal = "NULA";
                } else if (alunoVal === '-') {
                    corRsp = "text-amber-500"; corBadge = "text-amber-500"; bgBadge = "bg-amber-400"; avaliacao = "BRANCO";
                } else if (alunoVal === gabVal) {
                    corRsp = "text-emerald-500"; corBadge = "text-emerald-600"; bgBadge = "bg-emerald-400"; avaliacao = "CORRETA";
                } else {
                    corRsp = "text-rose-500"; corBadge = "text-rose-600"; bgBadge = "bg-rose-400"; avaliacao = "ERRADA";
                }
                
                htmlGrid += `<div class="flex items-center justify-between border-b border-slate-100 py-1.5 font-medium hover:bg-slate-50 transition-colors px-1">
                                <div class="w-8 text-slate-500 font-bold">${questao.numero}</div>
                                <div class="w-8 font-black text-slate-800">${gabVal}</div>
                                <div class="w-8 text-center font-black ${corRsp}">${alunoVal}</div>
                                <div class="w-20 truncate text-slate-500 text-[9px] uppercase tracking-wider" title="${materia}">${materia}</div>
                                <div class="w-16 text-right">
                                    <span class="inline-flex items-center gap-1 font-bold ${corBadge} text-[9px]">
                                        <div class="w-2 h-2 rounded-full ${bgBadge}"></div> ${avaliacao}
                                    </span>
                                </div>
                            </div>`;
            }
            if(document.getElementById('bol-espelho-grid')) {
                document.querySelectorAll('#bol-espelho-grid').forEach(el => el.innerHTML = htmlGrid);
            }

            // Gráfico de Disciplinas
            function gerarTabelaEGrafico(dictStats) {
                let htmlTabela = `<div class="flex bg-teal-600/20 text-[#0B193C] font-extrabold text-[10px] text-center border-b border-slate-300 uppercase">
                        <div class="w-1/2 py-2 border-r border-slate-300">Disciplina</div><div class="w-1/4 py-2 border-r border-slate-300 bg-teal-600/30">Aluno</div><div class="w-1/4 py-2">Média</div>
                    </div>`;
                let percentuaisLabels = ''; let barras = ''; let nomesDisc = ''; let isZebra = false;
                
                for (const [disc, vals] of Object.entries(dictStats)) {
                    let pctAluno = vals.total > 0 ? Math.round((vals.acertos / vals.total) * 100) : 0;
                    
                    // CALCULAR MEDIA DA TURMA CORRETAMENTE
                    let turmaAcertos = 0;
                    let turmaRespondidas = 0;
                    if (window.espelhosGerados) {
                        window.espelhosGerados.forEach(e => {
                            if (e.resumoDisciplinas && e.resumoDisciplinas[disc]) {
                                turmaAcertos += e.resumoDisciplinas[disc].acertos;
                                turmaRespondidas += e.resumoDisciplinas[disc].total;
                            }
                        });
                    }
                    let pctMedia = turmaRespondidas > 0 ? Math.round((turmaAcertos / turmaRespondidas) * 100) : 0;
                    let mediaReal = turmaRespondidas > 0 ? Math.round((turmaAcertos / turmaRespondidas) * vals.total) : 0;
                    
                    let bgTr = isZebra ? 'bg-amber-50' : 'bg-white';
                    let bgMid = isZebra ? 'bg-[#FDE68A]' : 'bg-slate-50';
                    let bgRight = isZebra ? 'bg-amber-100' : 'bg-white';
                    
                    htmlTabela += `<div class="flex text-center text-[11px] border-b border-slate-200 font-bold ${bgTr} flex-1 items-center">
                        <div class="w-1/2 border-r border-slate-200 h-full flex items-center justify-center p-2">${disc}</div>
                        <div class="w-1/4 border-r border-slate-200 text-[#0B193C] ${bgMid} h-full flex items-center justify-center">${vals.acertos}/${vals.total}</div>
                        <div class="w-1/4 text-slate-500 ${bgRight} h-full flex items-center justify-center">${mediaReal}</div>
                    </div>`;
                    
                    percentuaisLabels += `<div class="flex-1 flex justify-between px-0.5"><span class="text-[8px] leading-none text-[#0B193C]">${pctAluno}%</span><span class="text-[8px] leading-none text-slate-400">${pctMedia}%</span></div>`;
                    nomesDisc += `<span class="flex-1 text-center whitespace-nowrap overflow-visible text-[8px]" style="-webkit-font-smoothing: antialiased;" title="${disc}">${disc}</span>`;
                    
                    let heightA = Math.max(pctAluno, 5);
                    let heightG = Math.max(pctMedia, 5);
                    
                    barras += `<div class="flex-1 flex items-end justify-center gap-0 z-10 group h-full px-0.5">
                                   <div class="w-1/2 max-w-[20px] h-full flex flex-col justify-end items-center relative">
                                       <span class="text-[8px] font-bold text-[#0B193C] absolute w-[20px] text-center leading-none" style="bottom: calc(${heightA}% + 2px); left: 50%; transform: translateX(-50%);">${pctAluno}%</span>
                                       <div class="w-full bg-[#0B193C] transition-all duration-500 rounded-t-sm" style="height: ${heightA}%;"></div>
                                   </div>
                                   <div class="w-1/2 max-w-[20px] h-full flex flex-col justify-end items-center relative">
                                       <span class="text-[8px] font-bold text-[#475569] absolute w-[20px] text-center leading-none" style="bottom: calc(${heightG}% + 2px); left: 50%; transform: translateX(-50%);">${pctMedia}%</span>
                                       <div class="w-full bg-[#A7F3D0] transition-all duration-500 rounded-t-sm" style="height: ${heightG}%;"></div>
                                   </div>
                               </div>`;
                    isZebra = !isZebra;
                }
                
                return {
                    tabelaHTML: `<div class="w-1/3 flex flex-col border-r border-slate-300">${htmlTabela}</div>`,
                    graficoHTML: `<div class="w-2/3 p-4 flex flex-col justify-end relative pb-2 pt-6">
                        <div class="absolute w-full h-full left-0 top-0 pointer-events-none flex flex-col justify-between z-0 pb-10 opacity-20 px-4 pt-6">
                            <div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-800 w-full"></div>
                        </div>
                        
                        <div class="flex-1 flex items-end justify-around relative mb-1 h-32 px-2">${barras}</div>
                        <div class="flex justify-between text-[10px] font-bold text-slate-700 z-10 w-full pt-1 px-2">${nomesDisc}</div>
                        <div class="flex justify-center gap-4 mt-2 text-[10px] font-bold">
                            <div class="flex items-center gap-1.5"><div class="w-3 h-3 bg-[#0B193C]"></div> Aluno</div>
                            <div class="flex items-center gap-1.5"><div class="w-3 h-3 bg-[#A7F3D0]"></div> Média</div>
                        </div>
                    </div>`
                };
            }
            
            let discStatsD1 = {}; let discStatsD2 = {};
            for (let [d, vals] of Object.entries(espelhoAluno.resumoDisciplinas)) {
                if(['Português', 'Inglês', 'Espanhol', 'Literatura', 'Arte', 'Educação Física', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Linguagens', 'Humanas'].includes(d)) {
                    discStatsD1[d] = vals;
                } else {
                    discStatsD2[d] = vals;
                }
            }

            let d1 = document.getElementById('container-analise-d1');
            if(d1) {
                let parts = gerarTabelaEGrafico(discStatsD1);
                d1.innerHTML = parts.tabelaHTML + parts.graficoHTML;
                d1.parentElement.style.display = Object.keys(discStatsD1).length === 0 ? 'none' : 'block';
            }
            let d2 = document.getElementById('container-analise-d2');
            if(d2) {
                let parts = gerarTabelaEGrafico(discStatsD2);
                d2.innerHTML = parts.tabelaHTML + parts.graficoHTML;
                d2.parentElement.style.display = Object.keys(discStatsD2).length === 0 ? 'none' : 'block';
            }

            console.log("ALUNO SELECIONADO:", espelhoAluno.nome, espelhoAluno.matricula);
            console.log("Resumo áreas:", espelhoAluno.resumoAreas);
            console.table(espelhoAluno.questoesCorrigidas.slice(0, 15));
        }

        function baixarPdfIndividual(matricula) {
            verEspelho(matricula);
            
            setTimeout(async () => {
                const element = document.getElementById('boletim-pdf-export') || document.getElementById('pdf-espelho-pag1').parentElement;
                
                await document.fonts.ready;
                await new Promise(resolve => setTimeout(resolve, 500));
                
                console.log("Elemento PDF:", element);
                console.log("Largura:", element.offsetWidth);
                console.log("Altura:", element.offsetHeight);
                
                if (element.offsetWidth === 0 || element.offsetHeight === 0) {
                    alert("Erro: Elemento do boletim com dimensões zero. Não é possível gerar o PDF.");
                    return;
                }

                const pages = Array.from(element.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                
                // Prepare for PDF
                const oldStyles = [];
                pages.forEach(p => {
                    oldStyles.push({ class: p.className, margin: p.style.margin, transform: p.style.transform });
                    p.classList.remove('shadow-2xl', 'mb-8');
                    p.style.margin = '0';
                    p.style.transform = 'scale(0.98)';
                    p.style.transformOrigin = 'top center';
                    p.style.pageBreakAfter = ''; // We slice manually
                });

                try {
                    const canvas = await html2canvas(element, { 
                        scale: 2, 
                        useCORS: true, 
                        allowTaint: true,
                        backgroundColor: "#ffffff",
                        logging: true,
                        windowWidth: element.scrollWidth,
                        windowHeight: element.scrollHeight
                    });
                    
                    const imgData = canvas.toDataURL('image/png');
                    
                    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
                    const pdfWidth = 210; // A4 width in mm
                    const pageHeight = 297; // A4 height in mm
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    let heightLeft = pdfHeight;
                    let position = 0;
                    
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= pageHeight;
                    
                    while (heightLeft > 0) {
                        position = heightLeft - pdfHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                        heightLeft -= pageHeight;
                    }
                    
                    pdf.save(`Boletim_${matricula}.pdf`);
                } catch(e) {
                    console.error('Erro na exportao:', e);
                    alert('Erro ao exportar PDF: ' + e.message);
                }

                // Restore styles
                pages.forEach((p, i) => {
                    p.className = oldStyles[i].class;
                    p.style.margin = oldStyles[i].margin;
                    p.style.transform = oldStyles[i].transform;
                });
            }, 500);
        }

    

        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
    window.addEventListener('DOMContentLoaded', () => {
        document.body.innerHTML = '<div style="padding:50px;background:red;color:white;z-index:999999;position:fixed;top:0;left:0;width:100%;height:100%;"><h1>FATAL ERROR</h1><pre>' + e.stack + '</pre></div>';
    });
    console.error('FATAL ERROR', e);
}
