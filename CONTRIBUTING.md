# Editorial contributions

## Personal stories and corrections

Use the GitHub issue templates to propose a story or a verified update. Proposals are public; they are not automatically published on the website. This is an editorial contribution workflow, not a separate CMS or automatic moderation system.

Stories need an agreed byline or pseudonym and permission from the author. Photographs need a source, license/permission and agreement from identifiable people shown. Do not include private contacts, precise current Gathering coordinates or closed-group messages. Distinguish first-person recollections from claims about all Gatherings.

## Invitations

Edit `src/door-content.js`. Keep archive announcements separate from upcoming invitations. A new future entry must contain:

- Broad `region`, meeting `type`, public `title`, ISO `start` and `end` dates.
- `url` for a primary public invitation and a human-readable `sourceLabel`.
- `checkedAt`: the date somebody actually checked the source, not the build date.
- `primaryInvitation: true`, `publicationPermission: true`, `status: 'published'` only when the corresponding evidence exists.
- A useful `note` explaining what was checked and any remaining uncertainty.

The policy rejects future entries that lack a primary invitation or permission to spread it. Do not copy exact coordinates into this public directory. Successful HTTP access only shows that a page opens; it does not verify its dates, conditions, or permission to redistribute a private invitation.

The 17 October 2026 check found old 2025 invitations on two major public pages. A public Telegram group and an independent calendar are listed as starting points for questions, with their limits; their existence is not treated as confirmation of a new invitation. No world-wide completeness is claimed.

## Resources

Bibliography entries are in `src/materials.js`; URL-review records are in `src/door-content.js`. Keep the original title, date, author, source URL and useful reading context. An unavailable page should be labelled honestly, not silently assigned today's successful-check date.

## Languages

1. Edit the Russian editorial content or UI.
2. Run `node scripts/extract-catalog.mjs`.
3. Prepare translations in the five JSON catalogs. The optional Python helper sends public text to an external translation endpoint; it never runs for visitors.
4. Review meaning and direct reader address. Run `scripts/review-center-locales.mjs` and then `scripts/review-door-locales.mjs` for retained selected corrections.
5. Run `npm run build` and `npm test`. Inspect desktop and narrow mobile layouts, metadata and raw HTML before publishing.

A review date must be based on actual review. Do not describe machine translations as fully proofread by native speakers.
