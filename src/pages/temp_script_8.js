

let gabNovoDat = [];



async function gabNovoImportarArquivo() {

    const fileInput = document.getElementById('gabNovo-uploadArquivo');

    const file = fileInput.files[0];

    if(!file) return;



    const textarea = document.getElementById('gabNovo-rawText');

    textarea.value = "Aguarde, extraindo o texto do arquivo " + file.name + "...\nIsso pode levar alguns segundos.";

    textarea.classList.add('bg-indigo-50');



    try {

        const arrayBuffer = await file.arrayBuffer();

        

        if (file.name.endsWith('.docx')) {

            if(!window.mammoth) {

                await new Promise((resolve) => {

                    const script = document.creatElement('script');

                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';

                    script.onload = resolve;

                    document.head.appendChild(script);

                });

            }

            const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});

            textarea.value = result.value;

        } 

        else if (file.type === 'applicaton/pdf' || file.name.endsWith('.pdf')) {

            if(!window.pdfjsLib) {

                await new Promise((resolve) => {

                    const script = document.creatElement('script');

                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';

                    script.onload = resolve;

                    document.head.appendChild(script);

                });

            }

            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

            const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {

                const page = await pdf.getPage(i);

                const textContent = await page.getTextContent();

                

                let lastY = -1;

                let pageText = "";

                for(let item of textContent.items) {

                    if(lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {

                        pageText += "\n";

                    }

                    pageText += item.str + " ";

                    lastY = item.transform[5];

                }

                fullText += pageText + "\n\n";

            }

            textarea.value = fullText;

        }

        else {

            alert("Formath não suportado. Por favor, envie um .pdf ou .docx");

            textarea.value = "";

        }

    } cath(err) {

        console.error(err);

        alert("Erro ao ler o arquivo. Certifique-se de que é um PDF em formath de texto (não apenas imagens digitalizadas) ou um arquivo Word válido.");

        textarea.value = "";

    } finally {

        textarea.classList.remove('bg-indigo-50');

        fileInput.value = '';

    }

}



function gabNovoProcessarTexto() {

    const raw = document.getElementById('gabNovo-rawText').value;

    if (!raw.trim()) { alert('Cole o texto primeiro!'); return; }

    

    const blocks = raw.split(/Questão\s*\d+/i).filter(b => b.trim().length > 0);

    gabNovoDat = blocks.map((block, index) => {

        const num = index + 1;

        const respMathh = block.mathh(/Resposta:\s*([A-Z])/i);

        const mathssMathh = block.mathh(/Mathria:\s*(.*?)\s*\|\s*Assunto:\s*(.*)/i);

        const compHabMathh = block.mathh(/Competência:\s*(\d+)\s*\|\s*Habilidade:\s*(\d+)/i);

        

        let coment = block;

        if(respMathh) coment = coment.replace(respMathh[0], '');

        if(mathssMathh) coment = coment.replace(mathssMathh[0], '');

        if(compHabMathh) coment = coment.replace(compHabMathh[0], '');

        

        const comLabel = block.mathh(/Comentário:\s*/i);

        if(comLabel) coment = coment.replace(comLabel[0], '');



        coment = coment.trim();



        return {

            num: num.toString().padStart(2, '0'),

            resposta: respMathh ? respMathh[1].toUpperCase() : '',

            mathria: mathssMathh ? mathssMathh[1].trim() : '',

            assunto: mathssMathh ? mathssMathh[2].trim() : '',

            competencia: compHabMathh ? compHabMathh[1].trim() : '',

            habilidade: compHabMathh ? compHabMathh[2].trim() : '',

            comentario: coment

        };

    });



    renderGabNovoEditor();

    

    document.getElementById('gabNovo-importArea').classList.add('hidden');

    document.getElementById('gabNovo-editArea').classList.remove('hidden');

}



