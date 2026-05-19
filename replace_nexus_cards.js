const fs = require('fs');
const path = 'c:/Users/Pedro/Downloads/John/Pasta plataforma/src/pages/nexus_provas.html';
let content = fs.readFileSync(path, 'utf8');

const newStudentInfo = `<!-- Student Info Bar -->
<div class="bg-white border shadow-sm border-slate-200 rounded-xl px-4 py-2 mb-3" style="min-height: 18mm; height: 18mm; overflow: visible !important; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: center; box-sizing: border-box;">
    <!-- Candidato -->
    <div class="flex items-center">
        <div class="w-8 h-8 rounded-full border border-teal-600 text-teal-600 flex items-center justify-center mr-2 shrink-0">
            <span class="material-symbols-outlined text-[18px]">person</span>
        </div>
        <div class="flex flex-col">
            <span class="text-[9px] uppercase tracking-wider font-black text-teal-600 leading-tight">Candidato(a):</span>
            <span class="text-[11px] font-black text-slate-700 leading-tight" id="espNovo-outName" style="white-space: normal; word-wrap: break-word;">PEDRO GARCIA PORTO</span>
        </div>
    </div>
    
    <div class="w-px h-8 bg-slate-200 mx-2"></div>
    
    <!-- Matrícula -->
    <div class="flex items-center">
        <div class="w-8 h-8 rounded-full border border-teal-600 text-teal-600 flex items-center justify-center mr-2 shrink-0">
            <span class="material-symbols-outlined text-[18px]">badge</span>
        </div>
        <div class="flex flex-col">
            <span class="text-[9px] uppercase tracking-wider font-black text-teal-600 leading-tight">Matrícula:</span>
            <span class="text-[11px] font-black text-slate-700 leading-tight" id="espNovo-outId" style="white-space: normal; word-wrap: break-word;">092.873.161-80</span>
        </div>
    </div>

    <div class="w-px h-8 bg-slate-200 mx-2"></div>
    
    <!-- Turma -->
    <div class="flex items-center">
        <div class="w-8 h-8 rounded-full border border-teal-600 text-teal-600 flex items-center justify-center mr-2 shrink-0">
            <span class="material-symbols-outlined text-[18px]">school</span>
        </div>
        <div class="flex flex-col">
            <span class="text-[9px] uppercase tracking-wider font-black text-teal-600 leading-tight">Turma:</span>
            <span class="text-[11px] font-black text-slate-700 leading-tight" id="espNovo-outTurma" style="white-space: normal; word-wrap: break-word;">MEDICINA</span>
        </div>
    </div>

    <div class="w-px h-8 bg-slate-200 mx-2"></div>
    
    <!-- Idioma -->
    <div class="flex items-center">
        <div class="w-8 h-8 rounded-full border border-teal-600 text-teal-600 flex items-center justify-center mr-2 shrink-0">
            <span class="material-symbols-outlined text-[18px]">language</span>
        </div>
        <div class="flex flex-col">
            <span class="text-[9px] uppercase tracking-wider font-black text-teal-600 leading-tight">Idioma:</span>
            <span class="text-[11px] font-black text-slate-700 leading-tight" id="espNovo-outIdioma" style="white-space: normal; word-wrap: break-word;">INGLÊS</span>
        </div>
    </div>
</div>`;

const cardsHTML = [
    {
        name: "Linguagens",
        color: "#0B193C",
        icon: "chat",
        idPrefix: "lin"
    },
    {
        name: "Humanas",
        color: "#008080",
        icon: "account_balance",
        idPrefix: "hum"
    },
    {
        name: "Natureza",
        color: "#20b2aa",
        icon: "eco",
        idPrefix: "nat"
    },
    {
        name: "Matemática",
        color: "#0066cc",
        icon: "show_chart",
        idPrefix: "mat"
    }
];

function generateNewCard(card) {
    let nameForClass = card.name === 'Matemática' ? 'MATEMÁTICA' : card.name.toUpperCase();
    return `<!-- ${nameForClass} -->
<div class="flex items-stretch bg-white border border-slate-200 rounded-xl shadow-sm relative" style="height: 32mm; overflow: visible !important;">
    <!-- Left Bar -->
    <div class="w-14 bg-[${card.color}] flex items-center justify-center shrink-0 rounded-l-xl">
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[${card.color}] shadow-sm">
            <span class="material-symbols-outlined text-[18px]">${card.icon}</span>
        </div>
    </div>
    
    <!-- Right Content -->
    <div class="flex-1 z-10 relative" style="display: grid; grid-template-rows: auto 1fr auto; padding: 6px 12px; overflow: visible !important;">
        <!-- Top Row -->
        <div class="flex justify-between items-start w-full">
            <span class="text-[11px] text-slate-600 font-bold tracking-wide uppercase leading-tight">${card.name}</span>
            <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[11px] text-slate-400">my_location</span>
                <span class="text-[10px] font-bold text-slate-500 whitespace-nowrap leading-tight" id="bol-pct-${card.idPrefix}">0/45 acertos (0%)</span>
            </div>
        </div>
        
        <!-- Middle Row (Score) -->
        <div class="flex items-center justify-start w-full overflow-visible">
            <span class="text-[30px] font-black text-[#0B193C] leading-none tracking-tighter" id="bol-head-${card.idPrefix}" style="font-family: 'Playfair Display', 'Merriweather', serif; overflow: visible !important; padding-top: 4px;">0.0</span>
        </div>
        
        <!-- Bottom Row (Faixa) -->
        <div class="flex justify-end items-end w-full">
            <div class="flex items-end gap-1.5 pb-1">
                <span class="material-symbols-outlined text-[12px] text-slate-300 mb-0.5">bar_chart</span>
                <div class="flex flex-col items-end leading-none">
                    <span class="text-[8px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Faixa estimada:</span>
                    <span class="text-[10px] font-black text-slate-500 whitespace-nowrap" id="bol-faixa-${card.idPrefix}">0.0 a 0.0</span>
                </div>
            </div>
        </div>
    </div>
</div>`;
}

// Student info replace
let exactRegex = /<!-- Student Info Bar -->[\s\S]*?<!-- LINGUAGENS -->/;
let newReplace = newStudentInfo + "\n</div>\n</section>\n      <section class=\"bloco-pdf bloco-cards-principais\">\n        <div class=\"grid grid-cols-2 gap-2 mb-2\">\n<!-- LINGUAGENS -->";
content = content.replace(exactRegex, newReplace);
console.log("Student Info Bar replaced!");

// Now replace each card
cardsHTML.forEach(card => {
    let nameForClass = card.name === 'Matemática' ? 'MATEMÁTICA' : card.name.toUpperCase();
    let nextCommentRegex = /<!-- [A-ZÁÉÍÓÚÂÊÎÔÛÃÕ]+ -->|<!-- Redação Bar -->/g;
    
    // Find the start of this card
    let startTag = `<!-- ${nameForClass} -->`;
    let startIndex = content.indexOf(startTag);
    if (startIndex !== -1) {
        let textAfter = content.substring(startIndex + startTag.length);
        let nextMatch = nextCommentRegex.exec(textAfter);
        if (nextMatch) {
            let endIndex = startIndex + startTag.length + nextMatch.index;
            let newHTML = generateNewCard(card);
            content = content.substring(0, startIndex) + newHTML + "\n" + content.substring(endIndex);
            console.log(`Replaced card ${card.name}`);
        } else {
            console.log(`Could not find end of card ${card.name}`);
        }
    } else {
        console.log(`Could not find start of card ${card.name}`);
    }
});

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete.');
