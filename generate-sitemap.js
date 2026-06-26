const fs = require('fs');

const articlesFile = fs.readFileSync('src/data/articles.ts', 'utf8');
const ids = [...articlesFile.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fabric.dattasable.com/</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fabric.dattasable.com/wizard</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fabric.dattasable.com/pricing</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://fabric.dattasable.com/docs</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://fabric.dattasable.com/about</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

for (const id of ids) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/docs/${id}</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

sitemap += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated!');
