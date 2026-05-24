// ==========================================
// DECK OPTIONS MODAL (Anki Style)
// ==========================================

const deckOptionsData = {
    tabs: [
        { id: 'dailyLimits', name: 'Limites Diários', icon: 'speed' },
        { id: 'newCards', name: 'Novos Cartões', icon: 'fiber_new' },
        { id: 'lapses', name: 'Falhas', icon: 'history_toggle_off' },
        { id: 'restDays', name: 'Dias de Descanso', icon: 'weekend' },
        { id: 'advanced', name: 'Avançado', icon: 'manufacturing' },
        { id: 'timer', name: 'Cronômetro', icon: 'timer' },
        { id: 'autoAdvance', name: 'Avanço Automático', icon: 'fast_forward' },
        { id: 'displayOrder', name: 'Ordem de Exibição', icon: 'sort' },
        { id: 'fsrs', name: 'FSRS', icon: 'psychology' },
        { id: 'bury', name: 'Ocultar', icon: 'visibility_off' },
        { id: 'audio', name: 'Áudio', icon: 'volume_up' }
    ],
    helps: {
        dailyLimits: "<b>Novos cartões/dia:</b> O número máximo de novos cartões introduzidos por dia.<br><br><b>Revisões máximas/dia:</b> O número máximo de revisões a serem feitas em um dia.<br><br><b>Novos cartões ignoram o limite de revisão:</b> Se ativado, cartões novos não contam para o limite de revisão.<br><br><b>Os limites começam do deck superior:</b> Se ativado, sub-baralhos respeitam o limite do baralho pai.",
        newCards: "<b>Etapas de aprendizagem:</b> Minutos ou horas de espaçamento (ex: 1m 10m).<br><br><b>Intervalo de graduação:</b> Dias para o cartão virar 'Revisão'.<br><br><b>Intervalo fácil:</b> Dias para o cartão virar 'Revisão' se marcado como Fácil.",
        lapses: "<b>Etapas de reaprendizagem:</b> Passos quando você erra um cartão.<br><br><b>Ação Sanguessuga:</b> O que fazer com cartões errados muitas vezes.",
        restDays: "<b>Dias de descanso:</b> Reduz a carga de revisões em dias específicos (ex: Sábado e Domingo).",
        advanced: "Opções para ajustes finos do multiplicador de dificuldade do algoritmo SM-2.",
        timer: "Permite exibir um cronômetro e forçar uma resposta caso o tempo acabe.",
        autoAdvance: "Avança para a próxima carta automaticamente após X segundos.",
        displayOrder: "Controla a mistura de cartões Novos com Revisões durante a sessão.",
        fsrs: "Algoritmo moderno de agendamento (Free Spaced Repetition Scheduler).",
        bury: "Adia automaticamente cartões relacionados (irmãos) para o dia seguinte.",
        audio: "Controla a reprodução automática de áudio nos cartões."
    }
};

let currentDeckForOptions = null;
let currentDeckOptions = null; // A clone of the loaded options

// The default structure 
const DEFAULT_OPTIONS = {
  presetId: "default",
  dailyLimits: { newCardsPerDay: 20, maxReviewsPerDay: 200, newCardsIgnoreReviewLimit: false, limitsStartFromTopDeck: false },
  newCardsOptions: { learningSteps: "1m 10m", graduatingInterval: 1, easyInterval: 4, insertionOrder: "sequential" },
  lapseOptions: { relearningSteps: "10m", minimumInterval: 1, leechThreshold: 8, leechAction: "tagOnly" },
  restDays: { monday: "normal", tuesday: "normal", wednesday: "normal", thursday: "normal", friday: "normal", saturday: "normal", sunday: "normal" },
  advancedOptions: { maximumInterval: 36500, startingEase: 2.5, easyBonus: 1.3, intervalModifier: 1.0, hardInterval: 1.2, newInterval: 0.5, customSchedulingEnabled: false },
  timerOptions: { maxAnswerSeconds: 60, showAnswerTimer: false, stopTimerOnAnswer: false },
  autoAdvanceOptions: { secondsToShowQuestion: 0, secondsToShowAnswer: 0, waitForAudio: false, questionAction: "showAnswer", answerAction: "hideCard" },
  displayOrderOptions: { newCardGatherOrder: "deck", newCardSortOrder: "template", newReviewOrder: "mixWithReviews", interdayLearningReviewOrder: "mixWithReviews", reviewSortOrder: "dueDateThenRandom" },
  fsrsOptions: { fsrsEnabled: false },
  buryOptions: { buryNewSiblingsUntilNextDay: false, buryReviewSiblingsUntilNextDay: false, buryLearningSiblingsUntilNextDay: false },
  audioOptions: { disableAutoAudio: false, skipQuestionWhenRepeatingAnswer: false }
};

