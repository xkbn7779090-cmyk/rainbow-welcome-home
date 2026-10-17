# Rainbow — Welcome Home Center

**Live:** https://rainbow-welcome-home.xkbn.chatgpt.site/

A door into Rainbow for curious newcomers, with deeper traditions, history and resources behind it. Russian, English, Dutch, German, French and Spanish.

## Experience

- A concrete first-screen explanation and three clear paths: what Rainbow is, a first trip, and finding a Gathering.
- A composite first-day story, eight quick answers, detailed preparation and nine substantial articles.
- An interactive conceptual camp plan and a linked historical timeline.
- A categorized packing checklist, shared across languages and saved in the browser, with optional items and a reset control.
- Region and text filters for public resources, plus a separate invitation archive and a short first-message guide.
- Separate practice, history, books/archives and contributed-story paths.
- A meeting directory that separates archival invitations, current published invitations and places to ask questions. Link-check dates are not event verification.
- An archive Welcome Home photo by Jaknouse, released into the public domain, with author/date/source credit. Personal accounts and portraits are not fabricated. See `public/MEDIA-CREDITS.md`.

The editorial UX update is documented in [the audit and verification report](docs/ux/README.md), including actual before/after screenshots. This branch has not been deployed. An authenticated forum review informs the resource description; private announcements, contacts and coordinates are not copied into the public repository.

## Run and verify

Use Node.js 22+ and npm.

```sh
npm ci
npm run dev
npm run build
npm test
npm run preview
```

The build uses Vite and React server rendering to write 240 translated HTML pages plus the root and 404 page. Content, links, titles, descriptions, canonical/hreflang and Open Graph are available without JavaScript. A sitemap and robots.txt are included. JavaScript progressively adds search, filters, the camp plan, day selection and checklists. No automatic search-engine indexing or Telegram cache refresh is implied.

Canonical paths look like `/en/article/kitchen/` and `/ru/first-time/`. Old hash URLs and `?lang=` links remain readable. Language changes preserve the current material. Normal links also work without JavaScript. The checklist remains in the current app session, including client navigation; a full reload resets it.

## Source

- `src/Experience.jsx`, `src/Doors.jsx`, `src/Sources.jsx`: pages and interactions.
- `src/editorial.js`, `src/materials.js`: long-form stories, FAQ, bibliography and glossary.
- `src/door-content.js`: first-day copy, cautions, invitations, connection resources and dated link reviews.
- `src/meeting-policy.js`: future-listing eligibility; a third-party calendar is not enough.
- `src/i18n.jsx`, `src/locales/`: complete static translations and language switching.
- `src/routing.js`, `src/SiteLink.jsx`, `src/seo.js`: ordinary page URLs, progressive navigation and metadata.
- `src/entry-server.jsx`, `scripts/prerender.mjs`: translated pre-rendering.
- `worker/`, `scripts/prepare-sites-build.mjs`: Sites packaging and real 404 responses.

Translations are automatically prepared with selected editorial corrections. They have not received complete native-speaker proofreading. Source publication titles remain in their original languages.

`.openai/hosting.json` identifies the existing live Sites project. Use your own hosting configuration when deploying a separate copy. Public frontend output is `dist/client`; the build also emits `dist/server/index.js` and deployment metadata.

See `CONTRIBUTING.md` for the editorial workflow. The repository excludes supplied PDFs, credentials, private forum material, personal contacts, local backups and development screenshots.
