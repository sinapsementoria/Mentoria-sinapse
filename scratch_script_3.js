
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
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            var firstSheet = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheet];
            
            // Converte para TSV (Tab Separated Values), que se comporta exatamente como um "Copiar do Excel"
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
let espNovoStats = {};    

function espNovoLimpar() {
    document.getElementById('espNovo-gabOficial').value = '';
    document.getElementById('espNovo-respAlunos').value = '';
    if(document.getElementById('espNovo-respRedacao')) document.getElementById('espNovo-respRedacao').value = '';
    if(document.getElementById('espNovo-uploadCartao')) document.getElementById('espNovo-uploadCartao').value = '';
    document.getElementById('espNovo-alunosListContainer').classList.add('hidden');
}


// Injeta JSZip
const jszipScript = document.createElement('script');
jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
document.head.appendChild(jszipScript);

// Configura o pdf.js para renderizar PDFs anexados
const pdfjsScript = document.createElement('script');
pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
document.head.appendChild(pdfjsScript);

function espNovoCarregarImagem() {
    const file = document.getElementById('espNovo-uploadCartao').files[0];
    const sel = document.getElementById('espNovo-alunoSelect');
    if(!file || !sel.value) return;
    
    if(file.type === 'application/pdf') {
        // Renderiza a primeira página do PDF como Imagem
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                pdf.getPage(1).then(page => {
                    const viewport = page.getViewport({scale: 2.0});
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    
                    const renderContext = { canvasContext: context, viewport: viewport };
                    page.render(renderContext).promise.then(() => {
                        espNovoAlunos[sel.value].imagemCartao = canvas.toDataURL('image/jpeg', 0.9);
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
        reader.readAsDataURL(file);
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
            let res = await fetch('latest_upload.pdf');
            if (res.ok) {
                pdfBlob = await res.blob();
                fileName = 'latest_upload.pdf';
            }
        
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
            console.warn('latest_upload.pdf não encontrado ou erro de CORS.');
        }
    }

    if(!rawResp.trim() && pdfBlob) {
        const formData = new FormData();
        formData.append('instituicao', 'Nexus Automático');
        formData.append('pdf_file', pdfBlob, fileName);
        
        try {
            const btn = document.querySelector('button[onclick="espNovoProcessar()"]');
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Processando PDF...`;
            btn.classList.add('opacity-50', 'pointer-events-none');

            const response = await fetch('http://127.0.0.1:5000/api/upload_omr', {
                method: 'POST',
                body: formData
            });
            if(!response.ok) throw new Error("Servidor Python falhou ao ler o cartão-resposta.");
            const data = await response.json();
            
            if(data.error) throw new Error(data.error);
            
            let linhasParaInserir = [];
            if (data.resultados && data.resultados.length > 0) {
                data.resultados.forEach((res) => {
                    let rawAnswers = Array.isArray(res.respostas) ? res.respostas.join('') : '';
                    let mockMat = res.qr_code_detected && res.qr_code_detected !== 'QR_CODE_NAO_ENCONTRADO' ? res.qr_code_detected : "000001";
                    let mockNome = "Aluno Digitalizado OMR";
                    linhasParaInserir.push(`${mockMat} ${mockNome} ${rawAnswers}`);
                });
            }
            document.getElementById('espNovo-respAlunos').value = linhasParaInserir.join('\n');
            rawResp = document.getElementById('espNovo-respAlunos').value;
            
            btn.innerHTML = originalBtnText;
            btn.classList.remove('opacity-50', 'pointer-events-none');
            alert("PDF Processado com sucesso! Montando boletim...");
        
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
            console.error("Erro no Servidor OMR:", e);
            alert("Erro ao extrair respostas via Servidor Python em http://127.0.0.1:5000: " + e.message);
            const btn = document.querySelector('button[onclick="espNovoProcessar()"]');
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
        const resps = text.match(/[A-EX*-]+$/i);
        if(resps) {
            const respStr = resps[0].toUpperCase();
            const header = text.substring(0, resps.index).trim();
            const headerParts = header.split(/\s+/);
            const id = headerParts[0];
            const nome = headerParts.slice(1).join(' ');
            espNovoAlunos.push({id, nome, resps: respStr, redacao: redacoesMap[id] || '-'});
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
            let isAnulada = (g.resp === 'X' || g.resp === '*' || g.resp === 'ANULADA' || g.resp === 'NULA');
            if(m === g.resp || isAnulada) {
                aluno.acertos++;
                aluno.disc[g.area]++;
                somaDisciplinas[g.area].somaAcertos++;
            }
        }
    });

    espNovoStats = {};
    for(let area in somaDisciplinas) {
        espNovoStats[area] = Math.round((somaDisciplinas[area].somaAcertos / (contAlunos * somaDisciplinas[area].qts)) * 100) || 0;
    }
    
    const sel = document.getElementById('espNovo-alunoSelect');
    sel.innerHTML = '';
    espNovoAlunos.forEach((a, i) => {
        sel.innerHTML += `<option value="${i}">${a.nome} (${a.acertos} acertos)</option>`;
    });
    document.getElementById('espNovo-alunosListContainer').classList.remove('hidden');
    
    espNovoRenderPreview();
}

let chartProf, chartCircularAlunoInstance, chartCircularStatusInstance, chartBarrasAreasInstance;

function espNovoRenderPreview() {
    const sel = document.getElementById('espNovo-alunoSelect');
    if(!sel.value) return;
    const aluno = espNovoAlunos[sel.value];
    
    document.querySelectorAll('#espNovo-outName').forEach(el => el.innerText = aluno.nome);
    document.querySelectorAll('#espNovo-outId').forEach(el => el.innerText = aluno.id);
    // Turma if we have it, else simulate
    if(document.getElementById('espNovo-outTurma')) {
        document.querySelectorAll('#espNovo-outTurma').forEach(el => el.innerText = aluno.turma || "MEDICINA");
    }
    
    // Calcular totais para o cabeçalho
    let totalAcertos = 0;
    let totalQuestoes = espNovoGabarito.length;
    for(let i=0; i<totalQuestoes; i++) {
        let isAnulada = (espNovoGabarito[i].resp === 'X' || espNovoGabarito[i].resp === '*' || espNovoGabarito[i].resp === 'ANULADA' || espNovoGabarito[i].resp === 'NULA');
        if(aluno.resps[i] === espNovoGabarito[i].resp || isAnulada) {
            totalAcertos++;
        }
    }
    let percGeralAluno = totalQuestoes > 0 ? ((totalAcertos / totalQuestoes) * 100).toFixed(1) : 0;
    
    // Média geral da turma (sum of medias)
    let sumTurmaPerc = 0;
    let countTurmaAreas = 0;
    
    let areaNamesForChart = [];
    let percAlunoForChart = [];
    let percTurmaForChart = [];

    let lc=0, ch=0, cn=0, mat=0;
    let lcTot=0, chTot=0, cnTot=0, matTot=0;
    
    let discHtml = '';

    for(let area in aluno.disc) {
        const acertos = aluno.disc[area];
        const total = espNovoGabarito.filter(g=>g.area === area).length;
        const perc = Math.round((acertos/total)*100)||0;
        const media = espNovoStats[area]||0;
        const mediaAcertos = Math.round(media * total / 100);
        
        // Add to areas (LC, CH, CN, MAT)
        if(area.toLowerCase().includes('ling') || area.toLowerCase().includes('port') || area.toLowerCase().includes('arte') || area.toLowerCase().includes('ingl') || area.toLowerCase().includes('esp')) { lc += acertos; lcTot += total; }
        else if(area.toLowerCase().includes('hist') || area.toLowerCase().includes('geo') || area.toLowerCase().includes('hum') || area.toLowerCase().includes('fil') || area.toLowerCase().includes('soc')) { ch += acertos; chTot += total; }
        else if(area.toLowerCase().includes('bio') || area.toLowerCase().includes('fis') || area.toLowerCase().includes('qui') || area.toLowerCase().includes('nat')) { cn += acertos; cnTot += total; }
        else if(area.toLowerCase().includes('mat')) { mat += acertos; matTot += total; }
        else { lc += acertos; lcTot += total; }

        let nUp = area.toUpperCase().trim();
        if(nUp !== 'LINGUAGENS' && nUp !== 'NATUREZA' && nUp !== 'CIÊNCIAS DA NATUREZA' && nUp !== 'CIENCIAS DA NATUREZA' && nUp !== 'CN' && nUp !== 'MATEMÁTICA' && nUp !== 'MATEMATICA' && nUp !== 'MAT' && nUp !== 'TODOS' && nUp !== 'ANULADA' && nUp !== 'SEM DISCIPLINA' && nUp !== '*' && nUp !== 'HUMANAS' && nUp !== 'CH' && nUp !== 'LC') {
            areaNamesForChart.push(area.substring(0, 10));
            percAlunoForChart.push(perc);
            percTurmaForChart.push(media);
            
            // Populate Disciplines Table
            let acertosText = `<span style="color: ${perc >= media ? '#10b981' : '#ef4444'}; font-weight: 800;">${acertos}/${total}</span>`;
            let turmaText = `<span style="color: #64748b; font-weight: 700;">${mediaAcertos}/${total}</span>`;
            
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
        document.querySelectorAll('#espNovo-outDiscTableBody').forEach(el => el.innerHTML = discHtml);
    }

    // Pseudo TRI Score Formula substituído por calcularNotaEstimadaENEM
    const mockDif = { totalF:0, totalM:0, totalD:0, acertosF:0, acertosM:0, acertosD:0 };
    const resLC = lc > 0 ? window.calcularNotaEstimadaENEM('LC', lc, mockDif) : { notaMinima: 0, notaMedia: 0, notaMaxima: 0, nota: '0.0' };
    const resCH = ch > 0 ? window.calcularNotaEstimadaENEM('CH', ch, mockDif) : { notaMinima: 0, notaMedia: 0, notaMaxima: 0, nota: '0.0' };
    const resCN = cn > 0 ? window.calcularNotaEstimadaENEM('CN', cn, mockDif) : { notaMinima: 0, notaMedia: 0, notaMaxima: 0, nota: '0.0' };
    const resMAT = mat > 0 ? window.calcularNotaEstimadaENEM('MAT', mat, mockDif) : { notaMinima: 0, notaMedia: 0, notaMaxima: 0, nota: '0.0' };

    if(document.getElementById('espNovo-outLC')) {
        document.querySelectorAll('#espNovo-outLC').forEach(el => el.innerText = resLC.notaMedia > 0 ? resLC.notaMedia.toFixed(1) : '0.0');
        if(document.getElementById('espNovo-outLCFaixa')) document.querySelectorAll('#espNovo-outLCFaixa').forEach(el => el.innerText = `Faixa: ${resLC.notaMinima.toFixed(1)} - ${resLC.notaMaxima.toFixed(1)}`);
        document.querySelectorAll('#espNovo-outLCAcertos').forEach(el => el.innerText = `/45 ACERTOS`);
        
        document.querySelectorAll('#espNovo-outCH').forEach(el => el.innerText = resCH.notaMedia > 0 ? resCH.notaMedia.toFixed(1) : '0.0');
        if(document.getElementById('espNovo-outCHFaixa')) document.querySelectorAll('#espNovo-outCHFaixa').forEach(el => el.innerText = `Faixa: ${resCH.notaMinima.toFixed(1)} - ${resCH.notaMaxima.toFixed(1)}`);
        document.querySelectorAll('#espNovo-outCHAcertos').forEach(el => el.innerText = `/45 ACERTOS`);
        
        document.querySelectorAll('#espNovo-outCN').forEach(el => el.innerText = resCN.notaMedia > 0 ? resCN.notaMedia.toFixed(1) : '0.0');
        if(document.getElementById('espNovo-outCNFaixa')) document.querySelectorAll('#espNovo-outCNFaixa').forEach(el => el.innerText = `Faixa: ${resCN.notaMinima.toFixed(1)} - ${resCN.notaMaxima.toFixed(1)}`);
        document.querySelectorAll('#espNovo-outCNAcertos').forEach(el => el.innerText = `/45 ACERTOS`);
        
        document.querySelectorAll('#espNovo-outMAT').forEach(el => el.innerText = resMAT.notaMedia > 0 ? resMAT.notaMedia.toFixed(1) : '0.0');
        if(document.getElementById('espNovo-outMATFaixa')) document.querySelectorAll('#espNovo-outMATFaixa').forEach(el => el.innerText = `Faixa: ${resMAT.notaMinima.toFixed(1)} - ${resMAT.notaMaxima.toFixed(1)}`);
        document.querySelectorAll('#espNovo-outMATAcertos').forEach(el => el.innerText = `/45 ACERTOS`);
    }
    
    let redacaoScore = aluno.redacao || 'S/R';
    if(document.getElementById('espNovo-outRED')) document.querySelectorAll('#espNovo-outRED').forEach(el => el.innerText = redacaoScore);

    let numRed = parseFloat(aluno.redacao);
    let temRedacao = !isNaN(numRed);
    let hasIndisp = (resLC.indisponivel || resCH.indisponivel || resCN.indisponivel || resMAT.indisponivel);
    
    if(hasIndisp) {
        if(document.getElementById('espNovo-outMediaGeral')) {
            document.querySelectorAll('#espNovo-outMediaGeral').forEach(el => el.innerText = 'N/D');
        }
    } else {
        let somaMed = parseFloat(resLC.notaMedia) + parseFloat(resCH.notaMedia) + parseFloat(resCN.notaMedia) + parseFloat(resMAT.notaMedia);
        let mediaGeralAluno = temRedacao ? (somaMed + numRed) / 5 : somaMed / 4;
        
        if(document.getElementById('espNovo-outMediaGeral')) {
            document.querySelectorAll('#espNovo-outMediaGeral').forEach(el => el.innerText = isNaN(mediaGeralAluno) ? '0.0' : mediaGeralAluno.toFixed(1));
        }
    }

    // Calculate Hit, Miss, Blank rates
    let brancosCount = 0;
    let errosCount = 0;
    for(let i=0; i<totalQuestoes; i++) {
        let m = aluno.resps[i];
        let isAnulada = (espNovoGabarito[i].resp === 'X' || espNovoGabarito[i].resp === '*' || espNovoGabarito[i].resp === 'ANULADA' || espNovoGabarito[i].resp === 'NULA');
        if(isAnulada) continue;
        if(!m || m === '-' || m === ' ') brancosCount++;
        else if(m !== espNovoGabarito[i].resp) errosCount++;
    }

    // Gerar Espelho de Marcacoes GRID PREMIUM
    let marcHtml = '';
    for(let i=0; i<totalQuestoes; i++) {
        let g = espNovoGabarito[i];
        let m = aluno.resps[i];
        if(!m || m === ' ') m = '-';
        
        let isAnulada = (g.resp === 'X' || g.resp === '*' || g.resp === 'ANULADA' || g.resp === 'NULA');
        let isCorrect = (m === g.resp || isAnulada);
        let isBlank = (m === '-');
        
        let bgStyle = '';
        let colorStyle = '';
        let borderStyle = '';
        let textoResp = g.resp;
        
        if(isAnulada) {
            bgStyle = '#dcfce7'; colorStyle = '#16a34a'; borderStyle = '#bbf7d0';
            textoResp = 'ANU.';
        } else if(isCorrect) {
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
                <div style="font-weight: 800; color: #94a3b8; width: ${isAnulada ? '22px' : '10px'}; text-align: center;">${textoResp}</div>
                <div style="background-color: ${bgStyle}; color: ${colorStyle}; border: 1px solid ${borderStyle}; font-weight: 900; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">${m}</div>
            </div>
        `;
    }
    
    if(document.getElementById('espNovo-outMarcacoesGridPremium')) {
        document.querySelectorAll('#espNovo-outMarcacoesGridPremium').forEach(el => el.innerHTML = marcHtml);
    }

    // Simulate TRI Data
    if(document.getElementById('espNovo-triF')) {
        let triF = Math.min(100, Math.round(percGeralAluno * 1.3));
        let triM = Math.min(100, Math.round(percGeralAluno * 0.9));
        let triD = Math.min(100, Math.round(percGeralAluno * 0.4));
        
        document.querySelectorAll('#espNovo-triF').forEach(el => el.innerText = `${triF}%`);
        document.querySelectorAll('#espNovo-triM').forEach(el => el.innerText = `${triM}%`);
        document.querySelectorAll('#espNovo-triD').forEach(el => el.innerText = `${triD}%`);
        
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

    // Update Input File
    document.getElementById('espNovo-uploadCartao').value = '';

    // CHARTS (Destruir se existir e criar novos)
    if(chartProf) chartProf.destroy();
    if(chartCircularAlunoInstance) chartCircularAlunoInstance.destroy();
    if(chartCircularStatusInstance) chartCircularStatusInstance.destroy();
    if(chartBarrasAreasInstance) chartBarrasAreasInstance.destroy();

    const chartAnimOptions = { animation: false, responsive: true, maintainAspectRatio: false };

    // Bar Chart
    const ctxBarras = document.getElementById('chart-barras-areas');
    if(ctxBarras) {
        chartBarrasAreasInstance = new Chart(ctxBarras.getContext('2d'), {
            type: 'bar',
            data: {
                labels: areaNamesForChart,
                datasets: [
                    {
                        label: 'Seu Desempenho',
                        data: percAlunoForChart,
                        backgroundColor: '#1e3a8a',
                        borderRadius: 4
                    },
                    {
                        label: 'Média da Turma',
                        data: percTurmaForChart,
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
            data: {
                labels: ['Acertos', 'Erros'],
                datasets: [{
                    data: [totalAcertos, totalQuestoes - totalAcertos],
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

    // Circular Chart 2: Status das Respostas
    const ctxCircStatus = document.getElementById('chart-circular-status');
    if(ctxCircStatus) {
        chartCircularStatusInstance = new Chart(ctxCircStatus.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Corretas', 'Erradas', 'Branco'],
                datasets: [{
                    data: [totalAcertos, errosCount, brancosCount],
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

    setTimeout(() => {
        console.log('Chamando garantirPainelBotoesPDF após renderização do boletim.');
        garantirPainelBotoesPDF();
        conectarBotoesPDF();
    }, 700);
}

window.canvasEstaEmBranco = function canvasEstaEmBranco(canvas) {
  const ctx = canvas.getContext('2d');
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]; const g = pixels[i + 1]; const b = pixels[i + 2]; const a = pixels[i + 3];
    if (!(r > 245 && g > 245 && b > 245 && a > 245)) { return false; }
  }
  return true;
}


window.testarCapturaBoletimPNG = async function () {
  console.log('BOTÃO PNG CLICADO');

  const exportRoot = document.getElementById('boletim-pdf-export');

  if (!exportRoot) {
    alert('Erro: #boletim-pdf-export não encontrado.');
    return;
  }

  if (typeof html2canvas === 'undefined') {
    alert('Erro: html2canvas não carregado.');
    return;
  }

  const page = exportRoot.querySelector('.boletim-a4-page');

  if (!page) {
    alert('Erro: nenhuma .boletim-a4-page encontrada.');
    return;
  }

  const canvas = await html2canvas(page, {
    backgroundColor: '#ffffff',
    scale: 3,
    useCORS: true,
    allowTaint: true,
    logging: true
  });

  const link = document.createElement('a');
  link.download = 'teste-captura-boletim.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

window.baixarBoletimAtual = async function () {
  console.log('BOTÃO BAIXAR PDF CLICADO');

  const exportRoot = document.getElementById('boletim-pdf-export');

  if (!exportRoot) {
    alert('Erro: #boletim-pdf-export não encontrado.');
    return;
  }

  if (typeof html2canvas === 'undefined') {
    alert('Erro: html2canvas não carregado.');
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('Erro: jsPDF não carregado.');
    return;
  }

  const pages = Array.from(exportRoot.querySelectorAll('.boletim-a4-page'));

  if (!pages.length) {
    alert('Erro: nenhuma página A4 encontrada.');
    return;
  }

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: false
  });

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    const canvas = await html2canvas(page, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: page.scrollWidth,
      windowHeight: page.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  }

  pdf.save('Boletim_Desempenho_Individual.pdf');
};

window.imprimirBoletimNativo = function () {
  console.log('BOTÃO IMPRIMIR CLICADO');

  const exportRoot = document.getElementById('boletim-pdf-export');

  if (!exportRoot) {
    alert('Erro: #boletim-pdf-export não encontrado.');
    return;
  }

  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Pop-up bloqueado. Permita pop-ups para este site.');
    return;
  }

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Boletim de Desempenho Individual</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        .boletim-a4-page {
          width: 210mm;
          height: 297mm;
          min-height: 297mm;
          background: #ffffff;
          page-break-after: always;
          break-after: page;
          overflow: hidden;
        }

        .boletim-a4-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
      </style>
    </head>
    <body>
      ${exportRoot.outerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 800);
};

window.renderizarPaginasAdicionaisA4 = function () {
  console.log('renderizarPaginasAdicionaisA4 real executada.');
};

function garantirPainelBotoesPDF() {
  let painel = document.getElementById('painel-botoes-pdf');

  if (painel) {
    console.log('Painel de botões PDF já existe.');
    return painel;
  }

  const exportRoot = document.getElementById('boletim-pdf-export');

  if (!exportRoot) {
    console.warn('Não encontrei #boletim-pdf-export. Não foi possível criar os botões.');
    return null;
  }

  painel = document.createElement('div');
  painel.id = 'painel-botoes-pdf';
  painel.className = 'painel-botoes-pdf';

  painel.innerHTML = `
    <button id="btn-testar-captura-png" type="button" class="btn-diagnostico btn-png">
      🖼️ Testar captura PNG
    </button>

    <button id="btn-baixar-boletim-atual" type="button" class="btn-diagnostico btn-pdf">
      ⬇️ Baixar Boletim Atual
    </button>

    <button id="btn-imprimir-boletim-nativo" type="button" class="btn-diagnostico btn-print">
      🖨️ Imprimir / Salvar Nativo
    </button>
  `;

  const previewContainer = exportRoot.closest('.preview-boletim, .espelho-preview, .boletim-preview, .bg-slate-200, .bg-slate-100') || exportRoot.parentElement;

  if (previewContainer && previewContainer.parentElement) {
    previewContainer.parentElement.insertBefore(painel, previewContainer);
  } else if (exportRoot.parentElement) {
    exportRoot.parentElement.insertBefore(painel, exportRoot);
  } else {
    document.body.prepend(painel);
  }

  console.log('Painel de botões PDF criado dinamicamente.');
  return painel;
}

function conectarBotoesPDF() {
  garantirPainelBotoesPDF();

  const btnPNG = document.getElementById('btn-testar-captura-png');
  const btnPDF = document.getElementById('btn-baixar-boletim-atual');
  const btnPrint = document.getElementById('btn-imprimir-boletim-nativo');

  if (btnPNG) {
    btnPNG.onclick = null;
    btnPNG.addEventListener('click', window.testarCapturaBoletimPNG);
  }

  if (btnPDF) {
    btnPDF.onclick = null;
    btnPDF.addEventListener('click', window.baixarBoletimAtual);
  }

  if (btnPrint) {
    btnPrint.onclick = null;
    btnPrint.addEventListener('click', window.imprimirBoletimNativo);
  }

  console.log('BOTÕES PDF CONECTADOS');
  console.log('btnPNG existe:', !!btnPNG);
  console.log('btnPDF existe:', !!btnPDF);
  console.log('btnPrint existe:', !!btnPrint);
  console.log('testarCapturaBoletimPNG:', typeof window.testarCapturaBoletimPNG);
  console.log('baixarBoletimAtual:', typeof window.baixarBoletimAtual);
  console.log('imprimirBoletimNativo:', typeof window.imprimirBoletimNativo);
}

setInterval(() => {
  const exportRoot = document.getElementById('boletim-pdf-export');
  const painel = document.getElementById('painel-botoes-pdf');

  if (exportRoot && !painel) {
    console.log('Watcher detectou boletim sem botões. Criando painel...');
    garantirPainelBotoesPDF();
    conectarBotoesPDF();
  }
}, 1500);

// Chamar ao carregar


async function espNovoGerarLote() {
    const file = document.getElementById('espNovo-uploadLote').files[0];
    if(!file) { alert("Anexe o PDF com os cartões para a geração em massa."); return; }
    if(espNovoAlunos.length === 0) { alert("Nenhum aluno processado na lista."); return; }
    if(!window.JSZip) { alert("Aguarde a biblioteca JSZip carregar e tente novamente."); return; }
    
    const btn = document.getElementById('espNovo-btnLote');
    const progContainer = document.getElementById('espNovo-loteProgressContainer');
    const bar = document.getElementById('espNovo-loteBar');
    const percText = document.getElementById('espNovo-lotePerc');
    const statusText = document.getElementById('espNovo-loteStatus');
    
    btn.disabled = true;
    btn.classList.add('opacity-50');
    progContainer.classList.remove('hidden');
    
    try {
        statusText.innerText = "Lendo arquivo PDF gigante...";
        const arrayBuffer = await file.arrayBuffer();
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
        
        if(pdf.numPages < espNovoAlunos.length) {
            alert(`Aviso crítico: O PDF possui apenas ${pdf.numPages} páginas, mas você importou ${espNovoAlunos.length} alunos! Alguns ficarão sem cartão na imagem.`);
        }
        
        const zip = new JSZip();
        
        for(let i = 0; i < espNovoAlunos.length; i++) {
            statusText.innerText = `Gerando ${i+1} de ${espNovoAlunos.length} (${espNovoAlunos[i].nome})...`;
            percText.innerText = Math.round((i / espNovoAlunos.length) * 100) + "%";
            bar.style.width = Math.round((i / espNovoAlunos.length) * 100) + "%";
            
            const sel = document.getElementById('espNovo-alunoSelect');
            sel.value = i;
            
            if(i < pdf.numPages) {
                const page = await pdf.getPage(i+1);
                const viewport = page.getViewport({scale: 2.0});
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                espNovoAlunos[i].imagemCartao = canvas.toDataURL('image/jpeg', 0.9);
            }
            
            espNovoRenderPreview();
            await new Promise(r => setTimeout(r, 400));
            
            const original = document.getElementById('espNovo-printRoot');
            const captureWrapper = document.createElement('div');
            captureWrapper.id = 'pdf-capture-wrapper-lote';
            Object.assign(captureWrapper.style, {
                position: 'absolute', top: '0', left: '0', width: '800px', minHeight: '1131px',
                background: '#ffffff', zIndex: '999999', opacity: '1', visibility: 'visible',
                pointerEvents: 'none', overflow: 'visible'
            });

            const clone = original.cloneNode(true);
            Object.assign(clone.style, {
                position: 'relative', top: '0', left: '0', width: '800px', minHeight: '1131px', height: 'auto',
                background: '#ffffff', opacity: '1', visibility: 'visible',
                display: 'block', transform: 'none', overflow: 'visible'
            });

            captureWrapper.appendChild(clone);
            document.body.appendChild(captureWrapper);
            
            const origCanvases = original.querySelectorAll('canvas');
            const cloneCanvases = clone.querySelectorAll('canvas');
            origCanvases.forEach((c, idx) => {
                if(cloneCanvases[idx]) cloneCanvases[idx].getContext('2d').drawImage(c, 0, 0);
            });

            await new Promise(resolve => requestAnimationFrame(resolve));
            await new Promise(resolve => setTimeout(resolve, 200));

            const opt = {
                margin:       [0, 0, 0, 0],
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 800 },
                jsPDF:        { unit: 'px', format: [800, 1131], orientation: 'portrait' }
            };
            
            const pdfBlob = await html2pdf().set(opt).from(clone).toPdf().get('pdf').then(p => p.output('blob'));
            
            const cleanName = espNovoAlunos[i].nome.replace(/[^a-zA-Z0-9]/g, '_');
            zip.file(`Boletim_${espNovoAlunos[i].id}_${cleanName}.pdf`, pdfBlob);
            
            document.body.removeChild(captureWrapper);
        }
        
        statusText.innerText = "Empacotando arquivo ZIP. Isso pode levar alguns segundos...";
        percText.innerText = "100%";
        bar.style.width = "100%";
        
        const zipContent = await zip.generateAsync({type:"blob"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipContent);
        link.download = "Nexus_Boletins_Em_Lote.zip";
        link.click();
        
        statusText.innerText = "Download concluído com Sucesso!";
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        
    } catch(err) {
        console.error(err);
        alert("Ocorreu um erro durante a geração em lote. Verifique o console do navegador.");
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        const wrapper = document.querySelector('#pdf-capture-wrapper-lote');
        if (wrapper) wrapper.remove();
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
            if(e.dataTransfer.files.length > 0) {
                ocrHandleFiles(e.dataTransfer.files);
            }
        });
    }
});

function ocrHandleFiles(files) {
    if(!files || files.length === 0) return;
    document.getElementById('ocr-statusPanel').classList.remove('hidden');
    document.getElementById('ocr-exportBtnContainer').classList.add('hidden');
    
    const queueList = document.getElementById('ocr-queueList');
    
    for(let file of files) {
        const id = 'ocr-' + Math.random().toString(36).substr(2, 9);
        ocrQueue.push({ id: id, file: file, status: 'pending' });
        
        queueList.innerHTML += `
            <div id="${id}" class="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-slate-400">description</span>
                    <span class="text-sm font-bold text-slate-700 truncate w-64">${file.name}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-400 status-text">Aguardando...</span>
                    <span class="material-symbols-outlined text-slate-300 status-icon">schedule</span>
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
        if(item.status !== 'pending') continue;
        
        item.status = 'processing';
        ocrUpdateItemUI(item.id, 'Analisando imagem...', 'sync', 'text-amber-500 animate-spin');
        document.querySelectorAll('#ocr-queueStatus').forEach(el => el.innerText = `${i} / ${ocrQueue.length} Concluídos`);
        
        try {
            // Simulando latência da API de Visão
            await new Promise(r => setTimeout(r, 2000));
            
            // Mock de Resposta da IA (Quando plugado no n8n, aqui ficará o fetch POST)
            // No futuro: const response = await fetch(webhookUrl, { method: 'POST', body: ... });
            // const data = await response.json();
            
            const mockAnswers = Array.from({length: 45}, () => ['A','B','C','D','E'][Math.floor(Math.random()*5)]).join('');
            const mockId = Math.floor(Math.random() * 9000 + 1000).toString();
            
            // Simulação perfeita extraída do "Webhook"
            const mockResult = {
                id: mockId,
                nome: "Aluno Escaneado " + mockId,
                respostas: mockAnswers
            };
            
            ocrResults.push(mockResult);
            item.status = 'done';
            ocrUpdateItemUI(item.id, 'Leitura Concluída', 'check_circle', 'text-emerald-500');
            
        
        window.limparDados = function() {
            if(confirm("Tem certeza que deseja limpar todos os dados em cache e reiniciar?")) {
                localStorage.clear();
                window.location.reload();
            }
        };

        window.baixarTodosBoletinsEmZIP = async function() {
            if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
                alert("Nenhum boletim processado para baixar.");
                return;
            }
            if (!window.JSZip) {
                alert("Aguarde a biblioteca ZIP carregar.");
                return;
            }

            const btn = document.querySelector('button[onclick="window.baixarTodosBoletinsEmZIP()"]');
            const originalText = btn.innerHTML;
            
            let zip = new JSZip();
            let total = window.espelhosGerados.length;
            
            for(let i=0; i<total; i++) {
                let aluno = window.espelhosGerados[i];
                btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Gerando ${i+1}/${total}...`;
                
                window.verEspelho(aluno.matricula);
                
                await new Promise(r => setTimeout(r, 800)); // Aguarda renderizar tela
                
                const pages = Array.from(document.getElementById('pdf-espelho-pag1').parentElement.children).filter(el => el.id && el.id.startsWith('pdf-espelho-pag'));
                const element = document.createElement('div');
                pages.forEach(p => {
                    let clone = p.cloneNode(true);
                    clone.style.pageBreakAfter = 'always';
                    clone.classList.remove('shadow-2xl', 'mb-8'); // clean up for print
                    clone.style.margin = '0';
                    clone.style.transform = 'scale(0.98)';
                    clone.style.transformOrigin = 'top center';
                    
                    // Copy canvas pixel data from original to clone (for Chart.js radar)
                    const originalCanvases = p.getElementsByTagName('canvas');
                    const clonedCanvases = clone.getElementsByTagName('canvas');
                    for (let i = 0; i < originalCanvases.length; i++) {
                        clonedCanvases[i].getContext('2d').drawImage(originalCanvases[i], 0, 0);
                    }
                    
                    element.appendChild(clone);
                });
                
                const opt = {
                    margin:       0,
                    filename:     `Boletim_${aluno.matricula}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
                    pagebreak:    { mode: 'css' }
                };
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.top = '0';
                element.style.zIndex = '-999';
                element.style.width = '794px';
                element.style.backgroundColor = '#ffffff';
                document.body.appendChild(element);


                try {
                    const worker = html2pdf().set(opt).from(element);
                    const pdfBlob = await worker.output('blob');
                    const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                    zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                } catch (err) {
                    console.error('Error generating PDF for', aluno.nome, err);
                    try {
                        const worker = html2pdf().set(opt).from(element);
                        const pdfBlob = await worker.outputPdf('blob');
                        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
                        zip.file(`Boletim_${safeName}_${aluno.matricula}.pdf`, pdfBlob);
document.body.removeChild(element);
                    } catch(err2) {
                        alert('Erro ao gerar PDF do aluno ' + aluno.nome + ': ' + err2.message);
                        btn.innerHTML = originalText;
                        return;
                    }
                }
            }
            
            btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...`;
            
            zip.generateAsync({type:"blob"}).then(function(content) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(content);
                a.download = "Boletins_Alunos.zip";
                a.click();
                btn.innerHTML = originalText;
                alert("Download concluído com sucesso!");
            });
        };
} catch(e) {
            item.status = 'error';
            ocrUpdateItemUI(item.id, 'Falha na Visão', 'error', 'text-rose-500');
        }
    }
    
    document.querySelectorAll('#ocr-queueStatus').forEach(el => el.innerText = `${ocrQueue.length} / ${ocrQueue.length} Concluídos`);
    document.getElementById('ocr-exportBtnContainer').classList.remove('hidden');
}

function ocrUpdateItemUI(id, text, icon, iconClass) {
    const el = document.getElementById(id);
    if(!el) return;
    el.querySelector('.status-text').innerText = text;
    el.querySelector('.status-icon').className = `material-symbols-outlined status-icon ${iconClass}`;
    el.querySelector('.status-icon').innerText = icon;
}

function ocrExportarParaEspelhos() {
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

// DOMContentLoaded Event
document.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});

// This script will be appended to the end of the script tag in nexus_provas.html

window.renderizarPaginasAdicionaisA4 = function(espelhoAluno) {
    if (!window.gabaritosArray || !espelhoAluno || !espelhoAluno.questoesCorrigidas) return;

    // 1. Correção de Geopolítica para Geografia
    window.gabaritosArray.forEach(q => {
        if (q.disciplina && (q.disciplina.toUpperCase() === 'GEOPOLÍTICA' || q.disciplina.toUpperCase() === 'GEOPOLITICA')) {
            q.disciplina = 'Geografia';
        }
    });

    // 2. Análise do Escore por Disciplinas (Gráficos)
    let statsD1 = {};
    let statsD2 = {};
    
    window.gabaritosArray.forEach(q => {
        let dia = parseInt(q.questao) <= 90 ? 1 : 2;
        let disciplina = q.disciplina || 'Outros';
        disciplina = disciplina.charAt(0).toUpperCase() + disciplina.slice(1).toLowerCase();
        
        let target = dia === 1 ? statsD1 : statsD2;
        if (!target[disciplina]) {
            target[disciplina] = { acertosAluno: 0, total: 0, acertosTurma: 0, respondidasTurma: 0 };
        }
        target[disciplina].total++;
        
        // Aluno acertou?
        let cq = espelhoAluno.questoesCorrigidas.find(x => x.questao == q.questao);
        if (cq && cq.acerto === 1) {
            target[disciplina].acertosAluno++;
        }
        
        // Turma acertou?
        if (window.espelhosGerados) {
            window.espelhosGerados.forEach(e => {
                let e_cq = e.questoesCorrigidas.find(x => Number(x.questao) === Number(q.questao) && (x.areaOriginal === q.disciplina || x.disciplina === q.disciplina || (q.disciplina === 'Inglês' && e.idioma === 'Inglês') || (q.disciplina === 'Espanhol' && e.idioma === 'Espanhol')));
                if (e_cq && e_cq.respostaAluno && e_cq.respostaAluno.trim() !== '') {
                    target[disciplina].respondidasTurma++;
                    if (e_cq.acerto === 1) {
                        target[disciplina].acertosTurma++;
                    }
                }
            });
        }
    });

    function renderAnaliseHtml(statsObj) {
        if (Object.keys(statsObj).length === 0) return '';
        let html = `
        <div class="flex w-full">
            <div class="w-[35%] border-r border-slate-300 flex flex-col">
                <div class="flex text-[10px] font-bold bg-teal-600/20 text-[#0B193C] text-center border-b border-slate-300">
                    <div class="flex-1 py-1 border-r border-slate-300">DISCIPLINA</div>
                    <div class="w-12 py-1 border-r border-slate-300">ALUNO</div>
                    <div class="w-12 py-1">MÉDIA</div>
                </div>`;
        
        let maxPercent = 0;
        let discNames = [];
        let alunoPercents = [];
        let turmaPercents = [];
        
        Object.keys(statsObj).forEach((disc, idx) => {
            let s = statsObj[disc];
            let bgClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50';
            let alunoPct = s.total > 0 ? Math.round((s.acertosAluno / s.total) * 100) : 0;
            let turmaPct = s.respondidasTurma > 0 ? Math.round((s.acertosTurma / s.respondidasTurma) * 100) : 0;
            
            discNames.push(disc);
            alunoPercents.push(alunoPct);
            turmaPercents.push(turmaPct);
            if (alunoPct > maxPercent) maxPercent = alunoPct;
            if (turmaPct > maxPercent) maxPercent = turmaPct;
            
            html += `
                <div class="flex text-[11px] font-bold text-center ${bgClass} border-b border-slate-200">
                    <div class="flex-1 py-2 border-r border-slate-200 text-[#0B193C] font-black">${disc}</div>
                    <div class="w-12 py-2 border-r border-slate-200 ${alunoPct >= 50 ? 'bg-amber-100 text-amber-700' : 'text-slate-600'}">${s.acertosAluno}/${s.total}</div>
                    <div class="w-12 py-2 text-slate-500 font-bold">${turmaPct}%</div>
                </div>`;
        });
        
        html += `</div>
            <div class="flex-1 p-4 relative flex flex-col justify-end bg-slate-50/50" style="min-height: 180px;">`;
            
        // Gerar barras (AGORA COM ALUNO E MEDIA JUNTOS E SEM LINHA HORIZONTAL INFERIOR)
        html += `<div class="flex justify-around items-end h-[120px] w-full relative">
                 <div class="absolute w-full border-t border-slate-200 top-[25%] -z-10"></div>
                 <div class="absolute w-full border-t border-slate-200 top-[50%] -z-10"></div>
                 <div class="absolute w-full border-t border-slate-200 top-[75%] -z-10"></div>`;
        
        discNames.forEach((disc, i) => {
            let heightA = alunoPercents[i] > 0 ? Math.max(alunoPercents[i], 5) : 0;
            let heightG = turmaPercents[i] > 0 ? Math.max(turmaPercents[i], 5) : 0;
            
            html += `<div class="flex flex-col items-center justify-end h-full gap-1 z-10 w-10 group">
                <div class="flex items-end h-full w-full gap-0">
                    <div class="w-1/2 flex flex-col justify-end h-full relative">
                        <span class="text-[8px] font-bold text-slate-500 absolute w-[20px] text-center" style="bottom: calc(${heightA}% + 2px); left: 50%; transform: translateX(-50%); leading-none;">${alunoPercents[i]}%</span>
                        <div class="w-full bg-[#0B193C] rounded-t-sm transition-all duration-300" style="height: ${heightA}%"></div>
                    </div>
                    <div class="w-1/2 flex flex-col justify-end h-full relative">
                        <span class="text-[8px] font-bold text-slate-400 absolute w-[20px] text-center" style="bottom: calc(${heightG}% + 2px); left: 50%; transform: translateX(-50%); leading-none;">${turmaPercents[i]}%</span>
                        <div class="w-full bg-[#A7F3D0] rounded-t-sm transition-all duration-300" style="height: ${heightG}%"></div>
                    </div>
                </div>
                <!-- Alta resolucao e sem truncar -->
                <span class="text-[8px] mt-1 text-slate-700 font-black whitespace-nowrap overflow-visible text-center" style="-webkit-font-smoothing: antialiased;">${disc}</span>
            </div>`;
        });
        
        html += `</div>
                 <div class="flex justify-center items-center gap-4 mt-6">
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-[#0B193C]"></div><span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Aluno</span></div>
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-[#A7F3D0]"></div><span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Média da Turma</span></div>
                 </div>
            </div>
        </div>`;
        return html;
    }
    
    let containerD1 = document.getElementById('container-analise-d1');
    if(containerD1) containerD1.innerHTML = renderAnaliseHtml(statsD1);
    
    let containerD2 = document.getElementById('container-analise-d2');
    if(containerD2) containerD2.innerHTML = renderAnaliseHtml(statsD2);

    function generateMarcaoesTable(dia) {
        let startQ = dia === 1 ? 1 : 91;
        let endQ = dia === 1 ? 90 : 180;
        let html = '';
        
        for (let row = 0; row < 6; row++) {
            let rowStart = startQ + (row * 15);
            if (rowStart > endQ) break;
            
            html += `<div class="border border-slate-300 rounded-lg overflow-hidden shadow-sm mb-4">
                <div class="flex text-[11px] font-bold text-center bg-teal-600/20 text-[#0B193C]">
                    <div class="w-[85px] py-1 border-r border-slate-300 flex items-center justify-center">Questão</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                html += `<div class="flex-1 border-r border-slate-300 py-1 flex items-center justify-center">${qNum}</div>`;
            }
            html += `</div>`;
            
            // Gabarito
            html += `<div class="flex text-[11px] font-bold text-center bg-white border-b border-slate-200">
                    <div class="w-[85px] py-1 border-r border-slate-200 text-slate-700 flex items-center justify-center">Gabarito</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                let q = window.gabaritosArray.find(x => x.questao == qNum);
                let gab = q ? q.resposta : '-';
                if(q && q.anulada) gab = 'ANU.';
                let textClass = gab === 'ANU.' ? 'text-emerald-500 text-[9px]' : '';
                html += `<div class="flex-1 border-r border-slate-200 py-1 flex items-center justify-center ${textClass}">${gab}</div>`;
            }
            html += `</div>`;
            
            // Marcação Aluno
            html += `<div class="flex text-[11px] font-bold text-center bg-[#FDE68A] border-b border-slate-200 text-[#0B193C]">
                    <div class="w-[85px] py-1 border-r border-amber-300 text-slate-700 bg-amber-100 leading-tight flex items-center justify-center">Marcação do Aluno</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                let q = window.gabaritosArray.find(x => x.questao == qNum);
                let gab = q ? q.resposta : '-';
                if(q && q.anulada) gab = 'ANU.';
                
                let cq = espelhoAluno.questoesCorrigidas.find(x => x.questao == qNum);
                let marc = cq && cq.respostaAluno ? cq.respostaAluno : '-';
                
                let color = (cq && cq.acerto === 1) ? 'text-emerald-700' : (marc !== '-' ? 'text-rose-600' : 'text-slate-400');
                html += `<div class="flex-1 border-r border-amber-300 py-1 flex items-center justify-center ${color}">${marc}</div>`;
            }
            html += `</div>`;
            
            // Área / Matéria
            html += `<div class="flex text-[9px] font-bold text-center bg-white">
                    <div class="w-[85px] py-1 border-r border-slate-200 text-slate-700 flex items-center justify-center">Área</div>`;
            for (let i = 0; i < 15; i++) {
                let qNum = rowStart + i;
                let q = window.gabaritosArray.find(x => x.questao == qNum);
                let rawMat = q ? (q.disciplina || q.area || '-') : '-';
                let upperRawMat = rawMat.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                const matMap = {
                    'LINGUAGENS': 'LING',
                    'INGLES': 'ING',
                    'ESPANHOL': 'ESP',
                    'HISTORIA': 'HIST',
                    'GEOGRAFIA': 'GEO',
                    'SOCIOLOGIA': 'SOCI',
                    'FILOSOFIA': 'FILO',
                    'MATEMATICA': 'MAT',
                    'QUIMICA': 'QUI',
                    'FISICA': 'FIS',
                    'BIOLOGIA': 'BIO',
                    'LITERATURA': 'LIT',
                    'PORTUGUES': 'PORT',
                    'ARTE': 'ARTE',
                    'ARTES': 'ARTE'
                };
                
                let mat = matMap[upperRawMat] || upperRawMat.substring(0,6);
                if (mat === '-') mat = '-';
                html += `<div class="flex-1 border-r border-slate-200 py-1 flex items-center justify-center">${mat}</div>`;
            }
            html += `</div></div>`;
        }
        
        // Seçao de Upload do Cartão
        window.cartoesImagens = window.cartoesImagens || {};
        let imgId = espelhoAluno.matricula + "_dia" + dia;
        let existingImg = window.cartoesImagens[imgId];
        let displayBox = existingImg ? "style='display: none;'" : "";
        let displayImg = existingImg ? "" : "hidden";
        let imgSrc = existingImg ? existingImg : "";

        html += `
        <div class="mt-8 flex flex-col items-center w-full">
            <div id="box-upload-d${dia}" ${displayBox} class="print:hidden w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 mb-4 hover:bg-indigo-50 transition-colors cursor-pointer" onclick="document.getElementById('upload-cartao-d${dia}').click()">
                <svg class="w-8 h-8 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Anexar Imagem do Cartão-Resposta (Dia ${dia})</span>
                                <input type="file" id="upload-cartao-d${dia}" class="hidden" accept="image/*,application/pdf" onchange="
                    const file = this.files[0];
                    if (file) {
                        if (file.type === 'application/pdf') {
                            const processPDF = (pdfFile) => {
                                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    const typedarray = new Uint8Array(e.target.result);
                                    window.pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                                        pdf.getPage(1).then(page => {
                                            const viewport = page.getViewport({scale: 2.0});
                                            const canvas = document.createElement('canvas');
                                            const ctx = canvas.getContext('2d');
                                            canvas.height = viewport.height;
                                            canvas.width = viewport.width;
                                            page.render({ canvasContext: ctx, viewport: viewport }).promise.then(() => {
                                                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                                                window.cartoesImagens['${espelhoAluno.matricula}_dia${dia}'] = imgData;
                                                document.getElementById('img-cartao-d${dia}').src = imgData;
                                                document.getElementById('img-cartao-d${dia}').classList.remove('hidden');
                                                document.getElementById('box-upload-d${dia}').style.display = 'none';
                                            });
                                        });
                                    }).catch(err => {
                                        alert('Erro ao processar PDF: ' + err.message);
                                    });
                                };
                                reader.readAsArrayBuffer(pdfFile);
                            };
                            
                            if (!window.pdfjsLib) {
                                const script = document.createElement('script');
                                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                                script.onload = () => processPDF(file);
                                document.head.appendChild(script);
                            } else {
                                processPDF(file);
                            }
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            window.cartoesImagens['${espelhoAluno.matricula}_dia${dia}'] = e.target.result;
                            document.getElementById('img-cartao-d${dia}').src = e.target.result;
                            document.getElementById('img-cartao-d${dia}').classList.remove('hidden');
                            document.getElementById('box-upload-d${dia}').style.display = 'none';
                        }
                        reader.readAsDataURL(file);
                    }
                ">
            </div>
            <img id="img-cartao-d${dia}" src="${imgSrc}" class="${displayImg} max-w-full rounded-lg shadow-sm border border-slate-200 mt-2" style="max-height: 280px; object-fit: contain; width: 100%;">
        </div>`;
        
        return html;
    }
    
    function generateEstatisticasTable(dia) {
        let startQ = dia === 1 ? 1 : 91;
        let endQ = dia === 1 ? 90 : 180;
        let html = `<div class="border border-[#0B193C] rounded-lg overflow-hidden shadow-sm mt-4">
            <div class="flex bg-[#0B193C] text-white text-[10px] font-bold text-center">
                <div class="w-8 py-2">Q</div>
                <div class="w-24 py-2 border-l border-slate-600">Material</div>
                <div class="flex-1 py-2 border-l border-slate-600 text-left pl-2">Assunto</div>
                <div class="w-12 py-2 border-l border-slate-600">Nível</div>
                <div class="w-16 py-2 border-l border-slate-600">Acertos</div>
                <div class="w-12 py-2 border-l border-slate-600">%</div>
            </div>`;
            
        for (let qNum = startQ; qNum <= endQ; qNum++) {
            let questions = window.gabaritosArray.filter(x => x.questao == qNum);
            if (questions.length === 0) continue;
            
            // Se existirem múltiplas versões (Inglês e Espanhol) para a mesma questão,
            // renderiza ambas.
            questions.forEach((q) => {
                let mat = q.disciplina || '-';
                let ass = q.assunto || '-';
                let dif = q.dificuldade ? q.dificuldade.substring(0,3).toUpperCase() : '-';
                
                let totalResp = 0;
                let totalAcertos = 0;
                if (window.espelhosGerados) {
                    window.espelhosGerados.forEach(e => {
                        let e_cq = e.questoesCorrigidas.find(x => Number(x.questao) === Number(qNum) && (x.areaOriginal === mat || x.disciplina === mat || (mat === 'Inglês' && e.idioma === 'Inglês') || (mat === 'Espanhol' && e.idioma === 'Espanhol')));
                        if (e_cq && e_cq.respostaAluno && e_cq.respostaAluno.trim() !== '') {
                            totalResp++;
                            if (e_cq.acerto === 1) {
                                totalAcertos++;
                            }
                        }
                    });
                }
                let pct = totalResp > 0 ? Math.round((totalAcertos / totalResp) * 100) : 0;
                
                let bgClass = qNum % 2 === 0 ? 'bg-slate-50' : 'bg-white';
                let pctColor = pct < 30 ? 'text-rose-600' : (pct > 70 ? 'text-emerald-600' : 'text-teal-600');
                
                html += `<div class="flex text-[10px] text-center \${bgClass} border-b border-slate-200 py-1">
                    <div class="w-8 font-bold text-[#0B193C]">\${qNum}</div>
                    <div class="w-24 border-l border-slate-200 text-slate-600 truncate px-1">\${mat}</div>
                    <div class="flex-1 border-l border-slate-200 text-left pl-2 text-slate-500 truncate pr-2" title="\${ass}">\${ass}</div>
                    <div class="w-12 border-l border-slate-200 text-slate-500">\${dif}</div>
                    <div class="w-16 border-l border-slate-200 text-slate-600">\${totalAcertos}/\${totalResp}</div>
                    <div class="w-12 border-l border-slate-200 font-black \${pctColor}">\${pct}%</div>
                </div>`;
            });
        }
        html += `</div>`;
        return html;
    }

    let panelBoletim = document.getElementById('panel-boletim');
    if (!panelBoletim) return;
    let pagesWrapper = panelBoletim.querySelector('.flex.flex-col.items-center') || panelBoletim;
    
    // Remove existing pag2, pag3 etc so we can rebuild cleanly
    let existingPages = Array.from(pagesWrapper.querySelectorAll('.print-page'));
    existingPages.forEach((p, i) => {
        if(p.id !== 'pdf-espelho-pag1') p.remove();
    });

    function buildPage(id, title, contentHtml, pageNum) {
        let div = document.createElement('div');
        div.id = id;
        div.className = "bg-white shadow-2xl relative shrink-0 flex flex-col mb-8 print-page";
        div.style.cssText = "width: 794px; min-height: 1123px; font-family: 'Inter', sans-serif;";
        div.innerHTML = `
            <div class="bg-[#0B193C] text-white py-4 px-10 flex justify-center items-center rounded-t-lg">
                <h2 class="text-lg font-black uppercase tracking-widest">\${title}</h2>
            </div>
            <div class="px-10 py-6 flex-1 flex flex-col">
                \${contentHtml}
            </div>
            <div class="mt-auto w-full p-4 border-t border-slate-200 bg-white flex justify-between items-center text-[9px] text-slate-400 font-medium rounded-b-lg">
                <div>NEXUS PROVAS | Tecnologia de Avaliação Educacional</div>
                <div>Página \${pageNum} de 5</div>
            </div>`;
        return div;
    }

    let pag2 = buildPage('pdf-espelho-pag2', 'Espelho de Marcações - 1º Dia', generateMarcaoesTable(1), 2);
    let pag3 = buildPage('pdf-espelho-pag3', 'Espelho de Marcações - 2º Dia', generateMarcaoesTable(2), 3);
    let pag4 = buildPage('pdf-espelho-pag4', 'Estatísticas da Turma - 1º Dia', generateEstatisticasTable(1), 4);
    let pag5 = buildPage('pdf-espelho-pag5', 'Estatísticas da Turma - 2º Dia', generateEstatisticasTable(2), 5);

    pagesWrapper.appendChild(pag2);
    pagesWrapper.appendChild(pag3);
    pagesWrapper.appendChild(pag4);
    pagesWrapper.appendChild(pag5);
};