// 1. Initialization & UI Generation
function initDeckOptionsUI() {
    const sidebar = document.getElementById('deckOptionsSidebar');
    const mobileSelect = document.getElementById('deckOptionsMobileSelect');
    
    sidebar.innerHTML = '';
    mobileSelect.innerHTML = '';
    
    deckOptionsData.tabs.forEach((tab, index) => {
        // Sidebar link
        const btn = document.createElement('button');
        btn.className = `w-full text-left px-4 py-2.5 rounded-xl font-bold flex items-center gap-3 transition-colors text-[13px] ${index === 0 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B193C]'}`;
        btn.onclick = () => deckOptionsSwitchTab(tab.id, btn);
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px] ${index === 0 ? 'text-indigo-600' : 'text-slate-400'}">${tab.icon}</span> ${tab.name}`;
        sidebar.appendChild(btn);
        
        // Mobile option
        const opt = document.createElement('option');
        opt.value = tab.id;
        opt.textContent = tab.name;
        mobileSelect.appendChild(opt);
    });
}

function deckOptionsSwitchTab(tabId, btnElement = null) {
    // Update active state in sidebar
    if (btnElement) {
        const sidebar = document.getElementById('deckOptionsSidebar');
        Array.from(sidebar.children).forEach(btn => {
            btn.className = 'w-full text-left px-4 py-2.5 rounded-xl font-bold flex items-center gap-3 transition-colors text-[13px] text-slate-600 hover:bg-slate-100 hover:text-[#0B193C]';
            btn.querySelector('span').className = 'material-symbols-outlined text-[18px] text-slate-400';
        });
        btnElement.className = 'w-full text-left px-4 py-2.5 rounded-xl font-bold flex items-center gap-3 transition-colors text-[13px] bg-indigo-50 text-indigo-700';
        btnElement.querySelector('span').className = 'material-symbols-outlined text-[18px] text-indigo-600';
    } else {
        // Find button by index if called from select
        const idx = deckOptionsData.tabs.findIndex(t => t.id === tabId);
        if(idx >= 0) {
            const sidebar = document.getElementById('deckOptionsSidebar');
            if(sidebar.children[idx]) deckOptionsSwitchTab(tabId, sidebar.children[idx]);
            return;
        }
    }
    
    // Update Mobile Select to match
    document.getElementById('deckOptionsMobileSelect').value = tabId;

    renderDeckOptionsContent(tabId);
}

