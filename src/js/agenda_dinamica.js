const msInDay = 1000 * 60 * 60 * 24;

let currentDate = new Date();
currentDate.setHours(12, 0, 0, 0);

function getSunday(d) {
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.getFullYear(), d.getMonth(), diff, 12, 0, 0, 0);
}

let currentWeekStart = getSunday(currentDate);

function formatDateBr(d) {
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

function createCardHTML(task) {
    const isConcluido = task.status === 'Concluído' || task.status === 'concluída' || task.status === 'concluida';
    
    const colorMap = {
        'Matemática':  { primary: '#7E22CE', secondary: '#A855F7', bg: 'rgba(126, 34, 206, 0.05)', icon: 'functions' },
        'Física':      { primary: '#B91C1C', secondary: '#EF4444', bg: 'rgba(185, 28, 28, 0.05)', icon: 'bolt' },
        'Química':     { primary: '#B45309', secondary: '#F59E0B', bg: 'rgba(180, 83, 9, 0.05)', icon: 'science' },
        'Biologia':    { primary: '#15803D', secondary: '#22C55E', bg: 'rgba(21, 128, 61, 0.05)', icon: 'eco' },
        'Anki':        { primary: '#059669', secondary: '#10B981', bg: 'rgba(5, 150, 105, 0.05)', icon: 'quiz' },
        'Geral':       { primary: '#374151', secondary: '#64748b', bg: 'rgba(55, 65, 81, 0.05)', icon: 'task_alt' }
    };

    return `
    <div class="kanban-card group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col flex-shrink-0 hover:border-[#00B5B5]/50 hover:shadow-md transition-all duration-300 relative overflow-hidden ${isConcluido ? 'opacity-60 grayscale-[0.3]' : ''}"
         style="min-height: 145px !important; height: 145px !important; margin-bottom: 8px; width: 100% !important;"
         data-id="${task.id || ''}" data-isdb="${task.dbRecord ? 'true' : 'false'}">
         
        <!-- Barra Superior Unificada (Padrão Imagem) -->
        <div class="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl bg-[#475569]"></div>

        <div class="flex flex-col flex-1 relative z-10 text-center items-center h-full">
            <!-- Tag da Disciplina (Pill Style Cinza) -->
            <div class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 mt-1 bg-slate-100 text-slate-500 border border-slate-200/50">
                <span class="material-symbols-outlined text-[11px] mr-1">check_circle</span>
                ${task.tag || 'Geral'}
            </div>

            <!-- Ícone de Lixeira -->
            <button onclick="deleteTaskCard(event, this)" 
                    class="absolute top-0 right-0 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-20">
                <span class="material-symbols-outlined text-[14px]">delete</span>
            </button>

            <!-- Título da Atividade (Azul Escuro) -->
            <div class="w-full flex-1 flex items-center justify-center mb-3">
                <h4 class="text-[10px] font-black text-[#0B193C] leading-tight px-1 uppercase tracking-tight break-words w-full overflow-hidden line-clamp-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${task.title || task.subject || 'Sem Título'}
                </h4>
            </div>

            <!-- Botões de Ação -->
            <div class="flex flex-col gap-1 w-full pb-0.5 mt-auto">
                ${isConcluido 
                    ? `<button onclick="markTaskCard(event, this, 'pendente')" 
                               class="w-full rounded-md border border-slate-100 bg-white text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-slate-50 transition-all" style="height: 22px !important; font-size: 7.5px !important;">
                           <span class="material-symbols-outlined text-[9px]">undo</span>
                           Reabrir
                       </button>`
                    : `<button onclick="markTaskCard(event, this, 'concluido')" 
                               class="w-full rounded-md bg-[#10b981] text-white font-bold uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-[#059669] transition-all" style="height: 22px !important; font-size: 7.5px !important;">
                           <span class="material-symbols-outlined text-[9px] icon-fill">check_circle</span>
                           Concluir
                       </button>`
                }

                <button onclick="openNotesModal(event, this)" 
                        class="w-full rounded-md border ${task.hasNotes || isConcluido ? 'bg-[#FFEDD5] border-[#FED7AA] text-[#9A3412]' : 'border-slate-200 text-slate-500 bg-white'} font-bold uppercase tracking-widest flex items-center justify-center gap-1 hover:shadow-sm transition-all" style="height: 22px !important; font-size: 7.5px !important;">
                    <span class="material-symbols-outlined text-[9px]">${task.hasNotes || isConcluido ? 'description' : 'notes'}</span>
                    ${task.hasNotes || isConcluido ? 'Anotação' : 'Notas'}
                </button>
            </div>
        </div>
    </div>`;
}

window.deleteTaskCard = function(event, btn) {
    event.stopPropagation();
    const card = btn.closest('.kanban-card');
    const id = card.getAttribute('data-id');
    const isDb = card.getAttribute('data-isdb') === 'true';

    if (confirm('Deseja realmente excluir esta meta?')) {
        // Animação de saída
        card.style.transform = 'scale(0.9) translateY(10px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.remove();
            
            // Deletar do banco se necessário
            if (isDb && window.db) {
                window.db.delete('activities', id);
                if (window.refreshMentoriaKPIs) window.refreshMentoriaKPIs();
            }
            
            // Recalcular contadores do cabeçalho
            const column = card.closest('div'); // Ajuste conforme estrutura da grid
            if (window.renderWeeklyAgenda) {
                // Idealmente recarregamos a agenda para atalizar contadores
                // mas para performance podemos apenas remover e avisar
            }
        }, 300);
    }
}

window.markTaskCard = function(event, btn, stat) {
    event.stopPropagation();
    const card = btn.closest('.kanban-card');
    const id = card.getAttribute('data-id');
    const isDb = card.getAttribute('data-isdb') === 'true';

    if (stat === 'concluido') {
        if (window.confetti) {
            const rect = btn.getBoundingClientRect();
            confetti({
                particleCount: 40, spread: 50, colors: ['#00B5B5', '#0B193C', '#7c3aed'],
                origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
            });
        }
        if (isDb && window.db) {
            window.db.update('activities', id, { status: 'concluida' });
            if (window.refreshMentoriaKPIs) window.refreshMentoriaKPIs();
        }
    } else if (stat === 'nao_concluido') {
        if (isDb && window.db) {
            window.db.update('activities', id, { status: 'nao_concluido' });
            if (window.refreshMentoriaKPIs) window.refreshMentoriaKPIs();
        }
    } else if (stat === 'desfazer') {
        if (isDb && window.db) {
            window.db.update('activities', id, { status: 'pendente' });
            if (window.refreshMentoriaKPIs) window.refreshMentoriaKPIs();
        }
    }

    renderWeeklyAgenda();
};

// --- LOGICA DO EDITOR DE ESTUDOS (ULTRA PREMIUM) ---
let currentTaskIdForNotes = null;
let currentAttachments = [];
let mediaRecorder = null;
let audioChunks = [];
let savedSelection = null;

