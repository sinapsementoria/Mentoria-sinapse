// database.js
// Pura lógica de Storage simulando o Backend

const DB_KEY = 'sinapse_storage';

function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        const initialData = {
            users: [{ id: 1, name: 'Lucas', tier: 'Elite' }],
            activity_types: ['estudo', 'revisão', 'lista de questões', 'simulado', 'prova', 'redação', 'monitoria', 'mentoria', 'outro'],
            activities: [],
            metrics_entries: [],
            exams: [],
            disciplines: ['Biologia', 'Física', 'Química', 'Matemática', 'História', 'Geografia', 'Linguagens'],
            holidays: [
                { date: '2026-01-01', title: 'Confraternização Universal', type: 'Feriado' },
                { date: '2026-02-16', title: 'Carnaval', type: 'Ponto Facultativo' },
                { date: '2026-02-17', title: 'Carnaval', type: 'Ponto Facultativo' },
                { date: '2026-02-18', title: 'Quarta-feira de Cinzas', type: 'Ponto Facultativo' },
                { date: '2026-04-03', title: 'Paixão de Cristo', type: 'Feriado' },
                { date: '2026-04-21', title: 'Tiradentes', type: 'Feriado' },
                { date: '2026-05-01', title: 'Dia do Trabalho', type: 'Feriado' },
                { date: '2026-06-04', title: 'Corpus Christi', type: 'Ponto Facultativo' },
                { date: '2026-09-07', title: 'Independência do Brasil', type: 'Feriado' },
                { date: '2026-10-12', title: 'Nossa Senhora Aparecida', type: 'Feriado' },
                { date: '2026-11-02', title: 'Finados', type: 'Feriado' },
                { date: '2026-11-15', title: 'Proclamação da República', type: 'Feriado' },
                { date: '2026-12-25', title: 'Natal', type: 'Feriado' }
            ]
        };
        localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    }
}

function getTable(name) {
    initDB();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    return db[name] || [];
}

function insertItem(tableName, item) {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    if (!db[tableName]) db[tableName] = [];
    
    item.id = item.id || generateUUID();
    item.created_at = item.created_at || new Date().toISOString();
    
    db[tableName].push(item);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return item;
}

