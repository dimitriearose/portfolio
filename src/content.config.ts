import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Fields every kind of work shares. */
const common = {
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(["finished", "in-progress", "on-the-bench"]).optional(),
    /** Short italic aside shown in the right-hand margin. */
    note: z.string().optional(),
    /** One-sentence summary for meta tags and the RSS feed. */
    description: z.string().optional(),
    /** Drafts are left out of every page, the RSS feed and the sitemap. */
    draft: z.boolean().default(false),
};

const writing = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
    schema: z.object(common),
});

const films = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/films" }),
    schema: ({ image }) =>
        z.object({
            ...common,
            videoUrl: z.url().optional(),
            poster: image().optional(),
        }),
});

const builds = defineCollection({
    // Builds can be a single file (my-build.md) or a folder (my-build/index.md)
    // with images next to it.
    loader: glob({ pattern: "**/*.md", base: "./src/content/builds" }),
    schema: ({ image }) =>
        z
            .object({
                ...common,
                cover: image().optional(),
                coverAlt: z.string().optional(),
            })
            .refine((data) => !data.cover || data.coverAlt, {
                message: "Add coverAlt (alt text) when a build has a cover image.",
                path: ["coverAlt"],
            }),
});

export const collections = { writing, films, builds };