// Função para salvar a seleção atual do editor
function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        savedSelection = selection.getRangeAt(0);
    }
}

// Função para restaurar a seleção salva
function restoreSelection() {
    if (savedSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedSelection);
    }
}

// 1. Formatação de Texto (Word Style)
// 1. Formatação de Texto (Word Style) - Refatrado para Alta Precisão
// 1. Formatação de Texto (Word Style) - Refatrado para Alta Precisão (30 Regras)
window.formatDoc = function(cmd, val = null) {
    if (!cmd) return;
    
    const editor = document.getElementById('editorContent');
    editor.focus();

    // Restaurar a seleção antes de aplicar qualquer comando (Regra 3)
    if (savedSelection) {
        restoreSelection();
    }

    // Habilitar CSS para maior precisão (Regra 1)
    document.execCommand('styleWithCSS', false, true);

    try {
        if (cmd === 'fontName' || cmd === 'foreColor' || cmd === 'hiliteColor') {
            // Aplicar comando básico (execCommand lida com seleção ou ponto de inserção)
            document.execCommand(cmd, false, val);
        } else if (cmd === 'fontSize') {
            // Verificar se há equação ativa/selecionada primeiro
            if (applyFontSizeToEquation(val)) return;
            // Document.execCommand('fontSize') só aceita 1-7. 
            // Implementação robusta para PX (Regra 5)
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.style.fontSize = val;
                
                const fragment = range.extractContents();
                span.appendChild(fragment);
                range.insertNode(span);
                
                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                selection.removeAllRanges();
                selection.addRange(newRange);
            } else {
                // Pará próxima digitação (Regra 2)
                document.execCommand('fontSize', false, "3"); // Placeholder
                setTimeout(() => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        let node = selection.anchorNode;
                        if (node.nodeType === 3) node = node.parentElement;
                        if (node && (node.tagName === 'FONT' || node.tagName === 'SPAN')) {
                            node.style.fontSize = val;
                        }
                    }
                }, 0);
            }
        } else if (cmd === 'removeFormat') {
            // Limpeza Seletiva (Regra 9)
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                if (selection.isCollapsed) {
                    // Se não houver seleção, apenas limpa comandos do browser
                    document.execCommand('removeFormat', false, null);
                } else {
                    // Limpeza profunda mantendo estrutura
                    const span = document.createElement('span');
                    span.innerHTML = range.toString(); // Pega apenas o texto puro para simplificar
                    // OU podemos extrair e limpar cada nó
                    const fragment = range.extractContents();
                    
                    // Função recursiva para limpar estilos
                    const cleanNode = (node) => {
                        if (node.nodeType === 1) { // Elemento
                            // Se não for lista ou fórmula, removemos estilos
                            if (node.tagName !== 'UL' && node.tagName !== 'OL' && node.tagName !== 'LI' && !node.classList.contains('formula-inline-container')) {
                                node.removeAttribute('style');
                                // Se for uma tag de estilo pura, transformamos em texto ou removemos
                                if (['B', 'I', 'U', 'STRIKE', 'FONT', 'STRONG', 'EM', 'SUB', 'SUP'].includes(node.tagName)) {
                                    const text = node.innerText;
                                    const textNode = document.createTextNode(text);
                                    node.parentNode.replaceChild(textNode, node);
                                }
                            }
                        }
                        if (node.childNodes) {
                            Array.from(node.childNodes).forEach(cleanNode);
                        }
                    };
                    
                    cleanNode(fragment);
                    range.insertNode(fragment);
                }
            }
        } else {
            // Comandos simples: bold, italic, underline, strikeThrough, subscript, superscript, justify...
            document.execCommand(cmd, false, val);
        }
    } catch (e) {
        console.error('Erro ao formatar:', e);
    }
    saveSelection();
    window.updateToolbarState();
};

// toggleColorPicker — definição única mais abaixo (evitar duplicação)

// applyColor — definição única mais abaixo (evitar duplicação)

window.toggleDropdown = function(id) {
    const dropdown = document.getElementById(id);
    const isHidden = dropdown.classList.contains('hidden');
    
    // Fechar outros dropdowns
    document.querySelectorAll('.list-picker-dropdown, .color-picker-dropdown').forEach(d => d.classList.add('hidden'));
    
    if (isHidden) {
        saveSelection();
        dropdown.classList.remove('hidden');
    }
};

let lastUsedBulletStyle = 'disc';
let lastUsedNumberStyle = 'decimal';

window.switchLibraryTab = function(tab) {
    const numbersTab = document.getElementById('tab-numbers');
    const bulletsTab = document.getElementById('tab-bullets');
    const numbersGrid = document.getElementById('library-numbers');
    const bulletsGrid = document.getElementById('library-bullets');
    
    if (tab === 'numbers') {
        numbersTab.classList.add('text-indigo-600', 'border-indigo-600');
        numbersTab.classList.remove('text-slate-400', 'border-transparent');
        bulletsTab.classList.add('text-slate-400', 'border-transparent');
        bulletsTab.classList.remove('text-indigo-600', 'border-indigo-600');
        
        numbersGrid.classList.remove('hidden');
        bulletsGrid.classList.add('hidden');
    } else {
        bulletsTab.classList.add('text-indigo-600', 'border-indigo-600');
        bulletsTab.classList.remove('text-slate-400', 'border-transparent');
        numbersTab.classList.add('text-slate-400', 'border-transparent');
        numbersTab.classList.remove('text-indigo-600', 'border-indigo-600');
        
        bulletsGrid.classList.remove('hidden');
        numbersGrid.classList.add('hidden');
    }
};