function deleteItem(tableName, id) {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    if(!db[tableName]) return;
    db[tableName] = db[tableName].filter(record => record.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function updateItem(tableName, id, updates) {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    if(!db[tableName]) return;
    const idx = db[tableName].findIndex(record => record.id === id);
    if(idx > -1) {
        db[tableName][idx] = { ...db[tableName][idx], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
}

function setTable(tableName, data) {
    initDB();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    db[tableName] = data;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getDayOfWeekStr(dateStr) {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[dateObj.getDay()];
}

// Inicializar na carga do JS
initDB();

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

window.db = {
    get: getTable,
    set: setTable,
    insert: insertItem,
    update: updateItem,
    delete: deleteItem,
    getDayOfWeekStr,
    getAcademicSummary,
    uuid: generateUUID
};

function getAcademicSummary() {
    initDB();
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    const redacoes = db['redacoes'] || [];
    
    // 1. Dados Avulsos do Banco (sinapse_hits/misses)
    let realHits = parseInt(localStorage.getItem('sinapse_hits') || '0', 10);
    let realMisses = parseInt(localStorage.getItem('sinapse_misses') || '0', 10);
    let totalQuestions = realHits + realMisses;
    let totalHits = realHits;

    // Processamento analítico de Melhor/Pior Matéria originado da tabela metrics_entries registrada das sessões
    let subjectStats = {};
    
    // 2. Registros de Sessões de Desempenho (metrics_entries)
    const metrics = db['metrics_entries'] || [];
    metrics.forEach(m => {
        // ignora entradas fantasmas em banco real
        if (m.questions_total === 20 && m.correct_answers === 15 && totalQuestions === 0) return; 
        
        let qTotal = m.questions_total || 0;
        let cTotal = m.correct_answers || 0;
        
        totalQuestions += qTotal;
        totalHits += cTotal;
        
        if(!subjectStats[m.discipline]) {
            subjectStats[m.discipline] = { questions: 0, correct: 0 };
        }
        subjectStats[m.discipline].questions += qTotal;
        subjectStats[m.discipline].correct += cTotal;
    });

    // 3. Registros de Exames Oficiais (exams)
    const exams = db['exams'] || [];
    exams.forEach(ex => {
        if(ex.banca !== 'ENEM' && ex.banca !== 'SIMULADO') return;
        
        const processArea = (materia, notaVal) => {
            if (notaVal !== undefined && notaVal !== null && notaVal !== '') {
                const nota = parseInt(notaVal);
                if(isNaN(nota)) return;
                
                const qArea = 45; 
                totalQuestions += qArea;
                totalHits += nota;

                if (!subjectStats[materia]) subjectStats[materia] = { questions: 0, correct: 0 };
                subjectStats[materia].questions += qArea;
                subjectStats[materia].correct += nota;
            }
        };

        processArea('Linguagens', ex.notaLin);
        processArea('Humanas', ex.notaHum);
        processArea('Natureza', ex.notaNat);
        processArea('Matemática', ex.notaMat);
    });
    
    // 4. Conclusão de Metas (activities)
    const activities = db['activities'] || [];
    let metasTotal = activities.length;
    let metasConcluidas = activities.filter(a => a.status === 'concluida').length;
    let conclusaoPercent = metasTotal > 0 ? Math.round((metasConcluidas / metasTotal) * 100) : 0;
    
    let summary = {
        questoesFeitas: totalQuestions,
        acertosGlobal: 0,
        conclusaoMetas: conclusaoPercent,
        redacoesEntregues: redacoes.length, // Respeitando a base de dados
        flashcardsRevisados: parseInt(localStorage.getItem('sinapse_flash_metrics') || '0', 10), // Exato a plataforma
        melhorMateria: 'ND',
        piorMateria: 'ND',
        provasFeitas: exams.length,
        estimativaTRI: 0.0,
        xpTotal: 0,
        nivelXP: 1,
        rankGeral: 540,
        rankTurma: 40
    };

    if (totalQuestions > 0) {
        summary.acertosGlobal = Math.round((totalHits / totalQuestions) * 100);
    }
    
    // ----------- MOTOR DE GAMIFICAÇÃO & XP -----------
    // 10 XP por acerto, 3 XP por erro, 200 XP por redação
    let calculatedXP = (totalHits * 10) + ((totalQuestions - totalHits) * 3) + (redacoes.length * 200);
    summary.xpTotal = calculatedXP;
    
    // Nível de Experiência (Curva progressiva: Level 1 = 0 XP, Level 50 = ~25.000 XP)
    let calcLevel = Math.max(1, Math.floor(Math.sqrt(calculatedXP / 10)) + 1);
    summary.nivelXP = calcLevel;
    
    // Ranking Geral (Max 540 alunos elitizados. Se tem pouco XP -> 540. Top XP -> #1)
    let pseudoRankGeral = Math.max(1, 540 - Math.floor(calculatedXP / 80));
    summary.rankGeral = pseudoRankGeral;
    
    // Ranking de Turma (Max 40 alunos por turma VIP)
    let pseudoRankTurma = Math.max(1, 40 - Math.floor(calculatedXP / 800));
    summary.rankTurma = pseudoRankTurma;
    // -------------------------------------------------

    let bestSubject = 'ND';
    let highestAcc = -1;
    let worstSubject = 'ND';
    let lowestAcc = 101;

    Object.keys(subjectStats).forEach(disc => {
        let stats = subjectStats[disc];
        if (stats.questions > 0) {
            let acc = (stats.correct / stats.questions) * 100;
            if (acc > highestAcc) {
                highestAcc = acc;
                bestSubject = disc;
            }
            if (acc < lowestAcc) {
                lowestAcc = acc;
                worstSubject = disc;
            }
        }
    });

    if(bestSubject !== 'ND') summary.melhorMateria = bestSubject;
    if(worstSubject !== 'ND') summary.piorMateria = worstSubject;

    // Calculadora da Estimativa TRI Suprema
    if (summary.acertosGlobal > 0) {
        let acc = summary.acertosGlobal; // Porcentagem
        let notaBase = 300;
        
        // 1. Mapeamento Linear por Bandas (garante crescimento liso e sem saltos de 1%, contemplando decimos de %)
        const mapLinear = (val, in_min, in_max, out_min, out_max) => {
            return out_min + ((val - in_min) / (in_max - in_min)) * (out_max - out_min);
        };

        if (acc <= 20)      notaBase = mapLinear(acc, 0, 20, 300, 450);
        else if (acc <= 30) notaBase = mapLinear(acc, 20, 30, 451, 520);
        else if (acc <= 40) notaBase = mapLinear(acc, 30, 40, 521, 600);
        else if (acc <= 50) notaBase = mapLinear(acc, 40, 50, 601, 680);
        else if (acc <= 60) notaBase = mapLinear(acc, 50, 60, 681, 740);
        else if (acc <= 70) notaBase = mapLinear(acc, 60, 70, 741, 780);
        else if (acc <= 80) notaBase = mapLinear(acc, 70, 80, 781, 800);
        else if (acc <= 91) notaBase = mapLinear(acc, 80, 91, 801, 820);
        else if (acc <= 95) notaBase = mapLinear(acc, 91, 95, 821, 847.85); // Teto escalonado
        else notaBase = 847.85; // TETO MÁXIMO
        
        // 2. Fatores Complementares Inteligentes
        let bonusMalus = 0;
        
        // Fator A: Volume de Questões Respondidas (Conservadorismo em banco raso)
        if (totalQuestions < 30) bonusMalus -= 15;        // Pouquíssimas questões -> muito conservador
        else if (totalQuestions < 100) bonusMalus -= 5;   // Conservador
        else if (totalQuestions >= 300 && totalQuestions <= 600) bonusMalus += 2;   // Boa amostra
        else if (totalQuestions > 600) bonusMalus += 4;   // Banco sólido, alta confiabilidade
        
        // Fator B: Equilíbrio de Desempenho / Constância entre Disciplinas
        if (highestAcc !== -1 && lowestAcc !== 101) {
            let gap = highestAcc - lowestAcc;
            if (gap >= 40) bonusMalus -= 8;      // Altamente oscilante/desequilibrado
            else if (gap >= 25) bonusMalus -= 3; // Ligeira oscilação
            else if (gap <= 10 && totalQuestions > 100) bonusMalus += 3; // Desempenho uniforme impressionante
        }
        
        // Aplicação Final
        notaBase += bonusMalus;
        
        // Garantia inquebrável do Limite Superior
        notaBase = Math.min(notaBase, 847.85);

        // Se por causa do malus cair muito, não pode descer do limite base inferior
        notaBase = Math.max(notaBase, 300);
        
        // Arredonda a estimativa final respeitando as casas decimais elegantes
        summary.estimativaTRI = parseFloat(notaBase.toFixed(2));
    } else {
        summary.estimativaTRI = 0.0;
    }

    return summary;
}

// ============================================
// PURGE ACTIVITIES SCRIPT (EXECUTA UMA VEZ)
// ============================================
(function clearOldGoals() {
    try {
        let raw = localStorage.getItem('sinapse_storage');
        if (raw) {
            let dbData = JSON.parse(raw);
            if (!dbData._goals_purged_v1) {
                dbData.activities = []; // zera o kanban / metas diárias
                // removemos tambem as metricas vinculadas a metas para nao gerar bug
                dbData.metrics_entries = (dbData.metrics_entries || []).filter(m => !m.activity_id); 
                dbData._goals_purged_v1 = true;
                localStorage.setItem('sinapse_storage', JSON.stringify(dbData));
                console.log("Metas diárias antigas purgadas com sucesso do sistema.");
            }
            if (!dbData._flashcards_purged_v3) {
                dbData.flashcards = [];
                dbData.flashcard_decks = [];
                dbData.flashcard_reviews = []; // Histórico de estudos SRS Anki
                dbData._flashcards_purged_v3 = true;
                localStorage.setItem('sinapse_storage', JSON.stringify(dbData));
                console.log("Flashcards limpos para o novo schema SRS (Anki Clone v3).");
            }
        }
    } catch(e) {
        console.error(e);
    }
})();
