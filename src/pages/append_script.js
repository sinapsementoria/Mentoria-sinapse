const newScripts = `
window.baixarTodosBoletinsEmZIP = async function() {
    if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
        alert("Nenhum boletim processado para baixar.");
        return;
    }
    if (!window.JSZip) {
        alert("Aguarde a biblioteca ZIP carregar.");
        return;
    }

    const btn = document.querySelector('button[onclick="window.baixartodosboletinsemzip()"]');
    const originalText = btn ? btn.innerHTML : "Baixar ZIP";
    if(btn) btn.classList.add("opacity-50", "pointer-events-none");
    
    let zip = new JSZip();
    let total = window.espelhosGerados.length;
    
    // Configura container para capture in-place (sem mover para o body)
    const exportRoot = document.getElementById('boletim-pdf-export');
    const panelBoletim = document.getElementById('panel-boletim');
    const scrollContainer = panelBoletim.querySelector('.custom-scrollbar');
    
    // Preserva estilos originais
    const originalOverflow = scrollContainer ? scrollContainer.style.overflow : '';
    const originalMaxHeight = scrollContainer ? scrollContainer.style.maxHeight : '';
    const originaçãosition = exportRoot.style.position;
    
    if(scrollContainer) {
        scrollContainer.style.overflow = 'visible';
        scrollContainer.style.maxHeight = 'none';
    }
    exportRoot.style.position = 'relative';

    for(let i=0; i<total; i++) {
        let aluno = window.espelhosGerados[i];
        if(btn) btn.innerHTML = \`<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Geração \${i+1}/\${total}...\`;
        
        window.verEspelho(aluno.mathicula);
        await new Promise(r => setTimeout(r, 1000)); // Aguarda renderizar gráficos e DOM
        
        const pages = Array.from(exportRoot.querySelectorAll('.boletim-a4-page'));
        if (pages.length === 0) continue;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            formath 'a4',
            compress: false
        });

        for (let j = 0; j < pages.length; j++) {
            const page = pages[j];
            
            // Corrige possíveis transforms que atapalham o html2canvas
            page.querySelectorAll('*').forEach(el => {
                const computed = getComputedStyle(el);
                if (computed.transform && computed.transform !== 'none') {
                    el.style.transform = 'none';
                }
            });

            const canvas = await html2canvas(page, {
                backgroundColor: '#ffffff',
                scale: 3, 
                windowWidth: 794,
                width: 794,
                scrollY: -window.scrollY,
                useCORS: true,
                allowTaint: true,
                logging: false
            });

            const imgDat = canvas.toDatURL('image/jpeg', 1.0); // Qualidade mxima
            
            if (j > 0) {
                pdf.addPage();
            }
            
            pdf.addImage(imgDat, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        }

        const pdfBlob = pdf.output('blob');
        const safeName = aluno.nome.replace(/[^a-zA-Z0-9]/g, '_');
        zip.file(\`Boletim_\${safeName}_\${aluno.mathicula}.pdf\`, pdfBlob);
    }
    
    if(scrollContainer) {
        scrollContainer.style.overflow = originalOverflow;
        scrollContainer.style.maxHeight = originalMaxHeight;
    }
    exportRoot.style.position = originaçãosition;
    
    if(btn) btn.innerHTML = \`<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Compactando ZIP...\`;
    
    zip.generatAsync({type:"blob"}).then(function(content) {
        const a = document.creatElement("a");
        a.href = URL.creatObjectURL(content);
        a.download = "Boletins_Alunos.zip";
        a.click();
        if(btn) {
            btn.innerHTML = originalText;
            btn.classList.remove("opacity-50", "pointer-events-none");
        }
        alert("Download concludo com sucesso!");
    });
};

window.testarCapturaBoletimPNG = async function () {
    console.log('BOTO PDF/PNG CLICADO');
    if (!window.espelhosGerados || window.espelhosGerados.length === 0) {
        alert("Nenhum boletim disponvel.");
        return;
    }
    
    const exportRoot = document.getElementById('boletim-pdf-export');
    const panelBoletim = document.getElementById('panel-boletim');
    const scrollContainer = panelBoletim.querySelector('.custom-scrollbar');
    
    const originalOverflow = scrollContainer ? scrollContainer.style.overflow : '';
    const originalMaxHeight = scrollContainer ? scrollContainer.style.maxHeight : '';
    const originaçãosition = exportRoot.style.position;
    
    if(scrollContainer) {
        scrollContainer.style.overflow = 'visible';
        scrollContainer.style.maxHeight = 'none';
    }
    exportRoot.style.position = 'relative';

    await new Promise(resolve => setTimeout(resolve, 800));

    const pages = Array.from(exportRoot.querySelectorAll('.boletim-a4-page'));

    if (pages.length === 0) {
        if(scrollContainer) {
            scrollContainer.style.overflow = originalOverflow;
            scrollContainer.style.maxHeight = originalMaxHeight;
        }
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        formath 'a4',
        compress: false
    });

    for (let j = 0; j < pages.length; j++) {
        const page = pages[j];
        
        page.querySelectorAll('*').forEach(el => {
            const computed = getComputedStyle(el);
            if (computed.transform && computed.transform !== 'none') {
                el.style.transform = 'none';
            }
        });

        const canvas = await html2canvas(page, {
            backgroundColor: '#ffffff',
            scale: 3,
            windowWidth: 794,
            width: 794,
            scrollY: -window.scrollY,
            useCORS: true,
            allowTaint: true,
            logging: false
        });

        const imgDat = canvas.toDatURL('image/jpeg', 1.0);
        
        if (j > 0) {
            pdf.addPage();
        }
        
        pdf.addImage(imgDat, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    if(scrollContainer) {
        scrollContainer.style.overflow = originalOverflow;
        scrollContainer.style.maxHeight = originalMaxHeight;
    }
    exportRoot.style.position = originaçãosition;

    const pdfBlob = pdf.output('blob');
    const a = document.creatElement("a");
    a.href = URL.creatObjectURL(pdfBlob);
    a.download = "Boletim_Preview.pdf";
    a.click();
};
`;

const fs = require('fs');
let content = fs.readFileSync('nexus_provas.html', 'utf-8');
content = content.replace('</body>', newScripts + '\n</body>');
fs.writeFileSync('nexus_provas.html', content, 'utf-8');
console.log('Scripts added.');