window.applyListStyle = function(type, style) {
    const editor = document.getElementById('editorContent');
    editor.focus();
    restoreSelection();
    
    // 1. TENTATIVA DE CONVERSÃO/REMOÇÃO
    if (style === 'none') {
        const isOL = document.queryCommandState('insertOrderedList');
        const isUL = document.queryCommandState('insertUnorderedList');
        if (isOL) document.execCommand('insertOrderedList', false, null);
        if (isUL) document.execCommand('insertUnorderedList', false, null);
    } else {
        const isOL = document.queryCommandState('insertOrderedList');
        const isUL = document.queryCommandState('insertUnorderedList');
        
        // Converte para o tipo certo se necessário
        if (type === 'OL' && !isOL) document.execCommand('insertOrderedList', false, null);
        else if (type === 'UL' && !isUL) document.execCommand('insertUnorderedList', false, null);
        
        // 2. APLICAÇÃO DO ESTILO (Agressivo com Delay para estabilidade)
        setTimeout(() => {
            const sel = window.getSelection();
            if (!sel.rangeCount) return;
            
            const getList = (node) => {
                if (!node) return null;
                if (node.nodeType === 3) node = node.parentElement;
                return node.closest('ol, ul');
            };

            let list = getList(sel.anchorNode) || getList(sel.focusNode);
            if (!list && sel.rangeCount > 0) {
                list = getList(sel.getRangeAt(0).commonAncestorContainer);
            }

            if (list) {
                // RESET TOTAL DE QUALQUER ESTILO ANTERIOR
                list.className = '';
                list.removeAttribute('type');
                list.style.listStyleType = '';
                list.querySelectorAll('li').forEach(li => {
                    li.style.listStyleType = '';
                    li.removeAttribute('type');
                    li.removeAttribute('value');
                });

                // APLICAÇÃO DE CLASSE (Mapping completo para OL e UL)
                const classMap = {
                    'decimal': 'list-decimal', 'decimal-paren': 'list-decimal-paren',
                    'upper-roman': 'list-upper-roman', 'upper-alpha': 'list-upper-alpha',
                    'upper-alpha-paren': 'list-upper-alpha-paren', 'lower-alpha-paren': 'list-lower-alpha-paren',
                    'lower-alpha': 'list-lower-alpha', 'lower-roman': 'list-lower-roman',
                    'disc': 'list-disc', 'circle': 'list-circle', 'square': 'list-square',
                    'check': 'list-check', 'arrow': 'list-arrow', 'diamond': 'list-diamond',
                    'star': 'list-star', 'dash': 'list-dash'
                };
                if (classMap[style]) list.classList.add(classMap[style]);
                else if (style !== 'none') list.style.setProperty('list-style-type', style, 'important');

                // REFLOW PARA O BROWSER ACORDAR
                const d = list.style.display;
                list.style.display = 'none';
                list.offsetHeight;
                list.style.display = d || 'block';
            }
            saveSelection();
            window.updateToolbarState();
        }, 50);
    }
    
    // Fechar dropdowns
    document.querySelectorAll('.list-picker-dropdown').forEach(d => d.classList.add('hidden'));
    saveSelection();
    window.updateToolbarState();
};

// Toggle List Picker (Floating no body, igual ao color picker)
window.toggleListPicker = function(id) {
    const dropdown = document.getElementById(id);
    const isHidden = dropdown.classList.contains('hidden');
    
    saveSelection();
    
    // Fechar todos os dropdowns de lista
    document.querySelectorAll('.list-picker-dropdown').forEach(d => d.classList.add('hidden'));
    
    if (isHidden) {
        // Na primeira abertura, salvar referência ao botão e mover ao body
        if (!dropdown._lpBtn) {
            dropdown._lpBtn = dropdown.previousElementSibling || dropdown.parentElement.querySelector('button');
            document.body.appendChild(dropdown);
        }
        
        dropdown.classList.remove('hidden');
        
        const btn = dropdown._lpBtn;
        if (btn) {
            const rect = btn.getBoundingClientRect();
            let top = rect.bottom + 4;
            let left = rect.left;
            
            const dropW = dropdown.offsetWidth;
            const dropH = dropdown.offsetHeight;
            
            if (left + dropW > window.innerWidth - 12) {
                left = window.innerWidth - dropW - 12;
            }
            if (left < 8) left = 8;
            
            if (top + dropH > window.innerHeight - 12) {
                top = rect.top - dropH - 4;
            }
            
            dropdown.style.top = top + 'px';
            dropdown.style.left = left + 'px';
        }
    }
};

// Gerenciamento de Teclado para Listas (Regra 4)
// Envolvido em DOMContentLoaded porque o script carrega ANTES do #editorContent no HTML
document.addEventListener('DOMContentLoaded', () => {
    const editorContentEl = document.getElementById('editorContent');
    if (editorContentEl) editorContentEl.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const sel = window.getSelection();
            if (!sel.rangeCount) return;

            let node = sel.anchorNode;
            if (node.nodeType === 3) node = node.parentElement;
            const list = node.closest('ol, ul');

            if (list) {
                const cmd = e.shiftKey ? 'outdent' : 'indent';
                document.execCommand(cmd, false, null);
                
                // Sanitização imediata pós-indentação
                setTimeout(() => {
                    const anchor = window.getSelection().anchorNode;
                    if (!anchor) return;
                    const el = anchor.nodeType === 3 ? anchor.parentElement : anchor;
                    const newList = el ? el.closest('ol, ul') : null;
                    if (newList && newList !== list) {
                        newList.className = list.className;
                        if (list.getAttribute('type')) newList.setAttribute('type', list.getAttribute('type'));
                        if (list.style.listStyleType) newList.style.listStyleType = list.style.listStyleType;
                    }
                }, 10);
            } else {
                document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        }

        // Backspace / Delete para remover equações inteiras
        if (e.key === 'Backspace' || e.key === 'Delete') {
            const sel = window.getSelection();
            if (!sel.rangeCount || !sel.isCollapsed) return;
            
            const anchorNode = sel.anchorNode;
            const offset = sel.anchorOffset;
            
            let formulaToRemove = null;
            
            if (e.key === 'Backspace') {
                // Caso 1: cursor em text node logo após a equação (incluindo zero-width space)
                if (anchorNode.nodeType === 3) {
                    const text = anchorNode.textContent;
                    // Se estamos no início do text node OU o texto é só zero-width space
                    if (offset <= 1 && (text === '\u200B' || text.trim() === '')) {
                        const prevSibling = anchorNode.previousSibling;
                        if (prevSibling && prevSibling.classList && prevSibling.classList.contains('formula-inline-container')) {
                            formulaToRemove = prevSibling;
                            // Também remover o text node zero-width
                            anchorNode.remove();
                        }
                    } else if (offset === 0) {
                        const prevSibling = anchorNode.previousSibling;
                        if (prevSibling && prevSibling.classList && prevSibling.classList.contains('formula-inline-container')) {
                            formulaToRemove = prevSibling;
                        }
                    }
                }
                // Caso 2: cursor num element node antes de um formula-container
                if (!formulaToRemove && anchorNode.nodeType === 1 && offset > 0) {
                    const prevChild = anchorNode.childNodes[offset - 1];
                    if (prevChild && prevChild.classList && prevChild.classList.contains('formula-inline-container')) {
                        formulaToRemove = prevChild;
                    }
                }
            }
            
            if (e.key === 'Delete') {
                // Caso: cursor antes da equação
                if (anchorNode.nodeType === 3 && offset === anchorNode.textContent.length) {
                    const nextSibling = anchorNode.nextSibling;
                    if (nextSibling && nextSibling.classList && nextSibling.classList.contains('formula-inline-container')) {
                        formulaToRemove = nextSibling;
                    }
                }
                if (!formulaToRemove && anchorNode.nodeType === 1) {
                    const nextChild = anchorNode.childNodes[offset];
                    if (nextChild && nextChild.classList && nextChild.classList.contains('formula-inline-container')) {
                        formulaToRemove = nextChild;
                    }
                }
            }
            
            if (formulaToRemove) {
                e.preventDefault();
                // Limpar referência do activeMathField se for este
                const mf = formulaToRemove.querySelector('math-field');
                if (mf && activeMathField === mf) activeMathField = null;
                // Remover zero-width space adjacente se existir
                const nextNode = formulaToRemove.nextSibling;
                if (nextNode && nextNode.nodeType === 3 && nextNode.textContent === '\u200B') {
                    nextNode.remove();
                }
                formulaToRemove.remove();
                // Esconder ribbon se não houver mais campos ativos
                if (!activeMathField) {
                    document.getElementById('math-ribbon').classList.add('hidden');
                }
            }
        }
    });
});

