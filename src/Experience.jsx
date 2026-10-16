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
  return <section className="related wrap"><div className="section-top"><span className="eyebrow">{t("Продолжить чтение")}</span><a href="#library" className="text-link">{t("Вся библиотека ")}{arrow}</a></div><div className="related-list">{articles.filter(a => a.id !== exclude).slice(0, 3).map(a => <a href={hrefFor(a)} key={a.id}><span className="eyebrow">{a.category} · {readingTime(a)}{t(" мин")}</span><h3>{a.title}</h3><p>{a.description}</p>{arrow}</a>)}</div></section>;
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
  return <><section className="article-masthead wrap"><a className="back-link" href={type === "article" ? "#library" : "#home"}><ArrowLeft size={18} />{type === "article" ? t("Библиотека") : t("Главная")}</a><div className="article-meta"><span>{type === "article" ? doc.category : type === "first-time" ? t("Первый раз") : type === "gatherings" ? t("Встречи") : type === "about" ? t("Наш дом") : t("Знакомство")}</span><span>{readingTime(doc)}{t(" минут чтения")}</span><span>{doc.sections.length}{t(" глав")}</span></div><h1>{doc.title}</h1><p className="dek">{doc.description}</p></section>
 <div className="longread-layout wrap"><aside className="contents"><span className="eyebrow">{t("В этой истории")}</span><nav aria-label={t("Главы истории")}>{doc.sections.map((s, i) => <button key={s.title} aria-current={active === i ? "location" : undefined} onClick={() => jump(`chapter-${i}`)}><span>{String(i + 1).padStart(2, "0")}</span>{s.title}</button>)}</nav>{type === "first-time" && <button className="text-link packing-jump" onClick={() => jump("packing")}>{t("К списку вещей ")}<ArrowDown size={18} /></button>}</aside>
 <div className="longread-body">{doc.timeline && <div className="timeline" aria-label={t("Ориентиры истории")}>{doc.timeline.map(([year, text]) => <div key={year}><b>{year}</b><p>{text}</p></div>)}</div>}{doc.sections.map((s, i) => <section className="reading-chapter" data-chapter={i} id={`chapter-${i}`} key={s.title}><span className="chapter-label">{String(i + 1).padStart(2, "0")} / {doc.sections.length.toString().padStart(2, "0")}</span><h2>{s.title}</h2>{s.paragraphs.map(p => <p key={p}>{p}</p>)}{i === 2 && <figure className="inline-landscape"><img src="/assets/horizon-banner.webp" alt={t("Иллюстрация: берег синего озера с соснами и горами")} loading="lazy" /><figcaption>{t("Художественный образ · не место конкретной встречи")}</figcaption></figure>}</section>)}</div></div>
 {type === "first-time" && <div className="wrap"><Checklist checks={checks} setChecks={setChecks} /></div>}
 {type === "gatherings" && <section className="source-directory wrap"><span className="eyebrow">{t("Найди людей рядом")}</span><h2>{t("Начни с разговора.")}</h2><p className="directory-intro">{t("Здесь можно начать знакомство с участниками и поиск местного круга. Представься, спроси о ближайших встречах и уточни, действует ли приглашение сейчас. В разных странах и сообществах свой ритм встреч.")}</p>{[["RainbowForum", t("Разговоры участников. Для части разделов нужен вход."), "https://rainbowforum.net/index.php"], ["Rainbow Gathering Europe", t("Независимый европейский ресурс. Смотрите даты обновлений."), "https://rainbowgathering.eu/"], ["Welcomehome.org", t("Архив истории и практик; прошлые анонсы не являются текущим приглашением."), "https://www.welcomehome.org/main.html"]].map(([label, d, u]) => <a className="source-row" href={u} target="_blank" rel="noreferrer" key={u}><h3>{label}</h3><p>{d}</p><ArrowUpRight size={26} /></a>)}</section>}
 <Related exclude={doc.id} /></>;
}
function Home() {
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
  return <><section className="hero"><div className="hero-inner wrap"><div className="hero-copy"><span className="eyebrow">{t("Welcome Home Center")}</span><h1>{lang === "ru" ? <>Место,<br/>которое мы<br/>создаём<br/>вместе</> : t("Место, которое мы создаём вместе")}</h1><p>{t("Здесь ты можешь познакомиться с Радугой: нашими встречами, традициями и жизнью общего дома. Читай, спрашивай и прислушивайся к тому, что тебе близко.")}</p><a className="button" href="#start">{t("Познакомиться с Радугой ")}{arrow}</a><div className="hero-links"><a href="#first-time">{t("Первый раз")}</a><a href="#gatherings">{t("Найти встречу")}</a><a href="#library">{t("Истории и знания")}</a></div></div></div><figure className="hero-art"><img src="/assets/horizon-hero.webp" alt={t("Иллюстрация: синее альпийское озеро среди гор и сосен")} fetchPriority="high" /><figcaption>{t("Художественный образ")}</figcaption></figure></section>
 <section className="opening wrap" id="opening"><div className="opening-text"><span className="eyebrow">{t("Глава 01")}</span><h2>{t("Что начинается")}<br />{t("после Welcome Home")}</h2><p>{t("Дорогой брат, дорогая сестра, дорогой читатель — добро пожаловать домой. Если ты впервые слышишь о Радуге, начни здесь. Представь обычный день в лесу: кто-то несёт воду, другие готовят еду, а на тропе тебя встречает незнакомый человек. Постепенно появляются имена, разговоры и ощущение общего дома.")}</p><p>{t("Здесь ты узнаешь, как мы собираемся, делимся едой, слушаем друг друга и бережём место встречи. Тебе не нужно заранее знать все традиции или сразу решать, поедешь ли ты. Выбери интересную тему, загляни в ответы на первые вопросы и дай себе время почувствовать: хочется ли тебе познакомиться ближе?")}</p><button className="text-link" onClick={() => jump("questions")}>{t("Твои первые вопросы")}{arrow}</button></div><aside className="opening-aside"><nav className="chapter-tabs" aria-label={t("Главы знакомства")}>{[["01", t("После Welcome Home"), "story-0"], ["02", t("Жизнь на встрече"), "story-1"], ["03", t("Забота и место"), "story-3"]].map(([n, label, id]) => <button key={n} onClick={() => jump(id)}><b>{n}</b><span>{label}</span><small>{t("К главе ")}<ArrowDown size={14} /></small></button>)}</nav><p className="pullquote">{t("Участие")}<br />{t("начинается")}<br />{t("с маленького")}<br />{t("дела")}</p><img className="botanical" src="/assets/horizon-botanical.webp" alt="" loading="lazy" /></aside></section>
 <figure className="panorama wrap"><img src="/assets/horizon-banner.webp" alt={t("Синий горный пейзаж: озеро, берег и далёкие вершины")} loading="lazy" /><figcaption>{t("Художественный образ · пространство для воображения, а не координаты встречи")}</figcaption></figure>
 <div className="story-flow wrap">{story.map((s, i) => <section className={`story-chapter story-${i}`} id={`story-${i}`} key={s.number}><div className="story-heading"><span className="chapter-label">{s.number} / {s.eyebrow}</span><h2>{s.title}</h2></div><div className="story-prose"><p className="story-lead">{s.text}</p><p>{s.more}</p><a className="text-link" href={`#${s.href}`}>{s.link} {arrow}</a></div></section>)}</div>
 <section className="journey-band"><div className="wrap"><span className="eyebrow">{t("Прогулка по Радуге")}</span><h2>{t("Пройти этот путь")}<br />{t("в своём темпе.")}</h2><div><p>{t("Шесть остановок: вход, кухня, общий круг, соседство, информация и последние дни. Рассказ о повседневной жизни — без необходимости уже собирать рюкзак.")}</p><a className="button" href="#walk">{t("Начать прогулку ")}{arrow}</a></div></div></section><Related /><WelcomeQuestions />
 <section className="closing wrap"><span className="eyebrow">Welcome Home</span><h2>{t("Найти своё место.")}<br /><em>{t("Привнести что-то своё.")}</em></h2><a href="#first-time" className="text-link">{t("Готовлюсь к первой встрече ")}{arrow}</a></section></>;
}
function WelcomeQuestions(){
 const {t,content}=useI18n();
 return <section className="welcome-questions wrap" id="questions"><div className="questions-intro"><span className="eyebrow">{t("Твои первые вопросы")}</span><h2>{t("Прежде чем")}<br/><em>{t("собирать рюкзак.")}</em></h2><p>{t("Можно начать с самого простого. Здесь — ответы, которые помогут тебе понять, как устроена Радуга и что важно перед первой встречей.")}</p></div><div className="questions-list">{content.faq.map(item=><details key={item.href}><summary>{item.question}<span aria-hidden="true">+</span></summary><div><p>{item.answer}</p><a className="text-link" href={`#${item.href}`}>{item.link}{arrow}</a></div></details>)}</div></section>;
}
function Library({
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
  const results = articles.filter(a => (category === t("Все") || a.category === category) && searchableText(a).toLowerCase().includes(query.toLowerCase().trim()));
  return <><section className="library-masthead wrap"><span className="eyebrow">{t("Библиотека · читать, узнавать, возвращаться")}</span><h1>{t("Истории,")}<br /><em>{t("из которых складывается дом.")}</em></h1><p className="dek">{t("Читай о том, как мы живём вместе: встречаем новичков, готовим еду, собираемся в круг и заботимся о лесе. Выбирай то, что интересно тебе сейчас, — от первого знакомства до истории радужных встреч.")}</p><div className="library-search"><label className="search-field"><MagnifyingGlass size={24} /><input aria-label={t("Поиск в библиотеке")} value={query} placeholder={t("Что хочется узнать?")} onChange={e => setQuery(e.target.value)} />{query && <button className="icon-button" aria-label={t("Очистить поиск")} onClick={() => setQuery("")}><X size={20} /></button>}</label><div className="filters" aria-label={t("Темы библиотеки")}>{[t("Все"), ...new Set(articles.map(a => a.category))].map(c => <button key={c} aria-pressed={c === category} onClick={() => setCategory(c)}>{c}</button>)}</div></div></section>
 <section className="library-results wrap"><div className="results-meta"><span aria-live="polite">{results.length}{t(" из ")}{articles.length}{t(" историй")}</span><span>{t("Традиции, истории и общая жизнь")}</span></div>{results.map((a, i) => <article className="library-entry" key={a.id}><div className="library-entry-heading"><span className="eyebrow">{a.category} · {readingTime(a)}{t(" минут")}</span><h2><a href={hrefFor(a)}>{a.title}</a></h2><p>{a.description}</p><a className="text-link" href={hrefFor(a)}>{t("Читать дальше ")}{arrow}</a></div><div className="library-excerpt"><span className="chapter-label">{t("Начало истории")}</span><h3>{a.sections[0].title}</h3>{a.sections[0].paragraphs.map(p => <p key={p}>{p}</p>)}</div></article>)}{!results.length && <div className="empty"><BookOpen size={38} weight="light" /><h2>{t("Пока ничего не нашлось.")}</h2><p>{t("Попробуйте «кухня», «согласие», «вода» или другую тему.")}</p><button className="text-link" onClick={() => {
          setQuery("");
          setCategory(t("Все"));
        }}>{t("Сбросить поиск ")}{arrow}</button></div>}</section>
 <section className="reading-path wrap"><span className="eyebrow">{t("Как читать библиотеку")}</span><h2>{t("Не обязательно")}<br />{t("начинать с начала.")}</h2><div><p>{t("Перед первой поездкой загляни в подготовку и знакомство с общим домом. Если ты уже бывал на Радуге, возвращайся к темам, о которых хочется поговорить внимательнее: участию, личным границам или общим решениям.")}</p><p>{t("Если что-то откликается, поговори с людьми рядом. Спроси о местном круге, небольшой встрече или совместном деле. А когда захочется в дорогу, найди актуальное приглашение и узнай, как живёт именно эта встреча.")}</p><a className="text-link" href="#sources">{t("Почитать дальше и разобраться в словах ")}{arrow}</a></div></section></>;
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
  return <><section className="article-masthead wrap"><span className="eyebrow">{t("Прогулка · условный маршрут")}</span><h1>{t("Один день.")}<br /><em>{t("Много способов быть рядом.")}</em></h1><p className="dek">{t("Пройдём от первого Welcome Home до последних дней лагеря. Это рассказ о практиках, а не карта реальной встречи: порядок и устройство мест могут отличаться.")}</p></section><div className="walk-layout wrap"><aside className="contents"><span className="eyebrow">{t("Шесть остановок")}</span><nav aria-label={t("Остановки прогулки")}>{walkStops.map((s, i) => <button key={s.name} aria-current={active === i ? "location" : undefined} onClick={() => jump(`stop-${i}`)}><span>{String(i + 1).padStart(2, "0")}</span>{s.name}</button>)}</nav></aside><div className="walk-body">{walkStops.map((s, i) => <section id={`stop-${i}`} data-stop={i} className="walk-stop" key={s.name}><span className="chapter-label">{String(i + 1).padStart(2, "0")} / {s.name}</span><h2>{s.title}</h2><p className="story-lead">{s.text}</p>{articles[s.article].sections[s.section].paragraphs.map(p => <p key={p}>{p}</p>)}<details><summary>{s.question}</summary><p>{s.answer}</p></details><a className="text-link" href={hrefFor(articles[s.article])}>{t("Узнать больше ")}{arrow}</a>{i < 5 && <button className="next-stop" onClick={() => jump(`stop-${i + 1}`)}>{t("Следующая остановка ")}<ArrowDown size={19} /></button>}</section>)}</div></div><div className="wrap"><div className="walk-finish"><CheckCircle size={32} weight="light" /><h2>{t("У каждой дороги")}<br />{t("есть продолжение.")}</h2><p>{t("Если прогулка помогла представить встречу, следующий шаг — подготовка к собственному путешествию. А если остались вопросы, вернитесь к библиотеке: в жизни общего дома деталей всегда больше, чем на первой карте.")}</p><a className="button" href="#first-time">{t("Подготовиться к первой встрече ")}{arrow}</a></div></div></>;
}
function Experience() {
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
  const nav = [["start", t("Знакомство")], ["first-time", t("Первый раз")], ["gatherings", t("Встречи")], ["library", t("Библиотека")]];
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
  const [route, setRoute] = useState(location.hash.slice(1) || "home");
  useEffect(()=>{if(route.startsWith("questions")){requestAnimationFrame(()=>{const index=route.split("/")[1];const section=document.getElementById("questions");if(index!==undefined){const item=section?.querySelectorAll("details")[Number(index)];if(item)item.open=true;}section?.scrollIntoView({block:"start"});});}},[route]);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(t("Все"));
  const [checks, setChecks] = useState([]);
  const [progress, setProgress] = useState(0);
  const searchRef = useRef(null);
  useEffect(() => {
    const change = () => {
      setRoute(location.hash.slice(1) || "home");
      setMenu(false);
      setSearch(false);
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.title = `${route === "home" ? "Welcome Home" : route.startsWith("questions") ? t("Вопросы и ответы") : route === "library" ? t("Библиотека") : route === "first-time" ? t("Первый раз") : route === "gatherings" ? t("Встречи") : route === "walk" ? t("Прогулка по Радуге") : route === "about" ? t("Наш дом") : route.startsWith("sources") ? t("Книги и архивы") : articles.find(a => route === `article/${a.id}`)?.title || t("Знакомство")} · Rainbow`;
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
    location.hash = r;
  };
  const known = ["home", "start", "first-time", "gatherings", "library", "walk", "about"].includes(route) || route.startsWith("sources") || route.startsWith("questions") || article;
  useEffect(() => {
    setCategory(t("Все"));
    setQuery("");
    setMenu(false);
    setSearch(false);
  }, [lang]);
  return <><a className="skip" href="#content" onClick={e => {
      e.preventDefault();
      document.getElementById("content").focus();
    }}>{t("К содержимому")}</a><div className="reading-progress" style={{
      transform: `scaleX(${progress})`
    }} aria-hidden="true" /><header className="site-header"><a className="brand" href="#home" aria-label={t("Rainbow — главная")}>{brand}</a><nav aria-label={t("Главное меню")}>{nav.map(([r, label]) => <a key={r} href={`#${r}`} aria-current={route === r ? "page" : undefined}>{label}</a>)}</nav><div className="header-tools"><LanguagePicker /><button className="search-trigger" onClick={() => {
          setMenu(false);
          setSearch(true);
        }} aria-label={t("Поиск по сайту")}><MagnifyingGlass size={21} /><span>{t("Поиск по сайту…")}</span></button><button className="icon-button menu-trigger" aria-expanded={menu} aria-label={menu ? t("Закрыть меню") : t("Открыть меню")} onClick={() => setMenu(!menu)}>{menu ? <X size={25} /> : <List size={25} />}</button></div></header>
 {menu && <nav className="mobile-nav" aria-label={t("Мобильное меню")}>{nav.map(([r, label]) => <a href={`#${r}`} key={r}>{label}{arrow}</a>)}<a href="#walk">{t("Прогулка по Радуге ")}{arrow}</a><a href="#sources">{t("Книги и архивы")}{arrow}</a></nav>}
 <main id="content" tabIndex={-1}>
 {(route === "home" || route.startsWith("questions")) && <Home />}
 {route === "start" && <LongRead key="start" doc={articles[0]} type="start" />}
 {route === "first-time" && <LongRead key="first-time" doc={arrival} type="first-time" checks={checks} setChecks={setChecks} />}
 {route === "gatherings" && <LongRead key="gatherings" doc={finding} type="gatherings" />}
 {route === "about" && <LongRead key="about" doc={about} type="about" />}
 {route === "library" && <Library query={query} setQuery={setQuery} category={category} setCategory={setCategory} />}
 {route === "walk" && <Walk />}
 {route.startsWith("sources") && <Sources key={lang} target={route.split("/")[1]} />}
 {article && <LongRead key={article.id} doc={article} type="article" />}
 {!known && <section className="not-found wrap"><span className="eyebrow">{t("404 · вне тропы")}</span><h1>{t("Эта страница")}<br />{t("ещё не появилась.")}</h1><a className="button" href="#home">{t("Вернуться домой ")}{arrow}</a></section>}
 </main>
 <footer className="site-footer"><div className="wrap"><div className="footer-top"><a href="#home" className="brand">{brand}</a><span>{t("Временные встречи.")}<br />{t("Живые связи.")}</span><a href="#first-time" className="text-link">{t("Собраться в дорогу ")}{arrow}</a></div><div className="footer-bottom"><p>{t("Welcome Home Center · Радуга онлайн.")}<br />{t("Знакомство, традиции и дорога к своему кругу.")}</p><nav aria-label={t("Дополнительная навигация")}><a href="#questions">{t("Вопросы и ответы")}</a><a href="#walk">{t("Прогулка")}</a><a href="#sources">{t("Книги и архивы")}</a><a href="#about">{t("Наш дом")}</a><LanguagePicker /></nav><a href="#home">Welcome Home <ArrowUpRight size={16} /></a></div>{lang !== "ru" && <p className="translation-note">{t("Перевод с русского: автоматическая подготовка и выборочная редакторская проверка. Названия источников сохранены в оригинале.")}</p>}</div></footer>
 {search && <div className="search-overlay" role="dialog" aria-modal="true" aria-labelledby="search-title"><div className="search-panel"><button className="icon-button close" aria-label={t("Закрыть поиск")} onClick={() => setSearch(false)}><X size={25} /></button><span className="eyebrow">{t("О чём тебе хочется узнать?")}</span><h2 id="search-title">{t("С чего начнём?")}</h2><label className="search-field"><MagnifyingGlass size={24} /><input ref={searchRef} value={query} aria-label={t("Поисковый запрос")} placeholder={t("Кухня, согласие, дорога…")} onChange={e => setQuery(e.target.value)} /></label><p className="caption" aria-live="polite">{t("Найдено: ")}{searchResults.length}</p><div className="search-results">{searchResults.map(d => <button key={d.id} onClick={() => goto(hrefFor(d).slice(1))}><span><small>{d.category} · {readingTime(d)}{t(" мин")}</small>{d.title}</span>{arrow}</button>)}{!searchResults.length && <div className="empty"><h3>{t("Пока ничего не нашлось.")}</h3><p>{t("Попробуйте другое слово или откройте всю библиотеку.")}</p><button className="text-link" onClick={() => {
              setQuery("");
              setCategory(t("Все"));
              goto("library");
            }}>{t("Открыть библиотеку ")}{arrow}</button></div>}</div></div></div>}
 </>;
}
export function App() {
  return <LocaleProvider><Experience /></LocaleProvider>;
}


