// ==============================================
// FLASHCARD IMPORT CONTROLLER
// Orquestra CSV e APKG parsers + UI do modal
// ==============================================

const importState = {
    mode: null, step: 1, file: null, fileName: '',
    parsedCards: [], deckNames: [], mediaStore: {},
    stats: { total: 0, cloze: 0, images: 0, audio: 0 },
    csvRows: [], csvColumns: [], csvDelimiter: ';', csvHasHeader: true,
    csvMapping: { front: 0, back: 1, tags: 2, deck: -1 },
    conflictMode: 'mesclar', error: null, processing: false
};

// === MODAL ===
function abrirModalImport() {
    Object.assign(importState, {
        mode: null, step: 1, file: null, fileName: '',
        parsedCards: [], deckNames: [], mediaStore: {},
        stats: { total: 0, cloze: 0, images: 0, audio: 0 },
        csvRows: [], csvColumns: [], csvDelimiter: ';', csvHasHeader: true,
        csvMapping: { front: 0, back: 1, tags: 2, deck: -1 },
        conflictMode: 'mesclar', error: null, processing: false
    });
    const m = document.getElementById('modalImport');
    m.classList.remove('hidden');
    setTimeout(() => { m.classList.remove('opacity-0'); }, 10);
    renderImportUI();
}

function fecharModalImport() {
    const m = document.getElementById('modalImport');
    m.classList.add('opacity-0');
    setTimeout(() => m.classList.add('hidden'), 300);
}

// === UI ROUTER ===
function renderImportUI() {
    const c = document.getElementById('importBody');
    const label = document.getElementById('importStepLabel');
    if (importState.step === 1) { label.textContent = 'Escolha o formato'; renderChooseFormat(c); }
    else if (importState.step === 2) { label.textContent = importState.mode === 'csv' ? 'Configurar CSV/TXT' : 'Processando .apkg'; renderUpload(c); }
    else if (importState.step === 3) { label.textContent = 'Confirmar importação'; renderPreview(c); }
}

// === STEP 1: Escolha ===
function renderChooseFormat(c) {
    c.innerHTML = `
    <div class="grid grid-cols-2 gap-4 mb-6">
        <button onclick="setImportMode('csv')" class="group p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left">
            <span class="material-symbols-outlined text-[36px] text-indigo-500 mb-3 block">description</span>
            <h4 class="font-bold text-[#0B193C] text-sm mb-1">CSV / TXT</h4>
            <p class="text-[11px] text-slate-400 font-medium">Importar planilha com colunas Frente, Verso, Tags</p>
        </button>
        <button onclick="setImportMode('apkg')" class="group p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-left">
            <span class="material-symbols-outlined text-[36px] text-emerald-500 mb-3 block">inventory_2</span>
            <h4 class="font-bold text-[#0B193C] text-sm mb-1">Anki (.apkg)</h4>
            <p class="text-[11px] text-slate-400 font-medium">Importar pacote exportado do Anki Desktop</p>
        </button>
    </div>
    <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p class="text-[11px] text-slate-500 font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">info</span>
            <span>No Anki Desktop: <strong>Arquivo → Exportar</strong> e escolha o formato <strong>.apkg</strong>. Para CSV, exporte como texto separado por ponto-e-vírgula.</span>
        </p>
    </div>`;
}

function setImportMode(mode) {
    importState.mode = mode;
    importState.step = 2;
    renderImportUI();
}

