import fs from 'fs';

const articlesFile = fs.readFileSync('src/data/articles.ts', 'utf8');
const docIds = [...articlesFile.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);

const fskusFile = fs.readFileSync('src/data/fskus.ts', 'utf8');
const skuSlugs = [...fskusFile.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);

const comparisonsFile = fs.readFileSync('src/data/comparisons.ts', 'utf8');
const comparisonSlugs = [...comparisonsFile.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);

const today = new Date().toISOString().split('T')[0];

// Category A & B Indexable Static Routes Only (Excludes Category C & D utility/experimental noindex routes)
const indexableStaticRoutes = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: 'wizard', priority: '0.9', changefreq: 'monthly' },
  { url: 'cost-calculator', priority: '0.9', changefreq: 'monthly' },
  { url: 'reserved-savings', priority: '0.9', changefreq: 'monthly' },
  { url: 'spark-estimator', priority: '0.8', changefreq: 'monthly' },
  { url: 'power-bi-capacity', priority: '0.8', changefreq: 'monthly' },
  { url: 'pricing', priority: '0.8', changefreq: 'monthly' },
  { url: 'fsku-comparisons', priority: '0.8', changefreq: 'monthly' },
  { url: 'docs', priority: '0.8', changefreq: 'weekly' },
  { url: 'about', priority: '0.7', changefreq: 'monthly' }
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add Category A static routes
for (const route of indexableStaticRoutes) {
  const path = route.url ? `/${route.url}` : '';
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
}

// Add Category A F-SKU routes
for (const slug of skuSlugs) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/fsku/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add Category A Comparison routes
for (const slug of comparisonSlugs) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/compare/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add Category A Documentation routes
for (const id of docIds) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/docs/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

sitemap += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log(`Sitemap generated successfully containing ${indexableStaticRoutes.length + skuSlugs.length + comparisonSlugs.length + docIds.length} INDEXABLE Category A URLs (filtered out utility/experimental noindex routes)!`);
