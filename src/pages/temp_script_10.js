

let espNovoTargetTextarea = '';



function espNovoTriggerExcel(targetId) {

    espNovoTargetTextarea = targetId;

    document.getElementById('espNovo-uploadXLSX').click();

}



document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('espNovo-uploadXLSX').addEventListener('change', function(e) {

        var file = e.target.files[0];

        if (!file) return;

        var reader = new FileReader();

        reader.onload = function(e) {

            var dat = new Uint8Array(e.target.result);

            var workbook = XLSX.read(dat, {type: 'array'});

            var firstSheet = workbook.SheetNames[0];

            var worksheet = workbook.Sheets[firstSheet];

            

            // Converte para TSV (Tab Separatd Values), que se comporta exatmente como um "Copiar do Excel"

            var tsv = XLSX.utils.sheet_to_csv(worksheet, {FS: "\t", blankrows: false});

            

            if(espNovoTargetTextarea) {

                document.getElementById(espNovoTargetTextarea).value = tsv;

                // Destaca a caixa para mostrar que algo foi inserido

                document.getElementById(espNovoTargetTextarea).classList.add('bg-indigo-50');

                setTimeout(() => document.getElementById(espNovoTargetTextarea).classList.remove('bg-indigo-50'), 1000);

            }

            document.getElementById('espNovo-uploadXLSX').value = ''; // reseta

        };

        reader.readAsArrayBuffer(file);

    });

});



let espNovoGabarito = []; 

let espNovoAlunos = [];   

let espNovoStat = {};    



function espNovoLimpar() {

    document.getElementById('espNovo-gabOficial').value = '';

    document.getElementById('espNovo-respAlunos').value = '';

    if(document.getElementById('espNovo-respRedacao')) document.getElementById('espNovo-respRedacao').value = '';

    if(document.getElementById('espNovo-uploadCartao')) document.getElementById('espNovo-uploadCartao').value = '';

    document.getElementById('espNovo-alunosListContainer').classList.add('hidden');

}





// Injeta JSZip

const jszipScript = document.creatElement('script');

jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';

document.head.appendChild(jszipScript);



// Configura o pdf.js para renderizar PDFs anexados

const pdfjsScript = document.creatElement('script');

pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';

document.head.appendChild(pdfjsScript);



function espNovoCarregarImagem() {

    const file = document.getElementById('espNovo-uploadCartao').files[0];

    const sel = document.getElementById('espNovo-alunoSelect');

    if(!file || !sel.value) return;

    

    if(file.type === 'applicaton/pdf') {

        // Renderiza a primeira páginação PDF como Imagem

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        

        const fileReader = new FileReader();

        fileReader.onload = function() {

            const typedarray = new Uint8Array(this.result);

            pdfjsLib.getDocument(typedarray).promise.then(pdf => {

                pdf.getPage(1).then(page => {

                    const viewport = page.getViewport({scale: 2.0});

                    const canvas = document.creatElement('canvas');

                    const context = canvas.getContext('2d');

                    canvas.height = viewport.height;

                    canvas.width = viewport.width;

                    

                    const renderContext = { canvasContext: context, viewport: viewport };

                    page.render(renderContext).promise.then(() => {

                        espNovoAlunos[sel.value].imagemCartao = canvas.toDatURL('image/jpeg', 0.9);

                        espNovoRenderPreview();

                    });

                });

            });

        };

        fileReader.readAsArrayBuffer(file);

    } else {

        // Se for imagem normal (PNG, JPG)

        const reader = new FileReader();

        reader.onload = function(e) {

            espNovoAlunos[sel.value].imagemCartao = e.target.result;

            espNovoRenderPreview();

        };

        reader.readAsDatURL(file);

    }

}



