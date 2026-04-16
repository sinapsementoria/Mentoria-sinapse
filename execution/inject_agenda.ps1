$html = @"
            <!-- SECTION: KANBAN WEEKLY PLANNER -->
            <div class="mt-8 fade-in-up" style="animation-delay: 0.2s;">
                
                <!-- Planner Header -->
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 class="font-headline text-3xl font-extrabold text-[#0B193C] tracking-tight">Planejamento Semanal</h2>
                        <p class="text-sm font-semibold text-slate-400 mt-1 flex items-center gap-2">
                            Visualize e acompanhe suas metas diárias da semana
                        </p>
                    </div>
                    
                    <div class="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-premium border border-slate-100">
                        <button class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#0B193C] hover:bg-slate-50 rounded-xl transition-colors">
                            <span class="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <div class="px-4 text-center">
                            <span class="block text-[10px] font-extrabold text-sinapse-primary uppercase tracking-widest">Semana Atual</span>
                            <span class="block text-sm font-bold text-[#0B193C]">06/04/2026 <span class="text-slate-300 font-normal mx-1">a</span> 12/04/2026</span>
                        </div>
                        <button class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#0B193C] hover:bg-slate-50 rounded-xl transition-colors">
                            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                        <div class="w-px h-6 bg-slate-200 mx-1"></div>
                        <button class="px-4 py-2 text-[11px] font-extrabold text-slate-500 hover:text-[#0B193C] uppercase tracking-widest transition-colors rounded-lg hover:bg-slate-50">Hoje</button>
                    </div>
                </div>

                <!-- Kanban Grid 7 Columns -->
                <div class="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-2 gap-6" style="scrollbar-width: thin;" id="weeklyAgendaGrid">
                    
                    <!-- DIA: DOMINGO -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px]">
                        <div class="bg-white rounded-t-3xl border-b-0 border border-slate-100 p-5 text-center relative z-10 shrink-0">
                            <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Domingo</h3>
                            <p class="text-2xl font-headline font-extrabold text-[#0B193C] mt-0.5">05 <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-slate-50/50 border border-t-0 border-slate-100 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                            
                            <!-- Card Meta Geral (Azul) -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Revisão Geral</span>
                                    <span class="material-symbols-outlined text-[14px] text-slate-300">library_books</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Análise de Simulados Anteriores</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>
                            
                            <!-- Card (Laranja) -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Planejamento</span>
                                    <span class="material-symbols-outlined text-[14px] text-slate-300">edit_calendar</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Alinhamento de Metas da Semana</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- DIA: SEGUNDA ( HOJE ) -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px] relative">
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-sinapse-primary text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap z-20">
                            Dia Atual
                        </div>
                        <div class="bg-[#0B193C] rounded-t-3xl border border-[#0B193C] p-5 text-center relative z-10 shrink-0">
                            <h3 class="text-[11px] font-extrabold text-blue-200 uppercase tracking-widest">Segunda</h3>
                            <p class="text-2xl font-headline font-extrabold text-white mt-0.5">06 <span class="text-[12px] text-white/50 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-blue-50/30 border-2 border-t-0 border-[#0B193C]/10 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                            
                            <!-- Card Física (Azul Claro) -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-sky-100 hover:border-sky-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Física</span>
                                    <span class="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 rounded">08:00</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Termologia - Calorimetria</h4>
                                <p class="text-[11px] text-slate-500 font-medium pl-2 mt-1">Videoaula + Lista 01</p>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-2 h-2 rounded-full border-2 border-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Em andamento</span>
                                    <span class="ml-auto text-[10px] text-slate-300 material-symbols-outlined text-sm">schedule</span>
                                </div>
                            </div>
                            
                            <!-- Card Matemática (Azul Claro) -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Matemática</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Análise Combinatória</h4>
                                <p class="text-[11px] text-slate-500 font-medium pl-2 mt-1">Resolução bloco A</p>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>
                            
                            <!-- Card Concluído (Verde) -->
                            <div class="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 opacity-70 group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-md uppercase tracking-wider">Despertar</span>
                                </div>
                                <h4 class="font-bold text-slate-500 line-through text-sm leading-snug pl-2">Leitura Matinal</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-[8px] text-white font-bold">check</span>
                                    </div>
                                    <span class="text-[10px] font-bold text-emerald-600 uppercase">Cumprido</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- DIA: TERÇA -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px]">
                        <div class="bg-white rounded-t-3xl border-b-0 border border-slate-100 p-5 text-center relative z-10 shrink-0">
                            <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Terça</h3>
                            <p class="text-2xl font-headline font-extrabold text-[#0B193C] mt-0.5">07 <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-slate-50/50 border border-t-0 border-slate-100 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                            
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Biologia</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Citologia Avançada</h4>
                                <p class="text-[11px] text-slate-500 font-medium pl-2 mt-1">Módulo 4</p>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>
                            
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Química</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Soluções</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- DIA: QUARTA -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px]">
                        <div class="bg-white rounded-t-3xl border-b-0 border border-slate-100 p-5 text-center relative z-10 shrink-0">
                            <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Quarta</h3>
                            <p class="text-2xl font-headline font-extrabold text-[#0B193C] mt-0.5">08 <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-slate-50/50 border border-t-0 border-slate-100 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                            
                            <!-- Card Redação (Roxo) -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Redação</span>
                                    <span class="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 rounded whitespace-nowrap">Alta Prioridade</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Competência 3</h4>
                                <p class="text-[11px] text-slate-500 font-medium pl-2 mt-1">Produção textual semanal</p>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>
                            
                            <!-- Card BQ (Laranja) -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Exercícios</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Banco de Questões</h4>
                                <p class="text-[11px] text-slate-500 font-medium pl-2 mt-1">Meta 30 itens variados</p>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- DIA: QUINTA -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px]">
                        <div class="bg-white rounded-t-3xl border-b-0 border border-slate-100 p-5 text-center relative z-10 shrink-0">
                            <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Quinta</h3>
                            <p class="text-2xl font-headline font-extrabold text-[#0B193C] mt-0.5">09 <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-slate-50/50 border border-t-0 border-slate-100 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                            
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Física</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Cinemática Escalar</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>
                            
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Química</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Estequiometria Básica</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- DIA: SEXTA -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px]">
                        <div class="bg-white rounded-t-3xl border-b-0 border border-slate-100 p-5 text-center relative z-10 shrink-0">
                            <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Sexta</h3>
                            <p class="text-2xl font-headline font-extrabold text-[#0B193C] mt-0.5">10 <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-slate-50/50 border border-t-0 border-slate-100 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar">
                            
                            <!-- Card Rosa Atenção -->
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Atenção Especial</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Simulado ENEM (Dia 1)</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>
                            
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">Diagnóstico</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Correção de Erros</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- DIA: SÁBADO -->
                    <div class="snap-start flex-shrink-0 w-[290px] xl:w-[calc(14.28%-20px)] flex flex-col h-[700px]">
                        <div class="bg-white rounded-t-3xl border-b-0 border border-slate-100 p-5 text-center relative z-10 shrink-0 opacity-80">
                            <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Sábado</h3>
                            <p class="text-2xl font-headline font-extrabold text-[#0B193C] mt-0.5">11 <span class="text-[12px] text-slate-400 font-semibold align-top ml-0.5">Abr</span></p>
                        </div>
                        
                        <div class="bg-slate-50/50 border border-t-0 border-slate-100 rounded-b-3xl p-3 flex-1 overflow-y-auto space-y-3 relative custom-scrollbar opacity-80">
                            
                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Estratégia</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Revisão Estratégica</h4>
                                <p class="text-[11px] text-slate-500 font-medium pl-2 mt-1">Plataforma Med</p>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400 rounded-l-2xl"></div>
                                <div class="flex justify-between items-start mb-2 pl-2">
                                    <span class="text-[9px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">Análise</span>
                                </div>
                                <h4 class="font-bold text-[#0B193C] text-sm leading-snug pl-2">Atualização de Desempenho</h4>
                                <div class="mt-3 flex items-center gap-2 pl-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">Pendente</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

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
"@

$file = "$pwd\mentoria.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Locate bounds
$start = "<!-- MAIN GRID & LAYOUT -->"
$end = "<!-- Safe Space -->"

$idx1 = $content.IndexOf($start)
$idx2 = $content.IndexOf($end, $idx1)

if ($idx1 -ge 0 -and $idx2 -ge 0) {
    $pre = $content.Substring(0, $idx1)
    $post = $content.Substring($idx2)
    $newContent = $pre + $html + "`r`n            " + $post
    [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
    Write-Output "Successfully injected Kanban planner."
} else {
    Write-Output "Could not locate insertion points."
}
