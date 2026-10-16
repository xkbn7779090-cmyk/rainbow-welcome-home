import { useI18n } from "./i18n";
import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react";
export function Sources({
  target
}) {
  const {
    t,
    content,
    lang
  } = useI18n();
  const {
    articles,
    arrival,
    finding,
    about,
    checklist,
    story,
    walkStops,
    sourceNote,
    resources,
    sourceLinks,
    glossary
  } = content;
  const [filter, setFilter] = useState(t("Все"));
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (target) requestAnimationFrame(() => document.getElementById(`source-${target}`)?.scrollIntoView({
      block: "start"
    }));
  }, [target]);
  const found = resources.filter(r => (filter === t("Все") || r.type === filter) && `${r.title} ${r.author} ${r.description} ${r.limit}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <><section className="article-masthead wrap"><span className="eyebrow">{t("Книги и архивы")}</span><h1>{t("Голоса, документы")}<br /><em>{t("и разные точки зрения.")}</em></h1><p className="dek">{t("Если тебе хочется узнать больше, здесь найдутся рассказы участников, старые приглашения, книги и исследования. Выбирай интересную тему и открывай разные голоса радужной истории.")}</p></section>
 <section className="source-intro wrap"><h2>{t("Любопытство ведёт")}<br />{t("к новым историям.")}</h2><div><p>{t("Один человек вспоминает свой первый круг, другой рассказывает, как строился лагерь, третий задаёт вопросы об общей жизни. Ты можешь читать их рядом, соглашаться, удивляться и продолжать разговор. У Радуги много голосов, и каждый открывает ещё одну сторону знакомства.")}</p><p>{t("Часть книг и документов можно открыть по ссылке, часть пока доступна только как библиографическая запись. Обращай внимание на дату и место: старый рассказ помогает понять историю, а текущие условия поездки лучше узнавать у людей той встречи, куда ты собираешься.")}</p></div></section>
 <section className="resources wrap"><label className="search-field"><MagnifyingGlass size={23} /><input aria-label={t("Поиск по источникам")} placeholder={t("Автор, тема или название")} value={query} onChange={e => setQuery(e.target.value)} /></label><div className="filters" aria-label={t("Виды источников")}>{[t("Все"), ...new Set(resources.map(r => r.type))].map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div><p className="caption" aria-live="polite">{t("Найдено источников: ")}{found.length}</p>{found.map(r => <article className="resource-entry" id={`source-${r.id}`} key={r.id}><div><span className="eyebrow">{r.type} · {r.language}</span><h2 lang={r.language === "Deutsch" ? "de" : r.language === "Español" ? "es" : "en"}>{r.title}</h2><p className="resource-author">{r.author}<br />{r.year}</p>{r.url ? <a className="text-link" href={r.url} target="_blank" rel="noreferrer">{t("Открыть источник ")}<ArrowUpRight size={20} /></a> : <span className="caption">{t("Библиографическая запись · открытая копия не найдена")}</span>}</div><div><span className="chapter-label">{t("Для чего читать")}</span><p>{r.description}</p><span className="chapter-label">{t("Что учитывать")}</span><p>{r.limit}</p><a className="text-link" href="#library">{t("Связанные темы в библиотеке ")}<ArrowRight size={20} /></a></div></article>)}{!found.length && <div className="empty"><h2>{t("Источников не найдено.")}</h2><p>{t("Попробуйте другое название или сбросьте фильтры.")}</p><button className="text-link" onClick={() => {
          setQuery("");
          setFilter(t("Все"));
        }}>{t("Показать все источники ")}<ArrowRight size={20} /></button></div>}</section>
 <section className="glossary wrap"><span className="eyebrow">{t("Слова, которые встречаются в текстах")}</span><h2>{t("Небольшой словарь.")}<br /><em>{t("Большой контекст.")}</em></h2><p className="dek">{t("Услышал незнакомое слово? Загляни сюда, а на встрече спроси, как это устроено именно здесь. Тебе не нужно учить всё заранее: слова становятся понятнее вместе с людьми и общими делами.")}</p><dl>{glossary.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}</dl></section><section className="reading-path wrap"><span className="eyebrow">{t("Вернуться к рассказу")}</span><h2>{t("От источника —")}<br />{t("к живой практике.")}</h2><div><p>{t("Когда захочется вернуться от книг к живому знакомству, подумай, что тебе интересно попробовать: помочь на кухне, послушать круг или встретить местных людей. Можно начать с небольшого разговора. История Радуги продолжается и в тех встречах, которые у тебя ещё впереди.")}</p><a href="#article/origins" className="text-link">{t("История от Колорадо к Европе ")}<ArrowRight size={20} /></a></div></section></>;
}
