const fs = require('fs');
const path = require('path');

const map = {
    'á': 'á', 'é': 'é', 'í': 'í', 'ó': 'ó', 'ú': 'ú',
    'â': 'â', 'ê': 'ê', 'î': 'î', 'ô': 'ô', 'û': 'û',
    'ã': 'ã', 'õ': 'õ', 'ç': 'ç',
    'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú',
    'Ã‚': 'Â', 'ÃŠ': 'Ê', 'Ã”': 'Ô',
    'Ã…': 'Å', 'Ãƒ': 'Ã', 'Ã•': 'Õ', 'Ã‡': 'Ç'
};

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !['aluno.html','index.html','login.html'].includes(f));

for (const f of files) {
    const p = path.join(dir, f);
    let txt = fs.readFileSync(p, 'utf8');
    
    // Perform replaces in length order or sequentially.
    // 'ç' = 'ç', 'ã' = 'ã'
    for (const [bad, good] of Object.entries(map)) {
        txt = txt.split(bad).join(good);
    }
    
    fs.writeFileSync(p, txt, 'utf8');
    console.log('Fixed', f);
}

