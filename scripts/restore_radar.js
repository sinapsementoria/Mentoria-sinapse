const fs = require('fs');
const path = require('path');
const filePath = path.join('c:', 'Users', 'Pedro', 'Downloads', 'John', 'Pasta plataforma', 'src', 'pages', 'nexus_provas.html');

let content = fs.readFileSync(filePath, 'utf8');

// The block to insert:
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

// Check if already contains Radar TRI
if (content.includes('Radar TRI Sinapse')) {
    console.log('Radar TRI Sinapse is already in the file.');
} else {
    // Insert radarHtml right after line 897 (the </div> corresponding to the comparative chart)
    const splitPoint = '</div>\r\n            </div>\r\n            \r\n        </div>\r\n      </section>';
    const splitPoint2 = '</div>\n            </div>\n            \n        </div>\n      </section>';
    const splitPoint3 = '</div>\n            </div>\n        </div>\n      </section>';
    const splitPoint4 = '</div>\r\n            </div>\r\n        </div>\r\n      </section>';
    
    let injected = false;
    
    if (content.includes(splitPoint)) {
        content = content.replace(splitPoint, '</div>\n            </div>\n' + radarHtml + '\n        </div>\n      </section>');
        injected = true;
    } else if (content.includes(splitPoint2)) {
        content = content.replace(splitPoint2, '</div>\n            </div>\n' + radarHtml + '\n        </div>\n      </section>');
        injected = true;
    } else if (content.includes(splitPoint3)) {
        content = content.replace(splitPoint3, '</div>\n            </div>\n' + radarHtml + '\n        </div>\n      </section>');
        injected = true;
    } else if (content.includes(splitPoint4)) {
        content = content.replace(splitPoint4, '</div>\n            </div>\n' + radarHtml + '\n        </div>\n      </section>');
        injected = true;
    }

    if (!injected) {
         // Fallback replacement using regex for flexibility
         const targetRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
         if (targetRegex.test(content)) {
            content = content.replace(targetRegex, '</div>\n</div>\n' + radarHtml + '\n</div>\n</section>');
            injected = true;
         }
    }

    if (injected) {
        console.log('Successfully added the Radar TRI Sinapse block.');
    } else {
        console.log('Could not find the target string to inject Radar TRI.');
    }
}

// Now let's adjust heights to ensure everything fits on ONE page.
// 1. change `boletim-a4-inner px-10 pt-8 pb-4` to `px-8 pt-6 pb-2` for first page only?
// Wait, `boletim-a4-inner` is on all pages. Let's adjust all:
content = content.replace(/px-10 pt-8 pb-4/g, 'px-8 pt-6 pb-4');

// 2. Change gaps:
// grid-cols-2 gap-4 mb-4 => gap-3 mb-2
content = content.replace(/grid grid-cols-2 gap-4 mb-4/g, 'grid grid-cols-2 gap-3 mb-3');
// Redacao Bar: pl-16 pr-6 py-3 mt-4 => pl-16 pr-6 py-2 mt-3
content = content.replace(/pl-16 pr-6 py-3 mt-4/g, 'pl-16 pr-6 py-2 mt-3');
// Pontuacao Obtida gap: w-full flex flex-col gap-4 => gap-3
content = content.replace(/w-full flex flex-col gap-4/g, 'w-full flex flex-col gap-3');

// 3. Header spacing: mb-6 pb-4 => mb-4 pb-3
content = content.replace(/justify-between w-full mb-6 border-b border-slate-200 pb-4/g, 'justify-between w-full mb-4 border-b border-slate-200 pb-3');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Adjusted margins and layout sizes.');
