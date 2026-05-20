// ==============================================
// PAINEL BROWSER — Navegador de Cartões (Anki Style)
// Lógica completa de filtros, busca, tabela e preview
// ==============================================

let currentTagFilter = null;
let currentDeckFilter = null;
let currentStatusFilter = null;
let currentQuickFilter = null;
let currentSearchQuery = '';
let selectedCardId = null;
let browserSortField = 'created_at';
let browserSortAsc = false;

// ===== RENDER PRINCIPAL =====
function renderBrowserTable() {
    let cards = window.db ? window.db.get('flashcards') || [] : [];
    const now = new Date();

    // === SIDEBAR FILTROS ===
    renderBrowserSidebar(cards, now);

    // === CONTADORES TOP ===
    renderBrowserCounters(cards, now);

    // === FILTRAGEM ===
    let filtered = applyBrowserFilters(cards, now);

    // === ORDENAÇÃO ===
    filtered = sortBrowserCards(filtered);

    // === TABELA ===
    renderBrowserCards(filtered);

    // === PREVIEW ===
    if (selectedCardId) {
        const card = cards.find(c => c.id === selectedCardId);
        if (card) renderBrowserPreview(card);
        else clearBrowserPreview();
    }
}

// ===== SIDEBAR DE FILTROS =====
function renderBrowserSidebar(cards, now) {
    const sidebar = document.getElementById('browserSidebar');
    if (!sidebar) return;

    // Contar por status
    const counts = { all: cards.length, novo: 0, aprendendo: 0, revisao: 0, atrasado: 0, hoje: 0, estudados: 0 };
    const todayStr = now.toISOString().substring(0, 10);

    cards.forEach(c => {
        const st = normalizeStatus(c.status);
        const dt = c.proximaRevisaoEm ? new Date(c.proximaRevisaoEm) : null;
        if (st === 'novo') counts.novo++;
        else if (st === 'aprendendo') counts.aprendendo++;
        else if (st === 'revisao') {
            counts.revisao++;
            if (dt && dt < now) counts.atrasado++;
        }
        const cat = getCreatedAt(c);
        if (cat && cat.substring(0, 10) === todayStr) counts.hoje++;
        if (c.ultimoEstudoEm && c.ultimoEstudoEm.substring(0, 10) === todayStr) counts.estudados++;
    });

    // Decks
    const deckPaths = [...new Set(cards.map(c => c.deckId || 'Default'))].sort();
    // Tags
    const allTags = [...new Set(cards.flatMap(c => c.tags || []))].sort();

    const qf = currentQuickFilter;
    const makeQF = (key, icon, iconColor, label, count) => {
        const active = qf === key;
        return `<li onclick="setQuickFilter('${key}')" class="px-3 py-2 rounded-xl cursor-pointer flex items-center justify-between gap-2 transition-all text-[13px] font-semibold ${active ? 'bg-[#0B193C]/8 text-[#0B193C] border border-[#0B193C]/10 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
            <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] ${iconColor}">${icon}</span>${label}</span>
            <span class="text-[10px] font-bold ${active ? 'text-[#0B193C]' : 'text-slate-400'} bg-white/60 px-1.5 py-0.5 rounded-md">${count}</span>
        </li>`;
    };

    sidebar.innerHTML = `
        <h3 class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Filtros Rápidos</h3>
        <ul class="space-y-1 mb-5">
            ${makeQF('all', 'all_inbox', 'text-slate-500', 'Coleção Completa', counts.all)}
            ${makeQF('hoje', 'today', 'text-blue-500', 'Adicionados Hoje', counts.hoje)}
            ${makeQF('estudados', 'school', 'text-purple-500', 'Estudados Hoje', counts.estudados)}
            ${makeQF('novo', 'fiber_new', 'text-sky-500', 'Novos', counts.novo)}
            ${makeQF('aprendendo', 'psychology', 'text-amber-500', 'Em Aprendizagem', counts.aprendendo)}
            ${makeQF('revisao', 'replay', 'text-emerald-500', 'Para Revisar', counts.revisao)}
            ${makeQF('atrasado', 'warning', 'text-rose-500', 'Em Atraso', counts.atrasado)}
        </ul>

        <h3 class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">Baralhos</h3>
        <ul class="space-y-1 mb-5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
            ${deckPaths.map(d => {
                const active = currentDeckFilter === d;
                const cnt = cards.filter(c => (c.deckId || 'Default') === d).length;
                const displayName = d.includes('::') ? d.split('::').pop() : d;
                const indent = d.split('::').length - 1;
                return `<li onclick="setDeckFilter('${d.replace(/'/g, "\\'")}')" class="px-3 py-2 rounded-lg cursor-pointer truncate transition-all text-[12px] font-semibold ${active ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}" title="${d}" style="padding-left:${12 + indent * 14}px">
                    <span class="material-symbols-outlined text-[14px] ${active ? 'text-indigo-500' : 'text-slate-400'} mr-1 align-sub">style</span>${displayName}
                    <span class="text-[10px] ${active ? 'text-indigo-400' : 'text-slate-400'} ml-1">${cnt}</span>
                </li>`;
            }).join('')}
        </ul>

        <h3 class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">Etiquetas</h3>
        <ul class="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
            ${allTags.length === 0 ? '<li class="px-3 py-2 text-[11px] text-slate-400 italic">Nenhuma etiqueta</li>' : ''}
            ${allTags.map(t => {
                const active = currentTagFilter === t;
                const cnt = cards.filter(c => c.tags && c.tags.includes(t)).length;
                return `<li onclick="setTagFilter('${t.replace(/'/g, "\\'")}')" class="px-3 py-2 rounded-lg cursor-pointer truncate transition-all text-[12px] font-semibold ${active ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'text-slate-500 hover:bg-slate-100'}" title="${t}">
                    <span class="material-symbols-outlined text-[14px] ${active ? 'text-amber-500' : 'text-slate-400'} mr-1 align-sub">sell</span>${t}
                    <span class="text-[10px] ${active ? 'text-amber-400' : 'text-slate-400'} ml-1">${cnt}</span>
                </li>`;
            }).join('')}
        </ul>

        ${(currentDeckFilter || currentTagFilter || currentQuickFilter && currentQuickFilter !== 'all') ? `
        <button onclick="clearAllFilters()" class="mt-4 w-full px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">filter_alt_off</span> Limpar filtros
        </button>` : ''}
    `;
}

