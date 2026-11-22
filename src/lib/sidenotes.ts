/**
 * Turns Markdown footnotes into margin sidenotes.
 *
 * Markdown footnotes (`text[^1]` … `[^1]: the note`) normally render as a
 * numbered list at the end of the article. This plugin keeps that list and
 * also places a copy of each note, as <span class="sidenote">, right after
 * the reference in the text. CSS (global.css, "Footnotes") decides which shows:
 *   - wide screens: the sidenote floats into the right margin, list hidden
 *   - narrow screens: sidenotes hidden, list at the end as usual
 * The hidden one is display:none, so screen readers only meet one copy.
 *
 * It's a plugin for Sätteri, Astro's Markdown processor, and works on the
 * HTML tree after Markdown is converted. Registered in astro.config.ts.
 */
import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";

type HastPlugin = NonNullable<SatteriProcessorOptions["hastPlugins"]>[number];

// The few fields of an HTML-tree node this plugin reads.
interface HtmlNode {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: HtmlNode[];
    value?: string;
}

const isElement = (node: HtmlNode, tag: string) =>
    node.type === "element" && node.tagName === tag;

const has = (node: HtmlNode, property: string) =>
    node.properties !== undefined && property in node.properties;

/** Depth-first search for the first node matching `test`. */
function find(node: HtmlNode, test: (n: HtmlNode) => boolean): HtmlNode | undefined {
    if (test(node)) return node;
    for (const child of node.children ?? []) {
        const hit = find(child, test);
        if (hit) return hit;
    }
    return undefined;
}

/** Plain text of a node, e.g. the "1" inside a footnote reference. */
function textOf(node: HtmlNode): string {
    return node.value ?? (node.children ?? []).map(textOf).join("");
}

/** footnote id → the note's content as inline nodes (paragraphs joined by <br>). */
function collectNotes(section: HtmlNode): Map<string, HtmlNode[]> {
    const notes = new Map<string, HtmlNode[]>();
    const items: HtmlNode[] = [];
    const gather = (n: HtmlNode) => {
        if (isElement(n, "li") && typeof n.properties?.id === "string") items.push(n);
        n.children?.forEach(gather);
    };
    gather(section);

    for (const item of items) {
        const inline: HtmlNode[] = [];
        const paragraphs = (item.children ?? []).filter((c) => isElement(c, "p"));
        paragraphs.forEach((p, i) => {
            if (i > 0) inline.push({ type: "element", tagName: "br", properties: {}, children: [] });
            for (const child of p.children ?? []) {
                // Drop the "↩" link back to the text; it makes no sense in the margin.
                if (isElement(child, "a") && has(child, "dataFootnoteBackref")) continue;
                inline.push(structuredClone(child));
            }
        });
        // Trim the space that sat before the dropped "↩" link.
        const last = inline.at(-1);
        if (last?.type === "text" && last.value) last.value = last.value.trimEnd();
        notes.set(item.properties!.id as string, inline);
    }
    return notes;
}

export function sidenotes(): HastPlugin {
    // Filled once per document in `before`, then read by the <sup> visitor.
    let notes = new Map<string, HtmlNode[]>();

    return {
        name: "sidenotes",
        before(root) {
            const tree = root as unknown as HtmlNode;
            const section = find(tree, (n) => isElement(n, "section") && has(n, "dataFootnotes"));
            notes = section ? collectNotes(section) : new Map();
        },
        element: {
            filter: ["sup"],
            visit(node, ctx) {
                if (notes.size === 0) return;
                const sup = node as unknown as HtmlNode;
                const ref = find(sup, (n) => isElement(n, "a") && has(n, "dataFootnoteRef"));
                const href = ref?.properties?.href;
                if (!ref || typeof href !== "string") return;
                const content = notes.get(href.replace(/^#/, ""));
                if (!content) return;

                const sidenote = {
                    type: "element",
                    tagName: "span",
                    properties: { className: ["sidenote"], role: "note" },
                    children: [
                        {
                            type: "element",
                            tagName: "span",
                            properties: { className: ["sidenote-number"] },
                            children: [{ type: "text", value: textOf(ref) }],
                        },
                        { type: "text", value: " " },
                        ...content,
                    ],
                };
                ctx.insertAfter(node, sidenote as unknown as Parameters<typeof ctx.insertAfter>[1]);
            },
        },
    } as HastPlugin;
}
