import {pageMeta,updatePageMeta} from './seo';
import {SiteLink} from './SiteLink';
import {DoorHome,QuestionsPage,KnowledgePaths,ParticipantVoices,Meetings,CampPlan} from './Doors';
import {readLocation,pagePath,isAppRoute} from './routing';
import { useI18n, LocaleProvider } from "./i18n";
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, ArrowUpRight, MagnifyingGlass, List, X, Check, BookOpen, ArrowDown, CheckCircle } from "@phosphor-icons/react";
import { searchableText, readingTime } from "./editorial";
import { Sources } from "./Sources";
import { LanguagePicker } from "./i18n";
const arrow = <ArrowRight size={23} aria-hidden="true" />;
const brand = <><img src="/assets/horizon-mark.png" alt="" /><span>RAINBOW</span></>;
const hrefFor = d => d.route ? "#" + d.route : ["first-time", "gatherings", "about"].includes(d.id) ? `#${d.id}` : `#article/${d.id}`;
const jump = id => document.getElementById(id)?.scrollIntoView({
  behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  block: "start"
});
function Checklist({
  checks,
  setChecks
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
  return <section className="packing" id="packing"><div><span className="eyebrow">{t("Практика · с собой")}</span><h2>{t("Собрать необходимое.")}<br />{t("Оставить место новому.")}</h2><p>{t("Начни с необходимого и дополни список под погоду, дорогу и свои потребности.")}</p><span className="pack-count" aria-live="polite">{checks.length.toString().padStart(2, "0")} <small>/ {checklist.length.toString().padStart(2, "0")}{t(" собрано")}</small></span></div><div className="checklist">{checklist.map((label, i) => <label key={label}><input type="checkbox" checked={checks.includes(i)} onChange={() => setChecks(checks.includes(i) ? checks.filter(x => x !== i) : [...checks, i])} /><span>{label}</span></label>)}<p className="caption">{t("Отметки сохраняются до перезагрузки страницы.")}</p></div></section>;
}
function Related({
  exclude
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
  return <section className="related wrap"><div className="section-top"><span className="eyebrow">{t("Продолжить чтение")}</span><SiteLink href="#library" className="text-link">{t("Вся библиотека ")}{arrow}</SiteLink></div><div className="related-list">{articles.filter(a => a.id !== exclude).slice(0, 3).map(a => <SiteLink href={hrefFor(a)} key={a.id}><span className="eyebrow">{a.category} · {readingTime(a)}{t(" мин")}</span><h3>{a.title}</h3><p>{a.description}</p>{arrow}</SiteLink>)}</div></section>;
}
function LongRead({
  doc,
  type,
  checks,
  setChecks
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
  const [active, setActive] = useState(0);
  useEffect(() => {
    setActive(0);
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.chapter));
    }, {
      rootMargin: "-15% 0px -65% 0px"
    });
    document.querySelectorAll("[data-chapter]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [doc]);
  return <><section className="article-masthead wrap"><SiteLink className="back-link" href={type === "article" ? "#library" : "#home"}><ArrowLeft size={18} />{type === "article" ? t("Библиотека") : t("Главная")}</SiteLink><div className="article-meta"><span>{type === "article" ? doc.category : type === "first-time" ? t("Первый раз") : type === "gatherings" ? t("Встречи") : type === "about" ? t("Наш дом") : t("Знакомство")}</span><span>{readingTime(doc)}{t(" минут чтения")}</span><span>{doc.sections.length}{t(" глав")}</span></div><h1>{doc.title}</h1><p className="dek">{doc.description}</p></section>{type === "gatherings" && <Meetings />}
 <div className="longread-layout wrap"><aside className="contents"><span className="eyebrow">{t("В этой истории")}</span><nav aria-label={t("Главы истории")}>{doc.sections.map((s, i) => <button key={s.title} aria-current={active === i ? "location" : undefined} onClick={() => jump(`chapter-${i}`)}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</button>)}</nav>{type === "first-time" && <button className="text-link packing-jump" onClick={() => jump("packing")}>{t("К списку вещей ")}<ArrowDown size={18} /></button>}</aside>
 <div className="longread-body">{doc.timeline && <div className="timeline" aria-label={t("Ориентиры истории")}>{doc.timeline.map(([year, text]) => <div key={year}><SiteLink href={"#chapter-"+({"1972":0,"1983":2,"1998":3}[year]??5)}><b>{year}</b></SiteLink><p>{text}</p></div>)}</div>}{doc.sections.map((s, i) => <section className="reading-chapter" data-chapter={i} id={`chapter-${i}`} key={s.title}><span className="chapter-label">{String(i + 1).padStart(2, "0")} / {doc.sections.length.toString().padStart(2, "0")}</span><h2>{s.title}</h2>{s.paragraphs.map(p => <p key={p}>{p}</p>)}{i === 2 && <figure className="inline-landscape"><img src="/assets/horizon-banner.webp" alt={t("Иллюстрация: берег синего озера с соснами и горами")} loading="lazy" /><figcaption>{t("Художественный образ · не место конкретной встречи")}</figcaption></figure>}</section>)}</div></div>
 {type === "article" && <aside className="article-further wrap"><details><summary>{t("Почитать по теме")}</summary><div>{(doc.sourceIds || sourceLinks[doc.id] || []).map(id=>resources.find(r=>r.id===id)).filter(Boolean).map(r=><SiteLink key={r.id} href={`#sources/${r.id}`}>{r.title}<ArrowRight size={17}/></SiteLink>)}</div></details></aside>}
 {type === "first-time" && <div className="wrap"><Checklist checks={checks} setChecks={setChecks} /></div>}

 <Related exclude={doc.id} /></>;
}
function Home(){return <DoorHome/>}
function Library({
  mode,
  query,
  setQuery,
  category,
  setCategory
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
  const results = articles.filter(a => (!mode || (mode === "history" ? ["history","origins"].includes(a.id) : !["history","origins"].includes(a.id))) && (category === t("Все") || a.category === category) && searchableText(a).toLowerCase().includes(query.toLowerCase().trim()));
  return <><section className="library-masthead wrap"><span className="eyebrow">{t("Библиотека · читать, узнавать, возвращаться")}</span><h1>{t("Истории,")}<br /><em>{t("из которых складывается дом.")}</em></h1><p className="dek">{t("Читай о том, как мы живём вместе: встречаем новичков, готовим еду, собираемся в круг и заботимся о лесе. Выбирай то, что интересно тебе сейчас, — от первого знакомства до истории радужных встреч.")}</p><KnowledgePaths /><div className="library-search"><label className="search-field"><MagnifyingGlass size={24} /><input aria-label={t("Поиск в библиотеке")} value={query} placeholder={t("Что хочется узнать?")} onChange={e => setQuery(e.target.value)} />{query && <button className="icon-button" aria-label={t("Очистить поиск")} onClick={() => setQuery("")}><X size={20} /></button>}</label><div className="filters" aria-label={t("Темы библиотеки")}>{[t("Все"), ...new Set(articles.map(a => a.category))].map(c => <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>{c}</button>)}</div></div></section>
 <section className="library-results wrap"><div className="results-meta"><span aria-live="polite">{results.length}{t(" из ")}{articles.length}{t(" историй")}</span><span>{t("Традиции, истории и общая жизнь")}</span></div>{results.map((a, i) => <article className="library-entry" key={a.id}><div className="library-entry-heading"><span className="eyebrow">{a.category} · {readingTime(a)}{t(" минут")}</span><h2><SiteLink href={hrefFor(a)}>{a.title}</SiteLink></h2><p>{a.description}</p><SiteLink className="text-link" href={hrefFor(a)}>{t("Читать дальше ")}{arrow}</SiteLink></div><div className="library-excerpt"><span className="chapter-label">{t("Начало истории")}</span><h3>{a.sections[0].title}</h3>{a.sections[0].paragraphs.map(p => <p key={p}>{p}</p>)}</div></article>)}{!results.length && <div className="empty"><BookOpen size={38} weight="light" /><h2>{t("Пока ничего не нашлось.")}</h2><p>{t("Попробуйте «кухня», «согласие», «вода» или другую тему.")}</p><button className="text-link" onClick={() => {
          setQuery("");
          setCategory(t("Все"));
        }}>{t("Сбросить поиск ")}{arrow}</button></div>}</section>
 <ParticipantVoices /><section className="reading-path wrap"><span className="eyebrow">{t("Как читать библиотеку")}</span><h2>{t("Не обязательно")}<br />{t("начинать с начала.")}</h2><div><p>{t("Перед первой поездкой загляни в подготовку и знакомство с общим домом. Если ты уже бывал на Радуге, возвращайся к темам, о которых хочется поговорить внимательнее: участию, личным границам или общим решениям.")}</p><p>{t("Если что-то откликается, поговори с людьми рядом. Спроси о местном круге, небольшой встрече или совместном деле. А когда захочется в дорогу, найди актуальное приглашение и узнай, как живёт именно эта встреча.")}</p><SiteLink className="text-link" href="#sources">{t("Почитать дальше и разобраться в словах ")}{arrow}</SiteLink></div></section></>;
}
function Walk() {
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
  const [active, setActive] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.stop));
    }, {
      rootMargin: "-10% 0px -60% 0px"
    });
    document.querySelectorAll("[data-stop]").forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
  return <><section className="article-masthead wrap"><span className="eyebrow">{t("Прогулка · условный маршрут")}</span><h1>{t("Один день.")}<br /><em>{t("Много способов быть рядом.")}</em></h1><p className="dek">{t("Пройдём от первого Welcome Home до последних дней лагеря. Это рассказ о практиках, а не карта реальной встречи: порядок и устройство мест могут отличаться.")}</p></section><CampPlan /><div className="walk-layout wrap"><aside className="contents"><span className="eyebrow">{t("Шесть остановок")}</span><nav aria-label={t("Остановки прогулки")}>{walkStops.map((s, i) => <button key={s.name} aria-current={active === i ? "location" : undefined} onClick={() => jump(`stop-${i}`)}><span>{String(i + 1).padStart(2, "0")}</span>{s.name}</button>)}</nav></aside><div className="walk-body">{walkStops.map((s, i) => <section id={`stop-${i}`} data-stop={i} className="walk-stop" key={s.name}><span className="chapter-label">{String(i + 1).padStart(2, "0")} / {s.name}</span><h2>{s.title}</h2><p className="story-lead">{s.text}</p>{articles[s.article].sections[s.section].paragraphs.map(p => <p key={p}>{p}</p>)}<details><summary>{s.question}</summary><p>{s.answer}</p></details><SiteLink className="text-link" href={hrefFor(articles[s.article])}>{t("Узнать больше ")}{arrow}</SiteLink>{i < 5 && <button className="next-stop" onClick={() => jump(`stop-${i + 1}`)}>{t("Следующая остановка ")}<ArrowDown size={19} /></button>}</section>)}</div></div><div className="wrap"><div className="walk-finish"><CheckCircle size={32} weight="light" /><h2>{t("У каждой дороги")}<br />{t("есть продолжение.")}</h2><p>{t("Если прогулка помогла представить встречу, следующий шаг — подготовка к собственному путешествию. А если остались вопросы, вернитесь к библиотеке: в жизни общего дома деталей всегда больше, чем на первой карте.")}</p><SiteLink className="button" href="#first-time">{t("Подготовиться к первой встрече ")}{arrow}</SiteLink></div></div></>;
}
function Experience({initialRoute}) {
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
  const nav = [["start", t("Что это?")], ["first-time", t("Еду впервые")], ["gatherings", t("Где встреча?")]];
  const allDocs = [...content.faq.map((item,index)=>({id:`question-${index}`,route:`questions/${index}`,title:item.question,description:item.answer,category:t("Вопросы и ответы"),sections:[{title:item.question,paragraphs:[item.answer]}]})), ...articles, {
    ...arrival,
    id: "first-time",
    category: t("Подготовка")
  }, {
    ...finding,
    id: "gatherings",
    category: t("Встречи")
  }, {
    ...about,
    id: "about",
    category: t("Наш дом")
  }, ...resources.map(r => ({
    ...r,
    id: "source-" + r.id,
    route: "sources/" + r.id,
    category: t("Источник"),
    sections: [{
      title: r.author,
      paragraphs: [r.description, r.limit]
    }]
  }))];
  const [route, setRoute] = useState(initialRoute || (typeof location!=="undefined" ? readLocation(location.href).route : "home"));
  useEffect(()=>{if(route.startsWith("questions")){requestAnimationFrame(()=>{const index=route.split("/")[1];const section=document.getElementById("question-"+index)||document.getElementById("questions");if(index!==undefined){const item=section?.querySelectorAll("details")[Number(index)];if(item)item.open=true;}section?.scrollIntoView({block:"start"});});}},[route]);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(t("Все"));
  const [checks, setChecks] = useState([]);
  const [progress, setProgress] = useState(0);
  const searchRef = useRef(null);
  useEffect(() => {
    const change = event => {
      if(event?.type === "hashchange" && !isAppRoute(location.hash.slice(1)))return;
      setRoute(readLocation(location.href).route);
      setMenu(false);
      setSearch(false);
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", change);
    addEventListener("popstate", change);
    return () => {removeEventListener("hashchange", change);removeEventListener("popstate",change);};
  }, []);
  useEffect(() => {
    updatePageMeta(pageMeta(route,lang,t,content));
    const scroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height > 0 ? scrollY / height : 0);
    };
    scroll();
    addEventListener("scroll", scroll, {
      passive: true
    });
    return () => removeEventListener("scroll", scroll);
  }, [route, lang]);
  useEffect(() => {
    const previous = document.activeElement;
    if (search) {
      searchRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    const key = e => {
      if (e.key === "Escape") {
        setSearch(false);
        setMenu(false);
      }
      if (search && e.key === "Tab") {
        const items = [...document.querySelectorAll(".search-panel button,.search-panel input")];
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    addEventListener("keydown", key);
    return () => {
      removeEventListener("keydown", key);
      document.body.style.overflow = "";
      if (search) previous?.focus();
    };
  }, [search]);
  const article = articles.find(a => route === `article/${a.id}`);
  const searchResults = allDocs.filter(a => searchableText(a).toLowerCase().includes(query.toLowerCase().trim()));
  const goto = r => {
    setSearch(false);
    history.pushState(null,"",pagePath(lang,r)); setRoute(r); window.scrollTo(0,0);
  };
  const known = ["home", "start", "first-time", "gatherings", "library", "walk", "about"].includes(route) || route.startsWith("sources") || route.startsWith("questions") || route.startsWith("library") || article;
  useEffect(() => {
    setCategory(t("Все"));
    setQuery("");
    setMenu(false);
    setSearch(false);
  }, [lang]);
  return <><SiteLink className="skip" href="#content" onClick={e => {
      e.preventDefault();
      document.getElementById("content").focus();
    }}>{t("К содержимому")}</SiteLink><div className="reading-progress" style={{
      transform: `scaleX(${progress})`
    }} aria-hidden="true" /><header className="site-header"><SiteLink className="brand" href="#home" aria-label={t("Rainbow — главная")}>{brand}</SiteLink><nav aria-label={t("Главное меню")}>{nav.map(([r, label]) => <SiteLink key={r} href={`#${r}`} aria-current={route === r ? "page" : undefined}>{label}</SiteLink>)}</nav><div className="header-tools"><LanguagePicker /><button className="search-trigger" onClick={() => {
          setMenu(false);
          setSearch(true);
        }} aria-label={t("Поиск по сайту")}><MagnifyingGlass size={21} /><span>{t("Поиск по сайту…")}</span></button><button className="icon-button menu-trigger" aria-expanded={menu} aria-label={menu ? t("Закрыть меню") : t("Открыть меню")} onClick={() => setMenu(!menu)}>{menu ? <X size={25} /> : <List size={25} />}</button></div></header>
 {menu && <nav className="mobile-nav" aria-label={t("Мобильное меню")}>{nav.map(([r, label]) => <SiteLink href={`#${r}`} key={r}>{label}{arrow}</SiteLink>)}<SiteLink href="#walk">{t("Прогулка по Радуге ")}{arrow}</SiteLink><SiteLink href="#sources">{t("Книги и архивы")}{arrow}</SiteLink></nav>}
 <main id="content" tabIndex={-1}>
 {route === "home" && <Home />}
 {route === "start" && <LongRead key="start" doc={articles[0]} type="start" />}
 {route === "first-time" && <LongRead key="first-time" doc={arrival} type="first-time" checks={checks} setChecks={setChecks} />}
 {route === "gatherings" && <LongRead key="gatherings" doc={finding} type="gatherings" />}
 {route === "about" && <LongRead key="about" doc={about} type="about" />}
 {route.startsWith("questions") && <QuestionsPage target={route.split("/")[1]} />}
 {route.startsWith("library") && <Library mode={route.split("/")[1]} query={query} setQuery={setQuery} category={category} setCategory={setCategory} />}
 {route === "walk" && <Walk />}
 {route.startsWith("sources") && <Sources key={lang} target={route.split("/")[1]} />}
 {article && <LongRead key={article.id} doc={article} type="article" />}
 {!known && <section className="not-found wrap"><span className="eyebrow">{t("404 · вне тропы")}</span><h1>{t("Эта страница")}<br />{t("ещё не появилась.")}</h1><SiteLink className="button" href="#home">{t("Вернуться домой ")}{arrow}</SiteLink></section>}
 </main>
 <footer className="site-footer"><div className="wrap"><div className="footer-top"><SiteLink href="#home" className="brand">{brand}</SiteLink><span>{t("Временные встречи.")}<br />{t("Живые связи.")}</span><SiteLink href="#first-time" className="text-link">{t("Собраться в дорогу ")}{arrow}</SiteLink></div><div className="footer-bottom"><p>{t("Welcome Home Center · Радуга онлайн.")}<br />{t("Знакомство, традиции и дорога к своему кругу.")}</p><nav aria-label={t("Дополнительная навигация")}><SiteLink href="#questions">{t("Вопросы и ответы")}</SiteLink><SiteLink href="#walk">{t("Прогулка")}</SiteLink><SiteLink href="#sources">{t("Книги и архивы")}</SiteLink><SiteLink href="#about">{t("Наш дом")}</SiteLink><LanguagePicker /></nav><SiteLink href="#home">Welcome Home <ArrowUpRight size={16} /></SiteLink></div>{lang !== "ru" && <p className="translation-note">{t("Перевод с русского: автоматическая подготовка и выборочная редакторская проверка. Названия источников сохранены в оригинале.")}</p>}</div></footer>
 {search && <div className="search-overlay" role="dialog" aria-modal="true" aria-labelledby="search-title"><div className="search-panel"><button className="icon-button close" aria-label={t("Закрыть поиск")} onClick={() => setSearch(false)}><X size={25} /></button><span className="eyebrow">{t("О чём тебе хочется узнать?")}</span><h2 id="search-title">{t("С чего начнём?")}</h2><label className="search-field"><MagnifyingGlass size={24} /><input ref={searchRef} value={query} aria-label={t("Поисковый запрос")} placeholder={t("Кухня, согласие, дорога…")} onChange={e => setQuery(e.target.value)} /></label><p className="caption" aria-live="polite">{t("Найдено: ")}{searchResults.length}</p><div className="search-results">{searchResults.map(d => <button key={d.id} onClick={() => goto(hrefFor(d).slice(1))}><span><small>{d.category} · {readingTime(d)}{t(" мин")}</small>{d.title}</span>{arrow}</button>)}{!searchResults.length && <div className="empty"><h3>{t("Пока ничего не нашлось.")}</h3><p>{t("Попробуйте другое слово или откройте всю библиотеку.")}</p><button className="text-link" onClick={() => {
              setQuery("");
              setCategory(t("Все"));
              goto("library");
            }}>{t("Открыть библиотеку ")}{arrow}</button></div>}</div></div></div>}
 </>;
}
export function App({initialRoute,initialLanguage,initialDictionary}={}) {
  return <LocaleProvider initialLanguage={initialLanguage} initialDictionary={initialDictionary}><Experience initialRoute={initialRoute}/></LocaleProvider>;
}


