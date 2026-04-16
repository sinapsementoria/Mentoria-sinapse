const fs = require('fs');

const files = [
    'mentoria.html',
    'metricas.html',
    'provas.html',
    'planejamento.html',
    'vestibulares.html',
    'calendario.html',
    'simulador.html',
    'banco-questoes.html'
];

const menuMap = [
    { text: 'Metas Diárias', icon: 'home', href: 'mentoria.html' },
    { text: 'Meu Desempenho', icon: 'trending_up', href: 'metricas.html' },
    { text: 'Estratégia de Aprovação', icon: 'route', href: 'estrategia.html' },
    { text: 'Provas', icon: 'history_edu', href: 'provas.html' },
    { text: 'Planejamento', icon: 'edit_calendar', href: 'planejamento.html' },
    { text: 'Vestibulares', icon: 'school', href: 'vestibulares.html' },
    { text: 'Calendário', icon: 'calendar_month', href: 'calendario.html' },
    { text: 'Simulador SISU', icon: 'calculate', href: 'simulador.html' },
    { text: 'Banco de Questões', icon: 'checklist', href: 'banco-questoes.html' },
    { text: 'Redação', icon: 'edit_document', href: 'redacao.html' },
    { text: 'Flashcard', icon: 'style', href: 'flashcard.html' },
    { text: 'Perfil', icon: 'person', href: 'perfil.html' }
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Check if the current file exists
    if (!content) return;

    let navHtml = `<p class="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-4 pl-3">Acompanhamento</p>\n`;
    
    menuMap.forEach(item => {
        const isActive = (item.href === file);
        if (isActive) {
            navHtml += `            <a href="${item.href}" class="flex items-center gap-4 px-4 py-3 bg-[#0B193C] text-white rounded-xl font-semibold shadow-lg shadow-[#0B193C]/20 transition-all hover:scale-[1.02]">\n`;
            navHtml += `                <span class="material-symbols-outlined icon-fill opacity-90 text-[22px]">${item.icon}</span> ${item.text}\n`;
            navHtml += `                <div class="ml-auto w-1.5 h-1.5 rounded-full bg-sinapse-primary animate-pulse"></div>\n`;
            navHtml += `            </a>\n`;
        } else {
            navHtml += `            <a href="${item.href}" class="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group">\n`;
            navHtml += `                <span class="material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity">${item.icon}</span> ${item.text}\n`;
            navHtml += `            </a>\n`;
        }
    });

    const startIdx = content.indexOf('<nav class="flex-1 overflow-y-auto py-8 px-6 space-y-2">');
    const endIdx = content.indexOf('</nav>', startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        const pre = content.substring(0, startIdx + '<nav class="flex-1 overflow-y-auto py-8 px-6 space-y-2">\n'.length);
        const post = content.substring(endIdx);
        const newHtml = pre + navHtml + '        ' + post;
        fs.writeFileSync(file, newHtml);
        console.log(`Updated nav in ${file}`);
    }
});
