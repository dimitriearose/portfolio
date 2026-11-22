# Portfolio: project conventions

Dimitri's personal site for writing, short films and electronics builds,
mostly for browsing and wandering. Dimitri is relearning web development:
after each change, briefly explain what changed and why.

## Stack
- Astro 7 + TypeScript (strict, `astro/tsconfigs/strict`). Node ≥ 22.23 (dev on Node 26, CI on 24).
- Fully static output. Deployed to GitHub Pages at `/portfolio/` via `.github/workflows/deploy.yml` (see DEPLOY.md).
- Dependencies: `astro`, `@astrojs/rss`, `@astrojs/sitemap`; dev: `@astrojs/check`, `typescript`. **Ask before adding any other dependency.**

## Design: "Margins"
- The homepage is a book's table of contents: years are chapters (`Chapter.astro`), each work is one line (`Entry.astro`: glyph, title, dotted leader, month), italic notes sit in a reserved right-hand margin column.
- Reference: `Portfolio — homepage directions-selection.pdf` (the "B: Margins" direction only; "Cutting Room" and "Datasheet" were rejected).
- **Ask before changing the design.**
- Plain CSS only, using the tokens in `src/styles/global.css` (`--paper`, `--ink`, `--ink-soft`, `--rule`, `--leader`, `--link`, `--link-hover`; `--text-note` … `--text-name`). No Tailwind, no UI frameworks, no client-side JS unless truly needed.
- Component styles in the component's scoped `<style>`. Markdown output is unscoped, so article body styles live under `.prose` in `global.css`.
- Font: Literata via Astro's Fonts API (`astro.config.ts`, `--font-literata`).
- Code blocks are plain (`markdown.syntaxHighlight: false`).

## Content
- Three collections in `src/content.config.ts` (glob loader, `z` from `astro/zod`): `writing`, `films`, `builds`. Shared fields: `title`, `date` (coerced), `status?`, `note?`, `description?`, `draft` (default false). Films: `videoUrl?`, `poster?` (image()). Builds: `cover?` (image()) + `coverAlt` (required with cover).
- Builds may be folders: `builds/<slug>/index.md` → id `<slug>`.
- Drafts are excluded everywhere (pages, RSS, sitemap) via `getPublished()` in `src/lib/content.ts`. Always fetch through it.
- Bracketed titles/text like `[First short film]` are placeholders. Keep them; never invent facts about Dimitri.

## Code conventions
- **Dates are UTC everywhere**: `getUTCFullYear()`, `toLocaleString(..., { timeZone: "UTC" })`. Helpers in `src/lib/format.ts` and `src/lib/work.ts`.
- **Every internal link goes through `withBase()`** (`src/lib/url.ts`), because the site is served under `base: "/portfolio"`. Never hard-code `href="/..."`.
- Kind ↔ collection mapping (`film` ↔ `films`, `build` ↔ `builds`) lives in `src/lib/content.ts`.
- Semantic, accessible HTML: real links/buttons, alt text, `aria-hidden` on decorative elements (e.g. `<Glyph decorative />` next to a visible label), visible focus styles, skip link, reduced-motion guard.

## Layout of the code
- `src/layouts/`: `BaseLayout` (head/meta/OG, footer), `ArticleLayout` (detail pages), `SectionLayout` (/writing, /films, /builds).
- `src/pages/`: `index.astro`, `{writing,films,builds}/index.astro` + `[slug].astro`, `about.astro`, `404.astro`, `rss.xml.ts`.
- `src/components/`: `Chapter`, `Entry`, `Glyph`, `KindKey`, `SiteHeader`, `SiteNav`, `SiteFooter`.

## Workflow
- `npm run dev` → http://localhost:4321/portfolio/ (restart after changing `content.config.ts` or `astro.config.ts`).
- Before committing: `npm run check` and `npm run build` must both pass with 0 errors and 0 warnings.
- One commit per task. Never push, create remotes or deploy without being asked.
- Docs: `WRITING.md` (adding content), `DEPLOY.md` (publishing).
