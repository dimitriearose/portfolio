import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
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