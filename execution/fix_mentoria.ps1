$content = Get-Content "mentoria.html" -Encoding UTF8
$topHalf = $content[0..429]

$tail = @"
                </div>
                <!-- Kanban Grid JS Mount Point -->
                <style>
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(203, 213, 225, 0.4);
                        border-radius: 4px;
                    }
                    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                        background: rgba(148, 163, 184, 0.6);
                    }
                </style>
            </div>
            <!-- Safe Space -->
            <div class="h-16"></div>
        </div>
    </main>

    <!-- Modal Atividades -->
    <div id="modalAtividade" class="fixed inset-0 z-50 hidden opacity-0 transition-opacity duration-300">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-[#0B193C]/40 backdrop-blur-sm" onclick="fecharModalAtividade()"></div>
        
        <!-- Modal Content -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-2xl bg-white rounded-[32px] shadow-premium-hover overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col" id="modalAtividadeContent" style="max-height: 90vh;">
            
            <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
                <h3 class="font-headline text-xl font-extrabold text-[#0B193C] flex items-center gap-3">
                    <span class="material-symbols-outlined text-sinapse-primary icon-fill">assignment_add</span>
                    Lançamento de Atividade
                </h3>
                <button onclick="fecharModalAtividade()" class="text-slate-400 hover:text-rose-500 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <form id="formAtividade" class="p-8 space-y-6 overflow-y-auto" onsubmit="event.preventDefault(); registrarAtividade(event)">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Matéria</label>
                        <select id="actDiscipline" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-medium appearance-none">
                            <option value="Biologia">Biologia</option>
                            <option value="Física">Física</option>
                            <option value="Matemática">Matemática</option>
                            <option value="Química">Química</option>
                            <option value="História">História</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Linguagens">Linguagens</option>
                            <option value="Nenhuma">Nenhuma Especial</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Assunto</label>
                        <input id="actSubject" required type="text" placeholder="Ex: Leis de Newton" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-medium placeholder:text-slate-400">
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Data</label>
                    <input id="actDate" required type="date" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sinapse-primary transition-all font-medium">
                </div>

                <div class="bg-indigo-50/50 p-6 rounded-[24px] border border-indigo-100">
                    <p class="text-sm font-extrabold text-[#0B193C] mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-sinapse-primary">monitoring</span> Apuração de Desempenho</p>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Questões</label>
                            <input id="actTotalQ" type="number" min="0" placeholder="0" class="w-full bg-white border border-indigo-200 text-[#0B193C] rounded-xl px-4 py-3 font-bold focus:border-sinapse-primary outline-none">
                        </div>
                        <div class="space-y-2">
                            <label class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">Acertos</label>
                            <input id="actCorrectQ" type="number" min="0" placeholder="0" class="w-full bg-[#10B981]/5 border border-[#10B981]/30 text-[#0B193C] rounded-xl px-4 py-3 font-bold focus:border-[#10B981] outline-none">
                        </div>
                    </div>
                </div>

            </form>

            <div class="p-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 w-full">
                <button onclick="fecharModalAtividade()" class="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 hover:text-[#0B193C] transition-all text-sm">
                    Cancelar
                </button>
                <button type="submit" form="formAtividade" id="btnSubmitForm" class="bg-[#0B193C] hover:bg-sinapse-primary text-white px-8 py-3 rounded-xl font-bold shadow-premium transition-all text-sm flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">save</span>
                    Salvar Registro
                </button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="database.js"></script>
    <script src="agenda_dinamica.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const tod = new Date();
            const dateStr = `${tod.getFullYear()}-${String(tod.getMonth()+1).padStart(2,'0')}-${String(tod.getDate()).padStart(2,'0')}`;
            const dtInput = document.getElementById('actDate');
            if(dtInput) dtInput.value = dateStr;
        });

        function abrirModalAtividade() {
            const modal = document.getElementById('modalAtividade');
            const content = document.getElementById('modalAtividadeContent');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }, 10);
        }

        function fecharModalAtividade() {
            const modal = document.getElementById('modalAtividade');
            const content = document.getElementById('modalAtividadeContent');
            modal.classList.add('opacity-0');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => { modal.classList.add('hidden'); document.getElementById('formAtividade').reset(); }, 300);
        }

        function registrarAtividade(event) {
            const btn = document.getElementById('btnSubmitForm');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">hourglass_empty</span> Salvando...';
            btn.classList.add('opacity-80', 'pointer-events-none');
            
            setTimeout(() => {
                const totalQ = parseInt(document.getElementById('actTotalQ').value) || 0;
                const correctQ = parseInt(document.getElementById('actCorrectQ').value) || 0;
                const wrongQ = totalQ - correctQ;
                
                const subjectVal = document.getElementById('actSubject').value;
                const disciplineVal = document.getElementById('actDiscipline').value;

                if (window.db) {
                    const newAct = window.db.insert('activities', {
                        user_id: 1, 
                        title: disciplineVal + ' - ' + subjectVal,
                        description: '',
                        date: document.getElementById('actDate').value,
                        time: '14:00', // Default para Calendário
                        weekday: document.getElementById('actDate').value ? new Date(document.getElementById('actDate').value + 'T00:00:00').getDay() : 0,
                        activity_type: 'lista de Questões',
                        discipline: disciplineVal,
                        subject: subjectVal,
                        priority: 'media',
                        status: 'concluída' 
                    });

                    window.db.insert('metrics_entries', {
                        user_id: 1,
                        activity_id: newAct.id,
                        discipline: newAct.discipline,
                        subject: newAct.subject,
                        questions_total: totalQ,
                        correct_answers: correctQ,
                        wrong_answers: wrongQ < 0 ? 0 : wrongQ,
                        accuracy_percentage: totalQ > 0 ? ((correctQ/totalQ)*100).toFixed(1) : 0,
                        study_time_minutes: 60
                    });
                }

                fecharModalAtividade();
                btn.innerHTML = originalContent;
                btn.classList.remove('opacity-80', 'pointer-events-none');
                
                alert('Atividade salva com sucesso!');
            }, 800);
        }
    </script>
</body>
</html>
"@

$newContent = $topHalf + $tail

[System.IO.File]::WriteAllLines("mentoria.html", $newContent, [System.Text.Encoding]::UTF8)
Write-Output "mentoria.html consertado e injetado."
