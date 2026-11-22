import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublished, entryPath, type AnyEntry } from "../lib/content";
import { withBase } from "../lib/url";

export async function GET(context: APIContext) {
    const lists = await Promise.all([
        getPublished("writing"),
        getPublished("films"),
        getPublished("builds"),
    ]);
    const entries: AnyEntry[] = lists
        .flat()
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    return rss({
        title: "Dimitri",
        description: "Everything Dimitri writes, films and builds.",
        // The feed's home link, including the base path (e.g. /portfolio/).
        site: new URL(withBase("/"), context.site),
        items: entries.map((entry) => ({
            title: entry.data.title,
            pubDate: entry.data.date,
            description: entry.data.description ?? entry.data.note,
            link: entryPath(entry),
            categories: [entry.collection],
        })),
    });
}
