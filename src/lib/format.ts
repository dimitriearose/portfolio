/** "November 2026", always in UTC so the build machine's timezone never shifts a date. */
export function formatMonthYear(date: Date): string {
    return date.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** "2026-11-01", for <time datetime>. */
export function isoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export const statusLabel = {
    finished: "Finished",
    "in-progress": "In progress",
    "on-the-bench": "On the bench",
} as const;
