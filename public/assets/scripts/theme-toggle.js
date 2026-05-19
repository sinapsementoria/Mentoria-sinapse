document.addEventListener('DOMContentLoaded', () => {
    // 1. Locate the generic toggle wrapper using its distinctive icon texts
    const divs = document.querySelectorAll('div.cursor-pointer');
    let themeBtn = null;
    for (let el of divs) {
        if (el.innerHTML.includes('dark_mode') && el.innerHTML.includes('light_mode')) {
            themeBtn = el;
            break;
        }
    }

    if (!themeBtn) return; // Exit if not found on this page

    // 2. Identify internal parts by DOM structure
    // structure: span (moon), button (track), span (sun), span (text)
    const moonIcon = themeBtn.children[0];
    const track = themeBtn.children[1];
    const thumb = track.children[0];
    const sunIcon = themeBtn.children[2];
    const textEl = themeBtn.children[3];

    // Load saved preference
    const currentTheme = localStorage.getItem('lion_theme') || 'light';
    
    // Feature application
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            
            // Toggle aesthetics for Dark Mode (Moon active, Track left, Sun dim, Text Dark)
            themeBtn.className = 'hidden md:flex items-center gap-2 bg-[#2A3146] border border-[#3E455B] rounded-full px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-[#343D55] transition-colors';
            
            moonIcon.className = 'material-symbols-outlined text-[16px] text-amber-400 icon-fill';
            
            track.className = 'w-8 h-4 bg-[#1E2335] rounded-full relative flex items-center transition-colors pointer-events-none';
            // Moving thumb to left (left-0.5 = 2px)
            thumb.className = 'w-3 h-3 bg-slate-200 rounded-full absolute left-0.5 transition-transform pointer-events-none';
            
            sunIcon.className = 'material-symbols-outlined text-[16px] text-slate-500';
            
            textEl.textContent = 'Dark';
            textEl.className = 'text-sm font-bold text-slate-300 ml-1';
        } else {
            document.body.classList.remove('dark-mode');
            
            // Toggle aesthetics for Light Mode (Original structure)
            themeBtn.className = 'hidden md:flex items-center gap-2 bg-white border border-slate-200/60 rounded-full px-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer hover:bg-slate-50 transition-colors';
            
            moonIcon.className = 'material-symbols-outlined text-[16px] text-slate-300';
            
            track.className = 'w-8 h-4 bg-indigo-100 rounded-full relative flex items-center transition-colors pointer-events-none';
            // Moving thumb to right (right-0.5 = 2px)
            thumb.className = 'w-3 h-3 bg-[#6366F1] rounded-full absolute right-0.5 transition-transform pointer-events-none';
            
            sunIcon.className = 'material-symbols-outlined text-[16px] text-amber-500 icon-fill';
            
            textEl.textContent = 'Light';
            textEl.className = 'text-sm font-bold text-slate-500 ml-1';
        }
    };

    // Apply correctly on load
    applyTheme(currentTheme);

    // Bind interaction logic
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('lion_theme', newTheme);
        applyTheme(newTheme);
    });
});
