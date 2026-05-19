// ==============================================
// CSV/TXT PARSER - Importação de Flashcards
// ==============================================

function detectDelimiter(text) {
    const first = text.split('\n')[0] || '';
    const counts = { ';': 0, ',': 0, '\t': 0 };
    for (const ch of first) { if (counts[ch] !== undefined) counts[ch]++; }
    let best = ';', max = 0;
    for (const [k, v] of Object.entries(counts)) { if (v > max) { max = v; best = k; } }
    return best;
}

function parseCSVText(text, delimiter) {
    text = text.replace(/^\uFEFF/, ''); // Remove BOM
    const rows = [];
    let current = [], field = '', inQuote = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i], next = text[i + 1];
        if (inQuote) {
            if (ch === '"' && next === '"') { field += '"'; i++; }
            else if (ch === '"') { inQuote = false; }
            else { field += ch; }
        } else {
            if (ch === '"') { inQuote = true; }
            else if (ch === delimiter) { current.push(field); field = ''; }
            else if (ch === '\r' && next === '\n') { current.push(field); field = ''; rows.push(current); current = []; i++; }
            else if (ch === '\n') { current.push(field); field = ''; rows.push(current); current = []; }
            else { field += ch; }
        }
    }
    if (field || current.length) { current.push(field); rows.push(current); }
    return rows.filter(r => r.some(c => c.trim()));
}

function buildCardsFromCSV(rows, hasHeader, mapping) {
    const dataRows = hasHeader ? rows.slice(1) : rows;
    const cards = [];
    dataRows.forEach(row => {
        const get = (key) => {
            const idx = mapping[key];
            return (idx !== undefined && idx >= 0 && idx < row.length) ? row[idx].trim() : '';
        };
        const front = get('front');
        if (!front) return;
        const back = get('back');
        const tagsRaw = get('tags');
        const deck = get('deck') || 'Importado CSV';
        const tags = tagsRaw ? tagsRaw.split(/[\s,;]+/).filter(t => t) : [];
        const isCloze = front.includes('{{c');
        cards.push({
            front, back, tags, deckId: deck,
            tipo: isCloze ? 'cloze' : 'basico',
            extra: ''
        });
    });
    return cards;
}