window.changeFontSize = function(delta) {
    const scale = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    const select = document.getElementById('fontSizeSelect');
    let currentVal = parseInt(select.value);
    
    // Encontrar o índice atual ou o mais próximo na escala
    let currentIdx = scale.findIndex(s => s >= currentVal);
    if (currentIdx === -1) currentIdx = scale.length - 1;
    
    let nextIdx = currentIdx + delta;
    if (nextIdx >= 0 && nextIdx < scale.length) {
        const newVal = scale[nextIdx] + 'px';
        select.value = newVal;
        
        // Verificar se há equação ativa ou selecionada
        if (applyFontSizeToEquation(newVal)) return;
        
        window.formatDoc('fontSize', newVal);
    }
};

// Aplica fontSize em equações (math-field) ativas ou selecionadas
function applyFontSizeToEquation(sizeVal) {
    // Caso 1: math-field ativo em foco
    if (activeMathField) {
        activeMathField.style.fontSize = sizeVal;
        const container = activeMathField.closest('.formula-inline-container');
        if (container) container.style.fontSize = sizeVal;
        return true;
    }
    
    // Caso 2: seleção contém equações
    const sel = window.getSelection();
    if (!sel.rangeCount) return false;
    
    const range = sel.getRangeAt(0);
    const editor = document.getElementById('editorContent');
    if (!editor) return false;
    
    // Verificar se a seleção inclui formula-inline-container
    let found = false;
    const containers = editor.querySelectorAll('.formula-inline-container');
    containers.forEach(container => {
        if (range.intersectsNode(container)) {
            const mf = container.querySelector('math-field');
            if (mf) {
                mf.style.fontSize = sizeVal;
                container.style.fontSize = sizeVal;
                found = true;
            }
        }
    });
    
    return found;
}

// Atualizar botões ativos na barra (Regra 27 - Active Stat)
window.updateToolbarState = function() {
    const commands = [
        { id: 'btn-bold', cmd: 'bold' },
        { id: 'btn-italic', cmd: 'italic' },
        { id: 'btn-underline', cmd: 'underline' },
        { id: 'btn-strikethrough', cmd: 'strikeThrough' },
        { id: 'btn-subscript', cmd: 'subscript' },
        { id: 'btn-superscript', cmd: 'superscript' },
        { id: 'btn-justifyLeft', cmd: 'justifyLeft' },
        { id: 'btn-justifyCenter', cmd: 'justifyCenter' },
        { id: 'btn-justifyRight', cmd: 'justifyRight' },
        { id: 'btn-justifyFull', cmd: 'justifyFull' },
        { id: 'btn-unorderedList', cmd: 'insertUnorderedList' },
        { id: 'btn-orderedList', cmd: 'insertOrderedList' }
    ];

    commands.forEach(c => {
        const btn = document.getElementById(c.id);
        if (btn) {
            try {
                if (document.queryCommandState(c.cmd)) {
                    btn.classList.add('bg-indigo-50', 'text-indigo-600');
                    btn.classList.remove('text-slate-600');
                } else {
                    btn.classList.remove('bg-indigo-50', 'text-indigo-600');
                    btn.classList.add('text-slate-600');
                }
            } catch(e) {}
        }
    });

    // Destacar opção ativa nos dropdowns de lista
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let node = selection.anchorNode;
        if (node && node.nodeType === 3) node = node.parentElement;
        const list = node ? node.closest('ol, ul') : null;
        
        // Limpar destaques anteriores
        document.querySelectorAll('.list-style-option').forEach(opt => opt.classList.remove('active', 'bg-indigo-50', 'border-indigo-200'));

        if (list) {
            let currentStyle = list.style.listStyleType || 'none';
            if (list.classList.contains('list-check')) currentStyle = 'check';
            else if (list.classList.contains('list-arrow')) currentStyle = 'arrow';
            else if (list.classList.contains('list-diamond')) currentStyle = 'diamond';
            else if (list.classList.contains('list-decimal-paren')) currentStyle = 'decimal-paren';
            else if (list.classList.contains('list-lower-alpha-paren')) currentStyle = 'lower-alpha-paren';
            else if (list.classList.contains('list-upper-alpha-paren')) currentStyle = 'upper-alpha-paren';
            else if (list.classList.contains('list-decimal')) currentStyle = 'decimal';
            else if (list.classList.contains('list-upper-alpha')) currentStyle = 'upper-alpha';
            else if (list.classList.contains('list-lower-alpha')) currentStyle = 'lower-alpha';
            else if (list.classList.contains('list-upper-roman')) currentStyle = 'upper-roman';
            else if (list.classList.contains('list-lower-roman')) currentStyle = 'lower-roman';
            else if (list.getAttribute('type')) {
                const t = list.getAttribute('type');
                if (t === 'A') currentStyle = 'upper-alpha';
                else if (t === 'a') currentStyle = 'lower-alpha';
                else if (t === 'I') currentStyle = 'upper-roman';
                else if (t === 'i') currentStyle = 'lower-roman';
                else if (t === '1') currentStyle = 'decimal';
            }

            // Encontrar e destacar a opção no dropdown
            const type = list.tagName;
            document.querySelectorAll(`.list-style-option[onclick*="'${type}'"][onclick*="'${currentStyle}'"]`).forEach(opt => {
                opt.classList.add('active', 'bg-indigo-50', 'border-indigo-200');
            });
        }
    }

    // Sincronizar Seletores e Previews
    try {
        const fontName = document.queryCommandValue('fontName').replace(/"/g, "");
        const foreColor = document.queryCommandValue('foreColor');
        const backColor = document.queryCommandValue('backColor');
        
        const fontSelect = document.getElementById('fontFamilySelect');
        if (fontSelect && fontName && fontName !== 'undefined') {
            fontSelect.value = fontName;
        }

        if (foreColor) {
            const preview = document.getElementById('textColorPreview');
            if (preview) preview.style.backgroundColor = foreColor;
        }

        if (backColor && backColor !== 'transparent' && backColor !== 'rgba(0, 0, 0, 0)') {
            const preview = document.getElementById('highlightPreview');
            if (preview) preview.style.backgroundColor = backColor;
        } else {
            const preview = document.getElementById('highlightPreview');
            if (preview) preview.style.backgroundColor = 'transparent';
        }
    } catch(e) {}
};

