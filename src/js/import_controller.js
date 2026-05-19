// ==============================================
// FLASHCARD IMPORT CONTROLLER v2
// Orquestra CSV e APKG parsers + UI do modal
// ==============================================

const importState = {
    mode: null, step: 1, file: null, fileName: '',
    parsedCards: [], deckNames: [], mediaStore: {},
    stats: { total: 0, cloze: 0, images: 0, audio: 0 },
    csvRows: [], csvColumns: [], csvDelimiter: ';', csvHasHeader: true,
    csvMapping: { front: 0, back: 1, tags: 2, deck: -1 },
    conflictMode: 'mesclar', error: null, processing: false,
    mediaSkipped: false, mediaCount: 0
};

function abrirModalImport() {
    Object.assign(importState, {
        mode: null, step: 1, file: null, fileName: '',
        parsedCards: [], deckNames: [], mediaStore: {},
        stats: { total: 0, cloze: 0, images: 0, audio: 0 },
        csvRows: [], csvColumns: [], csvDelimiter: ';', csvHasHeader: true,
        csvMapping: { front: 0, back: 1, tags: 2, deck: -1 },
        conflictMode: 'mesclar', error: null, processing: false,
        mediaSkipped: false, mediaCount: 0
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

function renderImportUI() {
    const c = document.getElementById('importBody');
    const label = document.getElementById('importStepLabel');
    if (importState.step === 1) { label.textContent = 'Escolha o formato'; renderChooseFormat(c); }
    else if (importState.step === 2) { label.textContent = importState.mode === 'csv' ? 'Configurar CSV/TXT' : 'Processando .apkg'; renderUpload(c); }
    else if (importState.step === 3) { label.textContent = 'Confirmar importação'; renderPreview(c); }
}

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
            <h4 class="font-bold text-[#0B193C] text-sm mb-1">Anki (.apkg / .colpkg)</h4>
            <p class="text-[11px] text-slate-400 font-medium">Importar pacote exportado do Anki Desktop</p>
        </button>
    </div>
    <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <p class="text-[11px] text-slate-500 font-medium flex items-start gap-2">
            <span class="material-symbols-outlined text-[16px] text-slate-400 mt-0.5">info</span>
            <span>No Anki Desktop: <strong>Arquivo → Exportar</strong> e escolha <strong>.colpkg</strong> ou <strong>.apkg</strong>. Se der erro, exporte como <strong>"Legacy .colpkg"</strong>.</span>
        </p>
    </div>`;
}

function setImportMode(mode) {
    importState.mode = mode;
    importState.step = 2;
    renderImportUI();
}

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
        <p class="font-bold text-[#0B193C] text-sm" id="importProgressText">Processando arquivo...</p>
        <p class="text-[11px] text-slate-400 font-medium mt-1" id="importProgressSub">Extraindo cartões (pode levar alguns minutos para coleções grandes)</p>
    </div>
    <div id="importError" class="hidden bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4">
        <p class="text-rose-600 text-sm font-bold flex items-start gap-2"><span class="material-symbols-outlined text-[18px] mt-0.5">error</span> <span id="importErrorMsg">Erro</span></p>
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
    const sizeMB = file.size / (1024 * 1024);
    document.getElementById('importFileName').textContent = file.name;
    document.getElementById('importFileSize').textContent = sizeMB >= 1 ? sizeMB.toFixed(1) + ' MB' : (file.size / 1024).toFixed(1) + ' KB';
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
        } catch(e) { showImportError('Erro ao ler CSV: ' + e.message); }
    } else if (importState.mode === 'apkg') {
        document.getElementById('importProcessing').classList.remove('hidden');
        try {
            const result = await parseAPKGFile(file);
            importState.parsedCards = result.cards;
            importState.deckNames = result.deckNames;
            importState.mediaStore = result.mediaStore;
            importState.mediaSkipped = result.mediaSkipped || false;
            importState.mediaCount = result.mediaCount || 0;
            computeImportStats();
            document.getElementById('importProcessing').classList.add('hidden');
            importState.step = 3;
            renderImportUI();
        } catch(e) {
            document.getElementById('importProcessing').classList.add('hidden');
            showImportError(e.message);
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
        <select class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.front=parseInt(this.value)">${opts.replace('value="0"','value="0" selected')}</select></div>
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Verso *</label>
        <select class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.back=parseInt(this.value)">${opts.replace('value="1"','value="1" selected')}</select></div>
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Tags</label>
        <select class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.tags=parseInt(this.value)">${opts.replace('value="2"','value="2" selected')}</select></div>
        <div><label class="text-[11px] font-bold text-slate-500 block mb-1">Baralho</label>
        <select class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-400" onchange="importState.csvMapping.deck=parseInt(this.value)"><option value="-1" selected>(ignorar)</option>${cols.map((c,i)=>`<option value="${i}">${c||'Col '+(i+1)}</option>`).join('')}</select></div>
    </div>
    <div class="flex items-center gap-2 mt-2">
        <input type="checkbox" id="csvHasHeader" checked onchange="importState.csvHasHeader=this.checked" class="rounded">
        <label for="csvHasHeader" class="text-[11px] font-bold text-slate-500">Primeira linha é cabeçalho</label>
    </div>
    <div class="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
        <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Amostra</p>
        <div class="overflow-x-auto"><table class="text-[11px] w-full"><thead><tr>${cols.map(c=>`<th class="px-2 py-1 text-left text-slate-400 font-bold border-b border-slate-200">${c}</th>`).join('')}</tr></thead><tbody>${importState.csvRows.slice(1,4).map(r=>`<tr>${r.map(c=>`<td class="px-2 py-1 text-slate-600 border-b border-slate-50 truncate max-w-[150px]">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    </div>`;
}

function renderPreview(c) {
    if (importState.mode === 'csv') {
        importState.parsedCards = buildCardsFromCSV(importState.csvRows, importState.csvHasHeader, importState.csvMapping);
        importState.deckNames = [...new Set(importState.parsedCards.map(c => c.deckId))];
        computeImportStats();
    }
    const s = importState.stats;
    const existingDecks = checkExistingDecks();
    const mediaWarning = importState.mediaSkipped ? `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p class="text-sm font-bold text-amber-700 flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">image</span> ${importState.mediaCount} mídias detectadas (não importadas)</p>
        <p class="text-[11px] text-amber-600 mt-1">Arquivos grandes têm mídias ignoradas para evitar estouro de armazenamento. Os cartões de texto foram importados normalmente.</p>
    </div>` : '';

    c.innerHTML = `
    <div class="grid grid-cols-4 gap-3 mb-5">
        <div class="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
            <p class="text-2xl font-extrabold text-[#0B193C]">${s.total.toLocaleString()}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cartões</p>
        </div>
        <div class="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
            <p class="text-2xl font-extrabold text-indigo-600">${s.cloze}</p>
            <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Cloze</p>
        </div>
        <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p class="text-2xl font-extrabold text-emerald-600">${importState.deckNames.length}</p>
            <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Baralhos</p>
        </div>
        <div class="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
            <p class="text-2xl font-extrabold text-amber-600">${importState.mediaCount || 0}</p>
            <p class="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-1">Mídias</p>
        </div>
    </div>
    ${mediaWarning}
    <div class="mb-4">
        <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Baralhos detectados (${importState.deckNames.length})</p>
        <div class="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">${importState.deckNames.map(d => `<span class="bg-slate-100 text-[#0B193C] px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">${d}</span>`).join('')}</div>
    </div>
    ${existingDecks.length ? `
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p class="text-sm font-bold text-amber-700 flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-[18px]">warning</span> ${existingDecks.length} baralhos já existem</p>
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
                    <th class="px-4 py-2.5 text-left font-bold text-slate-400 uppercase tracking-widest text-[10px]">Baralho</th>
                </tr></thead>
                <tbody>${importState.parsedCards.slice(0, 8).map(card => `
                    <tr class="border-b border-slate-50 hover:bg-slate-50/50">
                        <td class="px-4 py-2.5 text-[#0B193C] font-medium truncate max-w-[200px]">${stripHTML(card.front).substring(0, 50)}${stripHTML(card.front).length > 50 ? '...' : ''}</td>
                        <td class="px-4 py-2.5 text-slate-500 truncate max-w-[200px]">${stripHTML(card.back).substring(0, 50)}${stripHTML(card.back).length > 50 ? '...' : ''}</td>
                        <td class="px-4 py-2.5 text-[10px]"><span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">${card.deckId.split('::').pop()}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>
    <div class="flex justify-between items-center pt-2 border-t border-slate-100">
        <button onclick="importState.step=${importState.mode==='apkg'?1:2};renderImportUI()" class="text-sm font-bold text-slate-500 hover:text-[#0B193C] flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">arrow_back</span> Voltar</button>
        <button onclick="confirmarImportacao()" class="bg-[#0B193C] hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-extrabold text-sm shadow-lg transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">download</span> Importar ${s.total.toLocaleString()} Cartões
        </button>
    </div>`;
}

// === IMPORTAÇÃO FINAL ===
function confirmarImportacao() {
    const cards = importState.parsedCards;
    if (!cards.length) return;

    let existingCards = window.db ? (window.db.get('flashcards') || []) : [];
    let existingDecks = window.db ? (window.db.get('flashcard_decks') || []) : [];

    // Detectar qual campo de path o sistema usa (fullPath ou fullPatéh por encoding)
    const pathField = existingDecks.length > 0 && existingDecks[0].fullPath !== undefined ? 'fullPath' : 'fullPath';
    const getDeckPath = (d) => d.fullPath || d.nome || '';

    // Resolver conflitos
    if (importState.conflictMode === 'substituir') {
        importState.deckNames.forEach(deckName => {
            existingCards = existingCards.filter(c => c.deckId !== deckName && !c.deckId.startsWith(deckName + '::'));
            existingDecks = existingDecks.filter(d => getDeckPath(d) !== deckName);
        });
    }

    // Detectar valor de status usado pelo sistema
    let statusNovo = 'novo';
    if (existingCards.length > 0) {
        const sample = existingCards.find(c => c.status);
        if (sample && sample.status && sample.status !== 'aprendendo' && sample.status !== 'revisao') {
            statusNovo = sample.status; // usar o mesmo encoding
        }
    }

    // Criar cards em lotes para não travar o browser
    const newCards = cards.map(c => ({
        id: window.db ? window.db.uuid() : Date.now().toString() + Math.random().toString(36).substr(2, 9),
        deckId: importState.conflictMode === 'copia' ? c.deckId + ' (Importado)' : c.deckId,
        tipo: c.tipo, front: c.front, back: c.back, extra: c.extra || '',
        tags: c.tags || [], status: statusNovo, easeFactor: 2.5, intervaloDias: 0,
        passosAprendizado: 0, repeticoes: 0, acertos: 0, erros: 0,
        ultimaResposta: null, ultimoEstudoEm: null, proximaRevisaoEm: null,
        tempoRespostaSegundos: 0, created_at: new Date().toISOString()
    }));

    existingCards.push(...newCards);
    if (window.db) window.db.set('flashcards', existingCards);

    // Criar decks
    const allDeckPaths = [...new Set(newCards.map(c => c.deckId))];
    allDeckPaths.forEach(dp => {
        if (!existingDecks.find(d => getDeckPath(d) === dp)) {
            existingDecks.push({ id: window.db ? window.db.uuid() : Date.now().toString(), fullPath: dp, nome: dp.split('::').pop() });
        }
        const parts = dp.split('::');
        for (let i = 1; i < parts.length; i++) {
            const parent = parts.slice(0, i).join('::');
            if (!existingDecks.find(d => getDeckPath(d) === parent)) {
                existingDecks.push({ id: window.db ? window.db.uuid() : Date.now().toString(), fullPath: parent, nome: parts[i - 1] });
            }
        }
    });
    if (window.db) window.db.set('flashcard_decks', existingDecks);

    fecharModalImport();
    if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    if (typeof renderDecksHome === 'function') renderDecksHome();
    if (typeof switchTab === 'function') switchTab(0);
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
    const names = existing.map(d => d.fullPath || d.nome || '').concat(existing.map(d => Object.values(d).find(v => typeof v === 'string' && v.includes('::')) || d.nome || ''));
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
    toast.className = 'fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3';
    toast.style.animation = 'slideUp 0.5s ease-out';
    toast.innerHTML = `<span class="material-symbols-outlined text-[24px]">check_circle</span><div><p class="font-bold text-sm">${count.toLocaleString()} cartões importados!</p><p class="text-[11px] text-emerald-200 font-medium">Baralhos atualizados com sucesso</p></div>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; setTimeout(() => toast.remove(), 500); }, 5000);
}