// Render HTML for the specific section
function renderDeckOptionsContent(tabId) {
    const area = document.getElementById('deckOptionsMainArea');
    const tabInfo = deckOptionsData.tabs.find(t => t.id === tabId);
    if(!tabInfo) return;
    
    let html = `
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-extrabold text-[#0B193C]">${tabInfo.name}</h3>
            <button onclick="abrirAjudaOpcoes('${tabId}')" class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors shadow-sm" title="Ajuda">
                <span class="material-symbols-outlined text-[18px]">question_mark</span>
            </button>
        </div>
        <div class="space-y-6 max-w-2xl">
    `;
    
    const o = currentDeckOptions || DEFAULT_OPTIONS;

    // Helper functions for UI
    const makeInput = (label, path, value, type='number', extra='') => `
        <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-slate-600">${label}</label>
            <input type="${type}" data-path="${path}" value="${value}" onchange="deckOptionChanged(this)" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" ${extra}>
        </div>
    `;
    const makeSelect = (label, path, options, selectedVal) => `
        <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-slate-600">${label}</label>
            <select data-path="${path}" onchange="deckOptionChanged(this)" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm">
                ${options.map(opt => `<option value="${opt.val}" ${opt.val == selectedVal ? 'selected' : ''}>${opt.text}</option>`).join('')}
            </select>
        </div>
    `;
    const makeToggle = (label, path, checked) => `
        <div class="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm">
            <span class="text-[14px] font-bold text-slate-700">${label}</span>
            <button type="button" data-path="${path}" onclick="deckOptionToggleChanged(this)" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#10B981]' : 'bg-slate-300'}" role="switch" aria-checked="${checked}">
                <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}"></span>
            </button>
        </div>
    `;

    // specific rendering logic
    if (tabId === 'dailyLimits') {
        html += makeInput('Novos cartões/dia', 'dailyLimits.newCardsPerDay', o.dailyLimits.newCardsPerDay, 'number', 'min="0" step="1"');
        html += makeInput('Revisões máximas/dia', 'dailyLimits.maxReviewsPerDay', o.dailyLimits.maxReviewsPerDay, 'number', 'min="0" step="1"');
        html += makeToggle('Novos cartões ignoram o limite de revisão', 'dailyLimits.newCardsIgnoreReviewLimit', o.dailyLimits.newCardsIgnoreReviewLimit);
        html += makeToggle('Os limites começam do deck superior', 'dailyLimits.limitsStartFromTopDeck', o.dailyLimits.limitsStartFromTopDeck);
    } 
    else if (tabId === 'newCards') {
        html += makeInput('Etapas de aprendizagem (ex: 1m 10m 1d)', 'newCardsOptions.learningSteps', o.newCardsOptions.learningSteps, 'text', 'placeholder="Ex: 1m 10m"');
        html += `<p class="text-xs text-red-500 hidden mt-[-4px]" id="err_newCardsOptions_learningSteps">Use formatos válidos como: 1m, 10m, 1h, 1d</p>`;
        html += makeInput('Intervalo de graduação (dias)', 'newCardsOptions.graduatingInterval', o.newCardsOptions.graduatingInterval, 'number', 'min="1" step="1"');
        html += makeInput('Intervalo fácil (dias)', 'newCardsOptions.easyInterval', o.newCardsOptions.easyInterval, 'number', 'min="1" step="1"');
        html += makeSelect('Ordem de inserção', 'newCardsOptions.insertionOrder', [
            {val: 'sequential', text: 'Sequencial (cartões mais antigos primeiro)'},
            {val: 'random', text: 'Aleatório'}
        ], o.newCardsOptions.insertionOrder);
    }
    else if (tabId === 'lapses') {
        html += makeInput('Etapas de reaprendizagem', 'lapseOptions.relearningSteps', o.lapseOptions.relearningSteps, 'text', 'placeholder="Ex: 10m"');
        html += makeInput('Intervalo mínimo (dias)', 'lapseOptions.minimumInterval', o.lapseOptions.minimumInterval, 'number', 'min="1" step="1"');
        html += makeInput('Limite sanguessuga (erros)', 'lapseOptions.leechThreshold', o.lapseOptions.leechThreshold, 'number', 'min="1" step="1"');
        html += makeSelect('Ação sanguessuga', 'lapseOptions.leechAction', [
            {val: 'tagOnly', text: 'Somente Etiquetas'},
            {val: 'suspendCard', text: 'Suspender Cartão'},
            {val: 'none', text: 'Nenhuma ação'}
        ], o.lapseOptions.leechAction);
    }
    else if (tabId === 'restDays') {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        const opts = [{val:'normal',text:'Normal'},{val:'reduced',text:'Reduzido'},{val:'minimum',text:'Mínimo'}];
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
        days.forEach((d, i) => {
            html += makeSelect(dayNames[i], `restDays.${d}`, opts, o.restDays[d]);
        });
        html += `</div>`;
    }
    else if (tabId === 'advanced') {
        html += makeInput('Intervalo máximo (dias)', 'advancedOptions.maximumInterval', o.advancedOptions.maximumInterval, 'number', 'min="1"');
        html += makeInput('Facilidade inicial (%)', 'advancedOptions.startingEase', o.advancedOptions.startingEase, 'number', 'min="1" step="0.1"');
        html += makeInput('Bônus por ser Fácil', 'advancedOptions.easyBonus', o.advancedOptions.easyBonus, 'number', 'min="1" step="0.1"');
        html += makeInput('Modificador de intervalo', 'advancedOptions.intervalModifier', o.advancedOptions.intervalModifier, 'number', 'min="0.1" step="0.1"');
        html += makeInput('Intervalo árduo', 'advancedOptions.hardInterval', o.advancedOptions.hardInterval, 'number', 'min="0.1" step="0.1"');
        html += makeInput('Novo intervalo', 'advancedOptions.newInterval', o.advancedOptions.newInterval, 'number', 'min="0.1" step="0.1"');
        html += makeToggle('Agendamento personalizado ativo', 'advancedOptions.customSchedulingEnabled', o.advancedOptions.customSchedulingEnabled);
    }
    else if (tabId === 'timer') {
        html += makeInput('Máximo de segundos para resposta', 'timerOptions.maxAnswerSeconds', o.timerOptions.maxAnswerSeconds, 'number', 'min="0"');
        html += makeToggle('Mostrar cronômetro de resposta', 'timerOptions.showAnswerTimer', o.timerOptions.showAnswerTimer);
        html += makeToggle('Parar o temporizador ao responder', 'timerOptions.stopTimerOnAnswer', o.timerOptions.stopTimerOnAnswer);
    }
    else if (tabId === 'autoAdvance') {
        html += makeInput('Segundos para mostrar a pergunta', 'autoAdvanceOptions.secondsToShowQuestion', o.autoAdvanceOptions.secondsToShowQuestion, 'number', 'min="0"');
        html += makeInput('Segundos para mostrar a resposta', 'autoAdvanceOptions.secondsToShowAnswer', o.autoAdvanceOptions.secondsToShowAnswer, 'number', 'min="0"');
        html += makeToggle('Esperando pelo Áudio', 'autoAdvanceOptions.waitForAudio', o.autoAdvanceOptions.waitForAudio);
        const actionOpts1 = [{val:'showAnswer',text:'Mostrar Resposta'},{val:'nextCard',text:'Próximo Cartão'},{val:'none',text:'Nenhuma ação'}];
        const actionOpts2 = [{val:'hideCard',text:'Ocultar Cartão'},{val:'nextCard',text:'Próximo Cartão'},{val:'none',text:'Nenhuma ação'}];
        html += makeSelect('Ação da Questão', 'autoAdvanceOptions.questionAction', actionOpts1, o.autoAdvanceOptions.questionAction);
        html += makeSelect('Ação de resposta', 'autoAdvanceOptions.answerAction', actionOpts2, o.autoAdvanceOptions.answerAction);
    }
    else if (tabId === 'displayOrder') {
        html += makeSelect('Agrupamento de cartões novos', 'displayOrderOptions.newCardGatherOrder', [{val:'deck',text:'Baralho'},{val:'template',text:'Modelo do cartão'},{val:'none',text:'Nenhum agrupamento'}], o.displayOrderOptions.newCardGatherOrder);
        html += makeSelect('Classificação de cartões novos', 'displayOrderOptions.newCardSortOrder', [{val:'template',text:'Modelo do cartão'},{val:'creation',text:'Data de criação'},{val:'random',text:'Aleatório'}], o.displayOrderOptions.newCardSortOrder);
        html += makeSelect('Ordem de novos vs revisão', 'displayOrderOptions.newReviewOrder', [{val:'mixWithReviews',text:'Misturar com revisões'},{val:'newFirst',text:'Mostrar novos primeiro'},{val:'reviewFirst',text:'Mostrar revisões primeiro'}], o.displayOrderOptions.newReviewOrder);
        html += makeSelect('Ordem de aprendizado vs revisão entre dias', 'displayOrderOptions.interdayLearningReviewOrder', [{val:'mixWithReviews',text:'Misturar com revisões'},{val:'learningFirst',text:'Mostrar aprendido primeiro'},{val:'reviewFirst',text:'Mostrar revisões primeiro'}], o.displayOrderOptions.interdayLearningReviewOrder);
        html += makeSelect('Ordem de classificação de revisões', 'displayOrderOptions.reviewSortOrder', [{val:'dueDateThenRandom',text:'Data de revisão, depois aleatório'},{val:'oldestFirst',text:'Mais antigas primeiro'},{val:'newestFirst',text:'Mais recentes primeiro'},{val:'random',text:'Aleatório'}], o.displayOrderOptions.reviewSortOrder);
    }
    else if (tabId === 'fsrs') {
        html += makeToggle('Ativar algoritmo FSRS', 'fsrsOptions.fsrsEnabled', o.fsrsOptions.fsrsEnabled);
    }
    else if (tabId === 'bury') {
        html += makeToggle('Ocultar novos irmãos até o dia seguinte', 'buryOptions.buryNewSiblingsUntilNextDay', o.buryOptions.buryNewSiblingsUntilNextDay);
        html += makeToggle('Ocultar irmãos de revisão até o dia seguinte', 'buryOptions.buryReviewSiblingsUntilNextDay', o.buryOptions.buryReviewSiblingsUntilNextDay);
        html += makeToggle('Ocultar irmãos em aprendizado até o dia seguinte', 'buryOptions.buryLearningSiblingsUntilNextDay', o.buryOptions.buryLearningSiblingsUntilNextDay);
    }
    else if (tabId === 'audio') {
        html += makeToggle('Não reproduzir o áudio automaticamente', 'audioOptions.disableAutoAudio', o.audioOptions.disableAutoAudio);
        html += makeToggle('Pular pergunta ao repetir a resposta', 'audioOptions.skipQuestionWhenRepeatingAnswer', o.audioOptions.skipQuestionWhenRepeatingAnswer);
    }

    html += `</div>`;
    area.innerHTML = html;
}