// Listeners de toolbar — definição única mais abaixo (evitar duplicação)

window.changeCase = function(type) {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
        // Alerta discreto customizado (Regra 8)
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#0B193C] text-white px-6 py-3 rounded-full text-[11px] font-bold shadow-2xl z-[2000] animate-bounce';
        toast.innerText = "Selecione um texto para alterar maiúsculas/minúsculas.";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
        return;
    }

    const range = selection.getRangeAt(0);
    const content = range.toString();
    if (!content) return;

    let newText = "";
    if (type === 'upper') newText = content.toUpperCase();
    else if (type === 'lower') newText = content.toLowerCase();
    else if (type === 'capitalize') {
        newText = content.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    } else if (type === 'toggle') {
        newText = content.split('').map(c => 
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        ).join('');
    }

    const span = document.createElement('span');
    span.textContent = newText;
    
    // Manter estilos do pai se possível
    range.deleteContents();
    range.insertNode(span);
    
    // Reposicionar seleção
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
    saveSelection();
};

// 2. Sistema de Anexos
window.triggerFileAttach = function() {
    document.getElementById('editorFileInput').click();
};

window.handleFileAttach = async function(input) {
    const files = Array.from(input.files);
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = {
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                base64: e.target.result,
                size: (file.size / 1024).toFixed(1) + ' KB'
            };
            currentAttachments.push(fileData);
            renderAttachmentCard(fileData);
        };
        reader.readAsDataURL(file);
    }
    input.value = ''; // Limpar input
};

function renderAttachmentCard(file) {
    const container = document.getElementById('editorAttachments');
    const isAudio = file.type.includes('audio');
    const isImage = file.type.includes('image');
    const isPdf = file.type.includes('pdf');
    const isDoc = file.type.includes('word') || file.type.includes('msword') || file.type.includes('officedocument');
    
    let icon = 'description';
    if (isAudio) icon = 'headset';
    else if (isPdf) icon = 'picture_as_pdf';
    else if (isDoc) icon = 'description';
    
    const card = document.createElement('div');
    card.className = `attachment-card ${isImage ? 'is-image' : ''}`;
    card.id = `attach-${file.id}`;
    
    let mediaHtml = `<span class="material-symbols-outlined">${icon}</span>`;
    if (isImage && file.base64) {
        mediaHtml = `<img src="${file.base64}" alt="thumbnail" style="width: 100%; height: 100%; object-fit: contain; background: white;">`;
    }

    card.innerHTML = `
        <div class="attachment-icon">
            ${mediaHtml}
        </div>
        <div class="attachment-info">
            <span class="attachment-name" title="${file.name}">${file.name}</span>
            <span class="attachment-size">${file.size}</span>
        </div>
        <div class="attachment-delete" onclick="removeAttachment('${file.id}')" title="Excluir">
            <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
        </div>
        ${isImage ? `
        <div class="attachment-insert-btn" onclick="insertImageToEditor('${file.base64}')" title="Inserir no texto">
            <span class="material-symbols-outlined" style="font-size: 18px;">add_photo_alternat</span>
        </div>` : ''}
    `;
    
    if (isAudio && card.querySelector('.attachment-info')) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = file.base64;
        audio.className = 'mt-2 w-full h-8 scale-90 origin-left';
        card.querySelector('.attachment-info').appendChild(audio);
    }
    
    container.appendChild(card);
}

window.removeAttachment = function(id) {
    currentAttachments = currentAttachments.filter(a => String(a.id) !== String(id));
    const el = document.getElementById(`attach-${id}`);
    if (el) el.remove();
};

window.insertImageToEditor = function(datUrl) {
    const editor = document.getElementById('editorContent');
    editor.focus();
    
    // Restaurar seleção se existir
    restoreSelection();
    
    // Inserir imagem
    document.execCommand('insertImage', false, datUrl);
    
    // Adicionar classe para permitir redimensionamento (opcional, ajuda no CSS)
    const imgs = editor.getElementsByTagName('img');
    const lastImg = imgs[imgs.length - 1];
    if (lastImg) {
        lastImg.style.maxWidth = '100%';
        lastImg.style.cursor = 'nwse-resize';
    }
};

// 3. Gravador de Áudio
window.toggleAudioRecording = async function() {
    const btn = document.getElementById('audioRecordBtn');
    
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onload = (e) => {
                    const audioData = {
                        id: Date.now(),
                        name: `Gravação_${new Date().toLocaleTimeString()}.webm`,
                        type: 'audio/webm',
                        base64: e.target.result,
                        size: (audioBlob.size / 1024).toFixed(1) + ' KB'
                    };
                    currentAttachments.push(audioData);
                    renderAttachmentCard(audioData);
                };
                reader.readAsDataURL(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            btn.classList.add('recording-pulse', 'text-rose-600', 'bg-rose-50');
            btn.querySelector('span').innerText = 'stop_circle';
        } catch (err) {
            alert('Permissão de microfone negada ou não disponível.');
        }
    } else {
        mediaRecorder.stop();
        btn.classList.remove('recording-pulse', 'text-rose-600', 'bg-rose-50');
        btn.querySelector('span').innerText = 'mic';
    }
};

// 4. Fórmulas Matemáticas Avançadas (MathLive - Estilo Word)
let editingFormulaElement = null;

window.insertFormula = function() {
    editingFormulaElement = null;
    const modal = document.getElementById('formulaModal');
    const mf = document.getElementById('formulaMathField');
    
    mf.value = ''; // Limpa
    modal.classList.remove('hidden');
    
    // Forçar renderização do KaTeX nos botões e símbolos
    setTimeout(() => {
        if (window.renderMathInElement) {
            renderMathInElement(modal, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError : false
            });
        }
        mf.focus();
    }, 200); // 200ms para garantir que o DOM está visível
};

// 4. Editor de Equações Premium (Office Style)
let activeMathField = null; 

// Toggle de categorias matemáticas (dropdowns Word-style)
window.toggleMathCat = function(btnEl) {
    const cat = btnEl.closest('.math-cat');
    const dropdown = cat.querySelector('.math-cat-dropdown');
    const isOpen = dropdown.classList.contains('show');
    
    // Fechar todas as outras
    document.querySelectorAll('.math-cat-dropdown.show').forEach(d => d.classList.remove('show'));
    
    if (!isOpen) {
        dropdown.classList.add('show');
    }
};

// Fechar dropdowns ao clicar fora
document.addEventListener('mousedown', function(e) {
    if (!e.target.closest('.math-cat')) {
        document.querySelectorAll('.math-cat-dropdown.show').forEach(d => d.classList.remove('show'));
    }
});

