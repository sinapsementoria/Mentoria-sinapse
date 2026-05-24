class RichTextEditor {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = options;
        this.id = options.id || containerId;
        this.placeholder = options.placeholder || 'Comece a digitar...';
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.render();
        this.attachEvents();
    }

    getToolbarHTML() {
        // We inject the unique ID suffix into the toolbar elements
        const suffix = '_' + this.id;
        let html = `
            <!-- Toolbar -->
            <div class="px-5 py-2 border-b border-slate-100 flex-shrink-0 overflow-x-auto">
                <!-- Row 1: Font, Size, Case, Format -->
                <div class="flex items-center gap-1 flex-wrap mb-1.5">
                    <!-- Custom Font Dropdown Premium -->
                    <select id="fontFamilySelect" class="hidden"><option value="Inter">Inter</option></select>
                    <div id="fontPickerWrap" class="relative" style="min-width: 150px;">
                        <button type="button" id="fontPickerBtn" onclick="toggleFontPicker()" class="h-8 px-3 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-all flex items-center justify-between gap-2 w-full">
                            <span id="fontPickerLabel" style="font-family:'Inter',sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Inter</span>
                            <svg class="w-3 h-3 text-slate-400 flex-shrink-0 transition-transform" id="fontPickerArrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>

                    <div class="flex items-center gap-0 bg-slate-50 border border-slate-200 rounded-lg h-8 px-1">
                        <button onclick="changeFontSize(-1)" class="w-5 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 text-[10px] font-bold">−</button>
                        <select id="fontSizeSelect" onchange="formatDoc('fontSize', this.value)" class="w-10 text-center text-[11px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer border-none">
                            <option value="8px">8</option><option value="9px">9</option><option value="10px">10</option>
                            <option value="11px" selected>11</option><option value="12px">12</option><option value="14px">14</option>
                            <option value="16px">16</option><option value="18px">18</option><option value="20px">20</option>
                            <option value="22px">22</option><option value="24px">24</option><option value="26px">26</option>
                            <option value="28px">28</option><option value="36px">36</option><option value="48px">48</option>
                            <option value="72px">72</option>
                        </select>
                        <button onclick="changeFontSize(1)" class="w-5 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 text-[10px] font-bold">+</button>
                    </div>

                    <div class="toolbar-divider"></div>

                    <!-- Case buttons -->
                    <button onclick="changeCase('upper')" class="editor-toolbar-btn text-[12px] font-black" title="MAIÚSCULAS">Tt</button>
                    <button onclick="changeCase('lower')" class="editor-toolbar-btn text-[12px] font-black" title="minúsculas" style="font-variant: small-caps;">tT</button>
                    <button onclick="changeCase('capitalize')" class="editor-toolbar-btn text-[12px] font-black" title="Capitalizar">Tt</button>
                    <button onclick="formatDoc('removeFormat')" class="editor-toolbar-btn" title="Limpar Formatação">
                        <span class="material-symbols-outlined text-[17px] text-rose-400">format_clear</span>
                    </button>

                    <div class="toolbar-divider"></div>

                    <!-- Format buttons -->
                    <button id="btn-bold" onclick="formatDoc('bold')" class="editor-toolbar-btn font-black text-[15px]" title="Negrito (Ctrl+B)">B</button>
                    <button id="btn-italic" onclick="formatDoc('italic')" class="editor-toolbar-btn italic text-[15px]" title="Itálico (Ctrl+I)">I</button>
                    <button id="btn-underline" onclick="formatDoc('underline')" class="editor-toolbar-btn underline text-[15px]" title="Sublinhado (Ctrl+U)">U</button>
                    <button id="btn-strikethrough" onclick="formatDoc('strikeThrough')" class="editor-toolbar-btn line-through text-[14px]" title="Tachado">abc</button>
                    <button id="btn-subscript" onclick="formatDoc('subscript')" class="editor-toolbar-btn text-[12px]" title="Subscrito">X<sub class="text-[8px]">₂</sub></button>
                    <button id="btn-superscript" onclick="formatDoc('superscript')" class="editor-toolbar-btn text-[12px]" title="Sobrescrito">X<sup class="text-[8px]">²</sup></button>

                    <div class="toolbar-divider"></div>

                    <!-- Color pickers -->
                    <div class="relative">
                        <button onclick="toggleColorPicker('textColorPalette')" class="editor-toolbar-btn flex-col gap-0" title="Cor do Texto">
                            <span class="material-symbols-outlined text-[16px]">format_color_text</span>
                            <div id="textColorPreview" class="w-4 h-1 rounded-full mt-[-2px]" style="background-color: #000;"></div>
                        </button>
                        <div id="textColorPalette" class="color-picker-dropdown hidden">
                            <!-- Automático -->
                            <button class="cp-auto-btn" onclick="applyColor('#000000','foreColor')">
                                <div class="cp-auto-icon" style="background:#000; color:#fff;">A</div>
                                Automático
                            </button>
                            <!-- Cores do Tema -->
                            <div class="cp-section-label">Cores do Tema</div>
                            <div class="cp-grid">
                                <div class="cp-swatch" style="background:#FFFFFF" onclick="applyColor('#FFFFFF','foreColor')"></div>
                                <div class="cp-swatch" style="background:#000000" onclick="applyColor('#000000','foreColor')"></div>
                                <div class="cp-swatch" style="background:#E7E6E6" onclick="applyColor('#E7E6E6','foreColor')"></div>
                                <div class="cp-swatch" style="background:#44546A" onclick="applyColor('#44546A','foreColor')"></div>
                                <div class="cp-swatch" style="background:#4472C4" onclick="applyColor('#4472C4','foreColor')"></div>
                                <div class="cp-swatch" style="background:#ED7D31" onclick="applyColor('#ED7D31','foreColor')"></div>
                                <div class="cp-swatch" style="background:#A5A5A5" onclick="applyColor('#A5A5A5','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FFC000" onclick="applyColor('#FFC000','foreColor')"></div>
                                <div class="cp-swatch" style="background:#5B9BD5" onclick="applyColor('#5B9BD5','foreColor')"></div>
                                <div class="cp-swatch" style="background:#70AD47" onclick="applyColor('#70AD47','foreColor')"></div>
                                <!-- Row 2: 80% lighter -->
                                <div class="cp-swatch" style="background:#F2F2F2" onclick="applyColor('#F2F2F2','foreColor')"></div>
                                <div class="cp-swatch" style="background:#7F7F7F" onclick="applyColor('#7F7F7F','foreColor')"></div>
                                <div class="cp-swatch" style="background:#D0CECE" onclick="applyColor('#D0CECE','foreColor')"></div>
                                <div class="cp-swatch" style="background:#D6DCE4" onclick="applyColor('#D6DCE4','foreColor')"></div>
                                <div class="cp-swatch" style="background:#D9E2F3" onclick="applyColor('#D9E2F3','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FCE4D6" onclick="applyColor('#FCE4D6','foreColor')"></div>
                                <div class="cp-swatch" style="background:#EDEDED" onclick="applyColor('#EDEDED','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FFF2CC" onclick="applyColor('#FFF2CC','foreColor')"></div>
                                <div class="cp-swatch" style="background:#DEEAF6" onclick="applyColor('#DEEAF6','foreColor')"></div>
                                <div class="cp-swatch" style="background:#E2EFDA" onclick="applyColor('#E2EFDA','foreColor')"></div>
                                <!-- Row 3: 60% lighter -->
                                <div class="cp-swatch" style="background:#D8D8D8" onclick="applyColor('#D8D8D8','foreColor')"></div>
                                <div class="cp-swatch" style="background:#595959" onclick="applyColor('#595959','foreColor')"></div>
                                <div class="cp-swatch" style="background:#AEABAB" onclick="applyColor('#AEABAB','foreColor')"></div>
                                <div class="cp-swatch" style="background:#ADB9CA" onclick="applyColor('#ADB9CA','foreColor')"></div>
                                <div class="cp-swatch" style="background:#B4C6E7" onclick="applyColor('#B4C6E7','foreColor')"></div>
                                <div class="cp-swatch" style="background:#F8CBAD" onclick="applyColor('#F8CBAD','foreColor')"></div>
                                <div class="cp-swatch" style="background:#DBDBDB" onclick="applyColor('#DBDBDB','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FFE699" onclick="applyColor('#FFE699','foreColor')"></div>
                                <div class="cp-swatch" style="background:#BDD7EE" onclick="applyColor('#BDD7EE','foreColor')"></div>
                                <div class="cp-swatch" style="background:#C5E0B3" onclick="applyColor('#C5E0B3','foreColor')"></div>
                                <!-- Row 4: 40% lighter -->
                                <div class="cp-swatch" style="background:#BFBFBF" onclick="applyColor('#BFBFBF','foreColor')"></div>
                                <div class="cp-swatch" style="background:#3F3F3F" onclick="applyColor('#3F3F3F','foreColor')"></div>
                                <div class="cp-swatch" style="background:#757070" onclick="applyColor('#757070','foreColor')"></div>
                                <div class="cp-swatch" style="background:#8496B0" onclick="applyColor('#8496B0','foreColor')"></div>
                                <div class="cp-swatch" style="background:#8EAADB" onclick="applyColor('#8EAADB','foreColor')"></div>
                                <div class="cp-swatch" style="background:#F4B183" onclick="applyColor('#F4B183','foreColor')"></div>
                                <div class="cp-swatch" style="background:#C9C9C9" onclick="applyColor('#C9C9C9','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FFD966" onclick="applyColor('#FFD966','foreColor')"></div>
                                <div class="cp-swatch" style="background:#9DC3E6" onclick="applyColor('#9DC3E6','foreColor')"></div>
                                <div class="cp-swatch" style="background:#A9D18E" onclick="applyColor('#A9D18E','foreColor')"></div>
                                <!-- Row 5: 25% darker -->
                                <div class="cp-swatch" style="background:#A5A5A5" onclick="applyColor('#A5A5A5','foreColor')"></div>
                                <div class="cp-swatch" style="background:#262626" onclick="applyColor('#262626','foreColor')"></div>
                                <div class="cp-swatch" style="background:#3A3838" onclick="applyColor('#3A3838','foreColor')"></div>
                                <div class="cp-swatch" style="background:#323F4F" onclick="applyColor('#323F4F','foreColor')"></div>
                                <div class="cp-swatch" style="background:#2F5496" onclick="applyColor('#2F5496','foreColor')"></div>
                                <div class="cp-swatch" style="background:#C55A11" onclick="applyColor('#C55A11','foreColor')"></div>
                                <div class="cp-swatch" style="background:#7B7B7B" onclick="applyColor('#7B7B7B','foreColor')"></div>
                                <div class="cp-swatch" style="background:#BF8F00" onclick="applyColor('#BF8F00','foreColor')"></div>
                                <div class="cp-swatch" style="background:#2E75B6" onclick="applyColor('#2E75B6','foreColor')"></div>
                                <div class="cp-swatch" style="background:#538135" onclick="applyColor('#538135','foreColor')"></div>
                                <!-- Row 6: 50% darker -->
                                <div class="cp-swatch" style="background:#7F7F7F" onclick="applyColor('#7F7F7F','foreColor')"></div>
                                <div class="cp-swatch" style="background:#0D0D0D" onclick="applyColor('#0D0D0D','foreColor')"></div>
                                <div class="cp-swatch" style="background:#161616" onclick="applyColor('#161616','foreColor')"></div>
                                <div class="cp-swatch" style="background:#222A35" onclick="applyColor('#222A35','foreColor')"></div>
                                <div class="cp-swatch" style="background:#1F3864" onclick="applyColor('#1F3864','foreColor')"></div>
                                <div class="cp-swatch" style="background:#833C0B" onclick="applyColor('#833C0B','foreColor')"></div>
                                <div class="cp-swatch" style="background:#525252" onclick="applyColor('#525252','foreColor')"></div>
                                <div class="cp-swatch" style="background:#806000" onclick="applyColor('#806000','foreColor')"></div>
                                <div class="cp-swatch" style="background:#1F4E79" onclick="applyColor('#1F4E79','foreColor')"></div>
                                <div class="cp-swatch" style="background:#375623" onclick="applyColor('#375623','foreColor')"></div>
                            </div>
                            <div class="cp-divider"></div>
                            <!-- Cores Padrão -->
                            <div class="cp-section-label">Cores Padrão</div>
                            <div class="cp-grid">
                                <div class="cp-swatch" style="background:#C00000" onclick="applyColor('#C00000','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FF0000" onclick="applyColor('#FF0000','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FFC000" onclick="applyColor('#FFC000','foreColor')"></div>
                                <div class="cp-swatch" style="background:#FFFF00" onclick="applyColor('#FFFF00','foreColor')"></div>
                                <div class="cp-swatch" style="background:#92D050" onclick="applyColor('#92D050','foreColor')"></div>
                                <div class="cp-swatch" style="background:#00B050" onclick="applyColor('#00B050','foreColor')"></div>
                                <div class="cp-swatch" style="background:#00B0F0" onclick="applyColor('#00B0F0','foreColor')"></div>
                                <div class="cp-swatch" style="background:#0070C0" onclick="applyColor('#0070C0','foreColor')"></div>
                                <div class="cp-swatch" style="background:#002060" onclick="applyColor('#002060','foreColor')"></div>
                                <div class="cp-swatch" style="background:#7030A0" onclick="applyColor('#7030A0','foreColor')"></div>
                            </div>
                        </div>
                    </div>

                    <div class="relative">
                        <button onclick="toggleColorPicker('highlightPalette')" class="editor-toolbar-btn flex-col gap-0" title="Cor de Destaque">
                            <span class="material-symbols-outlined text-[16px]">ink_highlighter</span>
                            <div id="highlightPreview" class="w-4 h-1 rounded-full mt-[-2px]" style="background-color: #ffff00;"></div>
                        </button>
                        <div id="highlightPalette" class="color-picker-dropdown hidden">
                            <!-- Sem Cor -->
                            <button class="cp-auto-btn" onclick="applyColor('transparent','hiliteColor')">
                                <div class="cp-nocolor" style="width:18px;height:18px;border-radius:3px;"></div>
                                Sem Destaque
                            </button>
                            <div class="cp-section-label">Cores de Destaque</div>
                            <div class="cp-grid">
                                <div class="cp-swatch" style="background:#FFFF00" onclick="applyColor('#FFFF00','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#00FF00" onclick="applyColor('#00FF00','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#00FFFF" onclick="applyColor('#00FFFF','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#FF00FF" onclick="applyColor('#FF00FF','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#0000FF" onclick="applyColor('#0000FF','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#FF0000" onclick="applyColor('#FF0000','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#000080" onclick="applyColor('#000080','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#008080" onclick="applyColor('#008080','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#008000" onclick="applyColor('#008000','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#800080" onclick="applyColor('#800080','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#800000" onclick="applyColor('#800000','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#808000" onclick="applyColor('#808000','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#808080" onclick="applyColor('#808080','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#C0C0C0" onclick="applyColor('#C0C0C0','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#000000" onclick="applyColor('#000000','hiliteColor')"></div>
                            </div>
                            <div class="cp-divider"></div>
                            <div class="cp-section-label">Tons Suaves</div>
                            <div class="cp-grid">
                                <div class="cp-swatch" style="background:#FEF08A" onclick="applyColor('#FEF08A','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#BBF7D0" onclick="applyColor('#BBF7D0','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#A5F3FC" onclick="applyColor('#A5F3FC','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#FECDD3" onclick="applyColor('#FECDD3','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#BFDBFE" onclick="applyColor('#BFDBFE','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#FED7AA" onclick="applyColor('#FED7AA','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#DDD6FE" onclick="applyColor('#DDD6FE','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#FBCFE8" onclick="applyColor('#FBCFE8','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#E2E8F0" onclick="applyColor('#E2E8F0','hiliteColor')"></div>
                                <div class="cp-swatch" style="background:#FDE68A" onclick="applyColor('#FDE68A','hiliteColor')"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Alignment, Lists, Tools -->
                <div class="flex items-center gap-1 flex-wrap">
                    <button id="btn-justifyLeft" onclick="formatDoc('justifyLeft')" class="editor-toolbar-btn" title="Alinhar à Esquerda">
                        <span class="material-symbols-outlined text-[17px]">format_align_left</span>
                    </button>
                    <button id="btn-justifyCenter" onclick="formatDoc('justifyCenter')" class="editor-toolbar-btn" title="Centralizar">
                        <span class="material-symbols-outlined text-[17px]">format_align_center</span>
                    </button>
                    <button id="btn-justifyRight" onclick="formatDoc('justifyRight')" class="editor-toolbar-btn" title="Alinhar à Direita">
                        <span class="material-symbols-outlined text-[17px]">format_align_right</span>
                    </button>
                    <button id="btn-justifyFull" onclick="formatDoc('justifyFull')" class="editor-toolbar-btn" title="Justificar">
                        <span class="material-symbols-outlined text-[17px]">format_align_justify</span>
                    </button>

                    <div class="toolbar-divider"></div>

                    <!-- Attachment -->
                    <button onclick="triggerFileAttach()" class="editor-toolbar-btn" title="Anexar Arquivo">
                        <span class="material-symbols-outlined text-[17px]">attach_file</span>
                    </button>
                    <input id="editorFileInput" type="file" multiple class="hidden" onchange="handleFileAttach(this)">

                    <!-- Audio -->
                    <button id="audioRecordBtn" onclick="toggleAudioRecording()" class="editor-toolbar-btn" title="Gravar Áudio">
                        <span class="material-symbols-outlined text-[17px]">mic</span>
                    </button>

                    <!-- Formula -->
                    <button id="sigmaBtn" onclick="toggleMathRibbon()" class="editor-toolbar-btn bg-indigo-50/50 text-indigo-600 rounded-lg font-black text-[15px]" title="Equações Matemáticas">
                        Σ
                    </button>

                    <div class="toolbar-divider"></div>

                    <!-- Lists: Marcadores -->
                    <div class="relative" style="display:flex;align-items:center;">
                        <button id="btn-unorderedList" onclick="formatDoc('insertUnorderedList')" class="editor-toolbar-btn" title="Lista com Marcadores" style="border-radius:6px 0 0 6px;padding-right:2px;">
                            <span class="material-symbols-outlined text-[17px]">format_list_bulleted</span>
                        </button>
                        <button onclick="toggleListPicker('bulletListPicker')" class="editor-toolbar-btn" title="Estilos de Marcadores" style="border-radius:0 6px 6px 0;padding-left:2px;padding-right:3px;min-width:16px;">
                            <span class="material-symbols-outlined text-[10px]">arrow_drop_down</span>
                        </button>
                        <div id="bulletListPicker" class="list-picker-dropdown hidden">
                            <div class="lp-section-label">Biblioteca de Marcadores</div>
                            <div class="lp-grid">
                                <div class="lp-option-none" onclick="applyListStyle('UL','none')">Nenhum</div>
                                <div class="lp-option" onclick="applyListStyle('UL','disc')">
                                    <span class="lp-bullet-icon">●</span>
                                    <span style="font-size:9px;color:#888;">Disco</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','circle')">
                                    <span class="lp-bullet-icon">○</span>
                                    <span style="font-size:9px;color:#888;">Círculo</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','square')">
                                    <span class="lp-bullet-icon">■</span>
                                    <span style="font-size:9px;color:#888;">Quadrado</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','diamond')">
                                    <span class="lp-bullet-icon">◆</span>
                                    <span style="font-size:9px;color:#888;">Losango</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','arrow')">
                                    <span class="lp-bullet-icon">➤</span>
                                    <span style="font-size:9px;color:#888;">Seta</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','check')">
                                    <span class="lp-bullet-icon">✔</span>
                                    <span style="font-size:9px;color:#888;">Check</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','star')">
                                    <span class="lp-bullet-icon">★</span>
                                    <span style="font-size:9px;color:#888;">Estrela</span>
                                </div>
                                <div class="lp-option" onclick="applyListStyle('UL','dash')">
                                    <span class="lp-bullet-icon">—</span>
                                    <span style="font-size:9px;color:#888;">Traço</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Lists: Numerada -->
                    <div class="relative" style="display:flex;align-items:center;">
                        <button id="btn-orderedList" onclick="formatDoc('insertOrderedList')" class="editor-toolbar-btn" title="Lista Numerada" style="border-radius:6px 0 0 6px;padding-right:2px;">
                            <span class="material-symbols-outlined text-[17px]">format_list_numbered</span>
                        </button>
                        <button onclick="toggleListPicker('numberListPicker')" class="editor-toolbar-btn" title="Estilos de Numeração" style="border-radius:0 6px 6px 0;padding-left:2px;padding-right:3px;min-width:16px;">
                            <span class="material-symbols-outlined text-[10px]">arrow_drop_down</span>
                        </button>
                        <div id="numberListPicker" class="list-picker-dropdown hidden">
                            <div class="lp-section-label">Biblioteca de Numeração</div>
                            <div class="lp-grid">
                                <div class="lp-option-none" onclick="applyListStyle('OL','none')">Nenhum</div>
                                <div class="lp-option" onclick="applyListStyle('OL','decimal')">
                                    1. __<br>2. __<br>3. __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','decimal-paren')">
                                    1) __<br>2) __<br>3) __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','upper-roman')">
                                    I. __<br>II. __<br>III. __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','upper-alpha')">
                                    A. __<br>B. __<br>C. __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','upper-alpha-paren')">
                                    A) __<br>B) __<br>C) __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','lower-alpha-paren')">
                                    a) __<br>b) __<br>c) __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','lower-alpha')">
                                    a. __<br>b. __<br>c. __
                                </div>
                                <div class="lp-option" onclick="applyListStyle('OL','lower-roman')">
                                    i. __<br>ii. __<br>iii. __
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Math Ribbon Word-Style (hidden by default) -->
            <div id="math-ribbon" class="hidden border-b border-slate-100 bg-slate-50/50 flex-shrink-0" style="overflow:visible; position:relative; z-index:100;">
                <div class="flex items-center gap-0 px-3 py-1 flex-wrap" style="overflow:visible;">
                    <button onmousedown="event.preventDefault()" onclick="insertInlineEquation()" class="px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-bold rounded-lg hover:bg-indigo-700 transition-all mr-2 whitespace-nowrap">+ Equação</button>
                    <div class="toolbar-divider"></div>

                    <!-- Fração -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon">⅟</span>
                            <span class="math-cat-label">Fração<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Fração</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace('\\frac{}{}')" class="math-tpl" title="Fração empilhada"><span style="font-size:18px">▫<br>─<br>▫</span></button>
                                <button onclick="insertToWorkspace('{}/{}'" class="math-tpl" title="Fração linear"><span>▫/▫</span></button>
                                <button onclick="insertToWorkspace('\\frac{\\partial}{\\partial x}')" class="math-tpl" title="Derivada parcial"><span style="font-size:11px">∂▫<br>─<br>∂x</span></button>
                                <button onclick="insertToWorkspace('\\frac{d}{dx}')" class="math-tpl" title="Derivada"><span style="font-size:11px">d▫<br>─<br>dx</span></button>
                            </div>
                        </div>
                    </div>

                    <!-- Subscrito/Sobrescrito -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:14px">e<sup style="font-size:9px">x</sup></span>
                            <span class="math-cat-label">Sub/Sobre<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Subscritos e Sobrescritos</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace('x^{}')" class="math-tpl" title="Sobrescrito">x<sup>▫</sup></button>
                                <button onclick="insertToWorkspace('x_{}')" class="math-tpl" title="Subscrito">x<sub>▫</sub></button>
                                <button onclick="insertToWorkspace('x_{}^{}')" class="math-tpl" title="Ambos">x<sub>▫</sub><sup>▫</sup></button>
                                <button onclick="insertToWorkspace('{}^{}_{}'" class="math-tpl" title="Pré-escrito"><sup>▫</sup><sub>▫</sub>x</button>
                            </div>
                        </div>
                    </div>

                    <!-- Radical -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:16px">√</span>
                            <span class="math-cat-label">Radical<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Radicais</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace('\\sqrt{}')" class="math-tpl" title="Raiz quadrada">√▫</button>
                                <button onclick="insertToWorkspace('\\sqrt[n]{}')" class="math-tpl" title="Raiz n-ésima"><sup>n</sup>√▫</button>
                                <button onclick="insertToWorkspace('\\sqrt[3]{}')" class="math-tpl" title="Raiz cúbica"><sup>3</sup>√▫</button>
                                <button onclick="insertToWorkspace('\\sqrt[4]{}')" class="math-tpl" title="Raiz quarta"><sup>4</sup>√▫</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:6px">Radicais Comuns</div>
                            <div class="math-cat-grid math-cat-grid-wide">
                                <button onclick="insertToWorkspace('\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}')" class="math-tpl math-tpl-wide" title="Bhaskara" style="font-size:10px">−b±√(b²−4ac)<br>─────<br>2a</button>
                                <button onclick="insertToWorkspace('\\sqrt{a^2+b^2}')" class="math-tpl math-tpl-wide" title="Pitágoras">√(a²+b²)</button>
                            </div>
                        </div>
                    </div>

                    <!-- Integral -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:18px">∫</span>
                            <span class="math-cat-label">Integral<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Integrais</div>
                            <div class="math-cat-grid math-cat-grid-6">
                                <button onclick="insertToWorkspace('\\int{}')" class="math-tpl" title="Integral">∫▫</button>
                                <button onclick="insertToWorkspace('\\int_{}^{}')" class="math-tpl" title="Integral definida">∫<sub>▫</sub><sup>▫</sup></button>
                                <button onclick="insertToWorkspace('\\iint{}')" class="math-tpl" title="Integral dupla">∬▫</button>
                                <button onclick="insertToWorkspace('\\iiint{}')" class="math-tpl" title="Integral tripla">∭▫</button>
                                <button onclick="insertToWorkspace('\\oint{}')" class="math-tpl" title="Integral de contorno">∮▫</button>
                                <button onclick="insertToWorkspace('\\int_{-\\infty}^{\\infty}')" class="math-tpl" title="Integral -∞ a ∞">∫<sub>-∞</sub><sup>∞</sup></button>
                            </div>
                        </div>
                    </div>

                    <!-- Operador Grande -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:16px">Σ</span>
                            <span class="math-cat-label">Operador<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Operadores Grandes</div>
                            <div class="math-cat-grid math-cat-grid-6">
                                <button onclick="insertToWorkspace('\\sum_{i=1}^{n}')" class="math-tpl" title="Somatório">Σ<sub>i=1</sub><sup>n</sup></button>
                                <button onclick="insertToWorkspace('\\sum{}')" class="math-tpl" title="Soma simples">Σ▫</button>
                                <button onclick="insertToWorkspace('\\prod_{i=1}^{n}')" class="math-tpl" title="Produtório">∏<sub>i=1</sub><sup>n</sup></button>
                                <button onclick="insertToWorkspace('\\prod{}')" class="math-tpl" title="Produto simples">∏▫</button>
                                <button onclick="insertToWorkspace('\\bigcup_{i=1}^{n}')" class="math-tpl" title="União">⋃<sub>i=1</sub><sup>n</sup></button>
                                <button onclick="insertToWorkspace('\\bigcap_{i=1}^{n}')" class="math-tpl" title="Interseção">⋂<sub>i=1</sub><sup>n</sup></button>
                            </div>
                        </div>
                    </div>

                    <!-- Chaves -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:14px">{&nbsp;}</span>
                            <span class="math-cat-label">Chaves<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Parênteses e Chaves</div>
                            <div class="math-cat-grid math-cat-grid-6">
                                <button onclick="insertToWorkspace('\\left(\\right)')" class="math-tpl" title="Parênteses">(▫)</button>
                                <button onclick="insertToWorkspace('\\left[\\right]')" class="math-tpl" title="Colchetes">[▫]</button>
                                <button onclick="insertToWorkspace('\\left\\{\\right\\}')" class="math-tpl" title="Chaves">{▫}</button>
                                <button onclick="insertToWorkspace('\\left|\\right|')" class="math-tpl" title="Módulo">|▫|</button>
                                <button onclick="insertToWorkspace('\\left\\|\\right\\|')" class="math-tpl" title="Norma">‖▫‖</button>
                                <button onclick="insertToWorkspace('\\left\\langle\\right\\rangle')" class="math-tpl" title="Ângulo">⟨▫⟩</button>
                            </div>
                        </div>
                    </div>

                    <!-- Função -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:12px">sinθ</span>
                            <span class="math-cat-label">Função<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Funções Trigonométricas</div>
                            <div class="math-cat-grid math-cat-grid-6">
                                <button onclick="insertToWorkspace('\\sin{}')" class="math-tpl">sin</button>
                                <button onclick="insertToWorkspace('\\cos{}')" class="math-tpl">cos</button>
                                <button onclick="insertToWorkspace('\\tan{}')" class="math-tpl">tan</button>
                                <button onclick="insertToWorkspace('\\sec{}')" class="math-tpl">sec</button>
                                <button onclick="insertToWorkspace('\\csc{}')" class="math-tpl">csc</button>
                                <button onclick="insertToWorkspace('\\cot{}')" class="math-tpl">cot</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:6px">Inversas</div>
                            <div class="math-cat-grid math-cat-grid-6">
                                <button onclick="insertToWorkspace('\\arcsin{}')" class="math-tpl" style="font-size:10px">arcsin</button>
                                <button onclick="insertToWorkspace('\\arccos{}')" class="math-tpl" style="font-size:10px">arccos</button>
                                <button onclick="insertToWorkspace('\\arctan{}')" class="math-tpl" style="font-size:10px">arctan</button>
                                <button onclick="insertToWorkspace('\\log{}')" class="math-tpl">log</button>
                                <button onclick="insertToWorkspace('\\ln{}')" class="math-tpl">ln</button>
                                <button onclick="insertToWorkspace('\\exp{}')" class="math-tpl">exp</button>
                            </div>
                        </div>
                    </div>

                    <!-- Ênfase / Acentos -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:16px">ä</span>
                            <span class="math-cat-label">Ênfase<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown">
                            <div class="math-cat-title">Acentos Matemáticos</div>
                            <div class="math-cat-grid math-cat-grid-6">
                                <button onclick="insertToWorkspace('\\hat{}')" class="math-tpl" title="Chapéu">â</button>
                                <button onclick="insertToWorkspace('\\bar{}')" class="math-tpl" title="Barra">ā</button>
                                <button onclick="insertToWorkspace('\\vec{}')" class="math-tpl" title="Vetor">a⃗</button>
                                <button onclick="insertToWorkspace('\\dot{}')" class="math-tpl" title="Ponto">ȧ</button>
                                <button onclick="insertToWorkspace('\\ddot{}')" class="math-tpl" title="Dois pontos">ä</button>
                                <button onclick="insertToWorkspace('\\tilde{}')" class="math-tpl" title="Til">ã</button>
                                <button onclick="insertToWorkspace('\\overline{}')" class="math-tpl" title="Sobrelinha" style="font-size:10px;text-decoration:overline">abc</button>
                                <button onclick="insertToWorkspace('\\underline{}')" class="math-tpl" title="Sublinha" style="font-size:10px;text-decoration:underline">abc</button>
                                <button onclick="insertToWorkspace('\\overbrace{}')" class="math-tpl" title="Chave superior" style="font-size:11px">⏞</button>
                                <button onclick="insertToWorkspace('\\underbrace{}')" class="math-tpl" title="Chave inferior" style="font-size:11px">⏟</button>
                                <button onclick="insertToWorkspace('\\widehat{}')" class="math-tpl" title="Chapéu largo" style="font-size:11px">◠</button>
                                <button onclick="insertToWorkspace('\\widetilde{}')" class="math-tpl" title="Til largo">∼</button>
                            </div>
                        </div>
                    </div>

                    <!-- Limite e Logaritmo (Expandido) -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:11px;font-weight:700;line-height:1">lim<br><span style="font-size:7px;font-weight:400">n→∞</span></span>
                            <span class="math-cat-label">Limite e<br>Logaritmo<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown" style="min-width:260px;">
                            <div class="math-cat-title">Funções</div>
                            <div class="math-cat-grid" style="grid-template-columns:repeat(3,1fr);">
                                <button onclick="insertToWorkspace('\\log_{}')" class="math-tpl" style="font-size:12px" title="Log com base">log<sub>▫</sub> ▫</button>
                                <button onclick="insertToWorkspace('\\log{}')" class="math-tpl" style="font-size:12px" title="Log simples">log ▫</button>
                                <button onclick="insertToWorkspace('\\lim_{}')" class="math-tpl" style="font-size:12px" title="Limite">lim ▫</button>
                                <button onclick="insertToWorkspace('\\min{}')" class="math-tpl" style="font-size:12px" title="Mínimo">min ▫</button>
                                <button onclick="insertToWorkspace('\\max{}')" class="math-tpl" style="font-size:12px" title="Máximo">max ▫</button>
                                <button onclick="insertToWorkspace('\\ln{}')" class="math-tpl" style="font-size:12px" title="Ln">ln ▫</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Limites</div>
                            <div class="math-cat-grid" style="grid-template-columns:repeat(3,1fr);">
                                <button onclick="insertToWorkspace('\\lim_{x\\to}')" class="math-tpl" style="font-size:10px" title="Limite">lim<sub>x→▫</sub></button>
                                <button onclick="insertToWorkspace('\\lim_{x\\to\\infty}')" class="math-tpl" style="font-size:10px" title="Limite infinito">lim<sub>x→∞</sub></button>
                                <button onclick="insertToWorkspace('\\lim_{x\\to 0}')" class="math-tpl" style="font-size:10px" title="Limite zero">lim<sub>x→0</sub></button>
                                <button onclick="insertToWorkspace('\\lim_{x\\to 0^+}')" class="math-tpl" style="font-size:10px" title="Limite pela direita">lim<sub>x→0⁺</sub></button>
                                <button onclick="insertToWorkspace('\\lim_{x\\to 0^-}')" class="math-tpl" style="font-size:10px" title="Limite pela esquerda">lim<sub>x→0⁻</sub></button>
                                <button onclick="insertToWorkspace('\\lim_{n\\to\\infty}')" class="math-tpl" style="font-size:10px" title="Limite sequência">lim<sub>n→∞</sub></button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Funções Comuns</div>
                            <div class="math-cat-grid math-cat-grid-wide">
                                <button onclick="insertToWorkspace('\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n')" class="math-tpl math-tpl-wide" style="font-size:10px" title="Número de Euler">lim (1+1/n)<sup>n</sup><br><span style="font-size:8px">n→∞</span></button>
                                <button onclick="insertToWorkspace('\\max_{0\\leq x\\leq 1}xe^{-x^2}')" class="math-tpl math-tpl-wide" style="font-size:10px" title="Max com domínio">max xe<sup>−x²</sup><br><span style="font-size:8px">0≤x≤1</span></button>
                            </div>
                        </div>
                    </div>

                    <!-- Operador (NOVO) -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:13px;line-height:1">△<br><span style="font-size:8px">≡</span></span>
                            <span class="math-cat-label">Operador<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown" style="min-width:240px;">
                            <div class="math-cat-title">Operadores Básicos</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace(':=')" class="math-tpl" style="font-size:13px" title="Definição">:=</button>
                                <button onclick="insertToWorkspace('==')" class="math-tpl" style="font-size:13px" title="Igualdade">==</button>
                                <button onclick="insertToWorkspace('+=')" class="math-tpl" style="font-size:13px" title="Incremento">+=</button>
                                <button onclick="insertToWorkspace('-=')" class="math-tpl" style="font-size:13px" title="Decremento">−=</button>
                                <button onclick="insertToWorkspace('\\stackrel{\\mathrm{def}}{=}')" class="math-tpl" style="font-size:10px" title="Def igual"><sup style="font-size:8px">def</sup><br>=</button>
                                <button onclick="insertToWorkspace('\\equiv')" class="math-tpl" style="font-size:14px" title="Congruente">≡</button>
                                <button onclick="insertToWorkspace('\\triangleq')" class="math-tpl" style="font-size:14px" title="Delta igual">≜</button>
                                <button onclick="insertToWorkspace('\\cong')" class="math-tpl" style="font-size:14px" title="Congruente geom">≅</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Estruturas dos Operadores</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace('\\xleftarrow{}')" class="math-tpl" style="font-size:12px" title="Seta esquerda">←<sub>▫</sub></button>
                                <button onclick="insertToWorkspace('\\xrightarrow{}')" class="math-tpl" style="font-size:12px" title="Seta direita">→<sup>▫</sup></button>
                                <button onclick="insertToWorkspace('\\xleftarrow[]{}')" class="math-tpl" style="font-size:10px" title="Seta esq dupla"><sup style="font-size:8px">▫</sup><br>←<br><sub style="font-size:8px">▫</sub></button>
                                <button onclick="insertToWorkspace('\\xrightarrow[]{}')" class="math-tpl" style="font-size:10px" title="Seta dir dupla"><sup style="font-size:8px">▫</sup><br>→<br><sub style="font-size:8px">▫</sub></button>
                                <button onclick="insertToWorkspace('\\Leftarrow')" class="math-tpl" style="font-size:14px" title="Seta dupla esq">⇐</button>
                                <button onclick="insertToWorkspace('\\Rightarrow')" class="math-tpl" style="font-size:14px" title="Seta dupla dir">⇒</button>
                                <button onclick="insertToWorkspace('\\xleftrightarrow{}')" class="math-tpl" style="font-size:12px" title="Bidirecional">↔<sup style="font-size:8px">▫</sup></button>
                                <button onclick="insertToWorkspace('\\Leftrightarrow')" class="math-tpl" style="font-size:14px" title="Seta dupla bidirecional">⇔</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Operadores Comuns</div>
                            <div class="math-cat-grid math-cat-grid-wide">
                                <button onclick="insertToWorkspace('\\xrightarrow{\\text{yields}}')" class="math-tpl math-tpl-wide" style="font-size:11px" title="Yields">—yields→</button>
                                <button onclick="insertToWorkspace('\\rightleftharpoons')" class="math-tpl math-tpl-wide" style="font-size:14px" title="Equilíbrio químico">⇌</button>
                            </div>
                        </div>
                    </div>

                    <!-- Matriz (NOVO) -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:9px;font-family:monospace;line-height:1.1">⌈1 0⌉<br>⌊0 1⌋</span>
                            <span class="math-cat-label">Matriz<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown" style="min-width:320px; max-height:420px; overflow-y:auto;">
                            <div class="math-cat-title">Matrizes Vazias</div>
                            <div class="math-cat-grid" style="grid-template-columns:repeat(4,1fr);">
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="1×2">[ ▫  ▫ ]</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} \\\\ \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="2×1">[ ▫ ]<br>[ ▫ ]</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & & \\end{pmatrix}')" class="math-tpl" style="font-size:8px" title="1×3">[ ▫ ▫ ▫ ]</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} \\\\ \\\\ \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="3×1">[ ▫ ]<br>[ ▫ ]<br>[ ▫ ]</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & \\\\ & \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="2×2">▫ ▫<br>▫ ▫</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & & \\\\ & & \\end{pmatrix}')" class="math-tpl" style="font-size:8px" title="2×3">▫ ▫ ▫<br>▫ ▫ ▫</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & \\\\ & \\\\ & \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="3×2">▫ ▫<br>▫ ▫<br>▫ ▫</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & & \\\\ & & \\\\ & & \\end{pmatrix}')" class="math-tpl" style="font-size:8px" title="3×3">▫ ▫ ▫<br>▫ ▫ ▫<br>▫ ▫ ▫</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Pontos</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace('\\cdots')" class="math-tpl" style="font-size:16px" title="Horizontal">⋯</button>
                                <button onclick="insertToWorkspace('\\ldots')" class="math-tpl" style="font-size:16px" title="Inferior">…</button>
                                <button onclick="insertToWorkspace('\\vdots')" class="math-tpl" style="font-size:16px" title="Vertical">⋮</button>
                                <button onclick="insertToWorkspace('\\ddots')" class="math-tpl" style="font-size:16px" title="Diagonal">⋱</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Matrizes Identidades</div>
                            <div class="math-cat-grid">
                                <button onclick="insertToWorkspace('\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}')" class="math-tpl" style="font-size:10px" title="I 2×2">1  0<br>0  1</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} 1 & \\\\ & 1 \\end{pmatrix}')" class="math-tpl" style="font-size:10px" title="I 2×2 diag">1<br>&nbsp;&nbsp; 1</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="I 3×3">1 0 0<br>0 1 0<br>0 0 1</button>
                                <button onclick="insertToWorkspace('\\begin{pmatrix} 1 & & \\\\ & 1 & \\\\ & & 1 \\end{pmatrix}')" class="math-tpl" style="font-size:9px" title="I 3×3 diag">1<br>&nbsp; 1<br>&nbsp;&nbsp;&nbsp; 1</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Matrizes com Colchetes</div>
                            <div class="math-cat-grid" style="grid-template-columns:repeat(5,1fr);">
                                <button onclick="insertToWorkspace('\\begin{pmatrix} & \\\\ & \\end{pmatrix}')" class="math-tpl" style="font-size:8px" title="( ) 2×2">(▫ ▫)<br>(▫ ▫)</button>
                                <button onclick="insertToWorkspace('\\begin{bmatrix} & \\\\ & \\end{bmatrix}')" class="math-tpl" style="font-size:8px" title="[ ] 2×2">[▫ ▫]<br>[▫ ▫]</button>
                                <button onclick="insertToWorkspace('\\begin{Bmatrix} & \\\\ & \\end{Bmatrix}')" class="math-tpl" style="font-size:8px" title="{ } 2×2">{▫ ▫}<br>{▫ ▫}</button>
                                <button onclick="insertToWorkspace('\\begin{vmatrix} & \\\\ & \\end{vmatrix}')" class="math-tpl" style="font-size:8px" title="| | 2×2">|▫ ▫|<br>|▫ ▫|</button>
                                <button onclick="insertToWorkspace('\\begin{Vmatrix} & \\\\ & \\end{Vmatrix}')" class="math-tpl" style="font-size:8px" title="‖ ‖ 2×2">‖▫ ▫‖<br>‖▫ ▫‖</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:8px">Matrizes Esparsas</div>
                            <div class="math-cat-grid math-cat-grid-wide">
                                <button onclick="insertToWorkspace('\\begin{pmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{pmatrix}')" class="math-tpl math-tpl-wide" style="font-size:9px" title="Genérica ( )">a₁₁ ⋯ a₁ₙ<br> ⋮ &nbsp; ⋱ &nbsp; ⋮<br>aₘ₁ ⋯ aₘₙ</button>
                                <button onclick="insertToWorkspace('\\begin{bmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{bmatrix}')" class="math-tpl math-tpl-wide" style="font-size:9px" title="Genérica [ ]">[a₁₁ ⋯ a₁ₙ]<br>[ ⋮ &nbsp; ⋱ &nbsp; ⋮ ]<br>[aₘ₁ ⋯ aₘₙ]</button>
                            </div>
                        </div>
                    </div>

                    <!-- Símbolos Básicos (Expandido) -->
                    <div class="math-cat" onmousedown="event.preventDefault()">
                        <button onclick="toggleMathCat(this)" class="math-cat-btn">
                            <span class="math-cat-icon" style="font-size:14px">±</span>
                            <span class="math-cat-label">Símbolos<span class="math-arrow">▾</span></span>
                        </button>
                        <div class="math-cat-dropdown math-cat-dropdown-wide">
                            <div class="math-cat-title">Matemática Básica</div>
                            <div class="math-sym-grid">
                                <button onclick="insertToWorkspace('\\pm')" class="math-sym">±</button>
                                <button onclick="insertToWorkspace('\\infty')" class="math-sym">∞</button>
                                <button onclick="insertToWorkspace('=')" class="math-sym">=</button>
                                <button onclick="insertToWorkspace('\\neq')" class="math-sym">≠</button>
                                <button onclick="insertToWorkspace('\\approx')" class="math-sym">≈</button>
                                <button onclick="insertToWorkspace('\\times')" class="math-sym">×</button>
                                <button onclick="insertToWorkspace('\\div')" class="math-sym">÷</button>
                                <button onclick="insertToWorkspace('!')" class="math-sym">!</button>
                                <button onclick="insertToWorkspace('\\leq')" class="math-sym">≤</button>
                                <button onclick="insertToWorkspace('\\geq')" class="math-sym">≥</button>
                                <button onclick="insertToWorkspace('\\ll')" class="math-sym">≪</button>
                                <button onclick="insertToWorkspace('\\gg')" class="math-sym">≫</button>
                                <button onclick="insertToWorkspace('\\equiv')" class="math-sym">≡</button>
                                <button onclick="insertToWorkspace('\\sim')" class="math-sym">∼</button>
                                <button onclick="insertToWorkspace('\\propto')" class="math-sym">∝</button>
                                <button onclick="insertToWorkspace('\\forall')" class="math-sym">∀</button>
                                <button onclick="insertToWorkspace('\\exists')" class="math-sym">∃</button>
                                <button onclick="insertToWorkspace('\\nexists')" class="math-sym">∄</button>
                                <button onclick="insertToWorkspace('\\in')" class="math-sym">∈</button>
                                <button onclick="insertToWorkspace('\\notin')" class="math-sym">∉</button>
                                <button onclick="insertToWorkspace('\\subset')" class="math-sym">⊂</button>
                                <button onclick="insertToWorkspace('\\supset')" class="math-sym">⊃</button>
                                <button onclick="insertToWorkspace('\\cup')" class="math-sym">∪</button>
                                <button onclick="insertToWorkspace('\\cap')" class="math-sym">∩</button>
                                <button onclick="insertToWorkspace('\\emptyset')" class="math-sym">∅</button>
                                <button onclick="insertToWorkspace('\\partial')" class="math-sym">∂</button>
                                <button onclick="insertToWorkspace('\\nabla')" class="math-sym">∇</button>
                                <button onclick="insertToWorkspace('\\to')" class="math-sym">→</button>
                                <button onclick="insertToWorkspace('\\Rightarrow')" class="math-sym">⇒</button>
                                <button onclick="insertToWorkspace('\\Leftrightarrow')" class="math-sym">⇔</button>
                                <button onclick="insertToWorkspace('\\therefore')" class="math-sym">∴</button>
                                <button onclick="insertToWorkspace('\\because')" class="math-sym">∵</button>
                                <button onclick="insertToWorkspace('\\mp')" class="math-sym">∓</button>
                                <button onclick="insertToWorkspace('\\neg')" class="math-sym">¬</button>
                                <button onclick="insertToWorkspace('\\wedge')" class="math-sym">∧</button>
                                <button onclick="insertToWorkspace('\\vee')" class="math-sym">∨</button>
                                <button onclick="insertToWorkspace('\\oplus')" class="math-sym">⊕</button>
                                <button onclick="insertToWorkspace('\\otimes')" class="math-sym">⊗</button>
                                <button onclick="insertToWorkspace('\\perp')" class="math-sym">⊥</button>
                                <button onclick="insertToWorkspace('\\parallel')" class="math-sym">∥</button>
                                <button onclick="insertToWorkspace('\\angle')" class="math-sym">∠</button>
                                <button onclick="insertToWorkspace('\\circ')" class="math-sym">∘</button>
                                <button onclick="insertToWorkspace('\\bullet')" class="math-sym">•</button>
                                <button onclick="insertToWorkspace('\\star')" class="math-sym">⋆</button>
                                <button onclick="insertToWorkspace('\\leftarrow')" class="math-sym">←</button>
                                <button onclick="insertToWorkspace('\\uparrow')" class="math-sym">↑</button>
                                <button onclick="insertToWorkspace('\\downarrow')" class="math-sym">↓</button>
                                <button onclick="insertToWorkspace('\\mapsto')" class="math-sym">↦</button>
                                <button onclick="insertToWorkspace('\\%')" class="math-sym">%</button>
                                <button onclick="insertToWorkspace('^{\\circ}')" class="math-sym">°</button>
                            </div>
                            <div class="math-cat-title" style="margin-top:6px">Letras Gregas</div>
                            <div class="math-sym-grid">
                                <button onclick="insertToWorkspace('\\alpha')" class="math-sym">α</button>
                                <button onclick="insertToWorkspace('\\beta')" class="math-sym">β</button>
                                <button onclick="insertToWorkspace('\\gamma')" class="math-sym">γ</button>
                                <button onclick="insertToWorkspace('\\delta')" class="math-sym">δ</button>
                                <button onclick="insertToWorkspace('\\epsilon')" class="math-sym">ε</button>
                                <button onclick="insertToWorkspace('\\zeta')" class="math-sym">ζ</button>
                                <button onclick="insertToWorkspace('\\eta')" class="math-sym">η</button>
                                <button onclick="insertToWorkspace('\\theta')" class="math-sym">θ</button>
                                <button onclick="insertToWorkspace('\\iota')" class="math-sym">ι</button>
                                <button onclick="insertToWorkspace('\\kappa')" class="math-sym">κ</button>
                                <button onclick="insertToWorkspace('\\lambda')" class="math-sym">λ</button>
                                <button onclick="insertToWorkspace('\\mu')" class="math-sym">μ</button>
                                <button onclick="insertToWorkspace('\\nu')" class="math-sym">ν</button>
                                <button onclick="insertToWorkspace('\\xi')" class="math-sym">ξ</button>
                                <button onclick="insertToWorkspace('\\pi')" class="math-sym">π</button>
                                <button onclick="insertToWorkspace('\\rho')" class="math-sym">ρ</button>
                                <button onclick="insertToWorkspace('\\sigma')" class="math-sym">σ</button>
                                <button onclick="insertToWorkspace('\\tau')" class="math-sym">τ</button>
                                <button onclick="insertToWorkspace('\\upsilon')" class="math-sym">υ</button>
                                <button onclick="insertToWorkspace('\\phi')" class="math-sym">φ</button>
                                <button onclick="insertToWorkspace('\\chi')" class="math-sym">χ</button>
                                <button onclick="insertToWorkspace('\\psi')" class="math-sym">ψ</button>
                                <button onclick="insertToWorkspace('\\omega')" class="math-sym">ω</button>
                                <button onclick="insertToWorkspace('\\varepsilon')" class="math-sym">ϵ</button>
                                <button onclick="insertToWorkspace('\\vartheta')" class="math-sym">ϑ</button>
                                <button onclick="insertToWorkspace('\\varphi')" class="math-sym">ϕ</button>
                                <button onclick="insertToWorkspace('\\Delta')" class="math-sym">Δ</button>
                                <button onclick="insertToWorkspace('\\Gamma')" class="math-sym">Γ</button>
                                <button onclick="insertToWorkspace('\\Theta')" class="math-sym">Θ</button>
                                <button onclick="insertToWorkspace('\\Lambda')" class="math-sym">Λ</button>
                                <button onclick="insertToWorkspace('\\Xi')" class="math-sym">Ξ</button>
                                <button onclick="insertToWorkspace('\\Pi')" class="math-sym">Π</button>
                                <button onclick="insertToWorkspace('\\Sigma')" class="math-sym">Σ</button>
                                <button onclick="insertToWorkspace('\\Phi')" class="math-sym">Φ</button>
                                <button onclick="insertToWorkspace('\\Psi')" class="math-sym">Ψ</button>
                                <button onclick="insertToWorkspace('\\Omega')" class="math-sym">Ω</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Editor Area -->
            <div class="flex-1 overflow-y-auto bg-white" style="min-height: 0;">
                <div id="editorContent" contenteditable="true" data-placeholder="Comece a digitar suas anotações..." spellcheck="true"></div>

                <!-- Attachments Area -->
                <div id="editorAttachments" class="px-6 pb-4"></div>
            </div>


        `;
        
        // We replace specific IDs with suffixed IDs to avoid conflicts when multiple editors are on the same page.
        // E.g., id="fontSizeSelect" -> id="fontSizeSelect_frontEditor"
        const idsToSuffix = [
            'fontFamilySelect', 'fontPickerBtn', 'fontPickerLabel', 'fontPickerArrow', 'fontPickerDropdown', 'fontPickerSearch', 'fontPickerList',
            'fontSizeSelect', 'textColorPalette', 'highlightPalette', 'bulletListPicker', 'numberListPicker',
            'editorContent', 'editorAttachments', 'math-ribbon', 'math-ribbon-premium', 'math-tabs-premium'
        ];
        
        for (const id of idsToSuffix) {
            const idRegex = new RegExp(`id="${id}"`, 'g');
            html = html.replace(idRegex, `id="${id}${suffix}"`);
            
            // Also replace toggle functions that reference the ID directly in HTML
            const toggleRegex = new RegExp(`'${id}'`, 'g');
            html = html.replace(toggleRegex, `'${id}${suffix}'`);
        }
        
        // Update the placeholder
        html = html.replace('data-placeholder="Comece a digitar suas anotações..."', `data-placeholder="${this.placeholder}"`);
        
        return html;
    }

    render() {
        if (this.options.noToolbar) {
            this.container.innerHTML = `
                <div class="flex-1 overflow-y-auto bg-white" style="min-height: 0;">
                    <div id="editorContent_${this.id}" contenteditable="true" data-placeholder="${this.placeholder}" spellcheck="true" class="p-4 min-h-[40px] outline-none"></div>
                    <div id="editorAttachments_${this.id}" class="px-6 pb-4"></div>
                </div>
            `;
        } else {
            this.container.innerHTML = this.getToolbarHTML();
        }
        this.container.classList.add('rich-text-editor-container');
        this.editorElement = document.getElementById('editorContent_' + this.id);
    }

    attachEvents() {
        if (this.editorElement) {
            this.editorElement.addEventListener('focus', () => {
                window.activeEditorId = this.id;
            });
            
            // Set as active if it's the first one
            if (!window.activeEditorId) {
                window.activeEditorId = this.id;
            }
        }
    }

    getContent() {
        return this.editorElement ? this.editorElement.innerHTML : '';
    }
    
    setContent(html) {
        if (this.editorElement) {
            this.editorElement.innerHTML = html;
        }
    }
}
