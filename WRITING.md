# Adding work to the site

Every essay, film and build is one Markdown file. The homepage, the section
pages, the RSS feed and the sitemap all update themselves. You never edit a
list by hand.

| Kind    | Folder                  | Appears at                |
| ------- | ----------------------- | ------------------------- |
| Essay   | `src/content/writing/`  | `/writing/<file-name>/`   |
| Film    | `src/content/films/`    | `/films/<file-name>/`     |
| Build   | `src/content/builds/`   | `/builds/<file-name>/`    |

The file name becomes the URL, so use lowercase words joined by hyphens:
`reading-godots-source.md` → `/writing/reading-godots-source/`.

## Fields every kind shares

| Field         | Required | What it does                                                        |
| ------------- | -------- | ------------------------------------------------------------------- |
| `title`       | yes      | The line on the contents page and the page heading.                 |
| `date`        | yes      | `YYYY-MM-DD`. Sets the year chapter and the month. Read as UTC.     |
| `status`      | no       | `finished`, `in-progress` or `on-the-bench`. Shown on the page.     |
| `note`        | no       | Short italic aside in the right-hand margin of the contents.        |
| `description` | no       | One sentence for search results, link previews and RSS.             |
| `draft`       | no       | `true` hides it everywhere (pages, RSS, sitemap). Default `false`.  |

Quote a title or note that starts with `[`, or contains `: `:
`title: "[First short film]"`.

## Essay

`src/content/writing/my-essay.md`

```md
---
title: My essay
date: 2026-12-03
status: in-progress
note: A line for the margin.
description: One sentence about what this essay is.
---

The essay, in Markdown.

## A section heading

> A quotation.
```

## Film

`src/content/films/my-film.md`

```md
---
title: My film
date: 2026-12-03
status: finished
note: "[Where it was shot.]"
videoUrl: https://www.youtube.com/watch?v=XXXXXXXXXXX
poster: ./my-film-poster.jpg
---

Notes on the film.
```

- `videoUrl` ending in `.mp4`, `.webm`, `.mov` or `.m4v` plays in a
  `<video>` player on the page. Any other address (YouTube, Vimeo) becomes
  a "Watch on …" link.
- `poster` is optional: an image file next to the Markdown file, used as
  the video's still before it plays.

## Build

A build can be a single file, or a **folder** when it has photos. The folder
name becomes the URL.

```
src/content/builds/
  simple-build.md
  my-amplifier/
    index.md          ← the write-up
    cover.jpg
    board-front.jpg
```

`src/content/builds/my-amplifier/index.md`

```md
---
title: My amplifier
date: 2026-12-03
status: on-the-bench
note: Waiting on parts.
cover: ./cover.jpg
coverAlt: The amplifier on the bench with its lid off.
---

The build log.

![The front of the board, with the power section on the left.](./board-front.jpg)
```

`cover` is optional. If you add one, `coverAlt` is required: describe the
photo for someone who can't see it.

## Images

- Put images next to the Markdown file and link them with `./`, as above.
  Astro resizes them and converts them to WebP when the site builds.
- Always write alt text inside the `![ ]`. Leave it empty (`![](./x.jpg)`)
  only for a purely decorative image.
- For a caption, use HTML inside the Markdown:
  ```html
  <figure>
    <img src="…" alt="…" />
    <figcaption>The caption.</figcaption>
  </figure>
  ```
  (Images inside raw HTML are **not** optimized. Prefer `![]()` with a
  short paragraph under it when you can.)

## Linking between entries

Use relative links, so they keep working whether the site is at
`/portfolio/` or on its own domain:

- to another essay: `[text](../other-essay/)`
- to a film from an essay: `[text](../../films/my-film/)`

## Previewing

```sh
npm run dev
```

Open **http://localhost:4321/portfolio/** (note the `/portfolio/`; it
matches the GitHub Pages address). The page reloads as you save.

- A new file appears straight away. If it doesn't, or after editing
  `src/content.config.ts`, stop the server (Ctrl-C) and start it again.
- Drafts are hidden in dev too. To preview one, set `draft: false` while
  you work and put it back before committing.
- If a field is wrong (a misspelled `status`, a missing `title`, a cover
  without alt text), the terminal and the browser show which file and field.

Before publishing:

```sh
npm run check   # types and frontmatter
npm run build   # the real site, in dist/
git add -A && git commit -m "Add my essay" && git push
```

Pushing to `main` deploys it (see DEPLOY.md).
