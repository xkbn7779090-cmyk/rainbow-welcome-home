# Rainbow — Welcome Home Center

An online home for Rainbow people and anyone curious about Rainbow Gatherings: traditions, shared camp life, history, consent, preparation and finding a local circle.

**Live website:** https://rainbow-welcome-home.xkbn.chatgpt.site/

## What is included

- Nine substantial stories and a detailed first-visit introduction.
- Eight frequently asked questions, searchable and directly linkable.
- A packing checklist, an illustrated walk, a historical timeline and a glossary.
- A separate directory of books and archives for further reading.
- Russian, English, Dutch, German, French and Spanish, with a language switcher.

Translations are static files prepared automatically with selected editorial corrections. They have not received complete native-speaker proofreading. Original publication titles are retained.

## Run locally

Use Node.js 22 or later and npm.

```sh
npm ci
npm run dev
```

Build and verify:

```sh
npm run build
npm run test:sites
node --test tests/content-locales.test.mjs
npm run preview
```

Vite outputs the frontend to `dist/client`. The build also prepares the Worker entrypoint and existing Sites hosting metadata. The included project ID identifies the existing live site; use your own hosting configuration when deploying a separate copy.

## Project structure

- `src/Experience.jsx` — pages, navigation, search, checklist and FAQ.
- `src/editorial.js` and `src/materials.js` — stories, FAQ, glossary and further reading.
- `src/i18n.jsx` and `src/locales/` — language selection and complete static translations.
- `src/horizon.css` and `src/materials.css` — responsive Open Horizon design.
- `public/assets/` — original generated landscape illustrations and site mark.
- `worker/` and `scripts/prepare-sites-build.mjs` — Sites runtime packaging.

Navigation uses hash routes. A language can be shared in a URL, for example `?lang=en#questions/1`. Language preference is stored locally. Checklist marks last for the current open app session.

For translation maintenance, extract the catalog with `node scripts/extract-catalog.mjs`. `scripts/translate-catalog.py` is an optional preparation tool that sends public editorial strings to an external translation endpoint; it is not used by the live site. Review translations before publishing. `scripts/review-center-locales.mjs` applies selected corrections and prunes obsolete keys.

This repository contains the current website source. Supplied source PDFs, private forum content, credentials, personal contact lists, local backups and development screenshots are excluded. Landscape artwork is illustrative, not documentation of a particular Gathering. No confirmed calendar of future Gatherings or registration service is provided.