// === STEP 2: Upload ===
function renderUpload(c) {
    const accept = importState.mode === 'csv' ? '.csv,.txt,.tsv' : '.apkg,.colpkg';
    const icon = importState.mode === 'csv' ? 'description' : 'inventory_2';
    const color = importState.mode === 'csv' ? 'indigo' : 'emerald';

    c.innerHTML = `
    <div id="importDropZone" class="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-${color}-400 transition-colors cursor-pointer mb-4" onclick="document.getElementById('importFileInput').click()" ondragover="event.preventDefault();this.classList.add('border-${color}-400','bg-${color}-50/20')" ondragleave="this.classList.remove('border-${color}-400','bg-${color}-50/20')" ondrop="event.preventDefault();this.classList.remove('border-${color}-400','bg-${color}-50/20');handleImportDrop(event)">
        <span class="material-symbols-outlined text-[48px] text-slate-300 mb-3 block">${icon}</span>
        <p class="font-bold text-[#0B193C] text-sm mb-1">Arraste seu arquivo aqui</p>
        <p class="text-[11px] text-slate-400 font-medium">ou clique para selecionar</p>
        <input type="file" id="importFileInput" accept="${accept}" class="hidden" onchange="handleImportFile(this)">
    </div>
    <div id="importFileInfo" class="hidden bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
        <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-${color}-500">check_circle</span>
            <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#0B193C] truncate" id="importFileName">-</p>
                <p class="text-[10px] text-slate-400 font-medium" id="importFileSize">-</p>
            </div>
        </div>
    </div>
    <div id="importCSVConfig" class="hidden space-y-4 mb-4"></div>
    <div id="importProcessing" class="hidden text-center py-6">
        <span class="material-symbols-outlined text-[40px] text-${color}-500 animate-spin block mb-3">progress_activity</span>
        <p class="font-bold text-[#0B193C] text-sm">Processando arquivo...</p>
        <p class="text-[11px] text-slate-400 font-medium mt-1">Extraindo cartões e mídias</p>
    </div>
    <div id="importError" class="hidden bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4">
        <p class="text-rose-600 text-sm font-bold flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">error</span> <span id="importErrorMsg">Erro</span></p>
    </div>
    <div class="flex justify-between items-center pt-2">
        <button onclick="importState.step=1;renderImportUI()" class="text-sm font-bold text-slate-500 hover:text-[#0B193C] flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">arrow_back</span> Voltar</button>
        <button id="btnImportNext" class="hidden bg-[#0B193C] hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2" onclick="importState.step=3;renderImportUI()">
            Pré-visualizar <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
    </div>`;
}

function handleImportDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length) {
        document.getElementById('importFileInput').files = files;
        handleImportFile(document.getElementById('importFileInput'));
    }
}

async function handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    importState.file = file;
    importState.fileName = file.name;

    document.getElementById('importFileName').textContent = file.name;
    document.getElementById('importFileSize').textContent = (file.size / 1024).toFixed(1) + ' KB';
    document.getElementById('importFileInfo').classList.remove('hidden');
    document.getElementById('importError').classList.add('hidden');

    if (importState.mode === 'csv') {
        try {
            const text = await file.text();
            const delim = detectDelimiter(text);
            importState.csvDelimiter = delim;
            const rows = parseCSVText(text, delim);
            importState.csvRows = rows;
            if (rows.length > 0) importState.csvColumns = rows[0];
            showCSVConfig();
            document.getElementById('btnImportNext').classList.remove('hidden');
        } catch(e) {
            showImportError('Erro ao ler o arquivo CSV: ' + e.message);
        }
    } else if (importState.mode === 'apkg') {
        document.getElementById('importProcessing').classList.remove('hidden');
        try {
            const result = await parseAPKGFile(file);
            importState.parsedCards = result.cards;
            importState.deckNames = result.deckNames;
            importState.mediaStore = result.mediaStore;
            computeImportStats();
            document.getElementById('importProcessing').classList.add('hidden');
            importState.step = 3;
            renderImportUI();
        } catch(e) {
            document.getElementById('importProcessing').classList.add('hidden');
            showImportError('Erro ao processar .apkg: ' + e.message);
        }
    }
}

