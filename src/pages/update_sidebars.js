
const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;
const filesToUpdate = [
    'mentoria.html', 'metricas.html', 'estrategia.html', 'nexus_provas.html', 
    'provas.html', 'planejamento.html', 'vestibulares.html', 'calendario.html', 
    'simulador.html', 'banco-questoes.html', 'redacao.html', 'flashcard.html', 'perfil.html'
];

const menuItems = [
    { href: 'mentoria.html', icon: 'home', text: 'Metas Diárias' },
    { href: 'planejamento.html', icon: 'edit_calendar', text: 'Planejamento' },
    { href: 'metricas.html', icon: 'stacked_line_chart', text: 'Meu Desempenho' },
    { href: 'estrategia.html', icon: 'route', text: 'Estratgia AP' },
    { href: 'banco-questoes.html', icon: 'format_list_bulleted', text: 'Banco de Questões' },
    { href: 'redacao.html', icon: 'edit_document', text: 'Redação' },
    { href: 'simulador.html', icon: 'calculate', text: 'Simulador' },
    { href: 'calendario.html', icon: 'calendar_month', text: 'Cronograma' },
    { href: 'flashcard.html', icon: 'style', text: 'Flashcards' },
    { href: 'vestibulares.html', icon: 'school', text: 'Vestibulares' }
];

const generateSidebar = (currentFileName) => {
    // Logo: Image 2 shows Lion Head + "Lion Study" text. 
    // Using LOGO VETORIZADA.png as the most likely candidate.
    let sidebarHTML = `<aside class="w-[280px] flex flex-col z-30 flex-shrink-0 relative bg-[#00B5B5] shadow-[4px_0_24px_rgba(0,181,181,0.2)]">
        <!-- Logo Area -->
        <div class="pt-10 pb-6 flex flex-col items-center justify-center shrink-0 relative">
            <img src="../../public/imagens/globais/marca/LOGO VETORIZADA.png" alt="Lion Study" class="h-10 w-auto object-contain" />
        </div>
        
        <!-- Menu Principal -->
        <nav class="flex-1 overflow-y-auto px-4 space-y-1 relative pb-10 custom-scrollbar">
    `;
    
    menuItems.forEach(item => {
        const isCurrentActive = item.href === currentFileName;
        if (isCurrentActive) {
            sidebarHTML += `        <a href="${item.href}" class="flex items-center gap-4 px-4 py-3 bg-white/20 text-white rounded-[12px] font-bold text-[14px] relative border border-white/10 shadow-sm transition-all">
                <div class="w-6 flex items-center justify-center">
                    <span class="material-symbols-outlined icon-fill text-[22px] text-white">${item.icon}</span> 
                </div>
                <span class="tracking-wide">${item.text}</span>
            </a>\n`;
        } else {
            sidebarHTML += `        <a href="${item.href}" class="group flex items-center gap-4 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-[12px] transition-all duration-300 font-medium text-[14px]">
                <div class="w-6 flex items-center justify-center">
                    <span class="material-symbols-outlined text-[22px] text-white/60 group-hover:text-white transition-colors">${item.icon}</span> 
                </div>
                <span>${item.text}</span>
            </a>\n`;
        }
    });
    
    sidebarHTML += `        </nav>
        
        <!-- User Profile Card (As per Image 2) -->
        <div class="p-4 border-t border-white/10">
            <div id="userBlockClick" class="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all border border-white/5">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold shadow-inner">IR</div>
                <div class="flex-1 overflow-hidden">
                    <p class="text-sm font-bold text-white truncate">Johnn Oliveira</p>
                    <p class="text-[10px] text-white/60">Ver perfil</p>
                </div>
                <span class="material-symbols-outlined text-white/40 text-[18px]">chevron_right</span>
            </div>
        </div>
    </aside>`;
    return sidebarHTML;
};

filesToUpdate.forEach(file => {
    const fullPath = path.join(directoryPath, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Ensure material symbols link is correct in the head
    content = content.replace(/material-symbols-outlined/g, 'material-symbols-outlined');
    content = content.replace(/matrial-symbols-outlined/g, 'material-symbols-outlined');
    content = content.replace(/material Symbols Outlined/g, 'Material Symbols Outlined');
    
    const asideRegex = /<aside[\s\S]*?<\/aside>/;
    if (asideRegex.test(content)) {
        const newAside = generateSidebar(file);
        fs.writeFileSync(fullPath, content.replace(asideRegex, newAside), 'utf8');
        console.log(`Restaurado: ${file}`);
    }
});
