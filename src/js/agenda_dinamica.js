const msInDay = 1000 * 60 * 60 * 24;

let currentDate = new Date();
currentDate.setHours(12, 0, 0, 0);

// Set currentWeekStart to Sunday
function getSunday(d) {
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.getFullYear(), d.getMonth(), diff, 12, 0, 0, 0);
}

let currentWeekStart = getSunday(currentDate);

// Banco de dados simulado rodando para semanas infinitas.
// Ele pega as tasks baseadas puramente pelo Dia da Semana.
const dbTasksPaterns = [
    [], // 0 = Domingo
    [], // 1 = Segunda
    [], // 2 = Terça
    [], // 3 = Quarta
    [], // 4 = Quinta
    [], // 5 = Sexta
    []  // 6 = Sábado
];

function formatDateBr(d) {
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

function formatDayShort(d) {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return String(d.getDate()).padStart(2, '0') + ' <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">' + meses[d.getMonth()] + '</span>';
}

function createCardHTML(task) {
    let tagCol = task.color;
    if(task.color === 'red') tagCol = 'rose';
    
    let isConcluido = task.status === 'Concluído' || task.status === 'concluída' || task.status === 'concluida';
    let isNaoConcluido = task.status === 'Não Concluído' || task.status === 'nao_concluido';
    
    let cardClasses = `task-card bg-white p-4 rounded-2xl shadow-sm border border-${tagCol}-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`;
    let titleClasses = `task-title font-bold text-[#0B193C] text-sm leading-snug pl-2 transition-colors`;
    let statusTextClasses = `task-status-text text-[10px] font-bold text-slate-400 uppercase`;
    let statusTextContent = task.status;
    let dotClasses = `task-dot w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-${tagCol}-400 transition-colors`;
    let dotContent = ``;
    let borderClasses = `task-border absolute left-0 top-0 bottom-0 w-1 bg-${tagCol}-500 rounded-l-2xl`;

    if (isConcluido) {
        cardClasses = `task-card bg-emerald-50/50 p-4 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`;
        titleClasses = `task-title font-bold text-slate-500 line-through text-sm leading-snug pl-2 transition-colors`;
        statusTextClasses = `task-status-text text-[10px] font-bold text-emerald-600 uppercase`;
        statusTextContent = `Concluído`;
        dotClasses = `task-dot flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500`;
        dotContent = `<span class="material-symbols-outlined text-[8px] text-white font-bold">check</span>`;
        borderClasses = `task-border absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl`;
    } else if (isNaoConcluido) {
        cardClasses = `task-card bg-rose-50/50 p-4 rounded-2xl shadow-sm border border-rose-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`;
        titleClasses = `task-title font-bold text-rose-700 text-sm leading-snug pl-2 transition-colors`;
        statusTextClasses = `task-status-text text-[10px] font-bold text-rose-600 uppercase`;
        statusTextContent = `Não Concluído`;
        dotClasses = `task-dot flex items-center justify-center w-3 h-3 rounded-full bg-rose-500`;
        dotContent = `<span class="material-symbols-outlined text-[8px] text-white font-bold">close</span>`;
        borderClasses = `task-border absolute left-0 top-0 bottom-0 w-1 bg-rose-400 rounded-l-2xl`;
    }

    return `
    <div class="${cardClasses}" onclick="toggleTaskOptions(this)" data-id="${task.id || ''}" data-isdb="${task.dbRecord ? 'true' : 'false'}">
        <div class="${borderClasses}"></div>
        <div class="flex justify-between items-start mb-2 pl-2">
            <span class="text-[9px] font-extrabold text-${tagCol}-600 bg-${tagCol}-50 px-2.5 py-1 rounded-md uppercase tracking-wider">${task.tag}</span>
            <span class="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-${tagCol}-400 transition-colors">${task.icon}</span>
        </div>
        <h4 class="${titleClasses}">${task.title}</h4>
        
        <div class="task-status mt-3 flex items-center gap-2 pl-2">
            <div class="${dotClasses}">${dotContent}</div>
            <span class="${statusTextClasses}">${statusTextContent}</span>
        </div>

        <div class="task-options hidden mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 w-full animate-[fadeInUp_0.2s_ease-out]">
            <button onclick="markTaskCard(event, this, 'concluido')" class="w-full bg-emerald-50 text-emerald-600 font-bold text-[10px] py-1.5 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-[12px]">check</span> Concluído
            </button>
            <div class="flex gap-2">
                <button onclick="markTaskCard(event, this, 'nao_concluido')" class="flex-1 bg-rose-50 text-rose-600 font-bold text-[10px] py-1.5 rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">close</span> Pendente
                </button>
                <button onclick="deleteTaskCard(event, this)" class="flex-1 bg-slate-50 text-rose-500 font-bold text-[10px] py-1.5 rounded-lg hover:bg-red-50 hover:border-red-200 border border-transparent transition-colors flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">delete</span> Excluir
                </button>
            </div>
        </div>
    </div>`;
}

window.toggleTaskOptions = function(card) {
    const options = card.querySelector('.task-options');
    // Hide all other open options first for cleaner UI
    document.querySelectorAll('.task-options').forEach(opt => {
        if (opt !== options) opt.classList.add('hidden');
    });
    
    if (options) {
        options.classList.toggle('hidden');
    }
};

window.markTaskCard = function(event, btn, state) {
    event.stopPropagation();
    
    const card = btn.closest('.task-card');
    const title = card.querySelector('.task-title');
    const statusText = card.querySelector('.task-status-text');
    const dot = card.querySelector('.task-dot');
    const options = card.querySelector('.task-options');
    const border = card.querySelector('.task-border');

    const id = card.getAttribute('data-id');
    const isDb = card.getAttribute('data-isdb') === 'true';

    // Reset styles
    card.className = `task-card bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`;
    title.className = `task-title font-bold text-[#0B193C] text-sm leading-snug pl-2 transition-colors`;
    
    if (state === 'concluido') {
        card.classList.replace('bg-white', 'bg-emerald-50/50');
        card.classList.replace('border-slate-100', 'border-emerald-200');
        title.classList.replace('text-[#0B193C]', 'text-slate-500');
        title.classList.add('line-through');
        
        statusText.innerText = "Concluído";
        statusText.className = "task-status-text text-[10px] font-bold text-emerald-600 uppercase";
        
        dot.className = "task-dot flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500";
        dot.innerHTML = `<span class="material-symbols-outlined text-[8px] text-white font-bold">check</span>`;
        if(border) border.className = "task-border absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl";
        
        // Efeito WOW!
        if(window.confetti) {
            const rect = btn.getBoundingClientRect();
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { 
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight
                },
                colors: ['#10B981', '#34D399', '#facc15', '#6366F1'],
                zIndex: 100
            });
        }
        
        if (isDb && window.db) {
            window.db.update('activities', Number(id), { status: 'concluida' });
        }
        
    } else if (state === 'nao_concluido') {
        card.classList.replace('bg-white', 'bg-rose-50/50');
        card.classList.replace('border-slate-100', 'border-rose-200');
        title.classList.replace('text-[#0B193C]', 'text-rose-700');
        
        statusText.innerText = "Não Concluído";
        statusText.className = "task-status-text text-[10px] font-bold text-rose-600 uppercase";
        
        dot.className = "task-dot flex items-center justify-center w-3 h-3 rounded-full bg-rose-500";
        dot.innerHTML = `<span class="material-symbols-outlined text-[8px] text-white font-bold">close</span>`;
        if(border) border.className = "task-border absolute left-0 top-0 bottom-0 w-1 bg-rose-400 rounded-l-2xl";

        if (isDb && window.db) {
            window.db.update('activities', Number(id), { status: 'nao_concluido' });
        }
    }

    if (options) {
        options.classList.add('hidden');
    }
}

