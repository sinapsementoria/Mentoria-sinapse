

// === NOVO MOTOR GABARITO COMENTADO V2 ===

let dbQuestoesV2 = [];

let idxCounterV2 = 0;



function goToGabV2Step(num) {

    document.querySelectorAll('.vGabStep').forEach(s => { s.classList.add('hidden'); s.classList.remove('block'); });

    const target = document.getElementById(`vGabStep${num}`);

    if(target) { target.classList.remove('hidden'); target.classList.add('block'); }

    

    document.querySelectorAll('.step-gabV2-btn').forEach((btn, index) => {

        let span = btn.querySelector('span');

        let i = index + 1;

        if(i <= num) {

            btn.classList.add('bg-indigo-50', 'text-indigo-700', 'border-indigo-200');

            btn.classList.remove('text-slate-400', 'bg-transparent', 'border-transparent');

            span.classList.add('bg-indigo-600', 'text-white');

            span.classList.remove('bg-slate-100');

        } else {

            btn.classList.remove('bg-indigo-50', 'text-indigo-700', 'border-indigo-200');

            btn.classList.add('text-slate-400', 'bg-transparent', 'border-transparent');

            span.classList.remove('bg-indigo-600', 'text-white');

            span.classList.add('bg-slate-100');

        }

    });

    

    // Atualiza listas quando entra nos passos

    if(num === 2) renderListaLeitura();

    if(num === 3) renderListaGabaritos();

    if(num === 4) renderListaMetadados();

    if(num === 5) renderListaComentarios();

    if(num === 6) renderRevisaoFinal();

    if(num === 7) renderGabV2RenderPDF();

}



function iniciarProcessamentoFalsoPDF(input) {

    if(!input.files || input.files.length === 0) return;

    document.getElementById('gabV2-dropzone').classList.add('hidden');

    let proc = document.getElementById('gabV2-processing');

    proc.classList.remove('hidden');

    

    let msgs = [

        "Iniciando Módulo OCR Neural...",

        "Quebrando blocos de texto (1/4)...",

        "Identificando áreas de Múltipla Escolha...",

        "Distinguindo Linguagem Estrangeira (Inglês/Espanhol)...",

        "Extraindo imagens e figuras...",

        "Montando grade estrutural. Quase pronto..."

    ];

    let msgEl = document.getElementById('gabV2-procMsg');

    let barEl = document.getElementById('gabV2-procBar');

    

    let c = 0;

    let ival = setInterval(() => {

        c++;

        if(c >= msgs.length) {

            clearInterval(ival);

            // Geração Dinâmica de Questões para Simulação de OCR do PDF

            let nomeArq = input.files[0] ? input.files[0].name : 'Prova.pdf';

            let numStr = prompt("O módulo Nexus AI detectou a leitura de " + nomeArq + "\nPará a simulação visual agora, quantas questões você deseja que sejam lidas/extraídas deste PDF?", "90");

            let numDesejado = parseInt(numStr) || 5;

            

            dbQuestoesV2 = [];

            for (let i = 1; i <= numDesejado; i++) {

                let area = 'Conhecimentos Gerais';

                let origin = 'Geral';

                let math= '';

                

                // Distribuição ENEM

                if(i <= 5) {

                    origin = 'Língua Inglesa'; math= 'Inglês';

                    dbQuestoesV2.push({ id: ++idxCounterV2, origemLinguagem: origin, numero: String(i).padStart(2,'0'), alt: '', math math ass: '', comp: '', hab: '', enun: 'Questão extraída do documento PDF ('+nomeArq+')...', coment: '', img: null });

                    

                    origin = 'Língua Espanhola'; math= 'Espanhol';

                    dbQuestoesV2.push({ id: ++idxCounterV2, origemLinguagem: origin, numero: String(i).padStart(2,'0'), alt: '', math math ass: '', comp: '', hab: '', enun: 'Questão extraída do documento PDF ('+nomeArq+')...', coment: '', img: null });

                    continue;

                } else if(i <= 45) {

                    area = 'Linguagens';

                    math= 'Português e Literatra';

                } else if(i <= 90) {

                    area = 'Humanas';

                    math= 'História/Geografia/Filo/Socio';

                } else if(i <= 135) {

                    area = 'Natreza';

                    math= 'Biologia/Química/Física';

                } else {

                    area = 'Matemática';

                    math= 'Matemática';

                }

                

                dbQuestoesV2.push({ id: ++idxCounterV2, origemLinguagem: area, numero: String(i).padStart(2,'0'), alt: '', math math ass: '', comp: '', hab: '', enun: 'Texto extraído do documento PDF ('+nomeArq+')...', coment: '', img: null });

            }

            goToGabV2Step(2);

        } else {

            msgEl.innerText = msgs[c];

            barEl.style.width = ((c / msgs.length)*100) + '%';

        }

    }, 800);

}



