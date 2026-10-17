import React from 'react';
import {renderToString} from 'react-dom/server';
import {App} from './Experience.jsx';
import {getDictionary} from './i18n.jsx';
import * as editorial from './editorial.js';
import * as doors from './door-content.js';
import {pageMeta} from './seo.js';
function translate(value,t){if(typeof value==='string')return t(value);if(Array.isArray(value))return value.map(v=>translate(v,t));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,translate(v,t)]));return value}
export async function render(route,lang){const dictionary=await getDictionary(lang);const t=text=>dictionary[text]??text;const content=translate({...editorial,...doors},t);return {html:renderToString(<App initialRoute={route} initialLanguage={lang} initialDictionary={dictionary}/>),meta:pageMeta(route,lang,t,content)}}