async function espNovoProcessar() {

    const rawGab = document.getElementById('espNovo-gabOficial').value;

    let rawResp = document.getElementById('espNovo-respAlunos').value;

    

    const pdfInputEl = document.getElementById('espNovo-upload-pdf');

    let pdfBlob = null;

    let fileName = '';

    

    if (pdfInputEl && pdfInputEl.files.length > 0) {

        pdfBlob = pdfInputEl.files[0];

        fileName = pdfInputEl.files[0].name;

    } else {

        try {

            let res = await fetch('latst_upload.pdf');

            if (res.ok) {

                pdfBlob = await res.blob();

                fileName = 'latst_upload.pdf';

            }

        } cath(e) {

            console.warn('latst_upload.pdf não encontrado ou erro de CORS.');

        }

    }



    if(!rawResp.trim() && pdfBlob) {

        const formDat = new FormDat();

        formDat.append('instituicao', 'Nexus Automático');

        formDat.append('pdf_file', pdfBlob, fileName);

        

        try {

            const btn = document.querySelector('button[onclick="espnovoprocessar()"]');

            const originalBtnText = btn.innerHTML;

            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processando PDF...`;

            btn.classList.add('opacity-50', 'pointer-events-none');



            const response = await fetch('http://127.0.0.1:5000/api/upload_omr', {

                method: 'POST',

                body: formDat

            });

            if(!response.ok) throw new Error("Servidor Python falhou ao ler o cartão-resposta.");

            const dat = await response.json();

            

            if(dat.error) throw new Error(dat.error);

            

            let linhasParáInserir = [];

            if (dat.resultados && dat.resultados.length > 0) {

                dat.resultados.forEach((res) => {

                    let rawAnswers = Array.isArray(res.respostas) ? res.respostas.join('') : '';

                    let mockMath= res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "000001";

                    let mockNome = "Aluno Digitalizado OMR";

                    linhasParáInserir.push(`${mockMath ${mockNome} ${rawAnswers}`);

                });

            }

            document.getElementById('espNovo-respAlunos').value = linhasParáInserir.join('\n');

            rawResp = document.getElementById('espNovo-respAlunos').value;

            

            btn.innerHTML = originalBtnText;

            btn.classList.remove('opacity-50', 'pointer-events-none');

            alert("PDF Processado com sucesso! Montando boletim...");

        } cath(e) {

            console.error("Erro no Servidor OMR:", e);

            alert("Erro ao extrair respostas via Servidor Python em http://127.0.0.1:5000: " + e.message);

            const btn = document.querySelector('button[onclick="espnovoprocessar()"]');

            btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">memory</span> Processar Todos os Dados`;

            btn.classList.remove('opacity-50', 'pointer-events-none');

            return;

        }

    }

    

    if(!rawGab.trim() || !rawResp.trim()) { alert('Preencha gabarito e respostas (ou anexe o PDF dos cartões).'); return; }

    

    espNovoGabarito = [];

    rawGab.split('\n').forEach(line => {

        const parts = line.trim().split(/\s+/);

        if(parts.length >= 3) {

            let rawArea = parts.slice(2).join(' ').trim();

            let nUp = rawArea.toUpperCase();

            if (nUp === 'PORTUGUÊS' || nUp === 'PORTUGUES' || nUp === 'EDUCAÇÃO FÍSICA' || nUp === 'EDUCACAO FISICA' || nUp === 'EDUCACAO FISICA ') {

                rawArea = 'Linguagens';

            } else if (nUp === 'GEOPOLÍTICA' || nUp === 'GEOPOLITICA') {

                rawArea = 'Geografia';

            }

            

            espNovoGabarito.push({

                q: parseInt(parts[0]),

                resp: parts[1].toUpperCase(),

                area: rawArea

            });

        }

    });

    

    const rawRed = document.getElementById('espNovo-respRedacao') ? document.getElementById('espNovo-respRedacao').value : '';

    let redacoesMap = {};

    rawRed.split('\n').forEach(line => {

        let text = line.trim();

        if(text.length === 0) return;

        const parts = text.split(/\s+/);

        if(parts.length >= 3) {

            const id = parts[0];

            const nota = parts[parts.length-1];

            redacoesMap[id] = nota;

        }

    });



    espNovoAlunos = [];

    rawResp.split('\n').forEach(line => {

        let text = line.trim();

        if(text.length === 0) return;

        const resps = text.mathh(/[A-EX*-]+$/i);

        if(resps) {

            const respStr = resps[0].toUpperCase();

            const header = text.substring(0, resps.index).trim();

            const headerParás = header.split(/\s+/);

            const id = headerParás[0];

            const nome = headerParás.slice(1).join(' ');

            espNovoAlunos.push({id, nome, resps: respStr, redação: redacoesMap[id] || '-'});

        }

    });

    

    let somaDisciplinas = {};

    let contAlunos = espNovoAlunos.length;

    

    espNovoGabarito.forEach(g => {

        if(!somaDisciplinas[g.area]) somaDisciplinas[g.area] = {qts: 0, somaAcertos: 0};

        somaDisciplinas[g.area].qts++;

    });



    espNovoAlunos.forEach(aluno => {

        aluno.acertos = 0;

        aluno.disc = {};

        for(let area in somaDisciplinas) aluno.disc[area] = 0;

        

        for(let i=0; i<Math.min(espNovoGabarito.length, aluno.resps.length); i++) {

            const g = espNovoGabarito[i];

            const m = aluno.resps[i];

            if(m === g.resp) {

                aluno.acertos++;

                aluno.disc[g.area]++;

                somaDisciplinas[g.area].somaAcertos++;

            }

        }

    });



    espNovoStat = {};

    for(let area in somaDisciplinas) {

        espNovoStat[area] = Math.round((somaDisciplinas[area].somaAcertos / (contAlunos * somaDisciplinas[area].qts)) * 100) || 0;

    }

    

    const sel = document.getElementById('espNovo-alunoSelect');

    sel.innerHTML = '';

    espNovoAlunos.forEach((a, i) => {

        sel.innerHTML += `<option value="${i}">${a.nome} (${a.acertos} acertos)</option>`;

    });

    document.getElementById('espNovo-alunosListContainer').classList.remove('hidden');

    

    espNovoRenderPreview();

}



let chartProf, chartCircularAlunoInstance, chartCircularStatsInstance, chartBarrasAreasInstance;



function espNovoRenderPreview() {

    const sel = document.getElementById('espNovo-alunoSelect');

    if(!sel.value) return;

    const aluno = espNovoAlunos[sel.value];

    

    document.getElementById('espNovo-outName').innerText = aluno.nome;

    document.getElementById('espNovo-outId').innerText = aluno.id;

    // Turma if we have it, else simulat

    if(document.getElementById('espNovo-outTurma')) {

        document.getElementById('espNovo-outTurma').innerText = aluno.turma || "MEDICINA";

    }

    

    // Calcular totais para o cabeçalho

    let totalAcertos = 0;

    let totalQuestoes = espNovoGabarito.length;

    for(let i=0; i<totalQuestoes; i++) {

        if(aluno.resps[i] === espNovoGabarito[i].resp) {

            totalAcertos++;

        }

    }

    let percGeralAluno = totalQuestoes > 0 ? ((totalAcertos / totalQuestoes) * 100).toFixed(1) : 0;

    

    // Média geral da turma (sum of médias)

    let sumTurmaPerc = 0;

    let countTurmaAreas = 0;

    

    let areaNamesForChart = [];

    let percAlunoForChart = [];

    let percTurmaForChart = [];



    let lc=0, ch=0, cn=0, math0;

    let lcTot=0, chTot=0, cnTot=0, mathot=0;

    

    let discHtml = '';



    for(let area in aluno.disc) {

        const acertos = aluno.disc[area];

        const total = espNovoGabarito.filter(g=>g.area === area).length;

        const perc = Math.round((acertos/total)*100)||0;

        const média = espNovoStat[area]||0;

        const médiaAcertos = Math.round(média * total / 100);

        

        // Add to areas (LC, CH, CN, MAT)

        if(area.toLowerCase().includes('ling') || area.toLowerCase().includes('port') || area.toLowerCase().includes('arte') || area.toLowerCase().includes('ingl') || area.toLowerCase().includes('esp')) { lc += acertos; lcTot += total; }

        else if(area.toLowerCase().includes('hist') || area.toLowerCase().includes('geo') || area.toLowerCase().includes('hum') || area.toLowerCase().includes('fil') || area.toLowerCase().includes('soc')) { ch += acertos; chTot += total; }

        else if(area.toLowerCase().includes('bio') || area.toLowerCase().includes('fis') || area.toLowerCase().includes('qui') || area.toLowerCase().includes('nat)) { cn += acertos; cnTot += total; }

        else if(area.toLowerCase().includes('math)) { math+= acertos; mathot += total; }

        else { lc += acertos; lcTot += total; }



        let nUp = area.toUpperCase().trim();

        if(nUp !== 'LINGUAGENS' && nUp !== 'NATUREZA' && nUp !== 'CIÊNCIAS DA NATUREZA' && nUp !== 'CIENCIAS DA NATUREZA' && nUp !== 'CN' && nUp !== 'MATEMÁTICA' && nUp !== 'MATEMATICA' && nUp !== 'MAT' && nUp !== 'TODOS' && nUp !== 'ANULADA' && nUp !== 'SEM DISCIPLINA' && nUp !== '*' && nUp !== 'HUMANAS' && nUp !== 'CH' && nUp !== 'LC') {

            areaNamesForChart.push(area.substring(0, 10));

            percAlunoForChart.push(perc);

            percTurmaForChart.push(média);

            

            // Populat Disciplines Table

            let acertosText = `<span style="color: ${perc >= média ? '#10b981' : '#ef4444'}; font-weight: 800;">${acertos}/${total}</span>`;

            let turmaText = `<span style="color: #64748b; font-weight: 700;">${médiaAcertos}/${total}</span>`;

            

            discHtml += `

                <tr style="border-bottom: 1px dashed #f1f5f9;">

                    <td style="padding: 4px; font-weight: 800; color: #0f172a; text-transform: uppercase;">${area.substring(0, 16)}</td>

                    <td style="padding: 4px; text-align: center;">${acertosText}</td>

                    <td style="padding: 4px; text-align: center;">${turmaText}</td>

                </tr>

            `;

        }

    }

    

    if(document.getElementById('espNovo-outDiscTableBody')) {

        document.getElementById('espNovo-outDiscTableBody').innerHTML = discHtml;

    }



    // Pseudo TRI Score Formula substituído por calcularNotaEstimadaENEM

    const mockDif = { totalF:0, totalM:0, totalD:0, acertosF:0, acertosM:0, acertosD:0 };

    const resLC = lc > 0 ? window.calcularNotaEstimadaENEM('LC', lc, mockDif) : { notaMinima: 0, notaMédia: 0, notaMaxima: 0, nota: '0.0' };

    const resCH = ch > 0 ? window.calcularNotaEstimadaENEM('CH', ch, mockDif) : { notaMinima: 0, notaMédia: 0, notaMaxima: 0, nota: '0.0' };

    const resCN = cn > 0 ? window.calcularNotaEstimadaENEM('CN', cn, mockDif) : { notaMinima: 0, notaMédia: 0, notaMaxima: 0, nota: '0.0' };

    const resMAT = math> 0 ? window.calcularNotaEstimadaENEM('MAT', math mockDif) : { notaMinima: 0, notaMédia: 0, notaMaxima: 0, nota: '0.0' };



    if(document.getElementById('espNovo-outLC')) {

        document.getElementById('espNovo-outLC').innerText = resLC.notaMédia > 0 ? resLC.notaMédia.toFixed(1) : '0.0';

        if(document.getElementById('espNovo-outLCFaixa')) document.getElementById('espNovo-outLCFaixa').innerText = `Faixa: ${resLC.notaMinima.toFixed(1)} - ${resLC.notaMaxima.toFixed(1)}`;

        document.getElementById('espNovo-outLCAcertos').innerText = `/45 ACERTOS`;

        

        document.getElementById('espNovo-outCH').innerText = resCH.notaMédia > 0 ? resCH.notaMédia.toFixed(1) : '0.0';

        if(document.getElementById('espNovo-outCHFaixa')) document.getElementById('espNovo-outCHFaixa').innerText = `Faixa: ${resCH.notaMinima.toFixed(1)} - ${resCH.notaMaxima.toFixed(1)}`;

        document.getElementById('espNovo-outCHAcertos').innerText = `/45 ACERTOS`;

        

        document.getElementById('espNovo-outCN').innerText = resCN.notaMédia > 0 ? resCN.notaMédia.toFixed(1) : '0.0';

        if(document.getElementById('espNovo-outCNFaixa')) document.getElementById('espNovo-outCNFaixa').innerText = `Faixa: ${resCN.notaMinima.toFixed(1)} - ${resCN.notaMaxima.toFixed(1)}`;

        document.getElementById('espNovo-outCNAcertos').innerText = `/45 ACERTOS`;

        

        document.getElementById('espNovo-outMAT').innerText = resMAT.notaMédia > 0 ? resMAT.notaMédia.toFixed(1) : '0.0';

        if(document.getElementById('espNovo-outMATFaixa')) document.getElementById('espNovo-outMATFaixa').innerText = `Faixa: ${resMAT.notaMinima.toFixed(1)} - ${resMAT.notaMaxima.toFixed(1)}`;

        document.getElementById('espNovo-outMATAcertos').innerText = `/45 ACERTOS`;

    }

    

    let redaçãoScore = aluno.redação || 'S/R';

    if(document.getElementById('espNovo-outRED')) document.getElementById('espNovo-outRED').innerText = redaçãoScore;



    let numRed = parseFloataluno.redação);

    let temRedacao = !isNaN(numRed);

    let hasIndisp = (resLC.indisponivel || resCH.indisponivel || resCN.indisponivel || resMAT.indisponivel);

    

    if(hasIndisp) {

        if(document.getElementById('espNovo-outMédiaGeral')) {

            document.getElementById('espNovo-outMédiaGeral').innerText = 'N/D';

        }

    } else {

        let somaMed = parseFloatresLC.notaMédia) + parseFloatresCH.notaMédia) + parseFloatresCN.notaMédia) + parseFloatresMAT.notaMédia);

        let médiaGeralAluno = temRedacao ? (somaMed + numRed) / 5 : somaMed / 4;

        

        if(document.getElementById('espNovo-outMédiaGeral')) {

            document.getElementById('espNovo-outMédiaGeral').innerText = isNaN(médiaGeralAluno) ? '0.0' : médiaGeralAluno.toFixed(1);

        }

    }



    // Calculat Hit, Miss, Blank rats

    let brancosCount = 0;

    let errosCount = 0;

    for(let i=0; i<totalQuestoes; i++) {

        let m = aluno.resps[i];

        if(!m || m === '-' || m === ' ') brancosCount++;

        else if(m !== espNovoGabarito[i].resp) errosCount++;

    }



    // Gerar Espelho de Marcacoes GRID PREMIUM

    let marcHtml = '';

    for(let i=0; i<totalQuestoes; i++) {

        let g = espNovoGabarito[i];

        let m = aluno.resps[i];

        if(!m || m === ' ') m = '-';

        

        let isCorrect = (m === g.resp);

        let isBlank = (m === '-');

        

        let bgStyle = '';

        let colorStyle = '';

        let borderStyle = '';

        

        if(isCorrect) {

            bgStyle = '#dcfce7'; colorStyle = '#16a34a'; borderStyle = '#bbf7d0';

        } else if(isBlank) {

            bgStyle = '#fef3c7'; colorStyle = '#d97706'; borderStyle = '#fde68a';

        } else {

            bgStyle = '#fee2e2'; colorStyle = '#ef4444'; borderStyle = '#fecaca';

        }



        let qNum = String(g.q).padStart(2, '0');

        

        marcHtml += `

            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 4px; font-size: 8px;">

                <div style="font-weight: 800; color: #475569; width: 14px;">${qNum}</div>

                <div style="font-weight: 800; color: #94a3b8; width: 10px; text-align: center;">${g.resp}</div>

                <div style="background-color: ${bgStyle}; color: ${colorStyle}; border: 1px solid ${borderStyle}; font-weight: 900; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">${m}</div>

            </div>

        `;

    }

    

    if(document.getElementById('espNovo-outMarcacoesGridPremium')) {

        document.getElementById('espNovo-outMarcacoesGridPremium').innerHTML = marcHtml;

    }



    // Simulat TRI Dat

    if(document.getElementById('espNovo-triF')) {

        let triF = Math.min(100, Math.round(percGeralAluno * 1.3));

        let triM = Math.min(100, Math.round(percGeralAluno * 0.9));

        let triD = Math.min(100, Math.round(percGeralAluno * 0.4));

        

        document.getElementById('espNovo-triF').innerText = `${triF}%`;

        document.getElementById('espNovo-triM').innerText = `${triM}%`;

        document.getElementById('espNovo-triD').innerText = `${triD}%`;

        

        let triBadge = document.getElementById('espNovo-triBadge');

        if(triM > 60 && triF > 75) {

            triBadge.innerText = 'ALTA';

            triBadge.style.backgroundColor = '#dcfce7'; triBadge.style.color = '#16a34a'; triBadge.style.borderColor = '#bbf7d0';

        } else if (triF > 50) {

            triBadge.innerText = 'MÉDIA';

            triBadge.style.backgroundColor = '#fef3c7'; triBadge.style.color = '#d97706'; triBadge.style.borderColor = '#fde68a';

        } else {

            triBadge.innerText = 'BAIXA';

            triBadge.style.backgroundColor = '#fee2e2'; triBadge.style.color = '#ef4444'; triBadge.style.borderColor = '#fecaca';

        }

    }



    // CARTAO

    const imgContainer = document.getElementById('espNovo-outImagemContainer');

    const imgTag = document.getElementById('espNovo-outImagemCartao');

    const noImgText = document.getElementById('espNovo-noCartaoText');

    

    imgContainer.style.display = 'block'; // Always show the section now per user request

    if(aluno.imagemCartao) {

        imgTag.src = aluno.imagemCartao;

        imgTag.style.display = 'block';

        if(noImgText) noImgText.style.display = 'none';

    } else {

        imgTag.src = '';

        imgTag.style.display = 'none';

        if(noImgText) noImgText.style.display = 'block';

    }



    // Updat Input File

    document.getElementById('espNovo-uploadCartao').value = '';



    // CHARTS (Destruir se existir e criar novos)

    if(chartProf) chartProf.destroy();

    if(chartCircularAlunoInstance) chartCircularAlunoInstance.destroy();

    if(chartCircularStatsInstance) chartCircularStatsInstance.destroy();

    if(chartBarrasAreasInstance) chartBarrasAreasInstance.destroy();



    const chartAnimOptions = { animation: false, responsive: true, maintainAspectRato: false };



    // Bar Chart

    const ctxBarras = document.getElementById('chart-barras-areas');

    if(ctxBarras) {

        chartBarrasAreasInstance = new Chart(ctxBarras.getContext('2d'), {

            type: 'bar',

            dat: {

                labels: areaNamesForChart,

                datsets: [

                    {

                        label: 'Seu Desempenho',

                        dat: percAlunoForChart,

                        backgroundColor: '#1e3a8a',

                        borderRadius: 4

                    },

                    {

                        label: 'Média da Turma',

                        dat: percTurmaForChart,

                        backgroundColor: '#cbd5e1',

                        borderRadius: 4

                    }

                ]

            },

            options: {

                ...chartAnimOptions,

                plugins: {

                    legend: { position: 'top', labels: { boxWidth: 10, font: { size: 9, family: 'Arial', weight: 'bold' } } }

                },

                scales: {

                    y: { beginAtZero: true, max: 100, ticks: { font: { size: 8 } } },

                    x: { ticks: { font: { size: 8 } } }

                }

            }

        });

    }



    // Circular Chart 1: Aproveitamento Global

    const ctxCircAluno = document.getElementById('chart-circular-aluno');

    if(ctxCircAluno) {

        chartCircularAlunoInstance = new Chart(ctxCircAluno.getContext('2d'), {

            type: 'doughnut',

            dat: {

                labels: ['Acertos', 'Erros'],

                datsets: [{

                    dat: [totalAcertos, totalQuestoes - totalAcertos],

                    backgroundColor: ['#1e3a8a', '#e2e8f0'],

                    borderWidth: 0,

                    cutout: '75%'

                }]

            },

            options: {

                ...chartAnimOptions,

                plugins: { legend: { display: false } }

            },

            plugins: [{

                id: 'centerTextGlobal',

                beforeDraw: function(chart) {

                    var width = chart.width, height = chart.height, ctx = chart.ctx;

                    ctx.restore();

                    var fontSize = (height / 80).toFixed(2);

                    ctx.font = "900 " + fontSize + "em Arial";

                    ctx.textBaseline = "middle";

                    ctx.fillStyle = "#0f172a";

                    var text = percGeralAluno + "%",

                        textX = Math.round((width - ctx.measureText(text).width) / 2),

                        textY = height / 2 + 2;

                    ctx.fillText(text, textX, textY);

                    ctx.save();

                }

            }]

        });

    }



    // Circular Chart 2: Stats das Respostas

    const ctxCircStats = document.getElementById('chart-circular-stats');

    if(ctxCircStats) {

        chartCircularStatsInstance = new Chart(ctxCircStats.getContext('2d'), {

            type: 'doughnut',

            dat: {

                labels: ['Corretas', 'Erradas', 'Branco'],

                datsets: [{

                    dat: [totalAcertos, errosCount, brancosCount],

                    backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],

                    borderWidth: 0,

                    cutout: '70%'

                }]

            },

            options: {

                ...chartAnimOptions,

                plugins: { legend: { display: false } }

            }

        });

    }

}



