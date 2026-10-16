import React,{createContext,useCallback,useContext,useMemo,useRef,useState,useEffect} from 'react';
import {Globe} from '@phosphor-icons/react';
import * as editorial from './editorial';
import {resources,sourceLinks,glossary} from './materials';
export const languages=[['ru','Русский'],['en','English'],['nl','Nederlands'],['de','Deutsch'],['fr','Français'],['es','Español']];
const loaders={en:()=>import('./locales/en.json'),nl:()=>import('./locales/nl.json'),de:()=>import('./locales/de.json'),fr:()=>import('./locales/fr.json'),es:()=>import('./locales/es.json')};
const base=Object.fromEntries(Object.entries({...editorial,resources,sourceLinks,glossary}).filter(([,v])=>typeof v!=='function'));
const Context=createContext(null);const cache={ru:{}};
function preferred(){let value=new URL(location.href).searchParams.get('lang');if(!value){try{value=localStorage.getItem('rainbow-language')}catch{}}return languages.some(([code])=>code===value)?value:'ru'}
function localize(value,t){if(typeof value==='string')return /[А-Яа-яЁё]/.test(value)?t(value):value;if(Array.isArray(value))return value.map(x=>localize(x,t));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v,t)]));return value}
export function LocaleProvider({children}){
 const [state,setState]=useState({lang:'ru',dictionary:{}});const [ready,setReady]=useState(()=>preferred()==='ru');const [pending,setPending]=useState(()=>preferred()==='ru'?null:preferred());const [error,setError]=useState(false);const sequence=useRef(0);
 const setLanguage=useCallback(async code=>{if(!languages.some(([id])=>id===code))return;const request=++sequence.current;setError(false);setPending(code);try{const dictionary=cache[code]||((await loaders[code]()).default);cache[code]=dictionary;if(request!==sequence.current)return;setState({lang:code,dictionary});setReady(true);const url=new URL(location.href);if(code==='ru')url.searchParams.delete('lang');else url.searchParams.set('lang',code);history.replaceState(null,'',url);try{localStorage.setItem('rainbow-language',code)}catch{}document.documentElement.lang=code;setPending(null)}catch{if(request===sequence.current){setPending(null);setReady(true);setError(true)}}},[]);
 useEffect(()=>{setLanguage(preferred())},[setLanguage]);
 const t=useCallback(text=>{if(typeof text!=='string')return text;return state.dictionary[text]??text},[state.dictionary]);
 const content=useMemo(()=>localize(base,t),[t]);
 return <Context.Provider value={{lang:state.lang,t,content,setLanguage,pending}}>{ready&&children}{pending&&<div className="locale-status" role="status">{({ru:'Загрузка языка…',en:'Loading language…',nl:'Taal laden…',de:'Sprache wird geladen…',fr:'Chargement de la langue…',es:'Cargando idioma…'})[pending]}</div>}{error&&<div className="locale-status" role="alert">{t('Не удалось загрузить язык. Попробуйте ещё раз.')}</div>}</Context.Provider>;
}
export const useI18n=()=>useContext(Context);
export function LanguagePicker(){const {lang,t,setLanguage,pending}=useI18n();return <label className="language-picker"><Globe size={18} aria-hidden="true"/><span className="sr-only">{t('Язык сайта')}</span><select aria-label={t('Язык сайта')} value={pending||lang} onChange={e=>setLanguage(e.target.value)}>{languages.map(([code,name])=><option value={code} key={code} lang={code}>{name}</option>)}</select></label>}
