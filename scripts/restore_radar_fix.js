const fs = require('fs');
const path = require('path');
const filePath = path.join('c:', 'Users', 'Pedro', 'Downloads', 'John', 'Pasta plataforma', 'src', 'pages', 'nexus_provas.html');

let content = fs.readFileSync(filePath, 'utf8');

const radarHtml = `            <div class="w-full flex flex-col">
                <div class="border border-[#0B193C] rounded-lg overflow-hidden shadow-sm">
                    <div class="bg-teal-600/10 text-[#0B193C] text-center py-2 border-b border-[#0B193C]">
                        <div class="font-bold uppercase tracking-widest text-[12px] mb-0.5">Radar TRI Sinapse</div>
                        <div class="text-[9px] font-normal tracking-wide text-slate-600">Transformamos os acertos do simulado em uma projeção estatística de nota ENEM.</div>
                    </div>
                    <div class="bg-white flex divide-x divide-slate-200">
                        <div class="flex-1 flex flex-col items-center py-3">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Linguagens</div>
                            <div class="text-[22px] font-black text-[#0B193C] leading-none mb-1" id="radar-tri-lin-nota">0.0</div>
                            <div class="text-[10px] font-bold text-[#0B193C] mb-3">Acertos: <span id="radar-tri-lin-acertos">0/45</span></div>
                            <div class="flex flex-col items-center text-[9px] text-slate-400 leading-tight">
                                <div>Mínima: <span id="radar-tri-lin-min">0.0</span></div>
                                <div>Média: <span class="font-bold text-slate-600" id="radar-tri-lin-med">0.0</span></div>
                                <div>Máxima: <span id="radar-tri-lin-max">0.0</span></div>
                            </div>
                        </div>
                        <div class="flex-1 flex flex-col items-center py-3">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Humanas</div>
                            <div class="text-[22px] font-black text-[#0B193C] leading-none mb-1" id="radar-tri-hum-nota">0.0</div>
                            <div class="text-[10px] font-bold text-[#0B193C] mb-3">Acertos: <span id="radar-tri-hum-acertos">0/45</span></div>
                            <div class="flex flex-col items-center text-[9px] text-slate-400 leading-tight">
                                <div>Mínima: <span id="radar-tri-hum-min">0.0</span></div>
                                <div>Média: <span class="font-bold text-slate-600" id="radar-tri-hum-med">0.0</span></div>
                                <div>Máxima: <span id="radar-tri-hum-max">0.0</span></div>
                            </div>
                        </div>
                        <div class="flex-1 flex flex-col items-center py-3">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Natureza</div>
                            <div class="text-[22px] font-black text-[#0B193C] leading-none mb-1" id="radar-tri-nat-nota">0.0</div>
                            <div class="text-[10px] font-bold text-[#0B193C] mb-3">Acertos: <span id="radar-tri-nat-acertos">0/45</span></div>
                            <div class="flex flex-col items-center text-[9px] text-slate-400 leading-tight">
                                <div>Mínima: <span id="radar-tri-nat-min">0.0</span></div>
                                <div>Média: <span class="font-bold text-slate-600" id="radar-tri-nat-med">0.0</span></div>
                                <div>Máxima: <span id="radar-tri-nat-max">0.0</span></div>
                            </div>
                        </div>
                        <div class="flex-1 flex flex-col items-center py-3">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Matemática</div>
                            <div class="text-[22px] font-black text-[#0B193C] leading-none mb-1" id="radar-tri-mat-nota">0.0</div>
                            <div class="text-[10px] font-bold text-[#0B193C] mb-3">Acertos: <span id="radar-tri-mat-acertos">0/45</span></div>
                            <div class="flex flex-col items-center text-[9px] text-slate-400 leading-tight">
                                <div>Mínima: <span id="radar-tri-mat-min">0.0</span></div>
                                <div>Média: <span class="font-bold text-slate-600" id="radar-tri-mat-med">0.0</span></div>
                                <div>Máxima: <span id="radar-tri-mat-max">0.0</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-50 border-t border-slate-200 py-1.5 px-4 text-center text-[8px] text-slate-500 italic">
                        * Esta é uma estimativa estatística baseada nos microdados do ENEM 2022. A nota oficial pode variar conforme a TRI, a dificuldade dos itens e a coerência pedagógica do padrão de respostas.
                    </div>
                </div>
            </div>`;

if (content.includes('<div class="bg-teal-600/10 text-[#0B193C] text-center py-2 border-b border-[#0B193C]">')) {
    console.log('Radar HTML is already in the file.');
} else {
    // Inject it!
    const target = `</div>\r
            </div>\r
            \r
        </div>\r
      </section>`;
      
    // I will use replace with regex for robust targeting
    const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
    if (regex.test(content)) {
        content = content.replace(regex, '</div>\n</div>\n' + radarHtml + '\n</div>\n</section>');
        console.log('Successfully injected Radar TRI HTML block.');
    } else {
        console.log('Could not find split point.');
    }
}

fs.writeFileSync(filePath, content, 'utf8');
