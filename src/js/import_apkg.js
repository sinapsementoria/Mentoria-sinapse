// ==============================================
// APKG PARSER - Importação de Anki (.apkg)
// Requer: JSZip + sql.js (CDN)
// ==============================================

async function parseAPKGFile(file) {
    const zip = await JSZip.loadAsync(file);

    // 1. Encontrar o banco SQLite
    let dbFile = zip.file('collection.anki21') || zip.file('collection.anki2');
    if (!dbFile) throw new Error('Arquivo .apkg inválido: banco de dados não encontrado.');
    const dbBuf = await dbFile.async('arraybuffer');

    // 2. Carregar sql.js
    const SQL = await initSqlJs({
        locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`
    });
    const db = new SQL.Database(new Uint8Array(dbBuf));

    // 3. Extrair modelos e decks
    const colRow = db.exec("SELECT models, decks FROM col")[0];
    const models = JSON.parse(colRow.values[0][0]);
    const decks = JSON.parse(colRow.values[0][1]);

    // 4. Extrair notas
    const notesResult = db.exec("SELECT id, mid, tags, flds FROM notes");
    const notes = (notesResult[0] ? notesResult[0].values : []).map(r => ({
        id: r[0], mid: String(r[1]), tags: r[2], flds: r[3]
    }));

    // 5. Extrair cards (para deck assignment)
    const cardsResult = db.exec("SELECT nid, did FROM cards");
    const cardDeckMap = {};
    if (cardsResult[0]) {
        cardsResult[0].values.forEach(r => {
            if (!cardDeckMap[r[0]]) cardDeckMap[r[0]] = String(r[1]);
        });
    }

    // 6. Media mapping
    let mediaMap = {};
    const mediaFile = zip.file('media');
    if (mediaFile) {
        try { mediaMap = JSON.parse(await mediaFile.async('string')); } catch(e) {}
    }

    // 7. Extrair arquivos de mídia como base64
    const mediaStore = {};
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
                else if (ext === 'svg') mime = 'image/svg+xml';
                else if (ext === 'mp3') mime = 'audio/mpeg';
                else if (ext === 'ogg') mime = 'audio/ogg';
                else if (ext === 'wav') mime = 'audio/wav';
                mediaStore[filename] = `data:${mime};base64,${data}`;
            } catch(e) { /* skip */ }
        }
    }

    // 8. Converter notas em cards
    const cards = [];
    notes.forEach(note => {
        const model = models[note.mid];
        if (!model) return;
        const fields = note.flds.split('\x1f');
        const fieldNames = (model.flds || []).map(f => f.name);
        const isCloze = model.type === 1;
        const did = cardDeckMap[note.id] || Object.keys(decks)[0];
        const deckObj = decks[did] || decks[Object.keys(decks)[0]];
        const deckName = deckObj ? deckObj.name : 'Importado Anki';
        const tags = note.tags ? note.tags.trim().split(/\s+/).filter(t => t) : [];

        let front = fields[0] || '';
        let back = fields[1] || '';

        // Substituir referências de mídia
        const replaceMdia = (html) => {
            html = html.replace(/<img\s+src=["']([^"']+)["'][^>]*>/gi, (m, src) => {
                return mediaStore[src] ? `<img src="${mediaStore[src]}" style="max-width:100%;border-radius:8px;margin:4px 0">` : `<span style="color:#94a3b8;font-size:12px">[imagem: ${src}]</span>`;
            });
            html = html.replace(/\[sound:([^\]]+)\]/gi, (m, src) => {
                return mediaStore[src] ? `<audio controls src="${mediaStore[src]}" style="width:100%;margin:4px 0"></audio>` : `<span style="color:#94a3b8;font-size:12px">[audio: ${src}]</span>`;
            });
            return html;
        };

        front = replaceMdia(front);
        back = replaceMdia(back);

        cards.push({
            front, back, tags,
            deckId: deckName.replace(/\u0000/g, ''),
            tipo: isCloze ? 'cloze' : 'basico',
            extra: fields[2] || ''
        });
    });

    db.close();

    // 9. Coletar nomes únicos de decks
    const deckNames = [...new Set(cards.map(c => c.deckId))];

    return { cards, deckNames, mediaStore, mediaMap };
}
