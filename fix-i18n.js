const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

const dups = [
  /\"Power BI\": \".*?\",\n\s*\"Architecture\"/g,
  /\"Status\": \".*?\",\n\s*\"Pricing\"/g,
  /\"Get started\": \".*?\",\n\s*\"Data Engineering\"/g,
  /\"Enterprise\": \".*?\",\n\s*\"FinOps\"/g,
  /\"Power BI\": \".*?\",\n\s*\"Overall\"/g,
];

const repls = [
  '"Architecture"',
  '"Pricing"',
  '"Data Engineering"',
  '"FinOps"',
  '"Overall"'
];

for(let i=0; i<dups.length; i++) {
  code = code.replace(dups[i], repls[i]);
}

fs.writeFileSync('src/i18n.ts', code);