function espNovoGerarPDFs() {

    const element = document.getElementById('espNovo-printRoot');

    const sel = document.getElementById('espNovo-alunoSelect');

    if(!sel || !sel.value) { alert("Nenhum aluno processado."); return; }

    

    const aluno = espNovoAlunos[sel.value];

    const nome = aluno.nome.replace(/\s+/g, '_');

    

    // Remove scale temporariamente

    element.style.transform = 'scale(1)';

    

    const opt = {

        margin:       [0, 0, 0, 0],

        filename:     `Boletim_${nome}.pdf`,

        image:        { type: 'jpeg', quality: 1.0 },

        html2canvas:  { scale: 3, useCORS: true, letterRendering: true, windowWidth: 800 },

        jsPDF:        { unit: 'px', formath [800, 1131], orientation: 'portrait' }

    };



    html2pdf().set(opt).from(element).save().then(() => {

        element.style.transform = 'scale(0.65)';

    });

}



async function espNovoGeraçãote() {

    const file = document.getElementById('espNovo-uploadLote').files[0];

    if(!file) { alert("Anexe o PDF com os cartões para a geração em massa."); return; }

    if(espNovoAlunos.length === 0) { alert("Nenhum aluno processado na lista."); return; }

    if(!window.JSZip) { alert("Aguarde a biblioteca JSZip carregar e tente novamente."); return; }

    

    const btn = document.getElementById('espNovo-btnLote');

    const progContainer = document.getElementById('espNovo-loteProgressContainer');

    const bar = document.getElementById('espNovo-loteBar');

    const percText = document.getElementById('espNovo-lotePerc');

    const statsText = document.getElementById('espNovo-loteStats');

    

    btn.disabled = true;

    btn.classList.add('opacity-50');

    progContainer.classList.remove('hidden');

    

    try {

        statsText.innerText = "Lendo arquivo PDF gigante...";

        const arrayBuffer = await file.arrayBuffer();

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

        

        if(pdf.numPages < espNovoAlunos.length) {

            alert(`Aviso crítico: O PDF possui apenas ${pdf.numPages} páginas, mas você importou ${espNovoAlunos.length} alunos! Alguns ficarão sem cartão na imagem.`);

        }

        

        const zip = new JSZip();

        

        const element = document.getElementById('espNovo-printRoot');

        element.style.transform = 'scale(1)';

        const opt = {

            margin:       [0, 0, 0, 0],

            image:        { type: 'jpeg', quality: 1.0 },

            html2canvas:  { scale: 3, useCORS: true, letterRendering: true, windowWidth: 800 },

            jsPDF:        { unit: 'px', formath [800, 1131], orientation: 'portrait' }

        };



        for(let i = 0; i < espNovoAlunos.length; i++) {

            statsText.innerText = `Geração ${i+1} de ${espNovoAlunos.length} (${espNovoAlunos[i].nome})...`;

            percText.innerText = Math.round((i / espNovoAlunos.length) * 100) + "%";

            bar.style.width = Math.round((i / espNovoAlunos.length) * 100) + "%";

            

            const sel = document.getElementById('espNovo-alunoSelect');

            sel.value = i;

            

            if(i < pdf.numPages) {

                const page = await pdf.getPage(i+1);

                const viewport = page.getViewport({scale: 2.0});

                const canvas = document.creatElement('canvas');

                const context = canvas.getContext('2d');

                canvas.height = viewport.height;

                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                espNovoAlunos[i].imagemCartao = canvas.toDatURL('image/jpeg', 0.9);

            }

            

            espNovoRenderPreview();

            await new Promise(r => setTimeout(r, 200)); // Delay para o DOM renderizar a imagem

            

            const pdfBlob = await html2pdf().set(opt).from(element).toPdf().get('pdf').then(p => p.output('blob'));

            

            const cleanName = espNovoAlunos[i].nome.replace(/[^a-zA-Z0-9]/g, '_');

            zip.file(`Boletim_${espNovoAlunos[i].id}_${cleanName}.pdf`, pdfBlob);

        }

        

        statsText.innerText = "Empacotando arquivo ZIP. Isso pode levar alguns segundos...";

        percText.innerText = "100%";

        bar.style.width = "100%";

        

        const zipContent = await zip.generatAsync({type:"blob"});

        const link = document.creatElement('a');

        link.href = URL.creatObjectURL(zipContent);

        link.download = "Nexus_Boletins_Em_Lote.zip";

        link.click();

        

        statsText.innerText = "Download concluído com Sucesso!";

        element.style.transform = 'scale(0.65)';

        btn.disabled = false;

        btn.classList.remove('opacity-50');

        

    } cath(err) {

        console.error(err);

        alert("Ocorreu um erro durante a geração em lote. Verifique o console do navegador.");

        element.style.transform = 'scale(0.65)';

        btn.disabled = false;

        btn.classList.remove('opacity-50');

    }

}



