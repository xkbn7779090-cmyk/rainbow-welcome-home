import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {codes} from '../src/routing.js';
import {door,meetingRecords,connections,sourceReviews} from '../src/door-content.js';
import {isPublishedFuture} from '../src/meeting-policy.js';
const output=new URL('../dist/client/',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,output),'utf8');
test('all six languages serve a complete first screen before JavaScript runs',()=>{
 for(const lang of codes){const dictionary=lang==='ru'?{}:JSON.parse(fs.readFileSync(new URL(`../src/locales/${lang}.json`,import.meta.url),'utf8'));const html=read(`${lang}/index.html`);assert.ok(html.includes(dictionary[door.definition]||door.definition),lang);assert.ok(html.includes(`lang="${lang}"`));for(const route of ['start','first-time','gatherings'])assert.ok(html.includes(`href="/${lang}/${route}/"`),`${lang}/${route}`);assert.ok(html.includes('welcome-home-2005.jpg'));assert.ok(html.includes('og:image'));}
});
test('all generated pages have crawlable local links, one heading and unique canonical metadata',()=>{
 const files=fs.readdirSync(output,{recursive:true}).filter(p=>p.endsWith('.html')&&p!=='404.html');assert.ok(files.length>=120);
 for(const file of files){const html=read(file);assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,file);assert.equal((html.match(/rel="canonical"/g)||[]).length,1,file);assert.equal((html.match(/name="description"/g)||[]).length,1,file);assert.ok(html.includes('hreflang="x-default"'),file);assert.ok(html.includes('name="twitter:card" content="summary_large_image"'),file);assert.doesNotMatch(html,/<a[^>]+href="#(?:home|start|article\/|library|gatherings|sources|questions)/,file);
  for(const match of html.matchAll(/<a\s[^>]*href="(\/[^"]*)"/g)){const pathname=match[1].split('#')[0].split('?')[0];const target=new URL('.'+pathname+(pathname.endsWith('/')?'index.html':''),output);assert.ok(fs.existsSync(target),`${file}: missing ${pathname}`);}
 }
});
test('article and language metadata are present in static HTML, with a valid social image',()=>{
 const ru=read('ru/article/kitchen/index.html'),en=read('en/article/kitchen/index.html');assert.ok(ru.includes('У общего котла'));assert.ok(en.includes('Around the shared cooking pot'));assert.ok(ru.includes('/en/article/kitchen/'));assert.ok(ru.includes('Почитать по теме'));const image=fs.readFileSync(new URL('assets/social-card.jpg',output));assert.equal(image[0],255);assert.equal(image[1],216);const xml=read('sitemap.xml');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(new Set(urls).size,urls.length);assert.ok(urls.length>=100);assert.ok(read('robots.txt').includes('sitemap.xml'));
});
test('meeting dates are distinguished from source checks and no past invitation is marked current',()=>{
 for(const record of meetingRecords){assert.ok(record.start<=record.end);assert.ok(record.checkedAt);assert.ok(record.end<record.checkedAt);assert.equal(record.status,'past-announcement');assert.equal(new URL(record.url).protocol,'https:');assert.ok(record.region&&record.type&&record.note);assert.ok(!Object.hasOwn(record,'coordinates'));}
 for(const record of connections)assert.equal(record.checkedAt,'2026-10-17');assert.equal(Object.keys(sourceReviews).filter(id=>id!=='welcomehome').length,12);
});
test('future listings require a primary invitation and permission, not a calendar mention',()=>{
 const record={start:'2027-01-01',end:'2027-01-02',checkedAt:'2026-10-17',status:'published',url:'https://example.test/invitation'};
 assert.equal(isPublishedFuture(record,'2026-10-17'),false);
 assert.equal(isPublishedFuture({...record,primaryInvitation:true},'2026-10-17'),false);
 assert.equal(isPublishedFuture({...record,primaryInvitation:true,publicationPermission:true},'2026-10-17'),true);
 assert.equal(isPublishedFuture({...record,primaryInvitation:true,publicationPermission:true},'2027-02-01'),false);
});