// ---------------- ETAPA 2 ----------------

function renderListaLeitura() {

    let html = '';

    dbQuestoesV2.forEach((q, i) => {

        html += `

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all hover:border-indigo-300">

            <div class="flex justify-between items-center mb-3">

                <div class="flex items-center gap-3">

                    <div class="w-10 h-10 rounded-xl bg-[#0B193C] text-white flex items-center justify-center font-black">${String(q.numero).padStart(2,'0')}</div>

                    <div>

                        <h6 class="font-bold text-sm text-[#0B193C]">Questão Extraída</h6>

                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 rounded px-1.5 py-0.5 inline-block">${q.origemLinguagem}</p>

                    </div>

                </div>

                <div class="flex gap-2">

                    <button class="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-[#0B193C] border border-slate-200 rounded-lg flex gap-1"><span class="material-symbols-outlined text-[16px]">edit</span> Editar Enunciado</button>

                    <button onclick="dbquestoesv2.splice(${i}, 1); renderlistaleitura();" class="px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"><span class="material-symbols-outlined text-[16px]">delete</span></button>

                </div>

            </div>

            <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">${q.enun || 'Sem texto extraído. (Requer revisão)'}</p>

        </div>`;

    });

    if(html==='') html = `<div class="p-10 text-center text-slate-400 font-bold bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">Nenhuma questão mapeada.</div>`;

    document.getElementById('gabV2-list-leituras').innerHTML = html;

}



function gabAddQuestaoVazia() {

    dbQuestoesV2.push({ id: ++idxCounterV2, origemLinguagem: 'Geral', numero: (dbQuestoesV2.length+1).toString(), alt: '', math '', ass: '', comp: '', hab: '', enun: 'Questão inserida manualmente.', coment: '', img: null });

    renderListaLeitura();

}



// ---------------- ETAPA 3 ----------------

function renderListaGabaritos() {

    let hist = 0;

    let html = '';

    dbQuestoesV2.forEach((q, i) => {

        if(!q.alt) hist++;

        html += `

        <div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">

            <div class="w-12 h-12 shrink-0 rounded-lg bg-slate-100 text-[#0B193C] flex flex-col items-center justify-center font-black">

                <span class="text-[16px] leading-tight">${String(q.numero).padStart(2,'0')}</span>

                <span class="text-[8px] uppercase tracking-tighter w-full text-center overflow-hidden">${q.origemLinguagem.slice(0,3)}</span>

            </div>

            <div class="flex-1 overflow-hidden">

                <p class="text-xs text-slate-500 line-clamp-1 italic">${q.enun}</p>

            </div>

            <div class="shrink-0 flex items-center gap-2 pr-2">

                <label class="text-[10px] font-bold text-slate-400 uppercase">Resp:</label>

                <select id="gabSel-${q.id}" class="bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-400 text-center" onchange="updatAltValue(${q.id}, this)">

                    <option value="" ${!q.alt?'selected':''}>-</option>

                    <option value="A" ${q.alt==='A'?'selected':''}>A</option>

                    <option value="B" ${q.alt==='B'?'selected':''}>B</option>

                    <option value="C" ${q.alt==='C'?'selected':''}>C</option>

                    <option value="D" ${q.alt==='D'?'selected':''}>D</option>

                    <option value="E" ${q.alt==='E'?'selected':''}>E</option>

                    <option value="ANULADA" ${q.alt==='ANULADA'?'selected':''}>ANULADA</option>

                </select>

            </div>

        </div>`;

    });

    document.getElementById('gabV2-list-gabaritos').innerHTML = html;

    document.getElementById('gabV2-pendentesGab').innerText = hist;

}

function updatAltValue(id, selectEl) {

    let f = dbQuestoesV2.find(x => x.id === id);

    if(f) f.alt = selectEl.value;

    document.getElementById('gabV2-pendentesGab').innerText = dbQuestoesV2.filter(x=>!x.alt).length;

}