// ===== CONTADORES TOP =====
function renderBrowserCounters(cards, now) {
    const el = document.getElementById('browserCounters');
    if (!el) return;
    const todayStr = now.toISOString().substring(0, 10);
    let novo = 0, aprender = 0, revisar = 0, atrasado = 0;
    cards.forEach(c => {
        const st = normalizeStatus(c.status);
        const dt = c.proximaRevisaoEm ? new Date(c.proximaRevisaoEm) : null;
        if (st === 'novo') novo++;
        else if (st === 'aprendendo') aprender++;
        else if (st === 'revisao') {
            revisar++;
            if (dt && dt < now) atrasado++;
        }
    });
    const deckCount = new Set(cards.map(c => c.deckId || 'Default')).size;

    const makeCounter = (label, value, color, icon) => `
        <div class="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px] ${color}">${icon}</span>
            <span class="text-[13px] font-extrabold text-[#0B193C]">${value}</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${label}</span>
        </div>`;

    el.innerHTML = `
        ${makeCounter('Total', cards.length, 'text-slate-500', 'layers')}
        ${makeCounter('Novos', novo, 'text-sky-500', 'fiber_new')}
        ${makeCounter('Revisar', revisar, 'text-emerald-500', 'replay')}
        ${makeCounter('Atrasados', atrasado, 'text-rose-500', 'warning')}
        ${makeCounter('Baralhos', deckCount, 'text-indigo-500', 'style')}
    `;
}

