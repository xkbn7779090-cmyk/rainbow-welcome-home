import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {articles,arrival,finding,about} from '../src/editorial.js';
import {resources,sourceLinks} from '../src/materials.js';
const root=new URL('../',import.meta.url);
const catalog=JSON.parse(fs.readFileSync(new URL('src/locales/catalog.ru.json',root),'utf8'));
for(const lang of ['en','nl','de','fr','es'])test(`${lang}: every published text has a complete static translation`,()=>{
 const dictionary=JSON.parse(fs.readFileSync(new URL(`src/locales/${lang}.json`,root),'utf8'));
 for(const original of catalog){assert.equal(typeof dictionary[original],'string',`Missing: ${original.slice(0,80)}`);assert.ok(dictionary[original].trim(),`Empty: ${original.slice(0,80)}`);assert.doesNotMatch(dictionary[original],/QZKEEP|ZXQ\d|[А-Яа-яЁё]/,`Untranslated or damaged segment: ${original.slice(0,80)}`)}
});
test('all nine long articles have substantial text and resolvable source references',()=>{
 assert.equal(articles.length,9);assert.equal(new Set(articles.map(d=>d.id)).size,articles.length);
 const sourceIds=new Set(resources.map(r=>r.id));
 for(const doc of articles){assert.ok(doc.sections.length>=5,doc.id);const words=doc.sections.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length;assert.ok(words>=400,`${doc.id} has only ${words} words`);const refs=doc.sourceIds||sourceLinks[doc.id];assert.ok(refs?.length,`No source for ${doc.id}`);for(const ref of refs)assert.ok(sourceIds.has(ref),`Broken source ${ref}`)}
 for(const doc of [arrival,finding,about])assert.ok(doc.sections.length>=5);
});
test('source directory distinguishes public links from supplied copies',()=>{
 assert.equal(resources.length,12);assert.equal(new Set(resources.map(r=>r.id)).size,12);
 for(const r of resources){assert.ok(r.author&&r.year&&r.description&&r.limit,r.id);if(r.url)assert.equal(new URL(r.url).protocol,'https:');}
 for(const id of ['guide','rising','consent'])assert.equal(resources.find(r=>r.id===id).url,null);
});