window.toggleMathRibbon = function() {
    const ribbon = document.getElementById('math-ribbon');
    const sigmaBtn = document.getElementById('sigmaBtn');
    
    if (ribbon.classList.contains('hidden')) {
        // Ativar Ribbon
        ribbon.classList.remove('hidden');
        sigmaBtn.classList.add('bg-indigo-600', 'text-white');
        sigmaBtn.classList.remove('bg-indigo-50/50', 'text-indigo-600');
        
        // Renderizar KaTeX na ribbon
        renderMathInElementRecursive(ribbon);
        
        // Se não houver um campo atvo, criar um novo inline
        if (!activeMathField) {
            window.insertInlineEquation();
        }
    } else {
        // Desativar Ribbon
        ribbon.classList.add('hidden');
        sigmaBtn.classList.remove('bg-indigo-600', 'text-white');
        sigmaBtn.classList.add('bg-indigo-50/50', 'text-indigo-600');
        closeAllMathDropdowns();
    }
};

window.insertInlineEquation = function() {
    // Verificar se MathLive carregou (custom element registrado)
    if (!customElements.get('math-field')) {
        console.log('MathLive ainda carregando, aguardando...');
        customElements.whenDefined('math-field').then(() => {
            window.insertInlineEquation();
        });
        return;
    }
    
    const editor = document.getElementById('editorContent');
    editor.focus();
    
    // Restaurar seleção salva para garantir inserção no lugar certo
    restoreSelection();
    
    const mfContainer = document.createElement('span');
    mfContainer.className = 'formula-inline-container is-editing';
    mfContainer.contentEditable = "false";
    
    const newMf = document.createElement('math-field');
    newMf.style.cssText = 'font-size:inherit; min-width:15px; display:inline-block; margin:0; padding:0; border:none; outline:none;';
    
    // Configurar MathLive para UI 100% limpa (sem teclado, sem menu, sem ícones)
    newMf.setAttribute('math-virtual-keyboard-policy', 'manual');
    newMf.setAttribute('virtual-keyboard-mode', 'off');
    newMf.setAttribute('menu-items', '[]');
    newMf.setAttribute('smart-mode', '');
    
    newMf.onfocus = () => {
        activeMathField = newMf;
        mfContainer.classList.add('is-editing');
        newMf.removeAttribute('read-only');
        document.getElementById('math-ribbon').classList.remove('hidden');
    };
    
    newMf.onblur = () => {
        setTimeout(() => {
            if (document.activeElement !== newMf && !newMf.contains(document.activeElement)) {
                // Esconder teclado virtual do MathLive
                try { window.mathVirtualKeyboard.visible = false; } catch(e) {}
                
                if (!newMf.value || !newMf.value.trim()) {
                    mfContainer.remove();
                    if (activeMathField === newMf) activeMathField = null;
                } else {
                    mfContainer.classList.remove('is-editing');
                    newMf.setAttribute('read-only', '');
                    if (activeMathField === newMf) activeMathField = null;
                }
                // Esconder ribbon se nenhum campo ativo
                if (!activeMathField) {
                    document.getElementById('math-ribbon').classList.add('hidden');
                }
            }
        }, 250);
    };
    
    // Clique no container reativa edição
    mfContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        mfContainer.classList.add('is-editing');
        newMf.removeAttribute('read-only');
        newMf.focus();
    });
    
    mfContainer.appendChild(newMf);
    
    // Inserir no cursor
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(mfContainer);
        
        // Criar nó de texto após a equação para o cursor pousar
        const textAfter = document.createTextNode('\u200B');
        mfContainer.parentNode.insertBefore(textAfter, mfContainer.nextSibling);
        
        // Mover cursor para o texto após a equação
        const newRange = document.createRange();
        newRange.setStart(textAfter, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
    
    activeMathField = newMf;
    setTimeout(() => newMf.focus(), 50);
};

// Insere LaTeX no campo de equação ativo (MathLive)
window.insertToWorkspace = function(latex) {
    // Salvar seleção antes de qualquer operação
    saveSelection();
    
    // Se não houver campo ativo, criar um novo
    if (!activeMathField) {
        window.insertInlineEquation();
    }
    
    // Aguardar o campo ficar pronto e inserir
    const delay = activeMathField ? 50 : 200;
    setTimeout(() => {
        if (activeMathField) {
            activeMathField.focus();
            // Usar a API insert do MathLive
            try {
                activeMathField.insert(latex, { focus: true, feedback: true });
            } catch(e) {
                // Fallback: append ao valor atual
                try {
                    const current = activeMathField.value || '';
                    activeMathField.value = current + latex;
                } catch(e2) {
                    console.error('Erro ao inserir LaTeX:', e2);
                }
            }
        }
    }, delay);
};

window.toggleMathDropdown = function(id) {
    const dropdown = document.getElementById(id);
    const btn = document.querySelector(`[onclick="toggleMathDropdown('${id}')"]`);
    const wasActive = dropdown.classList.contains('active');
    
    // Fechar todos antes
    closeAllMathDropdowns();
    
    if (!wasActive) {
        dropdown.classList.add('active');
        if (btn) btn.classList.add('active');
        renderMathInElementRecursive(dropdown);
    }
};

function closeAllMathDropdowns() {
    document.querySelectorAll('.math-dropdown-premium').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.ribbon-btn-premium').forEach(b => b.classList.remove('active'));
}

window.insertToWorkspace = function(latx) {
    if (!activeMathField) {
        window.insertInlineEquation();
    }
    const mf = activeMathField;
    if (mf) {
        mf.insert(latx, {
            focus: true,
            feedback: true,
            mode: 'math',
            format: 'latex'
        });
    }
    closeAllMathDropdowns();
};


function renderMathInElementRecursive(el) {
    if (window.renderMathInElement) {
        window.renderMathInElement(el, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ],
            throwOnError: false
        });
    }
}

window.toggleColorPicker = function(id) {
    const dropdown = document.getElementById(id);
    const isHidden = dropdown.classList.contains('hidden');
    
    // Salvar seleção antes de abrir para não perder o foco
    saveSelection();
    
    // Fechar todos os dropdowns de cor primeiro
    document.querySelectorAll('.color-picker-dropdown').forEach(d => d.classList.add('hidden'));
    
    if (isHidden) {
        // Na primeira abertura, encontrar o botão e salvar referência, mover dropdown ao body
        if (!dropdown._cpBtn) {
            // O botão é o irmão anterior antes de mover ao body
            dropdown._cpBtn = dropdown.previousElementSibling || dropdown.parentElement.querySelector('button');
            // Mover ao body para escapar do transform do modal
            document.body.appendChild(dropdown);
        }
        
        dropdown.classList.remove('hidden');
        
        const btn = dropdown._cpBtn;
        if (btn) {
            const rect = btn.getBoundingClientRect();
            let top = rect.bottom + 4;
            let left = rect.left;
            
            // Medir o dropdown após exibido
            const dropW = dropdown.offsetWidth;
            const dropH = dropdown.offsetHeight;
            
            // Ajustar se ultrapassar a direita da tela
            if (left + dropW > window.innerWidth - 12) {
                left = window.innerWidth - dropW - 12;
            }
            if (left < 8) left = 8;
            
            // Ajustar se ultrapassar o fundo da tela
            if (top + dropH > window.innerHeight - 12) {
                top = rect.top - dropH - 4;
            }
            
            dropdown.style.top = top + 'px';
            dropdown.style.left = left + 'px';
        }
    }
};