window.deleteTaskCard = function(event, btn) {
    event.stopPropagation();
    if (!confirm('Deseja realmente excluir esta atividade?')) return;
    
    const card = btn.closest('.task-card');
    const id = card.getAttribute('data-id');
    const isDb = card.getAttribute('data-isdb') === 'true';

    if (isDb && window.db) {
        window.db.delete('activities', Number(id));
        // Limpar metricas se existir
        const metrics = window.db.get('metrics_entries') || [];
        const m = metrics.find(x => x.activity_id === Number(id));
        if(m) window.db.delete('metrics_entries', m.id);
    }
    
    // Anima a remoção 
    card.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        if (window.renderWeeklyAgenda) window.renderWeeklyAgenda();
    }, 300);
}

function renderWeeklyAgenda() {
    const endOfWeek = new Date(currentWeekStart.getTime() + (6 * msInDay));
    
    // Check if it's the current real week to mark the label "Semana Atual" or "Outra Semana"
    const realSunday = getSunday(currentDate);
    document.getElementById('lblSemana').innerText = (realSunday.getTime() === currentWeekStart.getTime()) ? "Semana Atual" : "Visualizando";
    
    // Update Header
    document.getElementById('weekDateRange').innerHTML = formatDateBr(currentWeekStart) + ' <span class="text-slate-300 font-normal mx-1">a</span> ' + formatDateBr(endOfWeek);

    const grid = document.getElementById('weeklyAgendaGrid');
    if (!grid) return; // Safely exit if not on Planejamento page
    grid.innerHTML = ''; // Limpa

    const daysNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    for (let i = 0; i < 7; i++) {
        let colDate = new Date(currentWeekStart.getTime() + (i * msInDay));
        let isToday = (colDate.toDateString() === currentDate.toDateString());
        
        // Render Column structure
        let containerClass = "snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px] group";
        
        let dStr = colDate.getFullYear() + '-' + String(colDate.getMonth()+1).padStart(2,'0') + '-' + String(colDate.getDate()).padStart(2,'0');

        // Se for menor que hoje na semana atual ou uma semana do passado, da uma leve opacidade.
        let isPast = (colDate.getTime() < currentDate.getTime() && !isToday);
        if (isPast) containerClass += " opacity-60 hover:opacity-100 transition-opacity";

        // Inject highlights if it is Today
        let headerInner = "";
        if(isToday) {
            headerInner = `
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sinapse-primary to-blue-500 text-white text-[9px] font-extrabold uppercase px-4 py-1 rounded-full shadow-md z-20 tracking-widest">Hoje</div>
            <div class="flex items-center justify-between w-full">
                <div class="text-left">
                    <h3 class="text-[11px] font-extrabold text-sinapse-primary uppercase tracking-widest">${daysNames[i]}</h3>
                    <p class="text-[26px] font-headline font-extrabold text-[#0B193C] mt-0.5 leading-none">${formatDayShort(colDate)}</p>
                </div>
                <button onclick="if(window.abrirModalAtividadeParaData) window.abrirModalAtividadeParaData('${dStr}')" class="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sinapse-primary hover:bg-sinapse-primary hover:text-white hover:border-transparent transition-all opacity-80 group-hover:opacity-100 shadow-sm" title="Planejar meta neste dia">
                    <span class="material-symbols-outlined text-[20px]">add</span>
                </button>
            </div>`;
        } else {
            headerInner = `
            <div class="flex items-center justify-between w-full">
                <div class="text-left">
                    <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">${daysNames[i]}</h3>
                    <p class="text-[26px] font-headline font-extrabold text-[#0B193C] mt-0.5 leading-none opacity-80">${formatDayShort(colDate)}</p>
                </div>
                <button onclick="if(window.abrirModalAtividadeParaData) window.abrirModalAtividadeParaData('${dStr}')" class="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-sinapse-primary hover:border-sinapse-primary/50 transition-all opacity-0 group-hover:opacity-100 shadow-sm" title="Planejar meta neste dia">
                    <span class="material-symbols-outlined text-[20px]">add</span>
                </button>
            </div>`;
        }

        let tasksHTML = "";
        let dayTasks = dbTasksPaterns[i] ? [...dbTasksPaterns[i]] : [];

        // Puxar metas REAIS criadas via Planejamento Semanal + Modal
        let realActivities = [];
        if (window.db) {
            let allActivities = window.db.get('activities') || [];
            let filtered = allActivities.filter(a => a.date === dStr);
            
            realActivities = filtered.map(a => {
                let colorMap = {
                    'Matemática': 'blue',
                    'Física': 'rose',
                    'Química': 'amber',
                    'Biologia': 'emerald',
                    'Filosofia': 'slate',
                    'Sociologia': 'slate',
                    'História': 'orange',
                    'Geografia': 'green',
                    'Literatura': 'purple',
                    'Linguagens': 'purple',
                    'Inglês': 'indigo',
                    'Espanhol': 'indigo',
                    'Artes': 'pink'
                };
                let iconMap = {
                    'Matemática': 'functions',
                    'Física': 'speed',
                    'Química': 'experiment',
                    'Biologia': 'biotech',
                    'Filosofia': 'lightbulb',
                    'Sociologia': 'groups',
                    'História': 'history',
                    'Geografia': 'public',
                    'Literatura': 'menu_book',
                    'Linguagens': 'edit_document',
                    'Inglês': 'language',
                    'Espanhol': 'translate',
                    'Artes': 'palette'
                };
                let c = colorMap[a.discipline] || 'indigo';
                let ic = iconMap[a.discipline] || 'assignment';
                
                let finalStatus = 'Pendente';
                if (a.status === 'concluída' || a.status === 'concluida') finalStatus = 'Concluído';
                else if (a.status === 'nao_concluido' || a.status === 'Não Concluído') finalStatus = 'Não Concluído';

                return {
                    id: a.id,
                    dbRecord: true, // Identify it's real
                    tag: a.discipline.substring(0,12),
                    color: c,
                    prefix: c,
                    icon: ic,
                    title: a.subject,
                    status: finalStatus
                };
            });
        }
        
        // Merge real metas WITH mock metas (real metas first)
        let mergedTasks = [...realActivities, ...dayTasks];

        // Se for depois de dezembro, não tem tasks?
        if (colDate.getFullYear() > currentDate.getFullYear()) {
             // Mock vazio para ano que vem se quiser
             tasksHTML = `<p class="text-xs font-bold text-slate-300 text-center mt-10 uppercase tracking-widest">Aguardando Planejamento</p>`;
        } else {
            if (mergedTasks.length === 0) {
                // Empty State Premium
                let isPastES = colDate.getTime() < currentDate.getTime() && !isToday;
                let textColor = isPastES ? "text-slate-300" : "text-sinapse-primary/40";
                
                tasksHTML = `
                <div class="h-full w-full flex flex-col items-center justify-center pt-20 pb-10 select-none group-hover:opacity-100 transition-opacity ${isPastES ? 'opacity-40' : 'opacity-60'}">
                    <div class="w-14 h-14 rounded-full border border-dashed border-slate-300 flex items-center justify-center mb-4 bg-white/50 shadow-sm">
                        <span class="material-symbols-outlined text-[24px] text-slate-300">event_available</span>
                    </div>
                    <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Dia Livre</p>
                </div>`;
            } else {
                mergedTasks.forEach(task => {
                    tasksHTML += createCardHTML(task);
                });
            }
        }

        let bgBody = isToday ? "bg-gradient-to-b from-[#F0F4FF] to-white/50 border-blue-100/60 shadow-[inset_0_2px_10px_rgba(37,99,235,0.02)]" : "bg-[#F8FAFC]/50 border-slate-100/80";
        let bdHeader = isToday ? "border-blue-100/60 bg-white" : "border-slate-100/80 bg-white/80 backdrop-blur-md";

        let finalCol = `
        <div class="${containerClass}">
            <div class="rounded-t-[32px] border-b-0 border ${bdHeader} p-6 pb-5 relative z-10 shrink-0 shadow-sm">
                ${headerInner}
            </div>
            <div class="${bgBody} border border-t-0 rounded-b-[32px] p-3 pt-5 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                ${tasksHTML}
            </div>
        </div>`;

        grid.innerHTML += finalCol;
    }
}

function agendaPrev() {
    let d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    currentWeekStart = d;
    renderWeeklyAgenda();
}

function agendaNext() {
    let d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    currentWeekStart = d;
    renderWeeklyAgenda();
}

function agendaToday() {
    currentWeekStart = getSunday(currentDate);
    renderWeeklyAgenda();
}

document.addEventListener('DOMContentLoaded', () => {
    // Only bind if elements exist
    if (document.getElementById('weeklyAgendaGrid')) {
        renderWeeklyAgenda();
    }
});
