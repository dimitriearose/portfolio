import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * An optional field that may also be left blank. Obsidian saves a property
 * you haven't filled in as empty (null), so treat null and "" as "not set".
 */
const blankable = <T extends z.ZodType>(schema: T) =>
    z.preprocess((value) => (value === null || value === "" ? undefined : value), schema.optional());

/** Fields every kind of work shares. */
const common = {
    title: z.string().min(1, "Give the entry a title."),
    date: z.coerce.date(),
    status: blankable(z.enum(["finished", "in-progress", "on-the-bench"])),
    /** Short italic aside shown in the right-hand margin. */
    note: blankable(z.string()),
    /** One-sentence summary for meta tags and the RSS feed. */
    description: blankable(z.string()),
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
            videoUrl: blankable(z.url()),
            poster: blankable(image()),
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
                cover: blankable(image()),
                coverAlt: blankable(z.string()),
            })
            .refine((data) => !data.cover || data.coverAlt, {
                message: "Add coverAlt (alt text) when a build has a cover image.",
                path: ["coverAlt"],
            }),
});

export const collections = { writing, films, builds };
