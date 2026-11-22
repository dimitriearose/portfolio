export type Kind = "writing" | "film" | "build";

/** One line on a contents page. */
export interface WorkItem {
    kind: Kind;
    title: string;
    date: Date;
    href: string;
    note?: string | undefined;
}
