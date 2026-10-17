import React, {useState} from 'react';
import {ArrowRight, ArrowCounterClockwise, Compass, CookingPot, HandHeart} from '@phosphor-icons/react';
import {useI18n} from './i18n';
import {SiteLink as A} from './SiteLink';
import {packingIds} from './packing-state';

export function Checklist({checks, setChecks, storageAvailable=true}) {
  const {t, content} = useI18n();
  const [reset, setReset] = useState(false);
  const groups = [
    {title:t('Ночлег и погода'), indices:[0,1,4]},
    {title:t('Вода, еда и забота'), indices:[2,3,5]},
    {title:t('Дорога и чистый след'), indices:[6,7]},
    {title:t('По желанию'), indices:[8,9,10]}
  ];
  const labels = [...content.checklist, t('Музыкальный инструмент, если хочется играть'), t('Рабочие перчатки для общих дел'), t('Блокнот для имён, мыслей и рисунков')];
  const essential = checks.filter(id => packingIds.slice(0,8).includes(id)).length;
  return <section className="packing packing-editorial" id="packing" aria-labelledby="packing-title">
    <div className="packing-intro"><span className="eyebrow">{t('Твой первый Gathering')}</span><h2 id="packing-title">{t('Собрать необходимое.')}<br/>{t('Оставить место новому.')}</h2>
      <p>{t('Начни с необходимого и дополни список под погоду, дорогу и свои потребности.')}</p>
      <div className="pack-count" role="status">{essential.toString().padStart(2,'0')} <small>/ 08 {t('необходимых вещей')}</small></div>
      <progress value={essential} max="8" aria-label={t('Готовность необходимого')}/>
      <p className="caption">{t(storageAvailable ? 'Отметки сохраняются в этом браузере, в том числе после перезагрузки. На всех языках список общий.' : 'Браузер не разрешает сохранение. Отметки останутся до закрытия страницы.')}</p>
      <button className="text-link packing-reset" onClick={()=>{setChecks([]);setReset(true)}} disabled={!checks.length}><ArrowCounterClockwise size={19}/>{t('Сбросить список')}</button>
      {reset && <p role="status" className="caption">{t('Список сброшен. Можно собираться заново.')}</p>}
      <A className="text-link" href="#first-time#chapter-0">{t('Подробнее о подготовке')}<ArrowRight size={20}/></A>
      <noscript><p>{t('Для отметок и сохранения списка включи JavaScript. Сам список доступен ниже.')}</p></noscript>
    </div>
    <div className="checklist">{groups.map((group,index)=><fieldset key={index}><legend>{group.title}<span>{t(index===3?'Дополнительно':'Необходимое')}</span></legend>{group.indices.map(i=><label key={packingIds[i]}><input type="checkbox" checked={checks.includes(packingIds[i])} onChange={()=>{setReset(false);setChecks(prev=>prev.includes(packingIds[i])?prev.filter(id=>id!==packingIds[i]):[...prev,packingIds[i]])}}/><span>{labels[i]}</span></label>)}</fieldset>)}</div>
  </section>;
}

export function EverydayLife(){const {t}=useI18n();return <section className="everyday wrap"><div className="everyday-heading"><span className="eyebrow">{t('Как здесь всё работает')}</span><h2>{t('Общий дом начинается с маленьких дел.')}</h2><A href="#walk" className="text-link">{t('Прогулка по Радуге')}<ArrowRight size={21}/></A></div><div className="everyday-notes">{[
  [CookingPot,'У общего котла','Спросить, что нужно кухне. Принести воду, нарезать овощи, помыть свою миску. Еда появляется благодаря чьим-то рукам.','article/kitchen'],
  [HandHeart,'Рядом, с уважением','Согласие, личные границы и право на тишину важны в общем кругу, у костра и возле своей палатки.','article/consent'],
  [Compass,'Оставить лесу лес','Узнать местные договорённости, беречь воду и забрать свой мусор. Уборка — часть встречи с первого дня.','article/cleanup']
].map(([Icon,title,text,route])=><article key={route}><Icon size={29} weight="light"/><div><h3><A href={'#'+route}>{t(title)}<ArrowRight size={19}/></A></h3><p>{t(text)}</p></div></article>)}</div></section>}

export function MeetingInvitation(){const {t}=useI18n();return <section className="meeting-invitation"><div className="wrap"><span className="eyebrow">{t('Где встретиться')}</span><h2>{t('Следующий шаг — живой разговор.')}</h2><div><p>{t('Выбери регион, познакомься с публичными сообществами и попроси свежее приглашение. Дата проверки ссылки — не подтверждение встречи.')}</p><A href="#gatherings#meeting-board" className="button">{t('Найти свой круг')}<ArrowRight size={21}/></A><A href="#gatherings" className="text-link">{t('Приглашения и даты')}<ArrowRight size={21}/></A></div></div></section>}

export function HomeClosing(){const {t}=useI18n();return <section className="home-closing wrap"><span className="eyebrow">WELCOME HOME</span><h2>{t('Здесь есть место и для тебя.')}</h2><p>{t('Не нужно знать все песни или сразу находить ответы. Можно начать с вопроса, небольшой помощи и знакомства с одним человеком. Мы учимся создавать общий дом вместе.')}</p><A href="#start" className="text-link">{t('Познакомиться ближе')}<ArrowRight size={22}/></A></section>}

export function HistoryTimeline({entries}){const {t}=useI18n();const [active,setActive]=useState(0);return <section className="history-explorer" aria-label={t('Ориентиры истории')}><div className="history-years">{entries.map(([year],i)=><button key={year} aria-pressed={active===i} aria-controls="history-detail" onClick={()=>setActive(i)}>{year}</button>)}</div><div id="history-detail" aria-live="polite"><p>{entries[active][1]}</p><A className="text-link" href={'#chapter-'+({'1972':0,'1983':2,'1998':3}[entries[active][0]]??5)}>{t('Читать эту главу')}<ArrowRight size={20}/></A></div><details><summary>{t('Все исторические ориентиры')}</summary>{entries.map(([year,text])=><p key={year}><strong>{year}</strong> — {text}</p>)}</details></section>}
