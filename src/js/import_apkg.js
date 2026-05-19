// ==============================================
// APKG/COLPKG PARSER - Importação do Anki
// Suporta: Anki 2.0 (.apkg) e Anki 2.1+ (.colpkg/.apkg)
// Requer: JSZip + sql.js (CDN)
// ==============================================

async function parseAPKGFile(file) {
    const fileSize = file.size;
    const isLargeFile = fileSize > 50 * 1024 * 1024; // > 50MB

    // 1. Extrair o ZIP
    const zip = await JSZip.loadAsync(file);

    // 2. Encontrar o banco SQLite (suporta múltiplos formatos)
    let dbFile = zip.file('collection.anki21') || zip.file('collection.anki2');
    
    // Para .colpkg do Anki 2.1.50+, pode estar em outro path
    if (!dbFile) {
        // Procurar em subpastas ou com outros nomes
        const allFiles = Object.keys(zip.files);
        const dbCandidates = allFiles.filter(f => 
            f.endsWith('.anki21') || f.endsWith('.anki2') || f === 'collection.anki21b'
        );
        if (dbCandidates.length > 0 && !dbCandidates[0].endsWith('.anki21b')) {
            dbFile = zip.file(dbCandidates[0]);
        }
    }

    if (!dbFile) {
        // Verificar se é formato protobuf (collection.anki21b) - não suportado
        if (zip.file('collection.anki21b')) {
            throw new Error(
                'Este arquivo usa o formato novo do Anki (protobuf). ' +
                'Por favor, exporte novamente no Anki Desktop usando: ' +
                'Arquivo → Exportar → Formato: "Anki Collection Package (Legacy .colpkg)"'
            );
        }
        throw new Error('Arquivo inválido: banco de dados do Anki não encontrado.');
    }

    // 3. Carregar sql.js
    const dbBuf = await dbFile.async('arraybuffer');
    const SQL = await initSqlJs({
        locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`
    });
    const db = new SQL.Database(new Uint8Array(dbBuf));

    // 4. Detectar versão do schema (Anki 2.0 vs 2.1+)
    let models = {};
    let decks = {};

    // Tentar schema novo (Anki 2.1.28+): tabelas separadas
    const hasNotetypes = tableExists(db, 'notetypes');
    const hasDecksTable = tableExists(db, 'decks');

    if (hasNotetypes) {
        // Schema novo: notetypes como tabela separada
        const ntResult = db.exec("SELECT id, name, config FROM notetypes");
        if (ntResult[0]) {
            ntResult[0].values.forEach(row => {
                const id = String(row[0]);
                const name = row[1];
                // Config é blob protobuf no schema novo, mas nome é suficiente
                // Vamos inferir campos a partir das notas
                models[id] = { name: name, flds: [], type: 0 };
            });
        }
    }

    if (hasDecksTable) {
        // Schema novo: decks como tabela separada
        const dResult = db.exec("SELECT id, name FROM decks");
        if (dResult[0]) {
            dResult[0].values.forEach(row => {
                decks[String(row[0])] = { name: row[1] || 'Default' };
            });
        }
    }

    // Fallback: tentar schema antigo (Anki 2.0)
    if (Object.keys(models).length === 0 || Object.keys(decks).length === 0) {
        try {
            const colResult = db.exec("SELECT models, decks FROM col");
            if (colResult[0] && colResult[0].values[0]) {
                if (Object.keys(models).length === 0 && colResult[0].values[0][0]) {
                    models = JSON.parse(colResult[0].values[0][0]);
                }
                if (Object.keys(decks).length === 0 && colResult[0].values[0][1]) {
                    decks = JSON.parse(colResult[0].values[0][1]);
                }
            }
        } catch(e) {
            console.warn('Schema col antigo não encontrado, usando schema novo:', e.message);
        }
    }

    // 5. Extrair TODAS as notas
    const notesResult = db.exec("SELECT id, mid, tags, flds FROM notes");
    const notes = [];
    if (notesResult[0]) {
        notesResult[0].values.forEach(row => {
            notes.push({
                id: row[0],
                mid: String(row[1]),
                tags: row[2] || '',
                flds: row[3] || ''
            });
        });
    }

    console.log(`[Import] ${notes.length} notas encontradas no banco.`);

    // 6. Mapear cards para decks (card → deck assignment)
    const cardDeckMap = {};
    try {
        const cardsResult = db.exec("SELECT nid, did FROM cards");
        if (cardsResult[0]) {
            cardsResult[0].values.forEach(row => {
                if (!cardDeckMap[row[0]]) cardDeckMap[row[0]] = String(row[1]);
            });
        }
    } catch(e) {
        console.warn('Tabela cards não encontrada:', e.message);
    }

    // 7. Inferir campos dos modelos a partir das notas (para schema novo)
    if (hasNotetypes) {
        // No schema novo, o config dos modelos é protobuf, não JSON
        // Vamos inferir o número de campos a partir dos dados reais
        notes.forEach(note => {
            const model = models[note.mid];
            if (model && model.flds.length === 0) {
                const fieldCount = note.flds.split('\x1f').length;
                model.flds = Array.from({length: fieldCount}, (_, i) => ({ name: `Campo ${i+1}`, ord: i }));
                // Detectar se é cloze verificando o conteúdo
                if (note.flds.includes('{{c1::') || note.flds.includes('{{c2::')) {
                    model.type = 1; // cloze
                }
            }
        });
    }

    // 8. Media - NÃO extrair para arquivos grandes (>50MB)
    let mediaStore = {};
    let mediaMap = {};
    const mediaFile = zip.file('media');
    
    if (mediaFile) {
        try { 
            mediaMap = JSON.parse(await mediaFile.async('string')); 
        } catch(e) {
            console.warn('Arquivo media não pode ser lido:', e.message);
        }
    }

    const mediaCount = Object.keys(mediaMap).length;
    
    if (!isLargeFile && mediaCount <= 200) {
        // Extrair mídias apenas para arquivos pequenos
        for (const [num, filename] of Object.entries(mediaMap)) {
            const mf = zip.file(num);
            if (mf) {
                try {
                    const data = await mf.async('base64');
                    const ext = filename.split('.').pop().toLowerCase();
                    let mime = 'application/octet-stream';
                    if (['jpg','jpeg'].includes(ext)) mime = 'image/jpeg';
                    else if (ext === 'png') mime = 'image/png';
                    else if (ext === 'gif') mime = 'image/gif';
                    else if (ext === 'webp') mime = 'image/webp';
                    else if (ext === 'mp3') mime = 'audio/mpeg';
                    else if (ext === 'ogg') mime = 'audio/ogg';
                    else if (ext === 'wav') mime = 'audio/wav';
                    mediaStore[filename] = `data:${mime};base64,${data}`;
                } catch(e) { /* skip */ }
            }
        }
    } else {
        console.log(`[Import] Mídias ignoradas: arquivo muito grande (${mediaCount} mídias, ${(fileSize/1024/1024).toFixed(0)}MB)`);
    }

    // 9. Converter notas em cards da plataforma
    const cards = [];
    const defaultDeckId = Object.keys(decks)[0] || '1';
    const defaultDeckName = decks[defaultDeckId] ? decks[defaultDeckId].name : 'Importado Anki';

    notes.forEach(note => {
        const model = models[note.mid];
        const fields = note.flds.split('\x1f');
        const isCloze = model ? model.type === 1 : (fields[0] && fields[0].includes('{{c'));
        
        const did = cardDeckMap[note.id] || defaultDeckId;
        const deckObj = decks[did];
        let deckName = deckObj ? deckObj.name : defaultDeckName;
        
        // Limpar nome do deck
        deckName = deckName.replace(/\u0000/g, '').trim();
        if (!deckName) deckName = 'Importado Anki';
        
        const tags = note.tags ? note.tags.trim().split(/\s+/).filter(t => t) : [];

        let front = fields[0] || '';
        let back = fields[1] || '';
        let extra = fields.slice(2).join('\n').trim();

        // Limpar HTML pesado mas preservar formatação básica
        front = cleanAnkiHTML(front);
        back = cleanAnkiHTML(back);

        // Substituir referências de mídia
        if (Object.keys(mediaStore).length > 0) {
            front = replaceMedia(front, mediaStore);
            back = replaceMedia(back, mediaStore);
        } else {
            // Remover referências de mídia que não foram importadas
            front = stripMediaRefs(front);
            back = stripMediaRefs(back);
        }

        if (!front && !back) return; // Pular notas vazias

        cards.push({
            front, back, tags,
            deckId: deckName,
            tipo: isCloze ? 'cloze' : 'basico',
            extra: extra ? cleanAnkiHTML(extra) : ''
        });
    });

    db.close();

    // 10. Coletar nomes únicos de decks
    const deckNames = [...new Set(cards.map(c => c.deckId))].sort();

    console.log(`[Import] ${cards.length} cartões processados em ${deckNames.length} baralhos.`);

    return { cards, deckNames, mediaStore, mediaMap, mediaSkipped: isLargeFile || mediaCount > 200, mediaCount };
}

// === UTILIDADES ===

function tableExists(db, tableName) {
    try {
        const result = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
        return result.length > 0 && result[0].values.length > 0;
    } catch(e) {
        return false;
    }
}

function cleanAnkiHTML(html) {
    if (!html) return '';
    // Remover divs e spans vazios
    html = html.replace(/<div><\/div>/gi, '');
    html = html.replace(/<span><\/span>/gi, '');
    // Converter <div> em quebra de linha
    html = html.replace(/<div>/gi, '<br>');
    html = html.replace(/<\/div>/gi, '');
    // Preservar formatação importante
    // Remover estilos inline pesados mas manter negrito/itálico
    html = html.replace(/\sstyle="[^"]*"/gi, '');
    html = html.replace(/\sclass="[^"]*"/gi, '');
    // Limpar espaços extras
    html = html.replace(/^\s*<br>\s*/i, '');
    return html.trim();
}

function replaceMedia(html, mediaStore) {
    // Imagens
    html = html.replace(/<img\s+src=["']([^"']+)["'][^>]*>/gi, (m, src) => {
        return mediaStore[src] 
            ? `<img src="${mediaStore[src]}" style="max-width:100%;border-radius:8px;margin:4px 0">` 
            : `<span style="color:#94a3b8;font-size:12px">[img: ${src}]</span>`;
    });
    // Áudios
    html = html.replace(/\[sound:([^\]]+)\]/gi, (m, src) => {
        return mediaStore[src] 
            ? `<audio controls src="${mediaStore[src]}" style="width:100%;margin:4px 0"></audio>` 
            : '';
    });
    return html;
}

function stripMediaRefs(html) {
    // Remover referências a mídia que não foi importada (sem quebrar o texto)
    html = html.replace(/<img\s+src=["'][^"']+["'][^>]*>/gi, '');
    html = html.replace(/\[sound:[^\]]+\]/gi, '');
    return html;
}
