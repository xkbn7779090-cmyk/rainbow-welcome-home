import fs from 'node:fs';
import {parse} from '@babel/parser';
import traverseModule from '@babel/traverse';
import * as editorial from '../src/editorial.js';
import * as materials from '../src/materials.js';
import * as doors from '../src/door-content.js';
const traverse=traverseModule.default||traverseModule;const strings=new Set();
function collect(v){if(typeof v==='string'&&/[А-Яа-яЁё]/.test(v))strings.add(v);else if(Array.isArray(v))v.forEach(collect);else if(v&&typeof v==='object')Object.values(v).forEach(collect)}
collect(editorial);collect(materials);collect(doors);
for(const file of ['src/Experience.jsx','src/Sources.jsx','src/i18n.jsx','src/Doors.jsx','src/Journey.jsx','src/seo.js']){const ast=parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['jsx']});traverse(ast,{StringLiteral(path){collect(path.node.value)},CallExpression(path){if(path.node.callee.name==='t'&&path.node.arguments[0]?.type==='StringLiteral')collect(path.node.arguments[0].value)}})}
fs.mkdirSync('src/locales',{recursive:true});fs.writeFileSync('src/locales/catalog.ru.json',JSON.stringify([...strings],null,2)+'\n');console.log(JSON.stringify({strings:strings.size,characters:[...strings].join('').length}));
