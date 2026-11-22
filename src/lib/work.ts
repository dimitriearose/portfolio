import type { WorkItem } from "../types";

/** Newest first. Returns a new array. */
export function sortNewestFirst<T extends { date: Date }>(items: T[]): T[] {
    return [...items].sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Groups already-sorted items by UTC year, keeping their order. */
export function groupByYear(items: WorkItem[]): { year: number; items: WorkItem[] }[] {
    const chapters: { year: number; items: WorkItem[] }[] = [];
    for (const item of items) {
        const year = item.date.getUTCFullYear();
        const last = chapters.at(-1);
        if (last && last.year === year) last.items.push(item);
        else chapters.push({ year, items: [item] });
    }
    return chapters;
}