// ===== FILTROS =====
function applyBrowserFilters(cards, now) {
    let filtered = [...cards];
    const todayStr = now.toISOString().substring(0, 10);

    // Quick filter
    if (currentQuickFilter && currentQuickFilter !== 'all') {
        if (currentQuickFilter === 'novo') filtered = filtered.filter(c => normalizeStatus(c.status) === 'novo');
        else if (currentQuickFilter === 'aprendendo') filtered = filtered.filter(c => normalizeStatus(c.status) === 'aprendendo');
        else if (currentQuickFilter === 'revisao') filtered = filtered.filter(c => normalizeStatus(c.status) === 'revisao');
        else if (currentQuickFilter === 'atrasado') filtered = filtered.filter(c => {
            const dt = c.proximaRevisaoEm ? new Date(c.proximaRevisaoEm) : null;
            return normalizeStatus(c.status) === 'revisao' && dt && dt < now;
        });
        else if (currentQuickFilter === 'hoje') filtered = filtered.filter(c => { const cat = getCreatedAt(c); return cat && cat.substring(0, 10) === todayStr; });
        else if (currentQuickFilter === 'estudados') filtered = filtered.filter(c => c.ultimoEstudoEm && c.ultimoEstudoEm.substring(0, 10) === todayStr);
    }

    // Deck filter
    if (currentDeckFilter) {
        filtered = filtered.filter(c => (c.deckId || 'Default') === currentDeckFilter || (c.deckId || '').startsWith(currentDeckFilter + '::'));
    }

    // Tag filter
    if (currentTagFilter) {
        filtered = filtered.filter(c => c.tags && c.tags.includes(currentTagFilter));
    }

    // Search
    if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(c => {
            const front = stripHTMLText(c.front || '').toLowerCase();
            const back = stripHTMLText(c.back || '').toLowerCase();
            const deck = (c.deckId || '').toLowerCase();
            const tags = (c.tags || []).join(' ').toLowerCase();
            return front.includes(q) || back.includes(q) || deck.includes(q) || tags.includes(q);
        });
    }

    return filtered;
}

function sortBrowserCards(cards) {
    return cards.sort((a, b) => {
        let va = a[browserSortField] || '';
        let vb = b[browserSortField] || '';
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        const cmp = va < vb ? -1 : va > vb ? 1 : 0;
        return browserSortAsc ? cmp : -cmp;
    });
}

