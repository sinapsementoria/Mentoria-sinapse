
const fs = require('fs');
const html = fs.readFileSync('src/pages/vestibulares.html', 'utf8');

// evaluate the JS
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
const scriptSrc = html.substring(scriptStart + 8, scriptEnd);

/* Mock DOM */
const document = {
    getElementById: function(id) {
        return {
            id: id,
            innerHTML: '',
            textContent: '',
            className: '',
            href: '',
            src: '',
            classList: { add: () => {}, remove: () => {} }
        };
    },
    querySelector: function(sel) {
        return { scrollTo: () => {} };
    }
};

try {
    eval(scriptSrc);
    // test getMatrizHTML 
    if (typeof getMatrizHTML === 'function') {
        console.log('Function length:', getMatrizHTML().length);
    } else {
        console.log('No function getMatrizHTML');
    }
} catch(e) {
    console.error('EVAL ERROR', e);
}

