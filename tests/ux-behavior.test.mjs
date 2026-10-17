import test from 'node:test';
import assert from 'node:assert/strict';
import {readPacking,writePacking,packingKey} from '../src/packing-state.js';
import {filterDirectory} from '../src/directory.js';
import {connections,meetingRecords} from '../src/door-content.js';

test('packing survives storage round trips independently of language or item order',()=>{
 const values=new Map(); const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 assert.equal(writePacking(storage,['return','shelter','music']),true);
 assert.deepEqual(readPacking(storage),['return','shelter','music']);
 writePacking(storage,[]); assert.deepEqual(readPacking(storage),[]);
 values.set(packingKey,'["shelter","old-item","shelter",null,2]');assert.deepEqual(readPacking(storage),['shelter']);
 for(const malformed of ['no json','null','{}','"shelter"']){values.set(packingKey,malformed);assert.deepEqual(readPacking(storage),[])}
});
test('disabled or exhausted storage cannot break the packing interface',()=>{
 const blocked={getItem(){throw new Error('denied')},setItem(){throw new Error('quota')}};
 assert.deepEqual(readPacking(blocked),[]);assert.equal(writePacking(blocked,['water']),false);
});
test('region filters apply to resources and retain clearly labelled international starting points',()=>{
 const european=filterDirectory(connections,'europe').map(r=>r.id);
 assert.ok(european.includes('europe'));assert.ok(european.includes('forum'));assert.ok(!european.includes('telegram-na'));
 const american=filterDirectory(connections,'americas').map(r=>r.id);assert.ok(american.includes('telegram-na'));assert.ok(!american.includes('europe'));
 assert.ok(filterDirectory(connections,'other').every(r=>r.id!=='telegram-na'&&r.id!=='europe'));
});
test('directory search combines words, tolerates accents and keeps empty results honest',()=>{
 assert.equal(filterDirectory(meetingRecords,'europe','BELGIË')[0]?.id,'europe-2025');
 assert.equal(filterDirectory(connections,'americas','rainbow telegram')[0]?.id,'telegram-na');
 assert.deepEqual(filterDirectory(connections,'europe','rainbow telegram'),[]);
 assert.deepEqual(filterDirectory(connections,'all','no-such-community'),[]);
});
