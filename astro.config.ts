import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
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