window.applyColor = function(color, cmd) {
    const editor = document.getElementById('editorContent');
    editor.focus();
    
    // Restaura a seleção que foi salva ao abrir o dropdown ou antes do clique
    restoreSelection();
    
    // Se a cor for "Automático" (transparent ou inherit), usamos comandos específicos
    let colorValue = color;
    if (color === 'transparent' && cmd === 'foreColor') colorValue = 'inherit';

    // Aplica a formatação
    window.formatDoc(cmd, colorValue);
    
    // Atualizar preview visual na barra
    if (cmd === 'foreColor') {
        document.getElementById('textColorPreview').style.backgroundColor = color === 'inherit' ? '#000' : color;
    } else if (cmd === 'hiliteColor') {
        document.getElementById('highlightPreview').style.backgroundColor = color === 'transparent' ? 'transparent' : color;
    }
    
    // Salvar nova seleção após aplicar (caso tenha mudado)
    saveSelection();
    
    // Fechar dropdown
    document.querySelectorAll('.color-picker-dropdown').forEach(d => d.classList.add('hidden'));
};

// Fechar paletas e dropdowns ao clicar fora
document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.color-picker-dropdown') && !e.target.closest('.list-picker-dropdown') && !e.target.closest('.relative') && !e.target.closest('.cp-swatch') && !e.target.closest('.cp-auto-btn') && !e.target.closest('.lp-option') && !e.target.closest('.lp-option-none')) {
        document.querySelectorAll('.color-picker-dropdown, .list-picker-dropdown').forEach(p => p.classList.add('hidden'));
    }
    if (!e.target.closest('.ribbon-group') && !e.target.closest('.math-ribbon-premium')) {
        closeAllMathDropdowns();
    }
});

const style = document.createElement('style');
style.innerHTML = `
    .animate-hourglass-premium {
        animation: hourglass-flow 3s infinite linear;
    }
    @keyframes hourglass-flow {
        0% { transform: rotate(0deg); }
        45% { transform: rotate(0deg); }
        55% { transform: rotate(180deg); }
        100% { transform: rotate(180deg); }
    }
`;
document.head.appendChild(style);

// Detectar duplo clique no editor para editar fórmulas (MathLive Reload)
document.addEventListener('DOMContentLoaded', () => {
    const editorForDblClick = document.getElementById('editorContent');
    if (editorForDblClick) editorForDblClick.addEventListener('dblclick', function(e) {
        const target = e.target.closest('.formula-card');
        if (target) {
            editingFormulaElement = target;
            const latex = target.getAttribute('data-latex');
            document.getElementById('formulaModal').classList.remove('hidden');
            
            setTimeout(() => {
                const mf = document.getElementById('formulaMathField');
                mf.value = latex;
                mf.focus();
            }, 100);
        }
    });
    
    // Click handler: garante cursor visível ao clicar fora de equação
    if (editorForDblClick) editorForDblClick.addEventListener('click', function(e) {
        // Se clicou numa equação, ignorar (o handler do math-field já cuida)
        if (e.target.closest('.formula-inline-container')) return;
        if (e.target.tagName === 'MATH-FIELD') return;
        
        const editor = this;
        
        // Verificar se o editor está vazio ou se o último nó é uma equação
        const lastChild = editor.lastChild;
        if (lastChild && lastChild.classList && lastChild.classList.contains('formula-inline-container')) {
            // Adicionar nó de texto após a última equação
            const textNode = document.createTextNode('\u200B');
            editor.appendChild(textNode);
            const range = document.createRange();
            range.setStart(textNode, 1);
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return;
        }
        
        // Garantir que o cursor esteja visível após clicar
        setTimeout(() => {
            const sel = window.getSelection();
            if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
                // Se o cursor não ficou dentro do editor, posicionar no final
                const range = document.createRange();
                if (editor.lastChild) {
                    if (editor.lastChild.nodeType === 3) {
                        range.setStart(editor.lastChild, editor.lastChild.textContent.length);
                    } else {
                        range.setStartAfter(editor.lastChild);
                    }
                } else {
                    range.setStart(editor, 0);
                }
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }, 10);
    });
});

// 5. Abertura e Fechamento do Modal Principal de Notas
window.openNotesModal = function(event, btn) {
    event.stopPropagation();
    
    const modal = document.getElementById('notesModal');
    const content = document.getElementById('notesModalContent');
    const editor = document.getElementById('editorContent');
    const attachments = document.getElementById('editorAttachments');
    const subjectLabel = document.getElementById('notesSubjectTitle');

    // RESET TOTAL ANTES DE CARREGAR
    editor.innerHTML = '';
    attachments.innerHTML = '';
    currentAttachments = [];
    currentTaskIdForNotes = null;
    savedSelection = null;
    activeMathField = null;

    const card = btn.closest('.kanban-card');
    const id = card.getAttribute('data-id');
    const title = card.querySelector('h4').innerText;
    
    currentTaskIdForNotes = id;
    subjectLabel.innerText = title;
    
    // Carregar do banco
    if (window.db) {
        const activities = window.db.get('activities') || [];
        const task = activities.find(a => String(a.id) === String(id));
        
        if (task) {
            editor.innerHTML = task.notesHtml || task.notes || '';
            if (task.attachments) {
                currentAttachments = [...task.attachments];
                currentAttachments.forEach(renderAttachmentCard);
            }
        }
    }

    modal.classList.remove('hidden');
    
    // Resetar previews da barra para padrão Word
    const textPreview = document.getElementById('textColorPreview');
    const highPreview = document.getElementById('highlightPreview');
    if (textPreview) textPreview.style.backgroundColor = '#000000';
    if (highPreview) highPreview.style.backgroundColor = '#ffff00';
    
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
        window.updateToolbarState();
    }, 10);
};

window.closeNotesModal = function() {
    const modal = document.getElementById('notesModal');
    const content = document.getElementById('notesModalContent');
    const editor = document.getElementById('editorContent');
    const attachments = document.getElementById('editorAttachments');
    
    // Animação de saída
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => { 
        modal.classList.add('hidden'); 
        
        // LIMPEZA TOTAL PARA EVITAR PERSISTÊNCIA DE RASCUNHOS NÃO SALVOS
        if (editor) editor.innerHTML = '';
        if (attachments) attachments.innerHTML = '';
        
        currentTaskIdForNotes = null;
        currentAttachments = [];
        savedSelection = null;
        activeMathField = null;
        
        // Ocultar ribbon de matemática se estiver aberta
        const ribbon = document.getElementById('math-ribbon');
        if (ribbon) ribbon.classList.add('hidden');
    }, 300);
};

