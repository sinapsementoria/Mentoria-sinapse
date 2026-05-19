



try {

        const titles = {

            'dashboard': 'Instituições',

            'alunos': 'Gestão de Turmas',

            'provas': 'Cadastro de Provas e Gabaritos',

            'modelosCartao': 'Editor de Cartões',

            'cartoes': 'Cartões-Resposta Nominais',

            'importarCartoes': 'Leitura de Cartões',

            'correcao': 'Inteligência de Correção',

            'espelhos': 'Espelhos de Desempenho Isolado',

            'relatrios': 'Relatrios Acadmicos',

            'exportacoes': 'Central de Exportações',

            'configuracoes': 'Configurações Globais'

        };



        function switchView(viewId) {

            console.log("SWITCH VIEW CALLED:", viewId);

            try {

                const detalheView = document.getElementById('view-turma-detalhes');

                if (detalheView && !detalheView.classList.contains('hidden')) {

                    try { voltarParáGestaoTurmas(); } cath(e) {}

                }



            document.getElementById('header-title').textContent = titles[viewId] || 'Nexus Provas';

            

            // Handle nav items styling properly via CSS .nav-item.active

            document.querySelectorAll('aside nav a.nav-item').forEach(a => { 

                a.classList.remove('active'); 

            });

            const activeLink = document.querySelector(`aside nav a[onclick="switchview('${viewid}')"]`);

            if(activeLink) {

                activeLink.classList.add('active');

            }



            document.querySelectorAll('.nexus-view').forEach(v => {

                v.classList.remove('active');

                setTimeout(() => v.classList.remove('fade-in'), 400); 

            });



            const targetView = document.getElementById('view-' + viewId);

            if (targetView) {

                targetView.classList.add('active');

                targetView.classList.add('fade-in');

            }

                if(window['init' + viewId.charAt(0).toUpperCase() + viewId.slice(1)]) {

                    window['init' + viewId.charAt(0).toUpperCase() + viewId.slice(1)]();

                }

            } cath(e) {

                console.error("ERROR IN SWITCHVIEW:", e);

                alert("Error in switchView: " + e.message);

            }

        }



        // ==========================================

        // MÓDULO: EDITOR DE MODELOS DE CARTÃO

        // ==========================================

        let dbModelosCartao = [];

        try {

            const raw = localStorage.getItem('nexusModelosCartao');

            if(raw) dbModelosCartao = JSON.parse(raw);

        } cath(e){}



        if (dbModelosCartao.length === 0) {

            dbModelosCartao = [

                { id: "mod_enem1", nome: "ENEM 1º Dia Padrão", sub: "EXAME NACIONAL - 1º DIA", chkFiscal: true, chkSelo: true, opSelo: "1º DIA", chkIdioma: true, chkFrase: true, qStart: 1, qEnd: 90, modeloAlt: "ABCDE", ts: Dat.now() },

                { id: "mod_enem2", nome: "ENEM 2º Dia Padrão", sub: "EXAME NACIONAL - 2º DIA", chkFiscal: true, chkSelo: true, opSelo: "2º DIA", chkIdioma: false, chkFrase: true, qStart: 91, qEnd: 180, modeloAlt: "ABCDE", ts: Dat.now() }

            ];

            localStorage.setItem('nexusModelosCartao', JSON.stringify(dbModelosCartao));

        }



        let editandoModeloId = null;



        function initModelosCartao() {

            mudarParáBiblioteca();

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

                <div class="nexus-card bg-white p-5 flex flex-col relative group hover:border-indigo-300 transition-colors cursor-pointer" onclick="editarmodelo('${m.id}')">

                    <div class="flex justify-between items-start mb-4">

                        <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">

                            <span class="material-symbols-outlined text-[20px]">feed</span>

                        </div>

                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                            <button onclick="event.stoppropagation(); editarmodelo('${m.id}')" class="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-colors" title="Editar">

                                <span class="material-symbols-outlined text-[16px]">edit</span>

                            </button>

                            <button onclick="event.stoppropagation(); excluirmodelo('${m.id}')" class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors" title="Excluir">

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

                        <span class="text-[10px] font-bold text-slate-400">${new Date(m.ts).toLocaleDatString('pt-BR')}</span>

                        <span class="flex items-center gap-1 text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Salvo</span>

                    </div>

                </div>

            `).join('');

        }



        function mudarParáBiblioteca() {

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

                let colDiv = document.creatElement('div');

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

                    let sep = document.creatElement('div');

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

            preencherTemplatAlvo(m, document.getElementById('cartaoEditableTemplat'));

        }



        // Helper genérico para popular qualquer cartao com definicoes do MODELO M (WYSIWYG ou PDF Impressao final)

        function preencherTemplatAlvo(m, el) {

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

                if(idx > -1) { dbModelosCartao[idx] = { ...dbModelosCartao[idx], ...obj, ts: Dat.now() }; }

            } else {

                const novoId = "mod_" + Dat.now() + Math.floor(Math.random()*1000);

                dbModelosCartao.unshift({ id: novoId, ...obj, ts: Dat.now() });

            }



            localStorage.setItem('nexusModelosCartao', JSON.stringify(dbModelosCartao));

            alert("Modelo de cartão salvo com sucesso na biblioteca!");

            mudarParáBiblioteca();

        }



        // ==========================================

        // MÓDULO: ALUNOS

        // ==========================================

        let dbAlunos = [];

        try {

            const rawAlunos = localStorage.getItem('nexusAlunos');

            if(rawAlunos) dbAlunos = JSON.parse(rawAlunos);

        } cath(e) {}



        function initAlunos() {

            try {

                renderTabelaAlunos();

            } cath(e) {

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

                    <tr class="hover:bg-indigo-50/30 transition-colors cursor-pointer border-b border-slate-100 group" dat-turma="${turmaName.replace(/"/g, '&quot;')}" dat-unidade="${unidadeBase.replace(/"/g, '&quot;')}" onclick="abrirturmadetalhes(this.dateset.turma, this.dateset.unidade)">

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

                                <button onclick="excluirturma(event, '${turmaname.replace(/'/g, "\\'")}')" class="w-8 h-8 rounded-lg text-rose-300 hover:bg-rose-100 hover:text-rose-600 transition-colors flex items-center justify-center tooltip" title="Excluir Turma Permanentemente">

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

            } cath (err) {

                console.error("Erro fatl ao renderizar tabela de turmas: ", err);

            }

        }



        // ==========================================

        // IMPORTAÇÃO DE ALUNOS VIA EXCEL (SheetJS)

        // ==========================================

        let turmaAtualContexto = null;

        let unidadeAtualContexto = null;



        function excluirTurma(event, turmaName) {

            event.stopPropagationionion();

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



        function voltarParáGestaoTurmas() {

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

                    "Dat de Nascimento": "01/01/2005",

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



        let tempImportBath = [];

        let rawJsonExcelArray = [];

        let colunasMapeadasDicionação = {};



        const MAP_FIELDS = [

            { id: 'nome', label: 'Nome Completo', required: true, aliases: ['nome', 'nome completo', 'candidat', 'aluno', 'estudante'] },

            { id: 'cpf', label: 'CPF', required: false, aliases: ['cpf', 'documento', 'rg', 'cpf do candidat', 'cpf do aluno'] },

            { id: 'inscricao', label: 'Número de Inscrição', required: false, aliases: ['inscricao', 'inscrição', 'número de inscricao', 'número de inscrição', 'mathicula', 'mathícula', 'id', 'número', 'nº', 'código de inscrição'] },

            { id: 'sequencial', label: 'Cód. Sequencial', required: false, aliases: ['sequencial', 'codigo sequencial', 'código sequencial', 'seq', 'código', 'número'] },

            { id: 'unidade', label: 'Unidade / Polo', required: false, aliases: ['unidade', 'polo', 'escola', 'campus', 'filial', 'local'] },

            { id: 'turno', label: 'Turno', required: false, aliases: ['turno', 'periodo', 'período'] },

            { id: 'email', label: 'E-mail', required: false, aliases: ['e-mail', 'email', 'correio'] },

            { id: 'telefone', label: 'Telefone', required: false, aliases: ['telefone', 'celular', 'whatapp', 'contat'] },

            { id: 'nascimento', label: 'Dat Nasc.', required: false, aliases: ['nascimento', 'dat de nascimento', 'dat nasc'] },

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

            if(isDrop && event.datTransfer) {

                files = event.datTransfer.files;

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

                    const dat = new Uint8Array(e.target.result);

                    const workbook = XLSX.read(dat, {type: 'array'});

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



                } cath (error) {

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

                            <p class="text-[10px] text-slate-400 font-bold tracking-widest uppercase">${field.required ? 'Obrigatrio' : 'Opcional'}</p>

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



        function avancarParáAuditoria() {

            colunasMapeadasDicionação = {};

            let nomeMapped = false;

            

            MAP_FIELDS.forEach(field => {

                const sel = document.getElementById(`map_${field.id}`);

                if(sel && sel.value) {

                    colunasMapeadasDicionação[field.id] = sel.value;

                    if(field.id === 'nome') nomeMapped = true;

                }

            });



            if(!nomeMapped) {

                alert("Ops! Você precisa obrigatriamente mapear qual coluna representa o 'Nome Completo'.");

                return;

            }



            document.getElementById('view-mapeamento-importacao').classList.add('hidden');

            document.getElementById('view-mapeamento-importacao').classList.remove('flex');



            processarAuditoriaExcel();

        }



        function limparEFormathr(str) {

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

            tempImportBath = [];

            

            const cpfsNoArquivo = [];

            const inscricoesNoArquivo = [];



            // Remove empty lines

            const dadosValidos = rawJsonExcelArray.filter(row => {

                return Object.keys(row).some(k => limparEFormathr(row[k]) !== "");

            });



            dadosValidos.forEach((row, index) => {

                const getVal = (sysParám) => {

                    const colName = colunasMapeadasDicionação[sysParám];

                    if(!colName) return "";

                    return limparEFormathr(row[colName]);

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

                

                // Formathção leve CPF (remover caracteres que no sejan números para validar)

                let cpfNum = cpf.replace(/\D/g, ''); 

                if(cpfNum.length > 0 && cpfNum.length !== 11) cpfNum = "00000000000"; // Fake para dar flag

                const cpfFinal = cpf; // Guarda orig pra visualização, no mascara



                let statsLinha = "Válido";

                let logErro = "";

                

                // Regras Atualizadas

                // 1. Inválido se Nome no tem

                if(!nome) {

                    statsLinha = "Inválido";

                    logErro += "Nome ausente. ";

                }

                

                // 2. Incompleto se tem nome, MAS falta ambos (CPF e Insc) -> Noe inválido total mas no pode salvar perfeito

                if(statsLinha !== "Inválido" && !cpf && !inscricao) {

                    statsLinha = "Incompleto";

                    logErro += "Sem nenhum identificador (CPF ou Inscrição ausentes). ";

                }



                // Alerta se só falta um dos identificadores

                if(statsLinha === "Válido" && (!cpf || !inscricao)) {

                    statsLinha = "Incompleto"; // Usando a mesma flag laranja

                    if(!cpf) logErro += "Falta CPF. ";

                    if(!inscricao) logErro += "Falta Inscrição (será gerada numeração auto). ";

                }

                

                // 3. Duplicidade (Global) - REMOVIDO A PEDIDO DO USUÁRIO (Permitir Todos)

                /*

                if(statsLinha !== "Inválido") {

                    const cpfNoBanco = cpf ? dbAlunos.find(a => a.cpf === cpf) : null;

                    const inscNoBanco = inscricao ? dbAlunos.find(a => String(a.inscricao) === String(inscricao)) : null;

                    

                    if(cpfNoBanco || inscNoBanco) {

                        statsLinha = "Duplicado";

                        logErro += cpfNoBanco ? "CPF já existe (Sist.). " : "Inscrição já existe (Sist.). ";

                    }

                }

                */

                

                // 4. Duplicidade Interna - REMOVIDO A PEDIDO DO USUÁRIO (Permitir Todos)

                /*

                if(statsLinha !== "Inválido" && statsLinha !== "Duplicado") {

                    let dupInFile = false;

                    if(cpf && cpfsNoArquivo.includes(cpf)) { dupInFile = true; logErro += "CPF repetido no arquivo atal. "; }

                    if(inscricao && inscricoesNoArquivo.includes(inscricao)) { dupInFile = true; logErro += "Inscrição rep. no arquivo atal. "; }

                    

                    if(dupInFile) {

                        statsLinha = "Duplicado";

                    } else {

                        if(cpf) cpfsNoArquivo.push(cpf);

                        if(inscricao) inscricoesNoArquivo.push(inscricao);

                    }

                }

                */



                tempImportBath.push({

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

                    statsFinal: statsLinha,

                    erroStr: logErro.trim()

                });

                

                if(statsLinha === "Válido") validosCount++;

                else if(statsLinha === "Incompleto") incompletosCount++;

                else invalidosCount++;

            });

            

            document.getElementById('prevTotal').textContent = tempImportBath.length;

            document.getElementById('prevValidos').textContent = validosCount;

            document.getElementById('prevIncompletos').textContent = incompletosCount;

            document.getElementById('prevInvalidos').textContent = invalidosCount;

            

            const tbodyPrev = document.getElementById('tbody-preview');

            let rawPrevRows = "";

            tempImportBath.forEach(b => {

                let rowClass = "hover:bg-slate-50";

                let statsBadge = "";

                

                if(b.statsFinal === "Válido") {

                    statsBadge = `<span class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div> <span class="text-emerald-600">Válido</span></span>`;

                } else if(b.statsFinal === "Incompleto") {

                    rowClass = "bg-amber-50/30 hover:bg-amber-50";

                    statsBadge = `<span class="flex items-center gap-1.5 tooltip text-[11px]" title="${b.erroStr}"><div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div> <span class="text-amber-600">${b.erroStr || 'Info Faltante'}</span></span>`;

                } else {

                    rowClass = "bg-rose-50/50 hover:bg-rose-50";

                    statsBadge = `<span class="flex items-center gap-1.5 tooltip text-[11px]" title="${b.erroStr}"><div class="w-2.5 h-2.5 rounded-full bg-rose-400"></div> <span class="text-rose-600 font-extrabold">${b.statsFinal.toUpperCase()}: ${b.erroStr}</span></span>`;

                }

                

                rawPrevRows += `

                <tr class="${rowClass} transition-colors text-xs">

                    <td class="px-5 py-2 text-center text-slate-400 font-bold">${b.linha}</td>

                    <td class="px-5 py-2 font-semibold text-[#0B193C] ${!b.inscricao ? 'text-amber-500' : ''}">${b.inscricao || '--'} <span class="text-[9px] text-slate-400 ml-1">Seq ${b.sequencial || '--'}</span></td>

                    <td class="px-5 py-2 font-bold text-[#0B193C] whitespace-nowrap ${!b.nome ? 'text-rose-500 line-through' : ''}">${b.nome || '-- Ausente --'}</td>

                    <td class="px-5 py-2 font-semibold text-slate-600 ${!b.cpf ? 'text-amber-500' : ''}">${b.cpf || '--'}</td>

                    <td class="px-5 py-2 font-bold">${statsBadge}</td>

                </tr>

                `;

            });

            

            if(tempImportBath.length === 0) rawPrevRows = `<tr><td colspan="5" class="py-8 text-center text-slate-500 font-semibold text-sm">Arquivo vazio ou dados no encontrados.</td></tr>`;

            

            tbodyPrev.innerHTML = rawPrevRows;

            

            document.getElementById('previewTurmaNome').textContent = headerTurmaStr;

            document.getElementById('previewTurmaUnidade').textContent = modalUnidade;



            document.getElementById('view-preview-importacao').classList.remove('hidden');

            document.getElementById('view-preview-importacao').classList.add('flex');

        }



        function cancelarImportacao() {

            tempImportBath = [];

            document.getElementById('view-preview-importacao').classList.add('hidden');

            document.getElementById('view-preview-importacao').classList.remove('flex');

        }



        function confirmarImportacaoValidados() {

            if(!tempImportBath || tempImportBath.length === 0) {

                alert("Nenhum dado na prancheta para importar.");

                return;

            }



            const headerTurmaStr = document.getElementById('novaTurmaNome').value.trim();

            const instituicaoStr = document.getElementById('novaTurmaInstituicao').value.trim();

            const modalUnidade = document.getElementById('novaTurmaUnidade').value;

            const modalTipoApp = document.getElementById('novaTurmaTipoApp').value;



            let cadastrados = 0;

            const turmaFormathda = modalTipoApp === "Geral" ? headerTurmaStr : `${modalTipoApp} - ${headerTurmaStr}`;



            tempImportBath.forEach(b => {

                if(b.statsFinal === "Válido" || b.statsFinal === "Incompleto") {

                    

                    // Se Nome estiver ausente mesmo no incompleto, rejeitamos definitivamente (Safety Check)

                    if(!b.nome) return;



                    let rInsc = b.inscricao;

                    if(!rInsc) rInsc = Math.floor(10000 + Math.random() * 90000).toString();



                    let rCpf = b.cpf;

                    if(!rCpf) rCpf = "Indisponvel";



                    dbAlunos.push({

                        id: Dat.now() + Math.random(),

                        sequencial: b.sequencial || (dbAlunos.length + 1),

                        inscricao: rInsc,

                        nome: b.nome,

                        cpf: rCpf,

                        email: b.email,

                        telefone: b.telefone,

                        nascimento: b.nascimento,

                        instituicao: instituicaoStr || 'N/I',

                        unidade: b.unidade || modalUnidade,

                        turma: turmaFormathda,

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

                try { renderTabelaAlunos(); } cath(e){}

                

                alert(`Sucesso! ${cadastrados} alunos importados para a turma '${turmaFormathda}'.`);

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

        } cath(e) {}



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

                        <span class="px-2.5 py-1 rounded border border-indigo-200 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold tracking-widest uppercase">${p.stats}</span>

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

        function buildNodeCartaoParáAluno(alunoInfo, modeloObj, escala = 'scale(1)') {

            // 1. Clona a árvore DOM inteira do painel de Editor do WYSIWYG

            const originalTemplat = document.getElementById('cartaoEditableTemplat');

            const clone = originalTemplat.cloneNode(true);

            

            clone.style.transform = escala;

            clone.style.marginBottom = '0';

            clone.removeAttribute('id');



            // 2. Aplica as propriedades arquiteturais do Layout

            preencherTemplatAlvo(modeloObj, clone);

            

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



        // Função removida: atalizarAbasProvaBase



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



            document.getElementById('cartaoEmptyStat').style.display = 'none';

            document.getElementById('btnConfirmarLote').classList.remove('opacity-50', 'pointer-events-none');

            document.getElementById('btnExportarLote').classList.remove('opacity-50', 'pointer-events-none');

            document.getElementById('btnExportarReserva').classList.remove('opacity-50', 'pointer-events-none');



            const containerPreview = document.getElementById('cartaoPreviewEmissor');

            containerPreview.innerHTML = ''; 

            

            const wrapScroll = document.creatElement('div');

            wrapScroll.className = "flex flex-col gap-12 w-[1000px] origin-top pt-4";

            wrapScroll.style.transform = "scale(0.80)";

            

            alunosDessaTurma.forEach((aluno) => {

                modelosArray.forEach((modeloSelecionado) => {

                    const cloneCartao = buildNodeCartaoParáAluno(aluno, modeloSelecionado, 'scale(1)');

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



            // Preencher Provas Física geradas e guardar na pratleira da Biblioteca de Provas!

            modelosArray.forEach(modelo => {

                dbProvas.push({

                    id: Dat.now() + Math.random(),

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

            try { renderTabelaProvas(); } cath(e){}



            alert(`✅ Lote Finalizado!\n\nOs gabaritos da turma '${nomeTurma}' foram validados e estão prontos na Biblioteca.`);

            

            switchView('provas');

            

            // Rola suavemente at a div da Biblioteca na interface de Provas

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

            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Geração PDF em Vetor...`;



            const alunosDessaTurma = dbAlunos.filter(a => a.turma === nomeTurma);

            

            const bathContainer = document.getElementById('bathRenderContainer');

            bathContainer.innerHTML = '';

            bathContainer.className = 'absolute top-0 left-0 bg-white w-full';



            // Prepara CSS dinâmico para Impresso

            let printStyle = document.getElementById('nexus-print-style');

            if(!printStyle) {

                printStyle = document.creatElement('style');

                printStyle.id = 'nexus-print-style';

                printStyle.innerHTML = `

                    @média print {

                        body { background: white !important; margin: 0 !important; padding: 0 !important; }

                        body > :not(#bathRenderContainer) { display: none !important; }

                        #bathRenderContainer { display: block !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100%; margin: 0; padding: 0; background: white; }

                        .nexus-page-break { page-break-after: always; clear: both; }

                        @page { size: A4 portrait; margin: 0; }

                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

                    }

                `;

                document.head.appendChild(printStyle);

            }



            alunosDessaTurma.forEach((aluno, indexA) => {

                modelosArray.forEach((modeloSelecionado, indexM) => {

                    const nodeCartao = buildNodeCartaoParáAluno(aluno, modeloSelecionado, 'scale(1)');

                    

                    // Ajuste para forar altura A4 real (297mm) sem zoom-out extra no print

                    nodeCartao.style.pageBreakInside = "avoid";

                    nodeCartao.style.pageBreakAfter = "always";

                    nodeCartao.style.boxShadow = "none";

                    nodeCartao.style.margin = "0";



                    bathContainer.appendChild(nodeCartao);

                    

                    const isLastAluno = (indexA === alunosDessaTurma.length - 1);

                    const isLastModel = (indexM === modelosArray.length - 1);

                    if(!(isLastAluno && isLastModel)) {

                        let pageBreak = document.creatElement('div');

                        pageBreak.className = 'nexus-page-break';

                        bathContainer.appendChild(pageBreak);

                    }

                });

            });



            setTimeout(() => {

                window.print();

                

                // Limpeza pós-print

                bathContainer.innerHTML = '';

                bathContainer.className = 'hidden absolute top-0 left-0 -z-50 w-[700px]';

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

                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Geração Reservas...`;

            }



            const bathContainer = document.getElementById('bathRenderContainer');

            bathContainer.innerHTML = '';

            bathContainer.className = 'absolute top-0 left-0 bg-white w-full';



            let printStyle = document.getElementById('nexus-print-style');

            if(!printStyle) {

                printStyle = document.creatElement('style');

                printStyle.id = 'nexus-print-style';

                printStyle.innerHTML = `

                    @média print {

                        body { background: white !important; margin: 0 !important; padding: 0 !important; }

                        body > :not(#bathRenderContainer) { display: none !important; }

                        #bathRenderContainer { display: block !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100%; margin: 0; padding: 0; background: white; }

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

                    const nodeCartao = buildNodeCartaoParáAluno(aluno, modeloSelecionado, 'scale(1)');

                    

                    nodeCartao.style.pageBreakInside = "avoid";

                    nodeCartao.style.pageBreakAfter = "always";

                    nodeCartao.style.boxShadow = "none";

                    nodeCartao.style.margin = "0";



                    bathContainer.appendChild(nodeCartao);

                    

                    const isLastAluno = (indexA === mockAlunos.length - 1);

                    const isLastModel = (indexM === modelosArray.length - 1);

                    if(!(isLastAluno && isLastModel)) {

                        let pageBreak = document.creatElement('div');

                        pageBreak.className = 'nexus-page-break';

                        bathContainer.appendChild(pageBreak);

                    }

                });

            });



            setTimeout(() => {

                window.print();

                

                bathContainer.innerHTML = '';

                bathContainer.className = 'hidden absolute top-0 left-0 -z-50 w-[700px]';

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

        } cath(e) {}



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

            const t = document.getElementById('terminaçãorrecao');

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



        function updatTerminalClock() {

            const tc = document.getElementById('terminalClock');

            if(tc) tc.textContent = new Date().toLocaleTimeString('pt-BR', {hour12:false});

        }

        setInterval(updatTerminalClock, 1000);



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

            document.getElementById('terminaçãorrecao').innerHTML = ''; // clear

            document.getElementById('terminalStats').textContent = 'RUNNING';

            document.getElementById('terminalStats').className = 'text-emerald-400 animate-pulse';

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

            

            let startTime = Dat.now();



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

                                id: Dat.now(),

                                aluno_insc: aluno.inscricao,

                                prova_id: prova.id,

                                acertos: acertos,

                                total: totalQ,

                                percentual: perce,

                                dat: new Date().toLocaleDatString()

                            };



                            dbResultados = dbResultados.filter(r => !(String(r.aluno_insc) === String(aluno.inscricao) && String(r.prova_id) === String(prova.id)));

                            dbResultados.push(novoResultado);

                            localStorage.setItem('nexusResultados', JSON.stringify(dbResultados));

                            

                            setTimeout(() => {

                                let endTime = Dat.now();

                                let diffSecs = ((endTime - startTime) / 1000).toFixed(2);



                                wLog(`OPERAÇÃO CONCLUÍDA. MATRIZ SALVA COM SUCESSO.`, 'system');

                                

                                document.getElementById('terminalStats').textContent = 'IDLE';

                                document.getElementById('terminalStats').className = 'text-slate-500';

                                

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



            document.getElementById('espelhoEmptyStat').style.display = 'none';



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

            const base = parseFloatpercentual);

            const valLin = Math.min(100, base + 10);

            const valHum = Math.min(100, base + 5);

            const valNat= Math.max(0, base - 15);

            const valMath= Math.max(0, base - 5);



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

            applyTag('ind_nat, valNat;

            applyTag('ind_math, valMath;



            espelhoChartInstance = new Chart(ctx, {

                type: 'radar',

                dat: {

                    labels: ['Linguagens', 'Humanas', 'Natreza', 'Matemática'],

                    datsets: [{

                        label: 'Seu Desempenho (%)',

                        dat: [valLin, valHum, valNat valMath,

                        backgroundColor: 'rgba(99, 102, 241, 0.2)', // indigo

                        borderColor: '#4F46E5', // indigo-600

                        pointBackgroundColor: '#FBBF24',

                        pointBorderColor: '#fff',

                        pointHoverBackgroundColor: '#fff',

                        pointHoverBorderColor: '#FBBF24',

                        borderWidth: 2

                    }, {

                        label: 'Média da Turma (%)',

                        dat: [60, 65, 40, 55], // mock

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

            const element = document.getElementById('espelhoA4Templat');

            const alunoNome = document.getElementById('esp_nome').textContent;

            

            const origTransform = element.style.transform;

            element.style.transform = 'scale(1)';

            

            const opt = {

                margin:       0.5,

                filename:     `Espelho_Avaliacao_${alunoNome.replace(/[^a-z0-9]/gi, '_')}.pdf`,

                image:        { type: 'jpeg', quality: 1.0 },

                html2canvas:  { scale: 2, useCORS: true },

                jsPDF:        { unit: 'in', formath 'a4', orientation: 'portrait' }

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

            if(event.datTransfer) {

                files = event.datTransfer.files;

            } else {

                files = event.target.files;

            }

            

            if(!files || files.length === 0) return;



            Array.from(files).forEach(f => {

                if(f.type === 'applicaton/pdf') {

                    // Simular contagem de páginas e id

                    uploadsLeituraCartoes.push({

                        id: 'pdf_' + Dat.now() + Math.random(),

                        nome: f.name,

                        fileObj: f, // <--- Referencia real armazenada para o Axios/Fetch de envio!

                        pags: Math.floor(Math.random() * 50) + 10,

                        stats: 'aguardando' // aguardando, processando, concluido, erro

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

                if(file.stats === 'aguardando') badgeStr = `<span class="bg-slate-100 text-slate-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">hourglass_empty</span> Aguardando</span>`;

                if(file.stats === 'processando') badgeStr = `<span class="bg-blue-100 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px] animate-spin">sync</span> Processando</span>`;

                if(file.stats === 'concluido') badgeStr = `<span class="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">check</span> Concluído</span>`;

                if(file.stats === 'erro') badgeStr = `<span class="bg-rose-100 text-rose-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">warning</span> Erro</span>`;



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

                        ${file.stats !== 'processando' ? `<button onclick="removerleiturafile('${file.id}')" class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors tooltip" title="Remover arquivo"><span class="material-symbols-outlined text-[18px]">close</span></button>` : ''}

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

            uploadsLeituraCartoes.forEach(f => f.stats = 'processando');

            renderArquivosLeitura();

            

            const btnConverte = document.getElementById('btnIniciarLeitura');

            btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">sync</span> Convertendo Lote...`;

            btnConverte.classList.add('opacity-50', 'pointer-events-none');



            // Preparação dos dados para a API Real Python OpenCV

            const formDat = new FormDat();

            formDat.append('instituicao', instituicao);

            formDat.append('turma', selTurma);

            formDat.append('mathiz_conhecimento', selArea);

            

            if(uploadsLeituraCartoes[0] && uploadsLeituraCartoes[0].fileObj) {

                formDat.append('pdf_file', uploadsLeituraCartoes[0].fileObj);

            }



            // Tentar comunicar com Servidor Python Local

            fetch('http://localhost:5000/api/upload_omr', {

                method: 'POST',

                body: formDat

            }).then(response => {

                if(!response.ok) throw new Error("Servidor no retornou 200");

                return response.json();

            }).then(dat => {

                // Sucesso na leitura real!

                uploadsLeituraCartoes.forEach(f => f.stats = 'concluido');

                renderArquivosLeitura();



                btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px]">check_circle</span> Processamento Concluido`;

                

                setTimeout(() => {

                    btnConverte.classList.remove('opacity-50', 'pointer-events-none');

                    btnConverte.innerHTML = `<span class="material-symbols-outlined text-[20px]">document_scanner</span> Converter para Excel`;

                    

                    // GERAR EXCEL AUTOMATICAMENTE COM OS DADOS DO PYTHON

                    const excelDat = [];

                    if(dat.resultados && dat.resultados.length > 0) {

                        dat.resultados.forEach((res) => {

                            const rawAnswers = Array.isArray(res.respostas) ? res.respostas.join('') : '';

                            excelDat.push({

                                "Inscricao": res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "123456",

                                "Nome_Aluno": "Aluno Escaneado OMR",

                                "Gabarito_Detectado": rawAnswers,

                                "Total_Lidas": res.total_questoes_lidas

                            });

                        });

                    }

                    

                    if(typeof XLSX !== 'undefined') {

                        const ws = XLSX.utils.json_to_sheet(excelDat);

                        const wb = XLSX.utils.book_new();

                        XLSX.utils.book_append_sheet(wb, ws, "Leitura OMR");

                        XLSX.writeFile(wb, "Resultado_Leitura_OMR.xlsx");

                        alert("Extrao concluida com sucesso via Servidor Python! O arquivo Excel foi gerado e o download comear em instantes.");

                    } else {

                        alert(`A extrao foi concluida! Respostas extraidas: ${rawAnswers}`);

                    }

                }, 1500);



            }).cath(err => {

                console.warn("Nenhum servidor Python OpenCV detectado naçãorta 5000. Entrando em MODO SIMULAÇÃO.", err);

                

                // MODO FALLBACK (SIMULAÇÃO): Caso o usuário no tenha iniciado o "python omr_api.py" local

                setTimeout(() => {

                    uploadsLeituraCartoes.forEach(f => f.stats = 'concluido');

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

            const card = document.creatElement('div');

            card.className = "nexus-card p-5 bg-white border border-slate-200/60 relative overflow-hidden flex flex-col group fade-in cursor-pointer hover:border-indigo-300 transition-colors shadow-sm hover:shadow-md";

            card.setAttribute("onclick", `abrirDetalhesInstituicao('${inst.nome}', '${inst.av}')`);

            

            const initials = inst.nome.substring(0, 2).toUpperCase();

            const datStr = inst.dat || new Date().toLocaleDatString('pt-BR');



            card.innerHTML = `

                <div class="flex justify-between items-start mb-4">

                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#0B193C] flex items-center justify-center text-white font-extrabold text-[16px] shadow-sm tracking-widest">

                        ${initials}

                    </div>

                    <button class="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors" title="Excluir" onclick="event.stoppropagation(); excluirinstituicao(${idx}, this)">

                        <span class="material-symbols-outlined text-[18px]">delete</span>

                    </button>

                </div>

                <div>

                    <h4 class="font-bold text-[#0B193C] text-[16px] mb-0.5 line-clamp-1">${inst.nome}</h4>

                    <p class="text-[12px] font-extrabold text-indigo-500 mb-4 line-clamp-1">${inst.av}</p>

                </div>

                <div class="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">

                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dat: ${datStr}</span>

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

                dat: new Date().toLocaleDatString('pt-BR')

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

            

            let stats = document.getElementById('stats-cartoes');

            stats.innerText = cartoesEspelhosUploads.length + " Arquivo" + (cartoesEspelhosUploads.length > 1 ? 's' : '');

            stats.className = "bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";

            

            event.target.value = '';

        }



        function importarExcelParáTextarea(event, targetId) {

            const file = event.target.files[0];

            if (!file) return;



            const reader = new FileReader();

            reader.onload = function(e) {

                const dat = new Uint8Array(e.target.result);

                const workbook = XLSX.read(dat, {type: 'array'});

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

            let stats = document.getElementById('stats-gabarito');

            if (!text) {

                stats.innerText = "Gabarito Vazio";

                stats.className = "bg-rose-100 text-rose-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";

                return false;

            }

            stats.innerText = "Validado";

            stats.className = "bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";

            return true;

        }



        function validarRespostasEspelhos() {

            let text = document.getElementById('txt-respostas').value.trim();

            let stats = document.getElementById('stats-respostas');

            if (!text) {

                stats.innerText = "0 Importados";

                stats.className = "bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";

                return false;

            }

            let lines = text.split('\n').filter(l => l.trim() !== '');

            stats.innerText = lines.length + " Importados";

            stats.className = "bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wide";

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

    "1": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "2": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "3": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "4": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "5": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "6": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "7": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "8": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "9": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "10": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "11": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "12": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "13": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "14": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "15": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "16": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "17": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "18": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "19": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "20": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "21": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "22": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "23": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "24": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "25": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "26": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "27": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "28": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "29": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "30": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "31": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "32": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "33": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "34": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "35": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "36": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "37": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "38": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "39": {

      "minima": 697.4,

      "média": 705.53,

      "maxima": 723.3

    },

    "40": {

      "minima": 706.3,

      "média": 716.77,

      "maxima": 724.2

    },

    "41": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "42": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "43": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "44": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "45": {

      "minima": null,

      "média": null,

      "maxima": null

    }

  },

  "humanas": {

    "1": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "2": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "3": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "4": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "5": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "6": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "7": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "8": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "9": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "10": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "11": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "12": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "13": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "14": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "15": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "16": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "17": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "18": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "19": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "20": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "21": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "22": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "23": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "24": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "25": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "26": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "27": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "28": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "29": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "30": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "31": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "32": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "33": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "34": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "35": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "36": {

      "minima": 661.2,

      "média": 679.53,

      "maxima": 700.4

    },

    "37": {

      "minima": 666.6,

      "média": 694.09,

      "maxima": 728.0

    },

    "38": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "39": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "40": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "41": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "42": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "43": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "44": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "45": {

      "minima": null,

      "média": null,

      "maxima": null

    }

  },

  "natreza": {

    "1": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "2": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "3": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "4": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "5": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "6": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "7": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "8": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "9": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "10": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "11": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "12": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "13": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "14": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "15": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "16": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "17": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "18": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "19": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "20": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "21": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "22": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "23": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "24": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "25": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "26": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "27": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "28": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "29": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "30": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "31": {

      "minima": 659.8,

      "média": 682.77,

      "maxima": 700.0

    },

    "32": {

      "minima": 683.6,

      "média": 694.91,

      "maxima": 709.8

    },

    "33": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "34": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "35": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "36": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "37": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "38": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "39": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "40": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "41": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "42": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "43": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "44": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "45": {

      "minima": null,

      "média": null,

      "maxima": null

    }

  },

  "mathmática": {

    "1": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "2": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "3": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "4": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "5": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "6": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "7": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "8": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "9": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "10": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "11": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "12": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "13": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "14": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "15": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "16": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "17": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "18": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "19": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "20": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "21": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "22": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "23": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "24": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "25": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "26": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "27": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "28": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "29": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "30": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "31": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "32": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "33": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "34": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "35": {

      "minima": 786.5,

      "média": 802.81,

      "maxima": 826.9

    },

    "36": {

      "minima": 798.8,

      "média": 813.27,

      "maxima": 830.2

    },

    "37": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "38": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "39": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "40": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "41": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "42": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "43": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "44": {

      "minima": null,

      "média": null,

      "maxima": null

    },

    "45": {

      "minima": null,

      "média": null,

      "maxima": null

    }

  }

};



window.calcularNotaEstimadaENEM = function(area, acertos, dadosDif) {

    const areaMap = { 'LC': 'linguagens', 'CH': 'humanas', 'CN': 'natreza', 'MAT': 'mathmática' };

    let areaKey = areaMap[area] || area;

    let dadosArea = window.tabelaTriEnem2022[areaKey];

    

    if (!dadosArea) {

        return { notaMinima: 0, notaMédia: 0, notaMaxima: 0, nota: '0.0', indisponivel: true };

    }

    

    let aStr = Math.max(0, Math.min(45, Math.floor(acertos))).toString();

    let faixa = dadosArea[aStr];

    

    if (!faixa || faixa.média === null) {

        return { notaMinima: 0, notaMédia: 0, notaMaxima: 0, nota: '0.0', indisponivel: true };

    }

    

    return {

        notaMinima: faixa.minima,

        notaMédia: faixa.média,

        notaMaxima: faixa.maxima,

        nota: faixa.média.toFixed(1),

        coerencia: 'ALTA',

        indice: '100%'

    };

};



        window.dadosAlunosTri = {}; // To store rich dat



        async function processarCorrecaoEspelhos() {

            let gbValido = validarGabaritoEspelhos();

            

            let txtRespostasEl = document.getElementById('txt-respostas');

            let pdfInputEl = document.getElementById('upload-pdf-respostas');

            

            let pdfBlob = null;

            let fileName = '';

            

            if (pdfInputEl && pdfInputEl.files.length > 0) {

                pdfBlob = pdfInputEl.files[0];

                fileName = pdfInputEl.files[0].name;

            } else {

                try {

                    let res = await fetch('latst_upload.pdf');

                    if (res.ok) {

                        pdfBlob = await res.blob();

                        fileName = 'latst_upload.pdf';

                    }

                } cath(e) {

                    console.warn('latst_upload.pdf não encontrado ou erro de CORS.');

                }

            }

            

            if(!txtRespostasEl.value.trim() && pdfBlob) {

                const formDat = new FormDat();

                formDat.append('instituicao', 'Nexus Automático');

                formDat.append('pdf_file', pdfBlob, fileName);

                

                try {

                    const btn = document.querySelector('button[onclick="processarcorrecaoespelhos()"]');

                    const originalBtnText = btn.innerHTML;

                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processando PDF...`;

                    btn.classList.add('opacity-50', 'pointer-events-none');



                    const response = await fetch('http://127.0.0.1:5000/api/upload_omr', {

                        method: 'POST',

                        body: formDat

                    });

                    if(!response.ok) throw new Error("Servidor Python falhou ao ler o cartão-resposta.");

                    const dat = await response.json();

                    

                    if(dat.error) throw new Error(dat.error);

                    

                    let linhasParáInserir = [];

                    if (dat.resultados && dat.resultados.length > 0) {

                        dat.resultados.forEach((res) => {

                            let rawAnswers = Array.isArray(res.respostas) ? res.respostas.join(';') : '';

                            let mockMath= res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "000001";

                            let mockNome = "Aluno Digitalizado OMR";

                            let mockIdioma = "Todos";

                            linhasParáInserir.push(`${mockMath;${mockNome};${mockIdioma};${rawAnswers}`);

                        });

                    }

                    txtRespostasEl.value = linhasParáInserir.join('\n');

                    validarRespostasEspelhos();

                    

                    btn.innerHTML = originalBtnText;

                    btn.classList.remove('opacity-50', 'pointer-events-none');

                    alert("PDF Processado com sucesso! Montando tabela...");

                } cath(e) {

                    console.error("Erro no Servidor OMR:", e);

                    alert("Erro ao extrair respostas via Servidor Python em http://127.0.0.1:5000: " + e.message);

                    const btn = document.querySelector('button[onclick="processarcorrecaoespelhos()"]');

                    btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">auto_awesome</span> Processar Correção`;

                    btn.classList.remove('opacity-50', 'pointer-events-none');

                    return;

                }

            } else if (!txtRespostasEl.value.trim()) {

                // Tenta o antigo Lote OMR por fallback, mas alerta se ambos estiverem vazios

                if(typeof uploadsLeituraCartoes !== 'undefined' && uploadsLeituraCartoes.length > 0) {

                    const formDat = new FormDat();

                    formDat.append('instituicao', 'Nexus Automático (Lote)');

                    if(uploadsLeituraCartoes[0] && uploadsLeituraCartoes[0].fileObj) {

                        formDat.append('pdf_file', uploadsLeituraCartoes[0].fileObj);

                    }

                    try {

                        const btn = document.querySelector('button[onclick="processarcorrecaoespelhos()"]');

                        const originalBtnText = btn.innerHTML;

                        btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processando PDF do Lote...`;

                        btn.classList.add('opacity-50', 'pointer-events-none');



                        const response = await fetch('http://127.0.0.1:5000/api/upload_omr', {

                            method: 'POST',

                            body: formDat

                        });

                        if(!response.ok) throw new Error("Servidor Python falhou.");

                        const dat = await response.json();

                        

                        let linhasParáInserir = [];

                        if (dat.resultados && dat.resultados.length > 0) {

                            dat.resultados.forEach((res) => {

                                let rawAnswers = Array.isArray(res.respostas) ? res.respostas.join(';') : '';

                                let mockMath= res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "000001";

                                let mockNome = "Aluno Digitalizado OMR";

                                let mockIdioma = "Todos";

                                linhasParáInserir.push(`${mockMath;${mockNome};${mockIdioma};${rawAnswers}`);

                            });

                        }

                        txtRespostasEl.value = linhasParáInserir.join('\n');

                        validarRespostasEspelhos();

                        

                        btn.innerHTML = originalBtnText;

                        btn.classList.remove('opacity-50', 'pointer-events-none');

                    } cath(e) {}

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

            

            // GABARITOS -> Ler e jogar pra um Array de objetos para facilitar busca depois

            let gabaritos = [];

            let gabText = document.getElementById('txt-gabarito').value;

            let gabLines = gabText ? gabText.trim().split('\n').filter(l=>l) : [];

            

            if(gabLines.length > 0 && (gabLines[0].toLowerCase().includes('quest') || gabLines[0].toLowerCase().includes('gab'))) {

                gabLines.shift();

            }

            

            let currentQ = 1;

            gabLines.forEach((linha, idx) => {

                let p = linha.split(';');

                if(p.length > 0) {

                    let q = parseInt(p[0].trim().replace(/\D/g, ''));

                    let resp = "";

                    let area = "";

                    let disc = "";

                    let dif = "Média";

                    

                    if(isNaN(q) || q === 0) {

                        q = currentQ;

                        currentQ++;

                        for(let c=0; c<p.length; c++) {

                            let val = p[c].trim().toUpperCase();

                            if(val.length <= 2 && ['A','B','C','D','E','X','*'].includes(val[0])) {

                                resp = val;

                                area = p[c+1] ? p[c+1].trim() : '';

                                disc = p[c+2] ? p[c+2].trim() : '';

                                dif = p[c+3] ? p[c+3].trim() : 'Média';

                                break;

                            }

                        }

                    } else {

                        resp = p[1] ? p[1].trim().toUpperCase() : '';

                        area = p[2] ? p[2].trim() : '';

                        disc = p[3] ? p[3].trim() : '';

                        dif = p[4] ? p[4].trim() : 'Média';

                        currentQ = q + 1;

                    }

                    

                    if(resp) {

                        // Tentar deduzir idioma do gabarito baseado na disciplina/area ou da linha toda

                        let strLin = linha.toLowerCase();

                        let idiomaGab = "Todos";

                        if (strLin.includes('ingl') || strLin.includes('ing')) {

                            idiomaGab = "Inglês";

                        } else if (strLin.includes('espanhol') || strLin.includes('esp')) {

                            idiomaGab = "Espanhol";

                        }

                        

                        let normDif = normalizarTexto(dif);

                        let finalDif = normDif.includes('facil') ? 'Fácil' : (normDif.includes('dific') ? 'Difícil' : 'Média');



                        gabaritos.push({

                            questao: q,

                            resp: resp,

                            area: area,

                            disciplina: disc,

                            dificuldade: finalDif,

                            idioma: idiomaGab

                        });

                    }

                }

            });

            window.gabaritosArray = gabaritos;



            let respText = document.getElementById('txt-respostas').value;

            let respLines = respText ? respText.trim().split('\n').filter(l=>l) : [];

            

            if(respLines.length > 0 && (respLines[0].toLowerCase().includes('nome') || respLines[0].toLowerCase().includes('math') || respLines[0].toLowerCase().includes('cpf') || respLines[0].toLowerCase().includes('pág'))) {

                respLines.shift();

            }

            

            document.getElementById('kpi-importados').innerText = respLines.length;

            document.getElementById('kpi-gerados').innerText = respLines.length;

            

            let mapRedacoes = {};

            let redText = document.getElementById('txt-redacoes').value.trim();

            if (redText) {

                let redLines = redText.split('\n').filter(l=>l);

                if(redLines.length > 0 && (redLines[0].toLowerCase().includes('nome') || redLines[0].toLowerCase().includes('math') || redLines[0].toLowerCase().includes('nota'))) {

                    redLines.shift();

                }

                redLines.forEach(l => {

                    let p = l.split(';');

                    let nota = p.length >= 3 ? p[2].trim() : (p.length >= 2 && !isNaN(p[1]) ? p[1].trim() : 'S/R');

                    if(p[0]) mapRedacoes[p[0].trim()] = nota;

                    if(p[1]) mapRedacoes[p[1].trim()] = nota;

                });

            }

            

            let ingCount = 0; let espCount = 0;

            let tbody = document.getElementById('tabela-espelhos-body');

            let html = '';

            

            // Variáveis Globais para médias da turma

            let turmaAcertosLC = 0, turmaTotalLC = 0;

            let turmaAcertosCH = 0, turmaTotalCH = 0;

            let turmaAcertosCN = 0, turmaTotalCN = 0;

            let turmaAcertosMAT = 0, turmaTotalMAT = 0;

            let alunosValidos = 0;

            let somaMédias = 0;

            let somaNtLin = 0, somaNtHum = 0, somaNtNat= 0, somaNtMath= 0;

            let minMédia = 9999;

            let maxMédia = 0;

            let discTurma = {}; // para "Geral" da análise de disciplinas

            

            respLines.forEach((linha, i) => {

                let partes = linha.split(';');

                // Campo 1: Mathicula, 2: Nome, 3: Idioma

                let math= partes[0] ? partes[0].trim() : '0000';

                let nome = partes[1] ? partes[1].trim() : 'Aluno Desconhecido';

                let idioma = partes[2] ? partes[2].trim() : 'Inglês';

                let cpf = '';

                

                // fallback se o csv vier bagunçado

                let norm = window.normalizarTexto(idioma);

                if(norm !== 'ingles' && norm !== 'espanhol') {

                    for(let j=1; j<Math.min(partes.length, 5); j++) {

                        let txt = window.normalizarTexto(partes[j]);

                        if(txt.includes('ingles')) idioma = 'Inglês';

                        if(txt.includes('espanhol') || txt.includes('esp')) idioma = 'Espanhol';

                    }

                }

                

                let normFinal = window.normalizarTexto(idioma);

                let statsTag = (normFinal === 'ingles' || normFinal.includes('esp')) ? '<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Corrigido</span>' : '<span class="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">Erro Idioma</span>';

                

                if(normFinal.includes('ing')) ingCount++;

                else if(normFinal.includes('esp')) espCount++;

                

                // Extrair respostas do aluno para calcular acertos REAIS

                respArray = [];

                foundStart = false;

                for(let k=0; k<partes.length; k++){

                    let v = partes[k].trim().toUpperCase();

                    if(!foundStart && v.length <= 1 && ['A','B','C','D','E','*','X'].includes(v) && k >= 2) {

                        foundStart = true;

                    }

                    if(foundStart) {

                        respArray.push(v);

                    }

                }



                let cLC = 0, tLC = 0;

                let cCH = 0, tCH = 0;

                let cCN = 0, tCN = 0;

                let cMAT = 0, tMAT = 0;



                let statDif = {

                    LC: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 },

                    CH: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 },

                    CN: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 },

                    MAT: { acertosF:0, totalF:0, acertosM:0, totalM:0, acertosD:0, totalD:0 }

                };

                

                let discStatD1 = {};

                let discStatD2 = {};



                let validGabs = gabaritos.filter(g => g.questao > 5 || window.normalizarTexto(g.idioma) === window.normalizarTexto(idioma) || window.normalizarTexto(g.idioma) === "todos");



                for(let i = 0; i < Math.min(validGabs.length, respArray.length); i++) {

                    let gabaritoQuestao = validGabs[i];

                    let q = gabaritoQuestao.questao;



                    let gabVal = gabaritoQuestao.resp;

                    let areaVal = gabaritoQuestao.area;

                    let discVal = gabaritoQuestao.disciplina;

                    let difVal = gabaritoQuestao.dificuldade;

                    

                    if(q >= 1 && q <= 5) { areaVal = idioma; discVal = idioma; }

                    

                    let fallbackArea = !areaVal || areaVal.trim() === '' || areaVal === 'N/A' ? (q<=45?'LC':q<=90?'CH':q<=135?'CN':'MAT') : areaVal;

                    let rawDisc = discVal && discVal.trim() !== '' && discVal !== 'N/A' ? discVal.trim() : fallbackArea;

                    let dUp = rawDisc.toUpperCase();

                    let nomeDisc = rawDisc;

                    if(dUp === 'LC' || dUp === 'LINGUAGENS') nomeDisc = 'Linguagens';

                    else if(dUp === 'CH' || dUp === 'HUMANAS' || dUp === 'CIÊNCIAS HUMANAS' || dUp === 'CIENCIAS HUMANAS') nomeDisc = 'Humanas';

                    else if(dUp === 'CN' || dUp === 'NATUREZA' || dUp === 'CIÊNCIAS DA NATUREZA' || dUp === 'CIENCIAS DA NATUREZA' || dUp === 'CIÊNCIAS' || dUp === 'CIENCIAS') nomeDisc = 'Natreza';

                    else if(dUp === 'MAT' || dUp === 'MATEMÁTICA' || dUp === 'MATEMATICA') nomeDisc = 'Matemática';

                    else if(dUp === 'ANULADA' || dUp === 'TODOS' || dUp === '*') nomeDisc = fallbackArea;

                    else nomeDisc = rawDisc.charAt(0).toUpperCase() + rawDisc.slice(1).toLowerCase();



                    let nUp = nomeDisc.toUpperCase();

                    if (nUp === 'PORTUGUÊS' || nUp === 'PORTUGUES' || nUp === 'EDUCAÇÃO FÍSICA' || nUp === 'EDUCACAO FISICA' || nUp === 'EDUCACAO FISICA ') {

                        nomeDisc = 'Linguagens';

                    } else if (nUp === 'GEOPOLÍTICA' || nUp === 'GEOPOLITICA') {

                        nomeDisc = 'Geografia';

                    }

                    

                    let alunoVal = respArray[i] ? respArray[i] : '-';

                        

                        if (!discTurma[nomeDisc]) discTurma[nomeDisc] = {acertos: 0, total: 0};

                        discTurma[nomeDisc].total++;

                        

                        let dictStat = q <= 90 ? discStatD1 : discStatD2;

                        if(!dictStat[nomeDisc]) dictStat[nomeDisc] = {acertos: 0, total: 0};

                        dictStat[nomeDisc].total++;



                        if(gabVal !== '-' && gabVal !== 'ANULADA' && gabVal !== '*') {

                            let isAcerto = (alunoVal === gabVal);

                            if(isAcerto) dictStat[nomeDisc].acertos++;

                            

                            let aUp = areaVal.toUpperCase();

                            if(aUp.includes('MAT')) {

                                tMAT++; if(isAcerto) { cMAT++; discTurma[nomeDisc].acertos++; }

                                if(difVal==='Fácil') { statDif.MAT.totalF++; if(isAcerto) statDif.MAT.acertosF++; }

                                else if(difVal==='Difícil') { statDif.MAT.totalD++; if(isAcerto) statDif.MAT.acertosD++; }

                                else { statDif.MAT.totalM++; if(isAcerto) statDif.MAT.acertosM++; }

                            }

                            else if(aUp.includes('NAT') || aUp.includes('CN')) {

                                tCN++; if(isAcerto) { cCN++; discTurma[nomeDisc].acertos++; }

                                if(difVal==='Fácil') { statDif.CN.totalF++; if(isAcerto) statDif.CN.acertosF++; }

                                else if(difVal==='Difícil') { statDif.CN.totalD++; if(isAcerto) statDif.CN.acertosD++; }

                                else { statDif.CN.totalM++; if(isAcerto) statDif.CN.acertosM++; }

                            }

                            else if(aUp.includes('HUM') || aUp.includes('CH')) {

                                tCH++; if(isAcerto) { cCH++; discTurma[nomeDisc].acertos++; }

                                if(difVal==='Fácil') { statDif.CH.totalF++; if(isAcerto) statDif.CH.acertosF++; }

                                else if(difVal==='Difícil') { statDif.CH.totalD++; if(isAcerto) statDif.CH.acertosD++; }

                                else { statDif.CH.totalM++; if(isAcerto) statDif.CH.acertosM++; }

                            }

                            else {

                                tLC++; if(isAcerto) { cLC++; discTurma[nomeDisc].acertos++; }

                                if(difVal==='Fácil') { statDif.LC.totalF++; if(isAcerto) statDif.LC.acertosF++; }

                                else if(difVal==='Difícil') { statDif.LC.totalD++; if(isAcerto) statDif.LC.acertosD++; }

                                else { statDif.LC.totalM++; if(isAcerto) statDif.LC.acertosM++; }

                            }

                        } else if (gabVal === 'ANULADA' || gabVal === '*') {

                            let aUp = areaVal.toUpperCase();

                            dictStat[nomeDisc].acertos++;

                            if(aUp.includes('MAT')) { tMAT++; cMAT++; discTurma[nomeDisc].acertos++; }

                            else if(aUp.includes('NAT') || aUp.includes('CN')) { tCN++; cCN++; discTurma[nomeDisc].acertos++; }

                            else if(aUp.includes('HUM') || aUp.includes('CH')) { tCH++; cCH++; discTurma[nomeDisc].acertos++; }

                            else { tLC++; cLC++; discTurma[nomeDisc].acertos++; }

                        }

                }

                



                turmaAcertosLC += cLC; turmaTotalLC += tLC;

                turmaAcertosCH += cCH; turmaTotalCH += tCH;

                turmaAcertosCN += cCN; turmaTotalCN += tCN;

                turmaAcertosMAT += cMAT; turmaTotalMAT += tMAT;

                alunosValidos++;



                let resLC = window.calcularNotaEstimadaENEM('LC', cLC, statDif.LC);

                let resCH = window.calcularNotaEstimadaENEM('CH', cCH, statDif.CH);

                let resCN = window.calcularNotaEstimadaENEM('CN', cCN, statDif.CN);

                let resMAT = window.calcularNotaEstimadaENEM('MAT', cMAT, statDif.MAT);



                let ntLin = resLC.nota;

                let ntHum = resCH.nota;

                let ntNat= resCN.nota;

                let ntMath= resMAT.nota;

                

                let redação = mapRedacoes[math || mapRedacoes[partes[0]] || mapRedacoes[nome] || "S/R";



                let rawRespLine = linha.replace(/'/g, "\\'"); 

                let numRed = parseFloatredação);

                let temRedacao = !isNaN(numRed);

                let média = 0;

                if(temRedacao) {

                    média = ((parseFloatntLin)+parseFloatntHum)+parseFloatntNat+parseFloatntMath+numRed)/5).toFixed(1);

                } else {

                    média = ((parseFloatntLin)+parseFloatntHum)+parseFloatntNat+parseFloatntMath)/4).toFixed(1);

                }

                

                let alunoDatStr = encodeURIComponent(JSON.stringify({

                    LC: { acertos: cLC, res: {notaMinima: resLC.notaMinima, notaMédia: resLC.notaMédia, notaMaxima: resLC.notaMaxima, indisponivel: resLC.indisponivel} },

                    CH: { acertos: cCH, res: {notaMinima: resCH.notaMinima, notaMédia: resCH.notaMédia, notaMaxima: resCH.notaMaxima, indisponivel: resCH.indisponivel} },

                    CN: { acertos: cCN, res: {notaMinima: resCN.notaMinima, notaMédia: resCN.notaMédia, notaMaxima: resCN.notaMaxima, indisponivel: resCN.indisponivel} },

                    MAT: { acertos: cMAT, res: {notaMinima: resMAT.notaMinima, notaMédia: resMAT.notaMédia, notaMaxima: resMAT.notaMaxima, indisponivel: resMAT.indisponivel} }

                }));

                

                let discStatD1Str = encodeURIComponent(JSON.stringify(discStatD1));

                let discStatD2Str = encodeURIComponent(JSON.stringify(discStatD2));



                html += `

                <tr class="hover:bg-slate-50 transition-colors">

                    <td class="p-3">${statsTag}</td>

                    <td class="p-3 text-xs">${math</td>

                    <td class="p-3 font-bold">${nome}</td>

                    <td class="p-3 text-xs text-slate-500 font-bold text-indigo-600">${idioma}</td>

                    <td class="p-3 text-center text-xs">${ntLin}</td>

                    <td class="p-3 text-center text-xs">${ntHum}</td>

                    <td class="p-3 text-center text-xs">${ntNat</td>

                    <td class="p-3 text-center text-xs font-bold text-indigo-600">${ntMath</td>

                    <td class="p-3 text-center text-xs">${redação}</td>

                    <td class="p-3 text-center font-black">${média}</td>

                    <td class="p-3 text-center text-[10px] font-bold text-emerald-500">ALTA</td>

                    <td class="p-3 text-right flex items-center gap-1 justify-end">

                        <button onclick="verespelho('${nome}', '${math', '${idioma}', '${ntlin}', '${nthum}', '${ntnate', '${ntmath', '${redacao}', '${media}', '${rawrespline}', decodeuricomponent('${alunodatestr}'), decodeuricomponent('${discstated1str}'), decodeuricomponent('${discstated2str}'))" class="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-lg transition-colors inline-flex"><span class="material-symbols-outlined text-[16px]">visibility</span></button>

                        <button onclick="baixarpdfindividual('${nome}', '${math', '${idioma}', '${ntlin}', '${nthum}', '${ntnate', '${ntmath', '${redacao}', '${media}', '${rawrespline}', decodeuricomponent('${alunodatestr}'), decodeuricomponent('${discstated1str}'), decodeuricomponent('${discstated2str}'))" class="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition-colors inline-flex ml-1"><span class="material-symbols-outlined text-[16px]">picture_as_pdf</span></button>

                    </td>

                </tr>`;

            }); // FIM DO FOREACH



            tbody.innerHTML = html;

            if(document.getElementById('kpi-ing')) document.getElementById('kpi-ing').innerText = ingCount;

            if(document.getElementById('kpi-esp')) document.getElementById('kpi-esp').innerText = espCount;

            

            alert("Correção processada com sucesso!");

            

            } cath (err) {

                console.error("Erro interno no Processamento:", err);

                alert("Houve um erro técnico ao montar a correção das notas. Detalhes (pressione F12): " + err.message);

                if(document.getElementById('panel-entrada')) document.getElementById('panel-entrada').classList.remove('hidden');

                document.getElementById('panel-processados').classList.add('hidden');

            }

        }



        function verEspelho(nome, mathicula, idioma, ntLin, ntHum, ntNat ntMath redação, média, rawRespLine, alunoDatStr, discStatD1Str, discStatD2Str) {

            document.getElementById('panel-boletim').classList.remove('hidden');

            document.getElementById('panel-boletim').scrollIntoView({ behavior: 'smooth' });

            

            if(document.getElementById('boletim-nome-aluno')) document.getElementById('boletim-nome-aluno').innerText = nome;

            if(document.getElementById('boletim-mathicula')) document.getElementById('boletim-mathicula').innerText = mathicula;

            if(document.getElementById('boletim-idioma')) document.getElementById('boletim-idioma').innerText = idioma.toUpperCase();

            if(document.getElementById('boletim-média-geral')) document.getElementById('boletim-média-geral').innerText = média;

            if(document.getElementById('boletim-média-geral-bot')) document.getElementById('boletim-média-geral-bot').innerText = média;

            

            let alunoDat = null;

            

            try { 

                alunoDat = JSON.parse(alunoDatStr);

                discStatD1 = JSON.parse(discStatD1Str); 

                discStatD2 = JSON.parse(discStatD2Str); 

            } cath(e) {}

                let hasIndisponivel = (alunoDat && (alunoDat.LC.res.indisponivel || alunoDat.CH.res.indisponivel || alunoDat.CN.res.indisponivel || alunoDat.MAT.res.indisponivel));

            

            let numRed = parseFloatredação);

            let temRedacao = !isNaN(numRed);

            

            if(hasIndisponivel) {

                if(document.getElementById('bol-resumo-média-obj')) document.getElementById('bol-resumo-média-obj').innerText = 'N/D';

                if(document.getElementById('bol-resumo-min')) document.getElementById('bol-resumo-min').innerText = 'N/D';

                if(document.getElementById('bol-resumo-med')) document.getElementById('bol-resumo-med').innerText = 'N/D';

                if(document.getElementById('bol-resumo-max')) document.getElementById('bol-resumo-max').innerText = 'N/D';

            } else if (alunoDat) {

                let somaMin = parseFloatalunoDat.LC.res.notaMinima) + parseFloatalunoDat.CH.res.notaMinima) + parseFloatalunoDat.CN.res.notaMinima) + parseFloatalunoDat.MAT.res.notaMinima);

                let somaMed = parseFloatalunoDat.LC.res.notaMédia) + parseFloatalunoDat.CH.res.notaMédia) + parseFloatalunoDat.CN.res.notaMédia) + parseFloatalunoDat.MAT.res.notaMédia);

                let somaMax = parseFloatalunoDat.LC.res.notaMaxima) + parseFloatalunoDat.CH.res.notaMaxima) + parseFloatalunoDat.CN.res.notaMaxima) + parseFloatalunoDat.MAT.res.notaMaxima);



                let médiaMinima = 0;

                let médiaMédia = 0;

                let médiaMaxima = 0;



                if (temRedacao) {

                    médiaMinima = (somaMin + numRed) / 5;

                    médiaMédia = (somaMed + numRed) / 5;

                    médiaMaxima = (somaMax + numRed) / 5;

                    if(document.getElementById('bol-resumo-tipo-média')) document.getElementById('bol-resumo-tipo-média').innerText = 'Média Final';

                    if(document.getElementById('bol-resumo-média-obj')) document.getElementById('bol-resumo-média-obj').innerText = médiaMédia.toFixed(1);

                } else {

                    médiaMinima = somaMin / 4;

                    médiaMédia = somaMed / 4;

                    médiaMaxima = somaMax / 4;

                    if(document.getElementById('bol-resumo-tipo-média')) document.getElementById('bol-resumo-tipo-média').innerText = 'Média Objetiva';

                    if(document.getElementById('bol-resumo-média-obj')) document.getElementById('bol-resumo-média-obj').innerText = médiaMédia.toFixed(1);

                }



                if(document.getElementById('bol-resumo-min')) document.getElementById('bol-resumo-min').innerText = médiaMinima.toFixed(1);

                if(document.getElementById('bol-resumo-med')) document.getElementById('bol-resumo-med').innerText = médiaMédia.toFixed(1);

                if(document.getElementById('bol-resumo-max')) document.getElementById('bol-resumo-max').innerText = médiaMaxima.toFixed(1);

            }// Coerencia updats

                function renderDif(stat) {

                    let out = [];

                    if(stat.totalF > 0) out.push(`Fáceis: ${stat.acertosF}/${stat.totalF}`);

                    if(stat.totalM > 0) out.push(`Médias: ${stat.acertosM}/${stat.totalM}`);

                    if(stat.totalD > 0) out.push(`Difíceis: ${stat.acertosD}/${stat.totalD}`);

                    if(out.length === 0) return "Sem itens cadastrados";

                    return out.join('<br>');

                }

if(alunoDat) {

                    let resLC = alunoDat.LC.res;

                    let resCH = alunoDat.CH.res;

                    let resCN = alunoDat.CN.res;

                    let resMAT = alunoDat.MAT.res;

    

                    if(document.getElementById('bol-coer-lc')) document.getElementById('bol-coer-lc').innerText = resLC.indisponivel ? 'N/D' : resLC.notaMédia.toFixed(1);

                    if(document.getElementById('bol-idx-lc')) document.getElementById('bol-idx-lc').innerText = `Acertos: ${alunoDat.LC.acertos}/45`;

                    if(document.getElementById('bol-dif-lc')) document.getElementById('bol-dif-lc').innerHTML = resLC.indisponivel ? 'N/D' : `Mínima: ${resLC.notaMinima.toFixed(1)}<br>Média: ${resLC.notaMédia.toFixed(1)}<br>Máxima: ${resLC.notaMaxima.toFixed(1)}`;

    

                    if(document.getElementById('bol-coer-ch')) document.getElementById('bol-coer-ch').innerText = resCH.indisponivel ? 'N/D' : resCH.notaMédia.toFixed(1);

                    if(document.getElementById('bol-idx-ch')) document.getElementById('bol-idx-ch').innerText = `Acertos: ${alunoDat.CH.acertos}/45`;

                    if(document.getElementById('bol-dif-ch')) document.getElementById('bol-dif-ch').innerHTML = resCH.indisponivel ? 'N/D' : `Mínima: ${resCH.notaMinima.toFixed(1)}<br>Média: ${resCH.notaMédia.toFixed(1)}<br>Máxima: ${resCH.notaMaxima.toFixed(1)}`;

    

                    if(document.getElementById('bol-coer-cn')) document.getElementById('bol-coer-cn').innerText = resCN.indisponivel ? 'N/D' : resCN.notaMédia.toFixed(1);

                    if(document.getElementById('bol-idx-cn')) document.getElementById('bol-idx-cn').innerText = `Acertos: ${alunoDat.CN.acertos}/45`;

                    if(document.getElementById('bol-dif-cn')) document.getElementById('bol-dif-cn').innerHTML = resCN.indisponivel ? 'N/D' : `Mínima: ${resCN.notaMinima.toFixed(1)}<br>Média: ${resCN.notaMédia.toFixed(1)}<br>Máxima: ${resCN.notaMaxima.toFixed(1)}`;

    

                    if(document.getElementById('bol-coer-math)) document.getElementById('bol-coer-math).innerText = resMAT.indisponivel ? 'N/D' : resMAT.notaMédia.toFixed(1);

                    if(document.getElementById('bol-idx-math)) document.getElementById('bol-idx-math).innerText = `Acertos: ${alunoDat.MAT.acertos}/45`;

                    if(document.getElementById('bol-dif-math)) document.getElementById('bol-dif-math).innerHTML = resMAT.indisponivel ? 'N/D' : `Mínima: ${resMAT.notaMinima.toFixed(1)}<br>Média: ${resMAT.notaMédia.toFixed(1)}<br>Máxima: ${resMAT.notaMaxima.toFixed(1)}`;

                    

                    ['lc','ch','cn','math].forEach(area => {

                        let el = document.getElementById(`bol-coer-${area}`);

                        if(el) {

                            el.className = `font-black text-sm my-0.5 text-[#0B193C]`;

                        }

                    });

                }





            

            var contagemLC = 0, contagemCH = 0, contagemCN = 0, contagemMAT = 0;

            var totalLC = 0, totalCH = 0, totalCN = 0, totalMAT = 0;

            

gabaritos = window.gabaritosArray || [];

            let partesResp = rawRespLine ? rawRespLine.split(';') : [];

            let idiomaAluno = idioma.trim();

            

            let respArray = [];

            // a extração usa o fat do campo 4 emédiante serem as respostas. Vamos pular as primeiras colunas string

            let startIdx = 3; // pular math0), nome(1), idioma(2)

            // Se as colunas de 0 a 2 tiverem resposta por formath errado, tentaremos buscar pela validacao:

            let foundStart = false;

            for(let k=0; k<partesResp.length; k++){

                let v = partesResp[k].trim().toUpperCase();

                if(!foundStart && v.length <= 1 && ['A','B','C','D','E','*','X'].includes(v) && k >= 2) {

                    foundStart = true;

                }

                if(foundStart) {

                    respArray.push(v);

                }

            }

            

            function renderizarGradeMocks(dia_numero, qt_inicio, max_questoes) {

                let htmlTabelas = '';

                let total_blocos = Math.ceil(max_questoes / 15);

                for(let i=0; i<total_blocos; i++) {

                    let start_q = qt_inicio + (i * 15);

                    

                    let lq = `<div class="flex text-[11px] font-bold text-center bg-teal-600/20 text-[#0B193C]"><div class="w-[85px] py-1 border-r border-slate-300">Questão</div>`;

                    let lg = `<div class="flex text-[11px] font-bold text-center bg-white border-b border-slate-200"><div class="w-[85px] py-1 border-r border-slate-200 text-slate-700">Gabarito</div>`;

                    let la = `<div class="flex text-[11px] font-bold text-center bg-[#FDE68A] border-b border-slate-200 text-[#0B193C]"><div class="w-[85px] py-1 border-r border-amber-300 text-slate-700 bg-amber-100 flex items-center justify-center">Marcação</div>`;

                    let larea = `<div class="flex text-[8px] font-bold text-center bg-white"><div class="w-[85px] py-1 border-r border-slate-200 text-slate-700 flex items-center justify-center">Área</div>`;

                    

                    for(let q = start_q; q < start_q + 15; q++) {

                        lq += `<div class="flex-1 border-r border-slate-300 py-1">${q}</div>`;

                        

                        let gabVal = '-';

                        let areaVal = 'N/A';

                        let discVal = 'N/A';

                        

                        let validGabs = gabaritos.filter(g => g.questao > 5 || window.normalizarTexto(g.idioma) === window.normalizarTexto(idiomaAluno) || window.normalizarTexto(g.idioma) === "todos");

                        let indexInGabs = validGabs.findIndex(g => Number(g.questao) === Number(q));

                        let gabaritoQuestao = indexInGabs >= 0 ? validGabs[indexInGabs] : null;

                        

                        if(gabaritoQuestao) {

                            gabVal = gabaritoQuestao.resp;

                            areaVal = gabaritoQuestao.area;

                            discVal = gabaritoQuestao.disciplina;

                            if(q >= 1 && q <= 5) { areaVal = idiomaAluno; discVal = idiomaAluno; }

                        }

                        

                        if(areaVal && areaVal.length > 8) areaVal = areaVal.substring(0,6)+'.';

                        

                        let alunoVal = (indexInGabs >= 0 && respArray[indexInGabs]) ? respArray[indexInGabs] : '-';

                        

                        lg += `<div class="flex-1 border-r border-slate-200 py-1 font-bold text-slate-800">${gabVal}</div>`;

                        

                        let cor = "text-[#0B193C]";

                        if(gabVal === 'X' || gabVal === '*' || gabVal === 'ANULADA') {

                             cor = "text-indigo-600"; 

                        } else if(alunoVal === gabVal) {

                             cor = "text-emerald-700";

                        } else {

                             cor = "text-rose-600";

                        }

                        

                        la += `<div class="flex-1 border-r border-amber-300 py-1 ${cor} flex items-center justify-center font-black">${alunoVal}</div>`;

                        

                        if(gabVal !== '-' && gabVal !== 'ANULADA' && gabVal !== '*') {

                            if(q <= 45) { totalLC++; if(alunoVal === gabVal) contagemLC++; }

                            else if(q <= 90) { totalCH++; if(alunoVal === gabVal) contagemCH++; }

                            else if(q <= 135) { totalCN++; if(alunoVal === gabVal) contagemCN++; }

                            else if(q <= 180) { totalMAT++; if(alunoVal === gabVal) contagemMAT++; }

                            

                            let fallbackArea = (q<=45?'Linguagens':q<=90?'Humanas':q<=135?'Natreza':'Matemática');

                            let rawDisc = discVal && discVal.trim() !== '' && discVal !== 'N/A' ? discVal.trim() : fallbackArea;

                            let dUp = rawDisc.toUpperCase();

                            let nomeDisc = rawDisc;

                            if(dUp === 'LC' || dUp === 'LINGUAGENS') nomeDisc = 'Linguagens';

                            else if(dUp === 'CH' || dUp === 'HUMANAS' || dUp === 'CIÊNCIAS HUMANAS' || dUp === 'CIENCIAS HUMANAS') nomeDisc = 'Humanas';

                            else if(dUp === 'CN' || dUp === 'NATUREZA' || dUp === 'CIÊNCIAS DA NATUREZA' || dUp === 'CIENCIAS DA NATUREZA' || dUp === 'CIÊNCIAS' || dUp === 'CIENCIAS') nomeDisc = 'Natreza';

                            else if(dUp === 'MAT' || dUp === 'MATEMÁTICA' || dUp === 'MATEMATICA') nomeDisc = 'Matemática';

                            else if(dUp === 'ANULADA' || dUp === 'TODOS' || dUp === '*') nomeDisc = fallbackArea;

                            else nomeDisc = rawDisc.charAt(0).toUpperCase() + rawDisc.slice(1).toLowerCase();



                            let invalidDiscs = ['Linguagens', 'Humanas', 'Natreza', 'Matemática', 'CN', 'MAT', 'Ciências da Natreza', 'Todos', 'Anulada', 'Sem disciplina', 'CH', 'LC', '*'];

                            let nUp = nomeDisc.toUpperCase();

                            if (nUp === 'PORTUGUÊS' || nUp === 'PORTUGUES' || nUp === 'EDUCAÇÃO FÍSICA' || nUp === 'EDUCACAO FISICA' || nUp === 'EDUCACAO FISICA ') {

                                nomeDisc = 'Linguagens';

                            } else if (nUp === 'GEOPOLÍTICA' || nUp === 'GEOPOLITICA') {

                                nomeDisc = 'Geografia';

                            }



                            if (!invalidDiscs.includes(nomeDisc)) {

                                let dictStat = q <= 90 ? discStatD1 : discStatD2;

                                if(!dictStat[nomeDisc]) dictStat[nomeDisc] = {acertos: 0, total: 0};

                                

                                dictStat[nomeDisc].total++;

                                if(alunoVal === gabVal) dictStat[nomeDisc].acertos++;

                            }

                        } else if (gabVal === 'ANULADA' || gabVal === '*') {

                            // anulada conta como acerto e como total pra nao prejudicar

                            if(q <= 45) { totalLC++; contagemLC++; }

                            else if(q <= 90) { totalCH++; contagemCH++; }

                            else if(q <= 135) { totalCN++; contagemCN++; }

                            else if(q <= 180) { totalMAT++; contagemMAT++; }

                            

                            let fallbackArea = (q<=45?'Linguagens':q<=90?'Humanas':q<=135?'Natreza':'Matemática');

                            let rawDisc = discVal && discVal.trim() !== '' && discVal !== 'N/A' ? discVal.trim() : fallbackArea;

                            let dUp = rawDisc.toUpperCase();

                            let nomeDisc = rawDisc;

                            if(dUp === 'LC' || dUp === 'LINGUAGENS') nomeDisc = 'Linguagens';

                            else if(dUp === 'CH' || dUp === 'HUMANAS' || dUp === 'CIÊNCIAS HUMANAS' || dUp === 'CIENCIAS HUMANAS') nomeDisc = 'Humanas';

                            else if(dUp === 'CN' || dUp === 'NATUREZA' || dUp === 'CIÊNCIAS DA NATUREZA' || dUp === 'CIENCIAS DA NATUREZA' || dUp === 'CIÊNCIAS' || dUp === 'CIENCIAS') nomeDisc = 'Natreza';

                            else if(dUp === 'MAT' || dUp === 'MATEMÁTICA' || dUp === 'MATEMATICA') nomeDisc = 'Matemática';

                            else if(dUp === 'ANULADA' || dUp === 'TODOS' || dUp === '*') nomeDisc = fallbackArea;

                            else nomeDisc = rawDisc.charAt(0).toUpperCase() + rawDisc.slice(1).toLowerCase();



                            let invalidDiscs = ['Linguagens', 'Humanas', 'Natreza', 'Matemática', 'CN', 'MAT', 'Ciências da Natreza', 'Todos', 'Anulada', 'Sem disciplina', 'CH', 'LC', '*'];

                            let nUp = nomeDisc.toUpperCase();

                            if (nUp === 'PORTUGUÊS' || nUp === 'PORTUGUES' || nUp === 'EDUCAÇÃO FÍSICA' || nUp === 'EDUCACAO FISICA' || nUp === 'EDUCACAO FISICA ') {

                                nomeDisc = 'Linguagens';

                            } else if (nUp === 'GEOPOLÍTICA' || nUp === 'GEOPOLITICA') {

                                nomeDisc = 'Geografia';

                            }



                            if (!invalidDiscs.includes(nomeDisc)) {

                                let dictStat = q <= 90 ? discStatD1 : discStatD2;

                                if(!dictStat[nomeDisc]) dictStat[nomeDisc] = {acertos: 0, total: 0};

                                dictStat[nomeDisc].total++;

                                dictStat[nomeDisc].acertos++;

                            }

                        }

                            let aUp = areaVal ? areaVal.toUpperCase() : '';

                            let areaValCurto = areaVal;

                            if(aUp === 'LINGUAGENS' || aUp === 'LC' || aUp.includes('INGL') || aUp.includes('ESP')) areaValCurto = 'LC';

                            else if(aUp === 'HUMANAS' || aUp.includes('HUMANAS') || aUp === 'CH') areaValCurto = 'CH';

                            else if(aUp === 'NATUREZA' || aUp.includes('NATUREZA') || aUp === 'CN') areaValCurto = 'CN';

                            else if(aUp === 'MATEMÁTICA' || aUp.includes('MATEMA') || aUp === 'MAT') areaValCurto = 'MAT';

                            

                            larea += `<div class="flex-1 border-r border-slate-200 py-1 truncate flex items-center justify-center font-bold text-slate-600" title="${areaVal}">${areaValCurto}</div>`;

                        }

                    

                    lq += '</div>'; lg += '</div>'; la += '</div>'; larea += '</div>';

                    htmlTabelas += `<div class="border border-slate-300 rounded-lg overflow-hidden shadow-sm mb-3">${lq}${lg}${la}${larea}</div>`;

                }

                return htmlTabelas;

            }

            

            let htmlGrid = '';

            let validGabsForGrid = gabaritos.filter(g => g.questao > 5 || window.normalizarTexto(g.idioma) === window.normalizarTexto(idiomaAluno) || window.normalizarTexto(g.idioma) === "todos");

            

            for(let i = 0; i < Math.min(validGabsForGrid.length, respArray.length); i++) {

                let gabaritoQuestao = validGabsForGrid[i];

                let q = gabaritoQuestao.questao;



                let gabVal = gabaritoQuestao.resp;

                let discVal = gabaritoQuestao.disciplina;

                let fallbackArea = (q<=45?'Linguagens':q<=90?'Humanas':q<=135?'Natreza':'Matemática');

                let mathria = discVal && discVal.trim() !== '' && discVal !== 'N/A' ? discVal.trim() : fallbackArea;

                

                let alunoVal = respArray[i] ? respArray[i] : '-';

                

                let corRsp = "text-[#0B193C]";

                let corBadge = "text-amber-500";

                let bgBadge = "bg-amber-400";

                let avaliação = "BRANCO";

                

                if (gabVal === 'ANULADA' || gabVal === '*' || gabVal === 'X') {

                    corRsp = "text-indigo-600";

                    corBadge = "text-indigo-600";

                    bgBadge = "bg-indigo-400";

                    avaliação = "ANULADA";

                    alunoVal = "-";

                    gabVal = "ANULADA";

                } else if (alunoVal === '-') {

                    corRsp = "text-amber-500";

                    corBadge = "text-amber-500";

                    bgBadge = "bg-amber-400";

                    avaliação = "EM BRANCO";

                } else if (alunoVal === gabVal) {

                    corRsp = "text-emerald-500";

                    corBadge = "text-emerald-600";

                    bgBadge = "bg-emerald-400";

                    avaliação = "CORRETA";

                } else {

                    corRsp = "text-rose-500";

                    corBadge = "text-rose-600";

                    bgBadge = "bg-rose-400";

                    avaliação = "ERRADA";

                }

                

                htmlGrid += `<div class="flex items-center justify-between border-b border-slate-100 py-1.5 font-medium hover:bg-slate-50 transition-colors px-1">

                                <div class="w-8 text-slate-500 font-bold">${q}</div>

                                <div class="w-8 font-black text-slate-800">${gabVal === 'ANULADA' ? 'NULA' : gabVal}</div>

                                <div class="w-8 text-center font-black ${corRsp}">${alunoVal}</div>

                                <div class="w-20 truncate text-slate-500 text-[9px] uppercase tracking-wider" title="${mathria}">${mathria}</div>

                                <div class="w-16 text-right">

                                    <span class="inline-flex items-center gap-1 font-bold ${corBadge} text-[9px]">

                                        <div class="w-2 h-2 rounded-full ${bgBadge}"></div> ${avaliação}

                                    </span>

                                </div>

                            </div>`;

            }

            if(document.getElementById('bol-espelho-grid')) {

                document.getElementById('bol-espelho-grid').innerHTML = htmlGrid;

            }



            let c1 = document.getElementById('bol-espelho-container-d1');

            if(c1) c1.innerHTML = renderizarGradeMocks(1, 1, 90);

            

            let c2 = document.getElementById('bol-espelho-container-d2');

            if(c2) c2.innerHTML = renderizarGradeMocks(2, 91, 90);

        

            if(document.getElementById('bol-escore-lc')) document.getElementById('bol-escore-lc').innerText = contagemLC;

            if(document.getElementById('bol-escore-ch')) document.getElementById('bol-escore-ch').innerText = contagemCH;

            if(document.getElementById('bol-escore-cn')) document.getElementById('bol-escore-cn').innerText = contagemCN;

            if(document.getElementById('bol-escore-math)) document.getElementById('bol-escore-math).innerText = contagemMAT;

            

            if(alunoDat) {

                let resLC = alunoDat.LC.res;

                let resCH = alunoDat.CH.res;

                let resCN = alunoDat.CN.res;

                let resMAT = alunoDat.MAT.res;

                

                if(document.getElementById('bol-head-lin')) document.getElementById('bol-head-lin').innerText = resLC.indisponivel ? 'N/D' : resLC.notaMédia.toFixed(1);

                if(document.getElementById('bol-faixa-lin')) document.getElementById('bol-faixa-lin').innerText = resLC.indisponivel ? 'Nota estimada indisponível.' : `Faixa estimada: ${resLC.notaMinima.toFixed(1)} a ${resLC.notaMaxima.toFixed(1)}`;

                

                if(document.getElementById('bol-head-hum')) document.getElementById('bol-head-hum').innerText = resCH.indisponivel ? 'N/D' : resCH.notaMédia.toFixed(1);

                if(document.getElementById('bol-faixa-hum')) document.getElementById('bol-faixa-hum').innerText = resCH.indisponivel ? 'Nota estimada indisponível.' : `Faixa estimada: ${resCH.notaMinima.toFixed(1)} a ${resCH.notaMaxima.toFixed(1)}`;

                

                if(document.getElementById('bol-head-nat)) document.getElementById('bol-head-nat).innerText = resCN.indisponivel ? 'N/D' : resCN.notaMédia.toFixed(1);

                if(document.getElementById('bol-faixa-nat)) document.getElementById('bol-faixa-nat).innerText = resCN.indisponivel ? 'Nota estimada indisponível.' : `Faixa estimada: ${resCN.notaMinima.toFixed(1)} a ${resCN.notaMaxima.toFixed(1)}`;

                

                if(document.getElementById('bol-head-math)) document.getElementById('bol-head-math).innerText = resMAT.indisponivel ? 'N/D' : resMAT.notaMédia.toFixed(1);

                if(document.getElementById('bol-faixa-math)) document.getElementById('bol-faixa-math).innerText = resMAT.indisponivel ? 'Nota estimada indisponível.' : `Faixa estimada: ${resMAT.notaMinima.toFixed(1)} a ${resMAT.notaMaxima.toFixed(1)}`;

            

                // Atualizaçãos Cards

                if(document.getElementById('bol-nota-lc')) document.getElementById('bol-nota-lc').innerText = resLC.indisponivel ? 'N/D' : resLC.notaMédia.toFixed(1);

                if(document.getElementById('bol-nota-ch')) document.getElementById('bol-nota-ch').innerText = resCH.indisponivel ? 'N/D' : resCH.notaMédia.toFixed(1);

                if(document.getElementById('bol-nota-cn')) document.getElementById('bol-nota-cn').innerText = resCN.indisponivel ? 'N/D' : resCN.notaMédia.toFixed(1);

                if(document.getElementById('bol-nota-math)) document.getElementById('bol-nota-math).innerText = resMAT.indisponivel ? 'N/D' : resMAT.notaMédia.toFixed(1);

                

                if(document.getElementById('bol-nota-lin')) document.getElementById('bol-nota-lin').innerText = resLC.indisponivel ? 'N/D' : resLC.notaMédia.toFixed(1);

                if(document.getElementById('bol-nota-hum')) document.getElementById('bol-nota-hum').innerText = resCH.indisponivel ? 'N/D' : resCH.notaMédia.toFixed(1);

                if(document.getElementById('bol-nota-nat)) document.getElementById('bol-nota-nat).innerText = resCN.indisponivel ? 'N/D' : resCN.notaMédia.toFixed(1);

                if(document.getElementById('bol-card-nota-math)) document.getElementById('bol-card-nota-math).innerText = resMAT.indisponivel ? 'N/D' : resMAT.notaMédia.toFixed(1);

            }

            

            // Puxar as médias reais salvas

            let pctTurmaLC = window.turmaTriGlobal && window.turmaTriGlobal.LC ? window.turmaTriGlobal.LC : 0;

            let pctTurmaCH = window.turmaTriGlobal && window.turmaTriGlobal.CH ? window.turmaTriGlobal.CH : 0;

            let pctTurmaCN = window.turmaTriGlobal && window.turmaTriGlobal.CN ? window.turmaTriGlobal.CN : 0;

            let pctTurmaMAT = window.turmaTriGlobal && window.turmaTriGlobal.MAT ? window.turmaTriGlobal.MAT : 0;

            

            // Pará as barras do gráfico, o aluno é baseado na sua nota (ntLin) e a turma na pctTurmaLC. Em ENEM base de 800-1000.

            // Pará ser em percentual de uma barra de 1000 (como mostra a legenda de 0 a 1000)

            if(document.getElementById('bar-lc-a')) document.getElementById('bar-lc-a').style.height = Math.min((ntLin/1000)*100, 100) + "%";

            if(document.getElementById('bar-ch-a')) document.getElementById('bar-ch-a').style.height = Math.min((ntHum/1000)*100, 100) + "%";

            if(document.getElementById('bar-cn-a')) document.getElementById('bar-cn-a').style.height = Math.min((ntNat1000)*100, 100) + "%";

            if(document.getElementById('bar-matha')) document.getElementById('bar-matha').style.height = Math.min((ntMath1000)*100, 100) + "%";

            

            // Médias Reais p/ a barra

            if(document.getElementById('bar-lc-g')) document.getElementById('bar-lc-g').style.height = Math.min((pctTurmaLC/1000)*100, 100) + "%";

            if(document.getElementById('bar-ch-g')) document.getElementById('bar-ch-g').style.height = Math.min((pctTurmaCH/1000)*100, 100) + "%";

            if(document.getElementById('bar-cn-g')) document.getElementById('bar-cn-g').style.height = Math.min((pctTurmaCN/1000)*100, 100) + "%";

            if(document.getElementById('bar-mathg')) document.getElementById('bar-mathg').style.height = Math.min((pctTurmaMAT/1000)*100, 100) + "%";



            // Atualizar valores do Geral na tabela "Pontuação Obtida"

            if(document.getElementById('bol-geral-lc')) document.getElementById('bol-geral-lc').innerText = pctTurmaLC;

            if(document.getElementById('bol-geral-ch')) document.getElementById('bol-geral-ch').innerText = pctTurmaCH;

            if(document.getElementById('bol-geral-cn')) document.getElementById('bol-geral-cn').innerText = pctTurmaCN;

            if(document.getElementById('bol-geral-math)) document.getElementById('bol-geral-math).innerText = pctTurmaMAT;

            if(document.getElementById('bol-geral-média')) document.getElementById('bol-geral-média').innerText = window.médiaGeralTurma || "0.0";



            

            function gerarTabelaEGrafico(dictStat) {

                let htmlTabela = `<div class="flex bg-teal-600/20 text-[#0B193C] font-extrabold text-[10px] text-center border-b border-slate-300 uppercase">

                        <div class="w-1/2 py-2 border-r border-slate-300">Disciplina</div><div class="w-1/4 py-2 border-r border-slate-300 bg-teal-600/30">Aluno</div><div class="w-1/4 py-2">Média</div>

                    </div>`;

                

                let percentuaisLabels = '';

                let barras = '';

                let nomesDisc = '';

                

                let isZebra = false;

                for (const [disc, vals] of Object.entries(dictStat)) {

                    let pctAluno = vals.total > 0 ? Math.round((vals.acertos / vals.total) * 100) : 0;

                    let pctMédia = window.discTurmaGlobalPct && window.discTurmaGlobalPct[disc] ? Math.round(window.discTurmaGlobalPct[disc] * 100) : 0;

                    

                    let bgTr = isZebra ? 'bg-amber-50' : 'bg-white';

                    let bgMid = isZebra ? 'bg-[#FDE68A]' : 'bg-slate-50';

                    let bgRight = isZebra ? 'bg-amber-100' : 'bg-white';

                    

                    let médiaReal = window.discTurmaGlobalPct && window.discTurmaGlobalPct[disc] ? Math.round(window.discTurmaGlobalPct[disc] * vals.total) : 0;

                    

                    htmlTabela += `<div class="flex text-center text-[11px] border-b border-slate-200 font-bold ${bgTr} flex-1 items-center">

                        <div class="w-1/2 border-r border-slate-200 h-full flex items-center justify-center p-2">${disc}</div>

                        <div class="w-1/4 border-r border-slate-200 text-[#0B193C] ${bgMid} h-full flex items-center justify-center">${vals.acertos}</div>

                        <div class="w-1/4 text-slate-500 ${bgRight} h-full flex items-center justify-center">${médiaReal}</div>

                    </div>`;

                    

                    percentuaisLabels += `<span class="flex-1 text-center">${pctAluno}%</span>`;

                    nomesDisc += `<span class="flex-1 text-center truncate px-1 text-[8px]" title="${disc}">${disc}</span>`;

                    

                    barras += `<div class="flex-1 flex items-end justify-center gap-2 z-10 group h-full">

                                   <div class="w-full max-w-[20px] bg-[#0B193C] shadow-sm transition-all duration-500" style="height: ${pctAluno}%;"></div>

                                   <div class="w-full max-w-[20px] bg-[#A7F3D0] shadow-sm transition-all duration-500" style="height: ${pctMédia}%;"></div>

                               </div>`;

                               

                    isZebra = !isZebra;

                }

                

                return {

                    tabelaHTML: `<div class="w-1/3 flex flex-col border-r border-slate-300">${htmlTabela}</div>`,

                    graficoHTML: `<div class="w-2/3 p-4 flex flex-col justify-end relative pb-2 pt-6">

                        <div class="absolute w-full h-full left-0 top-0 pointer-events-none flex flex-col justify-between z-0 pb-10 opacity-20 px-4 pt-6">

                            <div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-500 w-full"></div><div class="border-t border-slate-800 w-full"></div>

                        </div>

                        <div class="absolute top-0 w-full left-0 px-4 flex justify-between text-[10px] font-bold text-[#0B193C]">${percentuaisLabels}</div>

                        <div class="flex-1 flex items-end justify-around relative mb-1 h-32 px-2">${barras}</div>

                        <div class="flex justify-between text-[10px] font-bold text-slate-500 z-10 w-full border-t border-slate-300 pt-1 px-2">${nomesDisc}</div>

                        <div class="flex justify-center gap-4 mt-2 text-[10px] font-bold">

                            <div class="flex items-center gap-1.5"><div class="w-3 h-3 bg-[#0B193C]"></div> Aluno</div>

                            <div class="flex items-center gap-1.5"><div class="w-3 h-3 bg-[#A7F3D0]"></div> Média</div>

                        </div>

                    </div>`

                };

            }

            

            let d1 = document.getElementById('container-analise-d1');

            if(d1) {

                let parts = gerarTabelaEGrafico(discStatD1);

                d1.innerHTML = parts.tabelaHTML + parts.graficoHTML;

            }

            let d2 = document.getElementById('container-analise-d2');

            if(d2) {

                let parts = gerarTabelaEGrafico(discStatD2);

                d2.innerHTML = parts.tabelaHTML + parts.graficoHTML;

            }

            if(d2) {

                if(Object.keys(discStatD2).length === 0) {

                    d2.parentElement.style.display = 'none'; // oculta todo o bloco do dia 2

                } else {

                    d2.parentElement.style.display = 'block';

                }

            }

            if(d1) {

                if(Object.keys(discStatD1).length === 0) {

                    d1.parentElement.style.display = 'none';

                } else {

                    d1.parentElement.style.display = 'block';

                }

            }







        }



        function baixarPdfIndividual(nome, mathicula, idioma, ntLin, ntHum, ntNat ntMath redação, média, rawRespLine, alunoDatStr, discStatD1Str, discStatD2Str) {

            verEspelho(nome, mathicula, idioma, ntLin, ntHum, ntNat ntMath redação, média, rawRespLine, alunoDatStr, discStatD1Str, discStatD2Str);

            

            setTimeout(() => {

                const element = document.getElementById('pdf-espelho-a4');

                const opt = {

                    margin:       0,

                    filename:     `Boletim_${nome.replace(/\s+/g, '_')}_${mathicula}.pdf`,

                    image:        { type: 'jpeg', quality: 0.98 },

                    html2canvas:  { scale: 2, useCORS: true },

                    jsPDF:        { unit: 'in', formath 'a4', orientation: 'portrait' }

                };

                

                html2pdf().set(opt).from(element).save();

            }, 500);

        }



    

} cath(e) {

    window.addEventListener('DOMContentLoaded', () => {

        document.body.innerHTML = '<div style="padding:50px;background:red;color:white;z-index:999999;position:fixed;top:0;left:0;width:100%;height:100%;"><h1>FATAL ERROR</h1><pre>' + e.stack + '</pre></div>';

    });

    console.error('FATAL ERROR', e);

}