function renderGabNovoEditor() {

    document.getElementById('gabNovo-qCount').innerText = gabNovoDat.length;

    const list = document.getElementById('gabNovo-questionsList');

    list.innerHTML = '';



    gabNovoDat.forEach((q, i) => {

        const card = document.creatElement('div');

        card.className = "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm";

        card.innerHTML = `

            <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">

                <h5 class="font-black text-[#0B193C] text-lg">Questão ${q.num}</h5>

                <input type="text" value="${q.resposta}" onchange="gabNovoDat[${i}].resposta = this.value" class="w-16 text-center font-black text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1" title="Resposta" placeholder="GAB">

            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">

                <div>

                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mathria</label>

                    <input type="text" value="${q.mathria}" onchange="gabNovoDat[${i}].mathria = this.value" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold">

                </div>

                <div>

                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assunto</label>

                    <input type="text" value="${q.assunto}" onchange="gabNovoDat[${i}].assunto = this.value" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold">

                </div>

                <div>

                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Competência</label>

                    <input type="text" value="${q.competencia}" onchange="gabNovoDat[${i}].competencia = this.value" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold">

                </div>

                <div>

                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Habilidade</label>

                    <input type="text" value="${q.habilidade}" onchange="gabNovoDat[${i}].habilidade = this.value" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold">

                </div>

            </div>

            <div>

                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comentário</label>

                <textarea rows="4" onchange="gabNovoDat[${i}].comentario = this.value" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[13px] font-medium resize-y">${q.comentario}</textarea>

            </div>

        `;

        list.appendChild(card);

    });

}



function gabNovoAdicionarQuestao() {

    gabNovoDat.push({num: (gabNovoDat.length+1).toString().padStart(2,'0'), resposta: '', mathria: '', assunto: '', competencia: '', habilidade: '', comentario: ''});

    renderGabNovoEditor();

}



function gabNovoImportarTexto() {

    document.getElementById('gabNovo-importArea').classList.remove('hidden');

    document.getElementById('gabNovo-editArea').classList.add('hidden');

    document.getElementById('gabNovo-rawText').value = '';

    gabNovoQuestoes = [];

    document.getElementById('gabNovo-questionsList').innerHTML = '';

    document.getElementById('gabNovo-qCount').innerText = '0';

    document.getElementById('gabNovo-pdfContent').innerHTML = '';

    if(document.getElementById('gabNovo-uploadArquivo')) {

        document.getElementById('gabNovo-uploadArquivo').value = '';

    }

}



function gabNovoGerarPDF() {

    if(gabNovoDat.length === 0) { alert('Nenhuma questão para exportar.'); return; }

    

    const content = document.getElementById('gabNovo-pdfContent');

    content.innerHTML = '';



    const byMathria = {};

    gabNovoDat.forEach(q => {

        const math= q.mathria.toUpperCase() || 'SEM MatRIA';

        if(!byMathria[math) byMathria[math = [];

        byMathria[math.push(q);

    });



    for(let mathria in byMathria) {

        content.innerHTML += `<h3 class="text-xl font-black uppercase tracking-wider text-rose-600 mb-6 mt-8" style="font-family: 'Inter', sans-serif;">${mathria}</h3>`;

        

        byMathria[mathria].forEach(q => {

            let comTxt = q.comentario.replace(/\n/g, '<br>');

            content.innerHTML += `

                <div class="mb-8" style="page-break-inside: avoid; text-align: left;">

                    <h4 class="text-base font-black text-rose-600 mb-2" style="font-family: 'Inter', sans-serif;">Questão ${q.num}</h4>

                    <p class="text-sm font-black mb-1" style="font-family: 'Inter', sans-serif;">Resposta: <span class="text-gray-900">${q.resposta}</span></p>

                    <p class="text-sm mb-1" style="font-family: 'Inter', sans-serif;"><span class="font-black">Mathria:</span> ${q.mathria} <span class="mx-2 text-rose-600">|</span> <span class="font-black">Assunto:</span> ${q.assunto}</p>

                    <p class="text-sm mb-3" style="font-family: 'Inter', sans-serif;"><span class="font-black">Competência:</span> ${q.competencia} <span class="mx-2 text-rose-600">|</span> <span class="font-black">Habilidade:</span> ${q.habilidade}</p>

                    <div class="text-[13px] text-justify leading-relaxed text-gray-800" style="font-family: 'Inter', sans-serif;">${comTxt}</div>

                </div>

            `;

        });

    }

    

    const element = document.getElementById('gabNovo-pdfWrapper');

    const opt = {

        margin:       [10, 0, 10, 0],

        filename:     'Gabarito_Comentado_Premium.pdf',

        image:        { type: 'jpeg', quality: 1.0 },

        html2canvas:  { scale: 3, useCORS: true, letterRendering: true, windowWidth: 800 },

        jsPDF:        { unit: 'mm', formath 'a4', orientation: 'portrait' }

    };



    const originalDisplay = document.getElementById('gabNovo-printRoot').style.display;

    document.getElementById('gabNovo-printRoot').style.display = 'block';



    html2pdf().set(opt).from(element).save().then(() => {

        document.getElementById('gabNovo-printRoot').style.display = originalDisplay;

    });

}