function applyMassGabarito() {

    let t = document.getElementById('gabV2-massImport').value;

    if(!t) return;

    // Padrão ex: "01-A", "2 B", "3C", "45 Anulada"

    let linhas = t.split('\n');

    linhas.forEach(linha => {

        let str = linha.trim().toUpperCase();

        let mathh = str.mathh(/(?:^|\b)(\d+)[\s\-\)\]]*([A-E]|ANULADA)/);

        if(mathh) {

            let n = mathh[1]; // numero string

            let a = mathh[2];

            let qs = dbQuestoesV2.filter(x => Number(x.numero) === Number(n));

            qs.forEach(q => q.alt = a); // Se houver Inglês 01 e Espanhol 01, ele injeta nas duas se importar "1-A". Admin depois reajusta.

        }

    });

    renderListaGabaritos();

}



// ---------------- ETAPA 4 ----------------

function renderListaMetadados() {

    let html = '';

    dbQuestoesV2.forEach((q, i) => {

        html += `

        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative group overflow-hidden">

            <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-200 group-hover:bg-indigo-500 transition-colors"></div>

            <div class="flex gap-4 mb-3">

                <div class="w-10 h-10 rounded-lg bg-[#0B193C] text-white flex items-center justify-center font-black shrink-0 relative">

                    ${String(q.numero).padStart(2,'0')}

                    <div class="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center text-[10px] font-black">${q.alt||'-'}</div>

                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">

                    <div>

                        <label class="block text-[9px] font-black uppercase tracking-widest text-[#0B193C] mb-1">Mathria</label>

                        <input type="text" value="${q.math" onchange="qMeta(${i}, 'math, this)" placeholder="História..." class="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-400 outline-none">

                    </div>

                    <div>

                        <label class="block text-[9px] font-black uppercase tracking-widest text-[#0B193C] mb-1">Assunto</label>

                        <input type="text" value="${q.ass}" onchange="qMeta(${i}, 'ass', this)" placeholder="Guerra Fria..." class="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-400 outline-none">

                    </div>

                    <div>

                        <label class="block text-[9px] font-black uppercase tracking-widest text-[#0B193C] mb-1">Competência</label>

                        <input type="text" value="${q.comp}" onchange="qMeta(${i}, 'comp', this)" placeholder="C2" class="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-400 outline-none">

                    </div>

                    <div>

                        <label class="block text-[9px] font-black uppercase tracking-widest text-[#0B193C] mb-1">Habilidade</label>

                        <input type="text" value="${q.hab}" onchange="qMeta(${i}, 'hab', this)" placeholder="H8" class="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-400 outline-none">

                    </div>

                </div>

            </div>

        </div>`;

    });

    document.getElementById('gabV2-list-metadados').innerHTML = html;

}

function qMeta(idx, field, el) { dbQuestoesV2[idx][field] = el.value; }