function showCSVConfig() {
    const cfg = document.getElementById('importCSVConfig');
    const cols = importState.csvRows[0] || [];
    const opts = cols.map((c, i) => `<option value="${i}">${c || 'Coluna ' + (i+1)}</option>`).join('') + '<option value="-1">(ignorar)</option>';
    cfg.classList.remove('hidden');
    cfg.innerHTML = `
    <h4 class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Mapeamento de Colunas</h4>
    <div class="grid grid-cols-2 gap-3">
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Frente *</label>
        <select id="mapFront" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.front=parseInt(this.value)">${opts.replace('value="0"','value="0" selected')}</select></div>
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Verso *</label>
        <select id="mapBack" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.back=parseInt(this.value)">${opts.replace('value="1"','value="1" selected')}</select></div>
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Tags</label>
        <select id="mapTags" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.tags=parseInt(this.value)">${opts.replace('value="2"','value="2" selected')}</select></div>
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Baralho</label>
        <select id="mapDeck" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.deck=parseInt(this.value)"><option value="-1" selected>(ignorar)</option>${cols.map((c,i)=>`<option value="${i}">${c||'Col '+(i+1)}</option>`).join('')}</select></div>
    </div>
    <div class="flex items-center gap-2 mt-2">
        <input type="checkbox" id="csvHasHeader" checked onchange="importState.csvHasHeader=this.checked" class="rounded">
        <label for="csvHasHeader" class="text-[11px] font-bold text-slate-500">Primeira linha é cabeçalho</label>
    </div>
    <div class="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
        <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Amostra (3 primeiras linhas)</p>
        <div class="overflow-x-auto"><table class="text-[11px] w-full"><thead><tr>${cols.map(c=>`<th class="px-2 py-1 text-left text-slate-400 font-bold border-b border-slate-200">${c}</th>`).join('')}</tr></thead><tbody>${importState.csvRows.slice(1,4).map(r=>`<tr>${r.map(c=>`<td class="px-2 py-1 text-slate-600 border-b border-slate-50 truncate max-w-[150px]">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    </div>`;
}

// === STEP 3: Preview ===
function renderPreview(c) {
    if (importState.mode === 'csv') {
        importState.parsedCards = buildCardsFromCSV(importState.csvRows, importState.csvHasHeader, importState.csvMapping);
        importState.deckNames = [...new Set(importState.parsedCards.map(c => c.deckId))];
        computeImportStats();
    }
    const s = importState.stats;
    const existingDecks = checkExistingDecks();

    c.innerHTML = `
    <div class="grid grid-cols-4 gap-3 mb-5">
        <div class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
            <p class="text-2xl font-extrabold text-[#0B193C]">${s.total}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cartões</p>
        </div>
        <div class="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
            <p class="text-2xl font-extrabold text-indigo-600">${s.cloze}</p>
            <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Cloze</p>
        </div>
        <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p class="text-2xl font-extrabold text-emerald-600">${s.images}</p>
            <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Imagens</p>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
            <p class="text-2xl font-extrabold text-amber-600">${s.audio}</p>
            <p class="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-1">Áudios</p>
        </div>
    </div>
    <div class="mb-4">
        <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Baralhos detectados</p>
        <div class="flex flex-wrap gap-2">${importState.deckNames.map(d => `<span class="bg-slate-100 text-[#0B193C] px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">${d}</span>`).join('')}</div>
    </div>
    ${existingDecks.length ? `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p class="text-sm font-bold text-amber-700 flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-[18px]">warning</span> Baralhos já existentes: ${existingDecks.join(', ')}</p>
        <div class="flex gap-2">
            <button onclick="importState.conflictMode='substituir';document.querySelectorAll('.conflict-btn').forEach(b=>b.classList.remove('ring-2'));this.classList.add('ring-2','ring-amber-500')" class="conflict-btn px-3 py-2 rounded-lg text-xs font-bold bg-white border border-amber-200 hover:bg-amber-100 transition-colors">Substituir</button>
            <button onclick="importState.conflictMode='mesclar';document.querySelectorAll('.conflict-btn').forEach(b=>b.classList.remove('ring-2'));this.classList.add('ring-2','ring-amber-500')" class="conflict-btn px-3 py-2 rounded-lg text-xs font-bold bg-white border border-amber-200 hover:bg-amber-100 transition-colors ring-2 ring-amber-500">Mesclar</button>
            <button onclick="importState.conflictMode='copia';document.querySelectorAll('.conflict-btn').forEach(b=>b.classList.remove('ring-2'));this.classList.add('ring-2','ring-amber-500')" class="conflict-btn px-3 py-2 rounded-lg text-xs font-bold bg-white border border-amber-200 hover:bg-amber-100 transition-colors">Criar cópia</button>
        </div>
    </div>` : ''}
    <div class="mb-4">
        <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Amostra de cartões</p>
        <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-[12px]">
                <thead><tr class="bg-slate-50 border-b border-slate-200">
                    <th class="px-4 py-2.5 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Frente</th>
                    <th class="px-4 py-2.5 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Verso</th>
                    <th class="px-4 py-2.5 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tipo</th>
                </tr></thead>
                <tbody>${importState.parsedCards.slice(0, 5).map(card => `
                    <tr class="border-b border-slate-50 hover:bg-slate-50/50">
                        <td class="px-4 py-2.5 text-[#0B193C] font-medium truncate max-w-[200px]">${stripHTML(card.front).substring(0, 60)}${stripHTML(card.front).length > 60 ? '...' : ''}</td>
                        <td class="px-4 py-2.5 text-slate-500 truncate max-w-[200px]">${stripHTML(card.back).substring(0, 60)}${stripHTML(card.back).length > 60 ? '...' : ''}</td>
                        <td class="px-4 py-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${card.tipo === 'cloze' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}">${card.tipo}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>
    <div class="flex justify-between items-center pt-2 border-t border-slate-100">
        <button onclick="importState.step=${importState.mode==='apkg'?1:2};renderImportUI()" class="text-sm font-bold text-slate-500 hover:text-[#0B193C] flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">arrow_back</span> Voltar</button>
        <button onclick="confirmarImportacao()" class="bg-[#0B193C] hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-extrabold text-sm shadow-lg transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">download</span> Importar ${s.total} Cartões
        </button>
    </div>`;
}

// === IMPORTAÇÃO FINAL ===
function confirmarImportacao() {
    const cards = importState.parsedCards;
    if (!cards.length) return;

    let existingCards = window.db ? (window.db.get('flashcards') || []) : [];
    let existingDecks = window.db ? (window.db.get('flashcard_decks') || []) : [];

    // Resolver conflitos de deck
    importState.deckNames.forEach(deckName => {
        const existingIdx = existingDecks.findIndex(d => (d.fullPath || d.nome) === deckName);
        if (existingIdx >= 0 && importState.conflictMode === 'substituir') {
            existingCards = existingCards.filter(c => c.deckId !== deckName && !c.deckId.startsWith(deckName + '::'));
        }
    });

    // Criar cards
    const newCards = cards.map(c => ({
        id: window.db ? window.db.uuid() : Date.now().toString() + Math.random().toString(36).substr(2, 9),
        deckId: importState.conflictMode === 'copia' ? c.deckId + ' (Importado)' : c.deckId,
        tipo: c.tipo, front: c.front, back: c.back, extra: c.extra || '',
        tags: c.tags || [], status: 'novo', easeFactor: 2.5, intervaloDias: 0,
        passosAprendizado: 0, repeticoes: 0, acertos: 0, erros: 0,
        ultimaResposta: null, ultimoEstudoEm: null, proximaRevisaoEm: null,
        tempoRespostaSegundos: 0, created_at: new Date().toISOString()
    }));

    existingCards.push(...newCards);
    if (window.db) window.db.set('flashcards', existingCards);

    // Garantir que os decks existam
    const allDeckPaths = [...new Set(newCards.map(c => c.deckId))];
    allDeckPaths.forEach(dp => {
        if (!existingDecks.find(d => (d.fullPath || d.nome) === dp)) {
            existingDecks.push({
                id: window.db ? window.db.uuid() : Date.now().toString(),
                fullPath: dp, nome: dp.split('::').pop()
            });
        }
        // Sub-decks
        const parts = dp.split('::');
        for (let i = 1; i < parts.length; i++) {
            const parent = parts.slice(0, i).join('::');
            if (!existingDecks.find(d => (d.fullPath || d.nome) === parent)) {
                existingDecks.push({
                    id: window.db ? window.db.uuid() : Date.now().toString(),
                    fullPath: parent, nome: parts[i - 1]
                });
            }
        }
    });
    if (window.db) window.db.set('flashcard_decks', existingDecks);

    // Salvar mídias no localStorage
    if (Object.keys(importState.mediaStore).length > 0) {
        try {
            const existing = JSON.parse(localStorage.getItem('sinapse_import_media') || '{}');
            Object.assign(existing, importState.mediaStore);
            localStorage.setItem('sinapse_import_media', JSON.stringify(existing));
        } catch(e) { console.warn('Mídias não puderam ser salvas:', e); }
    }

    fecharModalImport();

    // Feedback visual
    if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Atualizar a view de baralhos
    if (typeof renderDecksHome === 'function') renderDecksHome();
    if (typeof switchTab === 'function') switchTab(0);

    // Toast de sucesso
    showImportToast(newCards.length);
}

// === UTILIDADES ===
function computeImportStats() {
    const cards = importState.parsedCards;
    importState.stats = {
        total: cards.length,
        cloze: cards.filter(c => c.tipo === 'cloze').length,
        images: cards.filter(c => (c.front + c.back).includes('<img')).length,
        audio: cards.filter(c => (c.front + c.back).includes('<audio')).length
    };
}

function checkExistingDecks() {
    const existing = window.db ? (window.db.get('flashcard_decks') || []) : [];
    const names = existing.map(d => d.fullPath || d.nome);
    return importState.deckNames.filter(n => names.includes(n));
}

function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
}

function showImportError(msg) {
    const el = document.getElementById('importError');
    document.getElementById('importErrorMsg').textContent = msg;
    el.classList.remove('hidden');
}

function showImportToast(count) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 animate-bounce';
    toast.innerHTML = `<span class="material-symbols-outlined text-[24px]">check_circle</span><div><p class="font-bold text-sm">${count} cartões importados!</p><p class="text-[11px] text-emerald-200 font-medium">Baralhos atualizados com sucesso</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 4000);
}
