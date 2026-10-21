import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ARTICLES } from '../src/data/articles';
import { FABRIC_SKU_DATA } from '../src/data/fskus';
import { calculateCapacity } from '../src/lib/calculator';

test('all original documentation URLs remain available, with explicit reference disposition', () => {
 assert.equal(ARTICLES.length,25); assert.equal(new Set(ARTICLES.map(a=>a.id)).size,25);
 assert.equal(ARTICLES.filter(a=>a.referenceOnly).length,13);
 assert.equal(ARTICLES.filter(a=>!a.referenceOnly).length,12);
 for(const a of ARTICLES) assert.ok(a.content.includes(a.referenceOnly?'full worked guide':'Official references'));
});
test('Copilot eligibility and free-viewer licensing are separate',()=>{
 assert.equal(FABRIC_SKU_DATA.find(s=>s.slug==='f2')?.copilotSupport,true);
 assert.equal(FABRIC_SKU_DATA.find(s=>s.slug==='f2')?.powerBiFreeUsers,false);
 assert.equal(FABRIC_SKU_DATA.find(s=>s.slug==='f64')?.powerBiFreeUsers,true);
});
const input={regionId:'eastus',currencyCode:'USD',dataFactoryInput:{monthlyPipelines:0,avgActivities:0,dataVolumeGb:0},sparkComputeInput:{totalNodes:1,vCoresPerNode:2,dailyRuntimeHours:0},powerBiInput:{peakConcurrentUsers:1800,queryComplexityScale:5}};
test('buffered demand above the largest tier never wraps back to F2',()=>{
 const r=calculateCapacity(input);assert.equal(r.success,true);assert.equal(r.calculatedCuBaseline,1800);assert.equal(r.targetSkuRecommendation.safeSkuCu,2048);assert.ok(r.targetSkuRecommendation.safeSkuCu>=r.targetSkuRecommendation.costOptimizedSkuCu);assert.match(r.assumptions[0],/not measured probabilities/);
});
test('all public documentation has rendered text, canonical URLs, and correct indexing',()=>{
 const sitemap=fs.readFileSync('public/sitemap.xml','utf8');
 for(const a of ARTICLES){const html=fs.readFileSync('dist/docs/'+a.id+'/index.html','utf8');assert.match(html,/<h1/);assert.ok(html.includes(a.title.replace(/&/g,'&amp;')));assert.ok(html.includes('https://fabric.dattasable.com/docs/'+a.id));assert.doesNotMatch(html,/fabric-master\.vercel\.app|ratingCount|aggregateRating/);if(a.referenceOnly){assert.match(html,/noindex, follow/);assert.ok(!sitemap.includes('/docs/'+a.id+'</loc>'));}else assert.ok(sitemap.includes('/docs/'+a.id+'</loc>'));}
});