// ===== TABELA =====
function renderBrowserCards(cards) {
    const tbody = document.getElementById('browserTableBody');
    if (!tbody) return;

    if (cards.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="7" class="px-6 py-16 text-center">
                <span class="material-symbols-outlined text-[48px] text-slate-200 block mb-3">folder_open</span>
                <p class="font-bold text-slate-400 text-sm mb-1">Nenhum cartão encontrado.</p>
                <p class="text-[11px] text-slate-400">Crie, importe ou sincronize seus flashcards para começar.</p>
                <div class="flex justify-center gap-3 mt-4">
                    <button onclick="switchTab(1)" class="px-4 py-2 rounded-lg bg-[#0B193C] text-white text-[11px] font-bold shadow-sm hover:bg-indigo-600 transition-colors">Criar cartão</button>
                    <button onclick="abrirModalImport()" class="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-colors">Importar do Anki</button>
                </div>
            </td></tr>`;
        return;
    }

    const now = new Date();
    tbody.innerHTML = cards.slice(0, 100).map(c => {
        const isSelected = c.id === selectedCardId;
        const statusInfo = getStatusInfo(c, now);
        const frontText = stripHTMLText(c.front || '');
        const backText = stripHTMLText(c.back || '');
        const deckShort = c.deckId ? c.deckId.split('::').pop() : 'Default';
        const revisao = c.proximaRevisaoEm ? formatRelativeDate(new Date(c.proximaRevisaoEm), now) : '—';
        const cat = getCreatedAt(c);
        const criado = cat ? cat.substring(0, 10).split('-').reverse().join('/') : '—';

        return `
        <tr class="border-b border-slate-100 transition-colors cursor-pointer group ${isSelected ? 'bg-indigo-50/80 border-l-2 border-l-indigo-400' : 'hover:bg-slate-50/80'}" onclick="selectBrowserCard('${c.id}')">
            <td class="px-4 py-3 truncate max-w-[220px] font-bold text-[#0B193C] text-[13px]">${frontText.substring(0, 80)}${frontText.length > 80 ? '...' : ''}</td>
            <td class="px-4 py-3 truncate max-w-[180px] text-slate-500 text-[12px]">${backText.substring(0, 60)}${backText.length > 60 ? '...' : ''}</td>
            <td class="px-3 py-3"><span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold truncate max-w-[100px] inline-block">${deckShort}</span></td>
            <td class="px-3 py-3"><span class="${statusInfo.cls} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">${statusInfo.text}</span></td>
            <td class="px-3 py-3 text-[11px] text-slate-400 font-medium">${revisao}</td>
            <td class="px-3 py-3 text-[11px] text-slate-400 font-medium whitespace-nowrap">${criado}</td>
            <td class="px-3 py-3">
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="event.stopPropagation();openQuickEdit('${c.id}')" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-colors" title="Editar">
                        <span class="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                    <button onclick="event.stopPropagation();excluirCartao('${c.id}')" class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-colors" title="Excluir">
                        <span class="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// ===== PREVIEW =====
function selectBrowserCard(id) {
    selectedCardId = id;
    let cards = window.db ? window.db.get('flashcards') || [] : [];
    const card = cards.find(c => c.id === id);
    if (card) renderBrowserPreview(card);
    // Highlight row
    document.querySelectorAll('#browserTableBody tr').forEach(tr => {
        if (tr.getAttribute('onclick') && tr.getAttribute('onclick').includes(id)) {
            tr.classList.add('bg-indigo-50/80', 'border-l-2', 'border-l-indigo-400');
            tr.classList.remove('hover:bg-slate-50/80');
        } else {
            tr.classList.remove('bg-indigo-50/80', 'border-l-2', 'border-l-indigo-400');
            tr.classList.add('hover:bg-slate-50/80');
        }
    });
}

function renderBrowserPreview(card) {
    const panel = document.getElementById('browserPreview');
    if (!panel) return;
    const now = new Date();
    const statusInfo = getStatusInfo(card, now);
    const revisao = card.proximaRevisaoEm ? new Date(card.proximaRevisaoEm).toLocaleDateString('pt-BR') : '\u2014';
    const criado = getCreatedAt(card) ? new Date(getCreatedAt(card)).toLocaleDateString('pt-BR') : '\u2014';
    const tags = (card.tags || []);
    const deckName = card.deckId || 'Default';

    // Get all cards for navigation
    const allCards = window.db ? window.db.get('flashcards') || [] : [];
    const currentIdx = allCards.findIndex(c => c.id === card.id);
    const prevId = currentIdx > 0 ? allCards[currentIdx - 1].id : null;
    const nextId = currentIdx < allCards.length - 1 ? allCards[currentIdx + 1].id : null;

    const statusColor = statusInfo.text === 'Novo' ? '#60a5fa' : statusInfo.text === 'Aprender' ? '#fbbf24' : statusInfo.text === 'Revisar' ? '#34d399' : '#f87171';

    panel.innerHTML = `
        <!-- Header Bar (rosa/mauve estilo Anki) -->
        <div class="px-4 py-2 flex items-center justify-between shrink-0" style="background:#8b5e7a">
            <span class="text-[11px] font-bold tracking-wide flex items-center gap-1.5" style="color:rgba(255,255,255,0.9)">
                <span class="material-symbols-outlined text-[14px]">preview</span> Pr\u00e9-visualiza\u00e7\u00e3o
            </span>
            <div class="flex gap-1">
                <button onclick="openQuickEdit('${card.id}')" class="w-6 h-6 rounded flex items-center justify-center transition-colors" style="background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.8)" title="Editar">
                    <span class="material-symbols-outlined text-[13px]">edit</span>
                </button>
                <button onclick="excluirCartao('${card.id}')" class="w-6 h-6 rounded flex items-center justify-center transition-colors" style="background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.8)" title="Excluir">
                    <span class="material-symbols-outlined text-[13px]">delete</span>
                </button>
            </div>
        </div>

        <!-- Card Content Area (fundo escuro) -->
        <div class="flex-1 flex flex-col overflow-y-auto custom-scrollbar" style="background:#2a2a2a">
            <!-- Frente \u2014 centralizada -->
            <div class="flex-1 flex items-start justify-center px-6 pt-10 pb-4">
                <div class="text-center text-[15px] font-medium leading-relaxed break-words max-w-full" style="color:rgba(255,255,255,0.9)">${card.front || '<span style="color:#666;font-style:italic">Sem conte\u00fado</span>'}</div>
            </div>

            <!-- Divisor fino central -->
            <div class="flex justify-center px-8 shrink-0">
                <div style="width:64px;height:2px;background:#555;border-radius:4px"></div>
            </div>

            <!-- Verso \u2014 inicialmente oculto -->
            <div id="previewVersoArea" class="flex-1 flex items-start justify-center px-6 pt-4 pb-6" style="display:none">
                <div class="text-center text-[14px] font-normal leading-relaxed break-words max-w-full" style="color:#ccc">${card.back || '<span style="color:#666;font-style:italic">Sem conte\u00fado</span>'}</div>
            </div>

            ${card.extra ? `
            <div id="previewExtraArea" class="px-6 pb-4" style="display:none">
                <div class="text-center text-[12px] font-normal leading-relaxed break-words" style="color:#999">${card.extra}</div>
            </div>` : ''}
        </div>

        <!-- Info bar (metadados discretos) -->
        <div class="px-4 py-2 shrink-0" style="background:#222;border-top:1px solid #3a3a3a">
            <div class="flex items-center justify-between text-[10px]" style="color:#888">
                <span class="flex items-center gap-1 truncate">
                    <span class="material-symbols-outlined text-[12px]">style</span>${deckName}
                </span>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-bold" style="color:${statusColor};background:rgba(255,255,255,0.06)">${statusInfo.text}</span>
            </div>
            ${tags.length ? `<div class="flex flex-wrap gap-1 mt-1.5">${tags.map(t => `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold" style="background:rgba(255,255,255,0.05);color:#aaa;border:1px solid rgba(255,255,255,0.05)">${t}</span>`).join('')}</div>` : ''}
        </div>

        <!-- Bottom Controls (estilo Anki) -->
        <div class="px-3 py-2.5 flex items-center justify-between shrink-0" style="background:#1e1e1e;border-top:1px solid #333">
            <div class="flex gap-1.5">
                <button onclick="togglePreviewVerso()" id="btnToggleVerso" class="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors" style="background:#333;border:1px solid #555;color:#ccc">
                    Mostrar Verso
                </button>
            </div>
            <div class="flex items-center gap-1.5">
                <button onclick="${prevId ? "selectBrowserCard('" + prevId + "')" : ''}" class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style="${prevId ? 'background:#333;border:1px solid #555;color:#ccc;cursor:pointer' : 'background:#252525;border:1px solid #333;color:#555;cursor:not-allowed'}" ${!prevId ? 'disabled' : ''}>
                    <span class="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <span class="text-[10px] font-bold min-w-[40px] text-center" style="color:#666">${currentIdx + 1}/${allCards.length}</span>
                <button onclick="${nextId ? "selectBrowserCard('" + nextId + "')" : ''}" class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style="${nextId ? 'background:#444;border:1px solid #666;color:#fff;cursor:pointer' : 'background:#252525;border:1px solid #333;color:#555;cursor:not-allowed'}" ${!nextId ? 'disabled' : ''}>
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
            </div>
        </div>
    `;
}

// Toggle mostrar/ocultar verso
function togglePreviewVerso() {
    const verso = document.getElementById('previewVersoArea');
    const extra = document.getElementById('previewExtraArea');
    const btn = document.getElementById('btnToggleVerso');
    if (!verso || !btn) return;

    const isHidden = verso.style.display === 'none';
    verso.style.display = isHidden ? 'flex' : 'none';
    if (extra) extra.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? 'Apenas a Frente' : 'Mostrar Verso';
    btn.style.background = isHidden ? '#555' : '#333';
    btn.style.borderColor = isHidden ? '#777' : '#555';
}

function clearBrowserPreview() {
    const panel = document.getElementById('browserPreview');
    if (!panel) return;
    panel.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-8" style="background:#2a2a2a">
            <span class="material-symbols-outlined text-[56px] mb-3" style="color:#555">preview</span>
            <p class="font-bold text-sm mb-1" style="color:#888">Pr\u00e9-visualiza\u00e7\u00e3o</p>
            <p class="text-[11px]" style="color:#666">Selecione um cart\u00e3o na tabela para visualizar.</p>
        </div>
    `;
}

// ===== FILTER SETTERS =====
function setQuickFilter(key) {
    currentQuickFilter = (currentQuickFilter === key && key !== 'all') ? null : key;
    if (key === 'all') { currentQuickFilter = null; currentDeckFilter = null; currentTagFilter = null; }
    renderBrowserTable();
}
function setDeckFilter(deck) {
    currentDeckFilter = currentDeckFilter === deck ? null : deck;
    renderBrowserTable();
}
function setTagFilter(tag) {
    currentTagFilter = currentTagFilter === tag ? null : tag;
    renderBrowserTable();
}
function clearAllFilters() {
    currentQuickFilter = null;
    currentDeckFilter = null;
    currentTagFilter = null;
    currentSearchQuery = '';
    const searchInput = document.getElementById('browserSearchInput');
    if (searchInput) searchInput.value = '';
    renderBrowserTable();
}

function onBrowserSearch(val) {
    currentSearchQuery = val.trim();
    renderBrowserTable();
}

function toggleBrowserSort(field) {
    if (browserSortField === field) browserSortAsc = !browserSortAsc;
    else { browserSortField = field; browserSortAsc = true; }
    renderBrowserTable();
}

// ===== UTILIDADES =====
// Normaliza status que pode estar corrompido pelo encoding (ex: 'nãovo' -> 'novo')
function normalizeStatus(status) {
    if (!status) return 'novo';
    const s = status.toLowerCase().trim();
    if (s === 'novo' || s === 'n\u00e3ovo' || s === 'nãovo' || s.includes('ovo')) return 'novo';
    if (s === 'aprendendo') return 'aprendendo';
    if (s === 'revisao' || s === 'revis\u00e3o' || s === 'revisão') return 'revisao';
    return 'novo';
}

// Pega o campo created_at, que pode estar como created_até (encoding corrompido)
function getCreatedAt(card) {
    return card.created_at || card['created_at\u00e9'] || card['created_até'] || null;
}

function getStatusInfo(card, now) {
    const st = normalizeStatus(card.status);
    const dt = card.proximaRevisaoEm ? new Date(card.proximaRevisaoEm) : null;
    if (st === 'novo') return { text: 'Novo', cls: 'text-sky-600 bg-sky-50 border border-sky-200' };
    if (st === 'aprendendo') return { text: 'Aprender', cls: 'text-amber-600 bg-amber-50 border border-amber-200' };
    if (st === 'revisao') {
        if (dt && dt < now) return { text: 'Atrasado', cls: 'text-rose-600 bg-rose-50 border border-rose-200' };
        return { text: 'Revisar', cls: 'text-emerald-600 bg-emerald-50 border border-emerald-200' };
    }
    return { text: 'Novo', cls: 'text-sky-600 bg-sky-50 border border-sky-200' };
}

function stripHTMLText(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function formatRelativeDate(date, now) {
    const diff = date - now;
    const days = Math.round(diff / 86400000);
    if (days < -30) return date.toLocaleDateString('pt-BR');
    if (days < -1) return `${Math.abs(days)}d atrás`;
    if (days === -1) return 'Ontem';
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Amanhã';
    if (days <= 30) return `${days}d`;
    return date.toLocaleDateString('pt-BR');
}
