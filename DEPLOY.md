# Deploying

The site is static: `npm run build` writes plain HTML, CSS and fonts into
`dist/`. It is set up to publish to **GitHub Pages** at

    https://dimitriearose.github.io/portfolio/

using Astro's official GitHub Action (`.github/workflows/deploy.yml`). Every
push to `main` rebuilds and republishes the site, usually within a minute
or two.

> **Check first:** `astro.config.ts` assumes your GitHub username is
> `dimitriearose` and the repository is called `portfolio`. If either is
> different, change `site` and `base` there before pushing. Repository names
> on GitHub Pages are case-sensitive in the URL.

---

## 1. Create the GitHub repository and push

1. Make sure everything builds locally:
   ```sh
   npm run check
   npm run build
   ```
2. On GitHub, click **+ → New repository**.
   - **Repository name:** `portfolio` (must match `base` in `astro.config.ts`)
   - **Visibility:** Public. GitHub Pages on a free account needs a public
     repository.
   - Leave **Add a README**, **.gitignore** and **license** unticked. The
     repository must start empty, or the first push will be rejected.
3. Click **Create repository**, then in Terminal, from the project folder:
   ```sh
   git remote add origin https://github.com/dimitriearose/portfolio.git
   git branch -M main
   git push -u origin main
   ```
   (If you use SSH keys with GitHub, use
   `git@github.com:dimitriearose/portfolio.git` instead.)

## 2. Turn on GitHub Pages

1. In the repository, open **Settings → Pages** (in the left sidebar under
   "Code and automation").
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
   There's nothing else to set. The workflow file already describes the build.

## 3. Check the first deploy

1. Open the **Actions** tab. The push in step 1 will have started a run
   called **Deploy to GitHub Pages**. If it failed because Pages wasn't
   turned on yet, open the run and click **Re-run all jobs**. You can also
   start a fresh run from **Actions → Deploy to GitHub Pages → Run workflow**.
2. Wait for both jobs, **build** and **deploy**, to show a green tick.
3. Click the URL shown under the **deploy** job (also listed in
   **Settings → Pages**) and check:
   - the homepage shows the contents list in Literata (not a fallback serif)
   - clicking an entry, a nav link and "← Contents" all work
   - `…/portfolio/rss.xml` and `…/portfolio/sitemap-index.xml` load
   - a made-up address like `…/portfolio/nope/` shows the site's own 404 page

If pages load but have no styling, or links go to `dimitriearose.github.io/about/`
without `/portfolio/`, then `base` in `astro.config.ts` doesn't match the
repository name.

After that, publishing is just:
```sh
git push
```

## 4. Add a custom domain later

Do these in order. Adding the domain on GitHub **before** touching DNS stops
anyone else from claiming it on GitHub Pages.

1. **On GitHub:** **Settings → Pages → Custom domain**, enter your domain
   (e.g. `example.com`) and click **Save**.
2. **At your domain registrar / DNS provider**, add these records:

   For the bare domain (`example.com`), name/host `@`:

   | Type | Value                |
   | ---- | -------------------- |
   | A    | `185.199.108.153`    |
   | A    | `185.199.109.153`    |
   | A    | `185.199.110.153`    |
   | A    | `185.199.111.153`    |
   | AAAA | `2606:50c0:8000::153` |
   | AAAA | `2606:50c0:8001::153` |
   | AAAA | `2606:50c0:8002::153` |
   | AAAA | `2606:50c0:8003::153` |

   For `www`:

   | Type  | Name  | Value                    |
   | ----- | ----- | ------------------------ |
   | CNAME | `www` | `dimitriearose.github.io` |

   (Use your username only, with no `/portfolio`. Don't add wildcard records
   like `*.example.com`.) With both set up, GitHub redirects between
   `example.com` and `www.example.com` for you.
3. **In the project:**
   - `astro.config.ts`: set `site: "https://example.com"` and **delete the
     `base` line**. Every internal link goes through `withBase()`
     (`src/lib/url.ts`), so nothing else needs editing.
   - Create `public/CNAME` containing just the domain, on one line:
     ```
     example.com
     ```
   - Run `npm run build`, commit, and `git push`.
4. **Back on GitHub:** once the DNS check in **Settings → Pages** passes,
   tick **Enforce HTTPS**. DNS changes and the HTTPS certificate can each
   take up to 24 hours.

---

## Alternative: Cloudflare Pages

Cloudflare can host the same `dist/` folder, with preview URLs for every
branch. If you go this way, you don't need the GitHub Pages workflow.

1. In `astro.config.ts`, set `site` to the address Cloudflare gives you
   (e.g. `https://portfolio.pages.dev`, or your own domain) and **delete the
   `base` line**. Cloudflare serves the site from the domain root.
2. Push the repository to GitHub (step 1 above).
3. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, and pick the repository.
4. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION` = `24`
5. **Save and Deploy.** Later pushes to `main` deploy automatically. A
   custom domain is added under the project's **Custom domains** tab, and
   Cloudflare sets the DNS records for you if the domain is on Cloudflare.
6. Optionally delete `.github/workflows/deploy.yml` so GitHub doesn't
   build the site as well.

> Cloudflare now recommends **Workers** (with static assets) over Pages for
> new projects, and Astro's Cloudflare guide covers that route: it uses
> `wrangler` and a `wrangler.jsonc` pointing at `./dist`. Both work for a
> fully static site like this one. Pages needs no extra files, which is
> why it's described here.
