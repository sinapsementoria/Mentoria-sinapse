const fs = require(" fs\); const text = fs.readFileSync(\src/pages/vestibulares.html\, \utf-8\); const start = text.indexOf(\id: \\\FUVEST\\\\); console.log(text.substring(start, start + 500));