// Listeners para o Editor
document.addEventListener('selectionchange', () => {
    if (document.activeElement.id === 'editorContent') {
        saveSelection();
        window.updateToolbarState();
    }
});

const editorEl = document.getElementById('editorContent');
if (editorEl) {
    editorEl.addEventListener('keyup', () => {
        saveSelection();
        window.updateToolbarState();
    });
    editorEl.addEventListener('mouseup', () => {
        saveSelection();
        window.updateToolbarState();
    });
}

window.saveTaskNotes = function() {
    if (!currentTaskIdForNotes || !window.db) return;
    
    const htmlContent = document.getElementById('editorContent').innerHTML;
    
    window.db.update('activities', currentTaskIdForNotes, { 
        notesHtml: htmlContent,
        attachments: currentAttachments,
        updatedAt: new Date().toISOString()
    });
    
    const saveBtn = document.querySelector('#notesModalContent button[onclick="saveTaskNotes()"]');
    const originalContent = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> SALVO!';
    saveBtn.classList.replace('bg-amber-500', 'bg-emerald-500');
    
    setTimeout(() => {
        saveBtn.innerHTML = originalContent;
        saveBtn.classList.replace('bg-emerald-500', 'bg-amber-500');
        closeNotesModal();
        renderWeeklyAgenda();
    }, 1000);
};

function renderWeeklyAgenda() {
    const endOfWeek = new Date(currentWeekStart.getTime() + (6 * msInDay));
    const lblSemana = document.getElementById('lblSemana');
    const realSunday = getSunday(currentDate);

    if (lblSemana) {
        lblSemana.innerText = (realSunday.getTime() === currentWeekStart.getTime()) ? "SEMANA ATUAL" : "VISUALIZANDO";
    }

    const dateRangeEl = document.getElementById('weekDateRange');
    if (dateRangeEl) {
        const startStr = currentWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
        const endStr   = endOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
        dateRangeEl.innerHTML = `${startStr} A ${endStr}`;
    }

    const grid = document.getElementById('weeklyAgendaGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const daysNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    for (let i = 0; i < 7; i++) {
        let colDate = new Date(currentWeekStart.getTime() + (i * msInDay));
        let isToday = (colDate.toDateString() === currentDate.toDateString());
        let isPast  = colDate.getTime() < currentDate.getTime() && !isToday;
        let dStr    = colDate.getFullYear() + '-' + String(colDate.getMonth()+1).padStart(2,'0') + '-' + String(colDate.getDate()).padStart(2,'0');

        let allActivities = window.db ? (window.db.get('activities') || []) : [];
        let dailyTasks    = allActivities.filter(a => a.date === dStr);
        let concluded     = dailyTasks.filter(a => a.status === 'concluida' || a.status === 'concluída').length;

        const dayNamesPt = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const dayShort   = dayNamesPt[i];
        const dayNum     = colDate.getDate();
        const monthStr   = colDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
        
        // Estilização Bem Definida para o dia de hoje
        const isTodayContainer = isToday ? 'bg-white shadow-lg ring-2 ring-[#00B5B5]/40' : 'bg-slate-50/50';
        const progressPercent = dailyTasks.length > 0 ? (concluded / dailyTasks.length) * 100 : 0;
        
        const headerHTML = `
            <div class="flex flex-col items-center pt-3 pb-2 px-4 bg-[#D6EEF2] rounded-t-[28px] mb-2 border-b border-white/20">
                <!-- Selo de Dat -->
                <div class="w-10 h-10 bg-[#00B5B5] rounded-xl flex flex-col items-center justify-center text-white mb-1 shadow-sm">
                    <span class="text-[13px] font-black leading-none">${colDate.getDate()}</span>
                    <span class="text-[7px] font-bold uppercase tracking-tighter opacity-80">${colDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.','').toUpperCase()}</span>
                </div>

                <!-- Nome do Dia -->
                <div class="flex items-center gap-2 mb-1">
                    <div class="w-2 h-2 rounded-full bg-[#00B5B5] opacity-20"></div>
                    <span class="text-[13px] font-black text-[#006B6B] uppercase tracking-widest" style="font-family: 'Playfair Display', serif;">
                        ${daysNames[i] === 'Dom' ? 'DOMINGO' : 
                          daysNames[i] === 'Seg' ? 'SEGUNDA' : 
                          daysNames[i] === 'Ter' ? 'TERÇA' : 
                          daysNames[i] === 'Qua' ? 'QUARTA' : 
                          daysNames[i] === 'Qui' ? 'QUINTA' : 
                          daysNames[i] === 'Sex' ? 'SEXTA' : 'SÁBADO'}
                    </span>
                </div>

                <!-- Barra de Progresso -->
                <div class="w-full h-1 bg-slate-200/50 rounded-full overflow-hidden mb-1">
                    <div class="h-full bg-[#00B5B5] transition-all duration-1000" style="width: ${progressPercent}%"></div>
                </div>

                <!-- Contador -->
                <div class="text-[9px] font-black text-[#64748B] uppercase tracking-widest">
                    ${concluded}/${dailyTasks.length} METAS
                </div>
            </div>
        `;

        // Tasks
        let tasksHTML = '';
        if (dailyTasks.length > 0) {
            dailyTasks.forEach(a => {
                tasksHTML += createCardHTML({
                    id: a.id,
                    dbRecord: true,
                    tag: a.discipline,
                    title: a.subject,
                    priority: a.priority || 'média',
                    status: a.status === 'concluída' || a.status === 'concluida'
                        ? 'Concluído'
                        : (a.status === 'nao_concluido' ? 'Não Concluído' : 'Pendente'),
                    hasNotes: !!(a.notesHtml && a.notesHtml.trim() !== '')
                });
            });
        }

        grid.innerHTML += `
            <div class="flex flex-col gap-0 transition-all duration-500 agenda-day-column ${isTodayContainer} ${isPast ? 'opacity-50 grayscale-[0.3]' : ''}" 
                 style="height: 605px !important; overflow: hidden !important; border-radius: 28px !important; background-color: #ffffff !important; border: 1px solid rgba(0, 181, 181, 0.1);">
                ${headerHTML}
                <div class="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar agenda-scroll-container px-4 pb-5">
                    ${tasksHTML}
                    ${dailyTasks.length === 0 ? `
                        <div class="flex flex-col items-center justify-center py-10 opacity-20">
                            <span class="material-symbols-outlined text-[32px] mb-2">event_busy</span>
                            <span class="text-[10px] font-black uppercase tracking-widest">Sem Metas</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

function agendaPrev() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeeklyAgenda();
}

function agendaNext() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeeklyAgenda();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('weeklyAgendaGrid')) {
        renderWeeklyAgenda();
    }
});
