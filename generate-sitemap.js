import fs from 'fs';

const articlesFile = fs.readFileSync('src/data/articles.ts', 'utf8');
const referenceIds = new Set(["what-is-microsoft-fabric-capacity","what-is-a-capacity-unit","what-is-throttling","how-reserved-capacity-works","enterprise-sizing-guide","common-mistakes","f2-vs-f4","f8-vs-f16","f32-vs-f64","f64-vs-f128","f128-vs-f256","power-bi-premium-vs-fabric","f2-vs-f64"]);
const docIds = [...articlesFile.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]).filter(id => !referenceIds.has(id));

const fskusFile = fs.readFileSync('src/data/fskus.ts', 'utf8');
const skuSlugs = [...fskusFile.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);

const comparisonsFile = fs.readFileSync('src/data/comparisons.ts', 'utf8');
const comparisonSlugs = [...comparisonsFile.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);

// Do not invent modification dates on every build.

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
  { url: 'observability', priority: '0.9', changefreq: 'monthly' },
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
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
}

// Add Category A F-SKU routes
for (const slug of skuSlugs) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/fsku/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add Category A Comparison routes
for (const slug of comparisonSlugs) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/compare/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add Category A Documentation routes
for (const id of docIds) {
  sitemap += `  <url>
    <loc>https://fabric.dattasable.com/docs/${id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

// Fully translated homepages have stable, crawlable language URLs.
for (const language of ['es','ja','pt','zh','ru','fr','ko','de']) {
  sitemap += `  <url><loc>https://fabric.dattasable.com/${language}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
}
sitemap += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log(`Sitemap generated successfully containing ${indexableStaticRoutes.length + skuSlugs.length + comparisonSlugs.length + docIds.length + 8} INDEXABLE Category A URLs (filtered out utility/experimental noindex routes)!`);