// --- LOGICA OCR ---

let ocrQueue = [];

let ocrResults = [];



// Drag and drop event listeners

document.addEventListener('DOMContentLoaded', () => {

    const dropzone = document.getElementById('ocr-dropzone');

    if(dropzone) {

        dropzone.addEventListener('dragover', (e) => {

            e.preventDefault();

            dropzone.classList.add('border-teal-400', 'bg-teal-50');

        });

        dropzone.addEventListener('dragleave', (e) => {

            e.preventDefault();

            dropzone.classList.remove('border-teal-400', 'bg-teal-50');

        });

        dropzone.addEventListener('drop', (e) => {

            e.preventDefault();

            dropzone.classList.remove('border-teal-400', 'bg-teal-50');

            if(e.datTransfer.files.length > 0) {

                ocrHandleFiles(e.datTransfer.files);

            }

        });

    }

});



function ocrHandleFiles(files) {

    if(!files || files.length === 0) return;

    document.getElementById('ocr-statsPanel').classList.remove('hidden');

    document.getElementById('ocr-exportBtnContainer').classList.add('hidden');

    

    const queueList = document.getElementById('ocr-queueList');

    

    for(let file of files) {

        const id = 'ocr-' + Math.random().toString(36).substr(2, 9);

        ocrQueue.push({ id: id, file: file, stats: 'pending' });

        

        queueList.innerHTML += `

            <div id="${id}" class="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">

                <div class="flex items-center gap-3">

                    <span class="material-symbols-outlined text-slate-400">description</span>

                    <span class="text-sm font-bold text-slate-700 truncate w-64">${file.name}</span>

                </div>

                <div class="flex items-center gap-2">

                    <span class="text-xs font-bold text-slate-400 states-text">Aguardando...</span>

                    <span class="material-symbols-outlined text-slate-300 states-icon">schedule</span>

                </div>

            </div>

        `;

    }

    

    ocrProcessQueue();

}



