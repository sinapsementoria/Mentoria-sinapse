
        let draftSemana = [];
        const daysNamesFull = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

        document.addEventListener('DOMContentLoaded', () => {
            const tod = new Date();
            const dateStr = `${tod.getFullYear()}-${String(tod.getMonth()+1).padStart(2,'0')}-${String(tod.getDate()).padStart(2,'0')}`;
            const dtInput = document.getElementById('bData');
            if(dtInput) dtInput.value = dateStr;
            renderDraft();
        });

        function adicionarAoRascunho() {
            const dataVal = document.getElementById('bData').value;
            const disciplina = document.getElementById('bDisciplina').value;
            const assunto = document.getElementById('bAssunto').value;

            if(!dataVal) { alert("Por favor, selecione a data."); return; }
            if(!assunto.trim()) { alert("Por favor, digite o conteúdo/assunto."); return; }

            const dObj = new Date(dataVal + "T12:00:00");

            draftSemana.push({
                id: Date.now() + Math.random(),
                title: disciplina + ' - ' + assunto,
                date: dataVal,
                weekday: dObj.getDay(),
                discipline: disciplina,
                subject: assunto
            });

            document.getElementById('bAssunto').value = '';
            document.getElementById('bAssunto').focus();
            
            renderDraft();
        }

        function renderDraft() {
            const container = document.getElementById('draftContainer');
            const countLbl = document.getElementById('lblDraftCount');
            const btnPub = document.getElementById('btnPublicar');
            
            countLbl.innerText = `${draftSemana.length} metas na fila`;
            if(draftSemana.length > 0) {
                btnPub.classList.remove('opacity-50', 'pointer-events-none');
                container.innerHTML = draftSemana.map(task => `
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between draft-slide-in shadow-sm">
                        <div class="overflow-hidden">
                            <span class="text-[9px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded tracking-widest">${task.discipline}</span>
                            <p class="text-[#0B193C] font-bold text-sm mt-1 leading-tight truncate px-1">${task.subject}</p>
                            <p class="text-xs text-slate-400 font-medium mt-1 px-1"><span class="material-symbols-outlined text-[12px] align-middle mr-1">calendar_today</span>${task.date.split('-').reverse().join('/')}</p>
                        </div>
                        <button onclick="removerDoRascunho(${task.id})" class="text-slate-300 hover:text-red-500 transition-colors ml-4 flex-none"><span class="material-symbols-outlined">delete</span></button>
                    </div>
                `).join('');
            } else {
                btnPub.classList.add('opacity-50', 'pointer-events-none');
                container.innerHTML = `
                    <div class="m-auto text-center opacity-50 flex flex-col items-center">
                        <span class="material-symbols-outlined text-[48px] mb-2 text-slate-300">inventory_2</span>
                        <p class="text-sm font-bold text-slate-500">Nenhum rascunho</p>
                        <p class="text-xs text-slate-400 max-w-[200px] mt-1">Selecione um dia e crie tarefas para preencher este mural.</p>
                    </div>
                `;
            }
        }

        function removerDoRascunho(id) {
            draftSemana = draftSemana.filter(t => t.id !== id);
            renderDraft();
        }

        function publicarPlanejamento() {
            if(!window.db) return;

            const btnPub = document.getElementById('btnPublicar');
            const originalH = btnPub.innerHTML;
            btnPub.innerHTML = '<span class="material-symbols-outlined animate-spin text-[24px]">hourglass_empty</span> Salvando...';
            btnPub.classList.add('opacity-80', 'pointer-events-none');

            setTimeout(() => {
                draftSemana.forEach(t => {
                    window.db.insert('activities', {
                        user_id: 1, 
                        title: t.title,
                        description: '',
                        date: t.date,
                        time: '14:00',
                        weekday: t.weekday,
                        activity_type: 'Estudo Teórico / Exercícios',
                        discipline: t.discipline,
                        subject: t.subject,
                        priority: 'média',
                        status: 'pendente' 
                    });
                });

                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                draftSemana = [];
                renderDraft();
                
                btnPub.innerHTML = '<span class="material-symbols-outlined text-[24px]">check_circle</span> Sincronizado!';
                btnPub.classList.replace('bg-emerald-500', 'bg-indigo-600');
                
                setTimeout(() => {
                    window.location.href = 'mentoria.html';
                }, 1500);

            }, 600);
        }
    
        const mapAssuntos = {
            "ARTES CÊNICAS": [
                "CENÁRIO", "DANÇA COMO MANIFESTAÇÃO ARTÍSTICA", "ELEMENTOS DO TEATRO", "ENCENAÇÃO", 
                "EXPRESSÃO CORPORAL", "FIGURINO", "GÊNEROS TEATRAIS", "HISTÓRIA DO TEATRO", 
                "ILUMINAÇÃO", "INTERPRETAÇÃO", "LINGUAGEM TEATRAL", "PERFORMANCE", "PERSONAGEM", 
                "SONOPLASTIA", "TEXTO DRAMÁTICO", "TEATRO BRASILEIRO", "TEATRO CONTEMPORÂNEO", 
                "TEATRO GREGO", "TEATRO MEDIEVAL", "TEATRO MODERNO"
            ],
            "ARTES VISUAIS": [
                "ABSTRACIONISMO", "ARTE BRASILEIRA", "ARTE CONTEMPORÂNEA", "ARTE DIGITAL", "ARTE EGÍPCIA", 
                "ARTE GREGA", "ARTE MEDIEVAL", "ARTE ROMANA", "ARTE RUPESTRE", "BARROCO", "CINEMA", 
                "COMPOSIÇÃO VISUAL", "CUBISMO", "DADAÍSMO", "DESENHO", "ELEMENTOS DA LINGUAGEM VISUAL", 
                "ESCULTURA", "EXPRESSIONISMO", "FAUVISMO", "FOTOGRAFIA", "FUTURISMO", "GRAVURA", 
                "IMPRESSIONISMO", "LEITURA E INTERPRETAÇÃO DE OBRAS", "LUZ E SOMBRA", "MODERNISMO", 
                "NEOCLASSICISMO", "PATRIMÔNIO CULTURAL", "PERSPECTIVA", "PINTURA", "PONTO, LINHA, FORMA E COR", 
                "REALISMO", "RENASCIMENTO", "ROMANTISMO", "SEMANA DE ARTE MODERNA DE 1922", "SURREALISMO"
            ],
            "BIOLOGIA": [
                "1ª LEI DE MENDEL", "2ª LEI DE MENDEL", "ÁCIDOS NUCLEICOS E DUPLICAÇÃO DO DNA", "ALGAS", "ÁGUA", "ÁGUA E SAIS MINERAIS",
                "AMINOÁCIDOS", "AMINOÁCIDOS E PROTEÍNAS", "ANATOMIA VEGETAL", "ARTRÓPODES", "ATP E METABOLISMO ENERGÉTICO",
                "BACTÉRIAS E BACTERIOSES", "BIOTECNOLOGIA", "BRIÓFITAS", "CARBOIDRATOS E VITAMINAS", "CICLOS BIOGEOQUÍMICOS",
                "CITOESQUELETO", "CLONAGEM", "CNIDÁRIOS", "CÉLULA ANIMAL", "CÉLULA VEGETAL", "CÉLULA PROCARIONTE", "CÉLULA EUCARIONTE",
                "DIFERENÇAS ENTRE CÉLULA ANIMAL E VEGETAL", "DIFERENÇAS ENTRE CÉLULA PROCARIONTE E EUCARIONTE", "DISPERSÃO DE SEMENTES",
                "DOENÇAS CAUSADAS POR VÍRUS, BACTÉRIAS, PROTOZOÁRIOS E FUNGOS", "DOENÇAS CAUSADAS POR VÍRUS", "DOENÇAS CAUSADAS POR BACTÉRIAS",
                "DOENÇAS CAUSADAS POR PROTOZOÁRIOS", "DOENÇAS CAUSADAS POR FUNGOS", "ECOLOGIA", "EMBRIOLOGIA", "ENDOCITOSE E EXOCITOSE",
                "ENGENHARIA GENÉTICA", "ENZIMAS", "EPIDEMIOLOGIA", "EQUINODERMOS E PROTOCORDADOS", "EVIDÊNCIAS EVOLUTIVAS", "EVOLUÇÃO HUMANA",
                "EXCEÇÕES À 1ª LEI DE MENDEL E POLIALELIA", "FISIOLOGIA COMPARADA DOS ANIMAIS", "FITORMÔNIOS", "FOTOSSÍNTESE E QUIMIOSSÍNTESE",
                "GENÉTICA DE POPULAÇÕES", "GENÉTICA MOLECULAR", "GERMINAÇÃO", "GIMNOSPERMAS E ANGIOSPERMAS",
                "GRUPOS SANGUÍNEOS (SISTEMA ABO E FATOR RH)", "HERANÇA LIGADA AO SEXO", "HISTOLOGIA E MORFOLOGIA VEGETAL", "HOMEOSTASE",
                "IMPACTOS AMBIENTAIS", "IMUNOLOGIA E VACINAS", "INTERAÇÕES GÊNICAS", "ISTS", "LAMARCKISMO E DARWINISMO", "LINKAGE",
                "LIPÍDIOS", "MAMÍFEROS", "MEIOSE E ALTERAÇÕES CROMOSSÔMICAS", "MÉTODOS CONTRACEPTIVOS", "MOLUSCOS E ANELÍDEOS",
                "NEMATELMINTOS E VERMINOSES", "NEODARWINISMO", "NÚCLEO CELULAR E MITOSE", "ORGANELAS CELULARES", "ORIGEM DA VIDA",
                "PARASITOLOGIA", "PEIXES E ANFÍBIOS", "PERMEABILIDADE SELETIVA", "PLATELMINTOS E VERMINOSES", "PROTOCORDADOS", "PROTEÍNAS",
                "POLINIZAÇÃO", "PONTO DE COMPENSAÇÃO FÓTICO E FOTOPERODO", "PORÍFEROS", "PORÍFEROS E CNIDÁRIOS", "PROFILAXIA", "PROTOZOÁRIOS",
                "PROTOZOÁRIOS E ALGAS", "PTERIDÓFITAS", "REINO FUNGI", "RÉPTEIS E AVES", "REPRODUÇÃO DOS VERTEBRADOS", "REPRODUÇÃO VEGETAL",
                "RESPIRAÇÃO CELULAR E FERMENTAÇÃO", "SAIS MINERAIS", "SISTEMA CIRCULATÓRIO", "SISTEMA DIGESTÓRIO", "SISTEMA ENDÓCRINO",
                "SISTEMA EXCRETOR", "SISTEMA IMUNE", "SISTEMA NERVOSO", "SISTEMA REPRODUTOR FEMININO", "SISTEMA REPRODUTOR MASCULINO",
                "SISTEMA RESPIRATÓRIO", "SISTEMA URINÁRIO", "SISTEMÁTICA FILOGENÉTICA", "TAXONOMIA E NOMENCLATURA CIENTÍFICA",
                "TECIDO MUSCULAR", "TECIDO NERVOSO", "TECIDO ÓSSEO E TECIDO SANGUÍNEO",
                "TECIDOS CONJUNTIVOS PROPRIAMENTE DITOS, TECIDO ADIPOSO E TECIDO CARTILAGINOSO", "TECIDOS EPITELIAIS", "TECIDOS VEGETAIS",
                "TEORIAS EVOLUTIVAS", "TERAPIA GÊNICA", "TIPOS CELULARES E MEMBRANA PLASMÁTICA", "TIPOS DE SELEÇÃO E ESPECIAÇÃO",
                "TRANSCRIÇÃO E TRADUÇÃO", "TRANSGÊNICOS", "TRANSPORTE PELA MEMBRANA", "VITAMINAS", "VÍRUS E VIROSES"
            ],
            "EDUCAÇÃO FÍSICA": [
                "ATIVIDADE FÍSICA E QUALIDADE DE VIDA", "CAPACIDADES FÍSICAS", "CORPO, CULTURA E SOCIEDADE", 
                "CORPO E IDENTIDADE", "DANÇA", "DOPING NO ESPORTE", "ESPORTES", "ESPORTES COLETIVOS", 
                "ESPORTES INDIVIDUAIS", "EXERCÍCIO FÍSICO E SAÚDE", "GINÁSTICA", "HISTÓRIA DA EDUCAÇÃO FÍSICA", 
                "INCLUSÃO E ACESSIBILIDADE NO ESPORTE", "JOGOS E BRINCADEIRAS", "JOGOS OLÍMPICOS E PARALÍMPICOS", 
                "LAZER E CULTURA CORPORAL", "LUTAS", "MÍDIA E PADRÕES CORPORAIS", "MOVIMENTO CORPORAL", 
                "OBESIDADE E SEDENTARISMO", "POSTURA CORPORAL", "PREVENÇÃO DE LESÕES", "PRIMEIROS SOCORROS NO ESPORTE", 
                "RECREAÇÃO", "SAÚDE COLETIVA E BEM-ESTAR", "SISTEMA MUSCULAR E MOVIMENTO", "TREINAMENTO FÍSICO", 
                "VALORES NO ESPORTE"
            ],
            "ESPANHOL": [
                "ACENTUAÇÃO", "ADJETIVOS", "ADVÉRBIOS", "ALFABETO E PRONÚNCIA", "APÓCOPE", 
                "ARTIGOS", "COMPREENSÃO LEITORA", "CONDICIONAL", "CONJUNÇÕES", "CONTRAÇÕES", 
                "CULTURA HISPÂNICA", "DISCURSO DIRETO E INDIRETO", "EXPRESSÕES IDIOMÁTICAS", 
                "FALSOS COGNATOS", "FUTURO", "GÊNERO E NÚMERO", "HETEROTÔNICOS, HETEROGENÉRICOS E HETEROSSEMÂNTICOS", 
                "IMPERATIVO", "INTERPRETAÇÃO DE TEXTO", "NUMERAIS", "PREPOSIÇÕES", 
                "PRESENTE DO INDICATIVO", "PRETÉRITO IMPERFEITO", "PRETÉRITO PERFEITO", "PRONOMES", 
                "PRONOMES DEMONSTRATIVOS", "PRONOMES INTERROGATIVOS", "PRONOMES PESSOAIS", 
                "PRONOMES POSSESSIVOS", "PRONOMES RELATIVOS", "SUBJUNTIVO", "SUBSTANTIVOS", 
                "TEMPOS VERBAIS", "VARIAÇÕES LINGUÍSTICAS", "VERBOS", "VERBOS IRREGULARES", 
                "VERBOS REGULARES", "VOCABULÁRIO", "VOZ ATIVA E VOZ PASSIVA"
            ],
            "FILOSOFIA": [
                "ALIENAÇÃO", "ARGUMENTAÇÃO", "ARISTÓTELES", "CIDADANIA", "CONHECIMENTO", 
                "CONTRATO SOCIAL", "CRITICISMO", "DEMOCRACIA", "EMPIRISMO", "EPISTEMOLOGIA", 
                "ESCOLÁSTICA", "ESTADO", "ESTÉTICA", "ÉTICA", "EXISTENCIALISMO", "FENOMENOLOGIA", 
                "FILOSOFIA ANTIGA", "FILOSOFIA CONTEMPORÂNEA", "FILOSOFIA DA ARTE", "FILOSOFIA DA CIÊNCIA", 
                "FILOSOFIA MEDIEVAL", "FILOSOFIA MODERNA", "HELENISMO", "IDEALISMO", "IDEOLOGIA", 
                "ILUMINISMO", "INTRODUÇÃO À FILOSOFIA", "JUSTIÇA", "LIBERDADE", "LÓGICA", 
                "MARXISMO", "MATERIALISMO", "MITO E FILOSOFIA", "MORAL", "NIILISMO", 
                "ORIGEM DA FILOSOFIA", "PATRÍSTICA", "PLATÃO", "PODER", "POLÍTICA", "POSITIVISMO", 
                "PRÉ-SOCRÁTICOS", "RACIONALISMO", "RAZÃO", "RENASCIMENTO E HUMANISMO", 
                "SENSO COMUM E CONHECIMENTO FILOSÓFICO", "SÓCRATES", "VERDADE"
            ],
            "FÍSICA": [
                "ACÚSTICA: QUALIDADES FISIOLGICAS DO SOM", "APARELHOS DE MEDIDAS ELÉTRICAS REAIS", "APLICAÇÕES DA REFRAÇÃO LUMINOSA", 
                "AS FORÇAS FUNDAMENTAIS DA MECÂNICA", "ASSOCIAÇÃO DE CAPACITORES", "ASSOCIAÇÃO DE RESISTORES", 
                "CAMPO ELÉTRICO E AS LINHAS DE FORÇA", "CAMPO MAGNÉTICO GERADO POR CORRENTE ELÉTRICA", 
                "CARGA ELÉTRICA & PROCESSOS DE ELETRIZAÇÃO", "CENTRO DE GRAVIDADE & CENTRO DE MASSA", 
                "CIRCUITOS ELÉTRICOS RESISTOR-CAPACITOR", "CONCEITOS BÁSICOS DA CINEMÁTICA ESCALAR", 
                "CONCEITOS FUNDAMENTAIS DA HIDRODINÂMICA", "CONCEITOS FUNDAMENTAIS DA TERMODINÂMICA", 
                "DIFRAÇÃO, POLARIZAÇÃO, RESSONÂNCIA E EFEITO DOPPLER", "DILATAÇÃO TÉRMICA DOS SÓLIDOS, LÍQUIDOS E GASES", 
                "DINÂMICA CLÁSSICA E AS LEIS DE NEWTON", "DINÂMICA DO MCU & APLICAÇÕES", "ELETRODINÂMICA: AS LEIS DE OHM", 
                "ENERGIA MECÂNICA E SUA CONSERVAÇÃO", "EQUILÍBRIO ELETROSTÁTICO E CAPACITÂNCIA", "ESCALAS TERMOMÉTRICAS CONSAGRADAS PELO USO", 
                "ESPELHOS ESFÉRICOS DE GAUSS", "ESPELHOS PLANOS & PROPRIEDADES", "ESTÁTICA DO PONTO MATERIAL E DO CORPO EXTENSO", 
                "ESTUDO DAS GRANDEZAS FÍSICAS ESCALARES", "ESTUDO DAS GRANDEZAS FÍSICAS VETORIAIS", "ESTUDO DO CALOR SENSÍVEL E DO CALOR LATENTE", 
                "FÍSICA NUCLEAR E FÍSICA DE PARTÍCULAS", "FORÇA DE ATRITO ENTRE SÓLIDOS E FORÇA DE RESISTÊNCIA DO AR", 
                "FORÇA ELETROSTÁTICA: LEI DE COULOMB", "FORÇA MAGNÉTICA DE LORENTZ", "FUNDAMENTOS DA FÍSICA QUÂNTICA", 
                "FUSÍVEIS E DISJUNTORES, LÂMPADAS E LEDS", "GERADORES ELÉTRICOS REAIS E RECEPTORES ELÉTRICOS", 
                "GRANDEZAS ELETRODINÂMICAS FUNDAMENTAIS", "IMPULSO E QUANTIDADE DE MOVIMENTO LINEAR", "INTERFERÊNCIA DE ONDAS", 
                "INTRODUÇÃO À ASTRONOMIA, AS LEIS DA GRAVITAÇÃO UNIVERSAL & MECÂNICA CELESTE", "INTRODUÇÃO À CINEMÁTICA VETORIAL", 
                "INTRODUÇÃO À MECÂNICA ESTATÍSTICA - GASES IDEAIS", "LANÇAMENTO HORIZONTAL (LH) & LANÇAMENTO OBLÍQUO (LO)", 
                "LANÇAMENTOS DE CARGA ELÉTRICA NO CEU", "LEI DE GAUSS PARA A ELETROSTÁTICA", "LEIS DE KIRCHHOFF", 
                "LEIS DE MAXWELL & ONDAS ELETROMAGNÉTICAS", "LEIS GERAIS DAS MUDANÇAS DE ESTADOS FÍSICOS DA MATÉRIA", 
                "LENTES ESFÉRICAS E AS CONDIÇÕES DE GAUSS", "MAGNETOSTÁTICA", "MÁQUINAS MECÂNICAS SIMPLES", "MOVIMENTO CIRCULAR UNIFORME (MCU)", 
                "MOVIMENTO HARMÔNICO SIMPLES (MHS)", "MOVIMENTOS RETILÍNEOS: MRU & MRUV", "ÓPTICA DE VISÃO HUMANA / INSTRUMENTOS ÓPTICOS", 
                "ONDAS ESTACIONÁRIAS E INSTRUMENTOS SONOROS", "POTÊNCIA ELÉTRICA & CONSUMO DE ENERGIA ELÉTRICA", 
                "POTENCIAL ELÉTRICO E ENERGIA POTENCIAL", "PRIMEIRA LEI DA TERMODINÂMICA", "PRINCÍPIO DA INDUÇÃO ELETROMAGNÉTICA", 
                "PRINCÍPIOS BÁSICOS DA HIDROSTÁTICA", "PRINCÍPIOS BÁSICOS DA ÓPTICA GEOMÉTRICA", "PROCESSOS DE TRANSMISSÃO DO CALOR", 
                "QUEDA LIVRE E LANÇAMENTO ASCENCIONAL", "REFLEXÃO E REFRAÇÃO DAS ONDAS", "REFLEXÃO E REFRAÇÃO LUMINOSA", 
                "RELAÇÃO FUNDAMENTAL DA ONDULATÓRIA", "RELATIVIDADE DE GALILEU: COMPOSIÇÃO DE MOVIMENTO", 
                "SEGUNDA LEI DA TERMODINÂMICA & MÁQUINAS TÉRMICAS", "TEORIA DA RELATIVIDADE RESTRITA (1905)", "TEORIA DAS COLISÕES MECÂNICAS", 
                "TRABALHO MECÂNICO, POTÊNCIA E RENDIMENTO"
            ],
            "GEOGRAFIA": [
                "AGRICULTURA", "AMÉRICA LATINA", "BIOMAS", "BLOCOS ECONÔMICOS", "CHINA E TIGRES ASIÁTICOS", 
                "CLIMATOLOGIA", "CLIMATOLOGIA BRASILEIRA", "DEMOGRAFIA", "ENERGIA E INFRAESTRUTURA", 
                "GEOLOGIA", "GEOLOGIA E MINERAÇÃO BRASILEIRAS", "GLOBALIZAÇÃO E NOVA ORDEM ECONÔMICA", 
                "GUERRA FRIA", "HIDROGRAFIA", "ORIENTE MÉDIO", "RELEVO E SOLOS", "RELEVO E SOLOS BRASILEIROS", 
                "URBANIZAÇÃO"
            ],
            "GRAMATICA": [
                "ACENTUAÇÃO GRÁFICA E ORTOGRAFIA", "CONCORDÂNCIA VERBAL E NOMINAL", "ESTRUTURA E FORMAÇÃO DE PALAVRAS", 
                "FONEMAS, ENCONTROS VOCÁLICOS E CONSONANTAIS", "ORAÇÕES SUBORDINADAS ADVERBIAIS E O VALOR SEMÂNTICO DAS CONJUNÇÕES", 
                "ORAÇÕES SUBORDINADAS SUBSTANTIVAS E ADJETIVAS", "PERÍODO COMPOSTO POR COORDENAÇÃO E CONJUNÇÕES COORDENATIVAS", 
                "PONTUAÇÃO E REVISÃO GERAL DE VÍCIOS DE LINGUAGEM", "PRONOMES PESSOAIS E POSSESSIVOS", 
                "PRONOMES RELATIVOS, DEMONSTRATIVOS E INDEFINIDOS", "REGÊNCIA E O USO DO SINAL INDICATIVO DE CRASE", 
                "SUBSTANTIVO E ADJETIVO", "TERMOS ACESSÓRIOS – ADJUNTO ADNOMINAL, ADVERBIAL, APOSTO E VOCATIVO", 
                "TERMOS ESSENCIAIS DA ORAÇÃO - TIPOS DE SUJEITO E PREDICADO", "TERMOS INTEGRANTES – OBJETOS, COMPLEMENTO NOMINAL E AGENTE DA PASSIVA", 
                "VERBOS"
            ],
            "HISTÓRIA": [
                "A FORMAÇÃO DO POVO GREGO", "A REFORMA PROTESTANTE", "AMÉRICA PORTUGUESA", 
                "ASCENSÃO DAS MONARQUIAS NACIONAIS: O ABSOLUTISMO", "BAIXA IDADE MÉDIA – RENASCIMENTO COMERCIAL E URBANO / CRUZADAS", 
                "BRASIL COLONIAL", "BRASIL PRÉ-CABRALINO", "CRISE DO POPULISMO", "CRISE DO SISTEMA COLONIAL", 
                "DITADURAS MILITARES NA AMÉRICA DO SUL", "ENTRE GUERRAS, CRISE DE 20 E TOTALITARISMO", "ERA VARGAS", 
                "ESPARTA E ATENAS", "EXPANSÃO MARÍTIMA PORTUGUESA", "FEUDALISMO", "HISTÓRIA DOS EUA", 
                "IMPERIALISMO E NEOCOLONIALISMO", "IMPÉRIO ROMANO", "INTRODUÇÃO AO CURSO DE HISTÓRIA GERAL", 
                "JK – HISTÓRIA DE BRASÍLIA", "MERCANTILISMO", "NASCIMENTO DE ROMA (MONARQUIA E REPÚBLICA)", 
                "O ISLAMISMO – ORIGEM E EXPANSÃO", "O MUNDO PS-GUERRA", "O PROCESSO DE INDEPENDÊNCIA – INDEPENDÊNCIA DO BRASIL", 
                "O PROCESSO DE INDEPENDÊNCIA NA AMÉRICA LATINA", "O PROCESSO DE TRANSIÇÃO DA MONARQUIA À REPÚBLICA", 
                "PERÍODO CLÁSSICO E PERÍODO HELENÍSTICO", "PERÍODO NAPOLEÔNICO", "PERÍODO REGENCIAL – REVOLTAS REGENCIAIS", 
                "PRIMEIRA GRANDE GUERRA", "PRIMEIRA REPÚBLICA", "PRIMEIRO REINADO", "RECONSTRUÇÃO DEMOCRÁTICA", 
                "REINOS BÁRBAROS – IMPÉRIO BIZANTINO E CAROLÍNGIO", "RENASCIMENTO", "REPÚBLICA POPULISTA", 
                "REVOLUÇÃO FRANCESA", "REVOLUÇÃO INGLESA", "REVOLUÇÃO RUSSA", "REVOLUÇÕES BURGUESAS", 
                "REVOLUÇÕES INDUSTRIAIS", "SEGUNDA GRANDE GUERRA", "SEGUNDO REINADO", 
                "TRABALHO ESCRAVO NO BRASIL – LEGADO SOCIOCULTURAL", "UNIÃO IBÉRICA"
            ],
            "INGLÊS": [
                "ADJETIVOS", "ADVÉRBIOS", "ANÁLISE E INTERPRETAÇÃO DE TEXTOS", "ARTIGOS", "CONCORDÂNCIA NOMINAL", 
                "CONCORDÂNCIA VERBAL", "CONDICIONALS", "CONJUNÇÕES", "DISCURSO DIRETO E INDIRETO", "FALSE FRIENDS", 
                "FORMAÇÃO DE PALAVRAS", "FUTURE TENSES", "GENITIVE CASE", "GERUND AND INFINITIVE", "IMPERATIVO", 
                "INTERPRETAÇÃO DE TEXTO", "MODAL VERBS", "PASSIVE VOICE", "PAST CONTINUOUS", "PAST PERFECT", 
                "PERSONAL PRONOUNS", "PHRASAL VERBS", "POSSESSIVE ADJECTIVES AND PRONOUNS", "PREFIXOS E SUFIXOS", 
                "PREPOSITIONS", "PRESENT CONTINUOUS", "PRESENT PERFECT", "PRONOMES", "PRONOMES DEMONSTRATIVOS", 
                "PRONOMES INDEFINIDOS", "PRONOMES INTERROGATIVOS", "PRONOMES RELATIVOS", "QUANTIFIERS", 
                "QUESTION TAGS", "READING COMPREHENSION", "REPORTED SPEECH", "SIMPLE PAST", "SIMPLE PRESENT", 
                "SUBSTANTIVOS", "THERE IS / THERE ARE", "VERB TO BE", "VERBAL TENSES", "VOCABULÁRIO", 
                "WH- QUESTIONS"
            ],
            "LITERATURA": [
                "ARCADISMO NO BRASIL", "AS VANGUARDAS EUROPEIAS E SEU REFLEXO NO BRASIL", "BARROCO NO BRASIL", 
                "CONTEXTO HISTÓRICO DO ROMANTISMO", "INTERPRETAÇÃO DE TEXTOS LITERÁRIOS E FIGURAS DE LINGUAGEM", 
                "LITERATURA AFRO-BRASILEIRA E LITERATURA INDÍGENA BRASILEIRA", "LITERATURA DE INFORMAÇÃO", 
                "MODERNISMO – 2ª FASE", "MODERNISMO – 3ª FASE", "NATURALISMO", "O PRÉ-MODERNISMO E A IMPORTÂNCIA SOCIAL", 
                "O QUE É LITERATURA?", "OBRAS RELEVANTES DO ROMANTISMO, NATURALISMO E PARNASIANISMO", 
                "PARNASIANISMO", "POESIA MARGINAL – GERAÇÃO MIMEÓGRAFO E LITERATURA DE PROTESTO", 
                "REVISÃO – FIGURAS DE LINGUAGEM, BARROCO E ARCADISMO", "ROMANTISMO - PROSA", 
                "ROMANTISMO – 1ª GERAÇÃO", "ROMANTISMO – 2ª GERAÇÃO", "ROMANTISMO – 3ª GERAÇÃO", 
                "SEMANA DE ARTE MODERNA E MODERNISMO – 1ª FASE", "SIMBOLISMO"
            ],
            "MATEMÁTICA": [
                "ÂNGULOS", "ÁREAS DO TRIÂNGULO", "ÁREAS DOS QUADRILÁTEROS NOTÁVEIS", "ÁREAS NO CÍRCULO", 
                "ARRANJO", "CEVIANAS E PONTOS NOTÁVEIS", "CICLO TRIGONOMÉTRICO", "CILINDROS", 
                "CIRCUNFERÊNCIA – ÂNGULOS E ARCOS NA CIRCUNFERÊNCIA E POTÊNCIA DE PONTO", "COMBINAÇÃO", 
                "CONES", "CONJUNTOS NUMÉRICOS", "DETERMINANTES", "DISTÂNCIA DE PONTO A RETA", 
                "EQUAÇÃO DO 1º GRAU", "EQUAÇÃO DO 2º GRAU", "EQUAÇÃO EXPONENCIAL", "EQUAÇÃO TRIGONOMÉTRICA", 
                "EQUAÇÕES EXPONENCIAIS", "ESFERA", "ESTATÍSTICA – MEDIDAS DE DISPERSÃO", 
                "ESTATÍSTICA – MEDIDAS DE TENDÊNCIA CENTRAL", "ESTUDO DA CIRCUNFERÊNCIA", "ESTUDO DA RETA", 
                "ESTUDO DO PONTO", "FATORAÇÃO", "FRAÇÃO", "FUNÇÃO COMPOSTA", "FUNÇÃO EXPONENCIAL", 
                "FUNÇÃO INJETORA, SOBREJETORA E BIJETORA", "FUNÇÃO INVERSA", "FUNÇÃO LOGARÍTMICA", 
                "FUNÇÃO MODULAR E INEQUAÇÕES", "FUNÇÃO POLINOMIAL DO 1º GRAU", "FUNÇÃO POLINOMIAL DO 2º GRAU", 
                "FUNÇÕES TRIGONOMÉTRICAS", "GRANDEZAS PROPORCIONAIS", "IDENTIDADES TRIGONOMÉTRICAS E SOMA DE ARCO", 
                "INTRODUÇÃO AO ESTUDO DAS FUNÇÕES", "INTRODUÇÃO À GEOMETRIA ESPACIAL", "LEI DOS COSSENOS", 
                "LEI DOS SENOS", "LOGARITMO", "MATEMÁTICA FINANCEIRA", "MATRIZES", "MÚLTIPLOS E DIVISORES", 
                "NÚMEROS COMPLEXOS", "PERMUTAÇÃO", "PIRÂMIDES", "POLIEDROS DE PLATÃO", "POLÍGONOS", 
                "POLÍGONOS REGULARES", "POLINÔMIOS", "PORCENTAGEM", "POTENCIAÇÃO", "PRINCÍPIO FUNDAMENTAL DA CONTAGEM", 
                "PRISMAS", "PROBABILIDADE – CONDICIONAL + COMBINATÓRIA", "PROBABILIDADE – DEFINIÇÃO + CONJUNTOS", 
                "PROBABILIDADE – EVENTOS COMPLEMENTARES + PORCENTAGEM", "PROBABILIDADE – EVENTOS SUCESSIVOS E INDEPENDÊNCIA", 
                "PRODUTOS NOTÁVEIS", "PROGRESSÃO ARITMÉTICA", "PROGRESSÃO GEOMÉTRICA", "QUADRILÁTEROS NOTÁVEIS", 
                "RADICIAÇÃO", "RAZÃO E PROPORÇÃO", "RELAÇÕES MÉTRICAS NO TRIÂNGULO RETÂNGULO", "RETAS PARALELAS", 
                "SEMELHANÇA DE TRIÂNGULOS", "SISTEMAS LINEARES", "TEOREMA DE TALES", "TEORIA DOS CONJUNTOS", 
                "TRIÂNGULOS", "TRIGONOMETRIA EM UM TRIÂNGULO QUALQUER", "TRIGONOMETRIA NO TRIÂNGULO RETÂNGULO", 
                "TRONCOS E SÓLIDOS SEMELHANTES"
            ],
            "QUÍMICA": [
                "ÁCIDOS CARBOXÍLICOS", "ÁLCOOIS, ÉTERES E FENÓIS", "ALDEÍDOS E CETONAS", "ATOMÍSTICA", 
                "CARBOIDRATOS E PROTEÍNAS", "CINÉTICA E TRANSMUTAÇÃO RADIOATIVA", "CLASSIFICAÇÃO DE CARBONOS E CADEIAS - HIDROCARBONETOS", 
                "ELETRÓLISE E ANÁLISE QUANTITATIVA", "ENTALPIA DE LIGAÇÃO E FORMAÇÃO", "ENTROPIA E ENERGIA LIVRE DE GIBBS", 
                "EQUILÍBRIO QUÍMICO (DESLOCAMENTO)", "ESTEQUIOMETRIA", "ESTUDO DAS LIGAÇÕES QUÍMICAS (IÔNICA)", 
                "ESTUDO DAS SOLUÇÕES (CLASSIFICAÇÃO DAS SOLUÇÕES)", "ESTUDO DAS SOLUÇÕES – CÁLCULO DAS CONCENTRAÇÕES DE SOLUÇÕES", 
                "ESTUDO DOS GASES", "FATORES NECESSÁRIOS PARA A REAÇÃO", "FUNÇÕES INORGÂNICAS (ÁCIDOS E BASES)", 
                "FUNÇÕES INORGÂNICAS (ÓXIDOS)", "FUNÇÕES INORGÂNICAS (SAIS)", "FUNÇÕES NITROGENADAS", 
                "FUNÇÕES NITROGENADAS E HALETOS ORGÂNICOS", "GEOMETRIA E FORÇAS INTERMOLECULARES", "INTRODUÇÃO À CINÉTICA QUÍMICA", 
                "INTRODUÇÃO À ELETROQUÍMICA", "INTRODUÇÃO ÀS FUNÇÕES INORGÂNICAS", "ISOMERIA", "LEIS PONDERAIS", 
                "LIGAÇÃO COVALENTE E SUAS PROPRIEDADES", "LIGAÇÃO METÁLICA", "LIPÍDEOS", "MANIPULAÇÃO DE SOLUÇÕES", 
                "MÉTODOS DE SEPARAÇÃO DE MISTURAS", "MODELOS ATÔMICOS", "NOX E REAÇÕES DE OXI-REDUÇÃO", "PH E POH", 
                "PILHA", "POLÍMEROS", "PRINCÍPIOS DE QUÍMICA ORGÂNICA", "PRODUTO DE SOLUBILIDADE (KPS)", 
                "PROPRIEDADES COLIGATIVAS", "PROPRIEDADES DOS COMPOSTOS ORGÂNICOS", "PROPRIEDADES PERIÓDICAS", 
                "QUÍMICA AMBIENTAL", "RADIOATIVIDADE", "REAÇÕES ORGÂNICAS", "REAÇÕES ORGÂNICAS (ESTERIFICAÇÃO/HIDRÓLISE)", 
                "REAÇÕES ORGÂNICAS (OXI-REDUÇÃO/POLIMERIZAÇÃO)", "REAÇÕES ORGÂNICAS (REAÇÕES DE ADIÇÃO)", 
                "REAÇÕES ORGÂNICAS (REAÇÕES DE ELIMINAÇÃO)", "REAÇÕES ORGÂNICAS (SAPONIFICAÇÃO)", "SUBSTÂNCIAS E MISTURAS", 
                "TABELA PERIÓDICA", "TEORIA ATÔMICO-MOLECULAR (MASSA MOLAR)", "TERMOQUÍMICA - ENTALPIA DE LIGAÇÃO E FORMAÇÃO", 
                "TRANSFORMAÇÃO E PROPRIEDADES DA MATÉRIA"
            ],
            "SOCIOLOGIA": [
                "AÇÃO SOCIAL", "ANOMIA", "CAPITALISMO", "CIDADANIA", "CIDADANIA E DIREITOS HUMANOS", 
                "CLASSES SOCIAIS", "CONSUMO", "CULTURA", "CULTURA DE MASSA", "DESIGUALDADE SOCIAL", 
                "DESVIOS SOCIAIS", "DIVERSIDADE CULTURAL", "DIVISÃO SOCIAL DO TRABALHO", "ESTADO", 
                "ESTRATIFICAÇÃO SOCIAL", "ETNOCENTRISMO", "FATOS SOCIAIS", "GLOBALIZAÇÃO", 
                "GRUPOS SOCIAIS", "IDEOLOGIA", "IDENTIDADE CULTURAL", "INDÚSTRIA CULTURAL", 
                "INSTITUIÇÕES SOCIAIS", "MÍDIA E SOCIEDADE", "MOVIMENTOS SOCIAIS", "PODER", 
                "POLÍTICA", "PRECONCEITO", "RELAÇÕES DE PODER", "SOCIALIZAÇÃO", "SOCIEDADE E TRABALHO", 
                "STATUS SOCIAL", "TRABALHO E ALIENAÇÃO", "URBANIZAÇÃO", "VIOLÊNCIA"
            ],
            "MÚSICA": [
                "ACÚSTICA MUSICAL", "ALTURA, INTENSIDADE, DURAÇÃO E TIMBRE", "APRECIAÇÃO MUSICAL", 
                "ELEMENTOS DA LINGUAGEM MUSICAL", "GÊNEROS MUSICAIS", "HARMONIA", "HISTÓRIA DA MÚSICA", 
                "INDÚSTRIA CULTURAL E MÚSICA", "INSTRUMENTOS MUSICAIS", "LEITURA E INTERPRETAÇÃO MUSICAL", 
                "MELODIA", "MÚSICA BRASILEIRA", "MÚSICA ERUDITA", "MÚSICA POPULAR", "MÚSICA E CULTURA", 
                "MÚSICA E IDENTIDADE SOCIAL", "MÚSICA E TECNOLOGIA", "NOTAÇÃO MUSICAL", 
                "PATRIMÔNIO MUSICAL BRASILEIRO", "PERCEPÇÃO SONORA", "PRODUÇÃO MUSICAL", "RITMO", 
                "SOM, SILÊNCIO E PAISAGEM SONORA"
            ]
        };

        const materias = [
            "ARTES CÊNICAS", "ARTES VISUAIS", "BIOLOGIA", "EDUCAÇÃO FÍSICA", "ESPANHOL", 
            "FILOSOFIA", "FÍSICA", "GEOGRAFIA", "GRAMÁTICA", "HISTÓRIA", "INGLÊS", 
            "LITERATURA", "MATEMÁTICA", "MÚSICA", "QUÍMICA", "SOCIOLOGIA"
        ];

        function renderMatDropdown() {
            const matOptions = document.getElementById('bDisciplinaOptions');
            matOptions.innerHTML = '';
            materias.forEach(m => {
                const div = document.createElement('div');
                div.className = "px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm font-bold text-[#0B193C] border-b border-slate-100 last:border-0 transition-colors";
                div.innerText = m;
                div.onclick = () => {
                    document.getElementById('bDisciplinaText').innerText = m;
                    document.getElementById('bDisciplinaText').classList.replace('text-slate-400', 'text-[#0B193C]');
                    document.getElementById('bDisciplinaText').classList.replace('font-medium', 'font-bold');
                    document.getElementById('bDisciplina').value = m;
                    document.getElementById('bDisciplinaDropdown').classList.add('hidden');
                    
                    // Reset e renderiza assuntos
                    document.getElementById('bAssuntoText').innerText = 'Selecione o assunto...';
                    document.getElementById('bAssuntoText').classList.add('text-slate-400', 'font-medium');
                    document.getElementById('bAssuntoText').classList.remove('text-[#0B193C]', 'font-bold');
                    document.getElementById('bAssuntoSelect').value = '';
                    document.getElementById('bAssuntoOutrosDiv').classList.add('hidden');
                    
                    carregarAssuntos(m);
                };
                matOptions.appendChild(div);
            });
        }

        function toggleMatDropdown(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('bDisciplinaDropdown');
            document.getElementById('bAssuntoDropdown').classList.add('hidden');
            dropdown.classList.toggle('hidden');
        }

        function toggleAssDropdown(e) {
            e.stopPropagation();
            if(!document.getElementById('bDisciplina').value) {
                alert("Selecione a matéria primeiro.");
                return;
            }
            const dropdown = document.getElementById('bAssuntoDropdown');
            document.getElementById('bDisciplinaDropdown').classList.add('hidden');
            dropdown.classList.toggle('hidden');
        }

        function carregarAssuntos(mat) {
            const assOptions = document.getElementById('bAssuntoOptions');
            assOptions.innerHTML = '';
            
            if (mat && mapAssuntos[mat]) {
                mapAssuntos[mat].forEach(ass => {
                    const div = document.createElement('div');
                    div.className = "px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm font-bold text-[#0B193C] border-b border-slate-100 transition-colors";
                    div.innerText = ass;
                    div.onclick = () => {
                        document.getElementById('bAssuntoText').innerText = ass;
                        document.getElementById('bAssuntoText').classList.replace('text-slate-400', 'text-[#0B193C]');
                        document.getElementById('bAssuntoText').classList.replace('font-medium', 'font-bold');
                        document.getElementById('bAssuntoSelect').value = ass;
                        document.getElementById('bAssuntoDropdown').classList.add('hidden');
                        checkOutros(ass);
                    };
                    assOptions.appendChild(div);
                });
            }
            
            // Add OUTROS at end
            const divOutros = document.createElement('div');
            divOutros.className = "px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm font-bold text-sinapse-primary transition-colors";
            divOutros.innerHTML = '<span class="material-symbols-outlined text-[14px] align-middle mr-1">add</span> OUTROS';
            divOutros.onclick = () => {
                document.getElementById('bAssuntoText').innerText = 'OUTROS';
                document.getElementById('bAssuntoText').classList.replace('text-slate-400', 'text-sinapse-primary');
                document.getElementById('bAssuntoText').classList.replace('font-medium', 'font-bold');
                document.getElementById('bAssuntoSelect').value = 'OUTROS';
                document.getElementById('bAssuntoDropdown').classList.add('hidden');
                checkOutros('OUTROS');
            };
            assOptions.appendChild(divOutros);
        }

        function checkOutros(val) {
            const inputAss = document.getElementById('bAssunto');
            const hiddenInput = document.getElementById('bAssuntoSelect');
            const divOutros = document.getElementById('bAssuntoOutrosDiv');
            
            if (val === 'OUTROS' || hiddenInput.value === 'OUTROS') {
                divOutros.classList.remove('hidden');
                inputAss.value = '';
                inputAss.focus();
            } else {
                divOutros.classList.add('hidden');
                inputAss.value = val; 
            }
        }
        
        // Hide dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if(!e.target.closest('#bDisciplinaTrigger') && !e.target.closest('#bDisciplinaDropdown')) {
                document.getElementById('bDisciplinaDropdown')?.classList.add('hidden');
            }
            if(!e.target.closest('#bAssuntoTrigger') && !e.target.closest('#bAssuntoDropdown')) {
                document.getElementById('bAssuntoDropdown')?.classList.add('hidden');
            }
        });

        // Setup initial triggers
        document.addEventListener("DOMContentLoaded", () => {
            renderMatDropdown();
        });

    
        window.autoCorrigirAcentos = function(input) {
            let text = input.value;
            if (!text) return;

            let cursor = input.selectionStart;

            const baseDict = {"matematica": "matemática", "fisica": "física", "quimica": "química", "historia": "história", "voce": "você", "ate": "até", "inicio": "início", "conteudo": "conteúdo", "desempenho": "desempenho", "avaliacao": "avaliação", "correcao": "correção", "questoes": "questões", "solucoes": "soluções", "quadratica": "quadrática", "geometria": "geometria", "trigonometria": "trigonometria", "matematica": "matemática", "matemtica": "matemática", "nmero": "número", "tringulo": "triângulo", "grfico": "gráfico", "pirmide": "pirâmide", "ento": "então", "retngulo": "retângulo", "mdia": "média", "aritmtica": "aritmética", "estatstica": "estatística", "questes": "questões", "distncia": "distância", "circunferncia": "circunferência", "progresso": "progressão", "questo": "questão", "geomtrica": "geométrica", "tambm": "também", "expresso": "expressão", "crculo": "círculo", "tringulos": "triângulos", "razo": "razão", "esto": "estão", "padro": "padrão", "nmeros": "números", "esfrica": "esférica", "contm": "contém", "slidos": "sólidos", "preo": "preço", "nexerccios": "\nexercícios", "dimetro": "diâmetro", "superfcie": "superfície", "princpio": "princípio", "logartmica": "logarítmica", "polgonos": "polígonos", "tendncia": "tendência", "disperso": "dispersão", "pgina": "página", "possvel": "possível", "vrtice": "vértice", "reservatrio": "reservatório", "equiltero": "equilátero", "trigonomtrico": "trigonométrico", "regio": "região", "polgono": "polígono", "trigonomtricas": "trigonométricas", "mxima": "máxima", "necessrio": "necessário", "espao": "espaço", "semelhana": "semelhança", "mnimo": "mínimo", "frmula": "fórmula", "possveis": "possíveis", "quadrilteros": "quadriláteros", "mdio": "médio", "perodo": "período", "centmetros": "centímetros", "peas": "peças", "ingesto": "ingestão", "sequncia": "sequência", "notveis": "notáveis", "slido": "sólido", "grficos": "gráficos", "sero": "serão", "mximo": "máximo", "parbola": "parábola", "vrtices": "vértices", "diferena": "diferença", "regies": "regiões", "milhes": "milhões", "funca": "função", "pginas": "páginas", "quadrtica": "quadrática", "quadriltero": "quadrilátero", "funcionrios": "funcionários", "trapzio": "trapézio", "issceles": "isósceles", "nrea": "\nárea", "contedo": "conteúdo", "nvel": "nível", "qumica": "química", "bactrias": "bactérias", "maro": "março", "aritmetica": "aritmética", "obtm": "obtém", "mdios": "médios", "varincia": "variância", "frmulas": "fórmulas", "incio": "início", "obrigatria": "obrigatória", "varivel": "variável", "servio": "serviço", "mnima": "mínima", "media": "média", "avio": "avião", "balo": "balão", "fisica": "física", "fsica": "física", "boto": "botão", "qumicas": "químicas", "extradas": "extraídas", "referncia": "referência", "salrio": "salário", "razes": "raízes", "diria": "diária", "substncia": "substância", "lanamento": "lançamento", "lancamento": "lançamento", "nngulo": "\nângulo", "aptema": "apótema", "crculos": "círculos", "paraleleppedo": "paralelepípedo", "cilndrico": "cilíndrico", "presso": "pressão", "distribuica": "distribuição", "salrios": "salários", "mdicos": "médicos", "lgica": "lógica", "disponveis": "disponíveis", "gesto": "gestão", "acadmica": "acadêmica", "obrigatrio": "obrigatório", "usurio": "usuário", "geomtricos": "geométricos", "competncia": "competência", "fbrica": "fábrica", "exerccios": "exercícios", "projtil": "projétil", "potncia": "potência", "numero": "número", "traras": "traíras", "carto": "cartão", "operrios": "operários", "dirias": "diárias", "idnticos": "idênticos", "nngulos": "\nângulos", "hexgono": "hexágono", "area": "área", "laboratrio": "laboratório", "comisso": "comissão", "invlido": "inválido", "repblica": "república", "histrico": "histórico", "atrs": "atrás", "matemticas": "matemáticas", "conexo": "conexão", "mtodo": "método", "disponvel": "disponível", "prxima": "próxima", "competncias": "competências", "sade": "saúde", "numrica": "numérica", "combustvel": "combustível", "distncias": "distâncias", "porm": "porém", "lanado": "lançado", "potncias": "potências", "centmetro": "centímetro", "cartes": "cartões", "clculo": "cálculo", "necessrios": "necessários", "televiso": "televisão", "dlar": "dólar", "mquinas": "máquinas", "acrscimo": "acréscimo", "necessria": "necessária", "fenmeno": "fenômeno", "numeros": "números", "pssaros": "pássaros", "tera": "terça", "horrio": "horário", "trapzios": "trapézios", "edifcio": "edifício", "vertice": "vértice", "lmpada": "lâmpada", "determinaco": "determinação", "satlite": "satélite", "lanar": "lançar", "crianas": "crianças", "mdico": "médico", "srie": "série", "concorrncia": "concorrência", "pblica": "pública", "formulrio": "formulário", "visvel": "visível", "rpida": "rápida", "histria": "história", "amrica": "américa", "independncia": "independência", "contempornea": "contemporânea", "calendrio": "calendário", "inteligncia": "inteligência", "introdutrio": "introdutório", "vlida": "válida", "prximos": "próximos", "anlise": "análise", "importncia": "importância", "diferenas": "diferenças", "consequncias": "consequências", "bsica": "básica", "palets": "paletós", "trajetria": "trajetória", "unitrio": "unitário", "vrias": "várias", "diviso": "divisão", "fssil": "fóssil", "fenmenos": "fenômenos", "vrus": "vírus", "csio": "césio", "bacterias": "bactérias", "astronmicas": "astronômicas", "alcanar": "alcançar", "mquina": "máquina", "variveis": "variáveis", "quilmetros": "quilômetros", "dispe": "dispõe", "eltrica": "elétrica", "eficincia": "eficiência", "tero": "terço", "aniversrio": "aniversário", "fracionria": "fracionária", "prejuzo": "prejuízo", "garrafo": "garrafão", "braslia": "brasília", "superficie": "superfície", "retngulos": "retângulos", "painis": "painéis", "lquido": "líquido", "cabea": "cabeça", "adereo": "adereço", "cbicos": "cúbicos", "frequncia": "frequência", "farmcia": "farmácia", "idnticas": "idênticas", "dimetros": "diâmetros", "esfrico": "esférico", "esfricos": "esféricos", "especfico": "específico", "vrios": "vários", "clculos": "cálculos", "pitgoras": "pitágoras", "prdio": "prédio", "peridica": "periódica", "dgitos": "dígitos", "sequncias": "sequências", "lils": "lilás", "devero": "deverão", "famlia": "família", "aleatria": "aleatória", "hotis": "hotéis", "mdias": "médias", "talhes": "talhões", "matrcula": "matrícula", "fuso": "fusão", "rudos": "ruídos", "compresso": "compressão", "lees": "leões", "automtico": "automático", "mltipla": "múltipla", "pedaggico": "pedagógico", "invisvel": "invisível", "gentica": "genética", "imprio": "império", "expanso": "expansão", "indstria": "indústria", "coeso": "coesão", "coerncia": "coerência", "prximo": "próximo", "partcula": "partícula", "cinematogrfico": "cinematográfico", "estratgico": "estratégico", "atravs": "através", "avanado": "avançado", "avanada": "avançada", "mltiplas": "múltiplas", "secundria": "secundária", "paramtrica": "paramétrica", "acadmico": "acadêmico", "snior": "sênior", "extrado": "extraído", "mdulo": "módulo", "comentrios": "comentários", "intextraveis": "intextraíveis", "qumicos": "químicos", "pargrafos": "parágrafos", "hbrido": "híbrido", "fsicas": "físicas", "concludo": "concluído", "reviso": "revisão", "comentrio": "comentário", "vnculos": "vínculos", "expresses": "expressões", "comear": "começar", "pargrafo": "parágrafo", "territrio": "território", "tcnica": "técnica", "petrleo": "petróleo", "comea": "começa", "estratgicas": "estratégicas", "equilbrio": "equilíbrio", "princpios": "princípios", "violncia": "violência", "gnero": "gênero", "indivduo": "indivíduo", "sculo": "século", "usurios": "usuários", "botes": "botões", "veculos": "veículos", "retilneo": "retilíneo", "preos": "preços", "algbrica": "algébrica", "construdas": "construídas", "caracterstica": "característica", "mtodos": "métodos", "arquelogos": "arqueólogos", "espcies": "espécies", "contradomnio": "contradomínio", "logstica": "logística", "doena": "doença", "prpria": "própria", "ssmico": "sísmico", "prmio": "prêmio", "critrio": "critério", "caminhes": "caminhões", "necessrias": "necessárias", "tcnicos": "técnicos", "lanou": "lançou", "trmino": "término", "smbolo": "símbolo", "clnica": "clínica", "papis": "papéis", "papeles": "papelões", "proprietrio": "proprietário", "dcimo": "décimo", "eletrnico": "eletrônico", "reunio": "reunião", "belm": "belém", "permetros": "perímetros", "permetro": "perímetro", "desprezveis": "desprezíveis", "geomtricas": "geométricas", "unio": "união", "proprietria": "proprietária", "cntrico": "cêntrico", "circunferncias": "circunferências", "semicircunferncia": "semicircunferência", "calada": "calçada", "empresrio": "empresário", "veculo": "veículo", "oblquo": "oblíquo", "obliquo": "oblíquo", "milmetros": "milímetros", "geomtrico": "geométrico", "cnico": "cônico", "vazo": "vazão", "publicitrios": "publicitários", "esfricas": "esféricas", "arteso": "artesão", "podero": "poderão", "cpsula": "cápsula", "inmeras": "inúmeras", "eratstenes": "eratóstenes", "basto": "bastão", "grfica": "gráfica", "esboo": "esboço", "mars": "marés", "sistlica": "sistólica", "diastlica": "diastólica", "combinatria": "combinatória", "calado": "calçado", "tnis": "tênis", "helosa": "heloísa", "alfabtica": "alfabética", "secretrio": "secretário", "cirurgies": "cirurgiões", "planto": "plantão", "clnicos": "clínicos", "aleatrios": "aleatórios", "aleatrio": "aleatório", "lanamentos": "lançamentos", "eqidistante": "eqüidistante", "distribudos": "distribuídos", "emisso": "emissão", "portugus": "português", "estatsticos": "estatísticos", "indgenas": "indígenas", "visveis": "visíveis", "analtica": "analítica", "dinmico": "dinâmico", "excludas": "excluídas", "crtico": "crítico", "recm": "recém", "forado": "forçado", "espaamento": "espaçamento", "legvel": "legível", "somatria": "somatória", "fcil": "fácil", "difcil": "difícil", "itlico": "itálico", "transferncia": "transferência", "persistncia": "persistência", "raciocnio": "raciocínio", "filtrvel": "filtrável", "automticos": "automáticos", "obrigatrios": "obrigatórios", "sada": "saída", "submisso": "submissão", "mtricas": "métricas", "numricos": "numéricos", "cinemtica": "cinemática", "dinmica": "dinâmica", "esttica": "estática", "hidrosttica": "hidrostática", "termodinmica": "termodinâmica", "ondulatria": "ondulatória", "eletrosttica": "eletrostática", "eletrodinmica": "eletrodinâmica", "atmicos": "atômicos", "inorgnicas": "inorgânicas", "termoqumica": "termoquímica", "cintica": "cinética", "qumico": "químico", "eletroqumica": "eletroquímica", "orgnica": "orgânica", "orgnicas": "orgânicas", "polmeros": "polímeros", "energtico": "energético", "botnica": "botânica", "clssico": "clássico", "helenstico": "helenístico", "brbaros": "bárbaros", "carolngio": "carolíngio", "ascenso": "ascensão", "napolenico": "napoleônico", "martima": "marítima", "ibrica": "ibérica", "democrtica": "democrática", "geopoltica": "geopolítica", "agrria": "agrária", "socrticos": "socráticos", "scrates": "sócrates", "plato": "platão", "aristteles": "aristóteles", "helenstica": "helenística", "patrstica": "patrística", "escolstica": "escolástica", "poltica": "política", "histrica": "histórica", "patrimnio": "patrimônio", "lingustica": "linguística", "gneros": "gêneros", "semntica": "semântica", "estratgias": "estratégias", "viso": "visão", "sbado": "sábado", "mscara": "máscara", "pedaggica": "pedagógica", "indcio": "indício", "antivrus": "antivírus", "annima": "anônima", "prximas": "próximas", "tolerncia": "tolerância", "molculas": "moléculas", "mantm": "mantém", "simblicas": "simbólicas", "molcula": "molécula", "cifro": "cifrão", "tcnicas": "técnicas", "carbnicas": "carbônicas", "extrada": "extraída", "terico": "teórico", "sdio": "sódio", "bibliogrfica": "bibliográfica", "fora": "força", "ttulo": "título", "introdutrios": "introdutórios", "contedos": "conteúdos", "inevitvel": "inevitável", "scrollvel": "scrollável", "gramtica": "gramática", "vocabulrio": "vocabulário", "somatrio": "somatório", "especfica": "específica", "contnuo": "contínuo", "concludas": "concluídas", "amaznia": "amazônia", "avano": "avanço", "exploratrias": "exploratórias", "relevncia": "relevância", "polticas": "políticas", "pblicas": "públicas", "involuntria": "involuntária", "sustentvel": "sustentável", "responsvel": "responsável", "doenas": "doenças", "segurana": "segurança", "hdrica": "hídrica", "cidados": "cidadãos", "trnsito": "trânsito", "incluso": "inclusão", "feminicdio": "feminicídio", "sentena": "sentença", "alcanado": "alcançado", "oramento": "orçamento", "contribudo": "contribuído", "telefnica": "telefônica", "bsicas": "básicas", "lanada": "lançada", "parbolas": "parábolas", "bilogos": "biólogos", "traada": "traçada", "fracionrios": "fracionários", "pontncias": "potências", "impossvel": "impossível", "fsseis": "fósseis", "rpido": "rápido", "matria": "matéria", "domnio": "domínio", "denncias": "denúncias", "dcada": "década", "aqutica": "aquática", "experincias": "experiências", "astrnomo": "astrônomo", "influncia": "influência", "existncia": "existência", "notcia": "notícia", "excluda": "excluída", "logartmico": "logarítmico", "fotogrfica": "fotográfica", "cmera": "câmera", "ssmica": "sísmica", "sismgrafos": "sismógrafos", "impe": "impõe", "prprio": "próprio", "resistncia": "resistência", "mxico": "méxico", "iguau": "iguaçu", "sangunea": "sanguínea", "fgado": "fígado", "hiprbole": "hipérbole", "automvel": "automóvel", "cdula": "cédula", "prope": "propõe", "automveis": "automóveis", "faam": "façam", "previso": "previsão", "duraro": "durarão", "perecveis": "perecíveis", "irredutvel": "irredutível", "cala": "calça", "municpio": "município", "carncia": "carência", "rogrio": "rogério", "sandlia": "sandália", "renovvel": "renovável", "residncia": "residência", "infogrfico": "infográfico", "dirio": "diário", "reciclvel": "reciclável", "reciclveis": "recicláveis", "mudanas": "mudanças", "climticas": "climáticas", "inequvoco": "inequívoco", "cientficos": "científicos", "sries": "séries", "concluso": "conclusão", "diminuiro": "diminuirão", "aumentaro": "aumentarão", "feijo": "feijão", "aritimtica": "aritmética", "evidncia": "evidência", "captulo": "capítulo", "erccios": "ercícios", "trigsimo": "trigésimo", "marco": "março", "aritmticos": "aritméticos", "imobilirio": "imobiliário", "homognea": "homogênea", "experincia": "experiência", "presena": "presença", "alcanada": "alcançada", "autossemelhana": "autossemelhança", "pases": "países", "construdo": "construído", "helicptero": "helicóptero", "exrcito": "exército", "praas": "praças", "pblicos": "públicos", "metlicas": "metálicas", "deciso": "decisão", "equingulo": "equiângulo", "formaro": "formarão", "decgono": "decágono", "icnica": "icônica", "semicircunferncias": "semicircunferências", "artstica": "artística", "trmicas": "térmicas", "ficaro": "ficarão", "centrfuga": "centrífuga", "trmica": "térmica", "arquitetnico": "arquitetônico", "compe": "compõe", "prprios": "próprios", "retificssemos": "retificássemos", "converso": "conversão", "herana": "herança", "irmos": "irmãos", "cilndricos": "cilíndricos", "concntricas": "concêntricas", "pentgonos": "pentágonos", "unitria": "unitária", "pirmides": "pirâmides", "equilteros": "equiláteros", "metalrgica": "metalúrgica", "chapu": "chapéu", "chapus": "chapéus", "traa": "traça", "desrticas": "desérticas", "subterrneas": "subterrâneas", "gros": "grãos", "semicrculo": "semicírculo", "reservatrios": "reservatórios", "retorretngulo": "retorretângulo", "cilndricas": "cilíndricas", "lquidos": "líquidos", "tenso": "tensão", "prtico": "prático", "fictcio": "fictício", "bactria": "bactéria", "cbico": "cúbico", "matemticos": "matemáticos", "geogrficas": "geográficas", "macias": "maciças", "macia": "maciça", "sobreps": "sobrepôs", "cpsulas": "cápsulas", "hemisfricas": "hemisféricas", "espaos": "espaços", "prticas": "práticas", "matemtico": "matemático", "babilnios": "babilônios", "egpcios": "egípcios", "construda": "construída", "corrimo": "corrimão", "atmosfrico": "atmosférico", "itlia": "itália", "oznio": "ozônio", "turstica": "turística", "transmisso": "transmissão", "solstcio": "solstício", "vero": "verão", "construmos": "construímos", "sentenas": "sentenças", "cngruo": "côngruo", "cngruos": "côngruos", "trigonomtrica": "trigonométrica", "foras": "forças", "disfarada": "disfarçada", "artrias": "artérias", "ventrculos": "ventrículos", "cidado": "cidadão", "prncipe": "príncipe", "esboada": "esboçada", "perodos": "períodos", "pulmes": "pulmões", "levaramos": "levaríamos", "lanamos": "lançamos", "divises": "divisões", "equvocos": "equívocos", "cmbios": "câmbios", "intermedirio": "intermediário", "famlias": "famílias", "trfego": "tráfego", "props": "propôs", "politcnica": "politécnica", "automobilstico": "automobilístico", "polcia": "polícia", "metlico": "metálico", "msica": "música", "dicionrio": "dicionário", "itinerrio": "itinerário", "cadaros": "cadarços", "voluntrio": "voluntário", "bsicos": "básicos", "funcionrio": "funcionário", "clssica": "clássica", "preciso": "precisão", "mrcia": "márcia", "mltiplo": "múltiplo", "distribudas": "distribuídas", "meteorolgico": "meteorológico", "cirurgio": "cirurgião", "urinrio": "urinário", "criana": "criança", "salo": "salão", "contrrio": "contrário", "hbito": "hábito", "bibliotecria": "bibliotecária", "emprstimo": "empréstimo", "desperdiada": "desperdiçada", "desperdcio": "desperdício", "poupana": "poupança", "atmosfrica": "atmosférica", "concessionria": "concessionária", "relatrio": "relatório", "talho": "talhão", "quadrticos": "quadráticos", "vnus": "vênus", "padres": "padrões", "sesso": "sessão"};
    