function sugerirMetadadosIA() {

    dbQuestoesV2.forEach(q => {

        if(!q.math q.math= q.origemLinguagem !== 'Geral' ? q.origemLinguagem : 'Conhecimentos Gerais';

        if(!q.ass) q.ass = 'Leitura e Interpretação de Textos';

        if(!q.comp) q.comp = '1';

        if(!q.hab) q.hab = '3';

    });

    renderListaMetadados();

}



// ---------------- ETAPA 5 ----------------

function renderListaComentarios() {

    let ht = '';

    let completados = dbQuestoesV2.filter(x=>x.coment).length;

    document.getElementById('gabV2-coment-progress').innerText = `${completados}/${dbQuestoesV2.length} Gerados`;

    

    dbQuestoesV2.forEach((q, i) => {

        ht += `

        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50">

            <div class="flex justify-between items-center mb-2">

                <span class="font-extrabold text-[#0B193C] text-sm flex gap-2 items-center"><div class="w-6 h-6 rounded bg-indigo-600 text-white font-black flex items-center justify-center text-xs">${String(q.numero).padStart(2,'0')}</div> ${q.alt ? 'Resp: ' + q.alt : '<span class="text-red-500">SEM RESPOSTA</span>'}</span>

                <span class="${q.coment ? 'text-emerald-500' : 'text-amber-500'} text-[10px] font-black uppercase bg-white px-2 py-1 rounded shadow-sm border border-slate-100">${q.coment ? 'Revisado via Akili' : 'Pendente...'}</span>

            </div>

            <textarea id="gabC-${q.id}" onchange="dbQuestoesV2[${i}].coment = this.value; renderListaComentarios();" class="w-full bg-white p-3 rounded-lg border border-indigo-100 text-xs font-medium text-slate-600 resize-none outline-none custom-scrollbar" rows="3" placeholder="Comentário da questão... Aguardando execução Akili.">${q.coment||''}</textarea>

        </div>`;

    });

    document.getElementById('gabV2-list-comentarios').innerHTML = ht;

}



function runAkiliMassComents() {

    let consoleBox = document.getElementById('gabV2-console-ia');

    let btn = document.getElementById('btn-gabV2-abili');

    btn.innerHTML = `<span class="material-symbols-outlined animate-spin">sync</span> Injetando Módulo de Análise Pedagógica...`;

    consoleBox.innerHTML += `<div><span class="text-slate-500">>></span> Inicializando processamento de linguagem natral...</div>`;

    

    setTimeout(() => {

        let i = 0;

        let p = setInterval(() => {

            if(i >= dbQuestoesV2.length) {

                clearInterval(p);

                btn.innerHTML = `<span class="material-symbols-outlined text-emerald-500">task_alt</span> Inteligência Pedagógica Aplicada`;

                consoleBox.innerHTML += `<div class="text-emerald-400 mt-2">>> Operação finalizada com sucesso! Todos os gabaritos receberam fundamentos pedagógicos.</div>`;

                consoleBox.scrollTop = consoleBox.scrollHeight;

                return;

            }

            if(!dbQuestoesV2[i].coment) {

                let text = "";

                if(dbQuestoesV2[i].alt === 'ANULADA') {

                    text = `Questão anulada conforme revisão do gabarito oficial e banca julgadora.`;

                } else if(!dbQuestoesV2[i].alt) {

                    text = `[AVISO] Não foi possível gerar comentário defensivo assertivo pois a Alternatva Correta não foi informada pelo administrador.`;

                } else {

                    let mathriaStr = (dbQuestoesV2[i].math|| "").toLowerCase();

                    let alt = dbQuestoesV2[i].alt;

                    

                    if (mathriaStr.includes("mathm") || mathriaStr.includes("raciocínio") || mathriaStr.includes("geometria")) {

                        text = `Dados do problema:

- Total do conjunto F: n(F) = 60

- Interseções conhecidas e definidas.



Representação:

(Diagrama de Venn / Esquema de Conjuntos)



Cálculo:

Seja x a interseção central dos conjuntos.

45 - x = 30

x = 15



Logo, substituindo na equação geral:

n(F) = z + 30 + 15 + 2 = 60

z = 13



Totalizando todas as regiões do universo:

TOT = 13 + 30 + 15 + 15 + 5 + 2 + 13 + 6

TOT = 99



Conclusão:

Somando todas as partes isoladas do diagrama, o total exat é 99.



Resposta: ${alt}`;

                    } else if (mathriaStr.includes("física") || mathriaStr.includes("fisica")) {

                        text = `Dados:

v = 20 m/s

R = 50 m

g = 10 m/s²



Fórmula:

Fcp = m · v² / R



Como a força de atito ata como resultante centrípeta:

Fat= Fcp



Substituindo os valores:

μ · m · g = m · v² / R



Cancelando a massa (m) de ambos os lados:

μ · g = v² / R



μ · 10 = (20)² / 50

μ · 10 = 400 / 50

μ · 10 = 8

μ = 0,8



Conclusão:

O coeficiente de atito dinâmico necessário para manter a trajetória sem derrapar é 0,8.



Resposta: ${alt}`;

                    } else if (mathriaStr.includes("química") || mathriaStr.includes("quimica")) {

                        text = `A questão aborda a relação estequiométrica em reações de combustão.



Reação:

C2H6O + 3 O2 → 2 CO2 + 3 H2O



Balanceamento:

1 mol de Etanol para 3 mols de Oxigênio molecular.



Relação estequiométrica:

46g de C2H6O — 2(44g) de CO2

138g de C2H6O — X



Cálculo:

X = (138 · 88) / 46

X = 264g de CO2



Conclusão:

A massa de dióxido de carbono gerada naçãombustão completa é de 264g.



Resposta: ${alt}`;

                    } else if (mathriaStr.includes("biologia")) {

                        text = `A questão trat de herança genética e probabilidade fenotípica.



Cruzamento:

Aa × Aa



Quadro de possibilidades:

AA | Aa | Aa | aa



Indivíduos afetados:

AA, Aa e Aa



Total afetado:

3/4 = 75%



Conclusão:

Assim, a doença apresenta comportamento dominante, pois aparece em indivíduos com apenas um alelo dominante. A alternatva correta aponta exatmente essa proporção genética esperada.



Resposta: ${alt}`;

                    } else {

                        text = `O texto base discute os fenômenos estruturais do tema em análise, abordando a perspectiva crítica cobrada na questão.



- O primeiro ponto identifica a tese central do enunciado.

- O segundo aspecto avalia a consequência direta no contexto apresentado.



A alternatva correta é a letra ${alt} porque ela sintetiza, de forma acurada, a linha interpretatva central requerida pela habilidade ${dbQuestoesV2[i].hab || 'avaliada'}. O candidat deveria inferir do texto que as demais opções apresentam falhas factuais pontuais.



Resposta: ${alt}`;

                    }

                }

                dbQuestoesV2[i].coment = text;

                

                consoleBox.innerHTML += `<div class="text-indigo-200">>> Q${String(dbQuestoesV2[i].numero).padStart(2,'0')} > Elaborando defesa para Alternatva [${dbQuestoesV2[i].alt||'None'}]... Sucesso.</div>`;

                consoleBox.scrollTop = consoleBox.scrollHeight;

                renderListaComentarios();

            }

            i++;

        }, 600);

    }, 1500);

}



// ---------------- ETAPA 6 ----------------

function renderRevisaoFinal() {

    let c = document.getElementById('gabV2-alerts-container');

    let sm = document.getElementById('gabV2-success-msg');

    

    let semAlt = dbQuestoesV2.filter(x => !x.alt).length;

    let semMath= dbQuestoesV2.filter(x => !x.math|| !x.ass).length;

    let semComent = dbQuestoesV2.filter(x => !x.coment).length;

    

    let html = '';

    

    if(semAlt > 0) {

        html += `<div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-800">

            <span class="material-symbols-outlined shrink-0 text-rose-500">error</span>

            <div><p class="font-black text-sm">Existem ${semAlt} questões sem resposta!</p><p class="text-xs mt-0.5 opacity-80">Por favor, retorne à aba de Gabarito.</p></div>

        </div>`;

    }

    if(semComent > 0) {

        html += `<div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800">

            <span class="material-symbols-outlined shrink-0 text-amber-500">warning</span>

            <div><p class="font-black text-sm">Existem ${semComent} comentários pendentes.</p><p class="text-xs mt-0.5 opacity-80">Ative o Agente IA na tela anterior.</p></div>

        </div>`;

    }

    if(semMath> 0) {

        html += `<div class="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex gap-3 text-yellow-800">

            <span class="material-symbols-outlined shrink-0 text-yellow-500">lightbulb</span>

            <div><p class="font-black text-sm">Metadados Ausentes.</p><p class="text-xs mt-0.5 opacity-80">${semMath questões não possuem C/H, Mathria ou Assunto.</p></div>

        </div>`;

    }

    

    if(html !== '') {

        c.innerHTML = html;

        sm.classList.add('hidden');

    } else {

        c.innerHTML = '';

        sm.classList.remove('hidden');

    }

}



// ---------------- ETAPA 7 ----------------

function renderGabV2RenderPDF() {

    const box = document.getElementById('pdf-v2-folhaA4');

    const docName = document.getElementById('gabV2-pdfDocName').value || "1º SIMULADO";

    

    // Agrupando questões por "origemLinguagem" ou "mathria" global

    let grades = {};

    dbQuestoesV2.forEach(q => {

        let rootGroup = q.origemLinguagem; 

        if(!grades[rootGroup]) grades[rootGroup] = [];

        grades[rootGroup].push(q);

    });



    let renderHtml = `

    <!-- NOVO HEADER (Fundo Branco + Logo) -->

    <div style="background-color: white; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 30px 40px 15px 40px; box-sizing: border-box; font-family: 'Inter', sans-serif;">

        <!-- Lado Esquerdo: Logo Nexus -->

        <div style="display: flex; align-items: center; gap: 10px; flex-direction: column;">

            <svg width="100" height="85" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

                <!-- Hexagon Base and Lines -->

                <pat d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" stroke="#088F8F" stroke-width="4" fill="none"/>

                <!-- Inner 'N' shape lines to mock the logo -->

                <pat d="M35 60 L35 40 L65 60 L65 40" stroke="#088F8F" stroke-width="6" fill="none" stroke-linejoin="round"/>

            </svg>

            <div style="display: flex; flex-direction: column; align-items: center; margin-top: -10px;">

                <span style="color: #0A1C3E; font-weight: 900; font-size: 18px; letter-spacing: 2px;">NEXUS</span>

                <span style="color: #0A1C3E; font-weight: 600; font-size: 10px; letter-spacing: 3px; margin-top: -3px;">PROVAS</span>

            </div>

        </div>

        

        <!-- Centro: Títulos -->

        <div style="display: flex; flex-direction: column; align-items: center;">

            <span style="color: #0A1C3E; font-weight: 900; font-size: 42px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0px; line-height: 1;">COMENTÁRIO</span>

            <span style="color: #088F8F; font-weight: 900; font-size: 26px; text-transform: uppercase; letter-spacing: 1px;">${docName}</span>

        </div>

        

        <!-- Lado Direito: Circulo com 4 ícones -->

        <div style="width: 110px; height: 110px; border-radius: 50%; border: 3px solid #0A1C3E; position: relative; overflow: hidden; background: #088F8F; flex-shrink: 0;">

            <svg width="100%" height="100%" viewBox="0 0 100 100">

                <rect x="0" y="0" width="50" height="50" fill="#0A1C3E"/>

                <rect x="50" y="0" width="50" height="50" fill="#088F8F"/>

                <rect x="0" y="50" width="50" height="50" fill="#088F8F"/>

                <rect x="50" y="50" width="50" height="50" fill="#0A1C3E"/>

                <line x1="50" y1="0" x2="50" y2="100" stroke="#fff" stroke-width="2"/>

                <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" stroke-width="2"/>

                

                <!-- Math -->

                <pat d="M 15 40 Q 25 15, 35 40" stroke="#fff" stroke-width="2" fill="none"/>

                <line x1="10" y1="40" x2="40" y2="40" stroke="#fff" stroke-width="1.5"/>

                <line x1="15" y1="45" x2="15" y2="15" stroke="#fff" stroke-width="1.5"/>

                

                <!-- Atom -->

                <ellipse cx="75" cy="25" rx="14" ry="5" transform="rotat(45 75 25)" stroke="#fff" stroke-width="1.5" fill="none"/>

                <ellipse cx="75" cy="25" rx="14" ry="5" transform="rotat(-45 75 25)" stroke="#fff" stroke-width="1.5" fill="none"/>

                <circle cx="75" cy="25" r="2" fill="#fff"/>

                

                <!-- Letters -->

                <pat d="M 17 80 L 22 65 L 27 80 M 20 75 L 24 75" stroke="#fff" stroke-width="1.5" fill="none"/>

                <pat d="M 32 65 L 32 80 Q 38 80, 38 75 Q 38 70, 32 70" stroke="#fff" stroke-width="1.5" fill="none"/>

                

                <!-- Globe -->

                <circle cx="75" cy="75" r="12" stroke="#fff" stroke-width="1.5" fill="none"/>

                <ellipse cx="75" cy="75" rx="6" ry="12" stroke="#fff" stroke-width="1.5" fill="none"/>

                <line x1="63" y1="75" x2="87" y2="75" stroke="#fff" stroke-width="1.5"/>

            </svg>

        </div>

    </div>

    

    <div style="width: 100%; height: 60px; background: url('dat:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'><pat fill=\'%23e0f2f1\' fill-opacity=\'0.5\' d=\'M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,149.3C672,117,768,75,864,80C960,85,1056,139,1152,144C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z\'></pat></svg>') no-repeatbottom; background-size: cover; margin-bottom: 20px;"></div>



    <div style="padding: 0px 0px; box-sizing: border-box;">

    `;



    Object.keys(grades).forEach(key => {

        let areaNome = key.toUpperCase();

        

        renderHtml += `

        <!-- FAIXA DA MATERIA -->

        <div style="display: flex; align-items: center; margin-bottom: 25px; margin-top: 30px; padding: 0 40px; page-break-after: avoid; font-family: 'Inter', sans-serif;">

            <div style="width: 48px; height: 48px; background-color: #088F8F; border-radius: 50%; display: flex; justify-content: center; align-items: center; z-index: 2; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-right: -20px;">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><pat d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></pat><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg>

            </div>

            <div style="flex-grow: 1; border: 2px solid #0A1C3E; border-radius: 25px; background: white; padding: 8px 0; padding-left: 30px; text-align: center;">

                <span style="font-weight: 900; font-size: 16px; color: #0A1C3E; letter-spacing: 1px; text-transform: uppercase;">${areaNome}</span>

            </div>

        </div>

        `;

        

        grades[key].forEach(q => {

            let altA = q.alt === 'ANULADA' ? 'ANULADA' : `Resposta: ${q.alt||'?'}`;

            let classAnul = q.alt === 'ANULADA' ? 'background-color: #e11d48;' : 'background-color: #088F8F;';

            

            renderHtml += `

            <div style="padding: 0 40px; font-family: 'Inter', sans-serif; page-break-inside: avoid; margin-bottom: 20px;">

                <!-- TOP BARS (Duas Cores) -->

                <div style="display: flex; width: 100%;">

                    <div style="flex: 1; background-color: #0A1C3E; padding: 8px 15px; border-top-left-radius: 8px; text-align: center;">

                        <span style="color: white; font-weight: 800; font-size: 15px;">Questão ${String(q.numero).padStart(2,'0')}</span>

                    </div>

                    <div style="flex: 1; ${classAnul} padding: 8px 15px; border-top-right-radius: 8px; text-align: center;">

                        <span style="color: white; font-weight: 800; font-size: 15px;">${altA}</span>

                    </div>

                </div>

                

                <!-- CONTENT TABLE -->

                <div style="border: 2px solid #e2e8f0; border-top: none; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; background-color: white; display: flex; flex-direction: column;">

                    

                    <!-- Linha 1: Mathria/Assunto -->

                    <div style="display: flex; align-items: center; padding: 10px 15px; border-bottom: 1px solid #e2e8f0;">

                        <div style="margin-right: 15px; color: #0A1C3E;">

                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><pat d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></pat></svg>

                        </div>

                        <div style="font-size: 13.5px; flex: 1;">

                            <span style="font-weight: 800; color: #0A1C3E;">Mathria / Assunto:</span>

                            <span style="font-weight: 500; color: #334155;"> ${q.math|'-'} | <span style="font-weight: 800; color: #0A1C3E;">Assunto:</span> ${q.ass||'-'}</span>

                        </div>

                    </div>



                    <!-- Linha 2: Competencia/Habilidade -->

                    <div style="display: flex; align-items: center; padding: 10px 15px; border-bottom: 1px solid #e2e8f0;">

                        <div style="margin-right: 15px; color: #0A1C3E;">

                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>

                        </div>

                        <div style="font-size: 13.5px; flex: 1;">

                            <span style="font-weight: 800; color: #0A1C3E;">Competência:</span>

                            <span style="font-weight: 500; color: #334155;"> ${q.comp||'-'} | <span style="font-weight: 800; color: #0A1C3E;">Habilidade:</span> ${q.hab||'-'}</span>

                        </div>

                    </div>



                    <!-- Linha 3: Comentario Pedagógico -->

                    <div style="display: flex; align-items: flex-start; padding: 10px 15px;">

                        <div style="margin-right: 15px; margin-top: 2px; color: #0A1C3E;">

                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><pat d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></pat><circle cx="8" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="16" cy="12" r="1"></circle></svg>

                        </div>

                        <div style="font-size: 13.5px; line-height: 1.5; color: #334155; text-align: justify; flex: 1;">

                            <span style="font-weight: 800; color: #0A1C3E;">Comentário pedagógico:</span>

                            <span style="font-weight: 500;"> ${q.coment || 'Ocorreu um erro e não há comentário registrado.'}</span>

                        </div>

                    </div>

                </div>

            </div>

            `;

        });

    });



    renderHtml += `</div>`;

    

    box.innerHTML = renderHtml;

}



// Inicialização Limpa

document.addEventListener('DOMContentLoaded', () => {

    // Ao iniciar Nexus Provas module, garante start correto.

    setTimeout(() => { if(typeof dbQuestoesV2 !== 'undefined') goToGabV2Step(1); }, 300);

});