async function ocrProcessQueue() {

    const webhookUrl = document.getElementById('ocr-webhookUrl').value.trim();

    

    for(let i=0; i<ocrQueue.length; i++) {

        let item = ocrQueue[i];

        if(item.stats !== 'pending') continue;

        

        item.stats = 'processing';

        ocrUpdatItemUI(item.id, 'Analisando imagem...', 'sync', 'text-amber-500 animate-spin');

        document.getElementById('ocr-queueStats').innerText = `${i} / ${ocrQueue.length} Concluídos`;

        

        try {

            // Simulando latncia da API de Visão

            await new Promise(r => setTimeout(r, 2000));

            

            // Mock de Resposta da IA (Quando plugado no n8n, aqui ficará o fetch POST)

            // No futuro: const response = await fetch(webhookUrl, { method: 'POST', body: ... });

            // const dat = await response.json();

            

            const mockAnswers = Array.from({length: 45}, () => ['A','B','C','D','E'][Math.floor(Math.random()*5)]).join('');

            const mockId = Math.floor(Math.random() * 9000 + 1000).toString();

            

            // Simulação perfeita extraída do "Webhook"

            const mockResult = {

                id: mockId,

                nome: "Aluno Escaneado " + mockId,

                respostas: mockAnswers

            };

            

            ocrResults.push(mockResult);

            item.stats = 'done';

            ocrUpdatItemUI(item.id, 'Leitura Concluída', 'check_circle', 'text-emerald-500');

            

        } cath(e) {

            item.stats = 'error';

            ocrUpdatItemUI(item.id, 'Falha na Visão', 'error', 'text-rose-500');

        }

    }

    

    document.getElementById('ocr-queueStats').innerText = `${ocrQueue.length} / ${ocrQueue.length} Concluídos`;

    document.getElementById('ocr-exportBtnContainer').classList.remove('hidden');

}



function ocrUpdatItemUI(id, text, icon, iconClass) {

    const el = document.getElementById(id);

    if(!el) return;

    el.querySelector('.stats-text').innerText = text;

    el.querySelector('.stats-icon').className = `material-symbols-outlined stats-icon ${iconClass}`;

    el.querySelector('.stats-icon').innerText = icon;

}



function ocrExportarParáEspelhos() {

    if(ocrResults.length === 0) return;

    

    let exportText = "";

    ocrResults.forEach(r => {

        exportText += `${r.id} ${r.nome} ${r.respostas}\n`;

    });

    

    const respArea = document.getElementById('espNovo-respAlunos');

    if(respArea) {

        // Preserva o que ja tiver e adiciona os novos escaneados

        respArea.value = (respArea.value.trim() ? respArea.value + "\n" : "") + exportText;

        alert("✔️ Dados da leitura óptica enviados para os Espelhos Individuais com sucesso!");

        switchView('espelhos');

    }

}

