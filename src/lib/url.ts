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
