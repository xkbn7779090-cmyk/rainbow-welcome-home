import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {archiveAdditions,archiveSelection,archiveTopics,filterArchive} from '../src/archive-content.js';
import {articles} from '../src/editorial.js';
import {isAppRoute,pagePath} from '../src/routing.js';

test('archive items lead to preserved articles and documented relative source paths',()=>{
 assert.equal(archiveSelection.length,17);
 assert.equal(new Set(archiveSelection.map(r=>r.id)).size,archiveSelection.length);
 for(const item of archiveSelection){assert.ok(articles.some(a=>a.id===item.article),item.id);assert.ok(archiveTopics[item.topic]);assert.match(item.path,/^[a-z0-9_./-]+\.html$/);assert.ok(!item.path.includes('..'));assert.ok(item.note);}
 assert.ok(isAppRoute('archive'));assert.equal(pagePath('fr','archive'),'\/fr/archive/');
});
test('archive filtering combines theme, year and case-insensitive words',()=>{
 assert.equal(filterArchive(archiveSelection,'all','').length,17);
 assert.equal(filterArchive(archiveSelection,'music','2000')[0].id,'montana');
 assert.equal(filterArchive(archiveSelection,'history','2000').length,0);
 assert.equal(filterArchive(archiveSelection,'all','PALU')[0].id,'songs-palu');
 assert.equal(filterArchive(archiveSelection,'all','unavailable-search').length,0);
});
test('all new archive chapters and interface strings have complete translations',()=>{
 const jsx=fs.readFileSync(new URL('../src/Archive.jsx',import.meta.url),'utf8');
 const strings=[...jsx.matchAll(/t\('([^']+)'\)/g)].map(m=>m[1]);
 const originals=[...strings,...Object.values(archiveTopics),...archiveSelection.map(r=>r.note),...Object.values(archiveAdditions).flat(2),'История и музыка','Письма, песни и история встреч','Дополнено: '];
 for(const lang of ['en','nl','de','fr','es']){const dict=JSON.parse(fs.readFileSync(new URL(`../src/locales/${lang}.json`,import.meta.url),'utf8'));for(const original of originals){assert.ok(dict[original]?.trim(),`${lang}: ${original}`);assert.doesNotMatch(dict[original],/[А-Яа-яЁё]/)}}
 for(const [id,chapters] of Object.entries(archiveAdditions)){const article=articles.find(a=>a.id===id);assert.equal(article.sections.length,11);assert.equal(article.updatedAt,'2026-11-13');for(const [title] of chapters)assert.ok(article.sections.some(s=>s.title===title))}
});
test('archive and expanded articles are available in prerendered HTML in all languages',()=>{
 for(const lang of ['ru','en','nl','de','fr','es']){const html=fs.readFileSync(new URL(`../dist/client/${lang}/archive/index.html`,import.meta.url),'utf8');assert.equal((html.match(/class="archive-record-year"/g)||[]).length,17);assert.ok(html.includes(`/${lang}/article/culture/`));assert.ok(html.includes('Palu'));assert.ok(!/<audio|<iframe/.test(html));if(lang!=='ru')assert.doesNotMatch(html.replace(/<option[^>]*>[\s\S]*?<\/option>/g,'').replace(/<noscript>[\s\S]*?<\/noscript>/g,''),/[А-Яа-яЁё]/);}
});
