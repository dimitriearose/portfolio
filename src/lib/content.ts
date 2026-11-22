import { getCollection, type CollectionEntry } from "astro:content";
import type { Kind, WorkItem } from "../types";
import { sortNewestFirst } from "./work";
import { withBase } from "./url";

export type CollectionName = "writing" | "films" | "builds";
export type AnyEntry = CollectionEntry<CollectionName>;

/** Which collection holds each kind, and the URL section it lives under. */
export const collectionFor: Record<Kind, CollectionName> = {
    writing: "writing",
    film: "films",
    build: "builds",
};
export const kindOf: Record<CollectionName, Kind> = {
    writing: "writing",
    films: "film",
    builds: "build",
};

/** Published (non-draft) entries of one collection, newest first. */
export async function getPublished<C extends CollectionName>(
    collection: C,
): Promise<CollectionEntry<C>[]> {
    const entries = await getCollection(collection, ({ data }) => !data.draft);
    return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** An entry's page, e.g. /films/first-short-film/. */
export function entryPath(entry: AnyEntry): string {
    return withBase(`/${entry.collection}/${entry.id}/`);
}

export function toWorkItem(entry: AnyEntry): WorkItem {
    return {
        kind: kindOf[entry.collection],
        title: entry.data.title,
        date: entry.data.date,
        href: entryPath(entry),
        note: entry.data.note,
    };
}

/** Work items for the given collections, merged and sorted newest first. */
export async function getWorkItems(
    collections: CollectionName[] = ["writing", "films", "builds"],
): Promise<WorkItem[]> {
    const lists = await Promise.all(collections.map((c) => getPublished(c)));
    return sortNewestFirst(lists.flat().map(toWorkItem));
}
