/**
 * Prefixes a root-relative path with the site's `base` (set in astro.config.ts).
 * On GitHub Pages the site lives under /portfolio/, so "/about/" must become
 * "/portfolio/about/". With no base (a custom domain), paths are unchanged.
 * Use it for every internal link: withBase("/writing/").
 */
export function withBase(path: string): string {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * A view-transition-name for an entry's title, derived from its page path.
 * The contents row and the article heading share it, so the browser animates
 * one into the other when you navigate between them.
 */
export function titleTransitionName(href: string): string {
    return `title-${href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
}