// 2. State Management (Changing and Saving)
function setNestedPath(obj, path, value) {
    let parts = path.split('.');
    let cur = obj;
    for(let i=0; i<parts.length - 1; i++) {
        if(!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
}

function deckOptionChanged(inputEl) {
    const path = inputEl.getAttribute('data-path');
    let val = inputEl.value;
    if(inputEl.type === 'number') val = parseFloat(val);
    setNestedPath(currentDeckOptions, path, val);
}

function deckOptionToggleChanged(btnEl) {
    const path = btnEl.getAttribute('data-path');
    const isChecked = btnEl.getAttribute('aria-checked') === 'true';
    const newState = !isChecked;
    
    // UI update
    btnEl.setAttribute('aria-checked', newState);
    btnEl.className = `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${newState ? 'bg-[#10B981]' : 'bg-slate-300'}`;
    const span = btnEl.querySelector('span');
    span.className = `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${newState ? 'translate-x-5' : 'translate-x-0'}`;
    
    // Data update
    setNestedPath(currentDeckOptions, path, newState);
}

function validateRegexSteps(val) {
    if(!val) return false;
    const parts = val.split(' ');
    const regex = /^\d+[mhd]$/;
    for(let p of parts) {
        if(!regex.test(p)) return false;
    }
    return true;
}

function validateDeckOptions() {
    let isValid = true;
    // Check steps
    const lErr = document.getElementById('err_newCardsOptions_learningSteps');
    if(lErr) lErr.classList.add('hidden');
    if(!validateRegexSteps(currentDeckOptions.newCardsOptions.learningSteps)) {
        if(lErr) lErr.classList.remove('hidden');
        isValid = false;
        // switch back to tab to show error
        deckOptionsSwitchTab('newCards');
    }
    
    // Lapse
    const rErr = document.getElementById('err_lapseOptions_relearningSteps'); // Assuming we had one
    if(rErr) rErr.classList.add('hidden');
    if(!validateRegexSteps(currentDeckOptions.lapseOptions.relearningSteps)) {
        if(rErr) rErr.classList.remove('hidden');
        isValid = false;
        deckOptionsSwitchTab('lapses');
    }
    
    return isValid;
}

// 3. Opening/Closing Modals
window.abrirOpcoesBaralho = function(deckPath) {
    currentDeckForOptions = deckPath;
    document.getElementById('deckOptionsTargetName').innerText = deckPath.split('::').pop();
    
    // Load presets DB
    let presets = window.db ? (window.db.get('deck_presets') || {}) : {};
    if(!presets['default']) {
        presets['default'] = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
        if(window.db) window.db.set('deck_presets', presets);
    }
    
    // Fetch deck options or fall back to default preset
    let dDb = window.db ? (window.db.get('flashcard_decks') || []) : [];
    let dInfo = dDb.find(d => d.fullPath === deckPath || d.nome === deckPath);
    
    let baseOpts = null;
    if(dInfo && dInfo.options) {
        baseOpts = dInfo.options;
    } else {
        baseOpts = presets['default'];
    }
    
    currentDeckOptions = JSON.parse(JSON.stringify(baseOpts)); // Clone
    
    // Fill select
    renderDeckOptionsSelect(presets, currentDeckOptions.presetId || 'default');
    
    initDeckOptionsUI();
    deckOptionsSwitchTab('dailyLimits'); // default tab
    
    const m = document.getElementById('modalDeckOptions');
    m.classList.remove('hidden');
    setTimeout(() => {
        m.classList.remove('opacity-0');
        m.querySelector('#modalDeckOptionsContent').classList.remove('scale-95');
    }, 10);
    
    // Close context menu if open
    document.getElementById('deckContextMenu').classList.add('hidden');
}

window.fecharOpcoesBaralho = function() {
    const m = document.getElementById('modalDeckOptions');
    m.classList.add('opacity-0');
    m.querySelector('#modalDeckOptionsContent').classList.add('scale-95');
    setTimeout(() => m.classList.add('hidden'), 300);
    
    // Close dropdown
    document.getElementById('deckOptionsSaveMenu').classList.add('hidden');
}

// 4. Presets Management
function renderDeckOptionsSelect(presets, activeId) {
    const sel = document.getElementById('deckOptionsPresetSelect');
    sel.innerHTML = '';
    
    // Calculate usages (optional, simple string for now)
    let dDb = window.db ? (window.db.get('flashcard_decks') || []) : [];
    
    Object.keys(presets).forEach(k => {
        let count = dDb.filter(d => (d.options && d.options.presetId === k) || (!d.options && k==='default')).length;
        let opt = document.createElement('option');
        opt.value = k;
        opt.textContent = `${presets[k].name || k} (usado por ${count})`;
        sel.appendChild(opt);
    });
    sel.value = activeId;
}

window.deckOptionsChangePreset = function(newId) {
    let presets = window.db ? (window.db.get('deck_presets') || {}) : {};
    if(presets[newId]) {
        currentDeckOptions = JSON.parse(JSON.stringify(presets[newId]));
        currentDeckOptions.presetId = newId;
        // Re-render current tab
        deckOptionsSwitchTab(document.getElementById('deckOptionsMobileSelect').value);
    }
}

window.toggleDeckOptionsSaveMenu = function(e) {
    e.stopPropagation();
    const menu = document.getElementById('deckOptionsSaveMenu');
    menu.classList.toggle('hidden');
}
document.addEventListener('click', e => {
    const menu = document.getElementById('deckOptionsSaveMenu');
    if(menu && !menu.classList.contains('hidden') && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

window.salvarOpcoesBaralho = function() {
    if(!validateDeckOptions()) return;
    
    let dDb = window.db ? (window.db.get('flashcard_decks') || []) : [];
    let idx = dDb.findIndex(d => d.fullPath === currentDeckForOptions || d.nome === currentDeckForOptions);
    
    if(idx >= 0) {
        dDb[idx].options = JSON.parse(JSON.stringify(currentDeckOptions));
    } else {
        // Deck metadata doesn't exist yet, we create a dummy one
        dDb.push({
            nome: currentDeckForOptions,
            fullPath: currentDeckForOptions,
            options: JSON.parse(JSON.stringify(currentDeckOptions))
        });
    }
    
    // Save to preset as well
    let pid = currentDeckOptions.presetId || 'default';
    let presets = window.db ? (window.db.get('deck_presets') || {}) : {};
    if(!presets[pid]) presets[pid] = {};
    presets[pid] = JSON.parse(JSON.stringify(currentDeckOptions));
    presets[pid].name = presets[pid].name || pid;
    
    if(window.db) {
        window.db.set('flashcard_decks', dDb);
        window.db.set('deck_presets', presets);
    }
    
    fecharOpcoesBaralho();
    // alert feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-2xl z-[100] font-bold transform transition-all translate-y-10 opacity-0';
    toast.textContent = 'Opções salvas com sucesso!';
    document.body.appendChild(toast);
    setTimeout(()=> { toast.classList.remove('translate-y-10', 'opacity-0'); }, 10);
    setTimeout(()=> { toast.classList.add('translate-y-10', 'opacity-0'); setTimeout(()=>toast.remove(), 300); }, 3000);
}

window.deckOptionsAcaoPreset = function(action) {
    let presets = window.db ? (window.db.get('deck_presets') || {}) : {};
    let curId = currentDeckOptions.presetId || 'default';
    document.getElementById('deckOptionsSaveMenu').classList.add('hidden');
    
    if(action === 'add') {
        let name = prompt("Nome da predefinição:");
        if(name && name.trim() !== '') {
            let nid = 'preset_' + Date.now();
            presets[nid] = JSON.parse(JSON.stringify(currentDeckOptions));
            presets[nid].presetId = nid;
            presets[nid].name = name;
            if(window.db) window.db.set('deck_presets', presets);
            currentDeckOptions.presetId = nid;
            renderDeckOptionsSelect(presets, nid);
        }
    } else if(action === 'clone') {
        let nid = 'preset_' + Date.now();
        let name = (presets[curId]?.name || curId) + ' — cópia';
        presets[nid] = JSON.parse(JSON.stringify(currentDeckOptions));
        presets[nid].presetId = nid;
        presets[nid].name = name;
        if(window.db) window.db.set('deck_presets', presets);
        currentDeckOptions.presetId = nid;
        renderDeckOptionsSelect(presets, nid);
    } else if(action === 'rename') {
        let name = prompt("Renomear predefinição para:", presets[curId]?.name || curId);
        if(name && name.trim() !== '') {
            presets[curId].name = name;
            if(window.db) window.db.set('deck_presets', presets);
            renderDeckOptionsSelect(presets, curId);
        }
    } else if(action === 'remove') {
        if(Object.keys(presets).length <= 1) {
            alert("Não é possível excluir a única predefinição existente.");
            return;
        }
        if(confirm("Tem certeza que deseja remover esta predefinição?")) {
            delete presets[curId];
            if(window.db) window.db.set('deck_presets', presets);
            let next = Object.keys(presets)[0];
            currentDeckOptions = JSON.parse(JSON.stringify(presets[next]));
            renderDeckOptionsSelect(presets, next);
            deckOptionsSwitchTab(document.getElementById('deckOptionsMobileSelect').value);
        }
    } else if(action === 'applyToChildren') {
        if(confirm("Deseja aplicar estas configurações a todos os sub-baralhos?")) {
            let dDb = window.db ? (window.db.get('flashcard_decks') || []) : [];
            let r_decks = window.buildDeckTree ? window.buildDeckTree().r_decks : [];
            // Find all children
            let children = r_decks.filter(d => d.startsWith(currentDeckForOptions + '::'));
            children.forEach(c => {
                let idx = dDb.findIndex(d => d.fullPath === c || d.nome === c);
                if(idx >= 0) {
                    dDb[idx].options = JSON.parse(JSON.stringify(currentDeckOptions));
                } else {
                    dDb.push({
                        nome: c,
                        fullPath: c,
                        options: JSON.parse(JSON.stringify(currentDeckOptions))
                    });
                }
            });
            if(window.db) window.db.set('flashcard_decks', dDb);
            alert(`Configurações aplicadas a ${children.length} sub-baralhos.`);
        }
    }
}

// 5. Help Modal
window.abrirAjudaOpcoes = function(tabId) {
    const tabInfo = deckOptionsData.tabs.find(t => t.id === tabId);
    const helpText = deckOptionsData.helps[tabId];
    if(!tabInfo || !helpText) return;
    
    document.getElementById('deckOptionsHelpTitle').innerHTML = `<span class="material-symbols-outlined text-indigo-500">${tabInfo.icon}</span> Ajuda: ${tabInfo.name}`;
    document.getElementById('deckOptionsHelpText').innerHTML = helpText;
    
    const m = document.getElementById('modalDeckOptionsHelp');
    m.classList.remove('hidden');
    setTimeout(() => {
        m.classList.remove('opacity-0');
        m.querySelector('#modalDeckOptionsHelpContent').classList.remove('scale-95');
    }, 10);
}

window.fecharModalDeckHelp = function() {
    const m = document.getElementById('modalDeckOptionsHelp');
    m.classList.add('opacity-0');
    m.querySelector('#modalDeckOptionsHelpContent').classList.add('scale-95');
    setTimeout(() => m.classList.add('hidden'), 300);
}
