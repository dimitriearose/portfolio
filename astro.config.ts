import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    // ─── PLACEHOLDER ──────────────────────────────────────────────────────
    // The site's public address. Used for canonical links, Open Graph tags,
    // the RSS feed and the sitemap. Replace before deploying.
    site: "https://example.com",
    // ──────────────────────────────────────────────────────────────────────

    integrations: [sitemap()],

    markdown: {
        // Plain monochrome code blocks; Shiki's colour themes clash with the paper palette.
        syntaxHighlight: false,
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
