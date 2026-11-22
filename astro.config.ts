import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import { sidenotes } from "./src/lib/sidenotes";

export default defineConfig({
    // ─── WHERE THE SITE LIVES ─────────────────────────────────────────────
    // GitHub Pages project site: https://<username>.github.io/<repo>/
    // ⚠ PLACEHOLDER: change "dimitriearose" to your GitHub username and
    //   "/portfolio" to your repository name if they differ.
    //
    // Moving to a custom domain later? Set site to "https://your-domain.com",
    // delete the base line, and add public/CNAME (see DEPLOY.md).
    site: "https://dimitriearose.github.io",
    base: "/portfolio",
    // ──────────────────────────────────────────────────────────────────────

    integrations: [sitemap()],

    markdown: {
        // Plain monochrome code blocks; Shiki's colour themes clash with the paper palette.
        syntaxHighlight: false,
        // Astro's default Markdown processor, configured so footnotes also
        // appear as notes in the right margin (src/lib/sidenotes.ts).
        processor: satteri({ hastPlugins: [sidenotes()] }),
    },

    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: "Literata",
            cssVariable: "--font-literata",
            weights: ["300 700"],
            styles: ["normal", "italic"],
        },
    ],
});
